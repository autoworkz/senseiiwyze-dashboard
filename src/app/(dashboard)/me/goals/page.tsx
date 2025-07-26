import { VisionBoard } from '@/components/me/VisionBoard'
import { GoalProgress } from '@/components/me/GoalProgress'
import { GoalSetting } from '@/components/me/GoalSetting'
import { getMyGoals } from '@/lib/api/goals'

export default async function GoalsPage() {
  const goals = await getMyGoals()
  
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Goals</h1>
        <p className="text-muted-foreground mt-2">
          Set, track, and achieve your learning objectives with our vision board
        </p>
      </div>
      
      {/* Vision Board - Main feature */}
      <VisionBoard goals={goals.visionGoals} />
      
      {/* Goal setting and progress tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GoalSetting />
        <GoalProgress goals={goals.activeGoals} />
      </div>
      
      {/* Achievement showcase */}
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.achievements.map((achievement, index) => (
            <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="text-2xl">{achievement.icon}</div>
              <div>
                <div className="font-medium text-sm">{achievement.title}</div>
                <div className="text-xs text-muted-foreground">{achievement.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Goal insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border bg-card p-4 text-center">
          <div className="text-2xl font-bold text-primary">{goals.stats.totalGoals}</div>
          <div className="text-sm text-muted-foreground">Total Goals</div>
        </div>
        <div className="rounded-lg border bg-card p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{goals.stats.completedGoals}</div>
          <div className="text-sm text-muted-foreground">Completed</div>
        </div>
        <div className="rounded-lg border bg-card p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{goals.stats.activeGoals}</div>
          <div className="text-sm text-muted-foreground">In Progress</div>
        </div>
      </div>
    </div>
  )
}
