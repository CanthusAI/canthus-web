import { Badge } from "@/components/ui/badge";

export default function PricingHeader() {
    return (
        <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
                Pricing
            </Badge>
            <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl mb-6">
                Simple, transparent{" "}
                <span className="relative">
                    <span className="relative z-10">pricing</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-background blur-md opacity-20"></span>
                </span>
            </h2>
            <p className="text-muted-foreground text-balance md:text-lg max-w-3xl mx-auto">
                Choose the plan that fits your needs. All plans include our core accessibility features
                with 14-day free trial and no setup fees.
            </p>
        </div>
    );
}
