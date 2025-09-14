export interface AuthEnv {
    WORKOS_REDIRECT_URI: string;
    WORKOS_COOKIE_PASSWORD: string;
    WORKOS_CLIENT_ID: string;
    WORKOS_API_KEY?: string;

    APP_BASE_URL: string;
}

export function getAuthEnv(env?: any): AuthEnv {
    const envVars = env || (typeof process !== 'undefined' ? process.env : {});

    // Log available environment variables for debugging
    console.log('Available environment variables:', Object.keys(envVars));

    // Only validate if we have environment variables to validate
    if (envVars && Object.keys(envVars).length > 0) {
        const missingVars: string[] = [];

        if (!envVars.WORKOS_REDIRECT_URI) {
            missingVars.push("WORKOS_REDIRECT_URI");
        }
        if (!envVars.WORKOS_COOKIE_PASSWORD) {
            missingVars.push("WORKOS_COOKIE_PASSWORD");
        }
        if (!envVars.WORKOS_CLIENT_ID) {
            missingVars.push("WORKOS_CLIENT_ID");
        }
        if (!envVars.APP_BASE_URL) {
            missingVars.push("APP_BASE_URL");
        }

        if (missingVars.length > 0) {
            const errorMessage = `Missing required environment variables: ${missingVars.join(', ')}. ` +
                `For Wrangler development, create a .dev.vars file. For production, use 'wrangler secret put' or configure in wrangler.toml.`;
            console.error(errorMessage);
            throw new Error(errorMessage);
        }
    } else {
        console.warn('No environment variables provided. Make sure to:');
        console.warn('1. Create a .dev.vars file for local development');
        console.warn('2. Set secrets via "wrangler secret put" for production');
        console.warn('3. Or configure environment variables in wrangler.toml');
    }

    return {
        WORKOS_REDIRECT_URI: (envVars?.WORKOS_REDIRECT_URI as string) || '',
        WORKOS_COOKIE_PASSWORD: (envVars?.WORKOS_COOKIE_PASSWORD as string) || '',
        WORKOS_CLIENT_ID: (envVars?.WORKOS_CLIENT_ID as string) || '',
        WORKOS_API_KEY: (envVars?.WORKOS_API_KEY as string) || '',
        APP_BASE_URL: (envVars?.APP_BASE_URL as string) || '',
    };
}