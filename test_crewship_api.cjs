#!/usr/bin/env node

/**
 * CREWSHIP API TESTING SCRIPT
 * Tests all CrewShip endpoints and agent functionality
 */

const https = require('https');
const fs = require('fs');

const config = {
  apiKey: 'cs_live_9667b028dac57da01d87c3c37d42ab44d3af63751ad439cd5780c436a3cd6682',
  enterpriseAuth: 'PK_05afd07d30275d7030e5172dedb0426b',
  crewName: 'the-big-family-legacy-crew',
  productionUrl: 'https://3b726bb0.the-big-family-legacy.pages.dev'
};

function makeRequest(url, options, data = null) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const reqOptions = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = https.request(reqOptions, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            body: body ? JSON.parse(body) : null
          });
        } catch {
          resolve({
            statusCode: res.statusCode,
            body: body
          });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(typeof data === 'string' ? data : JSON.stringify(data));
    req.end();
  });
}

async function testProductionAPI() {
  console.log('\n🧪 Testing Production API Endpoints');
  console.log('='.repeat(60));
  
  const tests = [];
  
  // Test 1: Health Check
  try {
    const health = await makeRequest(`${config.productionUrl}/api/health`, {});
    tests.push({
      name: 'Health Endpoint',
      status: health.statusCode === 200 ? 'PASS' : 'FAIL',
      response: health.body
    });
    console.log(`✓ Health Check: ${health.body?.status || 'N/A'}`);
  } catch (error) {
    tests.push({
      name: 'Health Endpoint',
      status: 'FAIL',
      error: error.message
    });
    console.log(`✗ Health Check Failed: ${error.message}`);
  }
  
  // Test 2: CrewShip Config Endpoint
  try {
    const crew = await makeRequest(`${config.productionUrl}/api/crew/config`, {});
    tests.push({
      name: 'CrewShip Config',
      status: crew.statusCode === 200 ? 'PASS' : 'FAIL',
      response: crew.body
    });
    console.log(`✓ CrewShip Config: ${crew.body?.agents?.length || 0} agents`);
  } catch (error) {
    tests.push({
      name: 'CrewShip Config',
      status: 'FAIL',
      error: error.message
    });
    console.log(`✗ CrewShip Config Failed: ${error.message}`);
  }
  
  // Test 3: LangSmith Workflow Endpoint
  try {
    const workflow = await makeRequest(`${config.productionUrl}/api/langsmith/workflow`, {});
    tests.push({
      name: 'LangSmith Workflow',
      status: workflow.statusCode === 200 ? 'PASS' : 'FAIL',
      response: workflow.body
    });
    console.log(`✓ LangSmith Workflow: ${workflow.body?.nodes?.length || 0} nodes`);
  } catch (error) {
    tests.push({
      name: 'LangSmith Workflow',
      status: 'FAIL',
      error: error.message
    });
    console.log(`✗ LangSmith Workflow Failed: ${error.message}`);
  }
  
  return tests;
}

async function testCrewShipAgents() {
  console.log('\n🤖 Testing CrewShip Agents');
  console.log('='.repeat(60));
  
  const testMemory = {
    type: 'text',
    content: 'Ayah saya lahir tahun 1950 di Jakarta. Beliau seorang guru yang mengabdi selama 30 tahun.',
    metadata: {
      uploadedBy: 'test-user',
      timestamp: new Date().toISOString()
    }
  };
  
  try {
    // Test memory analysis endpoint
    const response = await makeRequest(
      `${config.productionUrl}/api/memories/analyze`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        }
      },
      testMemory
    );
    
    console.log(`Status: ${response.statusCode}`);
    console.log('Response:', JSON.stringify(response.body, null, 2));
    
    return {
      status: response.statusCode === 200 ? 'PASS' : 'FAIL',
      response: response.body
    };
    
  } catch (error) {
    console.log(`✗ Agent Test Failed: ${error.message}`);
    return {
      status: 'FAIL',
      error: error.message
    };
  }
}

async function main() {
  console.log('\n' + '='.repeat(60));
  console.log('CREWSHIP API TESTING SUITE');
  console.log('='.repeat(60));
  console.log(`Production URL: ${config.productionUrl}`);
  console.log(`Crew Name: ${config.crewName}`);
  console.log('='.repeat(60));
  
  const results = {
    timestamp: new Date().toISOString(),
    productionTests: await testProductionAPI(),
    agentTests: await testCrewShipAgents()
  };
  
  // Save results
  fs.writeFileSync(
    './crewship-test-results.json',
    JSON.stringify(results, null, 2)
  );
  
  console.log('\n' + '='.repeat(60));
  console.log('TEST SUMMARY');
  console.log('='.repeat(60));
  
  const passed = results.productionTests.filter(t => t.status === 'PASS').length;
  const total = results.productionTests.length;
  
  console.log(`API Tests: ${passed}/${total} passed`);
  console.log(`Agent Test: ${results.agentTests.status}`);
  console.log(`\nResults saved to: crewship-test-results.json`);
  console.log('='.repeat(60) + '\n');
}

main().catch(console.error);
