import { Hono, type Context } from "hono";
import { cors } from "hono/cors";
import { getCookie, setCookie } from "hono/cookie";
import { createAuthRoutes, withAuth } from "./auth";
import type { ApiResponse } from "shared/dist";
import { getAuthEnv } from "./types/auth/auth-env";

const authEnv = getAuthEnv();
const isProduction = process.env.NODE_ENV === 'production';

// Ensure CORS allows credentials and the specific client origin
const allowedOrigin = (() => {
	try {
		return new URL(authEnv.APP_BASE_URL).origin;
	} catch {
		return authEnv.APP_BASE_URL;
	}
})();

export const app = new Hono()
	.use(cors({
		origin: allowedOrigin,
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

export default app;
export type AppType = typeof app;