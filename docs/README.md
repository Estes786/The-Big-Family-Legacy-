# THE BIG FAMILY LEGACY 🌳

**Platform Warisan Digital Keluarga dengan AI**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?logo=cloudflare&logoColor=white)](https://cloudflare.com)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://typescriptlang.org)

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

## ✨ Fitur Utama

### MVP (Saat Ini)
- ✅ Memory Bank - Upload dan simpan foto/video/cerita
- ✅ AI Story Generator - Narasi otomatis dari memori keluarga
- ✅ Interactive Family Tree - Silsilah yang clickable
- ✅ Digital Ancestor Chat - Berbicara dengan AI kakek/nenek
- ✅ Privacy Guard - Keamanan data dengan RLS

### Roadmap
- 🔜 AI-Generated Legacy Book (PDF export)
- 🔜 Voice Cloning untuk anggota keluarga
- 🔜 Timeline Events kronologis
- 🔜 Multi-family collaboration
- 🔜 Mobile apps (iOS/Android)

---

## 🏗️ Teknologi Stack

### Frontend
- **Hono** - Web framework lightweight
- **Cloudflare Pages** - Static hosting & CDN
- **TailwindCSS** - Styling
- **Vanilla JS** - Frontend logic

### Backend
- **Hono API** - RESTful endpoints
- **Northflank** - Container hosting
- **TypeScript** - Type-safe code

### AI Layer
- **CrewAI** - Multi-agent orchestration
- **LangGraph** - Workflow management
- **Hugging Face** - Open-source AI models
- **OpenAI** - Advanced LLM (optional)

### Database
- **Supabase** - PostgreSQL + Auth
- **Cloudflare R2** - Object storage
- **Cloudflare KV** - Edge cache

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Git
- Accounts: Cloudflare, Supabase, Northflank, Hugging Face

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/webapp.git
cd webapp
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
```bash
cp .env.example .dev.vars
# Edit .dev.vars with your API keys
```

### 4. Setup Database
```bash
# Create Supabase project at supabase.com
# Then run migrations
npm run db:migrate:local
npm run db:seed
```

### 5. Start Development Server
```bash
npm run build  # Initial build
npm run dev:sandbox  # Start local dev server
```

Visit: `http://localhost:3000`

---

## 📚 Dokumentasi Lengkap

Dokumentasi teknis terstruktur tersedia di folder root:

1. **[00_PROJECT_OVERVIEW.md](./00_PROJECT_OVERVIEW.md)** - Vision, features, roadmap
2. **[01_PRD.md](./01_PRD.md)** - Product Requirements Document
3. **[02_ARCHITECTURE.md](./02_ARCHITECTURE.md)** - Technical architecture
4. **[03_DATABASE_SCHEMA.md](./03_DATABASE_SCHEMA.md)** - Database design
5. **[04_API_DESIGN.md](./04_API_DESIGN.md)** - API specifications
6. **[05_AGENT_MANIFEST.md](./05_AGENT_MANIFEST.md)** - AI agents configuration
7. **[06_DEPLOYMENT.md](./06_DEPLOYMENT.md)** - Deployment guide

---

## 🌐 Deployment

### Production URLs
- **Frontend**: https://webapp.pages.dev
- **API**: https://webapp.pages.dev/api/v1
- **Status**: 🟢 Active

### Quick Deploy

```bash
# Build
npm run build

# Deploy to Cloudflare Pages
npm run deploy

# Or deploy with specific project name
npm run deploy:prod
```

**Catatan**: Sebelum deploy, jalankan `setup_cloudflare_api_key` untuk autentikasi.

---

## 📁 Project Structure

```
webapp/
├── docs/                   # 📚 Complete documentation
├── src/                    # 💻 Backend code (Hono)
│   ├── index.tsx          # App entry point
│   ├── routes/            # API routes
│   ├── agents/            # CrewAI agents
│   └── types/             # TypeScript types
├── public/                 # 🎨 Frontend assets
│   └── static/
│       ├── app.js
│       └── styles.css
├── migrations/             # 🗄️ Database migrations
├── .github/workflows/      # 🔄 CI/CD pipelines
├── wrangler.jsonc         # Cloudflare config
├── package.json
└── README.md
```

---

## 🔑 Environment Variables

### Required for Local Dev

```bash
# Database
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_KEY=eyJhbGc...

# AI
HF_TOKEN=hf_xxxxx
OPENAI_API_KEY=sk-xxxxx  # Optional

# Cloudflare
CF_ACCOUNT_ID=xxxxx
CF_API_TOKEN=xxxxx
```

Lihat `.env.example` untuk template lengkap.

---

## 🧪 Testing

```bash
# Run tests
npm test

# E2E tests
npm run test:e2e

# Check types
npm run type-check

# Lint
npm run lint
```

---

## 🤝 Contributing

Contributions are welcome! Untuk saat ini project ini adalah family project internal.

### Development Workflow
1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'feat: Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open Pull Request

### Commit Convention
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code formatting
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

---

## 📊 Project Status

### Current Phase: **Phase 2 - Intelligence Layer** (Week 3-4)

- ✅ Phase 1: Foundation (Database, Auth, Basic API) - COMPLETE
- 🔄 Phase 2: Intelligence (CrewAI, LangGraph, AI Integration) - IN PROGRESS
- ⏳ Phase 3: Interface (Frontend UI, Family Tree) - PENDING
- ⏳ Phase 4: Launch (Testing, Optimization, Ramadhan Prep) - PENDING

### Statistics
- **Total Memories**: 0 (ready for family input!)
- **Family Members**: 0 (ready to build tree!)
- **Generated Stories**: 0 (AI ready to write!)
- **Active Users**: 0 (waiting for launch!)

---

## 📈 Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| Page Load | < 2s | - |
| API Response | < 500ms | - |
| AI Generation | < 5s | - |
| Uptime | 99.9% | - |

---

## 🔒 Security

- ✅ HTTPS enforced
- ✅ JWT authentication
- ✅ Row-Level Security (RLS)
- ✅ Cloudflare WAF
- ✅ API rate limiting
- ✅ Privacy Guard AI agent

**Security Issues**: Report to [security@bigfamilylegacy.dev](mailto:security@bigfamilylegacy.dev)

---

## 📝 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 👥 Team

- **Founder & Orchestrator**: You 😌
- **Chief Architect & CTO**: AI Assistant (Claude)
- **Target Users**: Your Big Family 🌳

---

## 🎯 Mission

> "Melestarikan warisan keluarga untuk generasi mendatang, membuat sejarah keluarga menjadi hidup dan mudah diakses melalui teknologi AI."

---

## 📞 Contact

- **Website**: https://webapp.pages.dev
- **Email**: hello@bigfamilylegacy.dev
- **GitHub**: https://github.com/yourusername/webapp

---

## 🙏 Acknowledgments

- Cloudflare for generous free tier
- Supabase for amazing developer experience
- Northflank for always-on sandbox
- Hugging Face for open-source AI models
- Our big family for inspiration ❤️

---

**Made with ❤️ for family reunions**

**Target: Ramadhan 2026 🌙**
