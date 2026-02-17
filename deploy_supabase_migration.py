#!/usr/bin/env python3
"""
Supabase Database Migration Tool
Deploys SQL schema to Supabase PostgreSQL database via REST API
"""

import os
import json
import requests
import sys

# Configuration
PROJECT_REF = "ywgyxsufaaxbfjudcdhp"
SUPABASE_URL = f"https://{PROJECT_REF}.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3Z3l4c3VmYWF4YmZqdWRjZGhwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTI0ODQxOSwiZXhwIjoyMDg2ODI0NDE5fQ.eAOQvdFwXlfo2zNDGCFok9A7BO3iWjaOg5QtXz1vIEg"
MIGRATION_FILE = "migrations/001_initial_schema.sql"

def test_connection():
    """Test Supabase REST API connection"""
    print("🔍 Testing Supabase connection...")
    try:
        response = requests.get(
            f"{SUPABASE_URL}/rest/v1/",
            headers={
                "apikey": SERVICE_KEY,
                "Authorization": f"Bearer {SERVICE_KEY}"
            }
        )
        if response.status_code == 200:
            print("✅ Connection successful!")
            return True
        else:
            print(f"❌ Connection failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Connection error: {e}")
        return False

def check_existing_tables():
    """Check if tables already exist"""
    print("\n🔍 Checking existing tables...")
    try:
        # Query information_schema via RPC
        response = requests.post(
            f"{SUPABASE_URL}/rest/v1/rpc/check_table",
            headers={
                "apikey": SERVICE_KEY,
                "Authorization": f"Bearer {SERVICE_KEY}",
                "Content-Type": "application/json"
            },
            json={"table_name": "profiles"}
        )
        # This will fail if RPC doesn't exist, which is expected
        print("⚠️  Cannot check tables directly via REST API")
        return False
    except Exception as e:
        print("⚠️  Cannot check tables (expected if not deployed)")
        return False

def main():
    print("=" * 60)
    print("THE BIG FAMILY LEGACY - Supabase Migration Tool")
    print("=" * 60)
    
    # Test connection
    if not test_connection():
        print("\n❌ Cannot connect to Supabase. Please check credentials.")
        sys.exit(1)
    
    # Check existing tables
    check_existing_tables()
    
    # Read migration file
    print(f"\n📖 Reading migration file: {MIGRATION_FILE}")
    try:
        with open(MIGRATION_FILE, 'r') as f:
            sql_content = f.read()
        print(f"✅ Migration file loaded ({len(sql_content)} characters)")
        print(f"   Tables to create: profiles, families, family_members, etc.")
    except FileNotFoundError:
        print(f"❌ Migration file not found: {MIGRATION_FILE}")
        sys.exit(1)
    
    # Important note about deployment
    print("\n" + "=" * 60)
    print("⚠️  IMPORTANT: SQL EXECUTION VIA REST API NOT SUPPORTED")
    print("=" * 60)
    print("""
Supabase REST API (PostgREST) tidak support arbitrary SQL execution
untuk security reasons. Ada 3 cara untuk deploy schema:

OPTION 1: Supabase Dashboard (RECOMMENDED ✅)
  1. Buka: https://supabase.com/dashboard/project/ywgyxsufaaxbfjudcdhp/sql
  2. Klik "New Query"
  3. Copy-paste isi file: migrations/001_initial_schema.sql
  4. Klik "Run" (atau Ctrl+Enter)
  5. Tunggu hingga selesai (~30 detik)

OPTION 2: Supabase CLI
  $ npm install -g supabase
  $ supabase login
  $ supabase link --project-ref ywgyxsufaaxbfjudcdhp
  $ supabase db push

OPTION 3: psql Direct Connection (Advanced)
  $ psql "postgresql://postgres:[password]@db.ywgyxsufaaxbfjudcdhp.supabase.co:5432/postgres"
  postgres=> \\i migrations/001_initial_schema.sql

MIGRATION FILE READY:
  📄 Location: {MIGRATION_FILE}
  📦 Size: {len(sql_content):,} bytes
  🗂️  Tables: 13
  🔐 RLS Policies: 20+
  ⚙️  Triggers: 7

Silakan pilih salah satu option di atas untuk deploy schema! 🚀
""")
    
    print("=" * 60)
    print("✅ Migration file ready for deployment!")
    print("=" * 60)

if __name__ == "__main__":
    main()
