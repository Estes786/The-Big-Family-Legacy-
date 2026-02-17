#!/bin/bash
# Deploy database schema to Supabase

set -e

PROJECT_REF="ywgyxsufaaxbfjudcdhp"
SUPABASE_TOKEN="sbp_5a2cc5ec6aa73f770a95c70be4731df8bcb8f6ad"
SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3Z3l4c3VmYWF4YmZqdWRjZGhwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTI0ODQxOSwiZXhwIjoyMDg2ODI0NDE5fQ.eAOQvdFwXlfo2zNDGCFok9A7BO3iWjaOg5QtXz1vIEg"

echo "📦 Reading migration file..."
SQL_CONTENT=$(cat migrations/001_initial_schema.sql)

echo "🚀 Deploying to Supabase..."
echo "   Project: $PROJECT_REF"
echo "   Region: ap-southeast-2"

# Note: Supabase Management API doesn't have direct SQL execution endpoint
# Best approach: Use SQL Editor in dashboard or supabase CLI

echo ""
echo "⚠️  MANUAL DEPLOYMENT REQUIRED"
echo ""
echo "Please follow these steps:"
echo "1. Go to: https://supabase.com/dashboard/project/$PROJECT_REF/sql"
echo "2. Create a new query"
echo "3. Copy content from: migrations/001_initial_schema.sql"
echo "4. Click 'Run' to execute"
echo ""
echo "Or use Supabase CLI:"
echo "  npx supabase login"
echo "  npx supabase link --project-ref $PROJECT_REF"
echo "  npx supabase db push"
echo ""

# Alternative: Try using PostgREST API to execute stored procedures
# But this requires the procedure to already exist
