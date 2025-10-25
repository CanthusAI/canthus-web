import { Button } from "@/components/ui/button";

export default function EnterpriseCTA() {
    return (
        <div className="text-center mb-20 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-950/20 dark:to-gray-950/20 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl font-bold mb-4">
                Need something custom?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                We work with large law firms to create custom accessibility solutions.
                Contact our sales team to discuss volume discounts and custom features.
            </p>
            <Button size="lg">
                Contact Sales Team
            </Button>
        </div>
    );
}
