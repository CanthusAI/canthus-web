import { Outlet } from "@tanstack/react-router";
import { useEffect } from "react";
import TitleSync from "@/components/seo/title-sync";
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "../app/nav/sidebar/app-sidebar";
import { useAuth } from "@/components/auth/context";

export default function AppLayout() {
    const { isAuthenticated, loading, logIn } = useAuth();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            logIn();
        }
    }, [loading, isAuthenticated, logIn]);

    if (loading || !isAuthenticated) {
        return (
            <main className="pt-2 md:pt-4">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl" />
            </main>
        );
    }

    return (
        <>
            <TitleSync />
            <SidebarProvider>
                <AppSidebar />
                <main className="pt-2 md:pt-4 w-full h-screen">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                        <Outlet />
                    </div>
                </main>

            </SidebarProvider>
        </>
    );
}


