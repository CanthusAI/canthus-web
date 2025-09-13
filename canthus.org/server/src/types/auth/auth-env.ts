export interface AuthEnv {
    WORKOS_REDIRECT_URI: string;
    WORKOS_COOKIE_PASSWORD: string;
    WORKOS_CLIENT_ID: string;

    APP_BASE_URL: string;
}
export function getAuthEnv(): AuthEnv {
    if (!process.env.WORKOS_REDIRECT_URI) {
        throw new Error("WORKOS_REDIRECT_URI is not set");
    }
    if (!process.env.WORKOS_COOKIE_PASSWORD) {
        throw new Error("WORKOS_COOKIE_PASSWORD is not set");
    }
    if (!process.env.WORKOS_CLIENT_ID) {
        throw new Error("WORKOS_CLIENT_ID is not set");
    }
    if (!process.env.APP_BASE_URL) {
        throw new Error("APP_BASE_URL is not set");
    }

    return {
        WORKOS_REDIRECT_URI: process.env.WORKOS_REDIRECT_URI as string,
        WORKOS_COOKIE_PASSWORD: process.env.WORKOS_COOKIE_PASSWORD as string,
        WORKOS_CLIENT_ID: process.env.WORKOS_CLIENT_ID as string,
        APP_BASE_URL: process.env.APP_BASE_URL as string,
    };
}