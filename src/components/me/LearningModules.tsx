'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, Clock, CheckCircle, Play } from 'lucide-react'

interface LearningModule {
  id: string
  title: string
  progress: number
  status: 'completed' | 'in-progress' | 'upcoming'
  duration: string
}

interface LearningModulesProps {
  modules: LearningModule[]
}

export function LearningModules({ modules }: LearningModulesProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Completed</Badge>
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">In Progress</Badge>
      case 'upcoming':
        return <Badge variant="outline">Upcoming</Badge>
      default:
        return null
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'in-progress':
        return <Play className="h-5 w-5 text-blue-600" />
      case 'upcoming':
        return <BookOpen className="h-5 w-5 text-muted-foreground" />
      default:
        return <BookOpen className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getActionButton = (module: LearningModule) => {
    switch (module.status) {
      case 'completed':
        return (
          <Button variant="outline" size="sm">
            Review
          </Button>
        )
      case 'in-progress':
        return (
          <Button size="sm">
            Continue
          </Button>
        )
      case 'upcoming':
        return (
          <Button variant="outline" size="sm" disabled>
            Locked
          </Button>
        )
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Learning Modules
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {modules.map((module) => (
            <div
              key={module.id}
              className={`p-4 rounded-lg border ${
                module.status === 'in-progress' 
                  ? 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800'
                  : 'bg-muted/50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  {getStatusIcon(module.status)}
                  <div>
                    <h3 className="font-medium">{module.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Clock className="h-4 w-4" />
                      <span>{module.duration}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(module.status)}
                  {getActionButton(module)}
                </div>
              </div>
              
              {module.status !== 'upcoming' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">{module.progress}%</span>
                  </div>
                  <Progress value={module.progress} className="h-2" />
                </div>
              )}
            </div>
          ))}
        </div>
        
        {modules.length === 0 && (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No modules available</h3>
            <p className="text-muted-foreground">
              Learning modules will appear here once you&apos;re enrolled in a program.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
