"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: ReactNode
  className?: string
}

export function UserDashboardLayout({ children, className }: DashboardLayoutProps) {
  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100",
      "dark:from-slate-900 dark:via-slate-800 dark:to-slate-900",
      className
    )}>
      <div className="container mx-auto p-6 space-y-6">
        {children}
      </div>
    </div>
  )
}

interface DashboardGridProps {
  children: ReactNode
  columns?: 1 | 2 | 3 | 4 | 6 | 12
  gap?: 2 | 3 | 4 | 5 | 6 | 8
  className?: string
}

export function DashboardGrid({ 
  children, 
  columns = 12, 
  gap = 6,
  className 
}: DashboardGridProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 lg:grid-cols-2",
    3: "grid-cols-1 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    6: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
    12: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-12"
  }

  const gridGap = {
    2: "gap-2",
    3: "gap-3", 
    4: "gap-4",
    5: "gap-5",
    6: "gap-6",
    8: "gap-8"
  }

  return (
    <div className={cn(
      "grid",
      gridCols[columns],
      gridGap[gap],
      className
    )}>
      {children}
    </div>
  )
}

interface DashboardSectionProps {
  children: ReactNode
  gridSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  className?: string
}

export function DashboardSection({ 
  children, 
  gridSpan,
  className 
}: DashboardSectionProps) {
  const spanClasses = gridSpan ? {
    1: "col-span-1",
    2: "col-span-1 lg:col-span-2",
    3: "col-span-1 lg:col-span-3",
    4: "col-span-1 md:col-span-2 lg:col-span-4",
    5: "col-span-1 md:col-span-2 lg:col-span-5",
    6: "col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-6",
    7: "col-span-1 md:col-span-2 lg:col-span-4 xl:col-span-7",
    8: "col-span-1 md:col-span-2 lg:col-span-4 xl:col-span-8",
    9: "col-span-1 md:col-span-2 lg:col-span-4 xl:col-span-9",
    10: "col-span-1 md:col-span-2 lg:col-span-5 xl:col-span-10",
    11: "col-span-1 md:col-span-2 lg:col-span-6 xl:col-span-11",
    12: "col-span-1 md:col-span-2 lg:col-span-6 xl:col-span-12"
  }[gridSpan] : ""

  return (
    <div className={cn(spanClasses, className)}>
      {children}
    </div>
  )
}