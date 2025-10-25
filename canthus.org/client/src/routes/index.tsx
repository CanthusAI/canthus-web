import { createFileRoute } from "@tanstack/react-router";
import Hero from "@/components/landing/sections/hero/hero";
import ImpactStats from "@/components/landing/sections/impact/impact-stats";
import MarketInsights from "@/components/landing/sections/impact/market-insights";
import IntegrationsSmall from "@/components/landing/sections/features/integrations-small";
import Footer from "@/components/landing/sections/footer";


export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {

	return (
		<div className="w-full mx-auto flex flex-col items-center relative bg-white dark:bg-neutral-900">
			{/* Clean background */}
			<div className="fixed inset-0 bg-neutral-50 dark:bg-neutral-950"></div>

			<div className="relative z-10 w-full">
				<Hero />

				{/* Market Analysis Section */}
				<section className="py-24">
					<div className="container mx-auto px-6">
						<div className="text-center mb-20">
							<h2 className="text-3xl font-light tracking-tight text-neutral-900 dark:text-neutral-100 mb-6">
								The accessibility imperative
							</h2>
							<p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto leading-relaxed">
								Digital accessibility is no longer optional. As regulatory requirements increase and user expectations evolve,
								platforms that prioritize accessibility gain significant competitive advantages.
							</p>
						</div>

						<MarketInsights />
						<ImpactStats />
					</div>
				</section>

				{/* Platform Integration Section */}
				<section className="py-24 bg-neutral-50 dark:bg-neutral-900/50">
					<div className="container mx-auto px-6">
						<div className="text-center mb-16">
							<h2 className="text-3xl font-light tracking-tight text-neutral-900 dark:text-neutral-100 mb-6">
								Platform integration
							</h2>
							<p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto leading-relaxed">
								Seamlessly integrate with leading vertical SaaS platforms. Our solutions work within your existing infrastructure
								to provide comprehensive accessibility features without disrupting established workflows.
							</p>
						</div>
						<IntegrationsSmall />
					</div>
				</section>

			{/* Footer */}
			<Footer />
			</div>
		</div>
	);
}

export default Index;

