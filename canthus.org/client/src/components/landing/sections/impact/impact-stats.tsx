import {
    Users,
    CheckCircle,
    Heart,
    Clock
} from "lucide-react";

const impactStats = [
    {
        icon: Users,
        title: "Addressable Market",
        value: "$1.3B",
        description: "Accessibility solutions market for vertical SaaS platforms by 2027"
    },
    {
        icon: CheckCircle,
        title: "Compliance Standards",
        value: "78+",
        description: "WCAG 2.1 AA guidelines automatically monitored and enforced"
    },
    {
        icon: Heart,
        title: "Global Users",
        value: "1.3B",
        description: "People worldwide who benefit from accessible technology"
    },
    {
        icon: Clock,
        title: "Implementation Efficiency",
        value: "90%",
        description: "Reduction in development time for accessibility features"
    }
];

export default function ImpactStats() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
                <div
                    key={index}
                    className="text-center p-8 border border-border bg-card hover:bg-accent/20 transition-colors duration-200"
                >
                    <div className="flex flex-col items-center space-y-4">
                        <stat.icon className="h-6 w-6 text-muted-foreground" />
                        <div className="text-3xl font-light tracking-tight text-foreground">
                            {stat.value}
                        </div>
                        <h3 className="text-sm font-medium tracking-wide uppercase text-muted-foreground">
                            {stat.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {stat.description}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
