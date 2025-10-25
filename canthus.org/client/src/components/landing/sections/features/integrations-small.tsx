import { ReactNode } from "react";
import { SocotraLogo, ClioLogo } from "@/components/logos";

interface Integration {
    name: string;
    logo: ReactNode;
    category: string;
    status: "live" | "coming-soon" | "planned";
}

const integrations: Integration[] = [
    { name: "Socotra", logo: <SocotraLogo size="md" />, category: "Insurance", status: "live" },
    { name: "Clio", logo: <ClioLogo size="md" />, category: "Legal", status: "coming-soon" }
];

interface IntegrationsSmallProps {
    showTitle?: boolean;
}

export default function IntegrationsSmall({ showTitle = false }: IntegrationsSmallProps) {
    return (
        <div className="text-center mb-12">
            {showTitle && (
                <>
                    <h2 className="text-3xl font-bold tracking-tight mb-4">
                        Seamless Integrations
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Connect with your existing tools and workflows. Canthus integrates with the platforms you already use.
                    </p>
                </>
            )}
            <div className="grid grid-cols-2 gap-8 max-w-md mx-auto">
                {integrations.map((integration, index) => (
                    <div
                        key={index}
                        className={`
                            relative flex flex-col items-center gap-4 p-6 border transition-all duration-200 hover:border-opacity-60
                            ${integration.status === "live"
                                ? "border-neutral-200 bg-neutral-50 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:bg-neutral-900/70"
                                : integration.status === "coming-soon"
                                ? "border-orange-200 bg-orange-50/30 hover:bg-orange-50/50 dark:border-orange-800/30 dark:bg-orange-950/20 dark:hover:bg-orange-950/30"
                                : "border-neutral-200 bg-neutral-50/50 hover:bg-neutral-100/50 dark:border-neutral-800/50 dark:bg-neutral-900/30 dark:hover:bg-neutral-900/40"
                            }
                        `}
                    >
                        {/* Minimal status indicator */}
                        <div className="absolute top-4 right-4">
                            {integration.status === "live" && (
                                <div className="w-1 h-1 bg-emerald-600 rounded-full"></div>
                            )}
                            {integration.status === "coming-soon" && (
                                <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
                            )}
                            {integration.status === "planned" && (
                                <div className="w-1 h-1 bg-neutral-400 rounded-full"></div>
                            )}
                        </div>

                        {/* Logo - clean and simple */}
                        <div className={`
                            flex items-center justify-center transition-opacity duration-200
                            ${integration.status === "live"
                                ? "opacity-90"
                                : "opacity-70"
                            }
                        `}>
                            {integration.logo}
                        </div>

                        <div className="text-center space-y-1">
                            <h4 className="text-base font-light tracking-tight text-neutral-900 dark:text-neutral-100">
                                {integration.name}
                            </h4>
                            <p className={`
                                text-xs font-medium tracking-wide uppercase
                                ${integration.status === "live"
                                    ? "text-emerald-700 dark:text-emerald-300"
                                    : integration.status === "coming-soon"
                                    ? "text-orange-700 dark:text-orange-300"
                                    : "text-neutral-600 dark:text-neutral-500"
                                }
                            `}>
                                {integration.category}
                            </p>
                        </div>

                        {/* Bottom divider */}
                        <div className={`
                            w-full h-px mt-auto
                            ${integration.status === "live"
                                ? "bg-neutral-200 dark:bg-neutral-700"
                                : integration.status === "coming-soon"
                                ? "bg-orange-200 dark:bg-orange-800/30"
                                : "bg-neutral-200 dark:bg-neutral-700/50"
                            }
                        `}></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
