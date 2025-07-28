import { ReadinessStatus, TrendDirection } from '@/utils/readinessColors'

/**
 * Core data structures for individual learner tracking
 * Matches the MagicPatterns design requirements
 */

export interface SkillAssessment {
  name: string
  score: number
  target: number
  lastUpdated: string
}

export interface ProgramProgress {
  programId: string
  name: string
  completion: number
  status: 'not-started' | 'in-progress' | 'completed' | 'overdue'
  dueDate?: string
  modules?: {
    name: string
    completion: number
    status: 'not-started' | 'in-progress' | 'completed'
  }[]
}

export interface CoachingRecommendation {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  type: 'skill-gap' | 'engagement' | 'performance' | 'compliance'
  estimatedTime: string
  suggestedActions: string[]
  createdAt: string
}

export interface ActivityEvent {
  id: string
  type: 'training_completed' | 'skill_assessment' | 'coaching_session' | 'milestone_achieved'
  title: string
  description: string
  timestamp: string
  data?: Record<string, any>
}

export interface IndividualLearner {
  // Basic info
  id: string
  name: string
  email: string
  role: string
  department: string
  manager?: string
  avatar?: string
  joinDate: string
  
  // Readiness metrics
  overallReadiness: number
  status: ReadinessStatus
  trend: TrendDirection
  lastActivity: string
  
  // Detailed assessments
  skills: SkillAssessment[]
  programs: ProgramProgress[]
  
  // Coaching and development
  recommendations: CoachingRecommendation[]
  recentActivity: ActivityEvent[]
  
  // Progress tracking
  readinessHistory: Array<{
    date: string
    score: number
  }>
  
  // Contact and scheduling
  timezone: string
  preferredContactMethod: 'email' | 'slack' | 'teams'
  nextScheduledSession?: {
    type: 'coaching' | 'assessment' | 'training'
    date: string
    title: string
  }
}

export interface LearnerFilters {
  search: string
  department: string
  status: ReadinessStatus | 'all'
  readinessRange: {
    min: number
    max: number
  }
  sortBy: 'name' | 'readiness' | 'lastActivity' | 'trend'
  sortOrder: 'asc' | 'desc'
}

export interface LearnerSummaryStats {
  totalLearners: number
  averageReadiness: number
  readyForDeployment: number
  needsCoaching: number
  atRisk: number
  critical: number
  trends: {
    improving: number
    declining: number
    stable: number
  }
} 