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
								? "border-neutral-200 bg-neutral-50 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:bg-neutral-900/70"
								: integration.status === "coming-soon"
									? "border-orange-200 bg-orange-50/30 hover:bg-orange-50/50 dark:border-orange-800/30 dark:bg-orange-950/20 dark:hover:bg-orange-950/30"
									: "border-neutral-200 bg-neutral-50/50 hover:bg-neutral-100/50 dark:border-neutral-800/50 dark:bg-neutral-900/30 dark:hover:bg-neutral-900/40"
							}
                        `}
					>
						{/* Status indicator - clean and minimal */}
						<div className="absolute top-6 right-6">
							{integration.status === "live" && (
								<div className="flex items-center gap-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">
									<div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
									Available
								</div>
							)}
							{integration.status === "coming-soon" && (
								<div className="flex items-center gap-2 text-xs font-medium text-orange-600 dark:text-orange-400">
									<div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
									In Development
								</div>
							)}
							{integration.status === "planned" && (
								<div className="flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-500">
									<div className="w-1.5 h-1.5 bg-neutral-400 rounded-full"></div>
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
							<h3 className="text-xl font-light tracking-tight text-neutral-900 dark:text-neutral-100">
								{integration.name}
							</h3>
							<p className={`
                                text-sm font-medium tracking-wide uppercase
                                ${integration.status === "live"
									? "text-emerald-700 dark:text-emerald-300"
									: integration.status === "coming-soon"
										? "text-orange-700 dark:text-orange-300"
										: "text-neutral-600 dark:text-neutral-500"
								}
                            `}>
								{integration.category}
							</p>
							<p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-sm mt-3">
								{integration.description}
							</p>
						</div>

						{/* Bottom divider - subtle */}
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

			<div className="mt-12">
				<p className="text-muted-foreground">
					Can't find your integration? <a href="#contact" className="text-primary hover:underline">Let us know</a> - we're always adding new connections.
				</p>
			</div>
		</div>
	);
}
