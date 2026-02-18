#!/usr/bin/env node
/**
 * THE BIG FAMILY LEGACY - CrewShip API Deployment
 * Deploy agents directly to CrewShip dashboard via API
 */

const https = require('https');
const fs = require('fs');

// Load credentials
const CREWSHIP_API_KEY = 'cs_live_9667b028dac57da01d87c3c37d42ab44d3af63751ad439cd5780c436a3cd6682';
const CREW_AI_PAT = 'pat_BKrEAmVX44eeaZaMIwhGURmHCU-ouDBgounQ02lvq-M';
const CREW_AI_ENTERPRISE = 'PK_05afd07d30275d7030e5172dedb0426b';

console.log('\n' + '='.repeat(70));
console.log('  CREWSHIP DEPLOYMENT VIA API');
console.log('='.repeat(70) + '\n');

// Agent definitions
const agents = [
  {
    name: 'Family Historian',
    role: 'genealogy_expert',
    goal: 'Extract family relationships and genealogy data from memories',
    backstory: 'Expert genealogist with decades of experience in family tree research and historical document analysis',
    tools: ['vision_analysis', 'text_extraction', 'date_parser', 'relationship_mapper'],
    verbose: true,
    allow_delegation: false
  },
  {
    name: 'Story Weaver',
    role: 'narrative_writer',
    goal: 'Create compelling and emotionally resonant family stories from memories',
    backstory: 'Creative writer specializing in family history narratives with deep understanding of cultural contexts',
    tools: ['llm_generator', 'memory_search', 'timeline_builder', 'sentiment_analyzer'],
    verbose: true,
    allow_delegation: false
  },
  {
    name: 'Memory Analyzer',
    role: 'vision_specialist',
    goal: 'Analyze photos, videos, and documents to extract rich contextual metadata',
    backstory: 'Computer vision expert specializing in historical photo analysis and OCR of old documents',
    tools: ['vision_model', 'ocr', 'face_recognition', 'date_estimator'],
    verbose: true,
    allow_delegation: false
  }
];

// Crew configuration
const crewPayload = {
  name: 'the-big-family-legacy-crew',
  description: 'AI crew for processing family memories and generating legacy stories',
  agents: agents,
  tasks: [
    {
      description: 'Analyze uploaded memory (photo, video, or document) and extract all visible metadata including dates, locations, people, and events',
      expected_output: 'Structured JSON with metadata: {dates: [], locations: [], people: [], events: [], sentiment: string}',
      agent: 'Memory Analyzer'
    },
    {
      description: 'Extract and map family relationships from the analyzed memory, identifying parent-child, sibling, and spouse connections',
      expected_output: 'List of family relationships: [{person1: string, person2: string, relationship_type: string, confidence: float}]',
      agent: 'Family Historian',
      context: ['Previous task output']
    },
    {
      description: 'Generate a compelling narrative story that connects the memory to broader family history with emotional depth',
      expected_output: 'Rich narrative text (300-500 words) with historical context and family connections',
      agent: 'Story Weaver',
      context: ['All previous task outputs']
    }
  ],
  process: 'sequential',
  memory: true,
  cache: true,
  max_rpm: 10,
  verbose: 2,
  embedder: {
    provider: 'openai',
    config: {
      model: 'text-embedding-3-small',
      dimensions: 1536
    }
  }
};

function makeRequest(hostname, path, method, headers, data) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: hostname,
      path: path,
      method: method,
      headers: headers
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, body: parsed, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, body: body, headers: res.headers });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function deployToCrewShip() {
  console.log('🚀 Deploying to CrewShip API...\n');

  try {
    // Create crew via API
    console.log('📤 Creating crew: the-big-family-legacy-crew');
    const result = await makeRequest(
      'api.crewship.dev',
      '/v1/crews',
      'POST',
      {
        'Authorization': `Bearer ${CREWSHIP_API_KEY}`,
        'Content-Type': 'application/json',
        'X-API-Key': CREW_AI_PAT
      },
      crewPayload
    );

    console.log(`\n📊 Response Status: ${result.status}`);
    
    if (result.status === 200 || result.status === 201) {
      console.log('✅ SUCCESS! Crew deployed to CrewShip!');
      console.log('\n📋 Crew Details:');
      console.log(JSON.stringify(result.body, null, 2));
      
      // Save response
      fs.writeFileSync('.crewship-deployment-response.json', JSON.stringify(result.body, null, 2));
      console.log('\n💾 Response saved to: .crewship-deployment-response.json');
      
      return true;
    } else {
      console.log('⚠️  Response:', JSON.stringify(result.body, null, 2));
      
      // Try alternative endpoint
      console.log('\n🔄 Trying alternative endpoint...');
      const altResult = await makeRequest(
        'console.crewship.dev',
        '/api/v1/crews',
        'POST',
        {
          'Authorization': `Bearer ${CREWSHIP_API_KEY}`,
          'Content-Type': 'application/json'
        },
        crewPayload
      );
      
      console.log(`📊 Alternative Response Status: ${altResult.status}`);
      console.log(JSON.stringify(altResult.body, null, 2));
      
      return false;
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    return false;
  }
}

async function testCrewShipAPI() {
  console.log('\n🧪 Testing CrewShip API Connection...\n');
  
  try {
    // Test API key
    const result = await makeRequest(
      'api.crewship.dev',
      '/v1/crews',
      'GET',
      {
        'Authorization': `Bearer ${CREWSHIP_API_KEY}`,
        'Content-Type': 'application/json'
      },
      null
    );

    console.log(`📊 API Test Status: ${result.status}`);
    
    if (result.status === 200) {
      console.log('✅ API Key Valid!');
      console.log('📋 Existing Crews:', JSON.stringify(result.body, null, 2));
    } else {
      console.log('⚠️  Response:', JSON.stringify(result.body, null, 2));
    }
    
    return result.status === 200;
  } catch (error) {
    console.error('❌ Connection Error:', error.message);
    return false;
  }
}

async function main() {
  console.log('Starting CrewShip Deployment Process...\n');
  
  // Test API connection first
  const apiOk = await testCrewShipAPI();
  
  if (!apiOk) {
    console.log('\n⚠️  API test failed. Saving configuration for manual deployment...');
    fs.writeFileSync('crewship-payload.json', JSON.stringify(crewPayload, null, 2));
    console.log('💾 Saved to: crewship-payload.json');
    console.log('\n📖 Manual Deployment Instructions:');
    console.log('1. Go to https://console.crewship.dev');
    console.log('2. Login with your account');
    console.log('3. Create new crew and import crewship-payload.json');
    console.log('4. Or use curl:');
    console.log(`   curl -X POST https://api.crewship.dev/v1/crews \\`);
    console.log(`        -H "Authorization: Bearer ${CREWSHIP_API_KEY}" \\`);
    console.log(`        -H "Content-Type: application/json" \\`);
    console.log(`        -d @crewship-payload.json`);
    return 1;
  }
  
  // Deploy crew
  const deployed = await deployToCrewShip();
  
  console.log('\n' + '='.repeat(70));
  if (deployed) {
    console.log('  ✅ CREWSHIP DEPLOYMENT COMPLETE!');
  } else {
    console.log('  ⚠️  DEPLOYMENT SAVED FOR MANUAL UPLOAD');
  }
  console.log('='.repeat(70) + '\n');
  
  return deployed ? 0 : 1;
}

// Run
if (require.main === module) {
  main().then(process.exit);
}

module.exports = { deployToCrewShip, testCrewShipAPI, crewPayload };
