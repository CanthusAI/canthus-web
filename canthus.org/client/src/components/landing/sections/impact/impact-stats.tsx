import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Users,
    CheckCircle,
    Heart,
    Clock
} from "lucide-react";

const impactStats = [
    {
        icon: Users,
        title: "Market Opportunity",
        value: "$1.3B",
        description: "Accessibility market size for SaaS platforms by 2027"
    },
    {
        icon: CheckCircle,
        title: "Accessibility Rules",
        value: "78+",
        description: "WCAG 2.1 AA guidelines automatically monitored and fixed"
    },
    {
        icon: Heart,
        title: "People with Disabilities",
        value: "1.3B",
        description: "Worldwide population that benefits from accessible technology"
    },
    {
        icon: Clock,
        title: "Development Time",
        value: "90%",
        description: "Reduction in time needed to implement accessibility features"
    }
];

export default function ImpactStats() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {impactStats.map((stat, index) => (
                <Card key={index} className="text-center">
                    <CardHeader className="pb-4">
                        <div className="mx-auto p-3 bg-primary/10 rounded-lg w-fit mb-4">
                            <stat.icon className="h-8 w-8 text-primary" />
                        </div>
                        <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                        <CardTitle className="text-lg">{stat.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{stat.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
