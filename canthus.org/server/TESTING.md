# Testing Cloudflare Workers Setup

This document explains how to test your Canthus server with Cloudflare Workers.

## ✅ What's Been Set Up

1. **Wrangler Configuration** (`wrangler.toml`)
   - Worker name: `canthus-api`
   - Entry point: `src/worker.ts`
   - Node.js compatibility enabled
   - Ready for deployment

2. **Code Modifications**
   - ✅ Environment variable handling updated for Cloudflare Workers
   - ✅ WorkOS client initialization made flexible
   - ✅ Hono app factory function created
   - ✅ Cloudflare Workers entry point created
   - ✅ All TypeScript errors resolved

3. **Dependencies**
   - ✅ Wrangler CLI installed (v4.36.0)
   - ✅ All packages built successfully

## 🧪 Testing Steps

### 1. Configure Environment Variables

First, you need to set up your environment variables. You have two options:

#### Option A: Local Development (.dev.vars)
```bash
# Edit the .dev.vars file with your actual WorkOS credentials
nano .dev.vars
```

Fill in your actual values:
```bash
WORKOS_API_KEY=your_actual_api_key
WORKOS_CLIENT_ID=your_actual_client_id
WORKOS_REDIRECT_URI=https://your-domain.com/auth/callback
WORKOS_COOKIE_PASSWORD=your_secure_cookie_password
APP_BASE_URL=https://your-domain.com
NODE_ENV=development
```

#### Option B: Use Existing .env.development
If you already have a `.env.development` file with these variables, you can copy them to `.dev.vars`.

### 2. Test Local Development

```bash
# Start the Cloudflare Workers development server
bun run dev:workers

# This will start the server at http://localhost:8787
```

### 3. Test API Endpoints

Open a new terminal and test the endpoints:

```bash
# Test health check
curl http://localhost:8787/

# Test hello endpoint (should set a cookie)
curl http://localhost:8787/hello

# Test hello endpoint again (should show "Welcome back!")
curl http://localhost:8787/hello

# Test protected endpoint (should redirect to login)
curl http://localhost:8787/protected
```

### 4. Test Authentication Flow

```bash
# Test login redirect
curl -L http://localhost:8787/auth/login

# Test me endpoint (should return 401 without auth)
curl http://localhost:8787/auth/me

# Test organizations endpoint (should return 401 without auth)
curl http://localhost:8787/auth/organizations
```

## 🚀 Deployment Testing

### 1. Set Production Secrets

Before deploying, set your production secrets:

```bash
# Set each secret (you'll be prompted to enter the value)
bunx wrangler secret put WORKOS_API_KEY
bunx wrangler secret put WORKOS_CLIENT_ID
bunx wrangler secret put WORKOS_REDIRECT_URI
bunx wrangler secret put WORKOS_COOKIE_PASSWORD
bunx wrangler secret put APP_BASE_URL
```

### 2. Deploy to Production

```bash
# Deploy to Cloudflare Workers
bun run deploy:workers

# Or manually
bunx wrangler deploy
```

### 3. Test Production Deployment

After deployment, you'll get a URL like `https://canthus-api.your-subdomain.workers.dev`. Test the same endpoints:

```bash
# Replace with your actual deployment URL
curl https://canthus-api.your-subdomain.workers.dev/
curl https://canthus-api.your-subdomain.workers.dev/hello
curl https://canthus-api.your-subdomain.workers.dev/auth/me
```

## 🔧 Troubleshooting

### Common Issues:

1. **Environment Variables Not Set**
   - Ensure `.dev.vars` exists and has all required variables
   - For production, ensure all secrets are set with `wrangler secret put`

2. **Build Errors**
   - Run `bun run build` to check for TypeScript errors
   - Ensure all dependencies are installed with `bun install`

3. **Authentication Issues**
   - Verify `WORKOS_REDIRECT_URI` matches your WorkOS configuration
   - Check that `APP_BASE_URL` is correct
   - Ensure `WORKOS_COOKIE_PASSWORD` is consistent

4. **CORS Issues**
   - Verify `APP_BASE_URL` matches your frontend domain
   - Check CORS configuration in `src/index.ts`

### Debug Mode:

```bash
# Local development with debug logging
bunx wrangler dev --local --inspect

# Check production logs
bunx wrangler tail
```

## 📊 Expected Results

### Successful Setup Should Show:

1. **Health Check** (`GET /`):
   ```json
   "Hello Hono!"
   ```

2. **Hello Endpoint** (`GET /hello`):
   ```json
   {
     "message": "Hello Canthus!",
     "success": true
   }
   ```
   (First call shows "Hello Canthus!", subsequent calls show "Welcome back!")

3. **Protected Route** (`GET /protected`):
   - Should redirect to `/login` if not authenticated

4. **Auth Endpoints**:
   - `/auth/me` and `/auth/organizations` should return 401 without valid session

## 🎉 Success Criteria

Your setup is working correctly if:
- ✅ All endpoints respond without errors
- ✅ Cookies are set and retrieved properly
- ✅ Authentication flow redirects work
- ✅ Build completes without TypeScript errors
- ✅ Deployment succeeds with `wrangler deploy`

## 📝 Next Steps

Once testing is complete:
1. Update your frontend to use the new Cloudflare Workers URL
2. Configure custom domain if needed
3. Set up monitoring and logging
4. Update your CI/CD pipeline for automatic deployments
