import {
    NavigationMenuItem,
    NavigationMenuContent,
    NavigationMenuLink,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export interface NavItemProps {
    text: string;
    href?: string;
    items?: { text: string; href: string }[];
}

export default function NavItem({ text, href, items }: NavItemProps) {
    if (items && items.length > 0) {
        return (
            <NavigationMenuItem className="rounded hover:text-lg">
                <NavigationMenuTrigger className="font-bold">{text}</NavigationMenuTrigger>
                <NavigationMenuContent>
                    <div className="grid gap-2 p-2">
                        {items.map((item) => (
                            <NavigationMenuLink key={item.href} href={item.href}>
                                {item.text}
                            </NavigationMenuLink>
                        ))}
                    </div>
                </NavigationMenuContent>
            </NavigationMenuItem>
        );
    }

    return (
        <NavigationMenuItem>
            <NavigationMenuLink className="px-2 text-md rounded-lg hover:bg-accent/90" href={href}>{text}</NavigationMenuLink>
        </NavigationMenuItem>
    );
}