'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  Home, 
  Target, 
  Gamepad2, 
  BookOpen, 
  Users, 
  CheckSquare, 
  GraduationCap, 
  MessageSquare,
  BarChart3,
  FileText,
  Presentation,
  User
} from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: 'learner' | 'admin' | 'executive'
}

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  description?: string
}

const navItems: Record<string, NavItem[]> = {
  learner: [
    { 
      label: 'My Progress', 
      href: '/me', 
      icon: <Home className="h-5 w-5" />,
      description: 'Track your learning journey'
    },
    { 
      label: 'Goals', 
      href: '/me/goals', 
      icon: <Target className="h-5 w-5" />,
      description: 'Set and manage your objectives'
    },
    { 
      label: 'Games', 
      href: '/me/games', 
      icon: <Gamepad2 className="h-5 w-5" />,
      description: 'View your game statistics'
    },
    { 
      label: 'Learn', 
      href: '/me/learn', 
      icon: <BookOpen className="h-5 w-5" />,
      description: 'Access learning modules'
    },
  ],
  admin: [
    { 
      label: 'Team Overview', 
      href: '/team', 
      icon: <Users className="h-5 w-5" />,
      description: 'Manage your team members'
    },
    { 
      label: 'Intervention Tasks', 
      href: '/team/tasks', 
      icon: <CheckSquare className="h-5 w-5" />,
      description: 'Plan and track interventions'
    },
    { 
      label: 'Curriculum', 
      href: '/team/courses', 
      icon: <GraduationCap className="h-5 w-5" />,
      description: 'Manage courses and content'
    },
    { 
      label: 'Messages', 
      href: '/team/messages', 
      icon: <MessageSquare className="h-5 w-5" />,
      description: 'Communication center'
    },
  ],
  executive: [
    { 
      label: 'Executive Dashboard', 
      href: '/org', 
      icon: <BarChart3 className="h-5 w-5" />,
      description: 'Organization-wide metrics'
    },
    { 
      label: 'Analytics Reports', 
      href: '/org/reports', 
      icon: <FileText className="h-5 w-5" />,
      description: 'Detailed performance reports'
    },
    { 
      label: 'Presentation Mode', 
      href: '/org/present', 
      icon: <Presentation className="h-5 w-5" />,
      description: 'Present key metrics'
    },
  ],
}

const roleLabels = {
  learner: 'Learner Dashboard',
  admin: 'Team Management',
  executive: 'Executive Overview'
}

export function DashboardSidebar({ 
  user, 
  className 
}: { 
  user: User
  className?: string 
}) {
  const pathname = usePathname()
  const items = navItems[user.role] || []
  
  return (
    <div className={cn("w-64 border-r bg-muted/10 flex flex-col", className)}>
      {/* User info section */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
        <div className="mt-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
            {roleLabels[user.role]}
          </span>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-start gap-3 rounded-lg px-3 py-3 text-sm transition-all hover:bg-muted",
                pathname.startsWith(item.href)
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="mt-0.5">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium">{item.label}</div>
                {item.description && (
                  <div className={cn(
                    "text-xs mt-0.5",
                    pathname.startsWith(item.href)
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground"
                  )}>
                    {item.description}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </nav>
      
      {/* Footer */}
      <div className="p-4 border-t">
        <div className="text-xs text-muted-foreground text-center">
          SenseiiWyze v2.0
        </div>
      </div>
    </div>
  )
}
