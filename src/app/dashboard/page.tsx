'use client'

import { GlobalNavigation } from '@/components/layout/GlobalNavigation'
import { useSession } from '@/lib/auth-client'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface User {
  role: 'learner' | 'admin' | 'executive' | 'ceo' | 'worker' | 'frontliner'
  name: string
  email: string
}

export default function DashboardPage() {
  const { data: session, isPending } = useSession()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (session?.user) {
      setUser({
        role: (session.user.role as User['role']) || 'learner',
        name: session.user.name,
        email: session.user.email
      })
    }
  }, [session])

  if (isPending) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex">
          {/* Sidebar skeleton */}
          <div className="w-64 border-r bg-card">
            <div className="p-6 border-b">
              <Skeleton className="h-8 w-32 mb-4" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="p-4 space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </div>
          
          {/* Main content skeleton */}
          <div className="flex-1 p-8">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to access the dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              You need to be authenticated to view this page. Please log in and try again.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar Navigation */}
        <GlobalNavigation user={user} variant="sidebar" />
        
        {/* Main Content */}
        <div className="flex-1">
          <main className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Welcome back, {user.name}
              </h1>
              <p className="text-muted-foreground mt-2">
                Here's your dashboard overview
              </p>
            </div>

            {/* Placeholder Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Dashboard content will be implemented based on your role: {user.role}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest interactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Activity feed coming soon...
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                  <CardDescription>Manage your preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Click the Settings link in the navigation to configure your account.
                  </p>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}