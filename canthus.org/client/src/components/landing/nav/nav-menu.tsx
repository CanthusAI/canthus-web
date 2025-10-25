import NavItem from "./nav-item";
import { NavigationMenu, NavigationMenuList } from "@/components/ui/navigation-menu";

const items = [
    { text: "Features", href: "/features" },
    { text: "Pricing", href: "/pricing" },
];

export default function NavMenu() {
    return (

        <NavigationMenu>
            <NavigationMenuList className="flex items-center gap-6">
                {items.map((item) => (
                    <NavItem key={item.href} text={item.text} href={item.href} />
                ))}
            </NavigationMenuList>
        </NavigationMenu>
    );
}


