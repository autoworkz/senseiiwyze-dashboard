'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Users, TrendingUp, AlertTriangle, Activity } from 'lucide-react'

interface TeamStats {
  totalLearners: number
  averageSkillFit: number
  atRiskPercentage: number
  atRiskCount: number
  weeklyActive: number
  completionRate: number
  averageProgress: number
}

interface SummaryBarProps {
  stats: TeamStats
}

export function SummaryBar({ stats }: SummaryBarProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.totalLearners}</div>
              <div className="text-sm text-muted-foreground">Total Learners</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900">
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.averageSkillFit}%</div>
              <div className="text-sm text-muted-foreground">Avg Skill Fit</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg dark:bg-red-900">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.atRiskCount}</div>
              <div className="text-sm text-muted-foreground">At Risk ({stats.atRiskPercentage}%)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900">
              <Activity className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.weeklyActive}</div>
              <div className="text-sm text-muted-foreground">Weekly Active</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

