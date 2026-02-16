# THE BIG FAMILY LEGACY 🌳
## Digital Family Legacy Platform with AI

---

## 🎯 Project Vision

**THE BIG FAMILY LEGACY** adalah platform digital yang memungkinkan keluarga besar untuk mendokumentasikan, mengarsipkan, dan menghidupkan kembali warisan keluarga mereka menggunakan teknologi AI modern.

Target Launch: **Ramadhan 2026** (Family Reunion Event)

---

## 🌟 Core Features

### MVP (Minimum Viable Product)
1. **Memory Bank** - Upload dan simpan foto, video, dan cerita keluarga
2. **AI Story Generator** - Menghasilkan narasi otomatis dari memori keluarga
3. **Interactive Family Tree** - Silsilah keluarga yang interaktif dan clickable
4. **Digital Ancestor Chat** - Berbicara dengan "versi AI" dari kakek/nenek
5. **Privacy Guard** - Keamanan data keluarga dengan Row-Level Security

### Future Features (Post-MVP)
1. **AI-Generated Legacy Book** - PDF otomatis berisi sejarah keluarga
2. **Voice Cloning** - Menghidupkan kembali suara anggota keluarga
3. **Timeline Events** - Kronologi peristiwa penting keluarga
4. **Collaboration Mode** - Multiple family members dapat berkontribusi
5. **Export & Backup** - Download semua data dalam berbagai format

---

## 💼 Monetization Strategy

| Plan | Price | Features |
|------|-------|----------|
| **Freemium** | Free | Basic family tree, 10 memories, AI summary |
| **Premium** | $9/month | Unlimited memories, AI chat, PDF export |
| **Enterprise** | Custom | Multiple families, custom branding, API access |

---

## 🏗️ Technology Stack

### Frontend Layer
- **Cloudflare Pages** - Static hosting & CDN
- **Hono** - Lightweight web framework
- **TailwindCSS** - Styling framework
- **Vanilla JavaScript** - Frontend logic

### Backend Layer
- **Northflank** - Container orchestration & API hosting
- **Hono API** - RESTful API endpoints
- **TypeScript** - Type-safe backend code

### AI & Intelligence Layer
- **CrewAI** - Multi-agent AI orchestration
- **LangGraph** - Workflow state management
- **Hugging Face** - Open-source AI models
- **OpenAI/Anthropic** - Advanced LLM capabilities (optional)

### Data Layer
- **Supabase** - PostgreSQL database & Authentication
- **Cloudflare R2** - Object storage for media files
- **Cloudflare KV** - Edge caching

### Security & Monitoring
- **Cloudflare WAF** - Web Application Firewall
- **Cloudflare AI Gateway** - AI request monitoring & rate limiting
- **Supabase RLS** - Row Level Security

---

## 🎭 AI Agents (The Legacy Crew)

| Agent Name | Role | Responsibility |
|------------|------|----------------|
| **The Genealogist** | Silsilah Specialist | Memvalidasi hubungan keluarga dan membangun tree structure |
| **The Memory Curator** | Story & Context Analyst | Menganalisis foto/video dengan Vision AI dan konteks sejarah |
| **The Biographer** | Narrative Writer | Menulis narasi emosional dari data yang dikumpulkan |
| **The Privacy Guard** | Compliance Officer | Memastikan tidak ada data sensitif yang bocor |
| **The Archivist** | Data Organizer | Merapikan input dari berbagai sumber |
| **The Historian** | Context Researcher | Mencari konteks sejarah untuk memperkaya cerita |

---

## 📊 Success Metrics (MVP)

1. **Technical Success**
   - ✅ Platform dapat handle 100+ family members
   - ✅ Response time < 2 seconds untuk AI generation
   - ✅ 99.9% uptime

2. **User Success**
   - ✅ 50+ memories uploaded oleh minimal 5 family members
   - ✅ 1 complete AI-generated family story
   - ✅ Positive feedback dari presentasi Ramadhan

3. **Business Success**
   - ✅ MVP ready before Ramadhan 2026
   - ✅ Clear monetization path identified
   - ✅ Positive user retention (70%+ return visit)

---

## 🚀 Development Phases

### Phase 1: Foundation (Week 1-2)
**The Memory Bank**
- Setup Supabase database
- Create data schema
- Implement authentication
- Build basic CRUD API

### Phase 2: Intelligence (Week 3-4)
**The Orchestration**
- Deploy Northflank backend
- Configure CrewAI agents
- Implement LangGraph workflows
- Integrate Hugging Face models

### Phase 3: Interface (Week 5-6)
**The Family Portal**
- Build Cloudflare Pages frontend
- Create responsive UI
- Implement upload functionality
- Build interactive family tree

### Phase 4: Launch (Week 7-8)
**The Celebration**
- Final testing
- Performance optimization
- Ramadhan presentation preparation
- User onboarding materials

---

## 🔐 API Keys & Secrets Required

| Platform | API Keys Needed | Purpose |
|----------|----------------|---------|
| **Supabase** | `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY` | Database access & auth |
| **Cloudflare** | `CF_API_TOKEN`, `CF_ACCOUNT_ID`, `CF_ZONE_ID` | Deployment & edge functions |
| **Northflank** | `NF_API_KEY` | CI/CD automation |
| **Hugging Face** | `HF_TOKEN` | AI model access |
| **OpenAI** | `OPENAI_API_KEY` (optional) | Advanced LLM features |

---

## 📁 Project Structure

```
webapp/
├── docs/                       # 📚 Documentation
│   ├── 01_PRD.md              # Product Requirements
│   ├── 02_ARCHITECTURE.md     # Technical Architecture
│   ├── 03_DATABASE_SCHEMA.md  # Database Design
│   ├── 04_API_DESIGN.md       # API Specifications
│   ├── 05_AGENT_MANIFEST.md   # AI Agents Configuration
│   └── 06_DEPLOYMENT.md       # Deployment Guide
├── src/                       # 💻 Backend Code
│   ├── index.tsx             # Hono app entry
│   ├── routes/               # API routes
│   ├── agents/               # CrewAI agents
│   ├── workflows/            # LangGraph workflows
│   └── types/                # TypeScript types
├── public/                    # 🎨 Frontend Assets
│   ├── static/
│   │   ├── app.js
│   │   ├── styles.css
│   │   └── components/
│   └── images/
├── migrations/                # 🗄️ Database Migrations
│   ├── 0001_initial_schema.sql
│   └── meta/
├── .github/                   # 🔄 CI/CD
│   └── workflows/
│       ├── deploy-cloudflare.yml
│       └── deploy-northflank.yml
├── .gitignore
├── .env.example
├── wrangler.jsonc
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🎯 Next Steps

1. ✅ Read this document thoroughly
2. 📖 Review detailed PRD (01_PRD.md)
3. 🏗️ Study architecture (02_ARCHITECTURE.md)
4. 🗄️ Setup Supabase database (03_DATABASE_SCHEMA.md)
5. 🔑 Collect all API keys
6. 🚀 Start Phase 1 execution

---

## 👥 Team

- **Founder & Orchestrator**: You 😌
- **Chief Architect & CTO**: AI Assistant (Claude)
- **Target Users**: Your Big Family 🌳

---

**Let's build something legendary, Founder! 🚀🙏🏻**
