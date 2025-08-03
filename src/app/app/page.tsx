import { BarChart3, Settings, TrendingUp, UserCheck, Users } from 'lucide-react'
import { headers } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import {
  InteractiveButton,
  InteractiveCard,
  InteractiveCardContent,
  InteractiveCardHeader,
  InteractiveCardTitle,
} from '@/components/interactive'
import { StandardizedInteractiveCard } from '@/components/interactive/standardized-interactive'
import { PageContainer, PageHeader } from '@/components/layout/PageContainer'
import { CardSkeleton } from '@/components/loading/loading-skeletons'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { auth } from '@/lib/auth'

interface User {
  role: 'learner' | 'admin' | 'executive' | 'ceo' | 'worker' | 'frontliner'
  name: string
  email: string
}

// Quick actions component that can be loaded independently
async function QuickActions() {
  // Simulate async data fetching that might be slow
  await new Promise((resolve) => setTimeout(resolve, 100))

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <StandardizedInteractiveCard minHeight="md" effect="lift" clickable>
        <InteractiveCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <InteractiveCardTitle className="text-sm font-medium">Analytics</InteractiveCardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </InteractiveCardHeader>
        <InteractiveCardContent className="flex-1 flex flex-col justify-center">
          <div className="text-2xl font-bold">Coming Soon</div>
          <p className="text-xs text-muted-foreground">Skill analytics and readiness tracking</p>
          <InteractiveButton asChild size="sm" className="mt-3" variant="outline" effect="scale">
            <Link href="/app/analytics">View Analytics</Link>
          </InteractiveButton>
        </InteractiveCardContent>
      </StandardizedInteractiveCard>

      <StandardizedInteractiveCard minHeight="md" effect="lift" clickable>
        <InteractiveCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <InteractiveCardTitle className="text-sm font-medium">
            User Management
          </InteractiveCardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </InteractiveCardHeader>
        <InteractiveCardContent className="flex-1 flex flex-col justify-center">
          <div className="text-2xl font-bold">Coming Soon</div>
          <p className="text-xs text-muted-foreground">Manage users and team members</p>
          <InteractiveButton asChild size="sm" className="mt-3" variant="outline" effect="scale">
            <Link href="/app/users">Manage Users</Link>
          </InteractiveButton>
        </InteractiveCardContent>
      </StandardizedInteractiveCard>
    </div>
  )
}

// Recent activity component
async function RecentActivity({ user }: { user: User }) {
  // Simulate async data fetching
  await new Promise((resolve) => setTimeout(resolve, 200))

  return (
    <StandardizedInteractiveCard effect="lift" minHeight="md">
      <InteractiveCardHeader>
        <InteractiveCardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Recent Activity
        </InteractiveCardTitle>
        <CardDescription>Your latest interactions</CardDescription>
      </InteractiveCardHeader>
      <InteractiveCardContent className="flex-1 flex flex-col justify-center">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <UserCheck className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Activity feed will appear here</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Role-specific content for: <span className="font-medium">{user.role}</span>
          </div>
        </div>
      </InteractiveCardContent>
    </StandardizedInteractiveCard>
  )
}

export default async function DashboardPage() {
  // Server-side session retrieval
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    redirect('/auth/login')
  }

  // Transform session data server-side - keeping your exact user interface
  const user: User = {
    role: (session.user.role as User['role']) || 'learner',
    name: session.user.name || 'User',
    email: session.user.email || '',
  }

  // Your exact UI layout preserved - now rendered server-side with standardized container
  return (
    <PageContainer className="space-y-8">
      <PageHeader
        title={`Welcome back, ${user.name}`}
        description="Here's your dashboard overview"
      />

      {/* Quick Actions Grid with Suspense */}
      <Suspense
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        }
      >
        <QuickActions />
      </Suspense>

      {/* Recent Activity & Settings Row with Suspense */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<CardSkeleton />}>
          <RecentActivity user={user} />
        </Suspense>

        <StandardizedInteractiveCard effect="lift" minHeight="md">
          <InteractiveCardHeader>
            <InteractiveCardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Quick Settings
            </InteractiveCardTitle>
            <CardDescription>Manage your preferences</CardDescription>
          </InteractiveCardHeader>
          <InteractiveCardContent className="flex-1 flex flex-col justify-center">
            <div className="space-y-3">
              <InteractiveButton
                asChild
                variant="outline"
                size="sm"
                className="w-full justify-start"
                effect="scale"
              >
                <Link href="/app/settings?tab=profile">Edit Profile</Link>
              </InteractiveButton>
              <InteractiveButton
                asChild
                variant="outline"
                size="sm"
                className="w-full justify-start"
                effect="scale"
              >
                <Link href="/app/settings">Account Settings</Link>
              </InteractiveButton>
            </div>
          </InteractiveCardContent>
        </StandardizedInteractiveCard>
      </div>
    </PageContainer>
  )
}
