
# CREWSHIP DEPLOYMENT INSTRUCTIONS

## Prerequisites
- CrewShip API Key: ✅ Configured
- CrewAI PAT: ✅ Configured

## Deployment Options

### Option 1: Via CrewShip Dashboard (Recommended)
1. Go to https://app.crewship.dev
2. Create new Project: "the-big-family-legacy"
3. Upload crew-config.json
4. Deploy to production

### Option 2: Via CrewShip API
```bash
curl -X POST https://api.crewship.dev/v1/crews \
  -H "Authorization: Bearer cs_live_9667b028dac57da01d87c3c37d42ab44d3af63751ad439cd5780c436a3cd6682" \
  -H "Content-Type: application/json" \
  -d @crew-config.json
```

### Option 3: Via CrewShip CLI
```bash
npm install -g @crewship/cli
crewship login --api-key cs_live_9667b028dac57da01d87c3c37d42ab44d3af63751ad439cd5780c436a3cd6682
crewship deploy crew-config.json
```

## Environment Variables Required
Add these to CrewShip deployment:
- SUPABASE_URL
- SUPABASE_SERVICE_KEY
- OPENAI_API_KEY (for embeddings)
- LANGSMITH_API_KEY (for tracing)

## Testing After Deployment
```bash
curl -X POST https://api.crewship.dev/v1/crews/the-big-family-legacy/run \
  -H "Authorization: Bearer cs_live_9667b028dac57da01d87c3c37d42ab44d3af63751ad439cd5780c436a3cd6682" \
  -H "Content-Type: application/json" \
  -d '{
    "task": "Analyze photo",
    "inputs": {
      "file_url": "https://example.com/photo.jpg",
      "file_type": "photo"
    }
  }'
```
