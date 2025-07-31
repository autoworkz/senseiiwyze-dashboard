'use client'

import { GlobalNavigation } from '@/components/layout/GlobalNavigation'
import { useSession } from '@/lib/auth-client'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Users, UserPlus, Search, Filter, MoreHorizontal, UserCheck, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

interface User {
  role: 'learner' | 'admin' | 'executive' | 'ceo' | 'worker' | 'frontliner'
  name: string
  email: string
}

export default function UsersPage() {
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
          <div className="flex-1 p-8">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
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
            <CardDescription>Please log in to access user management.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              You need to be authenticated to view this page.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <GlobalNavigation user={user} variant="sidebar" />
        
        <div className="flex-1">
          <main className="p-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    User Management
                  </h1>
                  <p className="text-muted-foreground mt-2">
                    Manage team members, roles, and user profiles
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button size="sm">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite User
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">--</div>
                  <p className="text-xs text-muted-foreground">
                    Loading user count...
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">--</div>
                  <p className="text-xs text-muted-foreground">
                    Last 30 days
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">At-Risk Users</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">--</div>
                  <p className="text-xs text-muted-foreground">
                    Require attention
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">--</div>
                  <p className="text-xs text-muted-foreground">
                    Average across all users
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filter Bar */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users by name, email, or role..."
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Advanced Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Users Table Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>User Directory</CardTitle>
                <CardDescription>Complete list of team members and their profiles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-4 pb-2 border-b text-sm font-medium text-muted-foreground">
                    <div className="col-span-3">User</div>
                    <div className="col-span-2">Role</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Readiness</div>
                    <div className="col-span-2">Last Active</div>
                    <div className="col-span-1">Actions</div>
                  </div>

                  {/* Placeholder Rows */}
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="grid grid-cols-12 gap-4 py-3 border-b border-dashed">
                      <div className="col-span-3 flex items-center gap-3">
                        <div className="h-8 w-8 bg-muted rounded-full"></div>
                        <div>
                          <div className="text-sm text-muted-foreground">User data loading...</div>
                          <div className="text-xs text-muted-foreground">Email placeholder</div>
                        </div>
                      </div>
                      <div className="col-span-2 flex items-center">
                        <span className="text-sm text-muted-foreground">Role loading...</span>
                      </div>
                      <div className="col-span-2 flex items-center">
                        <span className="text-sm text-muted-foreground">Status pending...</span>
                      </div>
                      <div className="col-span-2 flex items-center">
                        <span className="text-sm text-muted-foreground">Score calculating...</span>
                      </div>
                      <div className="col-span-2 flex items-center">
                        <span className="text-sm text-muted-foreground">Activity tracking...</span>
                      </div>
                      <div className="col-span-1 flex items-center">
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Table Footer */}
                <div className="mt-6 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      User table will populate with real data
                    </p>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href="/dashboard/users/invite">
                          Invite New Users
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link href="/dashboard/analytics">
                          View Analytics
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  )
}