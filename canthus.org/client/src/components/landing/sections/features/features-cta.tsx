export default function FeaturesCTA() {
    return (
        <div className="mt-32 text-center bg-gradient-to-r from-blue-50/20 to-purple-50/20 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl font-bold mb-4">
                Ready to make your platform accessible to everyone?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join businesses across industries using Canthus to serve customers with diverse accessibility needs and build more inclusive platforms.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                    href="#"
                    className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 py-2 rounded-md font-medium transition-colors"
                >
                    Start Free Trial
                </a>
                <a
                    href="/pricing"
                    className="inline-flex items-center justify-center gap-2 border bg-background hover:bg-accent hover:text-accent-foreground h-10 px-6 py-2 rounded-md font-medium transition-colors"
                >
                    View Pricing
                </a>
            </div>
        </div>
    );
}
