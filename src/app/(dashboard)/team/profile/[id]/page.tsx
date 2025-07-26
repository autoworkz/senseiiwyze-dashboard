import { Button } from '@/components/ui/button'
import { LearnerProfileHeader } from '@/components/team/LearnerProfileHeader'
import { LearnerMetrics } from '@/components/team/LearnerMetrics'
import { LearnerProgress } from '@/components/team/LearnerProgress'
import { InterventionHistory } from '@/components/team/InterventionHistory'
import { getLearnerProfile } from '@/lib/api/team'

export default async function LearnerProfilePage() {
  const learner = await getLearnerProfile()
  
  if (!learner) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Learner Not Found</h2>
          <p className="text-muted-foreground">
            The learner profile you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-8">
      {/* Learner profile header */}
      <LearnerProfileHeader learner={learner} />
      
      {/* Key metrics */}
      <LearnerMetrics metrics={learner.metrics} />
      
      {/* Progress and performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LearnerProgress progress={learner.progress} />
        <InterventionHistory interventions={learner.interventions} />
      </div>
      
      {/* Detailed insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Learning patterns */}
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Learning Patterns</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Peak Learning Hours</span>
              <span className="text-sm font-medium">{learner.patterns.peakHours}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Preferred Learning Style</span>
              <span className="text-sm font-medium">{learner.patterns.learningStyle}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Average Session Length</span>
              <span className="text-sm font-medium">{learner.patterns.sessionLength}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Weekly Activity</span>
              <span className="text-sm font-medium">{learner.patterns.weeklyActivity}</span>
            </div>
          </div>
        </div>
        
        {/* Risk factors */}
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Risk Assessment</h3>
          <div className="space-y-4">
            {learner.riskFactors.map((factor, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  factor.severity === 'high' ? 'bg-destructive' :
                  factor.severity === 'medium' ? 'bg-accent' : 'bg-primary'
                }`}></div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{factor.factor}</div>
                  <div className="text-xs text-muted-foreground">{factor.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex gap-4">
        <Button>
          Schedule Check-in
        </Button>
        <Button variant="outline">
          Send Message
        </Button>
        <Button variant="outline">
          Create Intervention
        </Button>
      </div>
    </div>
  )
}
