# Docker Deployment Plan for Canthus.org

## Overview

This document outlines a comprehensive plan to migrate the Canthus.org application from Cloudflare Workers/Pages to Docker-based deployment. This will provide better control, easier local development, and more flexible deployment options.

## Current Architecture

### Current Setup
- **Frontend**: React/Vite app deployed to Cloudflare Pages
- **Backend**: Hono API deployed to Cloudflare Workers
- **Shared**: TypeScript shared types package
- **Authentication**: WorkOS integration
- **Build System**: Bun + Turbo monorepo

### Current Dependencies
- **Runtime**: Bun (JavaScript runtime)
- **Frontend**: React, Vite, TanStack Router, Tailwind CSS
- **Backend**: Hono, WorkOS, CORS
- **Build**: TypeScript, Turbo, Biome

## Docker Migration Strategy

### Phase 1: Containerization Setup

#### 1.1 Create Docker Configuration Files

**Root Dockerfile (Multi-stage build)**
```dockerfile
# Multi-stage Dockerfile for the entire monorepo
FROM oven/bun:1.2.4-alpine AS base

# Install dependencies
WORKDIR /app
COPY package.json bun.lock ./
COPY shared/package.json ./shared/
COPY client/package.json ./client/
COPY server/package.json ./server/
RUN bun install --frozen-lockfile

# Build shared package
COPY shared/ ./shared/
RUN cd shared && bun run build

# Build server
COPY server/ ./server/
RUN cd server && bun run build

# Build client
COPY client/ ./client/
RUN cd client && bun run build

# Production stage
FROM oven/bun:1.2.4-alpine AS production
WORKDIR /app
COPY --from=base /app/dist ./dist
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/shared/dist ./shared/dist
COPY --from=base /app/server/dist ./server/dist
COPY --from=base /app/client/dist ./client/dist
COPY package.json ./

EXPOSE 3000
CMD ["bun", "run", "start:docker"]
```

**Docker Compose for Development**
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - WORKOS_API_KEY=${WORKOS_API_KEY}
      - WORKOS_CLIENT_ID=${WORKOS_CLIENT_ID}
      - WORKOS_REDIRECT_URI=${WORKOS_REDIRECT_URI}
      - WORKOS_COOKIE_PASSWORD=${WORKOS_COOKIE_PASSWORD}
      - APP_BASE_URL=${APP_BASE_URL}
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped
```

#### 1.2 Update Package.json Scripts

**Root package.json additions:**
```json
{
  "scripts": {
    "docker:build": "docker build -t canthus-app .",
    "docker:run": "docker run -p 3000:3000 --env-file .env.production canthus-app",
    "docker:dev": "docker-compose -f docker-compose.dev.yml up --build",
    "docker:prod": "docker-compose -f docker-compose.prod.yml up --build -d",
    "start:docker": "bun run server:start && bun run client:serve"
  }
}
```

### Phase 2: Server Migration

#### 2.1 Update Server for Docker

**Create server/docker-entrypoint.sh:**
```bash
#!/bin/sh
set -e

# Wait for any initialization
echo "Starting Canthus server..."

# Start the server
exec bun run dist/index.js
```

**Update server/src/index.ts for Docker:**
```typescript
// Add Docker-specific configuration
const isDocker = process.env.DOCKER === 'true';
const port = process.env.PORT || 3000;

if (isDocker) {
  // For Docker, create a single app instance
  const app = createApp(process.env);
  
  // Start server
  Bun.serve({
    port: parseInt(port),
    fetch: app.fetch,
  });
  
  console.log(`Server running on port ${port}`);
}
```

#### 2.2 Static File Serving

**Update server to serve client static files:**
```typescript
import { serveStatic } from 'hono/bun';

// Add static file serving for client
app.use('/*', serveStatic({ 
  root: './client/dist',
  rewriteRequestPath: (path) => {
    // Handle SPA routing
    if (!path.includes('.') && !path.startsWith('/api')) {
      return '/index.html';
    }
    return path;
  }
}));
```

### Phase 3: Environment & Configuration

#### 3.1 Environment Management

**Create .env.docker:**
```bash
# Docker-specific environment
DOCKER=true
NODE_ENV=production
PORT=3000

# WorkOS Configuration
WORKOS_API_KEY=your_api_key
WORKOS_CLIENT_ID=your_client_id
WORKOS_REDIRECT_URI=http://localhost:3000/auth/callback
WORKOS_COOKIE_PASSWORD=your_secure_password
APP_BASE_URL=http://localhost:3000
```

#### 3.2 Nginx Configuration

**Create nginx.conf:**
```nginx
events {
    worker_connections 1024;
}

http {
    upstream app {
        server app:3000;
    }

    server {
        listen 80;
        server_name localhost;

        # Redirect HTTP to HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl;
        server_name localhost;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        # Proxy API requests to the app
        location /api/ {
            proxy_pass http://app/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Serve static files directly
        location / {
            proxy_pass http://app/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

### Phase 4: Deployment Options

#### 4.1 Local Development

**docker-compose.dev.yml:**
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DOCKER=true
    volumes:
      - .:/app
      - /app/node_modules
    command: bun run dev
    restart: unless-stopped
```

#### 4.2 Production Deployment

**docker-compose.prod.yml:**
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DOCKER=true
    env_file:
      - .env.production
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped
```

#### 4.3 Cloud Deployment Options

**Option A: VPS/Cloud Server**
- Deploy using docker-compose
- Use reverse proxy (Nginx/Traefik)
- SSL certificates via Let's Encrypt
- Database: PostgreSQL/MySQL if needed

**Option B: Container Orchestration**
- Kubernetes deployment
- Docker Swarm
- AWS ECS/Fargate
- Google Cloud Run

**Option C: Platform as a Service**
- Railway
- Render
- Fly.io
- DigitalOcean App Platform

### Phase 5: Migration Steps

#### 5.1 Preparation Phase
1. **Create Docker files** (Dockerfile, docker-compose.yml, nginx.conf)
2. **Update package.json scripts** for Docker support
3. **Modify server code** for Docker compatibility
4. **Set up environment management** for Docker
5. **Create health check endpoints**

#### 5.2 Testing Phase
1. **Local Docker testing** with docker-compose
2. **Environment variable validation**
3. **Static file serving verification**
4. **API endpoint testing**
5. **Authentication flow testing**

#### 5.3 Deployment Phase
1. **Choose deployment target** (VPS, cloud, etc.)
2. **Set up production environment**
3. **Configure SSL certificates**
4. **Set up monitoring and logging**
5. **Deploy and test**

#### 5.4 Migration Phase
1. **Deploy Docker version** alongside Cloudflare
2. **Test thoroughly** in production-like environment
3. **Update DNS** to point to new deployment
4. **Monitor** for issues
5. **Decommission** Cloudflare Workers/Pages

### Phase 6: Benefits of Docker Migration

#### 6.1 Development Benefits
- **Consistent environment** across all developers
- **Easier onboarding** for new team members
- **Local development** that matches production
- **Simplified dependency management**

#### 6.2 Deployment Benefits
- **Flexible deployment options** (any cloud provider)
- **Better resource control** and cost optimization
- **Easier scaling** and load balancing
- **Simplified CI/CD** pipeline

#### 6.3 Operational Benefits
- **Better logging** and monitoring capabilities
- **Easier debugging** and troubleshooting
- **Simplified backup** and recovery
- **Better security** control

### Phase 7: Implementation Timeline

#### Week 1: Setup & Configuration
- Create Docker files and configurations
- Update build scripts and package.json
- Set up local Docker development environment

#### Week 2: Server Migration
- Modify server code for Docker compatibility
- Implement static file serving
- Add health check endpoints
- Test API functionality

#### Week 3: Testing & Validation
- Comprehensive testing of Docker setup
- Environment variable validation
- Authentication flow testing
- Performance testing

#### Week 4: Deployment & Migration
- Choose and set up production deployment target
- Deploy Docker version
- Test in production environment
- Plan DNS migration

### Phase 8: Rollback Plan

#### 8.1 Rollback Strategy
- **Keep Cloudflare deployment** active during migration
- **DNS rollback** capability (quick switch back)
- **Database consistency** checks
- **Monitoring alerts** for issues

#### 8.2 Rollback Triggers
- **High error rates** (>5%)
- **Performance degradation** (>2s response time)
- **Authentication failures**
- **Critical functionality** broken

## Conclusion

This Docker migration plan provides a comprehensive approach to moving from Cloudflare Workers/Pages to a more flexible Docker-based deployment. The phased approach ensures minimal risk while providing significant benefits in terms of development experience, deployment flexibility, and operational control.

The migration can be executed gradually, with the ability to rollback at any point, ensuring business continuity throughout the process.
