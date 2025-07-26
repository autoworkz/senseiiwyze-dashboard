"use client"

import { ReactNode } from "react"
import { ChevronRight, Download, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

interface ActionButton {
  type: "button"
  variant?: "primary" | "secondary" | "outline"
  label: string
  icon?: string
  onClick?: () => void
}

interface DashboardHeaderProps {
  title: string
  subtitle?: string
  breadcrumb?: BreadcrumbItem[]
  actions?: ActionButton[]
  className?: string
  children?: ReactNode
}

const iconMap = {
  download: Download,
  edit: Edit,
}

export function DashboardHeader({
  title,
  subtitle,
  breadcrumb = [],
  actions = [],
  className,
  children
}: DashboardHeaderProps) {
  return (
    <GlassCard variant="subtle" className={cn("border-0 shadow-sm", className)}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-6">
        <div className="space-y-2">
          {/* Breadcrumb */}
          {breadcrumb.length > 0 && (
            <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
              {breadcrumb.map((item, index) => (
                <div key={index} className="flex items-center">
                  {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
                  {item.current ? (
                    <span className="font-medium text-foreground">{item.label}</span>
                  ) : (
                    <a 
                      href={item.href} 
                      className="hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </a>
                  )}
                </div>
              ))}
            </nav>
          )}
          
          {/* Title and Subtitle */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            {subtitle && (
              <p className="text-muted-foreground mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon && iconMap[action.icon as keyof typeof iconMap]
            
            return (
              <Button
                key={index}
                variant={action.variant === "primary" ? "default" : 
                        action.variant === "secondary" ? "secondary" : "outline"}
                onClick={action.onClick}
                className="glass-hover"
              >
                {Icon && <Icon className="h-4 w-4 mr-2" />}
                {action.label}
              </Button>
            )
          })}
          {children}
        </div>
      </div>
    </GlassCard>
  )
}