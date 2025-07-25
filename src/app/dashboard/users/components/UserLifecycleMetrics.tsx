"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Users, UserPlus, UserMinus, Clock } from "lucide-react"

interface LifecycleMetrics {
  totalUsers: number
  newUsers: number
  churnedUsers: number
  retentionRate: number
  averageLifespan: number
  churnPrediction: number
  cohortRetention: {
    week1: number
    week2: number
    week3: number
    week4: number
  }
}

interface UserLifecycleMetricsProps {
  metrics: LifecycleMetrics
  className?: string
}

export function UserLifecycleMetrics({ metrics, className = "" }: UserLifecycleMetricsProps) {
  const getTrendIcon = (value: number) => {
    return value > 0 ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    )
  }

  const getRetentionColor = (rate: number) => {
    if (rate >= 80) return "text-green-600"
    if (rate >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {/* Total Users */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalUsers.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            +{metrics.newUsers} this month
          </p>
        </CardContent>
      </Card>

      {/* New Users */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">New Users</CardTitle>
          <UserPlus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.newUsers}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            {getTrendIcon(12)}
            <span className="ml-1">+12% from last month</span>
          </div>
        </CardContent>
      </Card>

      {/* Churned Users */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Churned Users</CardTitle>
          <UserMinus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.churnedUsers}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            {getTrendIcon(-5)}
            <span className="ml-1">-5% from last month</span>
          </div>
        </CardContent>
      </Card>

      {/* Retention Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getRetentionColor(metrics.retentionRate)}`}>
            {metrics.retentionRate}%
          </div>
          <Progress value={metrics.retentionRate} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-1">
            Target: 85%
          </p>
        </CardContent>
      </Card>

      {/* Cohort Retention */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Cohort Retention</CardTitle>
          <CardDescription>
            User retention by signup cohort
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {metrics.cohortRetention.week1}%
              </div>
              <div className="text-xs text-muted-foreground">Week 1</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {metrics.cohortRetention.week2}%
              </div>
              <div className="text-xs text-muted-foreground">Week 2</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {metrics.cohortRetention.week3}%
              </div>
              <div className="text-xs text-muted-foreground">Week 3</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {metrics.cohortRetention.week4}%
              </div>
              <div className="text-xs text-muted-foreground">Week 4</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Churn Prediction */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Churn Prediction</CardTitle>
          <CardDescription>
            Predicted churn rate for next 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold text-red-600">
              {metrics.churnPrediction}%
            </div>
            <Badge variant="destructive">
              High Risk
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Based on user behavior patterns and engagement metrics
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 