"use client"

import { Progress } from "@/components/ui/progress"
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card"
import { cn } from "@/lib/utils"

interface MetricData {
  overall_score: number
  goal_achievement: number
  skill_development: number
  team_collaboration: number
}

interface MetricsOverviewProps {
  metrics: MetricData
  className?: string
}

interface MetricItemProps {
  label: string
  value: number
  type: "progress_circle" | "progress_bar"
  color: "blue" | "green" | "purple" | "orange"
  target?: number
}

const colorVariants = {
  blue: {
    bg: "bg-blue-500",
    text: "text-blue-600",
    ring: "ring-blue-500/20",
    gradient: "from-blue-500 to-blue-600"
  },
  green: {
    bg: "bg-green-500", 
    text: "text-green-600",
    ring: "ring-green-500/20",
    gradient: "from-green-500 to-green-600"
  },
  purple: {
    bg: "bg-purple-500",
    text: "text-purple-600", 
    ring: "ring-purple-500/20",
    gradient: "from-purple-500 to-purple-600"
  },
  orange: {
    bg: "bg-orange-500",
    text: "text-orange-600",
    ring: "ring-orange-500/20", 
    gradient: "from-orange-500 to-orange-600"
  }
}

export function MetricsOverview({ metrics, className }: MetricsOverviewProps) {
  const metricItems: MetricItemProps[] = [
    {
      label: "Overall Score",
      value: metrics.overall_score,
      type: "progress_circle",
      color: "blue"
    },
    {
      label: "Goal Achievement", 
      value: metrics.goal_achievement,
      type: "progress_bar",
      color: "green",
      target: 85
    },
    {
      label: "Skill Development",
      value: metrics.skill_development, 
      type: "progress_bar",
      color: "purple"
    },
    {
      label: "Team Collaboration",
      value: metrics.team_collaboration,
      type: "progress_circle", 
      color: "orange"
    }
  ]

  return (
    <GlassCard variant="default" className={cn("", className)}>
      <GlassCardHeader>
        <GlassCardTitle>Performance Overview</GlassCardTitle>
      </GlassCardHeader>
      <GlassCardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metricItems.map((item, index) => (
            <MetricItem key={index} {...item} />
          ))}
        </div>
      </GlassCardContent>
    </GlassCard>
  )
}

function MetricItem({ label, value, type, color, target }: MetricItemProps) {
  const colors = colorVariants[color]
  
  if (type === "progress_circle") {
    return (
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="relative">
          <CircularProgress value={value} color={color} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={cn("text-2xl font-bold", colors.text)}>
              {value}%
            </span>
          </div>
        </div>
        <div>
          <p className="font-medium text-foreground">{label}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <p className="font-medium text-foreground">{label}</p>
        <span className={cn("text-sm font-bold", colors.text)}>
          {value}%
          {target && (
            <span className="text-muted-foreground font-normal"> / {target}%</span>
          )}
        </span>
      </div>
      <div className="space-y-2">
        <Progress 
          value={value} 
          className="h-2" 
          indicatorClassName={cn("bg-gradient-to-r", colors.gradient)}
        />
        {target && value >= target && (
          <p className="text-xs text-green-600 font-medium">✓ Target achieved</p>
        )}
      </div>
    </div>
  )
}

interface CircularProgressProps {
  value: number
  color: "blue" | "green" | "purple" | "orange"
  size?: number
}

function CircularProgress({ value, color, size = 80 }: CircularProgressProps) {
  const colors = colorVariants[color]
  const radius = (size - 8) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (value / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg 
        width={size} 
        height={size} 
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2} 
          r={radius}
          stroke="currentColor"
          strokeWidth={4}
          fill="none"
          className="text-gray-200 dark:text-gray-700"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={4}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn(colors.text, "transition-all duration-500 ease-in-out")}
        />
      </svg>
    </div>
  )
}