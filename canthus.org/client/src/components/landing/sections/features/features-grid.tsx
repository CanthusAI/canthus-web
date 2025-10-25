import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Shield,
    Zap,
    Monitor,
    Users,
    CheckCircle,
    Globe,
    Settings,
    Eye
} from "lucide-react";

const features = [
    {
        icon: Eye,
        title: "Smart Content Recognition",
        description: "Automatically generate alt-text for images, charts, and visual content across your platform, making information accessible to screen reader users.",
        badge: "Core"
    },
    {
        icon: Globe,
        title: "Language Simplification",
        description: "Transform complex industry jargon into plain language that all users can understand, reducing barriers to comprehension.",
        badge: "Core"
    },
    {
        icon: CheckCircle,
        title: "Document Accessibility",
        description: "Automatically format PDFs, forms, and documents to be compatible with assistive technologies and navigation tools.",
        badge: "Core"
    },
    {
        icon: Users,
        title: "User Preference Engine",
        description: "Store and automatically apply accessibility preferences for each user, creating personalized experiences that meet individual needs.",
        badge: "Core"
    },
    {
        icon: Settings,
        title: "Real-time Compliance",
        description: "Continuously monitor your platform for WCAG 2.1 AA compliance and automatically fix common accessibility issues.",
        badge: "Pro"
    },
    {
        icon: Shield,
        title: "API & Webhooks",
        description: "Integrate accessibility features directly into your development workflow with comprehensive APIs and real-time notifications.",
        badge: "Pro"
    },
    {
        icon: Monitor,
        title: "White Label Platform",
        description: "Customize the accessibility interface with your brand while providing enterprise-grade accessibility tools to your users.",
        badge: "Enterprise"
    },
    {
        icon: Zap,
        title: "One-Click Integration",
        description: "Deploy accessibility features across your vertical SaaS platform without disrupting existing workflows or user experiences.",
        badge: "All Plans"
    }
];

export default function FeaturesGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {features.map((feature, index) => (
                <Card key={index} className="relative group hover:shadow-lg transition-all duration-200">
                    <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                            <div className="p-2 bg-primary/10 rounded-lg w-fit">
                                <feature.icon className="h-6 w-6 text-primary" />
                            </div>
                            <Badge variant={
                                feature.badge === "Pro" ? "default" :
                                    feature.badge === "Enterprise" ? "destructive" :
                                        feature.badge === "Core" ? "secondary" :
                                            "outline"
                            } className="text-xs">
                                {feature.badge}
                            </Badge>
                        </div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription className="text-sm leading-relaxed">
                            {feature.description}
                        </CardDescription>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
