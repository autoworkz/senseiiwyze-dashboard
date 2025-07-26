'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Home, Target, CheckCircle, BookOpen, Users, BarChart3, Building2, MessageSquare, Settings, Gamepad2 } from 'lucide-react'

interface User {
  role: 'learner' | 'admin' | 'executive'
  name: string
}

interface DashboardSidebarProps {
  user: User
  className?: string
}

const sidebarItems = {
  learner: [
    { 
      href: '/me', 
      label: 'Overview', 
      icon: Home,
      description: 'Your learning dashboard'
    },
    { 
      href: '/me/goals', 
      label: 'Goals', 
      icon: Target,
      description: 'Track your objectives'
    },
    { 
      href: '/me/games', 
      label: 'Games', 
      icon: Gamepad2,
      description: 'Learning through play'
    },
    { 
      href: '/me/learn', 
      label: 'Learn', 
      icon: BookOpen,
      description: 'Access courses'
    },
  ],
  admin: [
    { 
      href: '/team', 
      label: 'Team Overview', 
      icon: Users,
      description: 'Manage your learners'
    },
    { 
      href: '/team/tasks', 
      label: 'Intervention Tasks', 
      icon: CheckCircle,
      description: 'Support interventions'
    },
    { 
      href: '/team/courses', 
      label: 'Curriculum', 
      icon: BookOpen,
      description: 'Manage courses and content'
    },
    { 
      href: '/team/messages', 
      label: 'Messages', 
      icon: MessageSquare,
      description: 'Communication center'
    },
  ],
  executive: [
    { 
      href: '/org', 
      label: 'Executive Overview', 
      icon: BarChart3,
      description: 'High-level insights'
    },
    { 
      href: '/org/reports', 
      label: 'Analytics Reports', 
      icon: Building2,
      description: 'Performance analysis'
    },
    { 
      href: '/org/presentation', 
      label: 'Presentation Mode', 
      icon: Target,
      description: 'Executive presentations'
    },
  ],
}

export function DashboardSidebar({ user, className }: DashboardSidebarProps) {
  const pathname = usePathname()
  const items = sidebarItems[user.role] || []

  return (
    <div className={cn("flex flex-col w-64 border-r bg-card", className)}>
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">S</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">SenseiiWyze</h2>
            <p className="text-xs text-muted-foreground capitalize">{user.role} Dashboard</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (pathname?.startsWith(item.href + '/') ?? false)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 group",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn(
                "h-4 w-4 shrink-0 transition-colors",
                isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
              )} />
              <div className="flex-1 min-w-0">
                <div className={cn(
                  "font-medium truncate",
                  isActive ? "text-primary-foreground" : "text-foreground"
                )}>
                  {item.label}
                </div>
                <div className={cn(
                  "text-xs truncate mt-0.5",
                  isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                )}>
                  {item.description}
                </div>
              </div>
            </Link>
          )
        })}
      </nav>
      
      {/* Footer */}
      <div className="p-4 border-t">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200",
            pathname === '/settings'
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
          )}
        >
          <Settings className="h-4 w-4 shrink-0" />
          <span className="font-medium">Settings</span>
        </Link>
      </div>
    </div>
  )
}

