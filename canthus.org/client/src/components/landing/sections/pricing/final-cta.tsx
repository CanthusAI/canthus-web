import { Button } from "@/components/ui/button";

export default function FinalCTA() {
    return (
        <div className="text-center mt-20">
            <h3 className="text-2xl font-bold mb-4">
                Ready to get started?
            </h3>
            <p className="text-muted-foreground mb-6">
                Join thousands of legal professionals making their practices accessible with Canthus.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg">
                    Start Your Free Trial
                </Button>
                <Button variant="outline" size="lg">
                    Schedule a Demo
                </Button>
            </div>
        </div>
    );
}
