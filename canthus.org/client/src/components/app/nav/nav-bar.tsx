import { useState } from "react";
import fish from "@/assets/fish.svg";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Lock } from "lucide-react";
import { useAuth } from "@/components/auth/context";
import { useNavigate } from "@tanstack/react-router";
import { getVersionInfo } from "@/lib/version";

export default function NavBar({ isMobile }: { isMobile: boolean }) {
    const [isOpen, setIsOpen] = useState(false);
    const { logOut } = useAuth();
    const navigate = useNavigate();
    const versionInfo = getVersionInfo();

    return (
        <div className={`${isMobile ? "w-5xl max-w-7xl mx-auto px-4" : "px-6"}`}>
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                    <a onClick={() => navigate({ to: "/" })} className="flex items-center gap-2 cursor-pointer">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <img src={fish} alt="logo" className="w-12 h-12" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <div className="text-center">
                                    <div className="font-semibold">Canthus v{versionInfo.version}</div>
                                    <div className="text-xs opacity-80">{versionInfo.environment}</div>
                                    {versionInfo.buildTime && (
                                        <div className="text-xs opacity-60">
                                            Built: {new Date(versionInfo.buildTime).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    </a>
                    <div className="mx-4">
                        <ModeToggle />
                    </div>
                </div>

                {!isMobile && (
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3 pl-4 border-l">
                            <Button variant="outline" className="rounded-lg" onClick={() => logOut()}>
                                <Lock size={16} /> Log Out
                            </Button>
                        </div>
                    </div>
                )}

                {isMobile && (
                    <button
                        className="p-2"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                )}
            </div>

            {
                isMobile && isOpen && (
                    <div className="py-4 border-t">
                        <nav className="flex flex-col gap-4">
                            <a href="/features" className="text-lg">Features</a>
                            <a href="/about" className="text-lg">About</a>
                            <a href="/pricing" className="text-lg">Pricing</a>
                            <Button variant="outline" className="rounded-lg" onClick={() => logOut()}>
                                <Lock size={16} /> Log Out
                            </Button>
                        </nav>
                    </div>
                )
            }
        </div >
    );
}

