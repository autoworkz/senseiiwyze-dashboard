'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Users, DollarSign, AlertTriangle, Target } from 'lucide-react'

interface KPIData {
  completionRate: {
    value: number
    trend: number
    period: string
    history: number[]
  }
  costPerCompletion: {
    value: number
    trend: number
    period: string
    history: number[]
  }
  atRiskCount: {
    value: number
    trend: number
    period: string
    alert: boolean
  }
  readinessIndex: {
    value: number
    formula: string
    zones: Array<{
      min: number
      max: number
      color: string
      label: string
    }>
  }
  totalLearners: number
  activeLearners: number
  programsRunning: number
  averageTimeToComplete: number
}

interface KPIGridProps {
  kpis: KPIData
}

export function KPIGrid({ kpis }: KPIGridProps) {
  const getTrendIcon = (trend: number) => {
    return trend > 0 ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    )
  }

  const getTrendColor = (trend: number) => {
    return trend > 0 ? 'text-green-600' : 'text-red-600'
  }

  const getReadinessZone = (value: number) => {
    const zone = kpis.readinessIndex.zones.find(z => value >= z.min && value <= z.max)
    return zone || kpis.readinessIndex.zones[0]
  }

  const readinessZone = getReadinessZone(kpis.readinessIndex.value)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Completion Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{kpis.completionRate.value}%</div>
          <div className="flex items-center gap-1 text-xs">
            {getTrendIcon(kpis.completionRate.trend)}
            <span className={getTrendColor(kpis.completionRate.trend)}>
              {Math.abs(kpis.completionRate.trend)}% {kpis.completionRate.period}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Cost per Completion */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cost per Completion</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${kpis.costPerCompletion.value}</div>
          <div className="flex items-center gap-1 text-xs">
            {getTrendIcon(kpis.costPerCompletion.trend)}
            <span className={getTrendColor(kpis.costPerCompletion.trend)}>
              {Math.abs(kpis.costPerCompletion.trend)}% {kpis.costPerCompletion.period}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* At Risk Learners */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">At Risk Learners</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">{kpis.atRiskCount.value}</div>
            {kpis.atRiskCount.alert && (
              <Badge variant="destructive" className="text-xs">Alert</Badge>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs">
            {getTrendIcon(kpis.atRiskCount.trend)}
            <span className={getTrendColor(kpis.atRiskCount.trend)}>
              {Math.abs(kpis.atRiskCount.trend)} {kpis.atRiskCount.period}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Readiness Index */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Readiness Index</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">{kpis.readinessIndex.value}</div>
            <Badge 
              className={`text-xs ${
                readinessZone.color === 'green' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                  : readinessZone.color === 'amber'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
              }`}
            >
              {readinessZone.label}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1" title={kpis.readinessIndex.formula}>
            Organizational readiness score
          </p>
        </CardContent>
      </Card>

      {/* Additional Metrics Row */}
      <Card className="md:col-span-2 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Program Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold">{kpis.totalLearners.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Total Learners</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">{kpis.activeLearners.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Active Learners</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Program Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold">{kpis.programsRunning}</div>
              <div className="text-xs text-muted-foreground">Programs Running</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">{kpis.averageTimeToComplete} weeks</div>
              <div className="text-xs text-muted-foreground">Avg. Completion Time</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

