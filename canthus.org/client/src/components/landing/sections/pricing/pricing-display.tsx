import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PricingDuration } from "@/lib/landing/pricing/types";
import { Check, Star, Zap } from "lucide-react";

const plans = [
    {
        name: "Professional",
        description: "Comprehensive accessibility for established platforms",
        monthlyPrice: "$299",
        yearlyPrice: "$2,990",
        period: "/month",
        yearlyPeriod: "/year",
        badge: null,
        icon: Zap,
        features: [
            "Automated content recognition and analysis",
            "WCAG 2.1 AA compliance monitoring",
            "User preference management system",
            "Standard API integration",
            "Compliance reporting dashboard",
            "Email support"
        ],
        cta: "Get Started",
        popular: false,
        savings: 17
    },
    {
        name: "Enterprise",
        description: "Advanced accessibility for large-scale operations",
        monthlyPrice: "$899",
        yearlyPrice: "$8,990",
        period: "/month",
        yearlyPeriod: "/year",
        badge: "Recommended",
        icon: Star,
        features: [
            "All Professional features included",
            "Real-time compliance monitoring",
            "Advanced API and webhook integrations",
            "Custom accessibility rules engine",
            "Dedicated customer success manager",
            "Multi-platform management",
            "Priority technical support"
        ],
        cta: "Contact Sales",
        popular: true,
        savings: 20
    }
];

interface PricingDisplayProps {
    duration: PricingDuration;
    setDuration: (duration: PricingDuration) => void;
}

export default function PricingDisplay({ duration, setDuration }: PricingDisplayProps) {
    const handleTabChange = (value: string) => {
        setDuration(value as PricingDuration);
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex justify-center mb-16">
                <Tabs value={duration} onValueChange={handleTabChange} className="w-auto">
                    <TabsList className="grid grid-cols-2 bg-neutral-100 dark:bg-neutral-800 p-1 border border-neutral-200 dark:border-neutral-700">
                        <TabsTrigger
                            value="monthly"
                            className="data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-900 data-[state=active]:shadow-sm px-8 text-neutral-700 dark:text-neutral-300 data-[state=active]:text-neutral-900 dark:data-[state=active]:text-neutral-100 transition-all duration-200"
                        >
                            Monthly Billing
                        </TabsTrigger>
                        <TabsTrigger
                            value="yearly"
                            className="data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-900 data-[state=active]:shadow-sm px-8 relative text-neutral-700 dark:text-neutral-300 data-[state=active]:text-neutral-900 dark:data-[state=active]:text-neutral-100 transition-all duration-200"
                        >
                            Annual Billing
                            <Badge
                                variant="secondary"
                                className="absolute -top-3 -right-16 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 text-xs px-2 py-1 border border-emerald-200 dark:border-emerald-700"
                            >
                                Save {plans[0].savings}%
                            </Badge>
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                {plans.map((plan, index) => (
                    <div
                        key={index}
                        className={`
                            relative p-8 border transition-all duration-200
                            ${plan.popular
                                ? "border-neutral-900 dark:border-neutral-100 bg-neutral-50 dark:bg-neutral-900"
                                : "border-neutral-200 bg-white dark:bg-neutral-950 hover:border-neutral-400 dark:hover:border-neutral-600"
                            }
                        `}
                    >
                        {plan.popular && (
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                <div className="px-4 py-1 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 text-xs font-medium tracking-wide uppercase">
                                    {plan.badge}
                                </div>
                            </div>
                        )}

                        <div className="text-center mb-8">
                            <div className="flex justify-center mb-6">
                                <div className="p-4 border border-neutral-200 dark:border-neutral-700">
                                    <plan.icon className="h-6 w-6 text-neutral-600 dark:text-neutral-400" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-light tracking-tight text-neutral-900 dark:text-neutral-100 mb-3">
                                {plan.name}
                            </h3>
                            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                {plan.description}
                            </p>
                        </div>

                        <div className="text-center mb-8">
                            <div className="flex items-baseline justify-center mb-3">
                                <span className="text-5xl font-light tracking-tight text-neutral-900 dark:text-neutral-100">
                                    {duration === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                                </span>
                                <span className="text-neutral-600 dark:text-neutral-400 ml-2 text-lg">
                                    {duration === "monthly" ? plan.period : plan.yearlyPeriod}
                                </span>
                            </div>

                            {duration === "yearly" && (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="px-3 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 text-xs font-medium border border-emerald-200 dark:border-emerald-700">
                                        Save {plan.savings}% annually
                                    </div>
                                </div>
                            )}
                        </div>

                        <Button
                            className={`
                                w-full mb-8 text-base font-medium transition-all duration-200
                                ${plan.popular
                                    ? "bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:hover:bg-neutral-200 dark:text-neutral-900"
                                    : "border border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                                }
                            `}
                            variant={plan.popular ? "default" : "outline"}
                        >
                            {plan.cta}
                        </Button>

                        <div className="space-y-4">
                            <ul className="space-y-4">
                                {plan.features.map((feature, featureIndex) => (
                                    <li key={featureIndex} className="flex items-start gap-3">
                                        <div className="flex-shrink-0 mt-0.5">
                                            <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <span className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>

            <div className="text-center pt-8 border-t border-neutral-200 dark:border-neutral-800">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    14-day free trial • No credit card required • Cancel anytime
                </p>
            </div>
        </div>
    );
}
