'use client'

import { useSession } from '@/lib/auth-client'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Users, UserPlus, Search, Filter, MoreHorizontal, UserCheck, AlertTriangle, Eye } from 'lucide-react'
import Link from 'next/link'

interface User {
  id: string
  role: 'learner' | 'admin' | 'executive' | 'ceo' | 'worker' | 'frontliner'
  name: string
  email: string
  status: 'active' | 'inactive' | 'pending'
  readinessScore: number
  lastActive: string
  avatar?: string
}

interface CurrentUser {
  role: 'learner' | 'admin' | 'executive' | 'ceo' | 'worker' | 'frontliner'
  name: string
  email: string
}

// Mock users data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@company.com',
    role: 'admin',
    status: 'active',
    readinessScore: 92,
    lastActive: '2 hours ago'
  },
  {
    id: '2',
    name: 'Marcus Thompson',
    email: 'marcus.thompson@company.com',
    role: 'learner',
    status: 'active',
    readinessScore: 78,
    lastActive: '1 day ago'
  },
  {
    id: '3',
    name: 'Lisa Rodriguez',
    email: 'lisa.rodriguez@company.com',
    role: 'executive',
    status: 'active',
    readinessScore: 85,
    lastActive: '3 hours ago'
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.kim@company.com',
    role: 'worker',
    status: 'inactive',
    readinessScore: 45,
    lastActive: '1 week ago'
  },
  {
    id: '5',
    name: 'Emily Johnson',
    email: 'emily.johnson@company.com',
    role: 'learner',
    status: 'pending',
    readinessScore: 0,
    lastActive: 'Never'
  },
  {
    id: '6',
    name: 'Alex Rivera',
    email: 'alex.rivera@company.com',
    role: 'frontliner',
    status: 'active',
    readinessScore: 67,
    lastActive: '5 minutes ago'
  }
]

export default function UsersPage() {
  const { data: session, isPending } = useSession()
  const [user, setUser] = useState<CurrentUser | null>(null)
  const [users] = useState<User[]>(mockUsers)
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState('')

  // Helper function to get user initials
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  // Filter users based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredUsers(users)
    } else {
      const filtered = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredUsers(filtered)
    }
  }, [searchTerm, users])

  // Get status badge variant
  const getStatusBadge = (status: User['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Active</Badge>
      case 'inactive':
        return <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Inactive</Badge>
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Pending</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  // Get readiness score badge
  const getReadinessBadge = (score: number) => {
    if (score >= 80) {
      return <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">{score}%</Badge>
    } else if (score >= 60) {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">{score}%</Badge>
    } else {
      return <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">{score}%</Badge>
    }
  }

  // Calculate stats
  const totalUsers = users.length
  const activeUsers = users.filter(u => u.status === 'active').length
  const atRiskUsers = users.filter(u => u.readinessScore < 60 && u.status !== 'pending').length
  const avgCompletionRate = Math.round(users.reduce((acc, u) => acc + u.readinessScore, 0) / users.length)

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
                  <div className="text-2xl font-bold">{totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    All registered users
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    Currently active
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">At-Risk Users</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{atRiskUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    Readiness score &lt; 60%
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Readiness</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{avgCompletionRate}%</div>
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
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
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

                  {/* User Rows */}
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="grid grid-cols-12 gap-4 py-3 border-b border-dashed hover:bg-muted/50 transition-colors">
                      <div className="col-span-3 flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">{user.name}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                      <div className="col-span-2 flex items-center">
                        <Badge variant="outline" className="capitalize">{user.role}</Badge>
                      </div>
                      <div className="col-span-2 flex items-center">
                        {getStatusBadge(user.status)}
                      </div>
                      <div className="col-span-2 flex items-center">
                        {getReadinessBadge(user.readinessScore)}
                      </div>
                      <div className="col-span-2 flex items-center">
                        <span className="text-sm text-muted-foreground">{user.lastActive}</span>
                      </div>
                      <div className="col-span-1 flex items-center gap-1">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/app/users/${user.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {/* No users found */}
                  {filteredUsers.length === 0 && (
                    <div className="py-8 text-center">
                      <p className="text-sm text-muted-foreground">No users found matching your search.</p>
                    </div>
                  )}
                </div>

                {/* Table Footer */}
                <div className="mt-6 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Showing {filteredUsers.length} of {totalUsers} users
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Invite New Users
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link href="/app/analytics">
                          View Analytics
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
  )
}