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
                                ? "border-border bg-card hover:bg-accent/20"
                                : integration.status === "coming-soon"
                                ? "border-accent bg-accent/10 hover:bg-accent/20"
                                : "border-border bg-muted/50 hover:bg-muted/70"
                            }
                        `}
                    >
                        {/* Minimal status indicator */}
                        <div className="absolute top-4 right-4">
                            {integration.status === "live" && (
                                <div className="w-1 h-1 bg-primary rounded-full"></div>
                            )}
                            {integration.status === "coming-soon" && (
                                <div className="w-1 h-1 bg-accent rounded-full"></div>
                            )}
                            {integration.status === "planned" && (
                                <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
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
                            <h4 className="text-base font-light tracking-tight text-foreground">
                                {integration.name}
                            </h4>
                            <p className={`
                                text-xs font-medium tracking-wide uppercase
                                ${integration.status === "live"
                                    ? "text-primary"
                                    : integration.status === "coming-soon"
                                    ? "text-accent"
                                    : "text-muted-foreground"
                                }
                            `}>
                                {integration.category}
                            </p>
                        </div>

                        {/* Bottom divider */}
                        <div className={`
                            w-full h-px mt-auto
                            ${integration.status === "live"
                                ? "bg-border"
                                : integration.status === "coming-soon"
                                ? "bg-accent/30"
                                : "bg-border/50"
                            }
                        `}></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
