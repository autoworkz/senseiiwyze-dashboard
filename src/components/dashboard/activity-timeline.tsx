"use client"

import { MessageCircle, Award, Target, BookOpen } from "lucide-react"
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card"
import { cn } from "@/lib/utils"

interface ActivityItem {
  id: string
  date: string
  type: "feedback" | "achievement" | "goal" | "training"
  title: string
  description: string
}

interface ActivityTimelineProps {
  activities: ActivityItem[]
  className?: string
}

const activityConfig = {
  feedback: {
    icon: MessageCircle,
    color: "bg-blue-100 text-blue-600 border-blue-200",
    iconBg: "bg-blue-500"
  },
  achievement: {
    icon: Award,
    color: "bg-green-100 text-green-600 border-green-200",
    iconBg: "bg-green-500"
  },
  goal: {
    icon: Target,
    color: "bg-purple-100 text-purple-600 border-purple-200",
    iconBg: "bg-purple-500"
  },
  training: {
    icon: BookOpen,
    color: "bg-orange-100 text-orange-600 border-orange-200",
    iconBg: "bg-orange-500"
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return `${Math.floor(diffDays / 30)} months ago`
}

export function ActivityTimeline({ activities, className }: ActivityTimelineProps) {
  return (
    <GlassCard variant="default" className={cn("", className)}>
      <GlassCardHeader>
        <GlassCardTitle className="text-lg">Recent Activity & Feedback</GlassCardTitle>
      </GlassCardHeader>
      <GlassCardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border"></div>
          
          <div className="space-y-6">
            {activities.map((activity, index) => (
              <ActivityItem 
                key={activity.id} 
                activity={activity} 
                isLast={index === activities.length - 1}
              />
            ))}
          </div>
        </div>
      </GlassCardContent>
    </GlassCard>
  )
}

function ActivityItem({ activity, isLast }: { activity: ActivityItem; isLast: boolean }) {
  const config = activityConfig[activity.type]
  const Icon = config.icon

  return (
    <div className="relative flex items-start gap-4">
      {/* Timeline icon */}
      <div className={cn(
        "relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 border-white",
        config.iconBg
      )}>
        <Icon className="h-4 w-4 text-white" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-semibold text-foreground">{activity.title}</h4>
          <div className="text-sm text-muted-foreground shrink-0">
            {getRelativeTime(activity.date)}
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground leading-relaxed">
          {activity.description}
        </p>
        
        <div className="text-xs text-muted-foreground">
          {formatDate(activity.date)}
        </div>
      </div>
    </div>
  )
}