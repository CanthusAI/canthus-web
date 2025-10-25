const integrations = [
    { name: "Socotra", logo: "🛡️", category: "Insurance", status: "live" },
    { name: "Clio", logo: "⚖️", category: "Legal", status: "coming-soon" }
];

interface IntegrationsSmallProps {
    showTitle?: boolean;
}

export default function IntegrationsSmall({ showTitle = false }: IntegrationsSmallProps) {
    return (
        <div className="text-center mb-12">
            {showTitle && (
                <>
                    <h2 className="text-3xl font-bold tracking-tight mb-4">
                        Seamless Integrations
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Connect with your existing tools and workflows. Canthus integrates with the platforms you already use.
                    </p>
                </>
            )}
            <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
                {integrations.map((integration, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center gap-2 p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
                    >
                        <span className="text-2xl">{integration.logo}</span>
                        <span className="text-sm font-medium">{integration.name}</span>
                        <span className="text-xs text-muted-foreground">{integration.category}</span>
                        {integration.status === "live" && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Live</span>
                        )}
                        {integration.status === "coming-soon" && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Coming Soon</span>
                        )}
                        {integration.status === "planned" && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">Planned</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
