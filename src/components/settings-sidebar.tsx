"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { useSettingsNavigationStore, type SettingsSection } from "@/stores/settings-navigation-store"
import { User, Users, CreditCard, Plug, ChevronRight, Shield } from "lucide-react"

interface NavigationItem {
  id: SettingsSection
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  badge?: string
  features: string[]
}

const navigationItems: NavigationItem[] = [
  {
    id: "account",
    label: "Account & Preferences",
    icon: User,
    description: "Profile, notifications, and appearance",
    features: ["Profile Information", "Notification Settings", "Theme & Appearance"],
  },
  {
    id: "team",
    label: "Teams & Workspaces",
    icon: Users,
    description: "Manage teams, members, and workspaces",
    badge: "3",
    features: ["Team Management", "Member Roles", "Workspace Organization"],
  },
  {
    id: "billing",
    label: "Billing",
    icon: CreditCard,
    description: "Subscription and payment methods",
    badge: "Pro",
    features: ["Subscription Plans", "Payment Methods", "Invoices"],
  },
  {
    id: "security",
    label: "Security",
    icon: Shield,
    description: "Password and authentication",
    features: ["Password", "Two-Factor Auth", "Active Sessions"],
  },
  {
    id: "integrations",
    label: "Integrations & API",
    icon: Plug,
    description: "Connected apps, services, and API access",
    features: ["Third-party Apps", "API Keys", "Webhooks"],
  },
]

export function SettingsSidebar() {
  const { activeSection, setActiveSection } = useSettingsNavigationStore()

  return (
    <div className="w-72 bg-card border-r border-border p-4">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
      </div>

      <nav className="space-y-3">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id

          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={cn(
                "w-full flex items-start justify-between p-5 rounded-lg text-left transition-colors group",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              <div className="flex items-start space-x-3 min-w-0">
                <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{item.label}</div>
                  <div
                    className={cn(
                      "text-xs truncate mb-2",
                      isActive ? "text-primary-foreground/80" : "text-muted-foreground",
                    )}
                  >
                    {item.description}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {item.features.map((feature, index) => (
                      <div
                        key={index}
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full",
                          isActive
                            ? "bg-primary-foreground/20 text-primary-foreground"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 flex-shrink-0">
                {item.badge && (
                  <span
                    className={cn(
                      "px-2 py-0.5 text-xs rounded-full",
                      isActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/10 text-primary",
                    )}
                  >
                    {item.badge}
                  </span>
                )}
                <ChevronRight
                  className={cn("h-3 w-3 transition-transform", isActive ? "rotate-90" : "group-hover:translate-x-0.5")}
                />
              </div>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
