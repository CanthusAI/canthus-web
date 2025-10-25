import { ReactNode } from "react";
import { SocotraLogo, ClioLogo } from "@/components/logos";

interface Integration {
	name: string;
	logo: ReactNode;
	category: string;
	status: "live" | "coming-soon" | "planned";
	description?: string;
}

const integrations: Integration[] = [
	{ name: "Socotra", logo: <SocotraLogo size="lg" />, category: "Insurance", status: "live", description: "Complete policy management and underwriting platform" },
	{ name: "Clio", logo: <ClioLogo size="lg" />, category: "Legal", status: "coming-soon", description: "Leading legal practice management software" },
];

interface IntegrationsProps {
	showTitle?: boolean;
}

export default function Integrations({ showTitle = true }: IntegrationsProps) {
	return (
		<div className="text-center mb-12 mt-48">
			{showTitle && (
				<>
					<h1 className="text-4xl font-medium tracking-tight mb-4">
						Seamless Integrations
					</h1>
					<p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
						Connect with your existing tools and workflows. Canthus integrates with the platforms you already use,
						ensuring your team can work efficiently without disrupting established processes.
					</p>
				</>
			)}

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
				{integrations.map((integration, index) => (
					<div
						key={index}
						className={`
                            relative flex flex-col items-center gap-6 p-8 border transition-all duration-200 hover:border-opacity-60
                            ${integration.status === "live"
								? "border-border bg-card hover:bg-accent/20"
								: integration.status === "coming-soon"
									? "border-accent bg-accent/10 hover:bg-accent/20"
									: "border-border bg-muted/50 hover:bg-muted/70"
							}
                        `}
					>
						{/* Status indicator - clean and minimal */}
						<div className="absolute top-6 right-6">
							{integration.status === "live" && (
								<div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
									<div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
									Available
								</div>
							)}
							{integration.status === "coming-soon" && (
								<div className="flex items-center gap-2 text-xs font-medium text-accent-foreground">
									<div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
									In Development
								</div>
							)}
							{integration.status === "planned" && (
								<div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
									<div className="w-1.5 h-1.5 bg-muted-foreground rounded-full"></div>
									Planned
								</div>
							)}
						</div>

						{/* Logo - clean presentation */}
						<div className={`
                            flex items-center justify-center p-6 transition-opacity duration-200
                            ${integration.status === "live"
								? "opacity-90"
								: "opacity-75"
							}
                        `}>
							{integration.logo}
						</div>

						{/* Content - clean typography */}
						<div className="text-center space-y-2">
							<h3 className="text-xl font-light tracking-tight text-foreground">
								{integration.name}
							</h3>
							<p className={`
                                text-sm font-medium tracking-wide uppercase
                                ${integration.status === "live"
									? "text-primary"
									: integration.status === "coming-soon"
										? "text-accent"
										: "text-muted-foreground"
								}
                            `}>
								{integration.category}
							</p>
							<p className="text-sm text-muted-foreground leading-relaxed max-w-sm mt-3">
								{integration.description}
							</p>
						</div>

						{/* Bottom divider - subtle */}
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

			<div className="mt-12">
				<p className="text-muted-foreground">
					Can't find your integration? <a href="#contact" className="text-primary hover:underline">Let us know</a> - we're always adding new connections.
				</p>
			</div>
		</div>
	);
}
