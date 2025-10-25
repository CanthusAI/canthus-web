import {
    NavigationMenuItem,
    NavigationMenuContent,
    NavigationMenuLink,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useNavigate } from "@tanstack/react-router";

export interface NavItemProps {
    text: string;
    href?: string;
    items?: { text: string; href: string }[];
}

export default function NavItem({ text, href, items }: NavItemProps) {
    const navigate = useNavigate();
    if (items && items.length > 0) {
        return (
            <NavigationMenuItem className="rounded hover:text-lg">
                <NavigationMenuTrigger className="font-bold">{text}</NavigationMenuTrigger>
                <NavigationMenuContent>
                    <div className="grid gap-2 p-2">
                        {items.map((item) => (
                            <NavigationMenuLink key={item.href} onClick={() => navigate({ to: item.href })}>
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
            <NavigationMenuLink
                className="px-4 py-2 text-base font-medium rounded-lg hover:bg-accent/90 hover:cursor-pointer transition-colors duration-200"
                onClick={() => navigate({ to: href })}
            >
                {text}
            </NavigationMenuLink>
        </NavigationMenuItem>
    );
}