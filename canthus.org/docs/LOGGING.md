# Logging Configuration

This document explains how logging is configured for both the server (Cloudflare Workers) and client (Cloudflare Pages) applications.

## Overview

Both applications use structured JSON logging that integrates with Cloudflare's observability platform. Logs are automatically captured and can be viewed in the Cloudflare dashboard or accessed via the Wrangler CLI.

## Server Logging (Cloudflare Workers)

### Configuration

The server logging is configured in `server/wrangler.toml`:

```toml
[observability]
enabled = true
```

### Logger Implementation

The server uses a custom logger (`server/src/logger.ts`) that provides:

- **Structured JSON logging** with timestamps, levels, and context
- **Request/response logging** with timing information
- **Authentication logging** for WorkOS operations
- **Cookie operation logging** for session management
- **Error logging** with stack traces

### Log Levels

- `debug`: Detailed information for debugging (only in development)
- `info`: General information about application flow
- `warn`: Warning messages for potential issues
- `error`: Error messages with full context

### Usage Examples

```typescript
import { getLogger } from './logger';

const logger = getLogger();

// Request logging
logger.requestStart('GET', '/auth/me');
logger.requestEnd('GET', '/auth/me', 200, 150);

// Authentication logging
logger.authAttempt(userId);
logger.authSuccess(userId);
logger.authFailure('Invalid credentials');

// Cookie operations
logger.cookieSet('wos-session', { secure: true });
logger.cookieGet('wos-session', true);
```

### Accessing Logs

#### Via Wrangler CLI

```bash
# View live logs
cd server
bun run logs:tail

# View logs with pretty formatting
bun run logs:tail:follow

# Download logs for analysis
bun run logs:download

# Debug mode with inspector
bun run logs:debug
```

#### Via Cloudflare Dashboard

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages**
3. Select your worker (`canthus-api`)
4. Go to **Logs** tab
5. View real-time and historical logs

## Client Logging (Cloudflare Pages)

### Configuration

The client logging is configured in `client/wrangler.toml`:

```toml
[observability]
enabled = true
```

### Logger Implementation

The client uses a custom logger (`client/src/lib/logger.ts`) that provides:

- **Environment-aware logging** (debug logs only in development)
- **Component lifecycle logging** for React components
- **API request/response logging** with timing
- **User interaction logging** for analytics
- **Navigation logging** for user flow tracking
- **Error boundary logging** for React error boundaries

### Usage Examples

```typescript
import { logger } from '@/lib/logger';

// Component logging
logger.componentMount('AuthProvider');
logger.componentUnmount('AuthProvider');

// API logging
logger.apiRequest('GET', '/auth/me', { component: 'AuthProvider' });
logger.apiResponse('GET', '/auth/me', 200, 150, { component: 'AuthProvider' });

// User interactions
logger.userInteraction('click', 'login-button');
logger.navigation('/login', '/app');

// Authentication
logger.authSuccess(userId);
logger.authFailure('Invalid session');
```

### Accessing Client Logs

#### Via Cloudflare Dashboard

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages**
3. Select your Pages project (`canthus-org`)
4. Go to **Analytics** tab for aggregated data
5. Use **Real User Monitoring (RUM)** for detailed client-side logs

#### Via Browser Console

In development, all logs appear in the browser console with structured formatting.

## Log Structure

All logs follow a consistent JSON structure:

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "info",
  "message": "Authentication successful",
  "environment": "production",
  "requestId": "uuid-here",
  "userId": "user_123",
  "endpoint": "/auth/me",
  "component": "AuthProvider",
  "action": "auth_success",
  "duration": 150,
  "status": 200
}
```

## Environment Variables

### Server Environment Variables

#### For Local Development (Wrangler)

Create a `.dev.vars` file in the `server/` directory:

```bash
# server/.dev.vars
WORKOS_API_KEY=sk_test_your_workos_api_key_here
WORKOS_CLIENT_ID=client_your_workos_client_id_here
WORKOS_REDIRECT_URI=https://your-domain.com/auth/callback
WORKOS_COOKIE_PASSWORD=your_secure_cookie_password_here
APP_BASE_URL=https://your-domain.com
NODE_ENV=development
```

#### For Production Deployment

Set secrets using Wrangler CLI:

```bash
# Set secrets for production
wrangler secret put WORKOS_API_KEY
wrangler secret put WORKOS_CLIENT_ID
wrangler secret put WORKOS_REDIRECT_URI
wrangler secret put WORKOS_COOKIE_PASSWORD
wrangler secret put APP_BASE_URL
```

#### Environment-Specific Deployment

```bash
# Staging environment
wrangler secret put WORKOS_API_KEY --env staging
wrangler secret put WORKOS_CLIENT_ID --env staging
# ... other secrets

# Deploy to staging
bun run deploy:workers:staging
```

#### Quick Setup

Run the setup script for guided environment configuration:

```bash
cd server
./scripts/setup-env.sh
```

### Environment Variable Validation

The application includes enhanced validation and debugging for environment variables:

- **Missing variables**: Clear error messages with setup instructions
- **Debug logging**: Shows which variables are available
- **Development warnings**: Helpful tips for local development

### Client Environment Variables

#### Required Variables

- `SERVER_URL`: Your server URL (required)
- `NODE_ENV`: Environment (development/staging/production)
- `VITE_ENV_NAME`: Environment name for identification

#### Environment Setup

**For Local Development:**
Create a `.env.local` file:
```bash
SERVER_URL=http://localhost:3000
NODE_ENV=development
VITE_ENV_NAME=local
```

**For Cloudflare Pages:**
Configure in `wrangler.toml`:
```toml
[env.production.vars]
SERVER_URL = "https://api.canthus.org"
NODE_ENV = "production"
VITE_ENV_NAME = "production"
```

#### Environment Validation

The client includes rigorous environment variable validation:
- **Missing variables**: Clear error messages with setup instructions
- **Invalid URLs**: Validates URL format for server endpoints
- **Fallback URLs**: Automatic fallbacks for development/production
- **Debug logging**: Shows which variables are available

#### Quick Setup

Run the setup script for guided environment configuration:
```bash
cd client
bun run setup:env
```

## Best Practices

### Server Logging

1. **Use structured logging** with consistent context
2. **Include request IDs** for tracing requests across services
3. **Log authentication events** for security monitoring
4. **Use appropriate log levels** (debug for development, info+ for production)
5. **Include timing information** for performance monitoring

### Client Logging

1. **Log component lifecycle** for debugging React issues
2. **Track user interactions** for UX analysis
3. **Monitor API performance** with timing data
4. **Use error boundaries** to catch and log React errors
5. **Avoid logging sensitive data** in client logs

### Security Considerations

1. **Never log passwords or tokens** in plain text
2. **Sanitize user input** before logging
3. **Use structured logging** to avoid log injection
4. **Set appropriate log retention** periods
5. **Monitor log access** and implement proper access controls

## Troubleshooting

### Common Issues

1. **Logs not appearing**
   - Check that observability is enabled in wrangler.toml
   - Verify the worker is deployed with the latest configuration
   - Check Cloudflare dashboard for any service issues

2. **Missing request context**
   - Ensure `createRequestContext` is called with proper request object
   - Check that environment variables are properly set

3. **Performance impact**
   - Debug logs are automatically disabled in production
   - Consider log level filtering for high-traffic applications

### Debug Mode

Enable debug mode for local development:

```bash
# Server
cd server
bun run logs:debug

# Client - logs will appear in browser console
cd client
bun run dev
```

## Integration with External Services

The logging system can be extended to integrate with external services:

### Analytics Services

```typescript
// In client/src/lib/logger.ts
private async sendToAnalytics(event: string, message: string, context?: LogContext): Promise<void> {
    // Integrate with Google Analytics, Mixpanel, etc.
    if (typeof gtag !== 'undefined') {
        gtag('event', event, {
            custom_parameter: message,
            ...context
        });
    }
}
```

### Error Tracking

```typescript
// Integrate with Sentry, Bugsnag, etc.
private sendToErrorTracking(error: Error, context?: LogContext): void {
    if (typeof Sentry !== 'undefined') {
        Sentry.captureException(error, {
            tags: context,
            extra: context
        });
    }
}
```

## Monitoring and Alerting

### Cloudflare Analytics

- **Real User Monitoring (RUM)**: Client-side performance and error tracking
- **Workers Analytics**: Server-side request metrics and error rates
- **Custom Metrics**: Define custom metrics for business logic

### Setting Up Alerts

1. Go to Cloudflare Dashboard
2. Navigate to **Notifications**
3. Create alerts for:
   - High error rates
   - Slow response times
   - Authentication failures
   - Unusual traffic patterns

## Cost Considerations

### Cloudflare Logging Costs

- **Workers Logs**: Included in Workers plan
- **Pages Analytics**: Included in Pages plan
- **Real User Monitoring**: Available on Pro plans and above
- **Custom Metrics**: May incur additional costs

### Optimization

1. **Use appropriate log levels** to reduce volume
2. **Implement log sampling** for high-traffic applications
3. **Set log retention policies** to manage storage costs
4. **Use structured logging** to enable efficient filtering and querying
