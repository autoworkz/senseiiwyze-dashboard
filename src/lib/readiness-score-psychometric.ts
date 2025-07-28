/**
 * Psychometric-Enhanced Readiness Score System
 * 
 * This extends the base readiness calculation with:
 * - Gaming system psychometric analysis
 * - Vision board alignment assessment
 * - Big Five personality factor integration
 * - Behavioral prediction modeling
 */

import {
  type UserLearningData,
  type DepartmentData,
  type OrganizationMetrics,
  type ReadinessCalculationInput,
  type ReadinessCalculationResult,
  READINESS_CALCULATION_CONFIG
} from './readiness-score-calculation'

// ===== PSYCHOMETRIC DATA INTERFACES =====

export interface BigFiveProfile {
  userId: string
  assessmentDate: string
  
  // Big Five factors (0-100 scale)
  openness: number           // Openness to Experience
  conscientiousness: number  // Conscientiousness
  extraversion: number       // Extraversion
  agreeableness: number      // Agreeableness
  neuroticism: number        // Neuroticism (emotional stability)
  
  // Derived insights
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading'
  workStyle: 'collaborative' | 'independent' | 'hybrid'
  leadershipPotential: number // 0-100
  changeAdaptability: number  // 0-100
  stressResilience: number    // 0-100
}

export interface GamingPsychometrics {
  userId: string
  gameSessionData: {
    totalSessions: number
    averageSessionDuration: number // minutes
    completionRate: number         // 0-100%
    lastPlayedDate: string
  }
  
  // Cognitive metrics from gameplay
  cognitiveMetrics: {
    problemSolvingSpeed: number    // 0-100 (faster = higher)
    decisionQuality: number        // 0-100 (accuracy under pressure)
    adaptabilityIndex: number      // 0-100 (adaptation to new challenges)
    persistenceScore: number       // 0-100 (continuation despite failures)
    collaborationEffectiveness: number // 0-100 (team game performance)
  }
  
  // Behavioral patterns
  behavioralPatterns: {
    riskTolerance: number          // 0-100 (willingness to take calculated risks)
    competitivenessDrive: number   // 0-100 (motivation to excel)
    helpSeekingBehavior: number    // 0-100 (willingness to ask for help)
    mentorshipInclination: number  // 0-100 (tendency to help others)
    innovationMindset: number      // 0-100 (creative problem-solving)
  }
  
  // Learning preferences inferred from gameplay
  learningPreferences: {
    preferredComplexity: 'low' | 'medium' | 'high'
    feedbackSensitivity: number   // 0-100 (response to feedback)
    autonomyPreference: number     // 0-100 (preference for self-direction)
    socialLearningPreference: number // 0-100 (preference for group learning)
  }
}

export interface VisionBoardAnalysis {
  userId: string
  visionBoardId: string
  createdDate: string
  lastUpdatedDate: string
  
  // Vision alignment metrics
  goalAlignment: {
    personalGoalsCount: number
    careerGoalsCount: number
    learningGoalsCount: number
    alignmentWithOrgVision: number // 0-100% similarity to org objectives
    goalSpecificity: number        // 0-100% how specific/measurable goals are
    timelineRealism: number        // 0-100% realistic timeline assessment
  }
  
  // Motivation indicators
  motivationProfile: {
    intrinsicMotivation: number    // 0-100 (internal drive indicators)
    extrinsicMotivation: number    // 0-100 (external reward indicators)
    growthMindset: number          // 0-100 (focus on development vs. achievement)
    purposeClarity: number         // 0-100 (clarity of personal purpose)
    ambitionLevel: number          // 0-100 (scope and scale of aspirations)
  }
  
  // Behavioral prediction
  engagementPredictors: {
    likelyEngagementLevel: number  // 0-100 predicted engagement
    retentionRisk: number          // 0-100 (0 = low risk, 100 = high risk)
    promotionReadiness: number     // 0-100 readiness for advancement
    learningVelocity: number       // 0-100 predicted learning speed
    leadershipAspiration: number   // 0-100 desire for leadership roles
  }
}

// ===== ENHANCED USER DATA INTERFACE =====

export interface PsychometricUserData extends UserLearningData {
  bigFive?: BigFiveProfile
  gamingPsychometrics?: GamingPsychometrics
  visionBoard?: VisionBoardAnalysis
}

export interface PsychometricCalculationInput {
  users: PsychometricUserData[]
  departments: DepartmentData[]
  organization: OrganizationMetrics
}

// ===== ENHANCED CALCULATION WEIGHTS =====

export const PSYCHOMETRIC_CALCULATION_CONFIG = {
  // Enhanced component weights
  weights: {
    individualCompetency: 0.25,        // Reduced slightly
    teamEffectiveness: 0.20,           // Reduced slightly  
    organizationalAlignment: 0.15,     // Reduced slightly
    adaptabilityIndex: 0.15,           // Same
    riskMitigation: 0.10,              // Same
    psychometricReadiness: 0.15,       // NEW: Psychometric insights
  },
  
  // Psychometric sub-component weights
  psychometricWeights: {
    personalityAlignment: 0.30,        // Big Five alignment with role
    cognitiveReadiness: 0.25,          // Gaming cognitive metrics
    motivationalAlignment: 0.25,       // Vision board motivation
    behavioralPredictors: 0.20,        // Combined behavioral insights
  },
  
  // Big Five optimal ranges for different roles
  rolePersonalityProfiles: {
    'manager': {
      openness: { min: 60, max: 85 },
      conscientiousness: { min: 70, max: 95 },
      extraversion: { min: 60, max: 90 },
      agreeableness: { min: 65, max: 85 },
      neuroticism: { min: 10, max: 40 }, // Lower is better
    },
    'individual_contributor': {
      openness: { min: 50, max: 90 },
      conscientiousness: { min: 60, max: 90 },
      extraversion: { min: 30, max: 80 },
      agreeableness: { min: 50, max: 80 },
      neuroticism: { min: 10, max: 50 },
    },
    'creative_role': {
      openness: { min: 75, max: 95 },
      conscientiousness: { min: 40, max: 80 },
      extraversion: { min: 40, max: 85 },
      agreeableness: { min: 40, max: 75 },
      neuroticism: { min: 20, max: 60 },
    },
    'sales_role': {
      openness: { min: 60, max: 85 },
      conscientiousness: { min: 65, max: 90 },
      extraversion: { min: 75, max: 95 },
      agreeableness: { min: 70, max: 90 },
      neuroticism: { min: 10, max: 35 },
    }
  }
} as const

// ===== PSYCHOMETRIC CALCULATION FUNCTIONS =====

/**
 * Calculate personality alignment score based on Big Five and role requirements
 */
export function calculatePersonalityAlignment(
  bigFive: BigFiveProfile, 
  role: string
): number {
  // Determine role category
  const roleCategory = categorizeRole(role)
  const optimalProfile = PSYCHOMETRIC_CALCULATION_CONFIG.rolePersonalityProfiles[roleCategory]
  
  if (!optimalProfile) return 75 // Default score if role not categorized
  
  // Calculate alignment for each Big Five factor
  const alignmentScores = [
    calculateFactorAlignment(bigFive.openness, optimalProfile.openness),
    calculateFactorAlignment(bigFive.conscientiousness, optimalProfile.conscientiousness),
    calculateFactorAlignment(bigFive.extraversion, optimalProfile.extraversion),
    calculateFactorAlignment(bigFive.agreeableness, optimalProfile.agreeableness),
    calculateFactorAlignment(bigFive.neuroticism, optimalProfile.neuroticism),
  ]
  
  // Weighted average (conscientiousness and emotional stability are most important for performance)
  const personalityScore = (
    alignmentScores[0] * 0.20 + // Openness
    alignmentScores[1] * 0.30 + // Conscientiousness (most predictive)
    alignmentScores[2] * 0.15 + // Extraversion
    alignmentScores[3] * 0.15 + // Agreeableness
    alignmentScores[4] * 0.20   // Neuroticism (emotional stability)
  )
  
  // Bonus for derived characteristics
  const leadershipBonus = bigFive.leadershipPotential > 70 ? 5 : 0
  const adaptabilityBonus = bigFive.changeAdaptability > 80 ? 5 : 0
  const resilienceBonus = bigFive.stressResilience > 75 ? 5 : 0
  
  return Math.min(100, personalityScore + leadershipBonus + adaptabilityBonus + resilienceBonus)
}

/**
 * Calculate cognitive readiness from gaming psychometrics
 */
export function calculateCognitiveReadiness(gaming: GamingPsychometrics): number {
  const { cognitiveMetrics, behavioralPatterns, learningPreferences } = gaming
  
  // Core cognitive score (60% weight)
  const cognitiveScore = (
    cognitiveMetrics.problemSolvingSpeed * 0.25 +
    cognitiveMetrics.decisionQuality * 0.25 +
    cognitiveMetrics.adaptabilityIndex * 0.25 +
    cognitiveMetrics.persistenceScore * 0.25
  )
  
  // Behavioral enhancement (30% weight)
  const behavioralScore = (
    behavioralPatterns.riskTolerance * 0.15 +
    behavioralPatterns.competitivenessDrive * 0.20 +
    behavioralPatterns.innovationMindset * 0.25 +
    behavioralPatterns.mentorshipInclination * 0.20 +
    behavioralPatterns.helpSeekingBehavior * 0.20
  )
  
  // Learning optimization (10% weight)
  const learningScore = (
    learningPreferences.feedbackSensitivity * 0.30 +
    learningPreferences.autonomyPreference * 0.35 +
    learningPreferences.socialLearningPreference * 0.35
  )
  
  // Engagement factor based on game activity
  const engagementFactor = calculateEngagementFactor(gaming.gameSessionData)
  
  const overallScore = (
    cognitiveScore * 0.60 +
    behavioralScore * 0.30 +
    learningScore * 0.10
  ) * engagementFactor
  
  return Math.round(overallScore * 100) / 100
}

/**
 * Calculate motivational alignment from vision board analysis
 */
export function calculateMotivationalAlignment(visionBoard: VisionBoardAnalysis): number {
  const { goalAlignment, motivationProfile, engagementPredictors } = visionBoard
  
  // Goal quality and alignment (40% weight)
  const goalScore = (
    goalAlignment.alignmentWithOrgVision * 0.35 +
    goalAlignment.goalSpecificity * 0.25 +
    goalAlignment.timelineRealism * 0.25 +
    Math.min(100, (goalAlignment.personalGoalsCount + goalAlignment.careerGoalsCount) * 10) * 0.15
  )
  
  // Motivation profile (35% weight)
  const motivationScore = (
    motivationProfile.intrinsicMotivation * 0.30 +
    motivationProfile.growthMindset * 0.25 +
    motivationProfile.purposeClarity * 0.25 +
    motivationProfile.ambitionLevel * 0.20
  )
  
  // Engagement prediction (25% weight)
  const engagementScore = (
    engagementPredictors.likelyEngagementLevel * 0.40 +
    (100 - engagementPredictors.retentionRisk) * 0.30 +
    engagementPredictors.learningVelocity * 0.30
  )
  
  const alignmentScore = (
    goalScore * 0.40 +
    motivationScore * 0.35 +
    engagementScore * 0.25
  )
  
  // Recency bonus - more recent vision boards are more predictive
  const daysSinceUpdate = Math.floor(
    (Date.now() - new Date(visionBoard.lastUpdatedDate).getTime()) / (1000 * 60 * 60 * 24)
  )
  const recencyBonus = daysSinceUpdate <= 30 ? 5 : daysSinceUpdate <= 90 ? 2 : 0
  
  return Math.min(100, alignmentScore + recencyBonus)
}

/**
 * Calculate combined behavioral predictors
 */
export function calculateBehavioralPredictors(user: PsychometricUserData): number {
  let behavioralScore = 50 // Base score
  let dataPoints = 0
  
  // Big Five behavioral indicators
  if (user.bigFive) {
    const bigFiveIndicators = (
      user.bigFive.changeAdaptability * 0.25 +
      user.bigFive.stressResilience * 0.25 +
      user.bigFive.leadershipPotential * 0.25 +
      (100 - user.bigFive.neuroticism) * 0.25 // Emotional stability
    )
    behavioralScore += bigFiveIndicators * 0.4
    dataPoints++
  }
  
  // Gaming behavioral patterns
  if (user.gamingPsychometrics) {
    const gamingBehavioral = (
      user.gamingPsychometrics.behavioralPatterns.competitivenessDrive * 0.20 +
      user.gamingPsychometrics.behavioralPatterns.mentorshipInclination * 0.20 +
      user.gamingPsychometrics.behavioralPatterns.innovationMindset * 0.20 +
      user.gamingPsychometrics.cognitiveMetrics.collaborationEffectiveness * 0.20 +
      user.gamingPsychometrics.cognitiveMetrics.persistenceScore * 0.20
    )
    behavioralScore += gamingBehavioral * 0.4
    dataPoints++
  }
  
  // Vision board predictors
  if (user.visionBoard) {
    const visionPredictors = (
      user.visionBoard.engagementPredictors.promotionReadiness * 0.30 +
      user.visionBoard.engagementPredictors.leadershipAspiration * 0.25 +
      user.visionBoard.motivationProfile.growthMindset * 0.25 +
      (100 - user.visionBoard.engagementPredictors.retentionRisk) * 0.20
    )
    behavioralScore += visionPredictors * 0.4
    dataPoints++
  }
  
  // Performance correlation bonus
  if (user.performanceRating >= 4.0) {
    behavioralScore *= 1.1 // 10% bonus for high performers
  }
  
  // Adjust for data availability
  const dataCompletenessFactor = Math.min(1.0, dataPoints / 2) // Optimal with 2+ data sources
  
  return Math.min(100, (behavioralScore / (dataPoints || 1)) * dataCompletenessFactor)
}

/**
 * Main psychometric readiness calculation
 */
export function calculatePsychometricReadiness(users: PsychometricUserData[]): number {
  if (users.length === 0) return 0
  
  const userScores = users.map(user => {
    let personalityScore = 50
    let cognitiveScore = 50
    let motivationalScore = 50
    let behavioralScore = 50
    
    // Calculate individual components
    if (user.bigFive) {
      personalityScore = calculatePersonalityAlignment(user.bigFive, user.role)
    }
    
    if (user.gamingPsychometrics) {
      cognitiveScore = calculateCognitiveReadiness(user.gamingPsychometrics)
    }
    
    if (user.visionBoard) {
      motivationalScore = calculateMotivationalAlignment(user.visionBoard)
    }
    
    behavioralScore = calculateBehavioralPredictors(user)
    
    // Weighted psychometric score
    const psychometricScore = (
      personalityScore * PSYCHOMETRIC_CALCULATION_CONFIG.psychometricWeights.personalityAlignment +
      cognitiveScore * PSYCHOMETRIC_CALCULATION_CONFIG.psychometricWeights.cognitiveReadiness +
      motivationalScore * PSYCHOMETRIC_CALCULATION_CONFIG.psychometricWeights.motivationalAlignment +
      behavioralScore * PSYCHOMETRIC_CALCULATION_CONFIG.psychometricWeights.behavioralPredictors
    )
    
    return {
      score: psychometricScore,
      weight: Math.max(0.5, user.performanceRating / 5), // Weight by performance
      dataCompleteness: calculateDataCompleteness(user)
    }
  })
  
  // Calculate weighted average with data completeness consideration
  const totalWeight = userScores.reduce((sum, item) => sum + (item.weight * item.dataCompleteness), 0)
  const weightedAverage = userScores.reduce((sum, item) => 
    sum + (item.score * item.weight * item.dataCompleteness), 0
  ) / totalWeight
  
  return Math.round(weightedAverage * 100) / 100
}

// ===== ENHANCED MAIN CALCULATION =====

export interface PsychometricReadinessResult extends ReadinessCalculationResult {
  psychometricComponents: {
    personalityAlignment: number
    cognitiveReadiness: number
    motivationalAlignment: number
    behavioralPredictors: number
  }
  dataCompleteness: number
  predictiveConfidence: number
}

/**
 * Enhanced readiness calculation with psychometric data
 */
export function calculatePsychometricReadinessScore(
  input: PsychometricCalculationInput
): PsychometricReadinessResult {
  const { users, departments, organization } = input
  
  // Calculate traditional components (using base calculation)
  const { calculateIndividualCompetency, calculateTeamEffectiveness, 
          calculateOrganizationalAlignment, calculateAdaptabilityIndex, 
          calculateRiskMitigation } = require('./readiness-score-calculation')
  
  const traditionalComponents = {
    individualCompetency: calculateIndividualCompetency(users),
    teamEffectiveness: calculateTeamEffectiveness(departments, users),
    organizationalAlignment: calculateOrganizationalAlignment(organization, users),
    adaptabilityIndex: calculateAdaptabilityIndex(organization, users),
    riskMitigation: calculateRiskMitigation(departments, users, organization)
  }
  
  // Calculate new psychometric component
  const psychometricReadiness = calculatePsychometricReadiness(users)
  
  // Calculate psychometric sub-components for detailed analysis
  const psychometricComponents = {
    personalityAlignment: users.reduce((sum, user) => {
      if (!user.bigFive) return sum
      return sum + calculatePersonalityAlignment(user.bigFive, user.role)
    }, 0) / users.filter(u => u.bigFive).length || 0,
    
    cognitiveReadiness: users.reduce((sum, user) => {
      if (!user.gamingPsychometrics) return sum
      return sum + calculateCognitiveReadiness(user.gamingPsychometrics)
    }, 0) / users.filter(u => u.gamingPsychometrics).length || 0,
    
    motivationalAlignment: users.reduce((sum, user) => {
      if (!user.visionBoard) return sum
      return sum + calculateMotivationalAlignment(user.visionBoard)
    }, 0) / users.filter(u => u.visionBoard).length || 0,
    
    behavioralPredictors: users.reduce((sum, user) => 
      sum + calculateBehavioralPredictors(user), 0
    ) / users.length
  }
  
  // Calculate overall score with new weights
  const weights = PSYCHOMETRIC_CALCULATION_CONFIG.weights
  const overallScore = (
    traditionalComponents.individualCompetency * weights.individualCompetency +
    traditionalComponents.teamEffectiveness * weights.teamEffectiveness +
    traditionalComponents.organizationalAlignment * weights.organizationalAlignment +
    traditionalComponents.adaptabilityIndex * weights.adaptabilityIndex +
    traditionalComponents.riskMitigation * weights.riskMitigation +
    psychometricReadiness * weights.psychometricReadiness
  )
  
  // Calculate data completeness and predictive confidence
  const dataCompleteness = users.reduce((sum, user) => 
    sum + calculateDataCompleteness(user), 0
  ) / users.length
  
  const predictiveConfidence = Math.min(100, dataCompleteness * 100 + 
    (users.length >= 10 ? 20 : users.length * 2) // Sample size bonus
  )
  
  // Generate enhanced insights
  const insights = generatePsychometricInsights(
    overallScore,
    { ...traditionalComponents, psychometricReadiness },
    psychometricComponents,
    dataCompleteness
  )
  
  const recommendations = generatePsychometricRecommendations(
    psychometricComponents,
    traditionalComponents
  )
  
  return {
    overallScore: Math.round(overallScore * 100) / 100,
    components: {
      ...traditionalComponents,
      psychometricReadiness
    },
    psychometricComponents,
    gradeLevel: determineGradeLevel(overallScore),
    insights,
    recommendations,
    dataCompleteness,
    predictiveConfidence
  }
}

// ===== HELPER FUNCTIONS =====

function categorizeRole(role: string): keyof typeof PSYCHOMETRIC_CALCULATION_CONFIG.rolePersonalityProfiles {
  const roleStr = role.toLowerCase()
  if (roleStr.includes('manager') || roleStr.includes('lead') || roleStr.includes('director')) {
    return 'manager'
  }
  if (roleStr.includes('sales') || roleStr.includes('account') || roleStr.includes('business development')) {
    return 'sales_role'
  }
  if (roleStr.includes('designer') || roleStr.includes('creative') || roleStr.includes('architect')) {
    return 'creative_role'
  }
  return 'individual_contributor'
}

function calculateFactorAlignment(score: number, range: { min: number; max: number }): number {
  if (score >= range.min && score <= range.max) {
    return 100 // Perfect alignment
  }
  
  // Calculate distance from optimal range
  const distance = score < range.min ? range.min - score : score - range.max
  
  // Penalty decreases exponentially with distance
  return Math.max(0, 100 - (distance * 1.5))
}

function calculateEngagementFactor(gameData: GamingPsychometrics['gameSessionData']): number {
  const daysSinceLastPlay = Math.floor(
    (Date.now() - new Date(gameData.lastPlayedDate).getTime()) / (1000 * 60 * 60 * 24)
  )
  
  // Engagement based on recency and frequency
  let engagementFactor = 1.0
  
  if (daysSinceLastPlay <= 7) engagementFactor = 1.1     // Recent activity bonus
  else if (daysSinceLastPlay <= 30) engagementFactor = 1.0
  else if (daysSinceLastPlay <= 90) engagementFactor = 0.9
  else engagementFactor = 0.8
  
  // Adjust for session frequency
  const avgSessionsPerWeek = gameData.totalSessions / 12 // Assuming 3 months of data
  if (avgSessionsPerWeek >= 2) engagementFactor *= 1.1
  else if (avgSessionsPerWeek < 0.5) engagementFactor *= 0.9
  
  return Math.min(1.2, engagementFactor)
}

function calculateDataCompleteness(user: PsychometricUserData): number {
  let completeness = 0
  const totalPossible = 4 // Base learning data + 3 psychometric sources
  
  completeness += 1 // Base learning data always present
  
  if (user.bigFive) completeness += 1
  if (user.gamingPsychometrics) completeness += 1
  if (user.visionBoard) completeness += 1
  
  return completeness / totalPossible
}

function determineGradeLevel(score: number): PsychometricReadinessResult['gradeLevel'] {
  if (score >= 90) return 'excellent'
  if (score >= 75) return 'good'
  if (score >= 60) return 'moderate'
  if (score >= 40) return 'low'
  return 'critical'
}

function generatePsychometricInsights(
  overallScore: number,
  components: any,
  psychometricComponents: any,
  dataCompleteness: number
): string[] {
  const insights: string[] = []
  
  // Overall readiness insight
  insights.push(`Enhanced readiness score: ${overallScore.toFixed(1)}% with ${(dataCompleteness * 100).toFixed(0)}% data completeness`)
  
  // Psychometric-specific insights
  if (psychometricComponents.personalityAlignment > 80) {
    insights.push(`Strong personality-role alignment at ${psychometricComponents.personalityAlignment.toFixed(1)}%`)
  } else if (psychometricComponents.personalityAlignment < 60) {
    insights.push(`Personality-role misalignment detected: ${psychometricComponents.personalityAlignment.toFixed(1)}%`)
  }
  
  if (psychometricComponents.cognitiveReadiness > 85) {
    insights.push(`Exceptional cognitive readiness from gaming analytics: ${psychometricComponents.cognitiveReadiness.toFixed(1)}%`)
  }
  
  if (psychometricComponents.motivationalAlignment > 80) {
    insights.push(`High motivation and vision alignment: ${psychometricComponents.motivationalAlignment.toFixed(1)}%`)
  } else if (psychometricComponents.motivationalAlignment < 60) {
    insights.push(`Vision-organization misalignment needs attention: ${psychometricComponents.motivationalAlignment.toFixed(1)}%`)
  }
  
  // Behavioral prediction insights
  if (psychometricComponents.behavioralPredictors > 80) {
    insights.push(`Strong behavioral predictors for success: ${psychometricComponents.behavioralPredictors.toFixed(1)}%`)
  }
  
  return insights
}

function generatePsychometricRecommendations(
  psychometricComponents: any,
  traditionalComponents: any
): string[] {
  const recommendations: string[] = []
  
  // Personality-based recommendations
  if (psychometricComponents.personalityAlignment < 70) {
    recommendations.push('Consider role adjustments or personality-based coaching for better alignment')
  }
  
  // Cognitive readiness recommendations
  if (psychometricComponents.cognitiveReadiness < 70) {
    recommendations.push('Implement cognitive training programs and problem-solving workshops')
  }
  
  // Motivational recommendations
  if (psychometricComponents.motivationalAlignment < 70) {
    recommendations.push('Facilitate vision alignment sessions and personal development planning')
  }
  
  // Behavioral recommendations
  if (psychometricComponents.behavioralPredictors < 70) {
    recommendations.push('Focus on behavioral development and emotional intelligence training')
  }
  
  // Cross-component recommendations
  if (psychometricComponents.cognitiveReadiness > 80 && traditionalComponents.individualCompetency < 70) {
    recommendations.push('Leverage high cognitive ability with accelerated learning programs')
  }
  
  if (psychometricComponents.motivationalAlignment > 80 && traditionalComponents.teamEffectiveness < 70) {
    recommendations.push('Channel high motivation into team leadership and collaboration roles')
  }
  
  return recommendations
}

// ===== MOCK DATA GENERATOR FOR TESTING =====

export function generateMockPsychometricData(): PsychometricCalculationInput {
  const { generateMockCalculationData } = require('./readiness-score-calculation')
  const baseData = generateMockCalculationData()
  
  // Enhance users with psychometric data
  const enhancedUsers: PsychometricUserData[] = baseData.users.map((user, index) => ({
    ...user,
    
    // Big Five profile (70% of users have this data)
    bigFive: Math.random() > 0.3 ? {
      userId: user.userId,
      assessmentDate: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
      openness: Math.random() * 40 + 50,           // 50-90
      conscientiousness: Math.random() * 35 + 55,  // 55-90
      extraversion: Math.random() * 50 + 30,       // 30-80
      agreeableness: Math.random() * 40 + 45,      // 45-85
      neuroticism: Math.random() * 50 + 15,        // 15-65
      learningStyle: ['visual', 'auditory', 'kinesthetic', 'reading'][Math.floor(Math.random() * 4)] as any,
      workStyle: ['collaborative', 'independent', 'hybrid'][Math.floor(Math.random() * 3)] as any,
      leadershipPotential: Math.random() * 40 + 45,
      changeAdaptability: Math.random() * 35 + 55,
      stressResilience: Math.random() * 40 + 50
    } : undefined,
    
    // Gaming psychometrics (85% of users have this data)
    gamingPsychometrics: Math.random() > 0.15 ? {
      userId: user.userId,
      gameSessionData: {
        totalSessions: Math.floor(Math.random() * 100) + 20,
        averageSessionDuration: Math.random() * 30 + 15,
        completionRate: Math.random() * 40 + 60,
        lastPlayedDate: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString()
      },
      cognitiveMetrics: {
        problemSolvingSpeed: Math.random() * 35 + 55,
        decisionQuality: Math.random() * 40 + 50,
        adaptabilityIndex: Math.random() * 35 + 60,
        persistenceScore: Math.random() * 30 + 65,
        collaborationEffectiveness: Math.random() * 40 + 50
      },
      behavioralPatterns: {
        riskTolerance: Math.random() * 50 + 40,
        competitivenessDrive: Math.random() * 40 + 50,
        helpSeekingBehavior: Math.random() * 60 + 30,
        mentorshipInclination: Math.random() * 50 + 40,
        innovationMindset: Math.random() * 45 + 45
      },
      learningPreferences: {
        preferredComplexity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
        feedbackSensitivity: Math.random() * 40 + 50,
        autonomyPreference: Math.random() * 50 + 40,
        socialLearningPreference: Math.random() * 60 + 30
      }
    } : undefined,
    
    // Vision board analysis (60% of users have this data)
    visionBoard: Math.random() > 0.4 ? {
      userId: user.userId,
      visionBoardId: `vb-${index + 1}`,
      createdDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      lastUpdatedDate: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
      goalAlignment: {
        personalGoalsCount: Math.floor(Math.random() * 8) + 2,
        careerGoalsCount: Math.floor(Math.random() * 5) + 1,
        learningGoalsCount: Math.floor(Math.random() * 6) + 1,
        alignmentWithOrgVision: Math.random() * 40 + 50,
        goalSpecificity: Math.random() * 35 + 55,
        timelineRealism: Math.random() * 30 + 60
      },
      motivationProfile: {
        intrinsicMotivation: Math.random() * 40 + 50,
        extrinsicMotivation: Math.random() * 50 + 30,
        growthMindset: Math.random() * 35 + 60,
        purposeClarity: Math.random() * 45 + 45,
        ambitionLevel: Math.random() * 50 + 40
      },
      engagementPredictors: {
        likelyEngagementLevel: Math.random() * 40 + 55,
        retentionRisk: Math.random() * 30 + 10,
        promotionReadiness: Math.random() * 50 + 35,
        learningVelocity: Math.random() * 35 + 55,
        leadershipAspiration: Math.random() * 60 + 30
      }
    } : undefined
  }))
  
  return {
    users: enhancedUsers,
    departments: baseData.departments,
    organization: baseData.organization
  }
} 