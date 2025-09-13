import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { client } from "@/lib/api/client";
import { useMutation } from "@tanstack/react-query";
import Hero from "@/components/landing/sections/hero/hero";
import { cn } from "@/lib/utils";
import { StarsBackground } from "@/components/ui/stars";
import { useTheme } from "@/components/ui/theme-provider";
import ImpactStats from "@/components/landing/sections/impact/impact-stats";
import MarketInsights from "@/components/landing/sections/impact/market-insights";
import IntegrationsSmall from "@/components/landing/sections/features/integrations-small";


export const Route = createFileRoute("/")({
	component: Index,
});

type ResponseType = { message: string; success: true };

function Index() {
	const [data, setData] = useState<ResponseType | undefined>();

	const { mutate: sendRequest } = useMutation({
		mutationFn: async () => {
			try {
				const res = await client.hello.$get();
				const json = await res.json() as ResponseType;
				setData(json);
			} catch (error) {
				console.log(error);
			}
		},
	});

	return (
		<div className="w-full mx-auto flex flex-col gap-6 items-center relative">
			<StarsBackground
				starColor={useTheme().theme === 'dark' ? '#FFF' : '#000'}
				className={cn(
					'fixed inset-0 z-[-1]',
					'dark:bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] dark:from-[#262626] dark:via-[#262626] dark:to-transparent bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#f5f5f5] via-[#f5f5f5] to-transparent',
				)}
			/>
			<div className="mt-20">
				<Hero />
			</div>


			{/* Impact & Success Stories Section */}
			<div className="py-20">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-3xl font-bold mb-4">
							Making an{" "}
							<span className="relative">
								<span className="relative z-10">impact</span>
								<span className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-background blur-md opacity-20"></span>
							</span>
						</h2>
						<p className="text-muted-foreground max-w-2xl mx-auto text-lg">
							Discover the market opportunity and see how Canthus is building the future of accessible SaaS platforms.
						</p>
					</div>

					<MarketInsights />
					<ImpactStats />

				</div>
			</div>

			{/* Platform Overview */}
			<div className="container mx-auto px-4 my-8">
				<div className="text-center mb-12">
					<h2 className="text-3xl font-bold mb-4">
						Accessibility solutions for{" "}
						<span className="relative">
							<span className="relative z-10">every platform</span>
							<span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-400 to-white dark:to-black blur-md opacity-20"></span>
						</span>
					</h2>
					<p className="text-muted-foreground max-w-3xl mx-auto text-lg">
						Canthus integrates with leading vertical SaaS platforms across industries, providing comprehensive accessibility features
						that help businesses serve customers with diverse needs while ensuring compliance and improving user experience.
					</p>
				</div>
				<IntegrationsSmall />
			</div>

			{/* Development Tools - Hidden in production */}
			<div className="flex items-center gap-4 my-8 opacity-50">
				<Button onClick={() => sendRequest()}>Call API</Button>
				<Button variant="secondary" asChild>
					<a target="_blank" href="https://bhvr.dev" rel="noopener">
						Docs
					</a>
				</Button>
			</div>
			{data && (
				<pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-xs opacity-50">
					<code>
						Message: {data.message} <br />
						Success: {data.success.toString()}
					</code>
				</pre>
			)}
		</div>
	);
}

export default Index;

