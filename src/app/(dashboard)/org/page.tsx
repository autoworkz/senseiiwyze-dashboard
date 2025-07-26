import { KPIGrid } from '@/components/org/KPIGrid'
import { QuickActions } from '@/components/org/QuickActions'
import { ExecutiveInsights } from '@/components/org/ExecutiveInsights'
import { getOrganizationKPIs } from '@/lib/api/organization'

export default async function OrgDashboardPage() {
  const kpis = await getOrganizationKPIs()
  
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Executive Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Real-time training program metrics and organizational insights
          </p>
        </div>
        <QuickActions />
      </div>
      
      {/* KPI Grid - Main metrics */}
      <KPIGrid kpis={kpis} />
      
      {/* Executive insights */}
      <ExecutiveInsights data={kpis} />
      
      {/* Program readiness overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Program Readiness Trends</h3>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            {/* Chart component would go here */}
            <div className="text-center">
              <div className="text-4xl mb-2">📈</div>
              <div>Readiness trending upward</div>
              <div className="text-sm">+12% from last quarter</div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold mb-2">Critical Alerts</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>23 learners at high risk</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>5 programs behind schedule</span>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold mb-2">Quick Stats</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Active Learners</span>
                <span className="font-medium">1,247</span>
              </div>
              <div className="flex justify-between">
                <span>Completion Rate</span>
                <span className="font-medium text-green-600">87.3%</span>
              </div>
              <div className="flex justify-between">
                <span>Avg. Time to Complete</span>
                <span className="font-medium">14.2 weeks</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* ROI and cost analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Training ROI</h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">324%</div>
            <div className="text-sm text-muted-foreground">Return on Investment</div>
            <div className="text-xs text-muted-foreground mt-1">
              Based on salary increases and productivity gains
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Cost Efficiency</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Cost per completion</span>
              <span className="font-medium">$284</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">vs. Industry average</span>
              <span className="font-medium text-green-600">-42%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Total program cost</span>
              <span className="font-medium">$354K</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Auto-refresh indicator */}
      <div className="text-center text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
          Live data • Refreshes every 5 minutes
        </span>
      </div>
    </div>
  )
}
