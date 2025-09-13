export const routeTitles: Record<string, string> = {
    "/": "Home",
    "/features": "Features",
    "/pricing": "Pricing",
};

function normalizePath(pathname: string): string {
    if (!pathname) return "/";
    if (pathname === "/") return "/";
    return pathname.replace(/\/+$/, "");
}

export function getTitleForPath(pathname: string): string | undefined {
    const normalized = normalizePath(pathname);
    return routeTitles[normalized] ?? routeTitles[normalized.replace(/\/$/, "")] ?? undefined;
}


