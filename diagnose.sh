#!/bin/bash

# Supabase Configuration Diagnostic Script

echo "================================================"
echo "  TO-DO LIST APP - SUPABASE DIAGNOSTIC TOOL"
echo "================================================"
echo ""

# Check 1: Environment file
echo "✓ Checking environment files..."
if [ -f ".env.local" ]; then
    echo "  ✅ .env.local exists"
    echo "  Contents:"
    grep -v "^#" .env.local | grep "." | sed 's/=.*/=***HIDDEN***/g'
else
    echo "  ❌ .env.local NOT FOUND"
    echo "  👉 ACTION NEEDED: Create .env.local with your Supabase keys"
    echo "     Copy .env.example to .env.local and add your values"
fi
echo ""

# Check 2: Node modules
echo "✓ Checking Node.js dependencies..."
if [ -d "node_modules" ]; then
    echo "  ✅ node_modules installed"
else
    echo "  ❌ node_modules NOT FOUND"
    echo "  👉 ACTION NEEDED: Run 'npm install'"
fi
echo ""

# Check 3: Supabase client
echo "✓ Checking Supabase client file..."
if [ -f "lib/supabaseClient.js" ]; then
    echo "  ✅ Supabase client exists"
else
    echo "  ❌ Supabase client NOT FOUND"
fi
echo ""

# Check 4: Main page
echo "✓ Checking main page..."
if [ -f "pages/index.js" ]; then
    echo "  ✅ Main page exists"
else
    echo "  ❌ Main page NOT FOUND"
fi
echo ""

echo "================================================"
echo "  NEXT STEPS:"
echo "================================================"
echo ""
echo "1. CREATE .env.local file:"
echo "   cp .env.example .env.local"
echo ""
echo "2. EDIT .env.local with your Supabase keys:"
echo "   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co"
echo "   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key"
echo ""
echo "3. INSTALL DEPENDENCIES (if needed):"
echo "   npm install"
echo ""
echo "4. RUN DEVELOPMENT SERVER:"
echo "   npm run dev"
echo ""
echo "5. OPEN in browser:"
echo "   http://localhost:3000"
echo ""
echo "6. OPEN BROWSER CONSOLE (F12) to see detailed error messages"
echo ""
echo "================================================"
