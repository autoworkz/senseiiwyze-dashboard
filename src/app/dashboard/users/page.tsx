"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart, Users, Activity, TrendingUp, List, Search, Settings, UserPlus } from "lucide-react"
import Link from "next/link"

export default function UserDashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newUsers: 0,
    userGrowth: 0,
    programReadiness: 0
  })

  useEffect(() => {
    // Simulate loading user data
    setTimeout(() => {
      setUserData({
        totalUsers: 12847,
        activeUsers: 3421,
        newUsers: 542,
        userGrowth: 12.5,
        programReadiness: 78
      })
      setIsLoading(false)
    }, 1000)
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="space-y-0 pb-2">
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-24 mb-2" />
                <Skeleton className="h-3 w-40" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">User Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive view of user metrics and program readiness data
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-4">
          <Link href="/dashboard/users/list">
            <Button className="flex items-center gap-2">
              <List className="h-4 w-4" />
              View All Users
            </Button>
          </Link>
          <Link href="/dashboard/users/analytics">
            <Button variant="outline" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              User Analytics
            </Button>
          </Link>
          <Button variant="outline" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Add New User
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.location.href = '/dashboard/users/list'}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userData.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{userData.userGrowth}% from last month
            </p>
            <p className="text-xs text-blue-600 mt-2">Click to view all users →</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.location.href = '/dashboard/users/list?status=active'}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userData.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {((userData.activeUsers / userData.totalUsers) * 100).toFixed(1)}% of total
            </p>
            <p className="text-xs text-blue-600 mt-2">Click to view active users →</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.location.href = '/dashboard/users/list?status=new'}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Users</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{userData.newUsers}</div>
            <p className="text-xs text-muted-foreground">
              This week
            </p>
            <p className="text-xs text-blue-600 mt-2">Click to view new users →</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.location.href = '/dashboard/users/analytics'}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Program Readiness</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userData.programReadiness}%</div>
            <p className="text-xs text-muted-foreground">
              Average readiness score
            </p>
            <p className="text-xs text-blue-600 mt-2">Click to view analytics →</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 mt-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Activity Trends</CardTitle>
            <CardDescription>
              Daily active users over the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed">
              <div className="flex flex-col items-center gap-2 text-center">
                <Activity className="h-8 w-8 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Activity Chart</h3>
                <p className="text-sm text-muted-foreground">
                  User activity visualization would appear here
                </p>
                <Link href="/dashboard/users/analytics">
                  <Button variant="outline" size="sm" className="mt-2">
                    View Analytics
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Program Readiness Distribution</CardTitle>
            <CardDescription>
              User distribution by readiness level
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed">
              <div className="flex flex-col items-center gap-2 text-center">
                <BarChart className="h-8 w-8 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Readiness Distribution</h3>
                <p className="text-sm text-muted-foreground">
                  Program readiness chart would appear here
                </p>
                <Link href="/dashboard/users/analytics">
                  <Button variant="outline" size="sm" className="mt-2">
                    View Analytics
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}