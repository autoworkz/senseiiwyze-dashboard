'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Home, Target, Gamepad2, BookOpen, Users, BarChart3, Building2, MessageSquare, Settings } from 'lucide-react'

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
      label: 'My Progress', 
      icon: Home,
      description: 'Track your learning journey'
    },
    { 
      href: '/me/goals', 
      label: 'Goals', 
      icon: Target,
      description: 'Set and achieve objectives'
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
      description: 'Access learning modules'
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
      icon: Target,
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
      description: 'High-level KPIs and metrics'
    },
    { 
      href: '/org/reports', 
      label: 'Analytics Reports', 
      icon: Building2,
      description: 'Detailed performance analysis'
    },
    { 
      href: '/org/presentation', 
      label: 'Presentation Mode', 
      icon: Target,
      description: 'Executive presentation tools'
    },
  ],
}

export function DashboardSidebar({ user, className }: DashboardSidebarProps) {
  const pathname = usePathname()
  const items = sidebarItems[user.role] || []

  return (
    <div className={cn("w-64 border-r bg-muted/10 p-6", className)}>
      <div className="mb-8">
        <h2 className="text-lg font-semibold">SenseiiWyze</h2>
        <p className="text-sm text-muted-foreground capitalize">{user.role} Dashboard</p>
      </div>
      
      <nav className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-start gap-3 rounded-lg px-3 py-3 text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              <Icon className="h-5 w-5 mt-0.5 shrink-0" />
              <div>
                <div className="font-medium">{item.label}</div>
                <div className={cn(
                  "text-xs mt-0.5",
                  isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                )}>
                  {item.description}
                </div>
              </div>
            </Link>
          )
        })}
      </nav>
      
      <div className="mt-8 pt-8 border-t">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted transition-colors"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </div>
    </div>
  )
}

