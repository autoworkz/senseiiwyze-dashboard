'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingButton } from '@/components/ui/loading-button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { CheckCircle2, Circle, RefreshCw } from 'lucide-react'

interface Task {
  id: string
  title: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
}

interface DashboardContentProps {
  className?: string
}

export function DashboardContent({ className }: DashboardContentProps) {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Complete profile setup', completed: false, priority: 'high' },
    { id: '2', title: 'Take readiness assessment', completed: false, priority: 'high' },
    { id: '3', title: 'Browse learning paths', completed: false, priority: 'medium' },
    { id: '4', title: 'Join a learning cohort', completed: false, priority: 'low' },
  ])
  
  const [isRefreshing, setIsRefreshing] = useState(false)

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    ))
    
    const task = tasks.find(t => t.id === taskId)
    if (task) {
      toast.success(
        task.completed 
          ? `Marked "${task.title}" as incomplete` 
          : `Completed "${task.title}"`
      )
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    toast.success('Dashboard refreshed successfully')
    setIsRefreshing(false)
  }

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'destructive'
      case 'medium':
        return 'secondary'
      case 'low':
        return 'outline'
    }
  }

  const completedCount = tasks.filter(t => t.completed).length
  const progress = (completedCount / tasks.length) * 100

  return (
    <div className={cn("space-y-6", className)}>
      {/* Interactive Task List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Getting Started Tasks</CardTitle>
              <CardDescription>Complete these tasks to get the most out of SenseiiWyze</CardDescription>
            </div>
            <LoadingButton
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              loading={isRefreshing}
              loadingText="Refreshing..."
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </LoadingButton>
          </div>
        </CardHeader>
        <CardContent>
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{completedCount} of {tasks.length} completed</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Task List */}
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border transition-all duration-200",
                  "hover:bg-accent/50 hover:shadow-sm hover:-translate-y-px cursor-pointer",
                  "active:scale-[0.98] active:translate-y-0",
                  task.completed && "opacity-60"
                )}
                onClick={() => toggleTask(task.id)}
              >
                <button
                  className={cn(
                    "flex-shrink-0 transition-all duration-200 hover:scale-110 active:scale-95",
                    task.completed ? "text-primary" : "text-muted-foreground hover:text-primary"
                  )}
                >
                  {task.completed ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </button>
                
                <div className="flex-1">
                  <span className={cn(
                    "text-sm font-medium",
                    task.completed && "line-through"
                  )}>
                    {task.title}
                  </span>
                </div>
                
                <Badge variant={getPriorityColor(task.priority)} className="ml-auto">
                  {task.priority}
                </Badge>
              </div>
            ))}
          </div>

          {/* Completion Message */}
          {completedCount === tasks.length && (
            <div className="mt-4 p-4 bg-success/10 border border-success/20 rounded-lg">
              <p className="text-sm text-success font-medium">
                🎉 Congratulations! You've completed all getting started tasks.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}