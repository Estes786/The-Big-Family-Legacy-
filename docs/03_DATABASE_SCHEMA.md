# Database Schema Design
## THE BIG FAMILY LEGACY Platform

---

## 1. Schema Overview

### 1.1 Design Principles
- **Normalization**: 3NF to minimize redundancy
- **Scalability**: Indexed for performance at scale
- **Security**: Row-Level Security (RLS) on all tables
- **Audit**: Timestamps and soft deletes
- **Flexibility**: JSONB for extensible metadata

### 1.2 Database: PostgreSQL 15 (Supabase)

---

## 2. Entity Relationship Diagram (ERD)

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   profiles   │◄───────►│user_families │◄───────►│   families   │
└──────────────┘         └──────────────┘         └──────────────┘
       │                                                    │
       │                                                    │
       ▼                                                    ▼
┌──────────────┐                                  ┌──────────────┐
│conversations │                                  │family_members│
└──────────────┘                                  └──────────────┘
       │                                                    │
       │                                                    │
       ▼                                                    ▼
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   messages   │         │ relationships│         │   memories   │
└──────────────┘         └──────────────┘         └──────────────┘
                                                           │
                                                           │
                                                           ▼
                         ┌──────────────┐         ┌──────────────┐
                         │memory_tags   │◄────────┤memory_people │
                         └──────────────┘         └──────────────┘
                                │
                                ▼
                         ┌──────────────┐
                         │generated_    │
                         │  stories     │
                         └──────────────┘
```

---

## 3. Table Definitions

### 3.1 Core Tables

#### Table: `profiles`
**Purpose**: User accounts and authentication (extends Supabase auth.users)

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  preferences JSONB DEFAULT '{}'::jsonb
);

-- Indexes
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_is_active ON profiles(is_active);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

---

#### Table: `families`
**Purpose**: Family units that can have multiple members and users

```sql
CREATE TABLE families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  settings JSONB DEFAULT '{
    "privacy": "private",
    "allow_contributions": true,
    "require_approval": false
  }'::jsonb
);

-- Indexes
CREATE INDEX idx_families_created_by ON families(created_by);
CREATE INDEX idx_families_is_active ON families(is_active);

-- RLS Policies
ALTER TABLE families ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see families they belong to"
  ON families FOR SELECT
  USING (id IN (
    SELECT family_id FROM user_families WHERE user_id = auth.uid()
  ));

CREATE POLICY "Family admins can update"
  ON families FOR UPDATE
  USING (id IN (
    SELECT family_id FROM user_families 
    WHERE user_id = auth.uid() AND role = 'admin'
  ));
```

---

#### Table: `user_families`
**Purpose**: Many-to-many relationship between users and families with roles

```sql
CREATE TYPE family_role AS ENUM ('admin', 'editor', 'viewer');

CREATE TABLE user_families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  role family_role DEFAULT 'viewer',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  invited_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  UNIQUE(user_id, family_id)
);

-- Indexes
CREATE INDEX idx_user_families_user_id ON user_families(user_id);
CREATE INDEX idx_user_families_family_id ON user_families(family_id);
CREATE INDEX idx_user_families_role ON user_families(role);

-- RLS Policies
ALTER TABLE user_families ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own family memberships"
  ON user_families FOR SELECT
  USING (user_id = auth.uid() OR family_id IN (
    SELECT family_id FROM user_families WHERE user_id = auth.uid()
  ));
```

---

#### Table: `family_members`
**Purpose**: People in the family tree (may or may not have app accounts)

```sql
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other', 'unknown');

CREATE TABLE family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- NULL if not a user
  
  -- Basic Info
  first_name TEXT NOT NULL,
  middle_name TEXT,
  last_name TEXT,
  full_name TEXT GENERATED ALWAYS AS (
    TRIM(COALESCE(first_name, '') || ' ' || 
         COALESCE(middle_name, '') || ' ' || 
         COALESCE(last_name, ''))
  ) STORED,
  nickname TEXT,
  gender gender_type DEFAULT 'unknown',
  
  -- Life Dates
  birth_date DATE,
  birth_place TEXT,
  death_date DATE,
  death_place TEXT,
  is_deceased BOOLEAN DEFAULT FALSE,
  
  -- Media
  profile_photo_url TEXT,
  biography TEXT,
  
  -- Metadata
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Extensible data
  metadata JSONB DEFAULT '{}'::jsonb,
  
  CONSTRAINT valid_dates CHECK (
    (death_date IS NULL OR birth_date IS NULL) OR 
    (death_date > birth_date)
  )
);

-- Indexes
CREATE INDEX idx_family_members_family_id ON family_members(family_id);
CREATE INDEX idx_family_members_profile_id ON family_members(profile_id);
CREATE INDEX idx_family_members_full_name ON family_members(full_name);
CREATE INDEX idx_family_members_is_deceased ON family_members(is_deceased);
CREATE INDEX idx_family_members_birth_date ON family_members(birth_date);

-- Full-text search
CREATE INDEX idx_family_members_search ON family_members 
  USING GIN (to_tsvector('english', COALESCE(full_name, '') || ' ' || COALESCE(biography, '')));

-- RLS Policies
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see family members in their families"
  ON family_members FOR SELECT
  USING (family_id IN (
    SELECT family_id FROM user_families WHERE user_id = auth.uid()
  ));

CREATE POLICY "Editors can insert family members"
  ON family_members FOR INSERT
  WITH CHECK (family_id IN (
    SELECT family_id FROM user_families 
    WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
  ));

CREATE POLICY "Editors can update family members"
  ON family_members FOR UPDATE
  USING (family_id IN (
    SELECT family_id FROM user_families 
    WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
  ));
```

---

#### Table: `relationships`
**Purpose**: Define connections between family members (parent-child, spouse)

```sql
CREATE TYPE relationship_type AS ENUM (
  'parent',        -- person1 is parent of person2
  'child',         -- person1 is child of person2
  'spouse',        -- person1 is spouse of person2
  'sibling'        -- person1 is sibling of person2
);

CREATE TABLE relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  person1_id UUID REFERENCES family_members(id) ON DELETE CASCADE,
  person2_id UUID REFERENCES family_members(id) ON DELETE CASCADE,
  relationship_type relationship_type NOT NULL,
  
  -- Optional metadata
  start_date DATE,  -- Marriage date for spouses
  end_date DATE,    -- Divorce/death date
  notes TEXT,
  
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT different_persons CHECK (person1_id != person2_id),
  CONSTRAINT unique_relationship UNIQUE (person1_id, person2_id, relationship_type)
);

-- Indexes
CREATE INDEX idx_relationships_family_id ON relationships(family_id);
CREATE INDEX idx_relationships_person1_id ON relationships(person1_id);
CREATE INDEX idx_relationships_person2_id ON relationships(person2_id);
CREATE INDEX idx_relationships_type ON relationships(relationship_type);

-- RLS Policies
ALTER TABLE relationships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see relationships in their families"
  ON relationships FOR SELECT
  USING (family_id IN (
    SELECT family_id FROM user_families WHERE user_id = auth.uid()
  ));

CREATE POLICY "Editors can manage relationships"
  ON relationships FOR ALL
  USING (family_id IN (
    SELECT family_id FROM user_families 
    WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
  ));
```

---

### 3.2 Memory Tables

#### Table: `memories`
**Purpose**: Store uploaded photos, videos, stories, and documents

```sql
CREATE TYPE memory_type AS ENUM ('photo', 'video', 'story', 'document', 'audio');
CREATE TYPE memory_status AS ENUM ('uploaded', 'processing', 'ready', 'failed');

CREATE TABLE memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Content
  memory_type memory_type NOT NULL,
  title TEXT,
  description TEXT,
  content TEXT,  -- For text stories
  
  -- File info
  file_url TEXT,  -- Cloudflare R2 URL
  thumbnail_url TEXT,
  file_size_bytes BIGINT,
  mime_type TEXT,
  
  -- Temporal data
  memory_date DATE,  -- When this memory happened
  memory_year INT GENERATED ALWAYS AS (EXTRACT(YEAR FROM memory_date)::INT) STORED,
  
  -- Location
  location_name TEXT,
  location_coordinates POINT,  -- PostGIS for future map features
  
  -- AI Analysis Results
  ai_caption TEXT,
  ai_analysis JSONB DEFAULT '{}'::jsonb,  -- Flexible AI metadata
  detected_faces JSONB DEFAULT '[]'::jsonb,  -- [{person_id, confidence, bbox}]
  
  -- Metadata
  status memory_status DEFAULT 'uploaded',
  processing_error TEXT,
  view_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  
  -- EXIF and other metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes
CREATE INDEX idx_memories_family_id ON memories(family_id);
CREATE INDEX idx_memories_uploaded_by ON memories(uploaded_by);
CREATE INDEX idx_memories_type ON memories(memory_type);
CREATE INDEX idx_memories_date ON memories(memory_date);
CREATE INDEX idx_memories_year ON memories(memory_year);
CREATE INDEX idx_memories_status ON memories(status);
CREATE INDEX idx_memories_ai_analysis ON memories USING GIN (ai_analysis);

-- Full-text search
CREATE INDEX idx_memories_search ON memories 
  USING GIN (to_tsvector('english', 
    COALESCE(title, '') || ' ' || 
    COALESCE(description, '') || ' ' || 
    COALESCE(ai_caption, '')
  ));

-- RLS Policies
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see memories in their families"
  ON memories FOR SELECT
  USING (family_id IN (
    SELECT family_id FROM user_families WHERE user_id = auth.uid()
  ));

CREATE POLICY "Members can upload memories"
  ON memories FOR INSERT
  WITH CHECK (family_id IN (
    SELECT family_id FROM user_families WHERE user_id = auth.uid()
  ));

CREATE POLICY "Uploaders and admins can update memories"
  ON memories FOR UPDATE
  USING (
    uploaded_by = auth.uid() OR
    family_id IN (
      SELECT family_id FROM user_families 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
```

---

#### Table: `memory_people`
**Purpose**: Tag people in memories (many-to-many)

```sql
CREATE TABLE memory_people (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  memory_id UUID REFERENCES memories(id) ON DELETE CASCADE,
  person_id UUID REFERENCES family_members(id) ON DELETE CASCADE,
  
  -- AI confidence if auto-detected
  detection_confidence DECIMAL(3, 2),  -- 0.00 to 1.00
  is_confirmed BOOLEAN DEFAULT FALSE,  -- User confirmed the tag
  
  -- Face bounding box (if photo)
  face_bbox JSONB,  -- {x, y, width, height}
  
  tagged_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  tagged_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(memory_id, person_id)
);

-- Indexes
CREATE INDEX idx_memory_people_memory_id ON memory_people(memory_id);
CREATE INDEX idx_memory_people_person_id ON memory_people(person_id);

-- RLS Policies
ALTER TABLE memory_people ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see tags in their families"
  ON memory_people FOR SELECT
  USING (memory_id IN (
    SELECT id FROM memories WHERE family_id IN (
      SELECT family_id FROM user_families WHERE user_id = auth.uid()
    )
  ));
```

---

### 3.3 AI & Chat Tables

#### Table: `conversations`
**Purpose**: Chat sessions with digital ancestors

```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  ancestor_id UUID REFERENCES family_members(id) ON DELETE CASCADE,
  
  title TEXT,  -- Auto-generated or user-set
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Conversation context
  context_summary TEXT,  -- LLM-generated summary
  total_messages INT DEFAULT 0,
  
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes
CREATE INDEX idx_conversations_family_id ON conversations(family_id);
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_ancestor_id ON conversations(ancestor_id);
CREATE INDEX idx_conversations_last_message_at ON conversations(last_message_at DESC);

-- RLS Policies
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own conversations"
  ON conversations FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can start conversations"
  ON conversations FOR INSERT
  WITH CHECK (user_id = auth.uid());
```

---

#### Table: `messages`
**Purpose**: Individual messages in conversations

```sql
CREATE TYPE message_role AS ENUM ('user', 'assistant', 'system');

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  
  role message_role NOT NULL,
  content TEXT NOT NULL,
  
  -- AI metadata
  model_used TEXT,  -- 'gpt-4', 'llama-3.1-8b', etc.
  tokens_used INT,
  latency_ms INT,
  
  -- Source citations
  sources JSONB DEFAULT '[]'::jsonb,  -- [{memory_id, snippet}]
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- RLS Policies
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see messages in own conversations"
  ON messages FOR SELECT
  USING (conversation_id IN (
    SELECT id FROM conversations WHERE user_id = auth.uid()
  ));
```

---

#### Table: `generated_stories`
**Purpose**: AI-generated family narratives

```sql
CREATE TYPE story_status AS ENUM ('generating', 'ready', 'failed');

CREATE TABLE generated_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  generated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Story content
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  
  -- Story scope
  focus_person_id UUID REFERENCES family_members(id) ON DELETE CASCADE,
  included_people UUID[] DEFAULT '{}'::UUID[],  -- Array of person IDs
  included_memories UUID[] DEFAULT '{}'::UUID[],  -- Array of memory IDs
  
  -- Generation metadata
  status story_status DEFAULT 'generating',
  model_used TEXT,
  prompt_used TEXT,
  generation_time_ms INT,
  tokens_used INT,
  
  -- User interaction
  view_count INT DEFAULT 0,
  is_public BOOLEAN DEFAULT FALSE,
  is_favorite BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes
CREATE INDEX idx_generated_stories_family_id ON generated_stories(family_id);
CREATE INDEX idx_generated_stories_focus_person ON generated_stories(focus_person_id);
CREATE INDEX idx_generated_stories_status ON generated_stories(status);
CREATE INDEX idx_generated_stories_created_at ON generated_stories(created_at DESC);

-- Full-text search
CREATE INDEX idx_stories_search ON generated_stories 
  USING GIN (to_tsvector('english', 
    COALESCE(title, '') || ' ' || 
    COALESCE(content, '')
  ));

-- RLS Policies
ALTER TABLE generated_stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see stories in their families"
  ON generated_stories FOR SELECT
  USING (family_id IN (
    SELECT family_id FROM user_families WHERE user_id = auth.uid()
  ));
```

---

### 3.4 Audit & System Tables

#### Table: `audit_logs`
**Purpose**: Track all sensitive operations for security

```sql
CREATE TYPE audit_action AS ENUM (
  'create', 'update', 'delete', 'view', 'export', 'ai_process'
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  action audit_action NOT NULL,
  resource_type TEXT NOT NULL,  -- 'memory', 'family_member', 'story', etc.
  resource_id UUID,
  
  details JSONB DEFAULT '{}'::jsonb,
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_audit_logs_family_id ON audit_logs(family_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Partition by month for performance
CREATE TABLE audit_logs_2026_02 PARTITION OF audit_logs
  FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');

-- RLS: Only admins can view audit logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins see audit logs"
  ON audit_logs FOR SELECT
  USING (family_id IN (
    SELECT family_id FROM user_families 
    WHERE user_id = auth.uid() AND role = 'admin'
  ));
```

---

## 4. Functions & Triggers

### 4.1 Update Timestamps

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_families_updated_at
  BEFORE UPDATE ON families
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_family_members_updated_at
  BEFORE UPDATE ON family_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ... (repeat for other tables)
```

### 4.2 Auto-create Inverse Relationships

```sql
CREATE OR REPLACE FUNCTION create_inverse_relationship()
RETURNS TRIGGER AS $$
BEGIN
  -- When parent relationship is created, create child relationship
  IF NEW.relationship_type = 'parent' THEN
    INSERT INTO relationships (
      family_id, person1_id, person2_id, relationship_type, 
      start_date, notes, created_by
    ) VALUES (
      NEW.family_id, NEW.person2_id, NEW.person1_id, 'child',
      NEW.start_date, NEW.notes, NEW.created_by
    ) ON CONFLICT DO NOTHING;
  
  -- When child relationship is created, create parent relationship
  ELSIF NEW.relationship_type = 'child' THEN
    INSERT INTO relationships (
      family_id, person1_id, person2_id, relationship_type,
      start_date, notes, created_by
    ) VALUES (
      NEW.family_id, NEW.person2_id, NEW.person1_id, 'parent',
      NEW.start_date, NEW.notes, NEW.created_by
    ) ON CONFLICT DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_inverse_relationship
  AFTER INSERT ON relationships
  FOR EACH ROW EXECUTE FUNCTION create_inverse_relationship();
```

### 4.3 Update Conversation Last Message

```sql
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET 
    last_message_at = NEW.created_at,
    total_messages = total_messages + 1
  WHERE id = NEW.conversation_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_conversation_on_message
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION update_conversation_last_message();
```

---

## 5. Initial Data (Seed)

```sql
-- Insert default family for MVP testing
INSERT INTO families (id, name, description, created_by)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
  'The Smith Family',
  'Our big family legacy from 1945 to present',
  NULL
);

-- Insert sample family members
INSERT INTO family_members (family_id, first_name, last_name, birth_date, gender)
VALUES 
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'John', 'Smith', '1945-03-15', 'male'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Mary', 'Smith', '1948-07-22', 'female');
```

---

## 6. Migrations

### Migration File: `0001_initial_schema.sql`

```sql
-- This file should contain all the table definitions above
-- To be run with: npx supabase db push

-- 1. Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Create ENUMS
-- (all the CREATE TYPE statements)

-- 3. Create tables in dependency order
-- (all the CREATE TABLE statements)

-- 4. Create indexes
-- (all the CREATE INDEX statements)

-- 5. Enable RLS and create policies
-- (all the ALTER TABLE and CREATE POLICY statements)

-- 6. Create functions and triggers
-- (all the CREATE FUNCTION and CREATE TRIGGER statements)

-- 7. Insert seed data
-- (all the INSERT statements)
```

---

## 7. Database Access Patterns

### 7.1 Common Queries

**Get family tree for a family:**
```sql
SELECT 
  fm.id, fm.full_name, fm.birth_date, fm.death_date,
  fm.profile_photo_url, fm.is_deceased,
  r.relationship_type, r.person2_id
FROM family_members fm
LEFT JOIN relationships r ON fm.id = r.person1_id
WHERE fm.family_id = $1 AND fm.is_active = TRUE
ORDER BY fm.birth_date;
```

**Get memories for a person:**
```sql
SELECT m.*, array_agg(fm.full_name) as people_names
FROM memories m
JOIN memory_people mp ON m.id = mp.memory_id
JOIN family_members fm ON mp.person_id = fm.id
WHERE mp.person_id = $1 AND m.is_active = TRUE
GROUP BY m.id
ORDER BY m.memory_date DESC;
```

**Search across memories and people:**
```sql
SELECT 
  'memory' as type, id, title as name, ai_caption as description
FROM memories
WHERE 
  family_id = $1 AND
  to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || COALESCE(ai_caption, ''))
  @@ plainto_tsquery('english', $2)
UNION ALL
SELECT 
  'person' as type, id, full_name as name, biography as description
FROM family_members
WHERE 
  family_id = $1 AND
  to_tsvector('english', full_name || ' ' || COALESCE(biography, ''))
  @@ plainto_tsquery('english', $2)
LIMIT 20;
```

---

## 8. Performance Optimization

### 8.1 Connection Pooling
- Use Supabase Supavisor (Pgbouncer)
- Transaction mode for short queries
- Session mode for complex transactions

### 8.2 Indexing Strategy
- B-tree indexes for equality and range queries
- GIN indexes for JSONB and full-text search
- Composite indexes for common multi-column queries

### 8.3 Partitioning
- Partition `audit_logs` by month
- Consider partitioning `memories` by year (future)

---

## 9. Backup & Recovery

### 9.1 Automated Backups (Supabase)
- Daily automated backups (retained 7 days)
- Point-in-time recovery (PITR) available on Pro plan

### 9.2 Manual Backup
```bash
# Export schema
supabase db dump --schema public > schema.sql

# Export data
supabase db dump --data-only > data.sql
```

### 9.3 Restore Procedure
```bash
# Restore schema
psql $DATABASE_URL < schema.sql

# Restore data
psql $DATABASE_URL < data.sql
```

---

## 10. Data Governance

### 10.1 Data Retention
- User data: Retained indefinitely until user deletion
- Memories: Retained indefinitely
- Audit logs: Retained 12 months
- AI responses (cached): 1 hour TTL

### 10.2 Data Deletion
- Soft delete for most tables (is_active = FALSE)
- Hard delete only on explicit user request
- Cascade deletes for dependent records

### 10.3 GDPR Compliance
- Right to access: Export API
- Right to erasure: DELETE endpoint
- Right to rectification: UPDATE endpoint
- Data portability: JSON/CSV export

---

**Status**: ✅ APPROVED - Ready for API Design

**Next Document**: [04_API_DESIGN.md](./04_API_DESIGN.md)
