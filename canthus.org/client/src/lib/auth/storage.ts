// Client-side storage utilities for authentication data
import { logger } from '@/lib/logger';
import type { User, Organization } from 'shared/dist';

// Storage keys
export const STORAGE_KEYS = {
    USER: 'me:user',
    ORGANIZATIONS: 'me:organizations',
    LAST_CHECKED: 'me:lastChecked',
    AUTH_STATUS: 'me:authStatus',
} as const;

// Cookie utilities
export function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        const cookieValue = parts.pop()?.split(';').shift();
        return cookieValue ? decodeURIComponent(cookieValue) : null;
    }
    return null;
}

export function setCookie(name: string, value: string, days = 7): void {
    if (typeof document === 'undefined') return;

    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

export function deleteCookie(name: string): void {
    if (typeof document === 'undefined') return;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}

// localStorage utilities with error handling
export function setStorageItem(key: string, value: any): boolean {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        logger.error('Failed to set localStorage item', {
            component: 'Storage',
            key,
            error: (error as Error).message
        });
        return false;
    }
}

export function getStorageItem<T>(key: string): T | null {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        logger.error('Failed to get localStorage item', {
            component: 'Storage',
            key,
            error: (error as Error).message
        });
        return null;
    }
}

export function removeStorageItem(key: string): boolean {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        logger.error('Failed to remove localStorage item', {
            component: 'Storage',
            key,
            error: (error as Error).message
        });
        return false;
    }
}

// User data management
export function setUserData(user: User): boolean {
    const success = setStorageItem(STORAGE_KEYS.USER, user);
    if (success) {
        logger.debug('User data stored', {
            component: 'Storage',
            userId: user.id
        });
    }
    return success;
}

export function getUserData(): User | null {
    const user = getStorageItem<User>(STORAGE_KEYS.USER);
    if (user) {
        logger.debug('User data retrieved from localStorage', {
            component: 'Storage',
            userId: user.id
        });
    }
    return user;
}

export function clearUserData(): boolean {
    const success = removeStorageItem(STORAGE_KEYS.USER);
    if (success) {
        logger.debug('User data cleared', { component: 'Storage' });
    }
    return success;
}

// Organization data management
export function setOrganizations(organizations: Organization[]): boolean {
    const success = setStorageItem(STORAGE_KEYS.ORGANIZATIONS, organizations);
    if (success) {
        logger.debug('Organizations stored', {
            component: 'Storage',
            count: organizations.length
        });
    }
    return success;
}

export function getOrganizations(): Organization[] | null {
    const orgs = getStorageItem<Organization[]>(STORAGE_KEYS.ORGANIZATIONS);
    if (orgs) {
        logger.debug('Organizations retrieved from localStorage', {
            component: 'Storage',
            count: orgs.length
        });
    }
    return orgs;
}

export function clearOrganizations(): boolean {
    const success = removeStorageItem(STORAGE_KEYS.ORGANIZATIONS);
    if (success) {
        logger.debug('Organizations cleared', { component: 'Storage' });
    }
    return success;
}

// Auth status management
export function setAuthStatus(isAuthenticated: boolean, lastChecked: number): boolean {
    const authStatus = { isAuthenticated, lastChecked };
    const success = setStorageItem(STORAGE_KEYS.AUTH_STATUS, authStatus);
    if (success) {
        logger.debug('Auth status stored', {
            component: 'Storage',
            isAuthenticated,
            lastChecked: new Date(lastChecked).toISOString()
        });
    }
    return success;
}

export function getAuthStatus(): { isAuthenticated: boolean; lastChecked: number } | null {
    return getStorageItem<{ isAuthenticated: boolean; lastChecked: number }>(STORAGE_KEYS.AUTH_STATUS);
}

export function clearAuthStatus(): boolean {
    return removeStorageItem(STORAGE_KEYS.AUTH_STATUS);
}

// Cookie-based data management (for cross-domain scenarios)
export function getUserFromCookie(): User | null {
    try {
        const userCookie = getCookie(STORAGE_KEYS.USER);
        if (userCookie) {
            const user = JSON.parse(userCookie);
            logger.debug('User data retrieved from cookie', {
                component: 'Storage',
                userId: user.id
            });
            return user;
        }
    } catch (error) {
        logger.error('Failed to parse user cookie', {
            component: 'Storage',
            error: (error as Error).message
        });
    }
    return null;
}

export function getOrganizationsFromCookie(): Organization[] | null {
    try {
        const orgsCookie = getCookie(STORAGE_KEYS.ORGANIZATIONS);
        if (orgsCookie) {
            const orgs = JSON.parse(orgsCookie);
            logger.debug('Organizations retrieved from cookie', {
                component: 'Storage',
                count: orgs.length
            });
            return orgs;
        }
    } catch (error) {
        logger.error('Failed to parse organizations cookie', {
            component: 'Storage',
            error: (error as Error).message
        });
    }
    return null;
}

// Clear all auth data
export function clearAllAuthData(): void {
    logger.info('Clearing all authentication data', { component: 'Storage' });

    // Clear localStorage
    clearUserData();
    clearOrganizations();
    clearAuthStatus();

    // Clear cookies
    deleteCookie(STORAGE_KEYS.USER);
    deleteCookie(STORAGE_KEYS.ORGANIZATIONS);
}

// Sync data from cookies to localStorage
export function syncFromCookies(): { user: User | null; organizations: Organization[] | null } {
    logger.debug('Syncing auth data from cookies to localStorage', { component: 'Storage' });

    const user = getUserFromCookie();
    const organizations = getOrganizationsFromCookie();

    if (user) {
        setUserData(user);
    }

    if (organizations) {
        setOrganizations(organizations);
    }

    return { user, organizations };
}

// Check if we have recent auth data (either in localStorage or cookies)
export function hasRecentAuthData(maxAge = 5 * 60 * 1000): boolean {
    const authStatus = getAuthStatus();
    if (authStatus && (Date.now() - authStatus.lastChecked) < maxAge) {
        return authStatus.isAuthenticated;
    }

    // Fallback to cookie data
    const user = getUserFromCookie();
    return !!user;
}
