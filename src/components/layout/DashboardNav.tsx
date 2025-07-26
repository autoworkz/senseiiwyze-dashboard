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
  Presentation
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
}

const navItems: Record<string, NavItem[]> = {
  learner: [
    { label: 'My Progress', href: '/me', icon: <Home className="h-4 w-4" /> },
    { label: 'Goals', href: '/me/goals', icon: <Target className="h-4 w-4" /> },
    { label: 'Games', href: '/me/games', icon: <Gamepad2 className="h-4 w-4" /> },
    { label: 'Learn', href: '/me/learn', icon: <BookOpen className="h-4 w-4" /> },
  ],
  admin: [
    { label: 'Team', href: '/team', icon: <Users className="h-4 w-4" /> },
    { label: 'Tasks', href: '/team/tasks', icon: <CheckSquare className="h-4 w-4" /> },
    { label: 'Courses', href: '/team/courses', icon: <GraduationCap className="h-4 w-4" /> },
    { label: 'Messages', href: '/team/messages', icon: <MessageSquare className="h-4 w-4" /> },
  ],
  executive: [
    { label: 'Overview', href: '/org', icon: <BarChart3 className="h-4 w-4" /> },
    { label: 'Reports', href: '/org/reports', icon: <FileText className="h-4 w-4" /> },
    { label: 'Present', href: '/org/present', icon: <Presentation className="h-4 w-4" /> },
  ],
}

export function DashboardNav({ 
  user, 
  variant = 'desktop' 
}: { 
  user: User
  variant?: 'desktop' | 'mobile' 
}) {
  const pathname = usePathname()
  const items = navItems[user.role] || []
  
  if (variant === 'mobile') {
    return (
      <nav className="flex justify-around py-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-2 text-xs transition-colors",
              pathname.startsWith(item.href)
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item.icon}
            <span className="truncate">{item.label}</span>
          </Link>
        ))}
      </nav>
    )
  }
  
  return (
    <nav className="flex items-center gap-6">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <img
            src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg"
            className="h-8 w-8"
            alt="SenseiiWyze Logo"
          />
          <span className="text-lg font-semibold tracking-tight">SenseiiWyze</span>
        </Link>
      </div>
      
      <div className="flex items-center gap-4">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
              pathname.startsWith(item.href)
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
