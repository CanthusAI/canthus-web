import { Button } from "@/components/ui/button";

export default function FeaturesCTA() {
	return (
		<div className="mx-auto w-1/2 mt-32 text-center p-16 border border-neutral-200 bg-neutral-50 dark:bg-neutral-900/50 dark:border-neutral-800">
			<h3 className="text-3xl font-light tracking-tight text-neutral-900 dark:text-neutral-100 mb-6">
				Address accessibility systematically
			</h3>
			<p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 max-w-3xl mx-auto leading-relaxed">
				Join leading platforms and ensure compliance, expand market reach, and serve all users effectively without operational disruption.
			</p>
			<div className="flex flex-col sm:flex-row gap-4 justify-center">
				<Button
					className="bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:hover:bg-neutral-200 dark:text-neutral-900 text-base font-medium px-8 py-3"
					onClick={() => window.location.href = '#contact'}
				>
					Schedule Consultation
				</Button>
				<Button
					variant="outline"
					className="border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-900 text-base font-medium px-8 py-3"
					onClick={() => window.location.href = '/pricing'}
				>
					Review Solutions
				</Button>
			</div>
		</div>
	);
}
