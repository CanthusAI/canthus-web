import { client } from "@/lib/api/client";

import type { AuthMeResponse, User } from "shared/dist";


function getBaseUrl() {
    return (import.meta as any).env?.VITE_API_BASE_URL as string
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
    const base = getBaseUrl();
    const current = window.location.pathname + window.location.search;
    const url = `${base}/auth/login?redirect_to=${encodeURIComponent(!current.includes("/app") ? "/app" : current)}`;
    window.location.href = url;
}

export function logOut(): void {
    try {
        localStorage.removeItem('me:user');
    } catch { }
    redirectTo("/auth/logout");
}