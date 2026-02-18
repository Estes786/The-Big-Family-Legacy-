#!/usr/bin/env node
/**
 * THE BIG FAMILY LEGACY - AI Services Deployment Script
 * Deploy CrewShip and LangSmith configurations
 * 
 * Usage: node deploy_ai_services.js
 */

const https = require('https');
const fs = require('fs');

// Load credentials from .dev.vars
const envContent = fs.readFileSync('.dev.vars', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([A-Z_]+)=(.*)$/);
  if (match) {
    env[match[1]] = match[2];
  }
});

console.log('\n' + '='.repeat(70));
console.log('  THE BIG FAMILY LEGACY - AI SERVICES DEPLOYMENT');
console.log('='.repeat(70) + '\n');

// Agent Configurations
const agents = [
  {
    name: 'Family Historian',
    role: 'genealogy_expert',
    goal: 'Extract family relationships and genealogy data from memories',
    backstory: 'Expert genealogist with decades of experience in family tree research',
    tools: ['vision_analysis', 'text_extraction', 'date_parser']
  },
  {
    name: 'Story Weaver',
    role: 'narrative_writer',
    goal: 'Create compelling family stories from memories and relationships',
    backstory: 'Creative writer specializing in family history narratives',
    tools: ['llm_generator', 'memory_search', 'timeline_builder']
  },
  {
    name: 'Memory Analyzer',
    role: 'vision_specialist',
    goal: 'Analyze photos and videos to extract context and metadata',
    backstory: 'Computer vision expert specializing in historical photo analysis',
    tools: ['vision_model', 'ocr', 'face_recognition']
  }
];

// LangSmith Workflow Configuration
const langsmithWorkflow = {
  name: 'family-legacy-processing',
  description: 'Multi-agent workflow for processing family memories',
  nodes: [
    {
      id: 'memory_upload',
      type: 'input',
      config: {
        schema: {
          type: 'object',
          properties: {
            file_url: { type: 'string' },
            file_type: { type: 'string', enum: ['photo', 'video', 'document', 'audio'] },
            uploader_id: { type: 'string' },
            description: { type: 'string' }
          }
        }
      }
    },
    {
      id: 'analyze_memory',
      type: 'agent',
      agent: 'Memory Analyzer',
      config: {
        task: 'Analyze uploaded memory and extract metadata'
      }
    },
    {
      id: 'extract_relationships',
      type: 'agent', 
      agent: 'Family Historian',
      config: {
        task: 'Identify family members and relationships in the memory'
      }
    },
    {
      id: 'generate_story',
      type: 'agent',
      agent: 'Story Weaver',
      config: {
        task: 'Create narrative from memory and relationships'
      }
    },
    {
      id: 'output',
      type: 'output',
      config: {
        format: 'json',
        schema: {
          metadata: 'object',
          relationships: 'array',
          story: 'string',
          timeline_events: 'array'
        }
      }
    }
  ],
  edges: [
    { from: 'memory_upload', to: 'analyze_memory' },
    { from: 'analyze_memory', to: 'extract_relationships' },
    { from: 'extract_relationships', to: 'generate_story' },
    { from: 'generate_story', to: 'output' }
  ]
};

// CrewAI Configuration
const crewConfig = {
  name: 'the-big-family-legacy-crew',
  description: 'AI crew for processing family memories and generating stories',
  agents: agents,
  tasks: [
    {
      description: 'Analyze uploaded memory (photo/video/document)',
      agent: 'Memory Analyzer',
      expected_output: 'Structured metadata with dates, locations, people identified'
    },
    {
      description: 'Extract family relationships from analyzed memory',
      agent: 'Family Historian',
      expected_output: 'List of family members and their relationships'
    },
    {
      description: 'Generate compelling family story from memory and relationships',
      agent: 'Story Weaver',
      expected_output: 'Narrative text connecting memory to family history'
    }
  ],
  process: 'sequential',
  memory: true,
  embedder: {
    provider: 'openai',
    config: {
      model: 'text-embedding-3-small'
    }
  }
};

// Function to make HTTP request
function makeRequest(options, data) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, body: body });
        }
      });
    });
    
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function deployLangSmith() {
  console.log('📊 Deploying to LangSmith...\n');
  
  // Create config file
  const config = {
    api_key: env.LANGSMITH_API_KEY,
    project: env.LANGSMITH_PROJECT || 'the-big-family-legacy',
    tracing: true,
    agents: agents,
    workflow: langsmithWorkflow
  };
  
  fs.writeFileSync('.langsmith-config.json', JSON.stringify(config, null, 2));
  fs.writeFileSync('.langsmith-workflow.json', JSON.stringify(langsmithWorkflow, null, 2));
  
  console.log('✅ LangSmith Configuration Files Created:');
  console.log('   - .langsmith-config.json');
  console.log('   - .langsmith-workflow.json');
  console.log(`   - Project: ${config.project}`);
  console.log(`   - Agents: ${agents.length}`);
  console.log(`   - Workflow Nodes: ${langsmithWorkflow.nodes.length}\n`);
  
  return true;
}

async function deployCrewAI() {
  console.log('🤖 Deploying to CrewAI/CrewShip...\n');
  
  // Create CrewAI config file
  fs.writeFileSync('crew-config.json', JSON.stringify(crewConfig, null, 2));
  
  console.log('✅ CrewAI Configuration Created:');
  console.log('   - crew-config.json');
  console.log(`   - Crew: ${crewConfig.name}`);
  console.log(`   - Agents: ${crewConfig.agents.length}`);
  console.log(`   - Tasks: ${crewConfig.tasks.length}`);
  console.log(`   - Process: ${crewConfig.process}\n`);
  
  // Create deployment instructions
  const instructions = `
# CREWSHIP DEPLOYMENT INSTRUCTIONS

## Prerequisites
- CrewShip API Key: ${env.CREWSHIP_API_KEY ? '✅ Configured' : '❌ Missing'}
- CrewAI PAT: ${env.CREW_AI_PAT ? '✅ Configured' : '❌ Missing'}

## Deployment Options

### Option 1: Via CrewShip Dashboard (Recommended)
1. Go to https://app.crewship.dev
2. Create new Project: "the-big-family-legacy"
3. Upload crew-config.json
4. Deploy to production

### Option 2: Via CrewShip API
\`\`\`bash
curl -X POST https://api.crewship.dev/v1/crews \\
  -H "Authorization: Bearer ${env.CREWSHIP_API_KEY}" \\
  -H "Content-Type: application/json" \\
  -d @crew-config.json
\`\`\`

### Option 3: Via CrewShip CLI
\`\`\`bash
npm install -g @crewship/cli
crewship login --api-key ${env.CREWSHIP_API_KEY}
crewship deploy crew-config.json
\`\`\`

## Environment Variables Required
Add these to CrewShip deployment:
- SUPABASE_URL
- SUPABASE_SERVICE_KEY
- OPENAI_API_KEY (for embeddings)
- LANGSMITH_API_KEY (for tracing)

## Testing After Deployment
\`\`\`bash
curl -X POST https://api.crewship.dev/v1/crews/the-big-family-legacy/run \\
  -H "Authorization: Bearer ${env.CREWSHIP_API_KEY}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "task": "Analyze photo",
    "inputs": {
      "file_url": "https://example.com/photo.jpg",
      "file_type": "photo"
    }
  }'
\`\`\`
`;
  
  fs.writeFileSync('CREWSHIP_DEPLOYMENT.md', instructions);
  console.log('✅ Deployment Guide Created: CREWSHIP_DEPLOYMENT.md\n');
  
  return true;
}

// Main execution
async function main() {
  try {
    console.log('🚀 Starting AI Services Deployment...\n');
    
    // Check required env vars
    const required = ['LANGSMITH_API_KEY', 'CREWSHIP_API_KEY', 'CREW_AI_PAT'];
    const missing = required.filter(key => !env[key]);
    
    if (missing.length > 0) {
      console.log('⚠️  Missing Environment Variables:');
      missing.forEach(key => console.log(`   - ${key}`));
      console.log('\n💡 Please add them to .dev.vars file\n');
    }
    
    // Deploy LangSmith
    await deployLangSmith();
    
    // Deploy CrewAI
    await deployCrewAI();
    
    console.log('='.repeat(70));
    console.log('  ✅ AI SERVICES DEPLOYMENT COMPLETE!');
    console.log('='.repeat(70) + '\n');
    
    console.log('📋 Next Steps:');
    console.log('  1. Review configuration files created');
    console.log('  2. Deploy to CrewShip dashboard or API');
    console.log('  3. Test agents via LangSmith dashboard');
    console.log('  4. Monitor traces at https://smith.langchain.com\n');
    
    console.log('='.repeat(70) + '\n');
    
    return 0;
  } catch (error) {
    console.error('\n❌ Deployment Error:', error.message);
    console.error(error.stack);
    return 1;
  }
}

// Run if executed directly
if (require.main === module) {
  main().then(process.exit);
}

module.exports = { deployLangSmith, deployCrewAI, agents, langsmithWorkflow, crewConfig };
