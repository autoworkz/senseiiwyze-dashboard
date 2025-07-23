"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  LayoutDashboard,
  Settings,
  Users,
  PieChart,
  LineChart,
  BarChart,
} from "lucide-react";

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ href, icon, title }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
        isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
      )}
    >
      {icon}
      <span>{title}</span>
    </Link>
  );
};

const DashboardSidebar: React.FC = () => {
  return (
    <div className="hidden border-r bg-background lg:block lg:w-64">
      <div className="flex h-full flex-col gap-2 p-4">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <img
              src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg"
              className="h-6 w-6"
              alt="SenseiiWyze Logo"
            />
            <span>SenseiiWyze</span>
          </Link>
        </div>
        <div className="flex-1 py-4">
          <nav className="grid gap-1">
            <SidebarItem
              href="/dashboard"
              icon={<LayoutDashboard className="h-4 w-4" />}
              title="Dashboard"
            />
            <SidebarItem
              href="/executive-dashboard"
              icon={<BarChart3 className="h-4 w-4" />}
              title="Executive Dashboard"
            />
            <SidebarItem
              href="/analytics"
              icon={<LineChart className="h-4 w-4" />}
              title="Analytics"
            />
            <SidebarItem
              href="/reports"
              icon={<BarChart className="h-4 w-4" />}
              title="Reports"
            />
            <SidebarItem
              href="/users"
              icon={<Users className="h-4 w-4" />}
              title="Users"
            />
            <SidebarItem
              href="/settings"
              icon={<Settings className="h-4 w-4" />}
              title="Settings"
            />
          </nav>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;