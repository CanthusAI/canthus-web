// Simple auth status utilities
import { client } from '@/lib/api/client';
import { logger } from '@/lib/logger';
import {
    getUserData,
    setUserData,
    getOrganizations,
    setOrganizations,
    setAuthStatus,
    syncFromCookies,
    hasRecentAuthData,
    clearAllAuthData
} from './storage';
import type { AuthMeResponse, User, Organization } from 'shared/dist';

export interface AuthStatus {
    isAuthenticated: boolean;
    user: User | null;
    organizations: Organization[] | null;
    lastChecked: number;
    error?: string;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function checkAuthStatus(forceRefresh = false): Promise<AuthStatus> {
    const now = Date.now();

    // Check if we have recent auth data and not forcing refresh
    if (!forceRefresh && hasRecentAuthData(CACHE_DURATION)) {
        const user = getUserData();
        const organizations = getOrganizations();

        if (user) {
            logger.debug('Returning cached auth status from storage', {
                component: 'AuthStatus',
                isAuthenticated: true,
                userId: user.id
            });

            return {
                isAuthenticated: true,
                user,
                organizations,
                lastChecked: now,
            };
        }
    }

    // Try to sync from cookies first
    const { user: cookieUser, organizations: cookieOrgs } = syncFromCookies();
    if (cookieUser && !forceRefresh) {
        logger.debug('Using auth data from cookies', {
            component: 'AuthStatus',
            userId: cookieUser.id
        });

        return {
            isAuthenticated: true,
            user: cookieUser,
            organizations: cookieOrgs,
            lastChecked: now,
        };
    }

    try {
        logger.debug('Checking auth status via API', { component: 'AuthStatus', forceRefresh });

        const res = await client.auth.me.$get();
        const json = await res.json() as AuthMeResponse;

        if (json.authenticated) {
            const user = (json as Extract<AuthMeResponse, { authenticated: true }>).user;

            // Store in localStorage and update auth status
            setUserData(user);
            setOrganizations(user.organizations || []);
            setAuthStatus(true, now);

            logger.debug('Auth status checked and stored', {
                component: 'AuthStatus',
                isAuthenticated: true,
                userId: user.id
            });

            return {
                isAuthenticated: true,
                user,
                organizations: user.organizations || [],
                lastChecked: now,
            };
        } else {
            // Clear auth data if not authenticated
            clearAllAuthData();

            return {
                isAuthenticated: false,
                user: null,
                organizations: null,
                lastChecked: now,
            };
        }
    } catch (error) {
        logger.error('Auth status check failed', {
            component: 'AuthStatus',
            error: (error as Error).message
        });

        return {
            isAuthenticated: false,
            user: null,
            organizations: null,
            lastChecked: now,
            error: (error as Error).message,
        };
    }
}

export function clearAuthCache(): void {
    clearAllAuthData();
    logger.debug('Auth cache cleared', { component: 'AuthStatus' });
}

export function getCachedAuthStatus(): AuthStatus | null {
    const user = getUserData();
    const organizations = getOrganizations();

    if (!user) return null;

    return {
        isAuthenticated: true,
        user,
        organizations,
        lastChecked: Date.now(),
    };
}

// Check if we have a recent valid auth status
export function hasRecentAuthStatus(): boolean {
    return hasRecentAuthData(CACHE_DURATION);
}
