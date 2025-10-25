"use client";

import { Bug, Settings2 } from "lucide-react";
import * as React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getVersionInfo } from "@/lib/version";

export function TeamSwitcher({
  teams,
}: {
  teams: {
    id: string;
    name: string;
    logoUrl: string;
    plan: string;
  }[];
}) {
  const { isMobile } = useSidebar();
  const [activeTeam] = React.useState(teams[0]);
  const versionInfo = getVersionInfo();

  if (!activeTeam) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-accent text-sidebar-accent-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Avatar><AvatarImage src={activeTeam.logoUrl} /> <AvatarFallback>{activeTeam.name.charAt(0)}</AvatarFallback></Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-center">
                      <div className="font-semibold">Canthus v{versionInfo.version}</div>
                      <div className="text-xs opacity-80">{versionInfo.environment}</div>
                      {versionInfo.buildTime && (
                        <div className="text-xs opacity-60">
                          Built: {new Date(versionInfo.buildTime).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeTeam.name}</span>
                <span className="truncate text-xs">{activeTeam.plan}</span>
              </div>
              <Settings2 className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Site Settings
            </DropdownMenuLabel>
            <DropdownMenuItem
              key={"Report Bug"}
              onClick={() => console.log("Report Bug")}
              className="gap-2 p-2 my-1"
            >
              <Bug className="size-4" />
              Report Bug
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
