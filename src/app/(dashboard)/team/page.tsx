import { SummaryBar } from '@/components/team/SummaryBar'
import { FilterPanel } from '@/components/team/FilterPanel'
import { LearnerTable } from '@/components/team/LearnerTable'
import { TeamInsights } from '@/components/team/TeamInsights'
import { getLearners, getTeamStats } from '@/lib/api/team'

export default async function TeamDashboardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const stats = await getTeamStats()
  const learners = await getLearners(searchParams)
  
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Team Overview</h1>
        <p className="text-muted-foreground mt-2">
          Manage and support your learners with data-driven insights
        </p>
      </div>
      
      {/* Summary metrics */}
      <SummaryBar stats={stats} />
      
      {/* Team insights */}
      <TeamInsights stats={stats} />
      
      {/* Main content with sidebar */}
      <div className="flex gap-6">
        {/* Filter sidebar */}
        <aside className="w-64 shrink-0 hidden xl:block">
          <FilterPanel />
        </aside>
        
        {/* Data table */}
        <div className="flex-1">
          <LearnerTable 
            learners={learners.data} 
            totalCount={learners.total}
            currentPage={learners.page}
          />
        </div>
      </div>
      
      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border bg-card p-4">
          <h4 className="font-semibold mb-2">At-Risk Learners</h4>
          <p className="text-sm text-muted-foreground mb-3">
            {stats.atRiskCount} learners need immediate attention
          </p>
          <button className="text-sm text-primary hover:underline">
            View interventions →
          </button>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <h4 className="font-semibold mb-2">Weekly Check-ins</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Schedule 1-on-1s with struggling learners
          </p>
          <button className="text-sm text-primary hover:underline">
            Schedule meetings →
          </button>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <h4 className="font-semibold mb-2">Content Updates</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Review and update learning materials
          </p>
          <button className="text-sm text-primary hover:underline">
            Manage content →
          </button>
        </div>
      </div>
    </div>
  )
}
