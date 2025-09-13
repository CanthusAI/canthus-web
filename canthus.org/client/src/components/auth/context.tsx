import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { client } from "@/lib/api/client";
import { logIn, logOut } from "@/lib/auth/auth";
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
            const res = await client.auth.me.$get();
            const json = await res.json() as AuthMeResponse;
            console.log(JSON.stringify(json, null, 2));
            if (json.authenticated) {
                const u = (json as Extract<AuthMeResponse, { authenticated: true }>).user;
                setUser(u);
                try { localStorage.setItem('me:user', JSON.stringify(u)); } catch { }
            } else {
                setUser(null);
                try { localStorage.removeItem('me:user'); } catch { }
            }
        } catch {
            setUser(null);
            try { localStorage.removeItem('me:user'); } catch { }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        try {
            const cached = localStorage.getItem('me:user');
            if (cached) {
                setUser(JSON.parse(cached));
            }
        } catch { }
        void refresh();
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


