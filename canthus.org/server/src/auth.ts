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

function getCookieOptions(authEnv: AuthEnv, secureCookie: boolean): any {
    const cookieOptions: any = {
        path: '/',
        httpOnly: true,
        secure: secureCookie,
        sameSite: 'Lax',
    };

    // For production, set domain to allow cross-subdomain access
    if (secureCookie) {
        try {
            const appUrl = new URL(authEnv.APP_BASE_URL);
            const domain = appUrl.hostname;
            // Only set domain for production domains (not localhost)
            if (!domain.includes('localhost') && !domain.includes('127.0.0.1')) {
                cookieOptions.domain = domain.startsWith('.') ? domain : `.${domain}`;
            }
        } catch (e) {
            console.warn('Could not parse APP_BASE_URL for cookie domain:', e);
        }
    }

    return cookieOptions;
}

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
                    const cookieOptions = getCookieOptions(authEnv, secureCookie);
                    setCookie(c, 'wos-session', sealedSession, cookieOptions);
                    logger.cookieSet('wos-session', { cookieOptions }, {
                        endpoint: '/auth/callback',
                        userId: user?.id,
                    });

                    // Store user data in cookies for client access
                    setCookie(c, 'me:user', JSON.stringify(user), {
                        ...cookieOptions,
                        httpOnly: false, // Allow client-side access
                        maxAge: 60 * 60 * 24 * 7, // 7 days
                    });

                    // Get and store organizations
                    try {
                        const orgs = await getOrganizations(user.id, workos);
                        if (orgs.authenticated && orgs.organizations) {
                            setCookie(c, 'me:organizations', JSON.stringify(orgs.organizations), {
                                ...cookieOptions,
                                httpOnly: false, // Allow client-side access
                                maxAge: 60 * 60 * 24 * 7, // 7 days
                            });
                        }
                    } catch (error) {
                        logger.warn('Failed to fetch organizations', {
                            endpoint: '/auth/callback',
                            userId: user?.id,
                            error: (error as Error).message
                        });
                    }
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

                // Redirect directly to the app - no need for client-side callback processing
                const finalRedirect = redirectTo || '/app';
                return c.redirect(`${authEnv.APP_BASE_URL}${finalRedirect}`);
            } catch (error) {
                logger.workosAuthError(error as Error, {
                    endpoint: '/auth/callback',
                });
                return c.redirect('/login');
            }
        })
        // Logout clears all auth cookies and redirects home
        .get('/logout', async (c) => {
            logger.authLogout(undefined, {
                endpoint: '/auth/logout',
            });

            const cookieOptions = getCookieOptions(authEnv, secureCookie);

            // Clear all authentication cookies
            deleteCookie(c, 'wos-session', cookieOptions);
            deleteCookie(c, 'me:user', cookieOptions);
            deleteCookie(c, 'me:organizations', cookieOptions);

            logger.cookieDelete('wos-session', {
                endpoint: '/auth/logout',
            });
            logger.cookieDelete('me:user', {
                endpoint: '/auth/logout',
            });
            logger.cookieDelete('me:organizations', {
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

                // Update cookies with fresh data
                const cookieOptions = getCookieOptions(authEnv, secureCookie);
                setCookie(c, 'me:user', JSON.stringify(user), {
                    ...cookieOptions,
                    httpOnly: false,
                    maxAge: 60 * 60 * 24 * 7, // 7 days
                });
                setCookie(c, 'me:organizations', JSON.stringify(orgs.organizations), {
                    ...cookieOptions,
                    httpOnly: false,
                    maxAge: 60 * 60 * 24 * 7, // 7 days
                });

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
    const logger = getLogger();
    const sessionData = getCookie(c, 'wos-session');

    if (!sessionData) {
        logger.authFailure('No session cookie found', {
            endpoint: c.req.path,
            reason: 'no_session_cookie'
        });
        return c.redirect('/login');
    }

    const workos = createWorkOSClient(options.authEnv.WORKOS_API_KEY, options.authEnv.WORKOS_CLIENT_ID);
    const session = workos.userManagement.loadSealedSession({
        sessionData: sessionData,
        cookiePassword: options.authEnv.WORKOS_COOKIE_PASSWORD,
    });

    try {
        const authResult = await session.authenticate();

        if (authResult.authenticated) {
            logger.info('Authentication successful', {
                endpoint: c.req.path,
                userId: authResult.user?.id
            });
            return next(c);
        }

        // If the session is invalid, attempt to refresh
        logger.warn('Session invalid, attempting refresh', {
            endpoint: c.req.path,
            reason: authResult.reason
        });

        const refreshResult = await session.refresh();

        if (!refreshResult.authenticated || !refreshResult.sealedSession) {
            logger.authFailure('Token refresh failed', {
                endpoint: c.req.path,
                reason: 'refresh_failed'
            });
            return c.redirect('/login');
        }

        // Update the cookie with refreshed session
        const cookieOptions = getCookieOptions(options.authEnv, options.secureCookie ?? true);
        setCookie(c, 'wos-session', refreshResult.sealedSession, cookieOptions);

        logger.info('Token refreshed successfully', {
            endpoint: c.req.path,
            userId: refreshResult.user?.id
        });

        // Redirect to the same route to ensure the updated cookie is used
        return c.redirect(c.req.url);
    } catch (error) {
        logger.error('Authentication error', {
            endpoint: c.req.path,
            error: (error as Error).message
        });

        // Failed to refresh access token, redirect user to login page
        // after deleting the cookie
        const deleteCookieOptions = getCookieOptions(options.authEnv, options.secureCookie ?? true);
        deleteCookie(c, 'wos-session', deleteCookieOptions);
        return c.redirect('/login');
    }
}

