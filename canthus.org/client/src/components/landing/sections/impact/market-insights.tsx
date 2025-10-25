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
                        className="p-8 border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:bg-neutral-900/70 transition-colors duration-200"
                    >
                        <div className="text-center space-y-6">
                            <div className="flex flex-col items-center space-y-4">
                                <insight.icon className="h-6 w-6 text-neutral-600 dark:text-neutral-400" />
                                <div className="text-4xl font-light tracking-tight text-neutral-900 dark:text-neutral-100">
                                    {insight.stat}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                                    {insight.title}
                                </h3>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                    {insight.description}
                                </p>
                                <p className="text-xs text-neutral-500 dark:text-neutral-500">
                                    <a
                                        href={insight.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-neutral-700 dark:hover:text-neutral-300 underline decoration-neutral-300 dark:decoration-neutral-600 underline-offset-2 transition-colors duration-200"
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
