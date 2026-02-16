# Technical Architecture Document
## THE BIG FAMILY LEGACY Platform

---

## 1. Architecture Overview

### 1.1 Architecture Pattern
**Modular Edge-First Microservices Architecture**

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER DEVICES                              │
│              (Mobile, Tablet, Desktop Browsers)                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                  1. THE ENTRY & SHIELD LAYER                     │
│                       Cloudflare Edge                            │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐  │
│  │     DNS      │   CDN/Cache  │     WAF      │  AI Gateway  │  │
│  │  Management  │              │   Security   │  (Rate Limit)│  │
│  └──────────────┴──────────────┴──────────────┴──────────────┘  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                  2. THE FRONTEND LAYER                           │
│                   Cloudflare Pages                               │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Hono SSR + Static Assets (HTML/CSS/JS)                  │   │
│  │  - Upload Interface                                      │   │
│  │  - Family Tree Visualization                             │   │
│  │  - Chat Interface                                        │   │
│  │  - Dashboard                                             │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                  3. THE API LAYER                                │
│                  Hono REST API (Northflank)                      │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐  │
│  │ Auth API     │ Memory API   │ Tree API     │  Chat API    │  │
│  │ /api/auth/*  │ /api/memory/*│ /api/tree/*  │ /api/chat/*  │  │
│  └──────────────┴──────────────┴──────────────┴──────────────┘  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                  4. THE COGNITIVE LAYER                          │
│              AI Orchestration (Northflank)                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  LangGraph State Management                              │   │
│  │  ┌────────────┬────────────┬────────────┬────────────┐   │   │
│  │  │ Genealogist│  Memory    │ Biographer │  Privacy   │   │   │
│  │  │   Agent    │  Curator   │   Agent    │   Guard    │   │   │
│  │  │ (CrewAI)   │ (CrewAI)   │ (CrewAI)   │ (CrewAI)   │   │   │
│  │  └────────────┴────────────┴────────────┴────────────┘   │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                  5. THE AI MODEL LAYER                           │
│                    Hugging Face Hub                              │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐  │
│  │ Vision AI    │ Face Detect  │  LLM (GPT)   │  Embedding   │  │
│  │ (BLIP-2)     │ (RetinaFace) │ (Llama/GPT-4)│  (BGE-M3)    │  │
│  └──────────────┴──────────────┴──────────────┴──────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                  6. THE DATA LAYER                               │
│                                                                  │
│  ┌────────────────────────┬──────────────────────────────────┐  │
│  │  Supabase PostgreSQL   │    Cloudflare Storage            │  │
│  │  ┌──────────────────┐  │  ┌──────────────┬─────────────┐ │  │
│  │  │ Structured Data  │  │  │ R2 Storage   │ KV Cache    │ │  │
│  │  │ - Users          │  │  │ (Photos/     │ (AI         │ │  │
│  │  │ - Profiles       │  │  │  Videos)     │  Responses) │ │  │
│  │  │ - Relationships  │  │  └──────────────┴─────────────┘ │  │
│  │  │ - Memories       │  │                                  │  │
│  │  │ - Conversations  │  │                                  │  │
│  │  └──────────────────┘  │                                  │  │
│  └────────────────────────┴──────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Component Responsibilities

### 2.1 Layer 1: The Entry & Shield (Cloudflare)

**Master Ruling**: All traffic must pass through this layer first

**Components**:
- **DNS Management**: Route traffic to correct services
- **CDN**: Cache static assets globally for < 50ms latency
- **WAF (Web Application Firewall)**: Block malicious requests
- **AI Gateway**: Monitor, rate-limit, and cache AI requests

**Responsibilities**:
- ✅ DDoS protection
- ✅ SSL/TLS termination
- ✅ Geographic routing
- ✅ Bot detection
- ✅ Rate limiting (100 req/min per IP)
- ✅ AI request caching (reduce costs)

**Technology**:
- Cloudflare Pages (Frontend hosting)
- Cloudflare Workers (Edge functions)
- Cloudflare AI Gateway (AI request proxy)
- Cloudflare WAF (Security rules)

---

### 2.2 Layer 2: The Frontend (Cloudflare Pages)

**Master Ruling**: Stateless, mobile-first, progressive enhancement

**Components**:
- **Hono SSR**: Server-side rendering for initial load
- **Static Assets**: HTML, CSS, JavaScript
- **Upload Interface**: Drag-and-drop file upload
- **Family Tree**: Interactive D3.js/Cytoscape.js visualization
- **Chat UI**: Real-time-like chat interface (polling)

**Responsibilities**:
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Progressive Web App (PWA) capabilities
- ✅ Offline-first for viewing cached data
- ✅ Accessible UI (WCAG 2.1 AA)
- ✅ Fast Time-to-Interactive (< 2s)

**Technology**:
- Hono (Web framework)
- TailwindCSS (Styling)
- Vanilla JavaScript / Alpine.js (Interactivity)
- D3.js / Cytoscape.js (Family tree visualization)
- Axios (HTTP client)

---

### 2.3 Layer 3: The API Layer (Northflank)

**Master Ruling**: RESTful, versioned, secure by default

**API Endpoints**:

#### Authentication API (`/api/v1/auth/*`)
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login with credentials
- `POST /api/v1/auth/logout` - Logout
- `POST /api/v1/auth/reset-password` - Reset password

#### Memory API (`/api/v1/memory/*`)
- `POST /api/v1/memory/upload` - Upload photo/video/story
- `GET /api/v1/memory/list` - List all memories
- `GET /api/v1/memory/:id` - Get specific memory
- `PUT /api/v1/memory/:id` - Update memory metadata
- `DELETE /api/v1/memory/:id` - Delete memory
- `POST /api/v1/memory/:id/analyze` - Trigger AI analysis

#### Tree API (`/api/v1/tree/*`)
- `GET /api/v1/tree/full` - Get complete family tree
- `GET /api/v1/tree/person/:id` - Get person and direct relations
- `POST /api/v1/tree/relation` - Add relationship
- `PUT /api/v1/tree/person/:id` - Update person profile
- `DELETE /api/v1/tree/person/:id` - Remove person (soft delete)

#### Chat API (`/api/v1/chat/*`)
- `POST /api/v1/chat/start` - Start new conversation
- `POST /api/v1/chat/message` - Send message to AI ancestor
- `GET /api/v1/chat/history/:conversationId` - Get chat history
- `DELETE /api/v1/chat/:conversationId` - Delete conversation

#### Story API (`/api/v1/story/*`)
- `POST /api/v1/story/generate` - Generate AI story
- `GET /api/v1/story/list` - List generated stories
- `GET /api/v1/story/:id` - Get specific story
- `PUT /api/v1/story/:id` - Edit story
- `POST /api/v1/story/:id/export` - Export as PDF

**Technology**:
- Hono (API framework)
- TypeScript (Type safety)
- JWT (Authentication)
- Zod (Request validation)
- Northflank (Container hosting)

---

### 2.4 Layer 4: The Cognitive Layer (AI Orchestration)

**Master Ruling**: Stateful workflows, modular agents, human-in-the-loop

**Components**:

#### LangGraph Workflows
1. **Memory Processing Workflow**
   ```
   [Upload] → [Privacy Guard] → [Memory Curator] → [Store] → [Notify]
   ```

2. **Story Generation Workflow**
   ```
   [Request] → [Genealogist] → [Memory Curator] → [Biographer] → [Review] → [Save]
   ```

3. **Chat Workflow**
   ```
   [Message] → [Context Retrieval] → [LLM Generation] → [Privacy Guard] → [Response]
   ```

#### CrewAI Agents

**Agent 1: The Genealogist**
- **Role**: Silsilah Specialist
- **Goal**: Build accurate family tree structure
- **Tools**: Database query, relationship validator
- **Backstory**: "Expert in genealogy with 20 years of experience"
- **Tasks**:
  - Validate parent-child relationships
  - Detect inconsistencies (e.g., person born before their parent)
  - Suggest missing relationships based on data
  - Calculate family tree statistics

**Agent 2: The Memory Curator**
- **Role**: Story & Context Analyst
- **Goal**: Extract meaning from media files
- **Tools**: Vision AI, face detection, OCR, metadata extraction
- **Backstory**: "Museum curator with expertise in historical context"
- **Tasks**:
  - Analyze photos with Vision AI (BLIP-2)
  - Detect faces and suggest identities
  - Estimate time period from visual cues
  - Extract location from EXIF data or visual landmarks
  - Generate descriptive captions

**Agent 3: The Biographer**
- **Role**: Narrative Writer
- **Goal**: Create emotional, cohesive stories
- **Tools**: LLM (GPT-4/Claude), memory database
- **Backstory**: "Professional biographer who wrote 100+ family histories"
- **Tasks**:
  - Synthesize multiple memories into one narrative
  - Add historical context (e.g., "This was during the 1998 crisis")
  - Adjust tone (formal, casual, emotional)
  - Structure stories with beginning, middle, end
  - Generate titles and summaries

**Agent 4: The Privacy Guard**
- **Role**: Compliance Officer
- **Goal**: Protect sensitive family data
- **Tools**: PII detection, data redaction
- **Backstory**: "Privacy advocate with legal background"
- **Tasks**:
  - Detect PII (ID numbers, addresses, phone numbers)
  - Flag sensitive content before AI processing
  - Redact data in AI responses
  - Log all data access for audit
  - Ensure GDPR/privacy compliance

**Agent 5: The Archivist** (Future)
- **Role**: Data Organizer
- **Goal**: Structure chaotic input data
- **Tools**: NLP, clustering, duplicate detection

**Agent 6: The Historian** (Future)
- **Role**: Context Researcher
- **Goal**: Enrich stories with historical facts
- **Tools**: Web search, knowledge bases

**Technology**:
- CrewAI (Multi-agent framework)
- LangGraph (Workflow orchestration)
- LangChain (LLM integration)
- Celery/BullMQ (Job queue for async processing)

---

### 2.5 Layer 5: The AI Model Layer (Hugging Face)

**Master Ruling**: Open-source first, cost-effective, swappable models

**Models Used**:

| Use Case | Model | Provider | Cost |
|----------|-------|----------|------|
| **Image Captioning** | BLIP-2 | Salesforce | Free (Inference API) |
| **Face Detection** | RetinaFace | Open Source | Free |
| **Text Generation** | Llama 3.1 8B / GPT-4o-mini | Meta / OpenAI | $0.15/1M tokens |
| **Embeddings** | BGE-M3 | BAAI | Free |
| **OCR** | TrOCR | Microsoft | Free |
| **Voice Clone** | Coqui TTS | Coqui | Free (Future) |

**Integration Pattern**:
```typescript
// Hugging Face Inference API
import { HfInference } from '@huggingface/inference'

const hf = new HfInference(process.env.HF_TOKEN)

// Image captioning
const caption = await hf.imageToText({
  model: 'Salesforce/blip-image-captioning-large',
  data: imageBuffer
})

// Text generation
const story = await hf.textGeneration({
  model: 'meta-llama/Llama-3.1-8B-Instruct',
  inputs: prompt,
  parameters: {
    max_new_tokens: 500,
    temperature: 0.7
  }
})
```

**Cost Optimization**:
- Use Cloudflare AI Gateway to cache responses
- Implement request deduplication
- Use smaller models for simple tasks
- Batch processing when possible

---

### 2.6 Layer 6: The Data Layer

#### 6.1 Supabase PostgreSQL (Structured Data)

**Master Ruling**: Single source of truth, strongly typed, row-level security

**Core Tables**: (See 03_DATABASE_SCHEMA.md for details)
- `profiles` - User accounts
- `family_members` - People in family tree
- `relationships` - Parent-child, spouse connections
- `memories` - Photos, videos, stories
- `conversations` - Chat history
- `generated_stories` - AI-generated narratives

**Security**:
- Row-Level Security (RLS) enabled on all tables
- Users can only see their own family data
- Service role for backend operations
- Audit logs for sensitive operations

**Technology**:
- PostgreSQL 15
- Supabase Auth (JWT-based)
- Supabase Storage (future: move to R2)
- PostGIS (future: location-based queries)

#### 6.2 Cloudflare R2 (Object Storage)

**Master Ruling**: S3-compatible, cost-effective, edge-cached

**Buckets**:
- `family-photos` - Original uploaded photos
- `family-videos` - Original uploaded videos
- `thumbnails` - Generated thumbnails (256x256, 512x512)
- `exports` - Generated PDFs, ZIP archives

**File Naming Convention**:
```
{user_id}/{memory_id}/{timestamp}_{filename}.{ext}
Example: 123e4567/abc123/1706284800_grandpa_birthday.jpg
```

**Lifecycle Policy**:
- Original files: Retained forever
- Thumbnails: Regenerated on demand, cached 90 days
- Exports: Deleted after 7 days

#### 6.3 Cloudflare KV (Cache)

**Master Ruling**: Eventual consistency, high-read workloads only

**Use Cases**:
- AI response caching (TTL: 1 hour)
- Family tree data (TTL: 5 minutes)
- User session data (TTL: 24 hours)

**Key Patterns**:
```
ai:caption:{image_hash} → "A vintage photo of..."
tree:user:{user_id} → {family_tree_json}
session:{session_id} → {user_data}
```

---

## 3. Data Flow Examples

### 3.1 User Uploads Photo

```
1. User drags photo to upload interface (Frontend)
   ↓
2. Frontend sends POST /api/v1/memory/upload with multipart/form-data
   ↓
3. API Layer (Northflank):
   - Validates file type and size
   - Uploads to Cloudflare R2
   - Creates memory record in Supabase
   - Enqueues AI analysis job
   ↓
4. AI Orchestration (Background job):
   - Privacy Guard checks for sensitive data
   - Memory Curator analyzes photo:
     * Extract EXIF metadata (date, location)
     * Generate caption with BLIP-2
     * Detect faces with RetinaFace
     * Suggest person identities
   - Store results in Supabase
   ↓
5. User receives real-time notification:
   - "We found 3 people in this photo. Is this Grandpa Joe?"
```

### 3.2 User Generates Family Story

```
1. User clicks "Generate Story" for Grandpa Joe (Frontend)
   ↓
2. Frontend sends POST /api/v1/story/generate { person_id: 123 }
   ↓
3. API Layer validates request and starts LangGraph workflow
   ↓
4. LangGraph Orchestration:
   
   Step 1: Genealogist Agent
   - Query all relationships for person_id=123
   - Build family context (parents, siblings, children)
   
   Step 2: Memory Curator Agent
   - Fetch all memories related to person_id=123
   - Summarize key moments and themes
   
   Step 3: Biographer Agent
   - Combine context + memories
   - Generate narrative with GPT-4/Llama
   - Add historical context
   
   Step 4: Privacy Guard Agent
   - Scan for PII and sensitive info
   - Redact if necessary
   ↓
5. Story saved to database and returned to user
   ↓
6. User can edit, regenerate, or export as PDF
```

### 3.3 User Chats with Digital Ancestor

```
1. User types: "Grandpa, tell me about your childhood"
   ↓
2. Frontend sends POST /api/v1/chat/message
   ↓
3. API Layer retrieves conversation context from Supabase
   ↓
4. Chat Workflow (LangGraph):
   
   Step 1: Context Retrieval
   - Fetch Grandpa's profile, memories, and previous stories
   - Create RAG (Retrieval-Augmented Generation) context
   
   Step 2: LLM Generation
   - System prompt: "You are Grandpa Joe, born 1945..."
   - User message + context → GPT-4
   - Generate response in Grandpa's voice
   
   Step 3: Privacy Guard
   - Ensure no fabricated sensitive info
   - Add disclaimer if data is uncertain
   ↓
5. Response: "Ah, my childhood... I grew up in Bandung during the 1950s..."
   ↓
6. Response cached in KV (1 hour) and saved to conversations table
```

---

## 4. Deployment Architecture

### 4.1 Development Environment

```
Developer Laptop
├── Frontend: npm run dev (Vite)
├── Backend: npm run dev:api (Hono + TypeScript)
├── Database: Supabase cloud instance
├── Storage: Cloudflare R2 (shared dev bucket)
└── AI: Hugging Face Inference API
```

### 4.2 Staging Environment

```
Staging
├── Frontend: Cloudflare Pages (staging.family-legacy.pages.dev)
├── Backend: Northflank (staging environment)
├── Database: Supabase (separate staging project)
├── Storage: Cloudflare R2 (staging bucket)
└── AI: Hugging Face (same API, rate-limited)
```

### 4.3 Production Environment

```
Production
├── Frontend: Cloudflare Pages (family-legacy.pages.dev)
│   └── Custom domain: www.bigfamilylegacy.com
├── Backend: Northflank (3 replicas, auto-scaling)
├── Database: Supabase (production project, daily backups)
├── Storage: Cloudflare R2 (prod bucket, lifecycle policies)
└── AI: Hugging Face + OpenAI (load-balanced)
```

---

## 5. Security Architecture

### 5.1 Authentication Flow

```
User Login
   ↓
Supabase Auth (JWT issued)
   ↓
Frontend stores JWT in httpOnly cookie
   ↓
All API requests include JWT in Authorization header
   ↓
API validates JWT with Supabase public key
   ↓
Extract user_id from JWT
   ↓
Row-Level Security enforces data access
```

### 5.2 Data Access Control

**Principle**: Zero-trust, least privilege

| Role | Permissions |
|------|-------------|
| **Anonymous** | View public demo only |
| **Member** | View own family data, upload memories |
| **Admin** | Full CRUD on family data, invite members |
| **Service** | Backend-only role for AI processing |

**Supabase RLS Policies**:
```sql
-- Members can only see their own family data
CREATE POLICY "Users see own family"
ON family_members FOR SELECT
USING (family_id IN (
  SELECT family_id FROM user_families WHERE user_id = auth.uid()
));

-- Only admins can delete
CREATE POLICY "Only admins delete"
ON family_members FOR DELETE
USING (EXISTS (
  SELECT 1 FROM user_families 
  WHERE user_id = auth.uid() 
  AND family_id = family_members.family_id 
  AND role = 'admin'
));
```

### 5.3 AI Security

**Privacy Guard Agent Rules**:
1. ✅ Never send raw PII to external AI models
2. ✅ Anonymize data before processing (replace names with placeholders)
3. ✅ Log all AI requests for audit
4. ✅ Rate limit per user (100 AI requests/day)
5. ✅ Flag and review high-risk content

**Cloudflare AI Gateway Configuration**:
```jsonc
{
  "rate_limiting": {
    "requests_per_minute": 10,
    "requests_per_day": 1000
  },
  "caching": {
    "enabled": true,
    "ttl": 3600
  },
  "logging": {
    "enabled": true,
    "pii_redaction": true
  }
}
```

---

## 6. Scalability & Performance

### 6.1 Performance Targets

| Metric | Target | Strategy |
|--------|--------|----------|
| **Page Load** | < 2s | CDN caching, code splitting |
| **API Response** | < 500ms | Database indexing, connection pooling |
| **AI Response** | < 5s | Model optimization, caching |
| **Upload Speed** | > 5 MB/s | Direct R2 upload with presigned URLs |

### 6.2 Scalability Strategy

**Horizontal Scaling**:
- Northflank: Auto-scale 1-10 instances based on CPU
- Database: Supabase connection pooler (Supavisor)
- Storage: Cloudflare R2 (unlimited scalability)

**Vertical Scaling**:
- Database: Upgrade Supabase plan as data grows
- AI: Use larger models only when needed

**Caching Strategy**:
```
L1: Browser cache (static assets, 1 week)
L2: Cloudflare CDN (edge cache, 1 hour)
L3: Cloudflare KV (AI responses, 1 hour)
L4: Database query cache (5 minutes)
```

---

## 7. Monitoring & Observability

### 7.1 Metrics to Track

**Application Metrics**:
- Request rate (req/s)
- Error rate (%)
- Response time (p50, p95, p99)
- Active users (concurrent)

**Business Metrics**:
- Memories uploaded (per day)
- AI stories generated (per day)
- User retention (7-day, 30-day)
- Conversion rate (free → premium)

**Infrastructure Metrics**:
- CPU usage (%)
- Memory usage (%)
- Database connections (active)
- Storage used (GB)

### 7.2 Tools

- **Cloudflare Analytics** - Traffic, security events
- **Supabase Dashboard** - Database performance
- **Northflank Logs** - Application logs
- **Sentry** - Error tracking (future)
- **PostHog** - Product analytics (future)

---

## 8. Disaster Recovery

### 8.1 Backup Strategy

| Data Type | Backup Frequency | Retention | Storage |
|-----------|------------------|-----------|---------|
| **Database** | Daily (automated) | 30 days | Supabase |
| **Media Files** | Real-time (R2) | Indefinite | R2 + Glacier (future) |
| **Code** | Every commit | Indefinite | GitHub |
| **Secrets** | Manual export | N/A | 1Password (encrypted) |

### 8.2 Recovery Procedures

**Scenario 1: Database Corruption**
1. Stop all writes to database
2. Restore from most recent backup (< 24h old)
3. Replay transactions from Supabase WAL logs
4. Verify data integrity
5. Resume operations

**Scenario 2: Complete Service Outage**
1. Activate DR plan (< 15 minutes)
2. Switch DNS to backup Cloudflare zone
3. Restore database from backup
4. Redeploy services to backup Northflank region
5. Verify all systems operational
6. Communicate with users

**RTO (Recovery Time Objective)**: 1 hour  
**RPO (Recovery Point Objective)**: 24 hours

---

## 9. Technology Decision Rationale

### Why Cloudflare?
- ✅ Best-in-class global CDN
- ✅ Generous free tier (unlimited bandwidth)
- ✅ Integrated security (WAF, DDoS)
- ✅ AI Gateway for cost control
- ✅ R2 storage cheaper than S3

### Why Northflank?
- ✅ Always-on free tier (no sleep like Heroku)
- ✅ Docker-native (easy CrewAI deployment)
- ✅ Built-in CI/CD
- ✅ Multiple cloud regions
- ✅ Developer-friendly interface

### Why Supabase?
- ✅ PostgreSQL with modern DX
- ✅ Built-in auth and RLS
- ✅ Real-time subscriptions (future)
- ✅ Generous free tier (500MB)
- ✅ Self-hostable (exit strategy)

### Why Hugging Face?
- ✅ Largest open-source model hub
- ✅ Free inference API for small models
- ✅ Easy model swapping
- ✅ Active community
- ✅ ZeroGPU for free GPU access

### Why CrewAI + LangGraph?
- ✅ Modern agentic AI framework
- ✅ Better than single LLM calls
- ✅ Modular and testable
- ✅ State management with LangGraph
- ✅ Human-in-the-loop support

---

## 10. Future Architecture Enhancements

### Short-term (3-6 months)
- [ ] Add Redis for session management
- [ ] Implement WebSocket for real-time chat
- [ ] Add Elasticsearch for full-text search
- [ ] Set up monitoring with Grafana

### Long-term (6-12 months)
- [ ] Multi-region deployment
- [ ] Edge AI inference (Cloudflare AI)
- [ ] Vector database for semantic search (Pinecone)
- [ ] Implement event sourcing pattern
- [ ] Native mobile apps (React Native)

---

**Status**: ✅ APPROVED - Ready for Database Design

**Next Document**: [03_DATABASE_SCHEMA.md](./03_DATABASE_SCHEMA.md)
