import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { client } from "@/lib/api/client";
import { logIn, logOut } from "@/lib/auth/auth";
import { logger } from "@/lib/logger";
import type { AuthMeResponse, User } from "shared/dist";

type AuthContextValue = {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    refresh: () => Promise<void>;
    logIn: () => void;
    logOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const refresh = useMemo(() => async () => {
        try {
            logger.apiRequest('GET', '/auth/me', { component: 'AuthProvider' });
            const startTime = Date.now();

            const res = await client.auth.me.$get();
            const json = await res.json() as AuthMeResponse;

            const duration = Date.now() - startTime;
            logger.apiResponse('GET', '/auth/me', res.status, duration, { component: 'AuthProvider' });

            if (json.authenticated) {
                const u = (json as Extract<AuthMeResponse, { authenticated: true }>).user;
                logger.authSuccess(u.id, { component: 'AuthProvider' });
                setUser(u);
                try { localStorage.setItem('me:user', JSON.stringify(u)); } catch { }
            } else {
                logger.authFailure('Not authenticated', { component: 'AuthProvider' });
                setUser(null);
                try { localStorage.removeItem('me:user'); } catch { }
            }
        } catch (error) {
            logger.apiError('GET', '/auth/me', error as Error, { component: 'AuthProvider' });
            setUser(null);
            try { localStorage.removeItem('me:user'); } catch { }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        logger.componentMount('AuthProvider');

        try {
            const cached = localStorage.getItem('me:user');
            if (cached) {
                const user = JSON.parse(cached);
                setUser(user);
                logger.info('User loaded from cache', { component: 'AuthProvider', userId: user?.id });
            }
        } catch (error) {
            logger.error('Failed to load user from cache', { component: 'AuthProvider', error: (error as Error).message });
        }

        void refresh();

        return () => {
            logger.componentUnmount('AuthProvider');
        };
    }, [refresh]);

    const value: AuthContextValue = useMemo(() => ({
        isAuthenticated: !!user,
        user,
        loading,
        refresh,
        logIn,
        logOut,
    }), [user, loading, refresh]);

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}


