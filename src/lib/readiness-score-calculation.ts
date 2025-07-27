/**
 * Comprehensive Readiness Score Calculation Engine
 * 
 * This system calculates organizational readiness from available data sources:
 * - User learning progress and completions
 * - Assessment scores and certifications
 * - Performance reviews and metrics
 * - Engagement and activity data
 * - Skills gap analysis
 * - Risk indicators
 */

// ===== DATA SOURCES INTERFACES =====

export interface UserLearningData {
  userId: string
  departmentId: string
  role: string
  
  // Learning Progress
  enrolledCourses: number
  completedCourses: number
  inProgressCourses: number
  averageCompletion: number      // 0-100%
  totalLearningHours: number
  lastActivityDate: Date
  
  // Assessments & Certifications
  assessmentScores: number[]     // Array of scores 0-100
  averageAssessmentScore: number // 0-100
  certificationsEarned: number
  certificationsRequired: number
  
  // Performance Metrics
  performanceRating: number      // 1-5 scale
  goalCompletionRate: number     // 0-100%
  skillRatings: Record<string, number> // Skill name → rating 1-5
  
  // Engagement Indicators
  loginFrequency: number         // Logins per week
  forumParticipation: number     // Posts/comments
  peerInteractions: number       // Collaborations, helps given
  feedbackScores: number[]       // Feedback ratings received
}

export interface DepartmentData {
  departmentId: string
  name: string
  headCount: number
  
  // Department-specific metrics
  averagePerformance: number
  turnoverRate: number           // 0-100%
  promotionRate: number          // 0-100%
  budgetUtilization: number      // 0-100%
  
  // Learning program effectiveness
  programCompletionRate: number  // 0-100%
  timeToCompetency: number       // Days average
  skillsGapCount: number         // Number of critical gaps
  
  // Risk factors
  atRiskEmployeeCount: number
  criticalRoleVacancies: number
  complianceIssues: number
}

export interface OrganizationMetrics {
  totalEmployees: number
  activeTrainees: number
  
  // Financial impact
  trainingInvestment: number     // Annual training budget
  revenuePerEmployee: number
  productivityIndex: number      // Baseline 100
  
  // Strategic alignment
  strategicGoalsProgress: number // 0-100%
  innovationIndex: number        // 0-100%
  customerSatisfaction: number   // 1-5 scale
  
  // External factors
  industryBenchmark: number      // Industry readiness average
  marketVolatility: number       // Risk factor 0-1
  regulatoryChanges: number      // Number of recent changes
}

// ===== CALCULATION WEIGHTS AND THRESHOLDS =====

export const READINESS_CALCULATION_CONFIG = {
  // Main component weights (must sum to 1.0)
  weights: {
    individualCompetency: 0.30,    // Individual learning & skills
    teamEffectiveness: 0.25,       // Department/team performance  
    organizationalAlignment: 0.20, // Strategic goal alignment
    adaptabilityIndex: 0.15,       // Change readiness & innovation
    riskMitigation: 0.10,          // Risk factors & compliance
  },
  
  // Scoring thresholds for grade boundaries
  thresholds: {
    excellent: 90,   // 90-100%
    good: 75,        // 75-89%
    moderate: 60,    // 60-74%
    low: 40,         // 40-59%
    critical: 0,     // 0-39%
  },
  
  // Risk multipliers (applied to reduce scores)
  riskFactors: {
    highTurnover: 0.9,           // >15% turnover
    lowEngagement: 0.85,         // <3 logins/week average
    criticalSkillsGap: 0.8,      // >20% skills gaps
    complianceIssues: 0.75,      // Any critical compliance issues
    lowPerformance: 0.9,         // <3.0 average performance
  }
} as const

// ===== INDIVIDUAL COMPETENCY CALCULATION =====

export function calculateIndividualCompetency(users: UserLearningData[]): number {
  if (users.length === 0) return 0
  
  const userScores = users.map(user => {
    // Learning progress score (40% weight)
    const learningScore = Math.min(100, (
      (user.averageCompletion * 0.4) +
      (Math.min(user.completedCourses / Math.max(user.enrolledCourses, 1) * 100, 100) * 0.3) +
      (Math.min(user.totalLearningHours / 40, 1) * 100 * 0.3) // 40 hours = 100%
    ))
    
    // Assessment performance (30% weight)
    const assessmentScore = user.averageAssessmentScore || 0
    
    // Certification completion (20% weight)
    const certificationScore = user.certificationsRequired > 0 
      ? (user.certificationsEarned / user.certificationsRequired) * 100
      : 100
    
    // Skills proficiency (10% weight)
    const skillScores = Object.values(user.skillRatings)
    const skillScore = skillScores.length > 0
      ? (skillScores.reduce((sum, rating) => sum + rating, 0) / skillScores.length) * 20 // Convert 1-5 to 0-100
      : 50
    
    // Weighted individual score
    const individualScore = (
      learningScore * 0.4 +
      assessmentScore * 0.3 +
      certificationScore * 0.2 +
      skillScore * 0.1
    )
    
    // Apply engagement penalty if low activity
    const daysSinceActivity = Math.floor((Date.now() - user.lastActivityDate.getTime()) / (1000 * 60 * 60 * 24))
    const engagementPenalty = daysSinceActivity > 14 ? 0.9 : 1.0 // 10% penalty for >2 weeks inactive
    
    return Math.max(0, Math.min(100, individualScore * engagementPenalty))
  })
  
  // Calculate weighted average (consider performance ratings)
  const weightedScores = users.map((user, index) => ({
    score: userScores[index],
    weight: Math.max(0.5, user.performanceRating / 5) // Higher performers weighted more
  }))
  
  const totalWeight = weightedScores.reduce((sum, item) => sum + item.weight, 0)
  const weightedAverage = weightedScores.reduce((sum, item) => sum + (item.score * item.weight), 0) / totalWeight
  
  return Math.round(weightedAverage * 100) / 100
}

// ===== TEAM EFFECTIVENESS CALCULATION =====

export function calculateTeamEffectiveness(departments: DepartmentData[], users: UserLearningData[]): number {
  if (departments.length === 0) return 0
  
  const departmentScores = departments.map(dept => {
    // Get users in this department
    const deptUsers = users.filter(user => user.departmentId === dept.departmentId)
    
    // Performance metrics (40% weight)
    const performanceScore = Math.min(100, dept.averagePerformance * 20) // Convert 1-5 to 0-100
    
    // Learning program effectiveness (30% weight)
    const learningEffectiveness = (
      dept.programCompletionRate * 0.6 +
      Math.max(0, 100 - (dept.timeToCompetency / 90 * 100)) * 0.4 // 90 days = baseline
    )
    
    // Team collaboration (20% weight)
    const avgCollaboration = deptUsers.length > 0
      ? deptUsers.reduce((sum, user) => sum + user.peerInteractions, 0) / deptUsers.length
      : 0
    const collaborationScore = Math.min(100, avgCollaboration * 10) // 10 interactions = 100%
    
    // Resource utilization (10% weight)
    const utilizationScore = dept.budgetUtilization
    
    // Calculate department score
    const deptScore = (
      performanceScore * 0.4 +
      learningEffectiveness * 0.3 +
      collaborationScore * 0.2 +
      utilizationScore * 0.1
    )
    
    // Apply risk penalties
    let riskMultiplier = 1.0
    if (dept.turnoverRate > 15) riskMultiplier *= READINESS_CALCULATION_CONFIG.riskFactors.highTurnover
    if (dept.skillsGapCount / dept.headCount > 0.2) riskMultiplier *= READINESS_CALCULATION_CONFIG.riskFactors.criticalSkillsGap
    if (dept.complianceIssues > 0) riskMultiplier *= READINESS_CALCULATION_CONFIG.riskFactors.complianceIssues
    
    return {
      score: deptScore * riskMultiplier,
      headCount: dept.headCount
    }
  })
  
  // Weight by department size
  const totalHeadCount = departmentScores.reduce((sum, dept) => sum + dept.headCount, 0)
  const weightedAverage = departmentScores.reduce((sum, dept) => 
    sum + (dept.score * dept.headCount), 0
  ) / totalHeadCount
  
  return Math.round(weightedAverage * 100) / 100
}

// ===== ORGANIZATIONAL ALIGNMENT CALCULATION =====

export function calculateOrganizationalAlignment(orgMetrics: OrganizationMetrics, users: UserLearningData[]): number {
  // Strategic goals progress (50% weight)
  const strategicScore = orgMetrics.strategicGoalsProgress
  
  // Goal completion rate across individuals (30% weight)
  const avgGoalCompletion = users.length > 0
    ? users.reduce((sum, user) => sum + user.goalCompletionRate, 0) / users.length
    : 0
  
  // Customer satisfaction impact (20% weight)
  const customerScore = (orgMetrics.customerSatisfaction - 1) * 25 // Convert 1-5 to 0-100
  
  const alignmentScore = (
    strategicScore * 0.5 +
    avgGoalCompletion * 0.3 +
    customerScore * 0.2
  )
  
  return Math.round(alignmentScore * 100) / 100
}

// ===== ADAPTABILITY INDEX CALCULATION =====

export function calculateAdaptabilityIndex(orgMetrics: OrganizationMetrics, users: UserLearningData[]): number {
  // Innovation index (40% weight)
  const innovationScore = orgMetrics.innovationIndex
  
  // Learning agility (30% weight) - based on new course enrollments and completion speed
  const avgLearningHours = users.length > 0
    ? users.reduce((sum, user) => sum + user.totalLearningHours, 0) / users.length
    : 0
  const learningAgilityScore = Math.min(100, avgLearningHours / 50 * 100) // 50 hours = 100%
  
  // Cross-functional collaboration (30% weight)
  const avgCollaboration = users.length > 0
    ? users.reduce((sum, user) => sum + user.peerInteractions, 0) / users.length
    : 0
  const collaborationScore = Math.min(100, avgCollaboration * 8) // 12.5 interactions = 100%
  
  // Market adaptability bonus/penalty
  const marketFactor = 1 - (orgMetrics.marketVolatility * 0.2) // High volatility reduces adaptability
  
  const adaptabilityScore = (
    innovationScore * 0.4 +
    learningAgilityScore * 0.3 +
    collaborationScore * 0.3
  ) * marketFactor
  
  return Math.round(adaptabilityScore * 100) / 100
}

// ===== RISK MITIGATION CALCULATION =====

export function calculateRiskMitigation(
  departments: DepartmentData[], 
  users: UserLearningData[], 
  orgMetrics: OrganizationMetrics
): number {
  // Compliance score (40% weight)
  const totalComplianceIssues = departments.reduce((sum, dept) => sum + dept.complianceIssues, 0)
  const complianceScore = Math.max(0, 100 - (totalComplianceIssues * 10)) // Each issue = -10 points
  
  // Performance consistency (30% weight)
  const performanceScores = users.map(user => user.performanceRating)
  const avgPerformance = performanceScores.reduce((sum, rating) => sum + rating, 0) / performanceScores.length
  const performanceVariance = performanceScores.reduce((sum, rating) => 
    sum + Math.pow(rating - avgPerformance, 2), 0
  ) / performanceScores.length
  const consistencyScore = Math.max(0, 100 - (performanceVariance * 20)) // Lower variance = higher score
  
  // Critical role coverage (20% weight)
  const totalVacancies = departments.reduce((sum, dept) => sum + dept.criticalRoleVacancies, 0)
  const coverageScore = Math.max(0, 100 - (totalVacancies * 15)) // Each vacancy = -15 points
  
  // At-risk employee management (10% weight)
  const totalAtRisk = departments.reduce((sum, dept) => sum + dept.atRiskEmployeeCount, 0)
  const atRiskPercentage = (totalAtRisk / orgMetrics.totalEmployees) * 100
  const riskManagementScore = Math.max(0, 100 - (atRiskPercentage * 5)) // Each 1% at-risk = -5 points
  
  const riskScore = (
    complianceScore * 0.4 +
    consistencyScore * 0.3 +
    coverageScore * 0.2 +
    riskManagementScore * 0.1
  )
  
  return Math.round(riskScore * 100) / 100
}

// ===== MAIN READINESS CALCULATION ENGINE =====

export interface ReadinessCalculationInput {
  users: UserLearningData[]
  departments: DepartmentData[]
  organization: OrganizationMetrics
}

export interface ReadinessCalculationResult {
  overallScore: number
  components: {
    individualCompetency: number
    teamEffectiveness: number
    organizationalAlignment: number
    adaptabilityIndex: number
    riskMitigation: number
  }
  gradeLevel: 'excellent' | 'good' | 'moderate' | 'low' | 'critical'
  insights: string[]
  recommendations: string[]
}

export function calculateComprehensiveReadinessScore(
  input: ReadinessCalculationInput
): ReadinessCalculationResult {
  const { users, departments, organization } = input
  
  // Calculate each component
  const components = {
    individualCompetency: calculateIndividualCompetency(users),
    teamEffectiveness: calculateTeamEffectiveness(departments, users),
    organizationalAlignment: calculateOrganizationalAlignment(organization, users),
    adaptabilityIndex: calculateAdaptabilityIndex(organization, users),
    riskMitigation: calculateRiskMitigation(departments, users, organization)
  }
  
  // Calculate weighted overall score
  const weights = READINESS_CALCULATION_CONFIG.weights
  const overallScore = (
    components.individualCompetency * weights.individualCompetency +
    components.teamEffectiveness * weights.teamEffectiveness +
    components.organizationalAlignment * weights.organizationalAlignment +
    components.adaptabilityIndex * weights.adaptabilityIndex +
    components.riskMitigation * weights.riskMitigation
  )
  
  // Determine grade level
  const thresholds = READINESS_CALCULATION_CONFIG.thresholds
  let gradeLevel: ReadinessCalculationResult['gradeLevel']
  if (overallScore >= thresholds.excellent) gradeLevel = 'excellent'
  else if (overallScore >= thresholds.good) gradeLevel = 'good'
  else if (overallScore >= thresholds.moderate) gradeLevel = 'moderate'
  else if (overallScore >= thresholds.low) gradeLevel = 'low'
  else gradeLevel = 'critical'
  
  // Generate insights
  const insights: string[] = []
  const recommendations: string[] = []
  
  // Component-specific insights
  if (components.individualCompetency < 70) {
    insights.push(`Individual competency at ${components.individualCompetency.toFixed(1)}% - below target`)
    recommendations.push('Increase personalized learning paths and skills assessments')
  }
  
  if (components.teamEffectiveness < 75) {
    insights.push(`Team effectiveness needs improvement at ${components.teamEffectiveness.toFixed(1)}%`)
    recommendations.push('Focus on team collaboration tools and leadership development')
  }
  
  if (components.organizationalAlignment < 80) {
    insights.push(`Strategic alignment gap identified at ${components.organizationalAlignment.toFixed(1)}%`)
    recommendations.push('Clarify organizational goals and improve communication cascading')
  }
  
  if (components.adaptabilityIndex < 65) {
    insights.push(`Innovation and adaptability below industry standards`)
    recommendations.push('Invest in change management and cross-functional training')
  }
  
  if (components.riskMitigation < 85) {
    insights.push(`Risk factors require immediate attention`)
    recommendations.push('Implement risk mitigation strategies and compliance training')
  }
  
  // Overall insights
  const topComponent = Object.entries(components).reduce((a, b) => 
    components[a[0] as keyof typeof components] > components[b[0] as keyof typeof components] ? a : b
  )
  insights.push(`Strongest area: ${topComponent[0]} at ${topComponent[1].toFixed(1)}%`)
  
  const bottomComponent = Object.entries(components).reduce((a, b) => 
    components[a[0] as keyof typeof components] < components[b[0] as keyof typeof components] ? a : b
  )
  insights.push(`Priority improvement area: ${bottomComponent[0]} at ${bottomComponent[1].toFixed(1)}%`)
  
  return {
    overallScore: Math.round(overallScore * 100) / 100,
    components,
    gradeLevel,
    insights,
    recommendations
  }
}

// ===== MOCK DATA GENERATOR FOR TESTING =====

export function generateMockCalculationData(): ReadinessCalculationInput {
  // Generate mock users
  const users: UserLearningData[] = Array.from({ length: 50 }, (_, i) => ({
    userId: `user-${i + 1}`,
    departmentId: `dept-${Math.floor(i / 12) + 1}`,
    role: ['Manager', 'Senior', 'Junior', 'Lead'][Math.floor(Math.random() * 4)],
    
    enrolledCourses: Math.floor(Math.random() * 10) + 3,
    completedCourses: Math.floor(Math.random() * 8) + 1,
    inProgressCourses: Math.floor(Math.random() * 3),
    averageCompletion: Math.random() * 40 + 60, // 60-100%
    totalLearningHours: Math.random() * 80 + 20,
    lastActivityDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Last 30 days
    
    assessmentScores: Array.from({ length: 5 }, () => Math.random() * 30 + 70), // 70-100
    averageAssessmentScore: Math.random() * 25 + 75,
    certificationsEarned: Math.floor(Math.random() * 3),
    certificationsRequired: Math.floor(Math.random() * 2) + 2,
    
    performanceRating: Math.random() * 2 + 3, // 3-5
    goalCompletionRate: Math.random() * 40 + 60,
    skillRatings: {
      'Technical Skills': Math.random() * 2 + 3,
      'Communication': Math.random() * 2 + 3,
      'Leadership': Math.random() * 2 + 3
    },
    
    loginFrequency: Math.random() * 5 + 2, // 2-7 per week
    forumParticipation: Math.floor(Math.random() * 20),
    peerInteractions: Math.floor(Math.random() * 15) + 5,
    feedbackScores: Array.from({ length: 3 }, () => Math.random() * 2 + 3)
  }))
  
  // Generate mock departments
  const departments: DepartmentData[] = Array.from({ length: 4 }, (_, i) => ({
    departmentId: `dept-${i + 1}`,
    name: ['Engineering', 'Sales', 'Operations', 'Finance'][i],
    headCount: Math.floor(Math.random() * 20) + 10,
    
    averagePerformance: Math.random() * 1.5 + 3.5, // 3.5-5.0
    turnoverRate: Math.random() * 15 + 5, // 5-20%
    promotionRate: Math.random() * 10 + 5, // 5-15%
    budgetUtilization: Math.random() * 20 + 80, // 80-100%
    
    programCompletionRate: Math.random() * 30 + 70, // 70-100%
    timeToCompetency: Math.random() * 60 + 30, // 30-90 days
    skillsGapCount: Math.floor(Math.random() * 5),
    
    atRiskEmployeeCount: Math.floor(Math.random() * 3),
    criticalRoleVacancies: Math.floor(Math.random() * 2),
    complianceIssues: Math.floor(Math.random() * 2)
  }))
  
  // Generate mock organization metrics
  const organization: OrganizationMetrics = {
    totalEmployees: users.length,
    activeTrainees: Math.floor(users.length * 0.85),
    
    trainingInvestment: Math.random() * 500000 + 200000,
    revenuePerEmployee: Math.random() * 50000 + 100000,
    productivityIndex: Math.random() * 20 + 100, // 100-120
    
    strategicGoalsProgress: Math.random() * 30 + 70, // 70-100%
    innovationIndex: Math.random() * 40 + 60, // 60-100%
    customerSatisfaction: Math.random() * 1.5 + 3.5, // 3.5-5.0
    
    industryBenchmark: Math.random() * 20 + 70, // 70-90%
    marketVolatility: Math.random() * 0.5, // 0-0.5
    regulatoryChanges: Math.floor(Math.random() * 5)
  }
  
  return { users, departments, organization }
} 