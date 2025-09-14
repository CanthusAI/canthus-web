// Centralized WorkOS client singleton
import { WorkOS } from '@workos-inc/node';
import type { WorkOS as WorkOSType } from '@workos-inc/node';

// Create a function to get WorkOS client with proper environment variables
export function createWorkOSClient(apiKey?: string, clientId?: string): WorkOSType {
    const key = apiKey || (typeof process !== 'undefined' ? process.env?.WORKOS_API_KEY : undefined);
    const id = clientId || (typeof process !== 'undefined' ? process.env?.WORKOS_CLIENT_ID : undefined);

    // Only validate if we have actual values to work with
    if (key && id) {
        return new WorkOS(key, {
            clientId: id,
        });
    }

    // Return a mock client for Cloudflare Workers (will be replaced with proper client)
    return {} as WorkOSType;
}

// Default export for backward compatibility (only works in Node.js/Bun environment)
// For Cloudflare Workers, use createWorkOSClient() with explicit parameters
let workos: WorkOSType;
try {
    // Only initialize if we're in a Node.js/Bun environment
    if (typeof process !== 'undefined' && process.env) {
        workos = createWorkOSClient();
    } else {
        // Create a dummy client for Cloudflare Workers (will be replaced with proper client)
        workos = {} as WorkOSType;
    }
} catch (error) {
    // Fallback for Cloudflare Workers
    workos = {} as WorkOSType;
}

export { workos };


