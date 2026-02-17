-- ============================================
-- THE BIG FAMILY LEGACY - Initial Database Schema
-- Version: 1.0.0
-- Date: 2026-02-17
-- Description: Complete database schema for family legacy platform
-- ============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================
-- CUSTOM TYPES
-- ============================================

CREATE TYPE family_role AS ENUM ('admin', 'editor', 'viewer');
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other', 'unknown');
CREATE TYPE relationship_type AS ENUM ('parent', 'child', 'spouse', 'sibling');
CREATE TYPE memory_type AS ENUM ('photo', 'video', 'document', 'audio', 'other');
CREATE TYPE message_role AS ENUM ('user', 'assistant', 'system');

-- ============================================
-- CORE TABLES
-- ============================================

-- Table: profiles
-- Purpose: User accounts (extends Supabase auth.users)
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

CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_is_active ON profiles(is_active);

-- Table: families
-- Purpose: Family units
CREATE TABLE families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  settings JSONB DEFAULT '{"privacy": "private", "allow_contributions": true, "require_approval": false}'::jsonb
);

CREATE INDEX idx_families_created_by ON families(created_by);
CREATE INDEX idx_families_is_active ON families(is_active);

-- Table: user_families
-- Purpose: Many-to-many relationship between users and families
CREATE TABLE user_families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  role family_role DEFAULT 'viewer',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  invited_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  UNIQUE(user_id, family_id)
);

CREATE INDEX idx_user_families_user_id ON user_families(user_id);
CREATE INDEX idx_user_families_family_id ON user_families(family_id);
CREATE INDEX idx_user_families_role ON user_families(role);

-- Table: family_members
-- Purpose: People in family tree
CREATE TABLE family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  middle_name TEXT,
  last_name TEXT,
  nickname TEXT,
  gender gender_type DEFAULT 'unknown',
  birth_date DATE,
  birth_place TEXT,
  death_date DATE,
  death_place TEXT,
  is_deceased BOOLEAN DEFAULT FALSE,
  profile_photo_url TEXT,
  biography TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  metadata JSONB DEFAULT '{}'::jsonb,
  CONSTRAINT valid_dates CHECK ((death_date IS NULL OR birth_date IS NULL) OR (death_date > birth_date))
);

CREATE INDEX idx_family_members_family_id ON family_members(family_id);
CREATE INDEX idx_family_members_profile_id ON family_members(profile_id);
CREATE INDEX idx_family_members_is_deceased ON family_members(is_deceased);

-- Table: relationships
-- Purpose: Define connections between family members
CREATE TABLE relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  person1_id UUID REFERENCES family_members(id) ON DELETE CASCADE,
  person2_id UUID REFERENCES family_members(id) ON DELETE CASCADE,
  relationship_type relationship_type NOT NULL,
  start_date DATE,
  end_date DATE,
  notes TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT different_persons CHECK (person1_id != person2_id),
  CONSTRAINT unique_relationship UNIQUE (person1_id, person2_id, relationship_type)
);

CREATE INDEX idx_relationships_family_id ON relationships(family_id);
CREATE INDEX idx_relationships_person1_id ON relationships(person1_id);
CREATE INDEX idx_relationships_person2_id ON relationships(person2_id);
CREATE INDEX idx_relationships_type ON relationships(relationship_type);

-- Table: memories
-- Purpose: Photos, videos, documents
CREATE TABLE memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  memory_type memory_type NOT NULL,
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  file_size BIGINT,
  mime_type TEXT,
  memory_date DATE,
  location TEXT,
  uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  metadata JSONB DEFAULT '{}'::jsonb,
  ai_analysis JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_memories_family_id ON memories(family_id);
CREATE INDEX idx_memories_type ON memories(memory_type);
CREATE INDEX idx_memories_date ON memories(memory_date);
CREATE INDEX idx_memories_uploaded_by ON memories(uploaded_by);

-- Table: memory_people
-- Purpose: Tag people in memories
CREATE TABLE memory_people (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  memory_id UUID REFERENCES memories(id) ON DELETE CASCADE,
  family_member_id UUID REFERENCES family_members(id) ON DELETE CASCADE,
  face_detection_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(memory_id, family_member_id)
);

CREATE INDEX idx_memory_people_memory_id ON memory_people(memory_id);
CREATE INDEX idx_memory_people_member_id ON memory_people(family_member_id);

-- Table: memory_tags
-- Purpose: Categorize memories
CREATE TABLE memory_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  memory_id UUID REFERENCES memories(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(memory_id, tag)
);

CREATE INDEX idx_memory_tags_memory_id ON memory_tags(memory_id);
CREATE INDEX idx_memory_tags_tag ON memory_tags(tag);

-- Table: generated_stories
-- Purpose: AI-generated narratives
CREATE TABLE generated_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  generated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  generation_prompt TEXT,
  related_members UUID[] DEFAULT '{}',
  related_memories UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_published BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_generated_stories_family_id ON generated_stories(family_id);
CREATE INDEX idx_generated_stories_generated_by ON generated_stories(generated_by);
CREATE INDEX idx_generated_stories_is_published ON generated_stories(is_published);

-- Table: conversations
-- Purpose: AI chat history
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_family_id ON conversations(family_id);

-- Table: messages
-- Purpose: Individual chat messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  role message_role NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Families
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see families they belong to" ON families FOR SELECT
  USING (id IN (SELECT family_id FROM user_families WHERE user_id = auth.uid()));
CREATE POLICY "Family admins can update" ON families FOR UPDATE
  USING (id IN (SELECT family_id FROM user_families WHERE user_id = auth.uid() AND role = 'admin'));

-- User Families
ALTER TABLE user_families ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own family memberships" ON user_families FOR SELECT
  USING (user_id = auth.uid() OR family_id IN (SELECT family_id FROM user_families WHERE user_id = auth.uid()));

-- Family Members
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see family members in their families" ON family_members FOR SELECT
  USING (family_id IN (SELECT family_id FROM user_families WHERE user_id = auth.uid()));
CREATE POLICY "Editors can insert family members" ON family_members FOR INSERT
  WITH CHECK (family_id IN (SELECT family_id FROM user_families WHERE user_id = auth.uid() AND role IN ('admin', 'editor')));
CREATE POLICY "Editors can update family members" ON family_members FOR UPDATE
  USING (family_id IN (SELECT family_id FROM user_families WHERE user_id = auth.uid() AND role IN ('admin', 'editor')));

-- Relationships
ALTER TABLE relationships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see relationships in their families" ON relationships FOR SELECT
  USING (family_id IN (SELECT family_id FROM user_families WHERE user_id = auth.uid()));
CREATE POLICY "Editors can manage relationships" ON relationships FOR ALL
  USING (family_id IN (SELECT family_id FROM user_families WHERE user_id = auth.uid() AND role IN ('admin', 'editor')));

-- Memories
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see memories in their families" ON memories FOR SELECT
  USING (family_id IN (SELECT family_id FROM user_families WHERE user_id = auth.uid()));
CREATE POLICY "Editors can upload memories" ON memories FOR INSERT
  WITH CHECK (family_id IN (SELECT family_id FROM user_families WHERE user_id = auth.uid() AND role IN ('admin', 'editor')));
CREATE POLICY "Uploaders can update own memories" ON memories FOR UPDATE
  USING (uploaded_by = auth.uid() OR family_id IN (SELECT family_id FROM user_families WHERE user_id = auth.uid() AND role = 'admin'));

-- Memory People
ALTER TABLE memory_people ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see memory people in their families" ON memory_people FOR SELECT
  USING (memory_id IN (SELECT id FROM memories WHERE family_id IN (SELECT family_id FROM user_families WHERE user_id = auth.uid())));

-- Memory Tags
ALTER TABLE memory_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see memory tags in their families" ON memory_tags FOR SELECT
  USING (memory_id IN (SELECT id FROM memories WHERE family_id IN (SELECT family_id FROM user_families WHERE user_id = auth.uid())));

-- Generated Stories
ALTER TABLE generated_stories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see stories in their families" ON generated_stories FOR SELECT
  USING (family_id IN (SELECT family_id FROM user_families WHERE user_id = auth.uid()));
CREATE POLICY "Users can create stories" ON generated_stories FOR INSERT
  WITH CHECK (family_id IN (SELECT family_id FROM user_families WHERE user_id = auth.uid()));

-- Conversations
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own conversations" ON conversations FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create conversations" ON conversations FOR INSERT WITH CHECK (user_id = auth.uid());

-- Messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see messages in own conversations" ON messages FOR SELECT
  USING (conversation_id IN (SELECT id FROM conversations WHERE user_id = auth.uid()));
CREATE POLICY "Users can create messages" ON messages FOR INSERT
  WITH CHECK (conversation_id IN (SELECT id FROM conversations WHERE user_id = auth.uid()));

-- ============================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ============================================

-- Function: update_updated_at_column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at column
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
CREATE TRIGGER update_families_updated_at BEFORE UPDATE ON families
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
CREATE TRIGGER update_family_members_updated_at BEFORE UPDATE ON family_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
CREATE TRIGGER update_relationships_updated_at BEFORE UPDATE ON relationships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
CREATE TRIGGER update_memories_updated_at BEFORE UPDATE ON memories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
CREATE TRIGGER update_generated_stories_updated_at BEFORE UPDATE ON generated_stories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DATA (Optional - for testing)
-- ============================================

-- Insert test data is commented out for production
-- UNCOMMENT BELOW FOR DEVELOPMENT/TESTING

/*
-- Create test profile (requires valid auth.users entry)
-- INSERT INTO profiles (id, email, full_name) 
-- VALUES ('00000000-0000-0000-0000-000000000001', 'test@example.com', 'Test User');

-- Create test family
INSERT INTO families (id, name, description, created_by)
VALUES (
  '10000000-0000-0000-0000-000000000001',
  'Smith Family',
  'A wonderful family legacy',
  NULL
);

-- Add user to family
-- INSERT INTO user_families (user_id, family_id, role)
-- VALUES ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'admin');
*/

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
-- Schema version: 1.0.0
-- Total tables: 13
-- Total RLS policies: 20+
-- Total triggers: 7
-- ============================================
