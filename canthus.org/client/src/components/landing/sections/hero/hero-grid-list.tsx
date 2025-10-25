import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle,
  ContactRound,
  Hand,
  Server,
  UserCircle,
} from "lucide-react";

const actions = [
  {
    title: "Getting Started",
    description:
      "Everything you need to know to get started and get to work in ChatCloud.",
    href: "#",
    icon: ArrowRight,
    iconForeground: "text-primary",
    iconBackground: "bg-primary/10 dark:bg-primary/20",
    ringColorClass: "ring-primary/20",
  },
  {
    title: "Admin Settings",
    description:
      "Learn how to manage your current workspace or your enterprise space.",
    href: "#",
    icon: UserCircle,
    iconForeground: "text-destructive",
    iconBackground: "bg-destructive/10 dark:bg-destructive/20",
    ringColorClass: "ring-destructive/20",
  },
  {
    title: "Server Setup",
    description:
      "Connect, simplify, and automate. Discover the power of apps and tools.",
    href: "#",
    icon: Server,
    iconForeground: "text-accent",
    iconBackground: "bg-accent/10 dark:bg-accent/20",
    ringColorClass: "ring-accent/20",
  },
  {
    title: "Login and Verification",
    description:
      "Read on to learn how to sign in with your email address, or your Apple or Google.",
    href: "#",
    icon: CheckCircle,
    iconForeground: "text-primary",
    iconBackground: "bg-primary/10 dark:bg-primary/20",
    ringColorClass: "ring-primary/20",
  },
  {
    title: "Account Setup",
    description:
      "Adjust your profile and preferences to make ChatCloud work just for you.",
    href: "#",
    icon: ContactRound,
    iconForeground: "text-accent",
    iconBackground: "bg-accent/10 dark:bg-accent/20",
    ringColorClass: "ring-accent/20",
  },
  {
    title: "Trust & Safety",
    description:
      "Trust on our current database and learn how we distribute your data.",
    href: "#",
    icon: Hand,
    iconForeground: "text-secondary-foreground",
    iconBackground: "bg-secondary/50 dark:bg-secondary/20",
    ringColorClass: "ring-secondary/20",
  },
];

export default function HeroGridList() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="overflow-hidden rounded-2xl bg-transparent grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 sm:gap-1 sm:space-y-0.5 space-y-2 p-0.5">
        {actions.map((action) => (
          <Card
            key={action.title}
            className={cn(
              "group relative rounded-xl border-0 bg-card/90 p-0 focus-within:ring-2 focus-within:ring-ring focus-within:ring-inset"
            )}
          >
            <CardContent className="p-6">
              <div>
                <span
                  className={cn(
                    action.iconBackground,
                    action.iconForeground,
                    "inline-flex rounded-lg p-3 ring-2 ring-inset",
                    action.ringColorClass
                  )}
                >
                  <action.icon aria-hidden="true" className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-base font-semibold text-foreground">
                  <a href={action.href} className="focus:outline-none">
                    <span aria-hidden="true" className="absolute inset-0" />
                    {action.title}
                  </a>
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {action.description}
                </p>
              </div>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-6 right-6 text-muted-foreground/50 group-hover:text-muted-foreground/60"
              >
                <ArrowUpRight className="h-6 w-6" />
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
