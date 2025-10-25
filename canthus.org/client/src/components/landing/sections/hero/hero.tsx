import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { HeroVideoDialog } from "./hero-video-dialog";
import { useAuth } from "@/components/auth/context";

export default function Hero() {
	const { logIn } = useAuth();
	return (
		<section className="pt-16 pb-24 md:pt-20 md:pb-32 lg:pt-24 lg:pb-32">
			<div className="container mx-auto px-4 text-center">
				<div className="mx-auto flex max-w-4xl flex-col gap-8 lg:gap-12">
					<div className="space-y-6">
						<h1 className="text-4xl font-light md:text-5xl lg:text-6xl tracking-tight text-neutral-900 dark:text-neutral-100">
							Accessibility compliance{" "}
							<span className="font-medium">for modern platforms</span>
						</h1>
						<p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
							Enterprise-grade accessibility solutions designed for vertical SaaS platforms.
							Ensure compliance, serve all users, and expand your market reach without disrupting existing workflows.
						</p>
					</div>

					<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
						<Button asChild size="lg" className="bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:hover:bg-neutral-200 dark:text-neutral-900 transition-colors duration-200">
							<a href="#" onClick={() => logIn()}>Get Started</a>

						</Button>
						<Button asChild variant="outline" size="lg" className="border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-900 transition-colors duration-200">
							<a href="#" className="flex items-center gap-2">
								<ExternalLink className="h-4 w-4" />
								View Documentation
							</a>
						</Button>
					</div>

					<div className="relative mt-12">
						<div className="overflow-hidden border border-neutral-200 dark:border-neutral-800">
							<HeroVideoDialog
								className="dark:hidden block"
								animationStyle="from-center"
								videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
								thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
								thumbnailAlt="Platform Integration Demo"
							/>
							<HeroVideoDialog
								className="hidden dark:block"
								animationStyle="from-center"
								videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
								thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
								thumbnailAlt="Platform Integration Demo"
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
