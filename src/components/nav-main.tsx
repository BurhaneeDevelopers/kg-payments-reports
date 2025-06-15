"use client";

import { type Icon } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

export function NavMain({
  items,
  isActive = false,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
  isActive: boolean;
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                className={`hover:bg-primary/90 hover:text-primary-foreground min-w-8 duration-200 ease-linear ${
                  isActive ? "bg-primary text-primary-foreground" : ""
                }`}
                tooltip={item.title}
              >
                {item.icon && <item.icon />}
                <Link href={item.url}>{item.title}</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
