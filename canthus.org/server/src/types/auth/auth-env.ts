export interface AuthEnv {
    WORKOS_REDIRECT_URI: string;
    WORKOS_COOKIE_PASSWORD: string;
    WORKOS_CLIENT_ID: string;
    WORKOS_API_KEY?: string;

    APP_BASE_URL: string;
}

export function getAuthEnv(env?: any): AuthEnv {
    const envVars = env || (typeof process !== 'undefined' ? process.env : {});

    // Only validate if we have environment variables to validate
    if (envVars && Object.keys(envVars).length > 0) {
        if (!envVars.WORKOS_REDIRECT_URI) {
            throw new Error("WORKOS_REDIRECT_URI is not set");
        }
        if (!envVars.WORKOS_COOKIE_PASSWORD) {
            throw new Error("WORKOS_COOKIE_PASSWORD is not set");
        }
        if (!envVars.WORKOS_CLIENT_ID) {
            throw new Error("WORKOS_CLIENT_ID is not set");
        }
        if (!envVars.APP_BASE_URL) {
            throw new Error("APP_BASE_URL is not set");
        }
    }

    return {
        WORKOS_REDIRECT_URI: (envVars?.WORKOS_REDIRECT_URI as string) || '',
        WORKOS_COOKIE_PASSWORD: (envVars?.WORKOS_COOKIE_PASSWORD as string) || '',
        WORKOS_CLIENT_ID: (envVars?.WORKOS_CLIENT_ID as string) || '',
        WORKOS_API_KEY: (envVars?.WORKOS_API_KEY as string) || '',
        APP_BASE_URL: (envVars?.APP_BASE_URL as string) || '',
    };
}