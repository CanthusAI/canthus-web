import { Hono, type Context } from "hono";
import { setCookie, getCookie, deleteCookie } from "hono/cookie";
import { createWorkOSClient } from "./workos";
import { getLogger } from "./logger";
import type { AuthEnv } from "./types/auth/auth-env";
import type { RefreshSessionResponse } from "@workos-inc/node";
import type { Organization, OrganizationsResponse, User } from "shared/dist";
import type { CookieSession } from "node_modules/@workos-inc/node/lib/user-management/session";

export type CreateAuthRoutesOptions = {
    authEnv: AuthEnv;
    secureCookie?: boolean;
};

export function createAuthRoutes(options: CreateAuthRoutesOptions) {
    const { secureCookie = true, authEnv } = options;
    const workos = createWorkOSClient(authEnv.WORKOS_API_KEY, authEnv.WORKOS_CLIENT_ID);
    const logger = getLogger();

    const router = new Hono()
        // Login initiates the AuthKit flow
        .get('/login', async (c) => {
            const redirectTo = c.req.query('redirect_to');
            logger.authAttempt(undefined, {
                endpoint: '/auth/login',
                redirectTo,
            });

            if (redirectTo) {
                setCookie(c, 'redirect_to', redirectTo, {
                    path: '/',
                    httpOnly: true,
                    secure: secureCookie,
                    sameSite: 'None',
                });
                logger.cookieSet('redirect_to', { redirectTo }, {
                    endpoint: '/auth/login',
                });
            }

            const authorizationUrl = workos.userManagement.getAuthorizationUrl({
                provider: 'authkit',
                redirectUri: authEnv.WORKOS_REDIRECT_URI,
                clientId: authEnv.WORKOS_CLIENT_ID,
            });

            logger.info('Redirecting to WorkOS authorization', {
                endpoint: '/auth/login',
                authorizationUrl,
            });

            return c.redirect(authorizationUrl);
        })
        // Callback completes the flow and stores sealed session in a cookie
        .get('/callback', async (c) => {
            const code = c.req.query('code');
            logger.workosCallback(code || '', {
                endpoint: '/auth/callback',
            });

            if (!code) {
                logger.authFailure('No authorization code provided', {
                    endpoint: '/auth/callback',
                });
                return c.json({ error: 'No code provided' }, 400);
            }

            try {
                const authenticateResponse = await workos.userManagement.authenticateWithCode({
                    clientId: authEnv.WORKOS_CLIENT_ID,
                    code,
                    session: {
                        sealSession: true,
                        cookiePassword: authEnv.WORKOS_COOKIE_PASSWORD,
                    },
                });

                const { user, sealedSession } = authenticateResponse;
                logger.workosAuthSuccess(user, {
                    endpoint: '/auth/callback',
                    userId: user?.id,
                });

                if (sealedSession) {
                    setCookie(c, 'wos-session', sealedSession, {
                        path: '/',
                        httpOnly: true,
                        // For cross-site XHRs from the client origin to include cookies,
                        // the cookie must be SameSite=None. In production, it must also be Secure.
                        secure: secureCookie,
                        sameSite: 'None',
                    });
                    logger.cookieSet('wos-session', { secure: secureCookie, sameSite: 'None' }, {
                        endpoint: '/auth/callback',
                        userId: user?.id,
                    });
                }

                const redirectTo = getCookie(c, 'redirect_to');
                if (redirectTo) {
                    deleteCookie(c, 'redirect_to', { path: '/' });
                    logger.cookieDelete('redirect_to', {
                        endpoint: '/auth/callback',
                        userId: user?.id,
                    });
                }

                logger.authSuccess(user.id, {
                    endpoint: '/auth/callback',
                    redirectTo,
                });

                return c.redirect(`${authEnv.APP_BASE_URL}${`/auth/callback?redirect_to=${redirectTo}`}`);
            } catch (error) {
                logger.workosAuthError(error as Error, {
                    endpoint: '/auth/callback',
                });
                return c.redirect('/login');
            }
        })
        // Logout clears the sealed session cookie and redirects home
        .get('/logout', async (c) => {
            logger.authLogout(undefined, {
                endpoint: '/auth/logout',
            });

            deleteCookie(c, 'wos-session', {
                path: '/',
                httpOnly: true,
                secure: secureCookie,
                sameSite: 'Lax',
            });

            logger.cookieDelete('wos-session', {
                endpoint: '/auth/logout',
            });

            return c.redirect(`${authEnv.APP_BASE_URL}/`);
        })
        // Returns the current authenticated user using the sealed session cookie.
        // Augments the user with their first organization (if any).
        .get('/me', async (c) => {
            const sealed = getCookie(c, 'wos-session');
            logger.cookieGet('wos-session', !!sealed, {
                endpoint: '/auth/me',
            });

            if (!sealed) {
                logger.authFailure('No session cookie found', {
                    endpoint: '/auth/me',
                });
                return c.json({ authenticated: false }, 401);
            }

            try {
                const session = workos.userManagement.loadSealedSession({
                    sessionData: sealed,
                    cookiePassword: authEnv.WORKOS_COOKIE_PASSWORD,
                });

                const result = await session.authenticate();
                if (!result.authenticated) {
                    return c.json({ authenticated: false }, 401);
                }
                const orgs = await getOrganizations(result.user.id, workos);
                if (!orgs.authenticated) {
                    return c.json(orgs, 401);
                }
                const user = result.user as User;
                user.organizations = orgs.organizations;

                return c.json({ authenticated: true, user: user }, 200);
            } catch (err) {
                return c.json({ authenticated: false }, 401);
            }
        })
        // Returns the organizations the authenticated user belongs to
        .get('/organizations', async (c) => {
            const sealed = getCookie(c, 'wos-session');
            if (!sealed) {
                const unauth: OrganizationsResponse = { authenticated: false };
                return c.json(unauth, 401);
            }

            try {
                const session = workos.userManagement.loadSealedSession({
                    sessionData: sealed,
                    cookiePassword: authEnv.WORKOS_COOKIE_PASSWORD,
                });

                const result = await session.authenticate();
                if (!result.authenticated) {
                    const unauth: OrganizationsResponse = { authenticated: false };
                    return c.json(unauth, 401);
                }

                const userId = result.user.id;
                const orgs = await getOrganizations(userId, workos);
                if (!orgs.authenticated) {
                    return c.json(orgs, 401);
                }
                return c.json(orgs, 200);

            } catch (_err) {
                const unauth: OrganizationsResponse = { authenticated: false };
                return c.json(unauth, 401);
            }
        });

    return router;
}


async function getOrganizations(userId: string, workosClient: any): Promise<OrganizationsResponse> {

    const memberships = await workosClient.userManagement.listOrganizationMemberships({
        userId,
    });

    const organizations: Organization[] = memberships.data.map((m: any) => ({
        id: m.organizationId,
        name: m.organizationName,
        status: m.status,
        role: m.role.slug,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt
    }));

    return { authenticated: true, organizations };
}





export async function withAuth(
    c: Context,
    options: CreateAuthRoutesOptions,
    next: (c: Context) => Response | Promise<Response>,
) {
    const sessionData = getCookie(c, 'wos-session');
    if (!sessionData) {
        return c.redirect('/login');
    }
    const workos = createWorkOSClient(options.authEnv.WORKOS_API_KEY, options.authEnv.WORKOS_CLIENT_ID);
    const session = workos.userManagement.loadSealedSession({
        sessionData: sessionData,
        cookiePassword: options.authEnv.WORKOS_COOKIE_PASSWORD,
    });

    const authResult = await session.authenticate();
    if (authResult.authenticated) {
        return next(c);
    }

    // If the cookie is missing, redirect to login
    if (!authResult.authenticated && authResult.reason === 'no_session_cookie_provided') {
        return c.redirect('/login');
    }

    // If the session is invalid, attempt to refresh
    try {
        const res = await session.refresh();

        if (!res.authenticated || !res.sealedSession) {
            return c.redirect('/login');
        }

        // update the cookie
        setCookie(c, 'wos-session', res.sealedSession, {
            path: '/',
            httpOnly: true,
            secure: options.secureCookie,
            sameSite: 'None',
        });

        // Redirect to the same route to ensure the updated cookie is used
        return c.redirect(c.req.url);
    } catch (e) {
        // Failed to refresh access token, redirect user to login page
        // after deleting the cookie
        deleteCookie(c, 'wos-session');
        return c.redirect('/login');
    }
}

