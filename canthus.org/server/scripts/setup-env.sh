#!/bin/bash

# Setup script for Cloudflare Workers environment variables

echo "🚀 Setting up environment variables for Cloudflare Workers..."

# Check if .dev.vars exists
if [ ! -f ".dev.vars" ]; then
    echo "📝 Creating .dev.vars file from template..."
    cp .dev.vars.example .dev.vars
    echo "✅ Created .dev.vars file"
    echo "⚠️  Please edit .dev.vars with your actual values before running wrangler dev"
else
    echo "✅ .dev.vars file already exists"
fi

echo ""
echo "🔧 Environment setup options:"
echo ""
echo "1. Local Development (using .dev.vars):"
echo "   bun run dev:workers"
echo ""
echo "2. Staging Deployment:"
echo "   # Set secrets for staging environment"
echo "   wrangler secret put WORKOS_API_KEY --env staging"
echo "   wrangler secret put WORKOS_CLIENT_ID --env staging"
echo "   wrangler secret put WORKOS_REDIRECT_URI --env staging"
echo "   wrangler secret put WORKOS_COOKIE_PASSWORD --env staging"
echo "   wrangler secret put APP_BASE_URL --env staging"
echo "   bun run deploy:workers:staging"
echo ""
echo "3. Production Deployment:"
echo "   # Set secrets for production environment"
echo "   wrangler secret put WORKOS_API_KEY"
echo "   wrangler secret put WORKOS_CLIENT_ID"
echo "   wrangler secret put WORKOS_REDIRECT_URI"
echo "   wrangler secret put WORKOS_COOKIE_PASSWORD"
echo "   wrangler secret put APP_BASE_URL"
echo "   bun run deploy:workers"
echo ""
echo "📋 Required environment variables:"
echo "   - WORKOS_API_KEY: Your WorkOS API key"
echo "   - WORKOS_CLIENT_ID: Your WorkOS client ID"
echo "   - WORKOS_REDIRECT_URI: OAuth redirect URI (e.g., https://yourdomain.com/auth/callback)"
echo "   - WORKOS_COOKIE_PASSWORD: Secure password for cookie encryption"
echo "   - APP_BASE_URL: Your application base URL (e.g., https://yourdomain.com)"
echo ""
echo "🔍 To view logs:"
echo "   bun run logs:tail:follow"
