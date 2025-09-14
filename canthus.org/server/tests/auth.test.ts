import { describe, it, expect, beforeAll, afterEach, mock } from "bun:test";

beforeAll(() => {
    process.env.WORKOS_API_KEY = "test_key";
    process.env.WORKOS_CLIENT_ID = "test_client";
    process.env.WORKOS_COOKIE_PASSWORD = "test_cookie_password_please_change";
    process.env.WORKOS_REDIRECT_URI = "http://localhost:3000/auth/callback";
    process.env.APP_BASE_URL = "http://localhost:5173";
});

afterEach(() => {
    // Reset module cache between tests to ensure mocks don't leak
    const indexPath = require.resolve("../src/index");
    delete require.cache[indexPath];
});

function mockWorkOS(success: boolean) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const workosModule = require("../src/workos");

    const mockGetAuthorizationUrl = mock(() => "https://auth.example/authorize");

    const mockAuthenticateWithCode = success
        ? mock(() => Promise.resolve({
            user: { id: "user_123" },
            sealedSession: "sealed.session.value",
        }))
        : mock(() => Promise.reject(new Error("auth failed")));

    const mockLoadSealedSession = mock(({ sessionData, cookiePassword }: { sessionData: string; cookiePassword: string; }) => {
        if (!success) {
            return {
                authenticate: () => Promise.resolve({ authenticated: false, reason: "invalid_session_cookie" }),
            } as unknown as { authenticate: () => Promise<unknown> };
        }
        return {
            authenticate: () => Promise.resolve({
                authenticated: true,
                sessionId: "sess_123",
                user: { id: "user_123" },
                accessToken: "token",
            }),
        } as unknown as { authenticate: () => Promise<unknown> };
    });

    workosModule.workos.userManagement = {
        getAuthorizationUrl: mockGetAuthorizationUrl,
        authenticateWithCode: mockAuthenticateWithCode,
        loadSealedSession: mockLoadSealedSession,
        listOrganizationMemberships: mock(() => Promise.resolve({
            data: [
                { id: 'om_1', organizationId: 'org_1' },
                { id: 'om_2', organizationId: 'org_2' },
            ],
        })),
    } as typeof workosModule.workos.userManagement;
}

describe("auth routes", () => {
    it("/auth/login redirects to provider authorization URL", async () => {
        mockWorkOS(true);
        const { app } = await import("../src/index");
        const res = await app.request("http://localhost/auth/login");
        expect(res.status).toBe(302);
        const location = res.headers.get("location");
        expect(location).toBe("https://auth.example/authorize");
    });

    it("/auth/callback 400s when no code provided", async () => {
        mockWorkOS(true);
        const { app } = await import("../src/index");
        const res = await app.request("http://localhost/auth/callback");
        expect(res.status).toBe(400);
    });

    it("/auth/callback sets cookie and redirects on success", async () => {
        mockWorkOS(true);
        const { app } = await import("../src/index");
        const res = await app.request("http://localhost/auth/callback?code=abc123");
        expect(res.status).toBe(302);
        const setCookie = res.headers.get("set-cookie");
        expect(setCookie).toBeTruthy();
        expect(setCookie).toContain("wos-session=");
        expect(res.headers.get("location")).toBe("/");
    });

    it("/auth/callback redirects to /auth/login on error", async () => {
        mockWorkOS(false);
        const { app } = await import("../src/index");
        const res = await app.request("http://localhost/auth/callback?code=bad");
        expect(res.status).toBe(302);
        expect(res.headers.get("location")).toBe("/login");
    });

    it("/auth/me 401s when no session cookie present", async () => {
        mockWorkOS(true);
        const { app } = await import("../src/index");
        const res = await app.request("http://localhost/auth/me");
        expect(res.status).toBe(401);
    });

    it("/auth/me returns user when session valid", async () => {
        mockWorkOS(true);
        const { app } = await import("../src/index");
        const res = await app.request("http://localhost/auth/me", {
            headers: {
                cookie: "wos-session=sealed.session.value",
            },
        });
        expect(res.status).toBe(200);
        const json = await res.json();
        expect(json.authenticated).toBe(true);
        expect(json.user.id).toBe("user_123");
    });

    it("/auth/organizations returns list when session valid", async () => {
        mockWorkOS(true);
        const { app } = await import("../src/index");
        const res = await app.request("http://localhost/auth/organizations", {
            headers: {
                cookie: "wos-session=sealed.session.value",
            },
        });
        expect(res.status).toBe(200);
        const json = await res.json();
        expect(json.authenticated).toBe(true);
        expect(Array.isArray(json.organizations)).toBe(true);
        expect(json.organizations.map((o: any) => o.id)).toEqual(['org_1', 'org_2']);
    });

    it("/auth/organizations 401s when no session cookie present", async () => {
        mockWorkOS(true);
        const { app } = await import("../src/index");
        const res = await app.request("http://localhost/auth/organizations");
        expect(res.status).toBe(401);
    });

    it("/auth/me 401s when session invalid", async () => {
        mockWorkOS(false);
        const { app } = await import("../src/index");
        const res = await app.request("http://localhost/auth/me", {
            headers: {
                cookie: "wos-session=bad",
            },
        });
        expect(res.status).toBe(401);
    });

    it("/protected returns 200 after authenticating via callback", async () => {
        mockWorkOS(true);
        const { app } = await import("../src/index");

        // Authenticate to receive the sealed session cookie
        const authRes = await app.request("http://localhost/auth/callback?code=valid_code");
        expect(authRes.status).toBe(302);
        const setCookie = authRes.headers.get("set-cookie");
        expect(setCookie).toBeTruthy();

        // Extract the cookie name=value portion
        const cookieHeader = setCookie!.split(";")[0];

        // Call the protected route with the session cookie
        const protectedRes = await app.request("http://localhost/protected", {
            headers: new Headers([["cookie", cookieHeader as string]]),
        });

        expect(protectedRes.status).toBe(200);
        const text = await protectedRes.text();
        expect(text).toBe("Protected route");
    });
});


