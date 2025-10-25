import {
    Shield,
    FileText,
    Users,
    Eye,
    AlertTriangle,
    BarChart
} from "lucide-react";

const solutions = [
    {
        icon: AlertTriangle,
        title: "Compliance Risk Mitigation",
        description: "Reduce legal exposure and meet regulatory requirements automatically. Our system monitors WCAG 2.1 AA standards and provides real-time compliance reporting.",
        problem: "Accessibility lawsuits cost companies millions annually",
        solution: "Automated compliance monitoring and reporting"
    },
    {
        icon: Users,
        title: "Market Expansion",
        description: "Serve the 1.3 billion people worldwide with disabilities. Tap into an underserved market segment while improving user experience for all customers.",
        problem: "Excluding 15% of potential market due to accessibility barriers",
        solution: "Comprehensive platform accessibility for all users"
    },
    {
        icon: Eye,
        title: "Content Accessibility",
        description: "Automatically generate alt-text, captions, and descriptions for images, videos, and documents. Ensure all content is perceivable by assistive technologies.",
        problem: "Manual accessibility efforts are inconsistent and resource-intensive",
        solution: "Automated content recognition and enhancement"
    },
    {
        icon: FileText,
        title: "Document Compliance",
        description: "Transform PDFs, forms, and documentation into accessible formats. Support screen readers, keyboard navigation, and other assistive technologies.",
        problem: "Documents remain inaccessible despite platform improvements",
        solution: "End-to-end document accessibility automation"
    },
    {
        icon: Shield,
        title: "Risk Management",
        description: "Continuous monitoring identifies accessibility issues before they become compliance problems. Generate detailed reports for stakeholders and auditors.",
        problem: "Reactive accessibility fixes are costly and damaging",
        solution: "Proactive issue detection and resolution"
    },
    {
        icon: BarChart,
        title: "Performance Analytics",
        description: "Track accessibility metrics, compliance scores, and user engagement across your platform. Data-driven insights for continuous improvement.",
        problem: "No visibility into accessibility impact and ROI",
        solution: "Comprehensive accessibility analytics dashboard"
    }
];

export default function FeaturesGrid() {
    return (
        <div className="mb-24">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {solutions.map((solution, index) => (
                    <div
                        key={index}
                        className="group relative p-8 border border-neutral-200 bg-white dark:bg-neutral-950 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-200"
                    >
                        {/* Status indicator */}
                        <div className="absolute top-6 right-6">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        </div>

                        {/* Icon */}
                        <div className="mb-6">
                            <solution.icon className="h-8 w-8 text-neutral-600 dark:text-neutral-400" />
                        </div>

                        {/* Content */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-light tracking-tight text-neutral-900 dark:text-neutral-100 mb-2">
                                {solution.title}
                            </h3>
                            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                {solution.description}
                            </p>
                        </div>

                        {/* Bottom accent */}
                        <div className="mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-800">
                            <div className="space-y-2">
                                <p className="text-xs font-medium text-neutral-500 dark:text-neutral-500 uppercase tracking-wide">
                                    Challenge
                                </p>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    {solution.problem}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}