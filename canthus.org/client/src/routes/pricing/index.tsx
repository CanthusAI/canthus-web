import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import PricingHeader from '@/components/landing/sections/pricing/pricing-header'
import PricingDisplay from '@/components/landing/sections/pricing/pricing-display'
import EnterpriseCTA from '@/components/landing/sections/pricing/enterprise-cta'
import FAQ from '@/components/landing/sections/pricing/faq'
import FinalCTA from '@/components/landing/sections/pricing/final-cta'
import { PricingDuration } from '@/lib/landing/pricing/types'

export const Route = createFileRoute('/pricing/')({
    component: RouteComponent,
})

function RouteComponent() {
    const [duration, setDuration] = useState<PricingDuration>('monthly')
    
    return (
        <div className="min-h-screen">
            <section className="py-16 md:py-20 lg:py-32">
                <div className="container mx-auto px-4">
                    <PricingHeader />
                    <PricingDisplay duration={duration} setDuration={setDuration} />
                    <EnterpriseCTA />
                    <FAQ />
                    <FinalCTA />
                </div>
            </section>
        </div>
    )
}

export default RouteComponent;
