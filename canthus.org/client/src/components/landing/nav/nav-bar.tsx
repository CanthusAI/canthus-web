import { useState } from "react";
import fish from "@/assets/fish.svg";
import NavMenu from "./nav-menu";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Lock } from "lucide-react";
import { useAuth } from "@/components/auth/context";
import { useNavigate } from "@tanstack/react-router";
import { getVersionInfo } from "@/lib/version";

export default function NavBar({ isMobile }: { isMobile: boolean }) {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated, logIn, logOut } = useAuth();
    const navigate = useNavigate();
    const versionInfo = getVersionInfo();

    return (
        <div className={`${isMobile ? "w-5xl max-w-7xl mx-auto px-4" : "px-6"}`}>
            <div className="flex items-center justify-between h-16 border-b border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center">
                    <a onClick={() => navigate({ to: "/" })} className="flex items-center gap-3 cursor-pointer group">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <img src={fish} alt="Canthus" className="w-10 h-10 transition-opacity duration-200 group-hover:opacity-80" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <div className="text-center">
                                    <div className="font-medium">Canthus v{versionInfo.version}</div>
                                    <div className="text-xs opacity-70">{versionInfo.environment}</div>
                                    {versionInfo.buildTime && (
                                        <div className="text-xs opacity-60">
                                            Built: {new Date(versionInfo.buildTime).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                            </TooltipContent>
                        </Tooltip>
                        <span className="font-light text-xl tracking-tight text-neutral-900 dark:text-neutral-100">Canthus</span>
                    </a>
                    <div className="ml-6">
                        <ModeToggle />
                    </div>
                </div>

                {!isMobile && (
                    <div className="flex items-center gap-8">
                        <NavMenu />
                        <div className="flex items-center justify-end gap-4 ml-auto">
                            {isAuthenticated ? (
                                <>
                                    <Button
                                        variant="ghost"
                                        className="text-base font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200 px-4 py-2"
                                        onClick={() => navigate({ to: "/app" })}
                                    >
                                        Dashboard
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-900 transition-colors duration-200 text-base font-medium px-4 py-2"
                                        onClick={() => logOut()}
                                    >
                                        <Lock size={16} /> Sign Out
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    className="bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:hover:bg-neutral-200 dark:text-neutral-900 transition-colors duration-200 text-base font-medium px-6 py-2"
                                    onClick={() => logIn()}
                                >
                                    Get Started
                                </Button>
                            )}
                        </div>
                    </div>
                )}

                {isMobile && (
                    <button
                        className="p-3 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors duration-200"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                )}
            </div>

            {
                isMobile && isOpen && (
                    <div className="py-8 border-t border-neutral-200 dark:border-neutral-800">
                        <nav className="flex flex-col gap-6">
                            <a href="/features" className="text-xl font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors duration-200 py-2">Features</a>
                            <a href="/about" className="text-xl font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors duration-200 py-2">About</a>
                            <a href="/pricing" className="text-xl font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors duration-200 py-2">Pricing</a>
                            <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800">
                                <Button
                                    className="w-full bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:hover:bg-neutral-200 dark:text-neutral-900 transition-colors duration-200 text-base font-medium py-3"
                                    onClick={() => logIn()}
                                >
                                    Get Started
                                </Button>
                            </div>
                        </nav>
                    </div>
                )
            }
        </div >
    );
}

