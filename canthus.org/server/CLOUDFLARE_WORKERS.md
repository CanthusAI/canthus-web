# Cloudflare Workers Deployment Guide

This guide explains how to deploy your Canthus server to Cloudflare Workers.

## Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **Wrangler CLI**: Installed as a dev dependency
3. **WorkOS Account**: For authentication

## Setup

### 1. Install Dependencies

```bash
cd server
bun install
```

### 2. Configure Environment Variables

#### For Local Development:
1. Copy `.dev.vars.example` to `.dev.vars`
2. Fill in your actual values:

```bash
cp .dev.vars.example .dev.vars
```

Edit `.dev.vars` with your actual WorkOS credentials.

#### For Production Deployment:
Set secrets using Wrangler CLI:

```bash
# Set each secret
wrangler secret put WORKOS_API_KEY
wrangler secret put WORKOS_CLIENT_ID
wrangler secret put WORKOS_REDIRECT_URI
wrangler secret put WORKOS_COOKIE_PASSWORD
wrangler secret put APP_BASE_URL
```

### 3. Test Locally

```bash
# Start local development server
bun run dev:workers

# This will start the Cloudflare Workers development server
# Your API will be available at http://localhost:8787
```

### 4. Deploy to Production

```bash
# Deploy to Cloudflare Workers
bun run deploy:workers

# Or manually
wrangler deploy
```

## Configuration

### wrangler.toml

The `wrangler.toml` file contains your Worker configuration:

- **name**: Your Worker name (canthus-api)
- **main**: Entry point (src/worker.ts)
- **compatibility_date**: Runtime compatibility
- **compatibility_flags**: Node.js compatibility

### Custom Domain (Optional)

To use a custom domain:

1. Add your domain to Cloudflare
2. Update `wrangler.toml`:

```toml
routes = [
  { pattern = "api.canthus.org/*", custom_domain = true }
]
```

3. Deploy with the custom route

## Environment Variables

### Required Secrets:
- `WORKOS_API_KEY`: Your WorkOS API key
- `WORKOS_CLIENT_ID`: Your WorkOS client ID
- `WORKOS_REDIRECT_URI`: OAuth redirect URI
- `WORKOS_COOKIE_PASSWORD`: Cookie encryption password
- `APP_BASE_URL`: Your application base URL

### Optional:
- `NODE_ENV`: Environment (production/development)

## API Endpoints

Your deployed Worker will have these endpoints:

- `GET /` - Health check
- `GET /hello` - Test endpoint with cookies
- `GET /protected` - Protected route (requires auth)
- `GET /auth/login` - Start OAuth flow
- `GET /auth/callback` - OAuth callback
- `GET /auth/logout` - Logout
- `GET /auth/me` - Get current user
- `GET /auth/organizations` - Get user organizations

## Testing

### Local Testing
```bash
# Start the development server
bun run dev:workers

# Test endpoints
curl http://localhost:8787/
curl http://localhost:8787/hello
```

### Production Testing
```bash
# After deployment, test your endpoints
curl https://your-worker.your-subdomain.workers.dev/
curl https://your-worker.your-subdomain.workers.dev/hello
```

## Troubleshooting

### Common Issues:

1. **Environment Variables Not Set**
   - Ensure all required secrets are set with `wrangler secret put`
   - Check `.dev.vars` for local development

2. **CORS Issues**
   - Verify `APP_BASE_URL` is set correctly
   - Check CORS configuration in `src/index.ts`

3. **WorkOS Authentication Issues**
   - Verify `WORKOS_REDIRECT_URI` matches your WorkOS configuration
   - Check that `WORKOS_COOKIE_PASSWORD` is consistent

4. **Build Errors**
   - Run `bun run build` to check for TypeScript errors
   - Ensure all dependencies are installed

### Debug Mode

Enable debug logging:

```bash
# Local development with debug
wrangler dev --local --inspect

# Check logs in production
wrangler tail
```

## Performance

Cloudflare Workers provides:
- **Global Edge Deployment**: Runs close to users worldwide
- **Zero Cold Start**: Instant response times
- **Automatic Scaling**: Handles traffic spikes
- **Built-in Security**: DDoS protection, SSL

## Cost

Cloudflare Workers pricing:
- **Free Tier**: 100,000 requests/day
- **Paid Plans**: Start at $5/month for higher limits

Check [Cloudflare Workers Pricing](https://workers.cloudflare.com/plans) for current rates.
