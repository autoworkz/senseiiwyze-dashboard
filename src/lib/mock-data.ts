// Centralized mock data service for the SenseiiWyze dashboard

interface LearningModule {
  id: string
  title: string
  progress: number
  status: 'completed' | 'in-progress' | 'upcoming'
  duration: string
}

interface Recommendation {
  title: string
  type: 'course' | 'article' | 'video'
  reason: string
}

interface Intervention {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  action: string
  dueDate: string
}

export const mockData = {
  // Executive KPIs
  organizationKPIs: {
    completionRate: {
      value: 87.3,
      trend: 2.1,
      period: 'vs last month',
      history: [82.1, 83.5, 84.2, 85.1, 85.2, 87.3],
    },
    costPerCompletion: {
      value: 284,
      trend: -12,
      period: 'vs last month',
      history: [296, 291, 288, 285, 289, 284],
    },
    atRiskCount: {
      value: 23,
      trend: 5,
      period: 'vs yesterday',
      alert: true,
    },
    readinessIndex: {
      value: 58.4,
      formula: '(completion × active × (1-risk)) / 100',
      zones: [
        { min: 0, max: 40, color: 'red', label: 'Critical' },
        { min: 40, max: 70, color: 'amber', label: 'Moderate' },
        { min: 70, max: 100, color: 'green', label: 'Excellent' },
      ],
    },
    totalLearners: 1247,
    activeLearners: 892,
    programsRunning: 12,
    averageTimeToComplete: 14.2,
  },
  
  // Team stats for admin dashboard
  teamStats: {
    totalLearners: 156,
    averageSkillFit: 73.2,
    atRiskPercentage: 14.7,
    atRiskCount: 23,
    weeklyActive: 68,
    completionRate: 82.5,
    averageProgress: 67.8,
  },
  
  // Sample learners for team management
  learners: Array.from({ length: 50 }, (_, i) => ({
    id: `user-${i + 1}`,
    name: `Learner ${i + 1}`,
    email: `learner${i + 1}@example.com`,
    track: ['data_ai', 'cyberops', 'cloud', 'network'][i % 4],
    skillFit: Math.floor(Math.random() * 40) + 60,
    progress: Math.floor(Math.random() * 100),
    lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    riskStatus: Math.random() > 0.85 ? 'red' : Math.random() > 0.7 ? 'amber' : 'green',
    coach: `Coach ${(i % 5) + 1}`,
    joinDate: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000),
  })),
  
  // Individual learner metrics
  myMetrics: {
    skillFit: 73,
    skillFitTrend: 5,
    visionAlignment: 0.82,
    gameIndex: 0.91,
    gritScore: 7.2,
    overallProgress: 68,
    personality: {
      openness: 0.7,
      conscientiousness: 0.85,
      extraversion: 0.6,
      agreeableness: 0.75,
      neuroticism: 0.3,
    },
    interventions: [
      {
        id: 'int-1',
        title: 'Complete Module 3 Lab',
        description: 'You\'re 2 days behind schedule on the networking lab',
        priority: 'high' as const,
        action: 'Start Lab',
        dueDate: '2024-01-15',
      },
      {
        id: 'int-2',
        title: 'Join Study Group',
        description: 'Connect with peers working on similar modules',
        priority: 'medium' as const,
        action: 'Find Group',
        dueDate: '2024-01-20',
      },
    ] as Intervention[],
  },
  
  // Goals data for learner
  myGoals: {
    visionGoals: [
      {
        id: 'goal-1',
        title: 'Become a Cloud Architect',
        description: 'Master AWS, Azure, and GCP platforms',
        progress: 65,
        targetDate: '2024-06-01',
        category: 'career',
      },
      {
        id: 'goal-2',
        title: 'Complete Cybersecurity Certification',
        description: 'Earn CompTIA Security+ certification',
        progress: 40,
        targetDate: '2024-04-15',
        category: 'certification',
      },
    ],
    activeGoals: [
      {
        id: 'active-1',
        title: 'Complete Python Fundamentals',
        progress: 85,
        dueDate: '2024-01-30',
      },
      {
        id: 'active-2',
        title: 'Network Security Lab',
        progress: 45,
        dueDate: '2024-02-05',
      },
    ],
    achievements: [
      {
        icon: '🏆',
        title: 'First Module Complete',
        date: '2 days ago',
      },
      {
        icon: '🎯',
        title: 'Goal Setter',
        date: '1 week ago',
      },
      {
        icon: '🔥',
        title: '7-Day Streak',
        date: '3 days ago',
      },
    ],
    stats: {
      totalGoals: 8,
      completedGoals: 3,
      activeGoals: 5,
    },
  },
  
  // Game statistics
  myGameStats: {
    overview: {
      totalScore: 2847,
      rank: 12,
      gamesPlayed: 45,
      winRate: 78,
    },
    userRank: {
      position: 12,
      totalPlayers: 156,
      percentile: 92,
    },
    leaderboard: [
      { rank: 1, name: 'Alex Chen', score: 3245 },
      { rank: 2, name: 'Sarah Kim', score: 3198 },
      { rank: 3, name: 'Mike Johnson', score: 3156 },
      { rank: 12, name: 'You', score: 2847 },
    ],
    achievements: [
      {
        icon: '🥇',
        title: 'Top 10 Player',
        description: 'Reached top 10 in leaderboard',
        unlocked: true,
      },
      {
        icon: '🎯',
        title: 'Perfect Score',
        description: 'Achieved 100% in a game',
        unlocked: true,
      },
      {
        icon: '🔥',
        title: 'Hot Streak',
        description: 'Win 10 games in a row',
        unlocked: false,
      },
    ],
    recentGames: [
      {
        icon: '🧠',
        name: 'Algorithm Challenge',
        category: 'Programming',
        score: 95,
        date: '2 hours ago',
      },
      {
        icon: '🔐',
        name: 'Security Quiz',
        category: 'Cybersecurity',
        score: 88,
        date: '1 day ago',
      },
    ],
    metrics: {
      totalGames: 45,
      averageScore: 87,
      bestStreak: 8,
      timeSpent: 24,
    },
  },
  
  // Learning data
  myLearningData: {
    progress: {
      overall: 68,
      currentModule: 'Network Security Fundamentals',
      moduleProgress: 75,
      estimatedCompletion: '2 weeks',
    },
    modules: [
      {
        id: 'mod-1',
        title: 'Python Fundamentals',
        progress: 100,
        status: 'completed' as const,
        duration: '4 weeks',
      },
      {
        id: 'mod-2',
        title: 'Network Security',
        progress: 75,
        status: 'in-progress' as const,
        duration: '6 weeks',
      },
      {
        id: 'mod-3',
        title: 'Cloud Architecture',
        progress: 0,
        status: 'upcoming' as const,
        duration: '8 weeks',
      },
    ] as LearningModule[],
    recommendations: [
      {
        title: 'Advanced Python Patterns',
        type: 'course' as const,
        reason: 'Based on your Python completion',
      },
      {
        title: 'Security Best Practices',
        type: 'article' as const,
        reason: 'Complements current module',
      },
    ] as Recommendation[],
    currentPath: [
      {
        title: 'Complete Network Lab 3',
        description: 'Hands-on firewall configuration',
        completed: false,
        current: true,
        estimatedTime: '2 hours',
      },
      {
        title: 'Security Assessment Quiz',
        description: 'Test your knowledge',
        completed: false,
        current: false,
        estimatedTime: '30 minutes',
      },
    ],
    stats: {
      modulesCompleted: 3,
      hoursLearned: 127,
      currentStreak: 12,
      skillsAcquired: 18,
    },
  },
  
  // Detailed learner profile for admin view
  learnerProfile: {
    id: 'user-1',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Alex Johnson',
    track: 'data_ai',
    joinDate: '2023-09-15',
    coach: 'Sarah Chen',
    metrics: {
      skillFit: 78,
      progress: 65,
      riskScore: 'low',
      engagement: 85,
      performance: 82,
    },
    progress: {
      modulesCompleted: 4,
      currentModule: 'Machine Learning Basics',
      overallProgress: 65,
      timeSpent: 89,
    },
    interventions: [
      {
        id: 'int-1',
        date: '2024-01-10',
        type: 'check-in',
        description: 'Weekly progress review',
        outcome: 'positive',
      },
      {
        id: 'int-2',
        date: '2024-01-05',
        type: 'support',
        description: 'Additional resources provided',
        outcome: 'pending',
      },
    ],
    patterns: {
      peakHours: '9 AM - 11 AM',
      learningStyle: 'Visual + Hands-on',
      sessionLength: '45 minutes',
      weeklyActivity: '18 hours',
    },
    riskFactors: [
      {
        factor: 'Engagement Drop',
        severity: 'medium',
        description: 'Slight decrease in activity last week',
      },
      {
        factor: 'Module Difficulty',
        severity: 'low',
        description: 'Current module complexity may be challenging',
      },
    ],
  },
}

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// API wrapper functions
export async function getOrganizationKPIs() {
  await delay(500)
  return mockData.organizationKPIs
}

export async function getTeamStats() {
  await delay(300)
  return mockData.teamStats
}

export async function getLearners(params: Record<string, unknown>) {
  await delay(400)
  
  // Apply filters
  let filtered = [...mockData.learners]
  
  if (params.track) {
    filtered = filtered.filter(l => l.track === params.track)
  }
  
  if (params.risk) {
    filtered = filtered.filter(l => l.riskStatus === params.risk)
  }
  
  return {
    data: filtered.slice(0, 25),
    total: filtered.length,
    page: 1,
  }
}

export async function getLearnerProfile() {
  await delay(300)
  return mockData.learnerProfile
}

export async function getMyMetrics() {
  await delay(300)
  return mockData.myMetrics
}

export async function getMyGoals() {
  await delay(250)
  return mockData.myGoals
}

export async function getMyGameStats() {
  await delay(300)
  return mockData.myGameStats
}

export async function getMyLearningData() {
  await delay(350)
  return mockData.myLearningData
}
