import { createApp } from './index';

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
        try {
            // Create the Hono app with environment variables
            const app = createApp(env);

            // Handle the request
            return await app.fetch(request);
        } catch (error) {
            console.error('Worker error:', error);

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
