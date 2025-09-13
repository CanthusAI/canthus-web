import { createFileRoute } from '@tanstack/react-router'
import FeaturesHeader from '@/components/landing/sections/features/features-header'
import FeaturesGrid from '@/components/landing/sections/features/features-grid'
import Integrations from '@/components/landing/sections/features/integrations'
import FeaturesCTA from '@/components/landing/sections/features/features-cta'

export const Route = createFileRoute('/features/')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div className="min-h-screen">
            <section className="py-16 md:py-20 lg:py-32">
                <div className="container mx-auto px-4">
                    <FeaturesHeader />
                    <FeaturesGrid />
                    <Integrations showTitle={true} />
                    <FeaturesCTA />
                </div>
            </section>
        </div>
    )
}

export default RouteComponent;