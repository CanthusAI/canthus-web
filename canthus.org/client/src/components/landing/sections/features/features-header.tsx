import { Badge } from "@/components/ui/badge";

export default function FeaturesHeader() {
    return (
        <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
                Features
            </Badge>
            <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl mb-6">
                Platform accessibility{" "}
                <span className="relative">
                    <span className="relative z-10">made simple</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-400 to-white dark:to-black blur-md opacity-20"></span>
                </span>
            </h2>
            <p className="text-muted-foreground text-balance md:text-lg max-w-3xl mx-auto">
                Canthus provides comprehensive accessibility solutions for vertical SaaS platforms, helping businesses serve customers with diverse needs
                through seamless integrations and powerful accessibility features.
            </p>
        </div>
    );
}
