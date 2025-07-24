"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  BarChart,
  Users,
  Settings,
  Home,
  Award,
  Briefcase,
  Layers,
} from "lucide-react"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
    icon: React.ReactNode
  }[]
}

export function DashboardSidebar({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            pathname === item.href
              ? "bg-accent text-accent-foreground"
              : "transparent"
          )}
        >
          {item.icon}
          <span className="ml-3">{item.title}</span>
        </Link>
      ))}
    </nav>
  )
}

export function DashboardSidebarItems() {
  return [
    {
      href: "/dashboard",
      title: "Overview",
      icon: <Home className="h-4 w-4" />,
    },
    {
      href: "/dashboard/program-readiness-dashboard",
      title: "Program Readiness",
      icon: <Award className="h-4 w-4" />,
    },
    {
      href: "/dashboard/analytics",
      title: "Analytics",
      icon: <BarChart className="h-4 w-4" />,
    },
    {
      href: "/dashboard/users",
      title: "Users",
      icon: <Users className="h-4 w-4" />,
    },
    {
      href: "/dashboard/programs",
      title: "Programs",
      icon: <Briefcase className="h-4 w-4" />,
    },
    {
      href: "/dashboard/skills",
      title: "Skills",
      icon: <Layers className="h-4 w-4" />,
    },
    {
      href: "/settings",
      title: "Settings",
      icon: <Settings className="h-4 w-4" />,
    },
  ]
}