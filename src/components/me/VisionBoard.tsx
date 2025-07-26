'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Calendar, Target } from 'lucide-react'

interface VisionGoal {
  id: string
  title: string
  description: string
  progress: number
  targetDate: string
  category: string
}

interface VisionBoardProps {
  goals: VisionGoal[]
}

export function VisionBoard({ goals }: VisionBoardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'career':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
      case 'certification':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
      case 'skill':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Vision Board
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className="p-4 rounded-lg border bg-gradient-to-br from-background to-muted/50"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{goal.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {goal.description}
                  </p>
                </div>
                <Badge className={getCategoryColor(goal.category)}>
                  {goal.category}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span className="font-medium">{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {goals.length === 0 && (
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No vision goals yet</h3>
            <p className="text-muted-foreground">
              Create your first vision goal to start tracking your long-term objectives.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

