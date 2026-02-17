# 🚀 NORTHFLANK DEPLOYMENT GUIDE
## THE BIG FAMILY LEGACY - AI Agents Backend

## Overview
Deploy Python AI agents (CrewAI + LangChain) to Northflank for scalable backend processing.

---

## Prerequisites

✅ **Credentials Configured** (in `.dev.vars`):
- Northflank API Token: `nf-eyJh...`
- Supabase credentials
- LangChain API keys
- CrewAI tokens
- HuggingFace token (for AI models)

✅ **GitHub Repository**: `https://github.com/Estes786/The-Big-Family-Legacy-.git`

---

## Deployment Options

### OPTION 1: Northflank Dashboard (RECOMMENDED ✅)

**Step 1: Create New Service**
1. Go to: https://app.northflank.com/
2. Select project: `hyydarr` (or create new project: `the-big-family-legacy`)
3. Click "Create Service" → "Deployment"

**Step 2: Configure Source**
- **Source Type**: GitHub Repository
- **Repository**: `Estes786/The-Big-Family-Legacy-`
- **Branch**: `main`
- **Dockerfile Path**: `./Dockerfile`

**Step 3: Configure Build**
- **Build Context**: `/`
- **Dockerfile**: Use existing `Dockerfile` in repo
- **Build Arguments**: None required

**Step 4: Configure Runtime**
- **Service Name**: `ai-agents-backend`
- **Port**: `8000`
- **Health Check Path**: `/health`
- **Protocol**: HTTP
- **Resources**:
  - CPU: 0.5 vCPU (min) → 2 vCPU (max)
  - Memory: 512 MB (min) → 2 GB (max)

**Step 5: Environment Variables** (Critical! ⚠️)

Copy from `.dev.vars`:

```bash
# Database
SUPABASE_URL=https://ywgyxsufaaxbfjudcdhp.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# AI Models
HF_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx

# LangChain
LANGCHAIN_WORKFLOW_PAT=lsv2_pt_xxxxxxxx
LANGCHAIN_SERVICE_KEY=lsv2_sk_xxxxxxxx
LANGCHAIN_TRACING_V2=true
LANGCHAIN_PROJECT=the-big-family-legacy

# CrewAI
CREW_AI_PAT=pat_xxxxxxxx
CREW_AI_ENTERPRISE_AUTH=PK_xxxxxxxx

# Application
NODE_ENV=production
PORT=8000
PYTHONUNBUFFERED=1
```

**Step 6: Deploy**
- Click "Create Service"
- Wait for build (~5-10 minutes first time)
- Monitor logs for any errors

**Step 7: Get Service URL**
After deployment, note the URL (format):
```
https://ai-agents-backend-<id>.code.run
```

---

### OPTION 2: Northflank API (Automated)

Use the provided Python script:

```bash
python3 deploy_to_northflank.py
```

This will:
1. Create/update project
2. Create service from GitHub
3. Configure environment variables
4. Deploy and start service

---

### OPTION 3: Northflank CLI

```bash
# Install CLI
npm install -g @northflank/cli

# Login
northflank login

# Create project (if not exists)
northflank create project \
  --name "the-big-family-legacy" \
  --description "AI-powered family legacy platform"

# Create service
northflank create service \
  --project the-big-family-legacy \
  --name ai-agents-backend \
  --type deployment \
  --port 8000 \
  --source-type github \
  --repo Estes786/The-Big-Family-Legacy- \
  --branch main \
  --dockerfile ./Dockerfile
```

---

## Service Architecture

```
┌─────────────────────────────────────────────────┐
│         Northflank AI Agents Backend            │
├─────────────────────────────────────────────────┤
│                                                 │
│  PORT 8000: FastAPI Application                 │
│  ├─ /health          - Health check             │
│  ├─ /api/v1/agents   - AI agent endpoints       │
│  ├─ /api/v1/analyze  - Media analysis           │
│  └─ /api/v1/generate - Story generation         │
│                                                 │
│  AI AGENTS (CrewAI):                            │
│  ├─ Privacy Guard    - PII detection            │
│  ├─ Memory Curator   - Photo analysis           │
│  ├─ Genealogist      - Family tree              │
│  └─ Biographer       - Story generation         │
│                                                 │
│  DEPENDENCIES:                                  │
│  ├─ Supabase         - Database                 │
│  ├─ HuggingFace      - AI models                │
│  ├─ LangChain        - Workflow orchestration   │
│  └─ CrewAI           - Multi-agent coordination │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Verification & Testing

**1. Check Service Status**
```bash
curl https://ai-agents-backend-<id>.code.run/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "AI Agents Backend",
  "version": "1.0.0",
  "agents": ["privacy_guard", "memory_curator", "genealogist", "biographer"]
}
```

**2. Test AI Agent**
```bash
curl -X POST https://ai-agents-backend-<id>.code.run/api/v1/analyze \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "type": "photo",
    "url": "https://example.com/photo.jpg"
  }'
```

**3. Check Logs**
- Northflank Dashboard → Services → ai-agents-backend → Logs
- Look for successful agent initialization
- Verify database connection

**4. Monitor Metrics**
- CPU usage (should be < 50% idle)
- Memory usage (should be < 1GB idle)
- Response time (should be < 2s)

---

## Cost Estimation

Based on Northflank pricing (as of 2025):

**Free Tier** (Recommended for testing):
- 0.2 vCPU
- 512 MB RAM
- 1 deployment
- Cost: **$0/month** 🎉

**Startup Tier** (Recommended for production):
- 0.5-1 vCPU
- 1-2 GB RAM
- Auto-scaling
- Cost: **~$10-20/month** 📊

---

## Troubleshooting

### Issue: Build Fails

**Symptoms**: Build stuck or fails during `pip install`

**Solution**:
```bash
# Check Dockerfile for syntax errors
# Verify requirements.txt exists
# Ensure Python version is correct (3.10+)
```

### Issue: Service Won't Start

**Symptoms**: Service shows "unhealthy" status

**Solution**:
1. Check logs for errors
2. Verify PORT=8000 is set
3. Ensure health check endpoint `/health` exists
4. Check if all environment variables are set

### Issue: Database Connection Failed

**Symptoms**: Error "Could not connect to Supabase"

**Solution**:
1. Verify `SUPABASE_URL` and `SUPABASE_SERVICE_KEY`
2. Check Supabase project is active
3. Verify RLS policies allow service role access
4. Test connection from local machine first

### Issue: AI Models Not Loading

**Symptoms**: Error "Failed to load HuggingFace model"

**Solution**:
1. Verify `HF_TOKEN` is valid
2. Increase memory allocation (models need ~1GB)
3. Check model name is correct
4. Use smaller models for free tier

---

## Integration with Frontend

**Update Frontend Config** (Cloudflare Pages):

Add environment variable in Cloudflare Pages dashboard:
```bash
API_BACKEND_URL=https://ai-agents-backend-<id>.code.run
```

**Update Hono Backend** (`src/index.tsx`):

```typescript
// Add API proxy to Northflank backend
app.all('/api/agents/*', async (c) => {
  const path = c.req.path.replace('/api/agents', '')
  const backendUrl = process.env.API_BACKEND_URL
  
  const response = await fetch(`${backendUrl}${path}`, {
    method: c.req.method,
    headers: c.req.header(),
    body: c.req.method !== 'GET' ? await c.req.text() : undefined
  })
  
  return response
})
```

---

## Security Checklist

- [ ] ✅ All API keys stored in Northflank secrets (not hardcoded)
- [ ] ✅ HTTPS enabled (automatic on Northflank)
- [ ] ✅ CORS configured for Cloudflare Pages domain only
- [ ] ✅ Rate limiting implemented
- [ ] ✅ Input validation on all endpoints
- [ ] ✅ Supabase RLS policies enabled
- [ ] ✅ No sensitive data in logs

---

## Next Steps

1. ✅ Deploy to Northflank
2. ⏳ Test all AI agent endpoints
3. ⏳ Configure Cloudflare Pages to use backend API
4. ⏳ Run end-to-end integration tests
5. ⏳ Monitor performance and optimize
6. ⏳ Setup CI/CD pipeline for automatic deployments

---

## Support & Resources

- **Northflank Docs**: https://northflank.com/docs
- **Project Dashboard**: https://app.northflank.com/
- **API Docs**: https://northflank.com/docs/v1/api
- **Support**: support@northflank.com

---

**Created**: 2026-02-17  
**Status**: Ready for Deployment 🚀  
**Estimated Setup Time**: 15-30 minutes
