import {
  calculatePersonalityAlignment,
  calculateCognitiveReadiness,
  calculateMotivationalAlignment,
  calculateBehavioralPredictors,
  calculatePsychometricReadinessScore,
  generateMockPsychometricData,
  type BigFiveProfile,
  type GamingPsychometrics,
  type VisionBoardAnalysis,
  type PsychometricUserData
} from '../readiness-score-psychometric'

describe('Psychometric Readiness Score System', () => {
  
  describe('calculatePersonalityAlignment', () => {
    const mockBigFive: BigFiveProfile = {
      userId: 'test-user',
      assessmentDate: '2024-01-15',
      openness: 75,
      conscientiousness: 85,
      extraversion: 65,
      agreeableness: 70,
      neuroticism: 25, // Lower is better
      learningStyle: 'visual',
      workStyle: 'collaborative',
      leadershipPotential: 80,
      changeAdaptability: 85,
      stressResilience: 90
    }

    it('should calculate high alignment for manager role with appropriate traits', () => {
      const score = calculatePersonalityAlignment(mockBigFive, 'Senior Manager')
      expect(score).toBeGreaterThan(80)
      expect(score).toBeLessThanOrEqual(100)
    })

    it('should handle unknown roles with default score', () => {
      const score = calculatePersonalityAlignment(mockBigFive, 'Unknown Role')
      expect(score).toBe(75) // Default score
    })

    it('should apply bonuses for high derived characteristics', () => {
      const highPotentialProfile = {
        ...mockBigFive,
        leadershipPotential: 95,
        changeAdaptability: 90,
        stressResilience: 85
      }
      
      const score = calculatePersonalityAlignment(highPotentialProfile, 'Manager')
      expect(score).toBeGreaterThan(calculatePersonalityAlignment(mockBigFive, 'Manager'))
    })
  })

  describe('calculateCognitiveReadiness', () => {
    const mockGaming: GamingPsychometrics = {
      userId: 'test-user',
      gameSessionData: {
        totalSessions: 50,
        averageSessionDuration: 25,
        completionRate: 85,
        lastPlayedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
      },
      cognitiveMetrics: {
        problemSolvingSpeed: 85,
        decisionQuality: 80,
        adaptabilityIndex: 90,
        persistenceScore: 75,
        collaborationEffectiveness: 80
      },
      behavioralPatterns: {
        riskTolerance: 70,
        competitivenessDrive: 85,
        helpSeekingBehavior: 60,
        mentorshipInclination: 75,
        innovationMindset: 80
      },
      learningPreferences: {
        preferredComplexity: 'high',
        feedbackSensitivity: 80,
        autonomyPreference: 75,
        socialLearningPreference: 65
      }
    }

    it('should calculate cognitive readiness from gaming metrics', () => {
      const score = calculateCognitiveReadiness(mockGaming)
      expect(score).toBeGreaterThan(0)
      expect(score).toBeLessThanOrEqual(100)
    })

    it('should apply engagement factor based on recent activity', () => {
      const recentGaming = {
        ...mockGaming,
        gameSessionData: {
          ...mockGaming.gameSessionData,
          lastPlayedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
        }
      }
      
      const recentScore = calculateCognitiveReadiness(recentGaming)
      const oldScore = calculateCognitiveReadiness({
        ...mockGaming,
        gameSessionData: {
          ...mockGaming.gameSessionData,
          lastPlayedDate: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString() // 100 days ago
        }
      })
      
      expect(recentScore).toBeGreaterThan(oldScore)
    })
  })

  describe('calculateMotivationalAlignment', () => {
    const mockVisionBoard: VisionBoardAnalysis = {
      userId: 'test-user',
      visionBoardId: 'vb-123',
      createdDate: '2024-01-01',
      lastUpdatedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
      goalAlignment: {
        personalGoalsCount: 5,
        careerGoalsCount: 3,
        learningGoalsCount: 4,
        alignmentWithOrgVision: 85,
        goalSpecificity: 80,
        timelineRealism: 75
      },
      motivationProfile: {
        intrinsicMotivation: 85,
        extrinsicMotivation: 60,
        growthMindset: 90,
        purposeClarity: 80,
        ambitionLevel: 75
      },
      engagementPredictors: {
        likelyEngagementLevel: 85,
        retentionRisk: 20, // Low risk
        promotionReadiness: 80,
        learningVelocity: 85,
        leadershipAspiration: 70
      }
    }

    it('should calculate motivational alignment from vision board data', () => {
      const score = calculateMotivationalAlignment(mockVisionBoard)
      expect(score).toBeGreaterThan(0)
      expect(score).toBeLessThanOrEqual(100)
    })

    it('should apply recency bonus for recently updated vision boards', () => {
      const recentVisionBoard = {
        ...mockVisionBoard,
        lastUpdatedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
      }
      
      const recentScore = calculateMotivationalAlignment(recentVisionBoard)
      const oldScore = calculateMotivationalAlignment(mockVisionBoard)
      
      expect(recentScore).toBeGreaterThanOrEqual(oldScore)
    })
  })

  describe('calculateBehavioralPredictors', () => {
    const mockUser: PsychometricUserData = {
      userId: 'test-user',
      departmentId: 'eng-dept',
      role: 'Manager',
      enrolledCourses: 15,
      completedCourses: 12,
      inProgressCourses: 3,
      averageCompletion: 80,
      totalLearningHours: 120,
      lastActivityDate: new Date('2024-01-15'),
      assessmentScores: [85, 90, 78, 92],
      averageAssessmentScore: 85,
      certificationsEarned: 2,
      certificationsRequired: 3,
      performanceRating: 4.2,
      goalCompletionRate: 85,
      skillRatings: { 'leadership': 4, 'technical': 5 },
      loginFrequency: 3,
      forumParticipation: 5,
      peerInteractions: 8,
      feedbackScores: [4.5, 4.8, 4.2],
      bigFive: {
        userId: 'test-user',
        assessmentDate: '2024-01-10',
        openness: 75,
        conscientiousness: 85,
        extraversion: 65,
        agreeableness: 70,
        neuroticism: 25,
        learningStyle: 'visual',
        workStyle: 'collaborative',
        leadershipPotential: 80,
        changeAdaptability: 85,
        stressResilience: 90
      }
    }

    it('should calculate behavioral predictors with available data', () => {
      const score = calculateBehavioralPredictors(mockUser)
      expect(score).toBeGreaterThan(0)
      expect(score).toBeLessThanOrEqual(100)
    })

    it('should handle partial data gracefully', () => {
      const partialUser = {
        ...mockUser,
        bigFive: undefined,
        gamingPsychometrics: undefined
      }
      
      const score = calculateBehavioralPredictors(partialUser)
      expect(score).toBeGreaterThan(0)
      expect(score).toBeLessThanOrEqual(100)
    })

    it('should apply performance bonus for high performers', () => {
      const highPerformer = { ...mockUser, performanceRating: 4.8 }
      const averagePerformer = { ...mockUser, performanceRating: 3.5 }
      
      const highScore = calculateBehavioralPredictors(highPerformer)
      const averageScore = calculateBehavioralPredictors(averagePerformer)
      
      expect(highScore).toBeGreaterThan(averageScore)
    })
  })

  describe('calculatePsychometricReadinessScore', () => {
    let mockData: any

    beforeEach(() => {
      mockData = generateMockPsychometricData()
    })

    it('should generate a valid psychometric readiness result', () => {
      const result = calculatePsychometricReadinessScore(mockData)
      
      expect(result.overallScore).toBeGreaterThan(0)
      expect(result.overallScore).toBeLessThanOrEqual(100)
      expect(result.psychometricComponents).toBeDefined()
      expect(result.dataCompleteness).toBeGreaterThan(0)
      expect(result.dataCompleteness).toBeLessThanOrEqual(1)
      expect(result.predictiveConfidence).toBeGreaterThan(0)
      expect(result.predictiveConfidence).toBeLessThanOrEqual(100)
    })

    it('should include all psychometric components', () => {
      const result = calculatePsychometricReadinessScore(mockData)
      
      expect(result.psychometricComponents.personalityAlignment).toBeGreaterThanOrEqual(0)
      expect(result.psychometricComponents.cognitiveReadiness).toBeGreaterThanOrEqual(0)
      expect(result.psychometricComponents.motivationalAlignment).toBeGreaterThanOrEqual(0)
      expect(result.psychometricComponents.behavioralPredictors).toBeGreaterThanOrEqual(0)
    })

    it('should generate appropriate insights and recommendations', () => {
      const result = calculatePsychometricReadinessScore(mockData)
      
      expect(Array.isArray(result.insights)).toBe(true)
      expect(Array.isArray(result.recommendations)).toBe(true)
      expect(result.insights.length).toBeGreaterThan(0)
      expect(result.recommendations.length).toBeGreaterThan(0)
    })

    it('should handle edge cases with empty user array', () => {
      const emptyData = {
        users: [],
        departments: mockData.departments,
        organization: mockData.organization
      }
      
      const result = calculatePsychometricReadinessScore(emptyData)
      expect(result.overallScore).toBe(0)
    })
  })

  describe('generateMockPsychometricData', () => {
    it('should generate realistic mock data', () => {
      const mockData = generateMockPsychometricData()
      
      expect(mockData.users.length).toBeGreaterThan(0)
      expect(mockData.departments.length).toBeGreaterThan(0)
      expect(mockData.organization).toBeDefined()
      
      // Check that some users have psychometric data
      const usersWithBigFive = mockData.users.filter(u => u.bigFive)
      const usersWithGaming = mockData.users.filter(u => u.gamingPsychometrics)
      const usersWithVision = mockData.users.filter(u => u.visionBoard)
      
      expect(usersWithBigFive.length).toBeGreaterThan(0)
      expect(usersWithGaming.length).toBeGreaterThan(0)
      expect(usersWithVision.length).toBeGreaterThan(0)
    })

    it('should generate valid Big Five profiles', () => {
      const mockData = generateMockPsychometricData()
      const userWithBigFive = mockData.users.find(u => u.bigFive)
      
      if (userWithBigFive && userWithBigFive.bigFive) {
        const bigFive = userWithBigFive.bigFive
        expect(bigFive.openness).toBeGreaterThanOrEqual(0)
        expect(bigFive.openness).toBeLessThanOrEqual(100)
        expect(bigFive.conscientiousness).toBeGreaterThanOrEqual(0)
        expect(bigFive.conscientiousness).toBeLessThanOrEqual(100)
        expect(['visual', 'auditory', 'kinesthetic', 'reading']).toContain(bigFive.learningStyle)
        expect(['collaborative', 'independent', 'hybrid']).toContain(bigFive.workStyle)
      }
    })
  })
}) 