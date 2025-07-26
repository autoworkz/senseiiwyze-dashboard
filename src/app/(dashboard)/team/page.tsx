'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { SummaryBar } from '@/components/team/SummaryBar'
import { FilterPanel } from '@/components/team/FilterPanel'
import { LearnerTable } from '@/components/team/LearnerTable'
import { TeamInsights } from '@/components/team/TeamInsights'
import { getLearners, getTeamStats } from '@/lib/api/team'

interface FilterState {
  search?: string
  status?: string
  riskLevel?: string
  skillFit?: string
  showAtRiskOnly?: boolean
}

interface TeamStats {
  totalLearners: number
  averageSkillFit: number
  atRiskPercentage: number
  atRiskCount: number
  weeklyActive: number
  completionRate: number
  averageProgress: number
}

interface Learner {
  id: string
  name: string
  email: string
  track: string
  skillFit: number
  progress: number
  lastActive: Date
  riskStatus: string
  coach: string
  joinDate: Date
}

export default function TeamDashboardPage() {
  const [stats, setStats] = useState<TeamStats | null>(null)
  const [learners, setLearners] = useState<Learner[]>([])
  const [filters, setFilters] = useState<FilterState>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, learnersResponse] = await Promise.all([
          getTeamStats(),
          getLearners(filters as Record<string, unknown>)
        ])
        setStats(statsData)
        setLearners(learnersResponse.data)
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [filters])

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

  if (loading || !stats) {
    return <div>Loading...</div>
  }
  
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
      <TeamInsights data={stats} />
      
      {/* Main content with sidebar */}
      <div className="flex gap-6">
        {/* Filter sidebar */}
        <aside className="w-64 shrink-0 hidden xl:block">
          <FilterPanel onFiltersChange={handleFiltersChange} activeFilters={filters} />
        </aside>
        
        {/* Data table */}
        <div className="flex-1">
          <LearnerTable 
            learners={learners} 
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
          <Button variant="link" className="p-0 h-auto text-sm text-primary hover:underline">
            View interventions →
          </Button>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <h4 className="font-semibold mb-2">Weekly Check-ins</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Schedule 1-on-1s with struggling learners
          </p>
          <Button variant="link" className="p-0 h-auto text-sm text-primary hover:underline">
            Schedule meetings →
          </Button>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <h4 className="font-semibold mb-2">Content Updates</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Review and update learning materials
          </p>
          <Button variant="link" className="p-0 h-auto text-sm text-primary hover:underline">
            Manage content →
          </Button>
        </div>
      </div>
    </div>
  )
}
