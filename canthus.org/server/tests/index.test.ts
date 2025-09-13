import { describe, it, expect, beforeAll } from "bun:test";

beforeAll(() => {
    process.env.WORKOS_API_KEY = "test_key";
    process.env.WORKOS_CLIENT_ID = "test_client";
    process.env.WORKOS_COOKIE_PASSWORD = "test_cookie_password_please_change";
    process.env.WORKOS_REDIRECT_URI = "http://localhost:3000/auth/callback";
    process.env.APP_BASE_URL = "http://localhost:5173";
});

describe("GET /hello", () => {
    it("sets greeted cookie on first visit", async () => {
        const { app } = await import("../src/index");
        const res = await app.request("http://localhost/hello");
        expect(res.status).toBe(200);
        const setCookie = res.headers.get("set-cookie");
        expect(setCookie).toBeTruthy();
        expect(setCookie).toContain("greeted=");
    });
});

describe("GET /auth/callback", () => {
    it("returns 400 when no code provided", async () => {
        const { app } = await import("../src/index");
        const res = await app.request("http://localhost/auth/callback");
        expect(res.status).toBe(400);
    });
});

describe("CORS configuration", () => {
    it("allows credentials for configured origin", async () => {
        const { app } = await import("../src/index");
        const res = await app.request("http://localhost/hello", {
            method: "OPTIONS",
            headers: {
                Origin: process.env.APP_BASE_URL!,
                "Access-Control-Request-Method": "GET",
                "Access-Control-Request-Headers": "Content-Type",
            },
        });
        expect(res.headers.get("access-control-allow-credentials")).toBe("true");
        expect(res.headers.get("access-control-allow-origin")).toBe(process.env.APP_BASE_URL!);
    });
});

describe("Auth /me", () => {
    it("returns unauthenticated without session cookie", async () => {
        const { app } = await import("../src/index");
        const res = await app.request("http://localhost/auth/me");
        expect(res.status).toBe(401);
        const json = await res.json();
        expect(json).toEqual({ authenticated: false });
    });
});

describe("Auth login/logout redirects", () => {
    it("/auth/login sets redirect_to cookie when provided", async () => {
        const { app } = await import("../src/index");
        const res = await app.request("http://localhost/auth/login?redirect_to=%2Fapp%3Fq%3D1");
        const setCookie = res.headers.get("set-cookie");
        expect(setCookie).toBeTruthy();
        expect(setCookie).toContain("redirect_to=");
    });

    it("/auth/logout clears session and redirects home", async () => {
        const { app } = await import("../src/index");
        const res = await app.request("http://localhost/auth/logout");
        expect(res.status).toBe(302);
        const loc = res.headers.get("location");
        expect(loc).toBe(`${process.env.APP_BASE_URL!}/`);
    });
});


