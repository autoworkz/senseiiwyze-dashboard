'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Home, Target, Gamepad2, BookOpen, Users, BarChart3, Building2 } from 'lucide-react'

interface User {
  role: 'learner' | 'admin' | 'executive'
  name: string
}

interface DashboardNavProps {
  user: User
  variant?: 'desktop' | 'mobile'
}

const navigationItems = {
  learner: [
    { href: '/me', label: 'My Progress', icon: Home },
    { href: '/me/goals', label: 'Goals', icon: Target },
    { href: '/me/games', label: 'Games', icon: Gamepad2 },
    { href: '/me/learn', label: 'Learn', icon: BookOpen },
  ],
  admin: [
    { href: '/team', label: 'Team Overview', icon: Users },
    { href: '/team/tasks', label: 'Tasks', icon: Target },
    { href: '/team/courses', label: 'Courses', icon: BookOpen },
    { href: '/team/messages', label: 'Messages', icon: BarChart3 },
  ],
  executive: [
    { href: '/org', label: 'Dashboard', icon: BarChart3 },
    { href: '/org/reports', label: 'Reports', icon: Building2 },
    { href: '/org/presentation', label: 'Presentation', icon: Target },
  ],
}

export function DashboardNav({ user, variant = 'desktop' }: DashboardNavProps) {
  const pathname = usePathname()
  const items = navigationItems[user.role] || []

  if (variant === 'mobile') {
    return (
      <nav className="flex justify-around py-2">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 text-xs",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    )
  }

  return (
    <nav className="flex items-center gap-6">
      {items.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-colors",
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

