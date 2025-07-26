"use client"

import { Star, Check, X, Clock } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card"
import { cn } from "@/lib/utils"

interface DetailedMetricsData {
  productivity_score: number
  quality_rating: number
  attendance_rate: number
  project_completion: number
  technical_skills: number
  communication: number
  leadership: number
  problem_solving: number
  program_readiness: {
    status: "ready" | "in_progress" | "not_ready"
    required_training: boolean
    certifications: boolean
    performance_threshold: boolean
    manager_approval: boolean
  }
  training_programs: Array<{
    name: string
    status: "completed" | "in_progress" | "not_started"
    progress: number
  }>
}

interface DetailedMetricsCardsProps {
  data: DetailedMetricsData
  className?: string
}

export function DetailedMetricsCards({ data, className }: DetailedMetricsCardsProps) {
  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-3 gap-6", className)}>
      <PerformanceMetricsCard data={data} />
      <SkillsDevelopmentCard data={data} />
      <ProgramReadinessCard data={data} />
    </div>
  )
}

function PerformanceMetricsCard({ data }: { data: DetailedMetricsData }) {
  return (
    <GlassCard variant="default">
      <GlassCardHeader>
        <GlassCardTitle className="text-lg">Performance Metrics</GlassCardTitle>
      </GlassCardHeader>
      <GlassCardContent className="space-y-6">
        <div className="space-y-4">
          <MetricWithProgress 
            label="Productivity Score"
            value={data.productivity_score}
            target={85}
            color="blue"
          />
          
          <div className="flex justify-between items-center">
            <span className="font-medium text-foreground">Quality Rating</span>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < data.quality_rating 
                      ? "fill-yellow-400 text-yellow-400" 
                      : "text-gray-300"
                  )}
                />
              ))}
              <span className="ml-1 text-sm font-medium text-foreground">
                {data.quality_rating}/5
              </span>
            </div>
          </div>

          <MetricWithProgress 
            label="Attendance Rate"
            value={data.attendance_rate}
            color="green"
            suffix="%"
          />

          <MetricWithProgress 
            label="Project Completion"
            value={data.project_completion}
            color="purple"
          />
        </div>

        <div className="pt-4 border-t border-border/50">
          <h4 className="font-medium text-foreground mb-3">6-Month Trend</h4>
          <div className="h-24 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg flex items-center justify-center">
            <span className="text-sm text-muted-foreground">Chart placeholder</span>
          </div>
        </div>
      </GlassCardContent>
    </GlassCard>
  )
}

function SkillsDevelopmentCard({ data }: { data: DetailedMetricsData }) {
  const skills = [
    { label: "Technical Skills", value: data.technical_skills, color: "blue" },
    { label: "Communication", value: data.communication, color: "green" },
    { label: "Leadership", value: data.leadership, color: "purple" },
    { label: "Problem Solving", value: data.problem_solving, color: "orange" }
  ]

  return (
    <GlassCard variant="default">
      <GlassCardHeader>
        <GlassCardTitle className="text-lg">Skills & Development</GlassCardTitle>
      </GlassCardHeader>
      <GlassCardContent className="space-y-6">
        <div className="space-y-4">
          {skills.map((skill, index) => (
            <MetricWithProgress 
              key={index}
              label={skill.label}
              value={skill.value}
              color={skill.color as "blue" | "green" | "purple" | "orange"}
            />
          ))}
        </div>

        <div className="pt-4 border-t border-border/50">
          <h4 className="font-medium text-foreground mb-3">Current Training Programs</h4>
          <div className="space-y-3">
            {data.training_programs.map((program, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{program.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={program.progress} className="h-1 flex-1" />
                    <span className="text-xs text-muted-foreground">{program.progress}%</span>
                  </div>
                </div>
                <Badge 
                  variant="outline"
                  className={cn(
                    "ml-3 text-xs",
                    program.status === "completed" && "bg-green-100 text-green-800 border-green-200",
                    program.status === "in_progress" && "bg-blue-100 text-blue-800 border-blue-200",
                    program.status === "not_started" && "bg-gray-100 text-gray-800 border-gray-200"
                  )}
                >
                  {program.status.replace('_', ' ')}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </GlassCardContent>
    </GlassCard>
  )
}

function ProgramReadinessCard({ data }: { data: DetailedMetricsData }) {
  const readiness = data.program_readiness
  
  const statusConfig = {
    ready: { color: "bg-green-100 text-green-800 border-green-200", icon: Check },
    in_progress: { color: "bg-blue-100 text-blue-800 border-blue-200", icon: Clock },
    not_ready: { color: "bg-red-100 text-red-800 border-red-200", icon: X }
  }

  const checklist = [
    { label: "Required Training", checked: readiness.required_training },
    { label: "Certifications", checked: readiness.certifications },
    { label: "Performance Threshold", checked: readiness.performance_threshold },
    { label: "Manager Approval", checked: readiness.manager_approval }
  ]

  const StatusIcon = statusConfig[readiness.status].icon

  return (
    <GlassCard variant="default">
      <GlassCardHeader>
        <GlassCardTitle className="text-lg">Program Readiness</GlassCardTitle>
      </GlassCardHeader>
      <GlassCardContent className="space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <StatusIcon className="h-6 w-6" />
            <Badge 
              variant="outline"
              className={cn("text-sm font-medium", statusConfig[readiness.status].color)}
            >
              {readiness.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-foreground">Requirements Checklist</h4>
          {checklist.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className={cn(
                "w-4 h-4 rounded-sm border-2 flex items-center justify-center",
                item.checked 
                  ? "bg-green-500 border-green-500 text-white" 
                  : "border-gray-300"
              )}>
                {item.checked && <Check className="h-3 w-3" />}
              </div>
              <span className={cn(
                "text-sm",
                item.checked ? "text-foreground" : "text-muted-foreground"
              )}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </GlassCardContent>
    </GlassCard>
  )
}

interface MetricWithProgressProps {
  label: string
  value: number
  target?: number
  color: "blue" | "green" | "purple" | "orange"
  suffix?: string
}

function MetricWithProgress({ label, value, target, color, suffix = "%" }: MetricWithProgressProps) {
  const colorVariants = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600", 
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600"
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="font-medium text-foreground">{label}</span>
        <span className="text-sm font-bold text-foreground">
          {value}{suffix}
          {target && (
            <span className="text-muted-foreground font-normal"> / {target}{suffix}</span>
          )}
        </span>
      </div>
      <Progress 
        value={value} 
        className="h-2" 
        indicatorClassName={cn("bg-gradient-to-r", colorVariants[color])}
      />
      {target && value >= target && (
        <p className="text-xs text-green-600 font-medium">✓ Target achieved</p>
      )}
    </div>
  )
}