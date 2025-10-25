/**
 * Cloudflare Workers entry point for Canthus API
 * 
 * This file follows Cloudflare Workers best practices:
 * - Proper TypeScript typing with Env interface
 * - Environment variable validation
 * - Error handling and logging
 * - CORS configuration
 * - Request/Response handling
 */

import { createApp } from './index';
import { getAuthEnv } from './types/auth/auth-env';
import { getLogger } from './logger';
import type { ExecutionContext } from 'hono';

// Cloudflare Workers types
interface KVNamespace {
    get(key: string): Promise<string | null>;
    put(key: string, value: string): Promise<void>;
    delete(key: string): Promise<void>;
}

interface RequestWithCf extends Request {
    cf?: {
        country?: string;
        city?: string;
        region?: string;
        timezone?: string;
    };
}

// Define the environment interface for Cloudflare Workers
export interface Env {
    // WorkOS configuration
    WORKOS_API_KEY: string;
    WORKOS_CLIENT_ID: string;
    WORKOS_REDIRECT_URI: string;
    WORKOS_COOKIE_PASSWORD: string;

    // Application configuration
    APP_BASE_URL: string;
    NODE_ENV: string;

    // Optional: KV namespaces for session storage
    SESSIONS?: KVNamespace;

    // Optional: Durable Objects bindings
    // SESSION_STORE?: DurableObjectNamespace;

    // Optional: R2 bucket bindings
    // UPLOADS?: R2Bucket;
}

/**
 * Validates that all required environment variables are present
 */
function validateEnvironment(env: Env): void {
    const requiredVars: (keyof Env)[] = [
        'WORKOS_API_KEY',
        'WORKOS_CLIENT_ID',
        'WORKOS_REDIRECT_URI',
        'WORKOS_COOKIE_PASSWORD',
        'APP_BASE_URL'
    ];

    const missing = requiredVars.filter(key => !env[key]);

    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
}

/**
 * Main Cloudflare Workers fetch handler
 */
export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const logger = getLogger();
        const startTime = Date.now();

        try {
            // Validate environment variables
            validateEnvironment(env);

            // Log request details (without sensitive data)
            const requestWithCf = request as RequestWithCf;
            logger.info('Request received', {
                method: request.method,
                url: request.url,
                userAgent: request.headers.get('User-Agent') || undefined,
                cf: {
                    country: requestWithCf.cf?.country,
                    city: requestWithCf.cf?.city,
                    region: requestWithCf.cf?.region,
                    timezone: requestWithCf.cf?.timezone,
                }
            });

            // Create the Hono app with environment variables
            const app = createApp(env);

            // Handle the request
            const response = await app.fetch(request, env, ctx);

            // Log response details
            const duration = Date.now() - startTime;
            logger.info('Request completed', {
                status: response.status,
                duration: `${duration}ms`,
                method: request.method,
                url: request.url
            });

            return response;

        } catch (error) {
            const duration = Date.now() - startTime;

            // Log error details
            logger.error('Request failed', {
                error: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined,
                duration: `${duration}ms`,
                method: request.method,
                url: request.url
            });

            // Return appropriate error response
            if (error instanceof Error && error.message.includes('Missing required environment variables')) {
                return new Response(
                    JSON.stringify({
                        error: 'Server configuration error',
                        message: 'Required environment variables are missing'
                    }),
                    {
                        status: 500,
                        headers: { 'Content-Type': 'application/json' }
                    }
                );
            }

            // Generic error response
            return new Response(
                JSON.stringify({
                    error: 'Internal server error',
                    message: 'An unexpected error occurred'
                }),
                {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }
    },

    /**
     * Handle scheduled events (cron jobs)
     * Uncomment and implement if you need scheduled tasks
     */
    // async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    //   const logger = getLogger();
    //   
    //   logger.info('Scheduled event triggered', {
    //     cron: event.cron,
    //     scheduledTime: event.scheduledTime
    //   });
    //   
    //   // Implement your scheduled task logic here
    //   // Example: cleanup expired sessions, send notifications, etc.
    // },

    /**
     * Handle WebSocket connections
     * Uncomment and implement if you need WebSocket support
     */
    // async webSocket(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    //   const logger = getLogger();
    //   
    //   logger.info('WebSocket connection attempt', {
    //     url: request.url,
    //     headers: Object.fromEntries(request.headers.entries())
    //   });
    //   
    //   // Implement WebSocket logic here
    //   return new Response('WebSocket not implemented', { status: 501 });
    // }
};