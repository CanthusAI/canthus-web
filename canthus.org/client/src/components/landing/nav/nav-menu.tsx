import { Button } from "@/components/ui/button";
import NavItem from "./nav-item";
import { NavigationMenu, NavigationMenuList } from "@/components/ui/navigation-menu";

const items = [
    { text: "Features", href: "/features" },
    { text: "Integrations", href: "/integrations" },
    { text: "Pricing", href: "/pricing" },
];

export default function NavMenu() {
    return (
        <NavigationMenu>
            <NavigationMenuList className="flex items-center gap-4">
                {items.map((item) => (
                    <NavItem key={item.href} text={item.text} href={item.href} />
                ))}
                <Button className="bg-primary hover:bg-primary/90 rounded-lg text-md">Log In</Button>
            </NavigationMenuList>
        </NavigationMenu>
    );
}


