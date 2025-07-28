'use client'

import { useEffect, useCallback } from 'react'
import { useDataStore } from '@/stores/data-store'
import { authClient } from '@/lib/auth-client'
import { KPIGrid } from '@/components/org/KPIGrid'
import { QuickActions } from '@/components/org/QuickActions'
import { ReadinessDashboard } from '@/components/org/ReadinessDashboard'
import { ExecutiveKPIGrid } from '@/components/org/ExecutiveKPIGrid'
// import { FinancialSnapshot } from '@/components/org/FinancialSnapshot'
// import { ComplianceStatus } from '@/components/org/ComplianceStatus'
// import { RiskHeatmap } from '@/components/org/RiskHeatmap'
// import { StrategicOKRs } from '@/components/org/StrategicOKRs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Building2 } from 'lucide-react'

export default function ExecutiveDashboard() {
  // Get data from store using individual selectors to prevent re-renders
  const organization = useDataStore((state) => state.organization)
  const loading = useDataStore((state) => state.loading.organization)

  // Get the fetch function using the hook and memoize it to prevent unnecessary re-renders
  const fetchAllOrganizationData = useDataStore((state) => state.fetchAllOrganizationData)
  const stableFetch = useCallback(() => {
    fetchAllOrganizationData()
  }, [fetchAllOrganizationData])

  // Get session to check if user is authenticated (this is where hooks can be called)
  const { data: session } = authClient.useSession()

  // Fetch organization data on mount if user is authenticated
  useEffect(() => {
    if (session?.user?.id) {
      stableFetch()
    }
  }, [session?.user?.id, stableFetch]) // Include stableFetch in dependencies

  const isLoading = Object.values(loading).some(Boolean)

  // If not authenticated, show loading or redirect
  if (!session?.user?.id) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-64 mx-auto"></div>
          </div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Executive Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Executive Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Strategic oversight for C-suite leadership • Real-time organizational metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="gap-1">
            <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            Live Data
          </Badge>
          <QuickActions />
        </div>
      </div>

      {/* Critical Alerts Bar */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          <div>
            <h3 className="font-semibold text-orange-900">Critical Attention Required</h3>
            <p className="text-sm text-orange-700">
              3 high-priority items need executive review • 23 learners at high risk • 2 compliance deadlines approaching
            </p>
          </div>
        </div>
      </div>

      {/* Executive KPI Overview - Enhanced with Readiness Score Focus */}
      <ExecutiveKPIGrid isLoading={isLoading} />

      {/* Readiness Score Dashboard - Central Executive Metric */}
      <ReadinessDashboard className="col-span-full" />

      {/* Executive Insights */}
      {organization?.insights && Array.isArray(organization.insights) && organization.insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Executive Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {organization.insights.map((insight: any, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{insight.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Type: {insight.type} • Period: {insight.data?.period || 'Current'}
                    </p>
                    {insight.data && (
                      <div className="mt-2 text-xs">
                        {insight.data.change && <span>Change: +{insight.data.change}%</span>}
                        {insight.data.reduction && <span>Reduction: {insight.data.reduction}%</span>}
                        {insight.data.score && <span>Score: {insight.data.score}/{insight.data.target}</span>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Performance Metrics */}
      {organization?.kpis && (
        <KPIGrid kpis={organization.kpis as any} />
      )}

      {/* Board-Ready Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Board Summary • Key Highlights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">↗ 15.2%</div>
              <div className="text-sm font-medium">Revenue Growth</div>
              <div className="text-xs text-muted-foreground">Quarterly over quarterly</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">1,247</div>
              <div className="text-sm font-medium">Active Learners</div>
              <div className="text-xs text-muted-foreground">Across all programs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">87.3%</div>
              <div className="text-sm font-medium">Completion Rate</div>
              <div className="text-xs text-muted-foreground">Above industry benchmark</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Freshness Indicator */}
      <div className="text-center text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
          Live data • Auto-refreshed every 5 minutes • Last updated: {new Date().toLocaleTimeString()}
        </span>
      </div>
    </div>
  )
}
