import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PricingDuration } from "@/lib/landing/pricing/types";
import { Check, Star, Zap, TrendingUp, Sparkles } from "lucide-react";

const plans = [
    {
        name: "Platform Starter",
        description: "Essential accessibility features for growing platforms",
        monthlyPrice: "$299",
        yearlyPrice: "$2,990",
        period: "/month",
        yearlyPeriod: "/year",
        badge: null,
        icon: Zap,
        features: [
            "Smart content recognition for images and documents",
            "Basic language simplification tools",
            "User preference storage and application",
            "WCAG 2.1 AA compliance monitoring",
            "Standard API access",
            "Email support"
        ],
        cta: "Start Free Trial",
        popular: false,
        savings: 17
    },
    {
        name: "Platform Pro",
        description: "Advanced accessibility solutions for enterprise platforms",
        monthlyPrice: "$899",
        yearlyPrice: "$8,990",
        period: "/month",
        yearlyPeriod: "/year",
        badge: "Most Popular",
        icon: Star,
        features: [
            "All Starter features included",
            "Real-time compliance monitoring",
            "Advanced API & webhook integrations",
            "White-label customization",
            "Priority support with dedicated CSM",
            "Custom accessibility rules engine",
            "Multi-platform management dashboard"
        ],
        cta: "Start Free Trial",
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
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-center mb-12">
                <Tabs value={duration} onValueChange={handleTabChange} className="w-auto">
                    <TabsList className="grid grid-cols-2 bg-muted/50 p-1">
                        <TabsTrigger
                            value="monthly"
                            className="data-[state=active]:bg-background data-[state=active]:shadow-sm px-6"
                        >
                            Monthly
                        </TabsTrigger>
                        <TabsTrigger
                            value="yearly"
                            className="data-[state=active]:bg-background data-[state=active]:shadow-sm px-6 relative"
                        >
                            Yearly
                            <Badge
                                variant="secondary"
                                className="absolute -top-4 -right-10 bg-green-100 text-green-700 text-xs px-1.5 py-0.5"
                            >
                                Save 20%
                            </Badge>
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
                {plans.map((plan, index) => (
                    <Card
                        key={index}
                        className={`relative transition-all duration-300 ${plan.popular
                            ? 'ring-2 ring-primary shadow-xl scale-105 border-primary'
                            : 'border-border hover:shadow-lg hover:border-primary/50'
                            }`}
                    >
                        {plan.popular && (
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                                <Badge className="px-4 py-1.5 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg">
                                    <Sparkles className="w-3 h-3 mr-1" />
                                    Most Popular
                                </Badge>
                            </div>
                        )}

                        <CardHeader className="text-center pb-6 pt-8">
                            <div className="flex justify-center mb-4">
                                <div className={`p-4 rounded-2xl ${plan.popular
                                    ? 'bg-gradient-to-br from-primary/10 to-primary/5'
                                    : 'bg-muted/50'
                                    }`}>
                                    <plan.icon className={`h-8 w-8 ${plan.popular ? 'text-primary' : 'text-muted-foreground'
                                        }`} />
                                </div>
                            </div>
                            <CardTitle className="text-2xl font-bold mb-2">{plan.name}</CardTitle>
                            <CardDescription className="text-base px-4 leading-relaxed">
                                {plan.description}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="px-6 pb-8">
                            <div className="text-center mb-8">
                                <div className="flex items-baseline justify-center mb-2">
                                    <span className="text-5xl font-bold tracking-tight">
                                        {duration === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                                    </span>
                                    <span className="text-muted-foreground ml-2 text-lg">
                                        {duration === "monthly" ? plan.period : plan.yearlyPeriod}
                                    </span>
                                </div>

                                {duration === "yearly" && (
                                    <div className="flex items-center justify-center gap-2">
                                        <Badge
                                            variant="outline"
                                            className="bg-green-50 text-green-700 border-green-200 px-3 py-1"
                                        >
                                            <TrendingUp className="w-3 h-3 mr-1" />
                                            Save {plan.savings}%
                                        </Badge>
                                        <span className="text-sm text-muted-foreground">
                                            vs monthly
                                        </span>
                                    </div>
                                )}

                                {duration === "monthly" && (
                                    <p className="text-sm text-muted-foreground">
                                        {plan.yearlyPrice} when billed annually
                                    </p>
                                )}
                            </div>

                            <Button
                                className={`w-full mb-8 text-base font-medium ${plan.popular
                                    ? 'bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground shadow-lg'
                                    : 'border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5'
                                    } transition-all duration-200 h-12`}
                                variant={plan.popular ? "default" : "outline"}
                            >
                                {plan.cta}
                            </Button>

                            <div className="space-y-4">
                                <h4 className="font-semibold text-sm text-center mb-4 text-muted-foreground">
                                    Everything you need to get started
                                </h4>
                                <ul className="space-y-3">
                                    {plan.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-start gap-3">
                                            <div className="flex-shrink-0 mt-0.5">
                                                <Check className="h-4 w-4 text-green-500" />
                                            </div>
                                            <span className="text-sm text-foreground/80 leading-relaxed">
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="text-center mt-16">
                <p className="text-sm text-muted-foreground">
                    All plans include a 14-day free trial • No credit card required
                </p>
            </div>
        </div>
    );
}
