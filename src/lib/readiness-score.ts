/**
 * Readiness Score Calculation & Aggregation System
 * 
 * This is the central metric for executive oversight, aggregating:
 * - Workforce competency readiness
 * - Training completion rates
 * - Skills gap analysis
 * - Performance indicators
 * - Risk factors
 */

export interface ReadinessMetrics {
  // Core readiness components
  workforceCompetency: number      // 0-100
  trainingCompletion: number       // 0-100
  skillsAlignment: number          // 0-100
  performanceIndex: number         // 0-100
  riskMitigation: number          // 0-100
  
  // Supporting metrics
  totalEmployees: number
  activeTrainees: number
  completedPrograms: number
  atRiskIndividuals: number
  
  // Trend data
  monthlyTrend: number[]          // Last 12 months
  quarterlyGrowth: number         // QoQ growth percentage
  yearOverYearChange: number      // YoY change percentage
}

export interface ReadinessBreakdown {
  overall: number                 // Weighted average readiness score
  byDepartment: DepartmentReadiness[]
  byProgram: ProgramReadiness[]
  byRiskLevel: RiskLevelBreakdown
  projectedReadiness: number      // 6-month projection
}

export interface DepartmentReadiness {
  department: string
  readinessScore: number
  employeeCount: number
  criticalGaps: string[]
  trend: 'improving' | 'declining' | 'stable'
}

export interface ProgramReadiness {
  programId: string
  programName: string
  readinessScore: number
  enrollmentCount: number
  completionRate: number
  effectivenessRating: number
}

export interface RiskLevelBreakdown {
  high: number                    // Count of high-risk individuals
  medium: number                  // Count of medium-risk individuals
  low: number                     // Count of low-risk individuals
  percentageHigh: number          // Percentage in high-risk category
}

/**
 * Readiness Score Calculation Weights
 * These can be adjusted based on organizational priorities
 */
export const READINESS_WEIGHTS = {
  workforceCompetency: 0.25,      // 25% - Current skill levels
  trainingCompletion: 0.20,       // 20% - Training progress
  skillsAlignment: 0.20,          // 20% - Skills matching job requirements
  performanceIndex: 0.20,         // 20% - Performance outcomes
  riskMitigation: 0.15,           // 15% - Risk factors addressed
} as const

/**
 * Calculate overall readiness score from component metrics
 */
export function calculateReadinessScore(metrics: ReadinessMetrics): number {
  const {
    workforceCompetency,
    trainingCompletion,
    skillsAlignment,
    performanceIndex,
    riskMitigation
  } = metrics

  const weightedScore = 
    (workforceCompetency * READINESS_WEIGHTS.workforceCompetency) +
    (trainingCompletion * READINESS_WEIGHTS.trainingCompletion) +
    (skillsAlignment * READINESS_WEIGHTS.skillsAlignment) +
    (performanceIndex * READINESS_WEIGHTS.performanceIndex) +
    (riskMitigation * READINESS_WEIGHTS.riskMitigation)

  return Math.round(weightedScore * 100) / 100 // Round to 2 decimal places
}

/**
 * Determine readiness level category based on score
 */
export function getReadinessLevel(score: number): 'critical' | 'low' | 'moderate' | 'good' | 'excellent' {
  if (score >= 90) return 'excellent'
  if (score >= 75) return 'good'
  if (score >= 60) return 'moderate'
  if (score >= 40) return 'low'
  return 'critical'
}

/**
 * Get color coding for readiness level visualization
 */
export function getReadinessColor(score: number): string {
  const level = getReadinessLevel(score)
  
  switch (level) {
    case 'excellent': return 'text-green-600 bg-green-100'
    case 'good': return 'text-blue-600 bg-blue-100'
    case 'moderate': return 'text-yellow-600 bg-yellow-100'
    case 'low': return 'text-orange-600 bg-orange-100'
    case 'critical': return 'text-red-600 bg-red-100'
    default: return 'text-gray-600 bg-gray-100'
  }
}

/**
 * Calculate trend direction from historical data
 */
export function calculateTrend(monthlyData: number[]): 'improving' | 'declining' | 'stable' {
  if (monthlyData.length < 2) return 'stable'
  
  const recent = monthlyData.slice(-3) // Last 3 months
  const earlier = monthlyData.slice(-6, -3) // 3 months before that
  
  const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length
  const earlierAvg = earlier.reduce((sum, val) => sum + val, 0) / earlier.length
  
  const change = recentAvg - earlierAvg
  
  if (change > 2) return 'improving'
  if (change < -2) return 'declining'
  return 'stable'
}

/**
 * Project future readiness based on current trends
 */
export function projectReadiness(currentScore: number, monthlyTrend: number[]): number {
  if (monthlyTrend.length < 3) return currentScore
  
  // Simple linear projection based on recent trend
  const recentTrend = monthlyTrend.slice(-3)
  const avgMonthlyChange = (recentTrend[recentTrend.length - 1] - recentTrend[0]) / (recentTrend.length - 1)
  
  // Project 6 months forward
  const projectedScore = currentScore + (avgMonthlyChange * 6)
  
  // Ensure projection stays within realistic bounds
  return Math.max(0, Math.min(100, projectedScore))
}

/**
 * Generate comprehensive readiness breakdown
 */
export function generateReadinessBreakdown(
  metrics: ReadinessMetrics,
  departments: DepartmentReadiness[],
  programs: ProgramReadiness[]
): ReadinessBreakdown {
  const overallScore = calculateReadinessScore(metrics)
  
  return {
    overall: overallScore,
    byDepartment: departments,
    byProgram: programs,
    byRiskLevel: {
      high: metrics.atRiskIndividuals,
      medium: Math.floor(metrics.totalEmployees * 0.15), // Estimated 15% medium risk
      low: metrics.totalEmployees - metrics.atRiskIndividuals - Math.floor(metrics.totalEmployees * 0.15),
      percentageHigh: (metrics.atRiskIndividuals / metrics.totalEmployees) * 100
    },
    projectedReadiness: projectReadiness(overallScore, metrics.monthlyTrend)
  }
}

/**
 * Mock data generator for development and testing
 */
export function generateMockReadinessData(): ReadinessMetrics {
  return {
    workforceCompetency: 78.5,
    trainingCompletion: 87.3,
    skillsAlignment: 72.1,
    performanceIndex: 81.7,
    riskMitigation: 69.8,
    
    totalEmployees: 1247,
    activeTrainees: 892,
    completedPrograms: 156,
    atRiskIndividuals: 23,
    
    monthlyTrend: [72.1, 73.8, 75.2, 76.9, 78.1, 79.4, 80.2, 81.1, 82.3, 83.7, 85.1, 87.3],
    quarterlyGrowth: 8.2,
    yearOverYearChange: 15.7
  }
}

/**
 * Executive-level readiness insights
 */
export function generateExecutiveInsights(breakdown: ReadinessBreakdown): string[] {
  const insights: string[] = []
  const { overall, byRiskLevel, projectedReadiness } = breakdown
  
  // Overall readiness insight
  const level = getReadinessLevel(overall)
  insights.push(`Organization readiness is ${level} at ${overall.toFixed(1)}%`)
  
  // Risk analysis
  if (byRiskLevel.percentageHigh > 5) {
    insights.push(`${byRiskLevel.percentageHigh.toFixed(1)}% of workforce is high-risk - immediate intervention needed`)
  }
  
  // Projection insight
  const projectionChange = projectedReadiness - overall
  if (projectionChange > 5) {
    insights.push(`Projected 6-month improvement of ${projectionChange.toFixed(1)} percentage points`)
  } else if (projectionChange < -3) {
    insights.push(`Warning: Projected decline of ${Math.abs(projectionChange).toFixed(1)} percentage points`)
  }
  
  // Department-specific insights
  const topDept = breakdown.byDepartment.reduce((prev, current) => 
    (prev.readinessScore > current.readinessScore) ? prev : current
  )
  insights.push(`${topDept.department} leads with ${topDept.readinessScore.toFixed(1)}% readiness`)
  
  return insights
} 