import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Shield, Target } from "lucide-react";

const insights = [
    {
        icon: TrendingUp,
        title: "Growing Market Need",
        stat: "71%",
        description: "of companies face accessibility lawsuits due to non-compliant platforms",
        source: "WebAIM 2024 Report"
    },
    {
        icon: Shield,
        title: "Compliance Gap",
        stat: "98%",
        description: "of top websites fail basic accessibility standards",
        source: "WebAIM Million Analysis"
    },
    {
        icon: Target,
        title: "Revenue Opportunity",
        stat: "$13T",
        description: "global spending power of people with disabilities",
        source: "Return on Disability Report"
    }
];

export default function MarketInsights() {
    return (
        <div className="mb-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {insights.map((insight, index) => (
                    <Card key={index} className="h-full text-center">
                        <CardHeader>
                            <div className="mx-auto p-3 bg-primary/10 rounded-lg w-fit mb-4">
                                <insight.icon className="h-8 w-8 text-primary" />
                            </div>
                            <div className="text-4xl font-bold text-primary mb-2">{insight.stat}</div>
                            <CardTitle className="text-lg">{insight.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                                {insight.description}
                            </p>
                            <p className="text-xs text-muted-foreground font-medium">
                                Source: {insight.source}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
