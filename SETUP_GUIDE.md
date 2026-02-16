# 🚀 THE BIG FAMILY LEGACY - Setup Guide Phase 3

Panduan lengkap untuk deploy platform THE BIG FAMILY LEGACY ke production.

---

## ✅ Progress Status

- [x] **Phase 1**: Documentation Complete ✅
- [x] **Phase 2**: Code Structure & Git Setup ✅  
- [ ] **Phase 3**: Manual Platform Setup 🔄
- [ ] **Phase 4**: Testing & Launch ⏳

**GitHub Repository**: https://github.com/Estes786/The-Big-Family-Legacy-.git

---

## 📋 Prerequisites Checklist

Sebelum mulai, pastikan Anda sudah punya akun di:

- [x] **GitHub** - Code repository (DONE ✅)
- [ ] **Supabase** - Database & Authentication
- [ ] **Cloudflare** - Frontend hosting & CDN
- [ ] **Northflank** - Backend API & AI agents
- [ ] **Hugging Face** (Optional) - Free AI models

---

## 🎯 Phase 3: Manual Setup Steps

### Step 1: Setup Supabase Database (30 menit) 🗄️

#### 1.1 Create Supabase Project

1. Buka https://supabase.com/dashboard
2. Click **"New Project"**
3. Isi details:
   - **Name**: `the-big-family-legacy`
   - **Database Password**: Buat password kuat (simpan!)
   - **Region**: Southeast Asia (Singapore)
4. Tunggu project selesai (~2 menit)

#### 1.2 Get Database Credentials

1. Setelah project ready, buka **Settings → API**
2. Copy credentials berikut:
   ```
   Project URL: https://xxxxxxxxxxxxx.supabase.co
   anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (RAHASIA!)
   ```

3. Buka **Settings → Database** dan copy:
   ```
   Connection String (Pooler - Transaction Mode):
   postgresql://postgres.xxxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```

#### 1.3 Create Database Schema

1. Buka **SQL Editor** di Supabase dashboard
2. Click **"New Query"**
3. Copy-paste isi file `docs/03_DATABASE_SCHEMA.md` bagian SQL migrations
4. Click **"Run"** untuk execute
5. Verify: Check **Table Editor** → Harus ada tables: `profiles`, `families`, `family_members`, dll.

#### 1.4 Enable Row Level Security (RLS)

1. Untuk setiap table di **Table Editor**:
   - Click table name
   - Click **"RLS"** tab
   - Click **"Enable RLS"**
2. Copy-paste RLS policies dari dokumentasi
3. Test dengan membuat test user

#### 1.5 Update .dev.vars

Update file `.dev.vars` dengan credentials dari Step 1.2:

```bash
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_KEY=eyJhbGci...
DATABASE_URL=postgresql://postgres.xxxxxxxxxxxxx:...
```

**✅ Supabase Setup Complete!**

---

### Step 2: Setup Cloudflare Pages (20 menit) ☁️

#### 2.1 Verify Cloudflare Account

1. Login ke https://dash.cloudflare.com
2. Pastikan API Token sudah ada: `fqHKTVctMcj2_b6BbzQNgktPyKpi_q4Bmv26Hy_j`
3. Check: **My Profile → API Tokens** → Token harus punya permissions:
   - Account → Cloudflare Pages → Edit
   - Account → D1 → Edit (jika pakai D1)
   - Account → R2 → Edit (untuk media storage)

#### 2.2 Create R2 Bucket (Object Storage)

R2 digunakan untuk simpan foto/video keluarga:

1. Buka **R2 Object Storage** di sidebar
2. Click **"Create bucket"**
3. Bucket name: `webapp-media`
4. Region: Automatic
5. Click **"Create bucket"**
6. Setelah created, buka bucket → **Settings**
7. Enable **Public Access** (untuk serve images)
8. Copy **Public R2 URL**: `https://pub-xxxxxxxx.r2.dev`

#### 2.3 Get R2 Credentials

1. Di R2 dashboard, click **"Manage R2 API Tokens"**
2. Click **"Create API Token"**
3. Permissions: **Object Read & Write**
4. Copy:
   ```
   Access Key ID: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   Secret Access Key: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
5. Update `.dev.vars`:
   ```bash
   R2_ACCESS_KEY_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   R2_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   R2_BUCKET_NAME=webapp-media
   R2_PUBLIC_URL=https://pub-xxxxxxxx.r2.dev
   ```

#### 2.4 Install Dependencies & Build

```bash
cd /home/user/webapp

# Install dependencies (gunakan timeout 300s+)
npm install

# Build untuk production
npm run build
```

#### 2.5 Deploy to Cloudflare Pages

**Option A: Deploy via Wrangler CLI** (Recommended)

```bash
# Login ke Cloudflare (gunakan API token yang sudah ada)
export CLOUDFLARE_API_TOKEN=fqHKTVctMcj2_b6BbzQNgktPyKpi_q4Bmv26Hy_j

# Deploy
npx wrangler pages deploy dist --project-name the-big-family-legacy

# Akan muncul URL:
# ✅ https://the-big-family-legacy.pages.dev
```

**Option B: Deploy via GitHub Actions** (Automated)

1. Buka **GitHub Repository Settings → Secrets and Variables → Actions**
2. Add secrets:
   - `CLOUDFLARE_API_TOKEN` = `fqHKTVctMcj2_b6BbzQNgktPyKpi_q4Bmv26Hy_j`
   - `CLOUDFLARE_ACCOUNT_ID` = (get from Cloudflare dashboard URL)
3. Create `.github/workflows/deploy-cloudflare.yml`:
   ```yaml
   name: Deploy to Cloudflare Pages
   
   on:
     push:
       branches: [main]
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: 18
         - run: npm ci
         - run: npm run build
         - uses: cloudflare/wrangler-action@v3
           with:
             apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
             accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
             command: pages deploy dist --project-name the-big-family-legacy
   ```
4. Push ke GitHub → Auto deploy!

#### 2.6 Configure Environment Variables (Production)

1. Buka Cloudflare Dashboard → **Pages** → `the-big-family-legacy`
2. Click **Settings → Environment Variables**
3. Add variables (untuk **Production**):
   ```
   SUPABASE_URL = https://xxxxxxxxxxxxx.supabase.co
   SUPABASE_ANON_KEY = eyJhbGci...
   R2_BUCKET_NAME = webapp-media
   R2_PUBLIC_URL = https://pub-xxxxxxxx.r2.dev
   NODE_ENV = production
   ```
4. **JANGAN** masukkan `SUPABASE_SERVICE_KEY` atau `R2_SECRET_ACCESS_KEY` di frontend!

**✅ Cloudflare Pages Setup Complete!**

**Production URL**: https://the-big-family-legacy.pages.dev

---

### Step 3: Setup Northflank (Backend API) (40 menit) 🐳

Northflank akan host Python AI agents (CrewAI + LangGraph).

#### 3.1 Create Northflank Project

1. Login ke https://app.northflank.com
2. Click **"Create new project"**
3. Project name: `the-big-family-legacy-backend`
4. Region: **US East** atau **EU West** (pilih terdekat dengan Supabase)

#### 3.2 Create Service (Combined Service)

1. Di project dashboard, click **"Create Service"**
2. Choose **"Combined Service"** (Build + Deploy)
3. Configuration:
   - **Name**: `ai-agents-api`
   - **Build source**: GitHub
   - **Repository**: `Estes786/The-Big-Family-Legacy-`
   - **Branch**: `main`
   - **Build path**: `/`
   - **Dockerfile path**: `Dockerfile`

#### 3.3 Configure Environment Variables

Klik **Environment → Variables** dan add:

```bash
# Database
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_KEY=eyJhbGci... (RAHASIA!)
DATABASE_URL=postgresql://postgres.xxxxxxxxxxxxx:...

# AI Keys (USE YOUR OWN CREDENTIALS FROM .dev.vars)
LANGCHAIN_API_KEY=lsv2_pt_xxxxxxxxxxxxx_your_key_here
LANGCHAIN_SERVICE_KEY=lsv2_sk_xxxxxxxxxxxxx_your_key_here
CREWAI_API_KEY=pat_xxxxxxxxxxxxx_your_key_here
CREWAI_ENTERPRISE_KEY=PK_xxxxxxxxxxxxx_your_key_here

# App Config
NODE_ENV=production
API_PORT=8000
LOG_LEVEL=info

# R2 Storage (for AI to upload processed images)
R2_ACCESS_KEY_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
R2_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
R2_BUCKET_NAME=webapp-media
R2_PUBLIC_URL=https://pub-xxxxxxxx.r2.dev
```

#### 3.4 Configure Build Settings

1. **Build command**: (already in Dockerfile)
   ```dockerfile
   # Install Python dependencies
   pip install -r requirements.txt
   
   # Install Node.js dependencies (if needed)
   npm install
   ```

2. **Start command**: (already in Dockerfile)
   ```bash
   python src/main.py
   ```

3. **Port**: `8000`
4. **Health check path**: `/health`

#### 3.5 Deploy!

1. Click **"Deploy service"**
2. Tunggu build (~5-10 menit)
3. Setelah success, copy **Service URL**:
   ```
   https://ai-agents-api-xxxxx.code.run
   ```

#### 3.6 Update Cloudflare Pages Environment

Tambahkan di Cloudflare Pages **Environment Variables**:
```
NF_SERVICE_URL = https://ai-agents-api-xxxxx.code.run
```

#### 3.7 Test API

```bash
# Test health endpoint
curl https://ai-agents-api-xxxxx.code.run/health

# Expected response:
# {"status":"ok","timestamp":"2026-02-16T..."}
```

**✅ Northflank Backend Setup Complete!**

**Backend API URL**: https://ai-agents-api-xxxxx.code.run

---

### Step 4: Connect Everything (15 menit) 🔗

#### 4.1 Update Frontend to Call Backend

Edit file `src/index.tsx` (atau frontend code):

```typescript
// Add backend URL
const BACKEND_API_URL = 'https://ai-agents-api-xxxxx.code.run';

// Example API call
async function analyzePhoto(photoFile) {
  const formData = new FormData();
  formData.append('photo', photoFile);
  
  const response = await fetch(`${BACKEND_API_URL}/api/v1/analyze-photo`, {
    method: 'POST',
    body: formData,
    headers: {
      'Authorization': `Bearer ${userToken}`
    }
  });
  
  return await response.json();
}
```

#### 4.2 Enable CORS on Northflank

Pastikan backend API mengizinkan requests dari Cloudflare Pages:

```python
# src/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://the-big-family-legacy.pages.dev",
        "http://localhost:3000"  # untuk development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

#### 4.3 Commit & Push Changes

```bash
cd /home/user/webapp

git add .
git commit -m "Configure production environment variables and API endpoints"
git push origin main
```

#### 4.4 Redeploy

- **Cloudflare Pages**: Auto-redeploy setelah git push (jika sudah setup GitHub Actions)
- **Northflank**: Auto-redeploy setelah git push (sudah configured di Step 3.2)

**✅ Integration Complete!**

---

## 🧪 Step 5: Testing (20 menit)

### 5.1 Test User Registration

1. Buka https://the-big-family-legacy.pages.dev
2. Click **"Register"**
3. Isi form:
   - Email: `test@example.com`
   - Password: `TestPassword123!`
   - Full Name: `Test User`
4. Submit → Harus redirect ke dashboard

### 5.2 Test Family Creation

1. Setelah login, click **"Create Family"**
2. Isi:
   - Family Name: `Smith Family`
   - Description: `Test family for MVP`
3. Submit → Family tree kosong muncul

### 5.3 Test Memory Upload

1. Upload foto keluarga (test dengan foto apapun)
2. Tunggu AI analysis (~10 detik)
3. Harus muncul:
   - AI-generated caption
   - Detected faces (jika ada)
   - Suggested tags

### 5.4 Test Story Generation

1. Click **"Generate Story"**
2. Pilih anggota keluarga (minimal 3)
3. Pilih tone: "Warm and emotional"
4. Submit → Tunggu ~20 detik
5. Story harus muncul dengan narasi yang koheren

### 5.5 Test AI Chat

1. Click **"Chat with Ancestor"**
2. Pilih anggota keluarga (e.g., "Grandpa John")
3. Tanya: "Tell me about your childhood"
4. Harus muncul response yang personal

**✅ All Tests Passed!**

---

## 🎯 Phase 4: Launch Preparation

### To-Do List Before Ramadhan Launch:

- [ ] **Invite 5 family members** untuk beta testing
- [ ] **Upload 50+ memories** (foto, video, cerita)
- [ ] **Create complete family tree** (3+ generations)
- [ ] **Generate 1 family story** dengan AI
- [ ] **Test on mobile devices** (responsiveness)
- [ ] **Prepare demo presentation** untuk family reunion
- [ ] **Create user guide** (simple PDF atau video)
- [ ] **Setup monitoring** (Sentry untuk error tracking)
- [ ] **Backup database** regularly

---

## 📊 URL Summary

| Service | URL | Status |
|---------|-----|--------|
| **GitHub Repo** | https://github.com/Estes786/The-Big-Family-Legacy-.git | ✅ Active |
| **Frontend (Cloudflare)** | https://the-big-family-legacy.pages.dev | ⏳ To Deploy |
| **Backend (Northflank)** | https://ai-agents-api-xxxxx.code.run | ⏳ To Deploy |
| **Database (Supabase)** | https://xxxxxxxxxxxxx.supabase.co | ⏳ To Setup |
| **Media Storage (R2)** | https://pub-xxxxxxxx.r2.dev | ⏳ To Setup |

---

## 🆘 Troubleshooting

### Issue: Supabase Connection Error

**Error**: `Failed to connect to database`

**Solution**:
1. Check `.dev.vars` → `DATABASE_URL` correct?
2. Check Supabase → **Settings → Database** → Connection pooler enabled?
3. Check RLS policies → Apakah user punya akses?

### Issue: AI Agents Timeout

**Error**: `AI request took too long`

**Solution**:
1. Check Northflank service logs
2. Pastikan `LANGCHAIN_API_KEY` dan `CREWAI_API_KEY` valid
3. Coba dengan model yang lebih ringan (`gpt-4o-mini`)
4. Check rate limits di LangChain/CrewAI dashboard

### Issue: CORS Error

**Error**: `Access to fetch blocked by CORS policy`

**Solution**:
1. Check backend `main.py` → CORS middleware configured?
2. Tambahkan Cloudflare Pages URL ke `allow_origins`
3. Redeploy Northflank service

### Issue: Image Upload Gagal

**Error**: `Failed to upload to R2`

**Solution**:
1. Check R2 bucket exists: `webapp-media`
2. Check R2 credentials di environment variables
3. Check R2 bucket permissions → Public access enabled?
4. Verify R2_PUBLIC_URL correct

---

## 💡 Pro Tips

1. **Cost Optimization**:
   - Cloudflare Pages: FREE (unlimited requests)
   - Northflank: ~$10/month (starter plan)
   - Supabase: FREE (500MB database, 1GB bandwidth)
   - R2 Storage: FREE (10GB storage, 10M requests/month)
   - **Total**: ~$10/month untuk MVP! 🎉

2. **Performance**:
   - Gunakan Cloudflare CDN untuk cache static assets
   - Enable R2 public URL untuk serve images directly
   - Implement AI response caching (gunakan KV)

3. **Security**:
   - NEVER commit `.dev.vars` atau `.env` ke git
   - Gunakan `SUPABASE_SERVICE_KEY` hanya di backend (Northflank)
   - Enable Supabase RLS untuk semua tables
   - Setup Cloudflare WAF rules untuk protect dari bots

4. **Monitoring**:
   - Setup Sentry untuk error tracking
   - Monitor Northflank service metrics
   - Check Supabase logs untuk slow queries

---

## 🚀 Next Steps After Manual Setup

Setelah semua platform configured:

1. **Run full end-to-end test** (registration → upload → AI analysis → story generation)
2. **Invite family members** untuk beta testing
3. **Collect feedback** dan prioritize improvements
4. **Prepare demo** untuk Ramadhan family reunion
5. **Celebrate launch!** 🎉🙏🏻

---

## 📞 Support & Help

Jika ada masalah saat setup:

1. **Check documentation**: `docs/` folder
2. **Check logs**:
   - Cloudflare Pages: Dashboard → Deployments → Logs
   - Northflank: Service → Logs
   - Supabase: Dashboard → Logs
3. **Ask AI Assistant** untuk troubleshooting spesifik

---

**Good luck dengan setup! Let's build something legendary! 🚀😌🙏🏻**

---

**Last Updated**: 2026-02-16  
**Version**: Phase 3.0  
**Status**: Ready for Manual Deployment 🎯
