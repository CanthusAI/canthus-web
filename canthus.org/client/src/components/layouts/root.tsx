import { Outlet } from "@tanstack/react-router";
import NavBar from "@/components/landing/nav/nav-bar";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useIsMobile } from "@/hooks/use-mobile";

export default function RootLayout() {
    const isMobile = useIsMobile();
    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-50 ${isMobile
                ? "bg-background/80 backdrop-blur-sm border-b"
                : "bg-background/60 backdrop-blur-md mx-4 mt-4 rounded-xl border shadow-lg"
                }`}>
                <NavBar isMobile={isMobile} />
            </header>

            <main className="pt-20 md:pt-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <Outlet />
                </div>
            </main>

            <TanStackRouterDevtools />
        </>
    );
}