import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { getTitleForPath } from "@/lib/seo/titles";

export default function TitleSync() {
    const pathname = useRouterState({ select: (s) => s.location.pathname });

    useEffect(() => {
        const pageTitle = getTitleForPath(pathname);
        const fullTitle = pageTitle ? `Canthus | ${pageTitle}` : "Canthus";
        document.title = fullTitle;
    }, [pathname]);

    return null;
}


