# THE BIG FAMILY LEGACY 🌳

**Platform Warisan Digital Keluarga dengan AI**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?logo=cloudflare&logoColor=white)](https://cloudflare.com)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white)](https://python.org)

---

## 📖 Tentang Project

**THE BIG FAMILY LEGACY** adalah platform digital yang memungkinkan keluarga besar untuk:
- 📸 **Menyimpan** foto, video, dan cerita keluarga dengan aman
- 🤖 **Menganalisis** memori menggunakan AI (caption otomatis, deteksi wajah)
- 🌳 **Membangun** pohon silsilah interaktif
- ✍️ **Menghasilkan** narasi sejarah keluarga otomatis
- 💬 **Berbicara** dengan "versi AI" dari kakek/nenek

**Target Launch**: Ramadhan 2026 (Family Reunion Event)

---

## 🚀 Current Status

### Phase 1: Foundation ✅ COMPLETED
- [x] Complete project documentation (PRD, Architecture, Database Schema, API Design, Agent Manifest)
- [x] Project structure setup
- [x] Technology stack defined

### Phase 2: Intelligence Layer ✅ COMPLETED
- [x] **Privacy Guard Agent** - PII detection & data redaction
- [x] **Memory Curator Agent** - Vision AI (BLIP-2) & face detection
- [x] **Genealogist Agent** - Relationship validation & tree building
- [x] **Biographer Agent** - Story generation & caption writing
- [x] **LangGraph Workflows** - Memory processing & story generation orchestration
- [x] **FastAPI Application** - AI agents API endpoints
- [x] **Docker Configuration** - Container setup for Northflank deployment

### Phase 3: Manual Platform Setup 🔄 IN PROGRESS
- [x] **GitHub Repository** - Code pushed and tracked ✅
- [x] **Setup Documentation** - Complete deployment guide created
- [x] **Environment Configuration** - Credentials organized
- [ ] **Supabase Database** - Schema migration and RLS setup ⏳
- [ ] **Cloudflare Pages** - Frontend deployment ⏳
- [ ] **Northflank Backend** - AI agents deployment ⏳
- [ ] **Integration Testing** - End-to-end verification ⏳

### Phase 4: Launch Preparation ⏳ PENDING
- [ ] Testing & QA
- [ ] Performance optimization
- [ ] User onboarding materials
- [ ] Ramadhan presentation prep

---

## 🌐 Live Deployment URLs

### Production (Cloudflare Pages)
- **Main**: https://the-big-family-legacy.pages.dev
- **Latest Deploy**: https://16c3c32f.the-big-family-legacy.pages.dev
- **Status**: ✅ **LIVE & DEPLOYED**

### Development
- **Sandbox**: https://3000-i4y5n8lfe853eyhniievj-2e1b9533.sandbox.novita.ai
- **Local**: http://localhost:3000

### Source Code
- **GitHub**: https://github.com/Estes786/The-Big-Family-Legacy-.git
- **Branch**: main

---

## 🔑 Configured Credentials

All credentials are stored in `.dev.vars` (gitignored):

### Platform Access
- ✅ **GitHub PAT**: Configured for repository access
- ✅ **Cloudflare API Token**: Configured for Pages deployment
- ✅ **LangChain**: Workflow PAT & Service Key configured
- ✅ **CrewAI**: PAT & Enterprise Auth configured  
- ✅ **Northflank**: 2x API tokens configured

### Database & Storage (Pending)
- ⏳ **Supabase**: URL, Anon Key, Service Key - *Awaiting setup*
- ⏳ **AI Models**: HuggingFace, OpenAI tokens - *Awaiting setup*

⚠️ **SECURITY NOTE**: All production credentials are stored securely in `.dev.vars` file. Never commit this file to version control!

---

## 🏗️ Technology Stack

### Frontend Layer
- **Cloudflare Pages** - Static hosting & CDN
- **Hono** - Lightweight web framework
- **TailwindCSS** - Styling framework
- **Vanilla JavaScript** - Frontend logic

### Backend Layer (AI Agents)
- **Python 3.11** - AI agents runtime
- **FastAPI** - RESTful API framework
- **CrewAI** - Multi-agent AI orchestration
- **LangGraph** - Workflow state management
- **Northflank** - Container orchestration & hosting

### AI & ML Models
- **BLIP-2** (Hugging Face) - Image captioning
- **GPT-4o** / **GPT-4o-mini** (OpenAI) - Story generation & analysis
- **Llama 3.1** (Hugging Face) - Alternative LLM

### Data Layer
- **Supabase PostgreSQL** - Database & Authentication
- **Cloudflare R2** - Object storage for media files

### Security
- **Cloudflare WAF** - Web Application Firewall
- **Cloudflare AI Gateway** - AI request monitoring & rate limiting
- **Supabase RLS** - Row Level Security

---

## 🎭 AI Agents (The Legacy Crew)

| Agent Name | Role | Status | Responsibility |
|------------|------|--------|----------------|
| **Privacy Guard** | Compliance Officer | ✅ Implemented | PII detection, data redaction, privacy compliance |
| **Memory Curator** | Context Analyst | ✅ Implemented | Vision AI, face detection, EXIF extraction |
| **Genealogist** | Silsilah Specialist | ✅ Implemented | Relationship validation, family tree building |
| **Biographer** | Narrative Writer | ✅ Implemented | Story generation, caption writing |

---

## 📂 Project Structure

```
webapp/
├── src/
│   ├── agents/                 # AI Agents (CrewAI)
│   │   ├── privacy_guard.py
│   │   ├── memory_curator.py
│   │   ├── genealogist.py
│   │   └── biographer.py
│   ├── tools/                  # Agent tools
│   │   ├── pii_detection.py
│   │   ├── vision_ai.py
│   │   ├── face_detection.py
│   │   └── ...
│   ├── workflows/              # LangGraph workflows
│   │   └── langgraph_workflows.py
│   ├── main.py                 # FastAPI application
│   └── types/                  # TypeScript types
├── docs/                       # Documentation
│   ├── 00_PROJECT_OVERVIEW.md
│   ├── 01_PRD.md
│   ├── 02_ARCHITECTURE.md
│   ├── 03_DATABASE_SCHEMA.md
│   ├── 04_API_DESIGN.md
│   ├── 05_AGENT_MANIFEST.md
│   └── 06_DEPLOYMENT.md
├── public/                     # Frontend assets
│   └── static/
├── migrations/                 # Database migrations
├── .github/workflows/          # CI/CD
├── Dockerfile                  # Docker config
├── requirements.txt            # Python dependencies
├── package.json                # Node dependencies
└── README.md                   # This file
```

---

## 🚀 Getting Started

### 📚 Complete Setup Guide

**🎯 NEW: Follow our comprehensive manual setup guide!**

**[→ Read SETUP_GUIDE.md for step-by-step deployment instructions](SETUP_GUIDE.md)**

The setup guide covers:
1. **Supabase Database Setup** (30 min) - Schema migration, RLS policies
2. **Cloudflare Pages Deployment** (20 min) - Frontend hosting, R2 storage
3. **Northflank Backend Deployment** (40 min) - AI agents API
4. **Integration & Testing** (15 min) - End-to-end verification

**Total time: ~2 hours**

---

### Prerequisites

- Node.js 18+
- Python 3.11+
- Supabase account
- Cloudflare account
- Hugging Face account
- OpenAI API key (optional)

### Environment Variables

Copy `.env.example` to `.dev.vars` and fill in:

```bash
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key

# AI Services
HF_TOKEN=your_huggingface_token
OPENAI_API_KEY=your_openai_key

# Cloudflare
CF_ACCOUNT_ID=your_account_id
CF_API_TOKEN=your_api_token
```

### Local Development (AI Agents)

```bash
# Install Python dependencies
pip install -r requirements.txt

# Run FastAPI server
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000

# Test endpoint
curl http://localhost:8000/health
```

### Local Development (Frontend - Coming Soon)

```bash
# Install Node dependencies
npm install

# Build project
npm run build

# Start dev server with PM2
npm run clean-port
pm2 start ecosystem.config.cjs

# Test
npm test
```

---

## 📊 Development Progress

### Overall Progress: 45% Complete

- [x] Documentation (100%)
- [x] AI Agents (100%)
- [x] GitHub Setup (100%)
- [ ] Database (0% - Ready to deploy)
- [ ] Frontend (0% - Structure ready)
- [ ] Backend Deployment (0% - Docker ready)
- [ ] Testing (0%)

### Next Immediate Steps:

1. **Setup Supabase** - Follow [SETUP_GUIDE.md](SETUP_GUIDE.md) Step 1
2. **Deploy to Cloudflare Pages** - Follow Step 2
3. **Deploy Backend to Northflank** - Follow Step 3
4. **Test Integration** - Follow Step 4

**Estimated time to production: 2-3 hours of manual setup**

---

## 🎯 Success Metrics (MVP)

- ✅ 4 AI Agents implemented
- ✅ LangGraph workflows created
- ✅ FastAPI application ready
- [ ] 50+ memories uploaded
- [ ] 1 complete family tree
- [ ] 1 AI-generated story
- [ ] 10+ digital ancestor conversations
- [ ] Zero security incidents

---

## 📝 Documentation

Complete documentation available in `/docs`:
- [Project Overview](docs/00_PROJECT_OVERVIEW.md)
- [Product Requirements](docs/01_PRD.md)
- [Technical Architecture](docs/02_ARCHITECTURE.md)
- [Database Schema](docs/03_DATABASE_SCHEMA.md)
- [API Design](docs/04_API_DESIGN.md)
- [Agent Manifest](docs/05_AGENT_MANIFEST.md)
- [Deployment Guide](docs/06_DEPLOYMENT.md)
- [TODO Checklist](docs/07_TODO.md)

**🆕 Phase 3 Resources:**
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Complete manual deployment guide
- **CREDENTIALS.md** - API keys reference (local only, not in git)

---

## 🤝 Contributing

This is a family project currently in MVP development. Contributions welcome after initial launch!

---

## 📄 License

MIT License - see LICENSE file for details

---

## 👥 Team

- **Founder & Orchestrator**: You 😌
- **Chief Architect**: AI Assistant (Claude)
- **Target Users**: Big Families 🌳

---

**Built with ❤️ for families who want to preserve their legacy** 🚀🙏🏻
