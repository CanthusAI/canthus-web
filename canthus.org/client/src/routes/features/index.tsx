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
        <div className="min-h-screen bg-white dark:bg-neutral-950">
            {/* Clean background */}
            <div className="fixed inset-0 bg-neutral-50 dark:bg-neutral-950"></div>

            <div className="relative z-10">
                <section className="pt-24">
                    <div className="container mx-auto px-6">
                        <FeaturesHeader />
                        <FeaturesGrid />
                    </div>
                </section>

                {/* Platform Integration Section */}
                <section className="bg-neutral-50 dark:bg-neutral-900/50">
                    <div className="container mx-auto px-6">
                        <Integrations showTitle={true} />
                    </div>
                </section>

                {/* CTA Section */}
                <section className="">
                    <div className="container mx-auto px-6">
                        <FeaturesCTA />
                    </div>
                </section>
            </div>
        </div>
    )
}

export default RouteComponent;
