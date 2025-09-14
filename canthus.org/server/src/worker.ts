import { createApp } from './index';
import { createLogger, createRequestContext } from './logger';

// Define the environment interface for Cloudflare Workers
export interface Env {
    // WorkOS configuration
    WORKOS_API_KEY: string;
    WORKOS_CLIENT_ID: string;
    WORKOS_REDIRECT_URI: string;
    WORKOS_COOKIE_PASSWORD: string;

    // App configuration
    APP_BASE_URL: string;
    NODE_ENV?: string;

    // Optional: Add other bindings like KV, D1, etc. here
    // SESSIONS?: KVNamespace;
}

export default {
    async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
        const startTime = Date.now();
        const isProduction = env.NODE_ENV === 'production';
        const logger = createLogger(isProduction);

        // Create request context for logging
        const requestContext = createRequestContext(request, env);

        try {
            logger.requestStart(request.method, request.url, requestContext);

            // Create the Hono app with environment variables
            const app = createApp(env);

            // Handle the request
            const response = await app.fetch(request);

            const duration = Date.now() - startTime;
            logger.requestEnd(request.method, request.url, response.status, duration, requestContext);

            return response;
        } catch (error) {
            const duration = Date.now() - startTime;
            logger.requestError(request.method, request.url, error as Error, {
                ...requestContext,
                duration,
            });

            // Return a proper error response
            return new Response(
                JSON.stringify({
                    error: 'Internal Server Error',
                    message: error instanceof Error ? error.message : 'Unknown error'
                }),
                {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }
    },
};
