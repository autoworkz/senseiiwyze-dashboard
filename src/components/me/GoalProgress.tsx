'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock } from 'lucide-react'

interface ActiveGoal {
  id: string
  title: string
  progress: number
  dueDate: string
}

interface GoalProgressProps {
  goals: ActiveGoal[]
}

export function GoalProgress({ goals }: GoalProgressProps) {
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600'
    if (progress >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate)
    const now = new Date()
    const diffTime = due.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getDueDateBadge = (daysUntil: number) => {
    if (daysUntil < 0) {
      return <Badge variant="destructive">Overdue</Badge>
    } else if (daysUntil <= 3) {
      return <Badge variant="destructive">Due Soon</Badge>
    } else if (daysUntil <= 7) {
      return <Badge variant="secondary">This Week</Badge>
    } else {
      return <Badge variant="outline">{daysUntil} days</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Active Goals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goals.map((goal) => {
            const daysUntil = getDaysUntilDue(goal.dueDate)
            return (
              <div key={goal.id} className="p-4 rounded-lg border bg-muted/50">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-medium">{goal.title}</h3>
                  {getDueDateBadge(daysUntil)}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className={`font-medium ${getProgressColor(goal.progress)}`}>
                      {goal.progress}%
                    </span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Due: {new Date(goal.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        {goals.length === 0 && (
          <div className="text-center py-6">
            <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No active goals</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

