import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { logIn, logOut } from "@/lib/auth/auth";
import { logger } from "@/lib/logger";
import { checkAuthStatus, clearAuthCache, hasRecentAuthStatus } from "@/lib/auth/status";
import { getUserData, getOrganizations, syncFromCookies } from "@/lib/auth/storage";
import type { User, Organization } from "shared/dist";

type AuthContextValue = {
    isAuthenticated: boolean;
    user: User | null;
    organizations: Organization[] | null;
    loading: boolean;
    refresh: () => Promise<void>;
    logIn: () => void;
    logOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [organizations, setOrganizations] = useState<Organization[] | null>(null);
    const [loading, setLoading] = useState(true);

    const refresh = useMemo(() => async () => {
        try {
            const authStatus = await checkAuthStatus();

            setUser(authStatus.user);
            setOrganizations(authStatus.organizations);

            if (authStatus.isAuthenticated && authStatus.user) {
                logger.authSuccess(authStatus.user.id, { component: 'AuthProvider' });
            } else {
                logger.authFailure('Not authenticated', {
                    component: 'AuthProvider',
                    error: authStatus.error
                });
            }
        } catch (error) {
            logger.error('Auth refresh failed', {
                component: 'AuthProvider',
                error: (error as Error).message
            });
            setUser(null);
            setOrganizations(null);
            clearAuthCache();
        } finally {
            setLoading(false);
        }
    }, []);

    // Auto-refresh auth status periodically
    const autoRefresh = useMemo(() => {
        const interval = setInterval(async () => {
            if (!loading) {
                await refresh();
            }
        }, 5 * 60 * 1000); // Refresh every 5 minutes

        return () => clearInterval(interval);
    }, [refresh, loading]);

    useEffect(() => {
        logger.componentMount('AuthProvider');

        // Check if we have recent auth status first
        if (hasRecentAuthStatus()) {
            const cachedUser = getUserData();
            const cachedOrgs = getOrganizations();

            if (cachedUser) {
                setUser(cachedUser);
                setOrganizations(cachedOrgs);
                logger.info('User loaded from cache with recent auth status', {
                    component: 'AuthProvider',
                    userId: cachedUser?.id
                });
                setLoading(false);
                return;
            }
        }

        // Try to sync from cookies first
        const { user: cookieUser, organizations: cookieOrgs } = syncFromCookies();
        if (cookieUser) {
            setUser(cookieUser);
            setOrganizations(cookieOrgs);
            logger.info('User loaded from cookies', {
                component: 'AuthProvider',
                userId: cookieUser?.id
            });
            setLoading(false);
            return;
        }

        // Initial auth check
        void refresh();

        // Set up auto-refresh
        const cleanup = autoRefresh;

        return () => {
            cleanup();
            logger.componentUnmount('AuthProvider');
        };
    }, [refresh, autoRefresh]);

    const value: AuthContextValue = useMemo(() => ({
        isAuthenticated: !!user,
        user,
        organizations,
        loading,
        refresh,
        logIn,
        logOut,
    }), [user, organizations, loading, refresh]);

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}


