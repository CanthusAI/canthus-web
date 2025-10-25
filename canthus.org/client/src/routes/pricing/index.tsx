import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import PricingHeader from '@/components/landing/sections/pricing/pricing-header'
import PricingDisplay from '@/components/landing/sections/pricing/pricing-display'
import FAQ from '@/components/landing/sections/pricing/faq'
import { PricingDuration } from '@/lib/landing/pricing/types'

export const Route = createFileRoute('/pricing/')({
	component: RouteComponent,
})

function RouteComponent() {
	const [duration, setDuration] = useState<PricingDuration>('monthly')

	return (
		<div className="min-h-screen bg-background">
			{/* Clean background */}
			<div className="fixed inset-0 bg-background"></div>

			<div className="relative z-10">
				<section className="pt-24">
					<div className="container mx-auto px-6">
						<PricingHeader />
						<PricingDisplay duration={duration} setDuration={setDuration} />
					</div>
				</section>


				<section className="">
					<div className="container mx-auto px-6">
						<FAQ />
					</div>
				</section>
			</div>
		</div>
	)
}

export default RouteComponent;
