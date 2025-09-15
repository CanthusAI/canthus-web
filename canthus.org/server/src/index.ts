import { Hono, type Context } from "hono";
import { cors } from "hono/cors";
import { getCookie, setCookie } from "hono/cookie";
import { createAuthRoutes, withAuth } from "./auth";
import type { ApiResponse } from "shared/dist";
import { getAuthEnv } from "./types/auth/auth-env";

export function createApp(env?: any) {
	// Enhanced logging for environment variable debugging
	if (env && Object.keys(env).length > 0) {
		console.log('Environment variables received:', {
			hasWorkosApiKey: !!env.WORKOS_API_KEY,
			hasWorkosClientId: !!env.WORKOS_CLIENT_ID,
			hasWorkosRedirectUri: !!env.WORKOS_REDIRECT_URI,
			hasWorkosCookiePassword: !!env.WORKOS_COOKIE_PASSWORD,
			hasAppBaseUrl: !!env.APP_BASE_URL,
			nodeEnv: env.NODE_ENV,
			totalKeys: Object.keys(env).length
		});
	} else {
		console.warn('No environment variables provided to createApp');
	}

	const authEnv = getAuthEnv(env);
	const isProduction = (env?.NODE_ENV || process.env.NODE_ENV) === 'production';

	// Ensure CORS allows credentials and the specific client origins
	const allowedOrigins = (() => {
		const origins = [];

		// Add the configured APP_BASE_URL origin
		if (authEnv.APP_BASE_URL) {
			try {
				origins.push(new URL(authEnv.APP_BASE_URL).origin);
			} catch {
				origins.push(authEnv.APP_BASE_URL);
			}
		}

		origins.push('https://canthus-org.pages.dev');
		origins.push('https://canthus.org');

		origins.push('http://localhost:*');

		return origins;
	})();

	const app = new Hono()
		.basePath("/api")
		.use(cors({
			origin: allowedOrigins,
			credentials: true,
			allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
			allowHeaders: ["Content-Type", "Authorization"],
		}))
		.get("/", (c) => {
			return c.text("Hello Hono!");
		})
		.get("/hello", async (c) => {
			const greeted = getCookie(c, "greeted");
			if (!greeted) {
				setCookie(c, "greeted", "true", {
					httpOnly: true,
					sameSite: "Lax",
					path: "/",
				});
			}
			const data: ApiResponse = {
				message: greeted ? "Welcome back!" : "Hello Canthus!",
				success: true,
			};
			return c.json(data, { status: 200 });
		})
		.get("/protected", async (c) => withAuth(c, {
			authEnv,
			secureCookie: isProduction,
		}, async (c) => {
			return c.text("Protected route", { status: 200 });
		}))
		.route("/auth", createAuthRoutes({
			authEnv,
			secureCookie: isProduction,
		}));

	return app;
}

export const app = createApp();
export type AppType = ReturnType<typeof createApp>;