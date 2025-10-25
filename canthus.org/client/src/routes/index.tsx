import { createFileRoute } from "@tanstack/react-router";
import Hero from "@/components/landing/sections/hero/hero";
import ImpactStats from "@/components/landing/sections/impact/impact-stats";
import MarketInsights from "@/components/landing/sections/impact/market-insights";
import Integrations from "@/components/landing/sections/features/integrations";
import Footer from "@/components/landing/sections/footer";
import FinalCTA from "@/components/landing/sections/hero/final-cta";


export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {

	return (
		<div className="w-full mx-auto flex flex-col items-center relative bg-background">
			{/* Clean background */}
			<div className="fixed inset-0 bg-background"></div>

			<div className="relative z-10 w-full">
				<Hero />

				{/* Market Analysis Section */}
				<section className="py-24">
					<div className="container mx-auto px-6">
						<div className="text-center mb-20">
							<h2 className="text-3xl font-light tracking-tight text-foreground mb-6">
								The accessibility imperative
							</h2>
							<p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
								Digital accessibility is no longer optional. As regulatory requirements increase and user expectations evolve,
								platforms that prioritize accessibility gain significant competitive advantages.
							</p>
						</div>

						<MarketInsights />
						<ImpactStats />
					</div>
				</section>

				{/* Platform Integration Section */}
				<section className="py-24 bg-muted/30">
					<div className="container mx-auto px-6">
						<div className="text-center mb-16">
							<h2 className="text-3xl font-light tracking-tight text-foreground mb-6">
								Platform integration
							</h2>
							<p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
								Seamlessly integrate with leading vertical SaaS platforms. Our solutions work within your existing infrastructure
								to provide comprehensive accessibility features without disrupting established workflows.
							</p>
						</div>
						<Integrations showTitle={false} />
					</div>
				</section>


				<div className="container mx-auto mb-32">
					<FinalCTA />
				</div>
				{/* Footer */}
				<Footer />
			</div>
		</div>
	);
}

export default Index;

