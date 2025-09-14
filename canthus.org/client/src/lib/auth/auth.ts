import { client } from "@/lib/api/client";
import type { AuthMeResponse, User } from "shared/dist";
import { deleteCookie } from "./storage";
import { getServerUrl, logger } from "@/lib/env/client-env";

function getBaseUrl() {
    try {
        const serverUrl = getServerUrl();
        logger.debug('Using server URL for auth redirects', {
            component: 'Auth',
            serverUrl
        });
        return serverUrl;
    } catch (error) {
        logger.error('Failed to get server URL, using fallback', {
            component: 'Auth',
            error: (error as Error).message
        });
        // Fallback for development
        return import.meta.env.DEV ? 'http://localhost:3000' : 'https://api.canthus.org';
    }
}

function redirectTo(path: string) {
    const base = getBaseUrl();
    window.location.href = `${base}${path}`;
}

export async function amILoggedIn(): Promise<boolean> {
    try {
        const res = await client.auth.me.$get();
        const json = await res.json() as AuthMeResponse;
        return json.authenticated === true;
    } catch (_err) {
        return false;
    }
}

export async function myProfile(): Promise<User | null> {
    try {
        const res = await client.auth.me.$get();
        const json = await res.json() as AuthMeResponse;
        if (json.authenticated) {
            return (json as Extract<AuthMeResponse, { authenticated: true }>).user;
        }
        return null;
    } catch (_err) {
        return null;
    }
}

export function logIn(): void {
    const current = window.location.pathname + window.location.search;
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/auth/login?redirect_to=${encodeURIComponent(!current.includes("/app") ? "/app" : current)}`;

    logger.info('Redirecting to login', {
        component: 'Auth',
        url,
        redirectTo: current
    });

    window.location.href = url;
}

export function logOut(): void {
    try {
        localStorage.removeItem('me:user');
        deleteCookie('me:user');
    } catch { }
    redirectTo("/auth/logout");
}