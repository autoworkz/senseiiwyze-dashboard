// ===== FILE STRUCTURE =====
// This represents the complete Next.js App Router structure
// Copy this structure to your project root

/*
app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx
│   └── logout/
│       └── page.tsx
├── (dashboard)/
│   ├── layout.tsx              // Shared dashboard layout
│   ├── me/
│   │   ├── page.tsx           // My Progress (Learner Dashboard)
│   │   ├── goals/
│   │   │   └── page.tsx       // Vision Board
│   │   ├── games/
│   │   │   └── page.tsx       // Game Stats
│   │   └── learn/
│   │       └── page.tsx       // Learning Modules
│   ├── team/
│   │   ├── page.tsx           // Team Dashboard (Admin)
│   │   ├── profile/
│   │   │   └── [id]/
│   │   │       └── page.tsx   // Learner Profile Detail
│   │   ├── tasks/
│   │   │   └── page.tsx       // Intervention Planner
│   │   ├── courses/
│   │   │   └── page.tsx       // Curriculum Manager
│   │   └── messages/
│   │       └── page.tsx       // Messaging Center
│   └── org/
│       ├── page.tsx           // Executive Dashboard
│       ├── present/
│       │   └── page.tsx       // Presentation Mode
│       └── reports/
│           └── page.tsx       // Analytics Reports
├── api/
│   └── mock/
│       ├── kpis/
│       │   └── route.ts
│       ├── learners/
│       │   └── route.ts
│       └── metrics/
│           └── route.ts
├── layout.tsx                 // Root layout
├── page.tsx                   // Landing/redirect
└── globals.css
*/

// ===== app/layout.tsx =====
// Root layout with providers
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Senseii - Tech Skill Coaching Platform',
  description: 'Predict and improve tech training completion rates',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}

// ===== app/page.tsx =====
// Landing page with role-based redirect
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'

export default async function LandingPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }
  
  // Role-based routing
  switch (user.role) {
    case 'learner':
      redirect('/me')
    case 'admin':
      redirect('/team')
    case 'executive':
      redirect('/org')
    default:
      redirect('/login')
  }
}

// ===== app/(dashboard)/layout.tsx =====
// Shared dashboard layout with navigation
import { DashboardNav } from '@/components/layout/DashboardNav'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'
import { UserMenu } from '@/components/layout/UserMenu'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-dark-base">
      {/* Glass morphism background */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
      
      {/* Main layout */}
      <div className="relative z-10 flex h-screen">
        {/* Sidebar - Desktop only */}
        <DashboardSidebar user={user} className="hidden lg:flex" />
        
        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Top navigation */}
          <header className="glass-border sticky top-0 z-50 bg-frost backdrop-blur-lg">
            <div className="flex h-16 items-center justify-between px-4 lg:px-8">
              <DashboardNav user={user} />
              <UserMenu user={user} />
            </div>
          </header>
          
          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-8">
            {children}
          </main>
        </div>
      </div>
      
      {/* Mobile bottom nav */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 glass-border bg-frost backdrop-blur-lg">
        <DashboardNav user={user} variant="mobile" />
      </div>
    </div>
  )
}

// ===== app/(dashboard)/me/page.tsx =====
// My Progress - Learner Dashboard
import { SkillFitCard } from '@/components/me/SkillFitCard'
import { PersonalityRadar } from '@/components/me/PersonalityRadar'
import { ProgressGrid } from '@/components/me/ProgressGrid'
import { CoachingSection } from '@/components/me/CoachingSection'
import { getMyMetrics } from '@/lib/api/metrics'

export default async function MyProgressPage() {
  const metrics = await getMyMetrics()
  
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-semibold text-white">My Progress</h1>
        <p className="text-gray-400 mt-1">Track your journey to tech mastery</p>
      </div>
      
      {/* Hero section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkillFitCard score={metrics.skillFit} trend={metrics.skillFitTrend} />
        <PersonalityRadar data={metrics.personality} />
      </div>
      
      {/* Progress widgets */}
      <ProgressGrid metrics={metrics} />
      
      {/* Coaching cards */}
      <CoachingSection interventions={metrics.interventions} />
    </div>
  )
}

// ===== app/(dashboard)/team/page.tsx =====
// Team Dashboard - Admin View
import { SummaryBar } from '@/components/team/SummaryBar'
import { FilterPanel } from '@/components/team/FilterPanel'
import { LearnerTable } from '@/components/team/LearnerTable'
import { getLearners, getTeamStats } from '@/lib/api/team'

export default async function TeamDashboardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const stats = await getTeamStats()
  const learners = await getLearners(searchParams)
  
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-semibold text-white">Team Overview</h1>
        <p className="text-gray-400 mt-1">Manage and support your learners</p>
      </div>
      
      {/* Summary metrics */}
      <SummaryBar stats={stats} />
      
      {/* Main content with sidebar */}
      <div className="flex gap-6">
        {/* Filter sidebar */}
        <aside className="w-64 shrink-0 hidden xl:block">
          <FilterPanel />
        </aside>
        
        {/* Data table */}
        <div className="flex-1">
          <LearnerTable 
            learners={learners.data} 
            totalCount={learners.total}
            currentPage={learners.page}
          />
        </div>
      </div>
    </div>
  )
}

// ===== app/(dashboard)/org/page.tsx =====
// Executive Dashboard
import { KPIGrid } from '@/components/org/KPIGrid'
import { QuickActions } from '@/components/org/QuickActions'
import { getOrganizationKPIs } from '@/lib/api/organization'

export default async function OrgDashboardPage() {
  const kpis = await getOrganizationKPIs()
  
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-semibold text-white">Organization Overview</h1>
          <p className="text-gray-400 mt-1">Real-time training program metrics</p>
        </div>
        <QuickActions />
      </div>
      
      {/* KPI Grid */}
      <KPIGrid kpis={kpis} />
      
      {/* Auto-refresh indicator */}
      <div className="text-center text-sm text-gray-500">
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
          Live data • Refreshes every 5 minutes
        </span>
      </div>
    </div>
  )
}

// ===== components/layout/DashboardNav.tsx =====
// Navigation component with role-based menu items
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { User } from '@/types'

interface NavItem {
  label: string
  href: string
  icon: string
}

const navItems: Record<string, NavItem[]> = {
  learner: [
    { label: 'My Progress', href: '/me', icon: '📊' },
    { label: 'Goals', href: '/me/goals', icon: '🎯' },
    { label: 'Games', href: '/me/games', icon: '🎮' },
    { label: 'Learn', href: '/me/learn', icon: '📚' },
  ],
  admin: [
    { label: 'Team', href: '/team', icon: '👥' },
    { label: 'Tasks', href: '/team/tasks', icon: '✅' },
    { label: 'Courses', href: '/team/courses', icon: '📖' },
    { label: 'Messages', href: '/team/messages', icon: '💬' },
  ],
  executive: [
    { label: 'Overview', href: '/org', icon: '📈' },
    { label: 'Reports', href: '/org/reports', icon: '📄' },
    { label: 'Present', href: '/org/present', icon: '🎥' },
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
              "flex flex-col items-center gap-1 px-3 py-2 text-xs",
              pathname.startsWith(item.href)
                ? "text-accent"
                : "text-gray-400 hover:text-white"
            )}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    )
  }
  
  return (
    <nav className="flex items-center gap-6">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
            pathname.startsWith(item.href)
              ? "bg-accent text-white"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          )}
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  )
}

// ===== lib/api/mock-data.ts =====
// Centralized mock data service
export const mockData = {
  // Executive KPIs
  kpis: {
    completionRate: {
      value: 87.3,
      trend: 2.1,
      period: 'vs last month',
      history: [82.1, 83.5, 84.2, 85.1, 85.2, 87.3],
    },
    costPerCompletion: {
      value: 284,
      trend: -12,
      period: 'vs last month',
      history: [296, 291, 288, 285, 289, 284],
    },
    atRiskCount: {
      value: 23,
      trend: 5,
      period: 'vs yesterday',
      alert: true,
    },
    readinessIndex: {
      value: 58.4,
      formula: '(completion × active × (1-risk)) / 100',
      zones: [
        { min: 0, max: 40, color: 'red' },
        { min: 40, max: 70, color: 'amber' },
        { min: 70, max: 100, color: 'green' },
      ],
    },
  },
  
  // Team stats
  teamStats: {
    totalLearners: 156,
    averageSkillFit: 73.2,
    atRiskPercentage: 14.7,
    weeklyActive: 68,
  },
  
  // Sample learners
  learners: Array.from({ length: 50 }, (_, i) => ({
    id: `user-${i + 1}`,
    name: `Learner ${i + 1}`,
    email: `learner${i + 1}@example.com`,
    track: ['data_ai', 'cyberops', 'cloud', 'network'][i % 4],
    skillFit: Math.floor(Math.random() * 40) + 60,
    lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    riskStatus: Math.random() > 0.85 ? 'red' : Math.random() > 0.7 ? 'amber' : 'green',
    coach: `Coach ${(i % 5) + 1}`,
  })),
  
  // Learner metrics
  myMetrics: {
    skillFit: 73,
    skillFitTrend: 5,
    visionAlignment: 0.82,
    gameIndex: 0.91,
    gritScore: 7.2,
    personality: {
      openness: 0.7,
      conscientiousness: 0.85,
      extraversion: 0.6,
      agreeableness: 0.75,
      neuroticism: 0.3,
    },
    interventions: [
      {
        id: 'int-1',
        title: 'Complete Module 3 Lab',
        description: 'You\'re 2 days behind schedule on the networking lab',
        priority: 'high',
        action: 'Start Lab',
      },
      {
        id: 'int-2',
        title: 'Join Study Group',
        description: 'Connect with peers working on similar modules',
        priority: 'medium',
        action: 'Find Group',
      },
    ],
  },
}

// ===== lib/api/index.ts =====
// API wrapper functions
import { mockData } from './mock-data'

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function getOrganizationKPIs() {
  await delay(500)
  return mockData.kpis
}

export async function getTeamStats() {
  await delay(300)
  return mockData.teamStats
}

export async function getLearners(params: any) {
  await delay(400)
  
  // Apply filters
  let filtered = [...mockData.learners]
  
  if (params.track) {
    filtered = filtered.filter(l => l.track === params.track)
  }
  
  if (params.risk) {
    filtered = filtered.filter(l => l.riskStatus === params.risk)
  }
  
  return {
    data: filtered.slice(0, 25),
    total: filtered.length,
    page: 1,
  }
}

export async function getMyMetrics() {
  await delay(300)
  return mockData.myMetrics
}

// ===== middleware.ts =====
// Auth middleware for protected routes
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')
  const isAuthPage = request.nextUrl.pathname.startsWith('/login')
  
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}