#!/bin/bash

# Setup script for client environment variables

echo "🚀 Setting up client environment variables..."

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local file from template..."
    cat > .env.local << 'EOF'
# Client environment variables for local development
SERVER_URL=http://localhost:3000
NODE_ENV=development
VITE_ENV_NAME=local
EOF
    echo "✅ Created .env.local file"
    echo "⚠️  Please edit .env.local with your actual values if needed"
else
    echo "✅ .env.local file already exists"
fi

echo ""
echo "🔧 Client environment setup options:"
echo ""
echo "1. Local Development (.env.local):"
echo "   SERVER_URL=http://localhost:3000"
echo "   NODE_ENV=development"
echo ""
echo "2. Cloudflare Pages (wrangler.toml):"
echo "   [env.production.vars]"
echo "   SERVER_URL = \"https://api.canthus.org\""
echo ""
echo "3. Environment-specific deployment:"
echo "   bun run build --mode production"
echo "   bun run build --mode staging"
echo "   bun run build --mode development"
echo ""
echo "📋 Required environment variables:"
echo "   - SERVER_URL: Your server URL (required)"
echo "   - NODE_ENV: Environment (development/staging/production)"
echo "   - VITE_ENV_NAME: Environment name for identification"
echo ""
echo "🔍 Environment validation:"
echo "   The client will validate environment variables on startup"
echo "   Check browser console for validation messages"
echo ""
echo "🚀 To start development:"
echo "   bun run dev"
