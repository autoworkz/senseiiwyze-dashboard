"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card"
import { cn } from "@/lib/utils"

interface PerformanceAnalyticsProps {
  className?: string
}

export function PerformanceAnalytics({ className }: PerformanceAnalyticsProps) {
  return (
    <GlassCard variant="default" className={cn("", className)}>
      <GlassCardHeader>
        <GlassCardTitle className="text-lg">Performance Analytics</GlassCardTitle>
      </GlassCardHeader>
      <GlassCardContent>
        <Tabs defaultValue="trends" className="w-full">
          <TabsList className="grid grid-cols-3 w-full glass-subtle">
            <TabsTrigger value="trends" className="glass-hover">
              Performance Trends
            </TabsTrigger>
            <TabsTrigger value="comparison" className="glass-hover">
              Peer Comparison
            </TabsTrigger>
            <TabsTrigger value="goals" className="glass-hover">
              Goal Progress
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="mt-6">
            <PerformanceTrendsChart />
          </TabsContent>

          <TabsContent value="comparison" className="mt-6">
            <PeerComparisonChart />
          </TabsContent>

          <TabsContent value="goals" className="mt-6">
            <GoalProgressChart />
          </TabsContent>
        </Tabs>
      </GlassCardContent>
    </GlassCard>
  )
}

function PerformanceTrendsChart() {
  // Mock data for demonstration
  const metrics = [
    { name: "Productivity", values: [65, 72, 68, 75, 82, 78], color: "text-blue-500" },
    { name: "Quality", values: [70, 75, 72, 78, 85, 83], color: "text-green-500" },
    { name: "Collaboration", values: [60, 68, 75, 72, 80, 85], color: "text-purple-500" }
  ]

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]

  return (
    <div className="space-y-6">
      <div className="h-64 glass-subtle rounded-lg p-4 flex items-end justify-between gap-2">
        {months.map((month, index) => (
          <div key={month} className="flex-1 flex flex-col items-center gap-1">
            <div className="flex flex-col-reverse items-center gap-1 h-40">
              {metrics.map((metric, metricIndex) => (
                <div
                  key={metric.name}
                  className={cn(
                    "w-6 rounded-sm opacity-80 hover:opacity-100 transition-opacity",
                    metric.color.includes('blue') && "bg-blue-500",
                    metric.color.includes('green') && "bg-green-500", 
                    metric.color.includes('purple') && "bg-purple-500"
                  )}
                  style={{ 
                    height: `${(metric.values[index] / 100) * 120}px`
                  }}
                  title={`${metric.name}: ${metric.values[index]}%`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground font-medium">{month}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-6">
        {metrics.map((metric) => (
          <div key={metric.name} className="flex items-center gap-2">
            <div className={cn(
              "w-3 h-3 rounded-sm",
              metric.color.includes('blue') && "bg-blue-500",
              metric.color.includes('green') && "bg-green-500",
              metric.color.includes('purple') && "bg-purple-500"
            )} />
            <span className="text-sm font-medium text-foreground">{metric.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function PeerComparisonChart() {
  const skills = [
    { name: "Technical Skills", user: 85, peer: 78 },
    { name: "Communication", user: 92, peer: 85 },
    { name: "Leadership", user: 75, peer: 80 },
    { name: "Problem Solving", user: 88, peer: 82 },
    { name: "Teamwork", user: 90, peer: 87 }
  ]

  return (
    <div className="space-y-6">
      <div className="relative w-full h-64 glass-subtle rounded-lg p-6 flex items-center justify-center">
        <div className="relative w-48 h-48">
          {/* Radar chart simulation */}
          <svg className="w-full h-full">
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map(level => (
              <circle
                key={level}
                cx="96"
                cy="96"
                r={(level + 1) * 18}
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-border"
              />
            ))}
            
            {/* Axes */}
            {skills.map((_, index) => {
              const angle = (index * 72 - 90) * (Math.PI / 180)
              const x2 = 96 + Math.cos(angle) * 90
              const y2 = 96 + Math.sin(angle) * 90
              return (
                <line
                  key={index}
                  x1="96"
                  y1="96"
                  x2={x2}
                  y2={y2}
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-border"
                />
              )
            })}
          </svg>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm text-muted-foreground">Radar Chart</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {skills.map((skill) => (
          <div key={skill.name} className="glass-subtle p-3 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-foreground">{skill.name}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">You</span>
                <span className="text-xs font-bold text-blue-600">{skill.user}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Peer Avg</span>
                <span className="text-xs font-bold text-gray-600">{skill.peer}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function GoalProgressChart() {
  const goals = [
    { name: "Q4 Sales Target", current: 75, target: 100, color: "bg-blue-500" },
    { name: "Leadership Training", current: 100, target: 100, color: "bg-green-500" },
    { name: "Team Collaboration", current: 30, target: 100, color: "bg-orange-500" },
    { name: "Skill Certification", current: 65, target: 100, color: "bg-purple-500" }
  ]

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {goals.map((goal) => (
          <div key={goal.name} className="glass-subtle p-4 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <span className="font-medium text-foreground">{goal.name}</span>
              <span className="text-sm font-bold text-foreground">
                {goal.current}% / {goal.target}%
              </span>
            </div>
            
            <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={cn("h-full transition-all duration-500 rounded-full", goal.color)}
                style={{ width: `${goal.current}%` }}
              />
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-muted-foreground">
                {goal.current === goal.target ? "Completed" : "In Progress"}
              </span>
              <span className="text-xs text-muted-foreground">
                {goal.target - goal.current}% remaining
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}