# Deployment Guide
## THE BIG FAMILY LEGACY Platform

---

## 1. Deployment Overview

### 1.1 Deployment Architecture

```
┌─────────────────┐
│   Developer     │
│   Local Dev     │
└────────┬────────┘
         │ git push
         ▼
┌─────────────────┐
│     GitHub      │
│   Repository    │
└────────┬────────┘
         │ webhook
         ├─────────────────┬──────────────────┐
         ▼                 ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Cloudflare  │  │  Northflank  │  │   Supabase   │
│    Pages     │  │   (Backend)  │  │  (Database)  │
│  (Frontend)  │  │   (AI Crew)  │  │              │
└──────────────┘  └──────────────┘  └──────────────┘
```

---

## 2. Prerequisites

### 2.1 Required Accounts

✅ **GitHub** - Code repository  
✅ **Cloudflare** - Frontend hosting, CDN, Security  
✅ **Northflank** - Backend API & AI agents  
✅ **Supabase** - Database & Authentication  
✅ **Hugging Face** - AI models  
✅ **OpenAI** (Optional) - Advanced LLM for premium features  

### 2.2 Required API Keys

| Platform | Key Name | How to Obtain |
|----------|----------|---------------|
| **Cloudflare** | `CF_API_TOKEN` | Dashboard → API Tokens → Create Token |
| **Cloudflare** | `CF_ACCOUNT_ID` | Dashboard → Overview (in URL) |
| **Supabase** | `SUPABASE_URL` | Project Settings → API |
| **Supabase** | `SUPABASE_ANON_KEY` | Project Settings → API |
| **Supabase** | `SUPABASE_SERVICE_KEY` | Project Settings → API (Service Role) |
| **Hugging Face** | `HF_TOKEN` | Settings → Access Tokens → New Token (Write) |
| **Northflank** | `NF_API_KEY` | Account → API Keys → Generate |
| **OpenAI** | `OPENAI_API_KEY` | platform.openai.com → API Keys |

---

## 3. Local Development Setup

### 3.1 Clone Repository

```bash
# IMPORTANT: Use setup_github_environment first if pushing to GitHub
git clone https://github.com/yourusername/webapp.git
cd webapp
```

### 3.2 Install Dependencies

```bash
# Frontend & Backend (Node.js)
npm install

# AI Agents (Python) - if running locally
cd agents
pip install -r requirements.txt
```

### 3.3 Environment Configuration

Create `.dev.vars` (Cloudflare local dev):
```bash
# Database
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_KEY=eyJhbGc...

# AI
HF_TOKEN=hf_xxxxx
OPENAI_API_KEY=sk-xxxxx

# Cloudflare
CF_ACCOUNT_ID=xxxxx
R2_ACCESS_KEY_ID=xxxxx
R2_SECRET_ACCESS_KEY=xxxxx
```

Create `.env` (Python agents):
```bash
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGc...
HF_TOKEN=hf_xxxxx
OPENAI_API_KEY=sk-xxxxx
DATABASE_URL=postgresql://xxxxx
```

### 3.4 Database Setup

```bash
# Create Supabase project at supabase.com

# Run migrations
npm run db:migrate:local

# Seed initial data
npm run db:seed

# Verify
npm run db:console:local
```

### 3.5 Start Development Servers

**Terminal 1: Frontend (Hono + Vite)**
```bash
cd /home/user/webapp
npm run build  # Initial build
npm run dev:sandbox  # Start wrangler pages dev
```

**Terminal 2: AI Agents (Python)**
```bash
cd /home/user/webapp/agents
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Verify Services**:
```bash
# Frontend
curl http://localhost:3000

# Backend API
curl http://localhost:3000/api/v1/health

# AI Agents
curl http://localhost:8000/health
```

---

## 4. Supabase Database Setup

### 4.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in:
   - Name: `big-family-legacy-prod`
   - Database Password: (use strong password)
   - Region: Singapore (closest to Indonesia)
4. Wait for provisioning (~2 minutes)

### 4.2 Run Database Migrations

**Option A: Via Supabase Dashboard**
1. Go to SQL Editor
2. Copy contents of `migrations/0001_initial_schema.sql`
3. Paste and run

**Option B: Via Wrangler (Recommended)**
```bash
# Install Supabase CLI
npm install -g supabase

# Link project
supabase link --project-ref your-project-ref

# Apply migrations
supabase db push
```

### 4.3 Enable Row Level Security

Already included in migration, but verify:
```sql
-- Check RLS status
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Should all show: rowsecurity = true
```

### 4.4 Configure Authentication

1. Go to Authentication → Providers
2. Enable Email (already enabled by default)
3. Configure Email Templates:
   - Confirmation: Customize with your branding
   - Reset Password: Add family-friendly messaging
4. Set Site URL: `https://webapp.pages.dev`

---

## 5. Cloudflare Pages Deployment

### 5.1 Setup Cloudflare Account

1. Create account at [cloudflare.com](https://cloudflare.com)
2. Get `CF_API_TOKEN`:
   - Dashboard → My Profile → API Tokens
   - Create Token → "Edit Cloudflare Workers" template
   - Permissions: Account.Cloudflare Pages (Edit)
3. Get `CF_ACCOUNT_ID`:
   - Dashboard → Workers & Pages
   - Copy from URL: `https://dash.cloudflare.com/{account_id}/...`

### 5.2 Setup Cloudflare API Key (CRITICAL)

**Before deploying, ALWAYS run:**
```bash
# This tool configures CLOUDFLARE_API_TOKEN in your environment
setup_cloudflare_api_key

# Verify authentication
npx wrangler whoami
```

If `setup_cloudflare_api_key` fails:
1. Go to Deploy tab in UI
2. Configure your Cloudflare API key
3. Run setup tool again

### 5.3 Create Cloudflare Pages Project

**IMPORTANT: Manage project name with meta_info**

```bash
# Read existing name or use default
# meta_info(action="read", key="cloudflare_project_name")
# If no value, use: webapp

# Create project (IMPORTANT: use 'main' branch unless specified otherwise)
npx wrangler pages project create webapp \
  --production-branch main \
  --compatibility-date 2024-01-01

# If name exists, append number: webapp-2, webapp-3
# Then save to meta_info:
# meta_info(action="write", key="cloudflare_project_name", value="webapp-2")
```

### 5.4 Build and Deploy

```bash
# Build frontend
cd /home/user/webapp
npm run build  # Creates dist/ directory

# Deploy to Cloudflare Pages
npx wrangler pages deploy dist --project-name webapp

# You'll receive URLs:
# Production: https://webapp.pages.dev
# Branch: https://main.webapp.pages.dev
```

### 5.5 Configure Environment Variables

```bash
# Add secrets to Cloudflare Pages
npx wrangler pages secret put SUPABASE_URL --project-name webapp
# Enter: https://xxxxx.supabase.co

npx wrangler pages secret put SUPABASE_ANON_KEY --project-name webapp
# Enter: eyJhbGc...

npx wrangler pages secret put HF_TOKEN --project-name webapp
# Enter: hf_xxxxx

# List all secrets
npx wrangler pages secret list --project-name webapp
```

### 5.6 Configure Cloudflare R2 Storage

```bash
# Create R2 bucket for media files
npx wrangler r2 bucket create webapp-media

# Add R2 binding to wrangler.jsonc
# Already configured in template
```

### 5.7 Setup Custom Domain (Optional)

```bash
# Add custom domain
npx wrangler pages domain add www.bigfamilylegacy.com --project-name webapp

# Configure DNS:
# 1. Add CNAME: www → webapp.pages.dev
# 2. Wait for SSL certificate (automatic)
```

---

## 6. Northflank Deployment (Backend AI)

### 6.1 Setup Northflank Account

1. Create account at [northflank.com](https://northflank.com)
2. Verify email and complete onboarding
3. Choose Free (Sandbox) plan for MVP

### 6.2 Create Project

1. Dashboard → Create Project
2. Name: `legacy-ai-engine`
3. Region: `us-east` or `europe-west` (choose closest)

### 6.3 Connect GitHub Repository

1. Project Settings → Integrations
2. Connect GitHub
3. Select repository: `yourusername/webapp`
4. Grant access to Northflank

### 6.4 Create Service

**Option A: Via Dashboard**
1. Add Service → Combined Service
2. Name: `ai-agents`
3. Source: GitHub → `yourusername/webapp`
4. Branch: `main`
5. Build:
   - Type: Dockerfile
   - Path: `agents/Dockerfile`
6. Port: `8000`
7. Environment Variables: (add all from `.env`)

**Option B: Via CLI**
```bash
# Install Northflank CLI
npm install -g @northflank/cli

# Login
northflank login

# Create service
northflank service create \
  --project legacy-ai-engine \
  --name ai-agents \
  --type combined \
  --git-repo yourusername/webapp \
  --git-branch main \
  --dockerfile-path agents/Dockerfile \
  --port 8000
```

### 6.5 Configure Environment Variables

Add in Northflank Dashboard → Service → Environment:

```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGc...
HF_TOKEN=hf_xxxxx
OPENAI_API_KEY=sk-xxxxx
DATABASE_URL=postgresql://xxxxx

# Python env
PYTHONUNBUFFERED=1
LOG_LEVEL=info
```

### 6.6 Deploy

1. Click "Deploy" button
2. Watch build logs
3. Wait for "Running" status (~3-5 minutes)
4. Get service URL: `https://ai-agents-xxxxx.northflank.app`

### 6.7 Test Backend

```bash
# Health check
curl https://ai-agents-xxxxx.northflank.app/health

# Test AI endpoint
curl -X POST https://ai-agents-xxxxx.northflank.app/api/analyze-photo \
  -H "Content-Type: application/json" \
  -d '{"image_url": "https://..."}'
```

---

## 7. GitHub Integration

### 7.1 Setup GitHub Environment (CRITICAL)

**Before any GitHub operations:**
```bash
# This configures git and gh authentication globally
setup_github_environment

# Verify authentication
git config --global credential.helper
gh auth status
```

If `setup_github_environment` fails:
1. Go to #github tab in UI
2. Complete GitHub authorization (App + OAuth)
3. Run setup tool again

### 7.2 Create GitHub Repository

**IMPORTANT: Prioritize existing user-selected repositories**

```bash
# Check if user has existing repos
# setup_github_environment will list available repos

# Option 1: Use existing repo (RECOMMENDED)
cd /home/user/webapp
git remote add origin https://github.com/username/existing-repo.git
git push -f origin main  # Force push for new content

# Option 2: Create new repo (only if explicitly requested)
gh repo create webapp --public --source=. --remote=origin --push
```

### 7.3 Setup CI/CD Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CF_API_TOKEN }}
          accountId: ${{ secrets.CF_ACCOUNT_ID }}
          projectName: webapp
          directory: dist

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      # Northflank auto-deploys on git push
      # This job is placeholder for future backend tests
      - name: Notify Northflank
        run: echo "Northflank will auto-deploy from this push"
```

Add secrets to GitHub:
1. Go to Repository → Settings → Secrets and variables → Actions
2. Add:
   - `CF_API_TOKEN`
   - `CF_ACCOUNT_ID`

---

## 8. Final Integration Testing

### 8.1 Test Full Flow

**1. Upload Photo**
```bash
# Via frontend
open https://webapp.pages.dev

# Or via API
curl -X POST https://webapp.pages.dev/api/v1/memories/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@test-photo.jpg" \
  -F 'data={"title":"Test Photo"}'
```

**2. Check AI Analysis**
```bash
# Should trigger Northflank AI service
curl https://webapp.pages.dev/api/v1/memories/123/analyze
```

**3. Generate Story**
```bash
curl -X POST https://webapp.pages.dev/api/v1/stories/generate \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"focus_person_id":"uuid"}'
```

### 8.2 Performance Check

```bash
# Frontend load time
curl -w "@curl-format.txt" -o /dev/null -s https://webapp.pages.dev

# API response time
time curl https://webapp.pages.dev/api/v1/families/123
```

### 8.3 Security Audit

- [ ] All API endpoints require authentication
- [ ] Row Level Security enabled in Supabase
- [ ] Environment variables not in code
- [ ] HTTPS enforced everywhere
- [ ] Cloudflare WAF enabled
- [ ] Rate limiting configured

---

## 9. Monitoring & Maintenance

### 9.1 Cloudflare Analytics

1. Dashboard → Analytics
2. Monitor:
   - Request volume
   - Error rates (4xx, 5xx)
   - Geographic distribution
   - Top paths

### 9.2 Supabase Monitoring

1. Dashboard → Database
2. Monitor:
   - Connection count
   - Query performance
   - Disk usage
   - Slow queries

### 9.3 Northflank Monitoring

1. Service → Metrics
2. Monitor:
   - CPU usage
   - Memory usage
   - Response times
   - Error logs

### 9.4 Backup Verification

```bash
# Verify Supabase backup
# (Automatic daily backups on Pro plan)

# Manual backup
npm run db:backup

# Backup code to tar.gz
ProjectBackup(project_path="/home/user/webapp", backup_name="webapp_$(date +%Y%m%d)")
```

---

## 10. Rollback Procedures

### 10.1 Frontend Rollback

```bash
# List deployments
npx wrangler pages deployment list --project-name webapp

# Rollback to previous
npx wrangler pages deployment rollback <deployment-id> --project-name webapp
```

### 10.2 Backend Rollback

1. Northflank Dashboard → Service → Deployments
2. Find previous successful deployment
3. Click "Redeploy"

### 10.3 Database Rollback

```bash
# Restore from backup (Supabase Pro)
# Contact Supabase support or use PITR (Point-in-Time Recovery)

# Or restore from local backup
supabase db restore --backup-file backup.sql
```

---

## 11. Troubleshooting

### Issue: Cloudflare deployment fails

**Solution:**
```bash
# 1. Verify authentication
npx wrangler whoami

# 2. Re-authenticate if needed
setup_cloudflare_api_key

# 3. Check project name
# meta_info(action="read", key="cloudflare_project_name")

# 4. Try different project name if duplicate
npx wrangler pages deploy dist --project-name webapp-2
# meta_info(action="write", key="cloudflare_project_name", value="webapp-2")
```

### Issue: Northflank build fails

**Solution:**
1. Check build logs in dashboard
2. Verify Dockerfile is correct
3. Ensure all dependencies in requirements.txt
4. Check environment variables are set

### Issue: Database connection errors

**Solution:**
```bash
# 1. Verify Supabase is running
curl https://xxxxx.supabase.co

# 2. Check connection string
echo $SUPABASE_URL

# 3. Test connection
psql $DATABASE_URL -c "SELECT 1"

# 4. Check RLS policies
# May be blocking service role access
```

### Issue: AI requests failing

**Solution:**
```bash
# 1. Check HF token
curl https://huggingface.co/api/whoami -H "Authorization: Bearer $HF_TOKEN"

# 2. Check rate limits
# View Cloudflare AI Gateway logs

# 3. Test model directly
curl https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large \
  -H "Authorization: Bearer $HF_TOKEN" \
  -d '{"inputs":"test"}'
```

---

## 12. Production Checklist

Before going live for Ramadhan launch:

- [ ] All environment variables configured
- [ ] Database migrations applied
- [ ] RLS policies tested
- [ ] API endpoints secured
- [ ] Rate limiting enabled
- [ ] Backup system verified
- [ ] Monitoring alerts configured
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Load testing completed
- [ ] Security audit passed
- [ ] Privacy Guard agent tested
- [ ] User acceptance testing done
- [ ] Documentation updated
- [ ] Family invited to beta test

---

## 13. Cost Monitoring

### Monthly Cost Estimate (MVP)

| Service | Plan | Cost |
|---------|------|------|
| **Cloudflare Pages** | Free | $0 |
| **Northflank** | Sandbox | $0 |
| **Supabase** | Free | $0 |
| **Hugging Face** | Free Inference | $0 |
| **OpenAI** | Pay-as-go | ~$5-10 (100 stories) |
| **Total** | | **~$5-10/month** |

### Scaling Costs (100+ families)

| Service | Plan | Cost |
|---------|------|------|
| **Cloudflare** | Pro | $20 |
| **Northflank** | Developer | $20 |
| **Supabase** | Pro | $25 |
| **OpenAI** | Pay-as-go | ~$50-100 |
| **Total** | | **~$115-165/month** |

---

**Status**: ✅ COMPLETE - All deployment documentation ready

**Next Steps**: Execute deployment following this guide!
