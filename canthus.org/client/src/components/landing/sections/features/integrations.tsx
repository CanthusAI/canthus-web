const integrations = [
    { name: "Socotra", logo: "🛡️", category: "Insurance", status: "live", description: "Complete policy management and underwriting platform" },
    { name: "Clio", logo: "⚖️", category: "Legal", status: "coming-soon", description: "Leading legal practice management software" },
];

interface IntegrationsProps {
    showTitle?: boolean;
}

export default function Integrations({ showTitle = true }: IntegrationsProps) {
    return (
        <div className="text-center mb-12 mt-24">
            {showTitle && (
                <>
                    <h1 className="text-4xl font-bold tracking-tight mb-4">
                        Seamless Integrations
                    </h1>
                    <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
                        Connect with your existing tools and workflows. Canthus integrates with the platforms you already use,
                        ensuring your team can work efficiently without disrupting established processes.
                    </p>
                </>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {integrations.map((integration, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center gap-4 p-6 rounded-lg border bg-card hover:bg-accent transition-all duration-300 hover:shadow-lg hover:scale-105"
                    >
                        <div className="text-4xl mb-2">{integration.logo}</div>
                        <div className="text-center">
                            <h3 className="text-lg font-semibold mb-1">{integration.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{integration.category}</p>
                            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                                {integration.description}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            {integration.status === "live" && (
                                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                                    Live
                                </span>
                            )}
                            {integration.status === "coming-soon" && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                                    Coming Soon
                                </span>
                            )}
                            {integration.status === "planned" && (
                                <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">
                                    Planned
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12">
                <p className="text-muted-foreground">
                    Can't find your integration? <a href="#contact" className="text-primary hover:underline">Let us know</a> - we're always adding new connections.
                </p>
            </div>
        </div>
    );
}
