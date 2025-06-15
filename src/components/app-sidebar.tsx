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
import { usePathname } from "next/navigation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const currentUser = useAtomValue(currentUserAtom);
  const pathname = usePathname();

  const data = {
    user: {
      name: currentUser?.name ?? "Mohammed Jhansi",
      email: currentUser?.email ?? "hrchennaiashara@gmail.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Dashboard",
        url: "/",
        icon: IconDashboard,
        isActive: pathname === "/",
      },
    ],
    navClouds: [
      {
        title: "Requests",
        icon: List,
        url: "#",
        items: [
          {
            title: "Active Requests",
            url: "/active-requests",
            isActive: pathname === "/active-requests",
          },
          {
            title: "Approved Requests",
            url: "/approved-requests",
            isActive: pathname === "/approved-requests",
          },
          {
            title: "Rejected Requests",
            url: "/rejected-requests",
            isActive: pathname === "/rejected-requests",
          },
          {
            title: "Requests Unsatisfied",
            url: "/requests-unsatisfied",
            isActive: pathname === "/requests-unsatisfied",
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
        {currentUser && currentUser.role !== "agency" && (
          <NavMain
            items={data.navMain}
            isActive={pathname === data.navMain[0].url}
          />
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
                  <SidebarMenu className="px-3">
                    {item.items.map((item) => (
                      <SidebarMenuItem
                        key={item.title}
                        className={
                          item.isActive
                            ? "bg-zinc-900 text-white dark:bg-white rounded-lg dark:text-zinc-900 hover:!bg-zinc-900/70"
                            : ""
                        }
                      >
                        <SidebarMenuButton
                          asChild
                          className="hover:!bg-zinc-900/70 hover:text-white rounded-lg px-3"
                        >
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
