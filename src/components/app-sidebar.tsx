"use client";

import * as React from "react";
import {
  // IconCamera,
  // IconChartBar,
  IconDashboard,
  // IconDatabase,
  // IconFileAi,
  // IconFileDescription,
  // IconFileWord,
  // IconFolder,
  // IconHelp,
  // IconInnerShadowTop,
  // IconListDetails,
  // IconReport,
  // IconSearch,
  // IconSettings,
  // IconUsers,
} from "@tabler/icons-react";

// import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
// import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ChevronRight, List } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import Link from "next/link";
import { currentUserAtom } from "@/jotai/store";
import { useAtomValue } from "jotai";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const currentUser = useAtomValue(currentUserAtom);

  const data = {
    user: {
      name:
        currentUser && currentUser.name ? currentUser.name : "Mohammed Jhansi",
      email:
        currentUser && currentUser.email
          ? currentUser.email
          : "hrchennaiashara@gmail.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Dashboard",
        url:
          currentUser && currentUser.role === "admin"
            ? "/"
            : "/you-cannot-access-this",
        icon: IconDashboard,
      },
    ],
    navClouds: [
      {
        title: "Requests",
        icon: List,
        isActive: true,
        url: "#",
        items: [
          {
            title: "Active Requests",
            url: "/active-requests",
          },
          {
            title: "Rejected Requests",
            url: "#",
          },
          {
            title: "Requests Unsatisfied",
            url: "#",
          },
        ],
      },
    ],
  };
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <span className="text-base font-semibold">
                  Ashara Mubaraka 1447H
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {currentUser && currentUser.role === "admin" && (
          <NavMain items={data.navMain} isActive={true} />
        )}
        {data.navClouds.map((item) => (
          <Collapsible
            key={item.title}
            title={item.title}
            className="group/collapsible"
            defaultOpen
          >
            <SidebarGroup>
              <SidebarGroupLabel
                asChild
                className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
              >
                <CollapsibleTrigger>
                  {item.title}{" "}
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          {/* isActive={item.isActive} */}
                          <Link href={item.url}>{item.title}</Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
