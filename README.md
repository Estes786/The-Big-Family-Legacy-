# The Big Family Legacy 🌳

**Platform Warisan Digital Keluarga dengan AI - Hybrid Grandmaster Stack**

## 🌟 Overview

Platform untuk menyimpan, mengatur, dan menghidupkan kembali kenangan keluarga menggunakan kekuatan AI. Dengan **Hybrid Grandmaster Stack**, kami menggabungkan teknologi terbaik untuk memberikan pengalaman yang luar biasa.

## 🏗️ Architecture - Hybrid Grandmaster Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Cloudflare Pages | Global edge hosting yang super cepat |
| **Auth & DB** | Supabase | User authentication + PostgreSQL database |
| **Edge API** | Cloudflare Workers + Hono | Fast API gateway di edge network |
| **AI Memory** | Cloudflare Vectorize | Vector storage untuk RAG (Retrieval-Augmented Generation) |
| **AI Brain** | Groq AI | Llama 3 inference yang sangat cepat |
| **AI Gateway** | Cloudflare AI Gateway | Token caching & monitoring biaya |
| **AI Agents** | CrewAI + LangSmith | Agent orchestration + tracing |
| **Optional** | Koyeb | Python agents hosting (jika diperlukan) |

## 🚀 Live Demo

- **Frontend**: https://3000-iggkr3bvl9ax7ptz9xvc3-cc2fbc16.sandbox.novita.ai
- **API Health**: https://3000-iggkr3bvl9ax7ptz9xvc3-cc2fbc16.sandbox.novita.ai/api/health
- **GitHub**: https://github.com/Estes786/The-Big-Family-Legacy-.git

## ✨ Fitur Unggulan

### 1. 📤 Upload Kenangan
Upload foto, video, dan cerita keluarga dengan mudah menggunakan drag-and-drop interface

### 2. 🌲 Pohon Keluarga Interaktif
Visualisasi silsilah keluarga yang indah dan interaktif

### 3. 🤖 AI Story Generation
AI membuat cerita warisan yang indah dari kenangan yang Anda upload

### 4. 💬 Chat dengan Leluhur Digital
Ngobrol dengan digital ancestor menggunakan AI yang dilatih dari kenangan keluarga

### 5. 🔒 Aman & Private
Data keluarga Anda terlindungi dengan enkripsi end-to-end

### 6. 🌍 Global Access
Akses dari mana saja melalui Cloudflare Edge Network

## 🛠️ Tech Stack Details

### Frontend
- **Hono**: Lightweight, ultrafast web framework
- **Cloudflare Pages**: Global CDN deployment
- **Tailwind CSS**: Utility-first CSS framework
- **FontAwesome**: Beautiful icons

### Backend
- **Cloudflare Workers**: Serverless compute at the edge
- **Supabase**: PostgreSQL database + Authentication
- **Supabase JS Client**: Type-safe database access

### AI Layer
- **Groq AI**: Lightning-fast Llama 3 inference
- **Cloudflare AI Gateway**: Cost optimization & caching
- **Cloudflare Vectorize**: Vector database untuk RAG
- **CrewAI**: Multi-agent orchestration
- **LangSmith**: AI tracing & monitoring

### Optional Services
- **Koyeb**: Python agents hosting
- **Cloudflare R2**: Object storage for media files
- **Cloudflare D1**: SQLite at the edge (alternative)

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm 8+
- Git

### Setup

1. **Clone Repository**
```bash
git clone https://github.com/Estes786/The-Big-Family-Legacy-.git
cd The-Big-Family-Legacy-
```

2. **Install Dependencies**
```bash
npm install
```

3. **Configure Environment Variables**
```bash
# Copy .dev.vars.example to .dev.vars
cp .dev.vars.example .dev.vars

# Edit .dev.vars dan isi dengan credentials Anda
```

4. **Build Project**
```bash
npm run build
```

5. **Start Development Server**
```bash
# Menggunakan PM2 (Recommended)
npm run clean-port
pm2 start ecosystem.config.cjs

# Atau langsung dengan wrangler
npm run dev:sandbox
```

6. **Test**
```bash
curl http://localhost:3000/api/health
```

## 🔑 Environment Variables

### Required Credentials

#### Supabase
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
SUPABASE_JWT_SECRET=your-jwt-secret
SUPABASE_ACCESS_TOKEN=your-access-token
SUPABASE_ORG_SLUG=your-org-slug
```

#### Cloudflare
```bash
CLOUDFLARE_API_TOKEN=your-api-token
```

#### LangChain/LangSmith
```bash
LANGCHAIN_WORKFLOW_PAT=your-workflow-pat
LANGCHAIN_SERVICE_KEY=your-service-key
```

#### CrewAI
```bash
CREWAI_PAT=your-personal-access-token
CREWAI_ENTERPRISE_AUTH=your-enterprise-auth-token
CREWSHIP_KEY=your-crewship-key
```

#### Optional: Koyeb
```bash
KOYEB_API_KEY=your-api-key
```

#### GitHub
```bash
GITHUB_PAT=your-personal-access-token
GITHUB_REPO=https://github.com/Estes786/The-Big-Family-Legacy-.git
```

**⚠️ IMPORTANT**: Jangan commit file `.dev.vars` ke repository!

## 📡 API Endpoints

### Health Check
```bash
GET /api/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2026-02-17T18:29:53.638Z",
  "version": "1.0.0",
  "stack": "Cloudflare + Supabase + CrewAI + LangSmith",
  "services": {
    "supabase": "configured",
    "cloudflare": "active",
    "crewai": "configured",
    "langsmith": "configured"
  }
}
```

### Supabase Test
```bash
GET /api/supabase/test
```

### CrewAI Status
```bash
GET /api/crewai/status
```

### LangSmith Status
```bash
GET /api/langsmith/status
```

### Memories API (Coming Soon)
```bash
GET /api/memories
POST /api/memories/upload
```

### Family Tree API (Coming Soon)
```bash
GET /api/tree
```

### AI Story Generation (Coming Soon)
```bash
POST /api/story/generate
```

### Digital Ancestor Chat (Coming Soon)
```bash
POST /api/chat/message
```

## 🚀 Deployment

### Option 1: Manual GitHub Push

```bash
cd /home/user/webapp
git add .
git commit -m "feat: your commit message"
git push origin main
```

### Option 2: Cloudflare Pages Deployment

```bash
# Setup Cloudflare API token
export CLOUDFLARE_API_TOKEN=your-token

# Deploy to production
npm run deploy:prod
```

### Option 3: Using Wrangler CLI

```bash
# Deploy directly dengan wrangler
npm run build
npx wrangler pages deploy dist --project-name the-big-family-legacy
```

## 📊 Project Structure

```
the-big-family-legacy/
├── src/
│   ├── index.tsx              # Main Hono application
│   ├── routes/                # API route handlers
│   ├── types/                 # TypeScript type definitions
│   └── lib/                   # Utility libraries
├── public/
│   └── static/                # Static assets (images, etc.)
├── migrations/                # Database migrations
├── dist/                      # Build output
├── .dev.vars                  # Development environment variables (gitignored)
├── .gitignore                # Git ignore file
├── ecosystem.config.cjs       # PM2 configuration
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts            # Vite build configuration
├── wrangler.jsonc            # Cloudflare configuration
└── README.md                  # This file
```

## 🔧 Development Commands

```bash
# Development
npm run dev              # Start Vite dev server
npm run dev:sandbox      # Start wrangler pages dev server

# Build
npm run build            # Build for production

# Preview
npm run preview          # Preview production build

# Deployment
npm run deploy           # Deploy to Cloudflare Pages
npm run deploy:prod      # Deploy to production with project name

# Utilities
npm run clean-port       # Clean port 3000
npm run test             # Test local server
npm run cf-typegen       # Generate Cloudflare types

# Git
npm run git:init         # Initialize git repository
npm run git:commit       # Commit changes
npm run git:status       # Check git status
npm run git:log          # View commit history
```

## 📈 Project Status

### Current Phase: **Phase 3 - Frontend Complete** ✅

- ✅ Phase 1: Foundation (Project Setup, Architecture) - **COMPLETE**
- ✅ Phase 2: Documentation (PRD, Technical Docs) - **COMPLETE**
- ✅ Phase 3: Frontend Implementation - **COMPLETE**
  - ✅ Hono app dengan complete frontend
  - ✅ Landing page yang stunning
  - ✅ API structure ready
  - ✅ Responsive design dengan TailwindCSS
  - ✅ All credentials configured
- ⏳ Phase 4: Backend Integration (Supabase, CrewAI) - **IN PROGRESS**
- ⏳ Phase 5: AI Features (Groq, Vectorize, RAG) - **NEXT**
- ⏳ Phase 6: Testing & Launch (Ramadhan 2026) - **PENDING**

### Live URLs
- **Frontend Demo**: https://3000-iggkr3bvl9ax7ptz9xvc3-cc2fbc16.sandbox.novita.ai
- **API Health**: https://3000-iggkr3bvl9ax7ptz9xvc3-cc2fbc16.sandbox.novita.ai/api/health
- **GitHub Repo**: https://github.com/Estes786/The-Big-Family-Legacy-

### Statistics
- **Total Memories**: 0 (ready for backend integration!)
- **Family Members**: 0 (ready for Supabase connection!)
- **Generated Stories**: 0 (ready for CrewAI integration!)
- **Active Users**: 0 (waiting for auth implementation!)

## 🎯 Roadmap

### Phase 4: Backend Integration (Current)
- [ ] Implement Supabase authentication
- [ ] Create database schema
- [ ] Build real API endpoints
- [ ] Connect file upload to R2
- [ ] User management system

### Phase 5: AI Features
- [ ] Integrate Groq AI for chat
- [ ] Setup Cloudflare AI Gateway
- [ ] Implement Vectorize RAG
- [ ] Connect CrewAI agents
- [ ] Add LangSmith tracing
- [ ] Story generation feature
- [ ] Digital ancestor chat

### Phase 6: Polish & Launch
- [ ] Performance optimization
- [ ] Security audit
- [ ] User testing
- [ ] Documentation polish
- [ ] Ramadhan 2026 launch! 🌙

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see LICENSE file for details

## 📞 Contact

- **Live Demo**: https://3000-iggkr3bvl9ax7ptz9xvc3-cc2fbc16.sandbox.novita.ai
- **GitHub**: https://github.com/Estes786/The-Big-Family-Legacy-
- **Documentation**: See this README and `/docs` folder

## 🙏 Acknowledgments

- **Cloudflare** for amazing edge infrastructure
- **Supabase** for easy-to-use backend platform
- **CrewAI** for powerful agent orchestration
- **LangSmith** for AI observability
- **Hono** for the lightweight framework
- **Tailwind CSS** for beautiful styling

---

**Made with ❤️ and 🤖 AI**

**Target: Ramadhan 2026 🌙**

---

## 🔍 Troubleshooting

### Port 3000 Already in Use
```bash
npm run clean-port
# or
fuser -k 3000/tcp
```

### Build Errors
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

### PM2 Not Starting
```bash
# Check PM2 status
pm2 list

# View logs
pm2 logs --nostream

# Restart service
pm2 restart the-big-family-legacy
```

### Deployment Issues

#### GitHub Push Failed
- Make sure GitHub PAT is correctly configured
- Check repository permissions
- Verify remote URL is correct

#### Cloudflare Deployment Failed
- Verify CLOUDFLARE_API_TOKEN is set
- Check wrangler.jsonc configuration
- Ensure project name is available

## 🎓 Learn More

- [Hono Documentation](https://hono.dev/)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Supabase Docs](https://supabase.com/docs)
- [CrewAI Documentation](https://docs.crewai.com/)
- [LangSmith Docs](https://docs.smith.langchain.com/)

---

**Status**: ✅ PHASE 3 COMPLETE - Ready for Backend Integration

**Version**: 1.0.0

**Last Updated**: 2026-02-17
