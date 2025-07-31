'use client'

import { GlobalNavigation } from '@/components/layout/GlobalNavigation'
import { useSession } from '@/lib/auth-client'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell, AlertTriangle, CheckCircle, Info, Settings, Mail } from 'lucide-react'
import Link from 'next/link'

interface User {
  role: 'learner' | 'admin' | 'executive' | 'ceo' | 'worker' | 'frontliner'
  name: string
  email: string
}

interface Notification {
  id: string
  type: 'critical' | 'warning' | 'info' | 'success'
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
}

export default function NotificationsPage() {
  const { data: session, isPending } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    if (session?.user) {
      setUser({
        role: (session.user.role as User['role']) || 'learner',
        name: session.user.name,
        email: session.user.email
      })
    }
  }, [session])

  // Mock notifications data
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'critical',
        title: '15 Learners At-Risk',
        message: 'Multiple learners have Readiness Index scores below 40. Immediate intervention recommended.',
        timestamp: '2 hours ago',
        read: false,
        actionUrl: '/dashboard/analytics'
      },
      {
        id: '2',
        type: 'warning',
        title: 'Training Completion Rate Declining',
        message: 'JavaScript Fundamentals program completion rate dropped to 68% this week.',
        timestamp: '4 hours ago',
        read: false,
        actionUrl: '/dashboard/analytics'
      },
      {
        id: '3',
        type: 'success',
        title: 'Certification Milestone Reached',
        message: 'Congratulations! The React Development track achieved 85% pass rate this month.',
        timestamp: '1 day ago',
        read: true
      },
      {
        id: '4',
        type: 'info',
        title: 'Weekly Analytics Report Ready',
        message: 'Your weekly skill analytics report is ready for review.',
        timestamp: '3 days ago',
        read: true,
        actionUrl: '/dashboard/analytics'
      }
    ]
    setNotifications(mockNotifications)
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length
  const criticalCount = notifications.filter(n => n.type === 'critical').length
  const systemUpdatesCount = notifications.filter(n => n.type === 'info').length
  const completedActionsCount = notifications.filter(n => n.read && n.type === 'success').length

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
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
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
            <CardDescription>Please log in to access notifications.</CardDescription>
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
                    Notifications
                  </h1>
                  <p className="text-muted-foreground mt-2">
                    Stay updated with system alerts and important updates
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Mark All Read
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/notifications/settings">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Notifications</CardTitle>
                  <Bell className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{notifications.length}</div>
                  <p className="text-xs text-muted-foreground">
                    All time
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Unread Alerts</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{unreadCount}</div>
                  <p className="text-xs text-muted-foreground">
                    Require attention
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">System Updates</CardTitle>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemUpdatesCount}</div>
                  <p className="text-xs text-muted-foreground">
                    Platform updates
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed Actions</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{completedActionsCount}</div>
                  <p className="text-xs text-muted-foreground">
                    This week
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Notification Categories */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    At-Risk Alerts
                  </CardTitle>
                  <CardDescription>Users requiring immediate attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      No at-risk alerts at this time
                    </div>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link href="/dashboard/analytics">
                        View Analytics
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Intervention Updates
                  </CardTitle>
                  <CardDescription>Progress on coaching interventions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      No intervention updates available
                    </div>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link href="/dashboard/users">
                        Manage Users
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    Platform Updates
                  </CardTitle>
                  <CardDescription>System and feature announcements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      No platform updates to display
                    </div>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link href="/help">
                        View Help Center
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Notification Feed */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Notifications</CardTitle>
                <CardDescription>Your latest alerts and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.length === 0 ? (
                    <div className="text-center py-12">
                      <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No notifications yet</h3>
                      <p className="text-sm text-muted-foreground">
                        You'll see alerts, updates, and important information here as they arrive.
                      </p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div 
                        key={notification.id}
                        className={`p-4 border rounded-lg transition-all hover:shadow-sm ${
                          !notification.read ? 'ring-2 ring-primary/20 bg-primary/5' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            {notification.type === 'critical' && <AlertTriangle className="h-5 w-5 text-destructive" />}
                            {notification.type === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                            {notification.type === 'info' && <Info className="h-5 w-5 text-blue-500" />}
                            {notification.type === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium text-foreground">
                                {notification.title}
                              </h4>
                              <Badge 
                                variant={
                                  notification.type === 'critical' ? 'destructive' :
                                  notification.type === 'warning' ? 'secondary' :
                                  notification.type === 'info' ? 'outline' :
                                  'default'
                                } 
                                className="text-xs"
                              >
                                {notification.type}
                              </Badge>
                              {!notification.read && (
                                <Badge variant="outline" className="text-xs">
                                  New
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                {notification.timestamp}
                              </span>
                              {notification.actionUrl && (
                                <Button asChild variant="outline" size="sm">
                                  <Link href={notification.actionUrl}>
                                    View Details
                                  </Link>
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  )
}