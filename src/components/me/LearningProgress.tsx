'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Clock, TrendingUp } from 'lucide-react'

interface LearningProgressData {
  overall: number
  currentModule: string
  moduleProgress: number
  estimatedCompletion: string
}

interface LearningProgressProps {
  progress: LearningProgressData
}

export function LearningProgress({ progress }: LearningProgressProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-2">{progress.overall}%</div>
          <Progress value={progress.overall} className="h-2 mb-2" />
          <p className="text-xs text-muted-foreground">
            Complete learning journey
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Module</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-2">{progress.moduleProgress}%</div>
          <Progress value={progress.moduleProgress} className="h-2 mb-2" />
          <p className="text-xs text-muted-foreground truncate">
            {progress.currentModule}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Time to Complete</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-2">{progress.estimatedCompletion}</div>
          <Badge variant="outline" className="text-xs">
            Estimated
          </Badge>
          <p className="text-xs text-muted-foreground mt-1">
            Based on current pace
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

