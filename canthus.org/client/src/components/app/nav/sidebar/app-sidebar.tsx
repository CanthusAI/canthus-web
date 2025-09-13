"use client";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import type React from "react";
import { useState } from "react";
import { TeamSwitcher } from "./team-switcher";
import {
    ChevronRight,
    X,
    BarChart3,
    Cloud,
    Package,
    Lock,
    Shield,
    Settings,
    User,
    Bell,
    Webhook,
    Key,
    FileText,
    Users,
    Search,
    Activity,
} from "lucide-react";
import { useAuth } from "@/components/auth/context";
import { NavUser } from "./user-nav";


interface SidebarItem {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    hasSubItems?: boolean;
    route?: string;
    subItems?: {
        id: string;
        label: string;
        icon: React.ComponentType<{ className?: string }>;
        description?: string;
        route?: string;
    }[];
}

const sidebarItems: SidebarItem[] = [
    {
        id: "overview",
        label: "Overview",
        icon: BarChart3,
        route: "/app/overview",
        hasSubItems: false,
    },
    {
        id: "documents",
        label: "Documents",
        icon: FileText,
        hasSubItems: true,
        subItems: [
            {
                id: "documents-by-client",
                label: "By Client",
                icon: Users,
                description: "Browse documents by client",
                route: "/app/documents/clients",
            },
            {
                id: "documents-search",
                label: "Search",
                icon: Search,
                description: "Search all documents",
                route: "/app/documents/search",
            },
        ],
    },
    {
        id: "usage",
        label: "Usage",
        icon: Activity,
        hasSubItems: false,
        route: "/app/usage",
    },
    {
        id: "reports",
        label: "Reports",
        icon: FileText,
        hasSubItems: true,
        subItems: [
            {
                id: "accessibility-report",
                label: "Accessibility",
                icon: FileText,
                description: "Project accessibility reports",
                route: "/app/reports/accessibility",
            },
            {
                id: "compliance-report",
                label: "Compliance",
                icon: Shield,
                description: "Compliance summaries",
                route: "/app/reports/compliance",
            },
        ],
    },
    {
        id: "compliance",
        label: "Compliance",
        icon: Shield,
        hasSubItems: true,
        subItems: [
            {
                id: "wcag",
                label: "WCAG",
                icon: Shield,
                description: "WCAG mappings and status",
                route: "/app/compliance/wcag",
            },
            {
                id: "ada",
                label: "ADA",
                icon: Shield,
                description: "ADA guidelines",
                route: "/app/compliance/ada",
            },
            {
                id: "policies",
                label: "Policies",
                icon: Lock,
                description: "Org-wide policies",
                route: "/app/compliance/policies",
            },
        ],
    },
    {
        id: "integrations",
        label: "Integrations",
        icon: Cloud,
        hasSubItems: true,
        subItems: [
            {
                id: "platforms",
                label: "Platforms",
                icon: Cloud,
                description: "Connected platforms",
                route: "/app/integrations/platforms",
            },
            {
                id: "webhooks",
                label: "Webhooks",
                icon: Webhook,
                description: "Webhook configurations",
                route: "/app/integrations/webhooks",
            },
            {
                id: "api-keys",
                label: "API Keys",
                icon: Key,
                description: "Access tokens",
                route: "/app/integrations/api-keys",
            },
        ],
    },
    {
        id: "settings",
        label: "Settings",
        icon: Settings,
        hasSubItems: true,
        subItems: [
            {
                id: "profile",
                label: "Profile",
                icon: User,
                description: "Your profile settings",
                route: "/app/settings/profile",
            },
            {
                id: "organization",
                label: "Organization",
                icon: Users,
                description: "Members & teams",
                route: "/app/settings/organization",
            },
            {
                id: "notifications",
                label: "Notifications",
                icon: Bell,
                description: "Notification preferences",
                route: "/app/settings/notifications",
            },
            {
                id: "billing",
                label: "Billing",
                icon: Package,
                description: "Subscriptions & invoices",
                route: "/app/settings/billing",
            },
        ],
    },
];

export function AppSidebar() {
    const { user, logOut } = useAuth();
    // TODO test a user with an org attached, and use that in the team switcher
    // this is a placeholder to disable the org/team switcher for now
    // Removed team switcher


    const [activeItem, setActiveItem] = useState<string | null>("overview");
    const [selectedSubItem, setSelectedSubItem] = useState<string | null>(null);

    const activeItemData = sidebarItems.find((item) => item.id === activeItem);

    const handleItemClick = (item: SidebarItem) => {
        if (item.hasSubItems) {
            const isActive = activeItem === item.id;
            setActiveItem(isActive ? null : item.id);
            if (isActive) {
                setSelectedSubItem(null);
            }
        } else {
            if (activeItem) {
                setActiveItem(null);
                setSelectedSubItem(null);
            }
            console.log(`[v0] Navigating to: ${item.route}`);
        }
    };

    const handleSubItemClick = (subItem: { id: string; route?: string }) => {
        setSelectedSubItem(selectedSubItem === subItem.id ? null : subItem.id);
        if (subItem.route) {
            console.log(`[v0] Navigating to: ${subItem.route}`);
        }
    };

    return (
        <div className="flex h-screen bg-background">
            <Sidebar
                side="left"
                variant="sidebar"
                collapsible="icon"
                className="w-64 border-r"
            >
                {user?.organizations && (
                    <TeamSwitcher teams={user.organizations.map((org) => ({
                        name: org.name,
                        id: org.id,
                        logoUrl: "/images/fish.svg",
                        plan: "TODO: Add plan",
                    }))} />
                )}
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {sidebarItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = activeItem === item.id;
                                    const chevronIndicator = (
                                        <ChevronRight
                                            className={cn(
                                                "h-4 w-4 transition-transform shrink-0",
                                                isActive && "rotate-90"
                                            )}
                                        />
                                    );

                                    return (
                                        <SidebarMenuItem key={item.id}>
                                            <SidebarMenuButton
                                                isActive={isActive}
                                                className="w-full h-10 px-3"
                                                onClick={() => handleItemClick(item)}
                                            >
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    <Icon className="h-4 w-4 shrink-0" />
                                                    <span className="truncate">{item.label}</span>
                                                </div>
                                                <div className="flex items-center gap-1 shrink-0 ml-auto min-w-fit">
                                                    {(item.badge || item.hasSubItems) &&
                                                        (item.badge ? (
                                                            <SidebarMenuBadge
                                                                className={cn(
                                                                    "min-w-fit",
                                                                    item.hasSubItems && "gap-x-3"
                                                                )}
                                                            >
                                                                {item.badge}
                                                                {item.hasSubItems && chevronIndicator}
                                                            </SidebarMenuBadge>
                                                        ) : (
                                                            chevronIndicator
                                                        ))}
                                                </div>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter className="mb-1">
                    {user && (
                        <NavUser user={user} logOut={logOut} />
                    )}
                </SidebarFooter>
            </Sidebar>

            {activeItem && activeItemData?.subItems && (
                <Sidebar
                    side="left"
                    variant="sidebar"
                    collapsible="none"
                    className="w-72 animate-in slide-in-from-left-5 duration-200 border-r"
                >
                    <SidebarHeader className="flex flex-row items-center justify-between border-b px-4">
                        <h3 className="font-medium">{activeItemData.label}</h3>
                        <button
                            onClick={() => setActiveItem(null)}
                            className="h-6 w-6 p-0 rounded-md hover:bg-sidebar-accent flex items-center justify-center"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </SidebarHeader>

                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {activeItemData.subItems.map((subItem) => {
                                        const SubIcon = subItem.icon;
                                        const isSelected = selectedSubItem === subItem.id;

                                        return (
                                            <SidebarMenuItem key={subItem.id}>
                                                <SidebarMenuButton
                                                    isActive={isSelected}
                                                    className="w-full justify-start gap-3 h-auto py-2 px-3"
                                                    onClick={() => handleSubItemClick(subItem)}
                                                >
                                                    <SubIcon className="h-5 w-5 shrink-0 self-start mt-0.5" />

                                                    <div className="flex-1 text-left min-w-0">
                                                        <div className="font-medium">{subItem.label}</div>
                                                        {subItem.description && (
                                                            <div className="text-xs text-muted-foreground mt-0.5">
                                                                {subItem.description}
                                                            </div>
                                                        )}
                                                    </div>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        );
                                    })}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>
                </Sidebar>
            )}
        </div>
    );
}
