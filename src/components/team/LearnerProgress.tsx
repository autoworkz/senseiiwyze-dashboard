'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

import { CheckCircle, Clock, BookOpen, Play } from 'lucide-react'

interface LearnerProgressProps {
  progress: {
    modulesCompleted: number
    currentModule: string
    overallProgress: number
    timeSpent: number
  }
}

export function LearnerProgress({ progress }: LearnerProgressProps) {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Learning Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Overall Program Progress</span>
            <span className="font-medium">{progress.overallProgress}%</span>
          </div>
          <Progress value={progress.overallProgress} className="h-3" />
        </div>

        {/* Current Module */}
        <div className="p-4 rounded-lg border bg-blue-50 dark:bg-blue-950">
          <div className="flex items-center gap-2 mb-2">
            <Play className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">Currently Learning</span>
          </div>
          <h4 className="font-semibold">{progress.currentModule}</h4>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Modules Completed</span>
            </div>
            <div className="text-2xl font-bold">{progress.modulesCompleted}</div>
          </div>
          
          <div className="p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Time Spent</span>
            </div>
            <div className="text-2xl font-bold">{formatTime(progress.timeSpent)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
