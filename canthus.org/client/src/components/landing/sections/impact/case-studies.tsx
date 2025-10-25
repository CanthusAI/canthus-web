import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const capabilities = [
    {
        title: "Insurance Platform Ready",
        industry: "Insurance",
        problem: "Insurance platforms handle complex policy documents that are often inaccessible to users with visual impairments",
        solution: "Canthus automatically generates alt-text for charts, simplifies policy language, and ensures document compatibility",
        impact: "Transforms insurance platforms into inclusive experiences that serve all customers effectively"
    },
    {
        title: "Legal Tech Integration",
        industry: "Legal",
        problem: "Legal platforms contain complex jargon and documents that create barriers for clients with accessibility needs",
        solution: "Our Clio integration will provide legalese translation, document accessibility, and client accommodation management",
        impact: "Enables law firms to serve clients with diverse accessibility needs while maintaining professional standards"
    },
    {
        title: "Universal SaaS Solution",
        industry: "All Verticals",
        problem: "Most vertical SaaS platforms lack comprehensive accessibility features, excluding millions of potential users",
        solution: "Canthus provides a universal accessibility layer that works across industries and platform types",
        impact: "Opens new market opportunities and ensures compliance while improving user experience for everyone"
    }
];

export default function CaseStudies() {
    return (
        <div className="mb-20">
            <h3 className="text-2xl font-bold text-center mb-12">Platform Capabilities</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {capabilities.map((capability, index) => (
                    <Card key={index} className="h-full">
                        <CardHeader>
                            <CardTitle className="text-lg text-primary">{capability.title}</CardTitle>
                            <p className="text-sm text-muted-foreground font-medium">{capability.industry}</p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-sm mb-2 text-destructive">Problem</h4>
                                <p className="text-sm text-muted-foreground">{capability.problem}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm mb-2 text-primary">Solution</h4>
                                <p className="text-sm text-muted-foreground">{capability.solution}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm mb-2 text-accent">Impact</h4>
                                <p className="text-sm text-muted-foreground">{capability.impact}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
