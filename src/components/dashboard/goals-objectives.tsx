"use client"

import { Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card"
import { cn } from "@/lib/utils"

interface Goal {
  id: string
  title: string
  status: "completed" | "in_progress" | "pending" | "overdue"
  progress: number
  due_date?: string
  completion_date?: string
  description: string
}

interface GoalsObjectivesProps {
  goals: Goal[]
  className?: string
}

const statusConfig = {
  completed: {
    icon: CheckCircle,
    color: "bg-green-100 text-green-800 border-green-200",
    textColor: "text-green-600"
  },
  in_progress: {
    icon: Clock,
    color: "bg-blue-100 text-blue-800 border-blue-200", 
    textColor: "text-blue-600"
  },
  pending: {
    icon: AlertCircle,
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    textColor: "text-yellow-600"
  },
  overdue: {
    icon: AlertCircle,
    color: "bg-red-100 text-red-800 border-red-200",
    textColor: "text-red-600"
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export function GoalsObjectives({ goals, className }: GoalsObjectivesProps) {
  return (
    <GlassCard variant="default" className={cn("", className)}>
      <GlassCardHeader>
        <GlassCardTitle className="text-lg">Goals & Objectives</GlassCardTitle>
      </GlassCardHeader>
      <GlassCardContent>
        <div className="space-y-6">
          {goals.map((goal) => (
            <GoalItem key={goal.id} goal={goal} />
          ))}
        </div>
      </GlassCardContent>
    </GlassCard>
  )
}

function GoalItem({ goal }: { goal: Goal }) {
  const config = statusConfig[goal.status]
  const StatusIcon = config.icon

  return (
    <div className="glass-subtle p-4 rounded-lg space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-1">
          <h4 className="font-semibold text-foreground">{goal.title}</h4>
          <p className="text-sm text-muted-foreground">{goal.description}</p>
        </div>
        
        <Badge 
          variant="outline"
          className={cn("text-xs font-medium shrink-0", config.color)}
        >
          <StatusIcon className="h-3 w-3 mr-1" />
          {goal.status.replace('_', ' ')}
        </Badge>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-muted-foreground">Progress</span>
          <span className={cn("text-sm font-bold", config.textColor)}>
            {goal.progress}%
          </span>
        </div>
        <Progress 
          value={goal.progress} 
          className="h-2"
          indicatorClassName={cn(
            "transition-all duration-500",
            goal.status === "completed" && "bg-green-500",
            goal.status === "in_progress" && "bg-blue-500",
            goal.status === "pending" && "bg-yellow-500",
            goal.status === "overdue" && "bg-red-500"
          )}
        />
      </div>

      {/* Date Information */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {goal.status === "completed" && goal.completion_date ? (
            <span>Completed {formatDate(goal.completion_date)}</span>
          ) : goal.due_date ? (
            <span>Due {formatDate(goal.due_date)}</span>
          ) : (
            <span>No due date</span>
          )}
        </div>
        
        {goal.due_date && goal.status !== "completed" && (
          <div className="flex items-center gap-1">
            {isOverdue(goal.due_date) ? (
              <span className="text-red-600 font-medium">Overdue</span>
            ) : (
              <span>{getDaysUntilDue(goal.due_date)} days remaining</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function isOverdue(dueDate: string): boolean {
  return new Date(dueDate) < new Date()
}

function getDaysUntilDue(dueDate: string): number {
  const today = new Date()
  const due = new Date(dueDate)
  const diffTime = due.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDays)
}