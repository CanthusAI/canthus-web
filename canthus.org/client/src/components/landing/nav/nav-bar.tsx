import { useState } from "react";
import beaver from "@/assets/beaver.svg";
import NavMenu from "./nav-menu";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";

export default function NavBar({ isMobile }: { isMobile: boolean }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`${isMobile ? "w-5xl max-w-7xl mx-auto px-4" : "px-6"}`}>
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                    <a href="/" className="flex items-center gap-2">
                        <img src={beaver} alt="logo" className="w-7 h-7" />
                        <span className="font-semibold text-xl">Canthus</span>
                    </a>
                    <div className="mx-4">
                        <ModeToggle />
                    </div>
                </div>

                {!isMobile && (
                    <div className="flex items-center">
                        <NavMenu />
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

            {isMobile && isOpen && (
                <div className="py-4 border-t">
                    <nav className="flex flex-col gap-4">
                        <a href="/features" className="text-lg">Features</a>
                        <a href="/pricing" className="text-lg">Pricing</a>
                        <Button className="bg-primary hover:bg-primary/90 rounded-lg w-fit">
                            Log In
                        </Button>
                    </nav>
                </div>
            )}
        </div>
    );
}

