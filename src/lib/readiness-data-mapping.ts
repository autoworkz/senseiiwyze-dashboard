/**
 * Readiness Score Data Mapping Service
 * 
 * This service maps available data sources to the comprehensive readiness calculation.
 * It shows how to extract and transform data from existing systems.
 */

import {
  type UserLearningData,
  type DepartmentData,
  type OrganizationMetrics,
  type ReadinessCalculationInput
} from './readiness-score-calculation'

// ===== AVAILABLE DATA SOURCE INTERFACES =====

// Data we likely have from Learning Management System (LMS)
export interface LMSUserData {
  id: string
  email: string
  department: string
  role: string
  enrollments: Array<{
    courseId: string
    courseName: string
    enrollmentDate: string
    completionDate?: string
    progressPercentage: number
    timeSpent: number // minutes
  }>
  assessments: Array<{
    assessmentId: string
    score: number // 0-100
    completedAt: string
    attempts: number
  }>
  certifications: Array<{
    certificationId: string
    earnedAt: string
    expiresAt?: string
    isActive: boolean
  }>
  lastLoginDate: string
  totalSessionTime: number // minutes
}

// Data we likely have from HR systems
export interface HRUserData {
  userId: string
  departmentId: string
  roleTitle: string
  hireDate: string
  
  // Performance data
  performanceReviews: Array<{
    reviewDate: string
    overallRating: number // 1-5
    goals: Array<{
      goalId: string
      description: string
      status: 'not_started' | 'in_progress' | 'completed'
      completionPercentage: number
    }>
  }>
  
  // Skills assessment
  skillAssessments: Array<{
    skillName: string
    currentLevel: number // 1-5
    targetLevel: number // 1-5
    lastAssessed: string
  }>
  
  // Engagement metrics
  engagement: {
    teamCollaborations: number
    mentoringSessions: number
    feedbackGiven: number
    feedbackReceived: Array<{
      rating: number // 1-5
      date: string
    }>
  }
}

// Data we likely have from organizational systems
export interface OrganizationSystemData {
  departments: Array<{
    id: string
    name: string
    headCount: number
    budget: number
    budgetUsed: number
    turnoverRate: number // calculated from HR
    averagePerformance: number // calculated from reviews
  }>
  
  strategicMetrics: {
    annualGoalsProgress: number // 0-100
    customerSatisfactionScore: number // 1-5
    revenuePerEmployee: number
    trainingBudget: number
    innovationProjects: number
  }
  
  compliance: Array<{
    departmentId: string
    requiredCertifications: string[]
    complianceIssues: Array<{
      type: string
      severity: 'low' | 'medium' | 'high'
      dateIdentified: string
    }>
  }>
  
  riskAssessment: {
    criticalRoles: string[]
    vacantCriticalRoles: number
    atRiskEmployees: string[] // identified through performance/engagement
  }
}

// ===== DATA TRANSFORMATION FUNCTIONS =====

/**
 * Transform LMS and HR data into UserLearningData format
 */
export function transformUserData(
  lmsData: LMSUserData, 
  hrData: HRUserData
): UserLearningData {
  // Calculate learning metrics
  const totalEnrollments = lmsData.enrollments.length
  const completedCourses = lmsData.enrollments.filter(e => e.completionDate).length
  const inProgressCourses = lmsData.enrollments.filter(e => 
    !e.completionDate && e.progressPercentage > 0
  ).length
  
  const averageCompletion = totalEnrollments > 0
    ? lmsData.enrollments.reduce((sum, e) => sum + e.progressPercentage, 0) / totalEnrollments
    : 0
  
  const totalLearningHours = lmsData.enrollments.reduce((sum, e) => 
    sum + e.timeSpent, 0
  ) / 60 // Convert minutes to hours
  
  // Calculate assessment metrics
  const assessmentScores = lmsData.assessments.map(a => a.score)
  const averageAssessmentScore = assessmentScores.length > 0
    ? assessmentScores.reduce((sum, score) => sum + score, 0) / assessmentScores.length
    : 0
  
  // Calculate certification metrics
  const activeCertifications = lmsData.certifications.filter(c => c.isActive)
  
  // Calculate performance metrics
  const latestReview = hrData.performanceReviews
    .sort((a, b) => new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime())[0]
  
  const performanceRating = latestReview?.overallRating || 3
  
  const allGoals = hrData.performanceReviews.flatMap(r => r.goals)
  const goalCompletionRate = allGoals.length > 0
    ? allGoals.reduce((sum, goal) => sum + goal.completionPercentage, 0) / allGoals.length
    : 0
  
  // Transform skill ratings
  const skillRatings: Record<string, number> = {}
  hrData.skillAssessments.forEach(skill => {
    skillRatings[skill.skillName] = skill.currentLevel
  })
  
  // Calculate engagement metrics
  const loginFrequency = calculateLoginFrequency(lmsData.lastLoginDate)
  const feedbackScores = hrData.engagement.feedbackReceived.map(f => f.rating)
  
  return {
    userId: lmsData.id,
    departmentId: hrData.departmentId,
    role: hrData.roleTitle,
    
    enrolledCourses: totalEnrollments,
    completedCourses,
    inProgressCourses,
    averageCompletion,
    totalLearningHours,
    lastActivityDate: new Date(lmsData.lastLoginDate),
    
    assessmentScores,
    averageAssessmentScore,
    certificationsEarned: activeCertifications.length,
    certificationsRequired: getRequiredCertificationsCount(hrData.departmentId, hrData.roleTitle),
    
    performanceRating,
    goalCompletionRate,
    skillRatings,
    
    loginFrequency,
    forumParticipation: 0, // Would need to implement if available
    peerInteractions: hrData.engagement.teamCollaborations + hrData.engagement.mentoringSessions,
    feedbackScores
  }
}

/**
 * Transform organization data into DepartmentData format
 */
export function transformDepartmentData(
  orgData: OrganizationSystemData,
  users: UserLearningData[]
): DepartmentData[] {
  return orgData.departments.map(dept => {
    // Get users in this department
    const deptUsers = users.filter(user => user.departmentId === dept.id)
    
    // Calculate learning program effectiveness
    const avgCompletion = deptUsers.length > 0
      ? deptUsers.reduce((sum, user) => sum + user.averageCompletion, 0) / deptUsers.length
      : 0
    
    // Calculate skills gaps
    const totalSkillsAssessed = deptUsers.reduce((sum, user) => 
      sum + Object.keys(user.skillRatings).length, 0
    )
    const skillsBelow3 = deptUsers.reduce((sum, user) => 
      sum + Object.values(user.skillRatings).filter(rating => rating < 3).length, 0
    )
    const skillsGapCount = totalSkillsAssessed > 0 ? skillsBelow3 : 0
    
    // Get compliance issues for this department
    const deptCompliance = orgData.compliance.find(c => c.departmentId === dept.id)
    const complianceIssues = deptCompliance?.complianceIssues.filter(
      issue => issue.severity === 'high'
    ).length || 0
    
    // Calculate at-risk employees
    const atRiskInDept = deptUsers.filter(user => 
      orgData.riskAssessment.atRiskEmployees.includes(user.userId)
    ).length
    
    // Calculate critical role vacancies
    const criticalRolesInDept = orgData.riskAssessment.criticalRoles.filter(role => 
      deptUsers.some(user => user.role.toLowerCase().includes(role.toLowerCase()))
    ).length
    const criticalRoleVacancies = Math.max(0, criticalRolesInDept - dept.headCount)
    
    return {
      departmentId: dept.id,
      name: dept.name,
      headCount: dept.headCount,
      
      averagePerformance: dept.averagePerformance,
      turnoverRate: dept.turnoverRate,
      promotionRate: calculatePromotionRate(dept.id), // Would need historical data
      budgetUtilization: (dept.budgetUsed / dept.budget) * 100,
      
      programCompletionRate: avgCompletion,
      timeToCompetency: calculateTimeToCompetency(deptUsers),
      skillsGapCount,
      
      atRiskEmployeeCount: atRiskInDept,
      criticalRoleVacancies,
      complianceIssues
    }
  })
}

/**
 * Transform organization metrics
 */
export function transformOrganizationMetrics(
  orgData: OrganizationSystemData,
  users: UserLearningData[]
): OrganizationMetrics {
  const totalEmployees = orgData.departments.reduce((sum, dept) => sum + dept.headCount, 0)
  const activeTrainees = users.filter(user => 
    user.enrolledCourses > 0 || user.totalLearningHours > 0
  ).length
  
  return {
    totalEmployees,
    activeTrainees,
    
    trainingInvestment: orgData.strategicMetrics.trainingBudget,
    revenuePerEmployee: orgData.strategicMetrics.revenuePerEmployee,
    productivityIndex: calculateProductivityIndex(users),
    
    strategicGoalsProgress: orgData.strategicMetrics.annualGoalsProgress,
    innovationIndex: (orgData.strategicMetrics.innovationProjects / totalEmployees) * 100,
    customerSatisfaction: orgData.strategicMetrics.customerSatisfactionScore,
    
    industryBenchmark: 75, // Would need external data source
    marketVolatility: 0.3, // Would need market data
    regulatoryChanges: 2 // Would need compliance system data
  }
}

// ===== HELPER FUNCTIONS =====

function calculateLoginFrequency(lastLoginDate: string): number {
  const daysSinceLogin = Math.floor(
    (Date.now() - new Date(lastLoginDate).getTime()) / (1000 * 60 * 60 * 24)
  )
  
  // Estimate weekly login frequency based on recency
  if (daysSinceLogin <= 1) return 5 // Very active
  if (daysSinceLogin <= 3) return 3 // Moderately active
  if (daysSinceLogin <= 7) return 1 // Weekly
  return 0.5 // Infrequent
}

function getRequiredCertificationsCount(departmentId: string, role: string): number {
  // This would be configured based on role requirements
  const roleRequirements: Record<string, number> = {
    'manager': 3,
    'senior': 2,
    'lead': 3,
    'junior': 1,
    'analyst': 2,
    'engineer': 2
  }
  
  const roleKey = Object.keys(roleRequirements).find(key => 
    role.toLowerCase().includes(key)
  )
  
  return roleKey ? roleRequirements[roleKey] : 1
}

function calculateTimeToCompetency(users: UserLearningData[]): number {
  // Estimate based on learning hours and completion rates
  const avgLearningHours = users.length > 0
    ? users.reduce((sum, user) => sum + user.totalLearningHours, 0) / users.length
    : 0
  
  // Assume 2 hours per day = 60 days for 120 hours
  return Math.max(30, Math.min(120, avgLearningHours * 0.5))
}

function calculatePromotionRate(departmentId: string): number {
  // This would require historical HR data
  // For now, return a reasonable estimate
  return Math.random() * 10 + 5 // 5-15%
}

function calculateProductivityIndex(users: UserLearningData[]): number {
  // Calculate productivity based on performance and skill ratings
  const avgPerformance = users.length > 0
    ? users.reduce((sum, user) => sum + user.performanceRating, 0) / users.length
    : 3
  
  // Convert 1-5 scale to productivity index (baseline 100)
  return (avgPerformance / 5) * 120 // 5.0 rating = 120% productivity
}

// ===== MAIN AGGREGATION FUNCTION =====

/**
 * Main function to aggregate all available data into readiness calculation format
 */
export async function aggregateReadinessData(
  lmsUsers: LMSUserData[],
  hrUsers: HRUserData[],
  orgData: OrganizationSystemData
): Promise<ReadinessCalculationInput> {
  // Transform user data by combining LMS and HR data
  const users: UserLearningData[] = lmsUsers.map(lmsUser => {
    const hrUser = hrUsers.find(hr => hr.userId === lmsUser.id)
    if (!hrUser) {
      throw new Error(`HR data not found for user ${lmsUser.id}`)
    }
    return transformUserData(lmsUser, hrUser)
  })
  
  // Transform department data
  const departments = transformDepartmentData(orgData, users)
  
  // Transform organization metrics
  const organization = transformOrganizationMetrics(orgData, users)
  
  return {
    users,
    departments,
    organization
  }
}

// ===== API INTEGRATION EXAMPLES =====

/**
 * Example API calls to fetch data from various systems
 */
export class ReadinessDataService {
  private lmsApiUrl: string
  private hrApiUrl: string
  private orgApiUrl: string
  
  constructor(lmsUrl: string, hrUrl: string, orgUrl: string) {
    this.lmsApiUrl = lmsUrl
    this.hrApiUrl = hrUrl
    this.orgApiUrl = orgUrl
  }
  
  async fetchLMSData(): Promise<LMSUserData[]> {
    // Example API call to Learning Management System
    const response = await fetch(`${this.lmsApiUrl}/api/users/learning-data`)
    return response.json()
  }
  
  async fetchHRData(): Promise<HRUserData[]> {
    // Example API call to HR System
    const response = await fetch(`${this.hrApiUrl}/api/employees/performance-data`)
    return response.json()
  }
  
  async fetchOrganizationData(): Promise<OrganizationSystemData> {
    // Example API call to Organization Systems
    const response = await fetch(`${this.orgApiUrl}/api/organization/metrics`)
    return response.json()
  }
  
  async getComprehensiveReadinessData(): Promise<ReadinessCalculationInput> {
    // Fetch all data in parallel
    const [lmsData, hrData, orgData] = await Promise.all([
      this.fetchLMSData(),
      this.fetchHRData(),
      this.fetchOrganizationData()
    ])
    
    // Aggregate and transform
    return aggregateReadinessData(lmsData, hrData, orgData)
  }
}

// ===== EXAMPLE USAGE =====

/**
 * Example of how to use the data mapping service
 */
import { logInfo, logError } from '@/lib/logger';

export async function exampleUsage() {
  // Initialize data service
  const dataService = new ReadinessDataService(
    'https://lms.company.com',
    'https://hr.company.com', 
    'https://metrics.company.com'
  )
  
  try {
    // Get aggregated data
    const readinessInput = await dataService.getComprehensiveReadinessData()
    
    // Calculate readiness score
    const { calculateComprehensiveReadinessScore } = await import('./readiness-score-calculation')
    const result = calculateComprehensiveReadinessScore(readinessInput)
    
    logInfo('Readiness score calculation completed', {
      overallScore: result.overallScore,
      components: result.components,
      recommendations: result.recommendations
    })
    
    return result
  } catch (error) {
    logError('Error calculating readiness score', error)
    throw error
  }
} 