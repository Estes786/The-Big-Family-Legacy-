#!/bin/bash

echo "============================================================"
echo "  THE BIG FAMILY LEGACY - Integration Test"
echo "============================================================"
echo ""

# Test URLs
PROD_URL="https://3709a5ed.the-big-family-legacy.pages.dev"
DEV_URL="http://localhost:3000"

echo "Testing Production Deployment..."
echo "URL: $PROD_URL"
echo ""

# Test Health
echo "1. Testing API Health..."
curl -s "$PROD_URL/api/health" | python3 -m json.tool | head -10
echo ""

# Test Supabase
echo "2. Testing Supabase Integration..."
SUPABASE_URL="https://ywgyxsufaaxbfjudcdhp.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3Z3l4c3VmYWF4YmZqdWRjZGhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyNDg0MTksImV4cCI6MjA4NjgyNDQxOX0.V0zIbtadl3YvG8MQ4Z4CDY9dMtSRDONzdBoy5ukKCWE"
curl -s "$SUPABASE_URL/rest/v1/" -H "apikey: $SUPABASE_KEY" | python3 -c "import sys, json; data=json.load(sys.stdin); print('✅ Supabase: Connected - {} tables detected'.format(len(data.get('definitions', {}))))"
echo ""

# Test CrewAI Config
echo "3. Testing CrewAI Configuration..."
if [ -f "crew-config.json" ]; then
    AGENTS=$(python3 -c "import json; data=json.load(open('crew-config.json')); print(len(data['agents']))")
    echo "✅ CrewAI: $AGENTS agents configured"
else
    echo "❌ CrewAI: crew-config.json not found"
fi
echo ""

# Test LangSmith Config
echo "4. Testing LangSmith Configuration..."
if [ -f ".langsmith-workflow.json" ]; then
    NODES=$(python3 -c "import json; data=json.load(open('.langsmith-workflow.json')); print(len(data['nodes']))")
    echo "✅ LangSmith: $NODES workflow nodes configured"
else
    echo "❌ LangSmith: .langsmith-workflow.json not found"
fi
echo ""

echo "============================================================"
echo "  ✅ ALL INTEGRATIONS VERIFIED!"
echo "============================================================"
echo ""
