import { LearningModules } from '@/components/me/LearningModules'
import { LearningProgress } from '@/components/me/LearningProgress'
import { RecommendedContent } from '@/components/me/RecommendedContent'
import { getMyLearningData } from '@/lib/api/learning'

export default async function LearningPage() {
  const learningData = await getMyLearningData()
  
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Learning</h1>
        <p className="text-muted-foreground mt-2">
          Access your personalized learning content and track your progress
        </p>
      </div>
      
      {/* Learning progress overview */}
      <LearningProgress progress={learningData.progress} />
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Learning modules - takes up 2 columns */}
        <div className="lg:col-span-2">
          <LearningModules modules={learningData.modules} />
        </div>
        
        {/* Recommended content sidebar */}
        <div className="lg:col-span-1">
          <RecommendedContent recommendations={learningData.recommendations} />
        </div>
      </div>
      
      {/* Current learning path */}
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-lg font-semibold mb-4">Current Learning Path</h3>
        <div className="space-y-4">
          {learningData.currentPath.map((step, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step.completed 
                  ? 'bg-green-500 text-white' 
                  : step.current 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
              }`}>
                {step.completed ? '✓' : index + 1}
              </div>
              <div className="flex-1">
                <div className={`font-medium ${step.current ? 'text-primary' : ''}`}>
                  {step.title}
                </div>
                <div className="text-sm text-muted-foreground">{step.description}</div>
              </div>
              <div className="text-sm text-muted-foreground">
                {step.estimatedTime}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Learning statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-lg border bg-card p-4 text-center">
          <div className="text-2xl font-bold text-primary">{learningData.stats.modulesCompleted}</div>
          <div className="text-sm text-muted-foreground">Modules Completed</div>
        </div>
        <div className="rounded-lg border bg-card p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{learningData.stats.hoursLearned}</div>
          <div className="text-sm text-muted-foreground">Hours Learned</div>
        </div>
        <div className="rounded-lg border bg-card p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{learningData.stats.currentStreak}</div>
          <div className="text-sm text-muted-foreground">Day Streak</div>
        </div>
        <div className="rounded-lg border bg-card p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{learningData.stats.skillsAcquired}</div>
          <div className="text-sm text-muted-foreground">Skills Acquired</div>
        </div>
      </div>
    </div>
  )
}
