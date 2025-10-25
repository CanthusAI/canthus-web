import { TrendingUp, Shield, Target } from "lucide-react";

const insights = [
    {
        icon: TrendingUp,
        title: "Compliance Risk",
        stat: "71%",
        description: "Companies face accessibility challenges due to non-compliant platforms",
        source: "WebAIM 2024",
        url: "https://webaim.org/projects/"
    },
    {
        icon: Shield,
        title: "Implementation Gap",
        stat: "98%",
        description: "Digital platforms fail to meet basic accessibility standards",
        source: "WebAIM Analysis",
        url: "https://webaim.org/projects/million/"
    },
    {
        icon: Target,
        title: "Market Potential",
        stat: "$13T",
        description: "Annual disposable income of the global disability community",
        source: "Global Economics Report",
        url: "https://www.rod-group.com/research-insights/annual-report-2024/"
    }
];

export default function MarketInsights() {
    return (
        <div className="mb-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {insights.map((insight, index) => (
                    <div
                        key={index}
                        className="p-8 border border-border bg-card hover:bg-accent/20 transition-colors duration-200"
                    >
                        <div className="text-center space-y-6">
                            <div className="flex flex-col items-center space-y-4">
                                <insight.icon className="h-6 w-6 text-muted-foreground" />
                                <div className="text-4xl font-light tracking-tight text-foreground">
                                    {insight.stat}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-lg font-medium text-foreground">
                                    {insight.title}
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {insight.description}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    <a
                                        href={insight.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-foreground underline decoration-border underline-offset-2 transition-colors duration-200"
                                    >
                                        Source: {insight.source}
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
