import { createFileRoute } from '@tanstack/react-router'
import FeaturesHeader from '@/components/landing/sections/features/features-header'
import FeaturesGrid from '@/components/landing/sections/features/features-grid'
import FeaturesCTA from '@/components/landing/sections/features/features-cta'

export const Route = createFileRoute('/features/')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div className="min-h-screen bg-background">
            {/* Clean background */}
            <div className="fixed inset-0 bg-background"></div>

            <div className="relative z-10">
                <section className="pt-24">
                    <div className="container mx-auto px-6">
                        <FeaturesHeader />
                        <FeaturesGrid />
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
