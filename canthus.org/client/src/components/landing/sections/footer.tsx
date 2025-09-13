import { Instagram, Mail, MapPin, Twitter, Linkedin, Github } from "lucide-react";
import fish from "@/assets/fish.svg";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-background border-t mt-4">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <img src={fish} alt="Canthus logo" className="w-8 h-8" />
                            <span className="font-bold text-xl">Canthus</span>
                        </div>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            One-click accessibility solutions for modern teams. Built for the platforms you already use.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>United Kingdom</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            <a href="mailto:hi@canthus.org" className="hover:text-foreground transition-colors">
                                hi@canthus.org
                            </a>
                        </div>
                    </div>

                    {/* Product */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-sm">Product</h3>
                        <nav className="flex flex-col space-y-2">
                            <a href="/features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                Features
                            </a>
                            <a href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                Pricing
                            </a>
                            <a href="/integrations" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                Integrations
                            </a>
                            <a href="/changelog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                Changelog
                            </a>
                            <a href="/roadmap" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                Roadmap
                            </a>
                        </nav>
                    </div>

                    {/* Company */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-sm">Company</h3>
                        <nav className="flex flex-col space-y-2">
                            <a href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                About Us
                            </a>
                            <a href="/careers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                Careers
                            </a>
                            <a href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                Blog
                            </a>
                            <a href="/press" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                Press
                            </a>
                            <a href="/investors" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                Investors
                            </a>
                        </nav>
                    </div>

                    {/* Support & Resources */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-sm">Support</h3>
                        <nav className="flex flex-col space-y-2">
                            <a href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                Documentation
                            </a>
                            <a href="/help" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                Help Center
                            </a>
                            <a href="/api" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                API Reference
                            </a>
                            <a href="/status" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                System Status
                            </a>
                            <a href="/security" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                Security
                            </a>
                        </nav>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-12 pt-8 border-t border-border">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground">
                            <span>© {currentYear} Canthus, Inc. All rights reserved.</span>
                            <div className="flex items-center gap-4">
                                <a href="/privacy" className="hover:text-foreground transition-colors">
                                    Privacy Policy
                                </a>
                                <a href="/terms" className="hover:text-foreground transition-colors">
                                    Terms of Service
                                </a>
                                <a href="/cookies" className="hover:text-foreground transition-colors">
                                    Cookie Policy
                                </a>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center gap-4">
                            <a
                                href="https://instagram.com/canthus"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="Follow us on Instagram"
                            >
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a
                                href="https://twitter.com/canthus"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="Follow us on Twitter"
                            >
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a
                                href="https://linkedin.com/company/canthus"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="Follow us on LinkedIn"
                            >
                                <Linkedin className="h-5 w-5" />
                            </a>
                            <a
                                href="https://github.com/canthus"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="Follow us on GitHub"
                            >
                                <Github className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
