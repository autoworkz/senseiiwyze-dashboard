import { SkillFitCard } from '@/components/me/SkillFitCard'
import { PersonalityRadar } from '@/components/me/PersonalityRadar'
import { ProgressGrid } from '@/components/me/ProgressGrid'
import { CoachingSection } from '@/components/me/CoachingSection'
import { getMyMetrics } from '@/lib/api/metrics'

export default async function MyProgressPage() {
  const metrics = await getMyMetrics()
  
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Progress</h1>
        <p className="text-muted-foreground mt-2">
          Track your journey to tech mastery and see how you're progressing
        </p>
      </div>
      
      {/* Hero section - Key metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkillFitCard 
          score={metrics.skillFit} 
          trend={metrics.skillFitTrend}
          className="lg:col-span-1" 
        />
        <PersonalityRadar 
          data={metrics.personality}
          className="lg:col-span-1"
        />
      </div>
      
      {/* Progress widgets grid */}
      <ProgressGrid metrics={metrics} />
      
      {/* Coaching and intervention cards */}
      <CoachingSection interventions={metrics.interventions} />
      
      {/* Recent activity */}
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            <span className="text-muted-foreground">Completed Module 2: Data Structures</span>
            <span className="text-xs text-muted-foreground ml-auto">2 hours ago</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
            <span className="text-muted-foreground">Started Lab: Binary Trees Implementation</span>
            <span className="text-xs text-muted-foreground ml-auto">1 day ago</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
            <span className="text-muted-foreground">Joined study group: Algorithm Design</span>
            <span className="text-xs text-muted-foreground ml-auto">3 days ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}
