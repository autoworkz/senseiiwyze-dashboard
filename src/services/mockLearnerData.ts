import { IndividualLearner, LearnerSummaryStats, SkillAssessment, ProgramProgress, CoachingRecommendation, ActivityEvent } from '@/components/org/individual/types'
import { getReadinessStatus } from '@/utils/readinessColors'

/**
 * Mock data service for individual learner tracking
 * Provides realistic data that showcases all features of the MagicPatterns design
 */

// Sample skills data
const skillTemplates: Record<string, SkillAssessment[]> = {
  'Senior Developer': [
    { name: 'Technical Architecture', score: 92, target: 90, lastUpdated: '2024-01-15' },
    { name: 'Code Review', score: 88, target: 85, lastUpdated: '2024-01-10' },
    { name: 'Team Leadership', score: 85, target: 80, lastUpdated: '2024-01-12' },
    { name: 'System Design', score: 90, target: 90, lastUpdated: '2024-01-08' },
    { name: 'Communication', score: 87, target: 85, lastUpdated: '2024-01-14' }
  ],
  'Junior Developer': [
    { name: 'JavaScript Fundamentals', score: 70, target: 80, lastUpdated: '2024-01-16' },
    { name: 'React Development', score: 65, target: 75, lastUpdated: '2024-01-14' },
    { name: 'Testing Practices', score: 58, target: 70, lastUpdated: '2024-01-12' },
    { name: 'Git Workflow', score: 75, target: 80, lastUpdated: '2024-01-10' },
    { name: 'Problem Solving', score: 72, target: 75, lastUpdated: '2024-01-15' }
  ],
  'Product Manager': [
    { name: 'Product Strategy', score: 90, target: 85, lastUpdated: '2024-01-16' },
    { name: 'Data Analysis', score: 82, target: 80, lastUpdated: '2024-01-13' },
    { name: 'User Research', score: 88, target: 85, lastUpdated: '2024-01-11' },
    { name: 'Stakeholder Management', score: 85, target: 80, lastUpdated: '2024-01-14' },
    { name: 'Roadmap Planning', score: 87, target: 85, lastUpdated: '2024-01-09' }
  ],
  'UX Designer': [
    { name: 'Design Systems', score: 45, target: 70, lastUpdated: '2024-01-16' },
    { name: 'User Research', score: 50, target: 65, lastUpdated: '2024-01-12' },
    { name: 'Prototyping', score: 42, target: 60, lastUpdated: '2024-01-10' },
    { name: 'Visual Design', score: 55, target: 70, lastUpdated: '2024-01-14' },
    { name: 'Collaboration', score: 48, target: 65, lastUpdated: '2024-01-08' }
  ]
}

// Sample program data
const programTemplates: Record<string, ProgramProgress[]> = {
  'Senior Developer': [
    {
      programId: 'arch-101',
      name: 'Advanced Architecture Patterns',
      completion: 85,
      status: 'in-progress',
      dueDate: '2024-02-15',
      modules: [
        { name: 'Microservices Design', completion: 100, status: 'completed' },
        { name: 'Event-Driven Architecture', completion: 90, status: 'in-progress' },
        { name: 'Distributed Systems', completion: 60, status: 'in-progress' }
      ]
    },
    {
      programId: 'lead-201',
      name: 'Technical Leadership',
      completion: 70,
      status: 'in-progress',
      dueDate: '2024-03-01'
    }
  ],
  'Junior Developer': [
    {
      programId: 'js-fundamentals',
      name: 'JavaScript Mastery',
      completion: 75,
      status: 'in-progress',
      dueDate: '2024-02-01',
      modules: [
        { name: 'ES6+ Features', completion: 100, status: 'completed' },
        { name: 'Async Programming', completion: 80, status: 'in-progress' },
        { name: 'Testing with Jest', completion: 45, status: 'in-progress' }
      ]
    },
    {
      programId: 'react-basics',
      name: 'React Development',
      completion: 60,
      status: 'in-progress',
      dueDate: '2024-02-20'
    }
  ],
  'Product Manager': [
    {
      programId: 'product-strategy',
      name: 'Strategic Product Management',
      completion: 90,
      status: 'in-progress',
      dueDate: '2024-01-30'
    },
    {
      programId: 'data-driven-pm',
      name: 'Data-Driven Decision Making',
      completion: 80,
      status: 'in-progress',
      dueDate: '2024-02-10'
    }
  ],
  'UX Designer': [
    {
      programId: 'design-fundamentals',
      name: 'UX Design Foundations',
      completion: 30,
      status: 'in-progress',
      dueDate: '2024-03-15',
      modules: [
        { name: 'User Research Methods', completion: 40, status: 'in-progress' },
        { name: 'Wireframing & Prototyping', completion: 25, status: 'in-progress' },
        { name: 'Design Systems', completion: 15, status: 'not-started' }
      ]
    }
  ]
}

// Generate mock learners
export const mockLearners: IndividualLearner[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@company.com',
    role: 'Senior Developer',
    department: 'Engineering',
    manager: 'Alex Thompson',
    // avatar: undefined,
    joinDate: '2022-03-15',
    overallReadiness: 88,
    status: getReadinessStatus(88),
    trend: 'up',
    lastActivity: '2 hours ago',
    skills: skillTemplates['Senior Developer'],
    programs: programTemplates['Senior Developer'],
    recommendations: [
      {
        id: 'rec-1',
        title: 'Advanced System Design Workshop',
        description: 'Enhance architectural thinking for complex distributed systems',
        priority: 'medium',
        type: 'skill-gap',
        estimatedTime: '2-3 weeks',
        suggestedActions: ['Enroll in Advanced Architecture course', 'Shadow senior architect on current project'],
        createdAt: '2024-01-10'
      }
    ],
    recentActivity: [
      {
        id: 'act-1',
        type: 'training_completed',
        title: 'Microservices Design Module',
        description: 'Completed with 95% score',
        timestamp: '2024-01-15T10:30:00Z'
      },
      {
        id: 'act-2',
        type: 'skill_assessment',
        title: 'Technical Architecture Assessment',
        description: 'Scored 92/100',
        timestamp: '2024-01-12T14:00:00Z'
      }
    ],
    readinessHistory: [
      { date: '2023-12-01', score: 78 },
      { date: '2023-12-15', score: 82 },
      { date: '2024-01-01', score: 85 },
      { date: '2024-01-15', score: 88 }
    ],
    timezone: 'America/Los_Angeles',
    preferredContactMethod: 'slack',
    nextScheduledSession: {
      type: 'coaching',
      date: '2024-01-22T15:00:00Z',
      title: 'Architecture Review Session'
    }
  },
  {
    id: '2',
    name: 'Mike Rodriguez',
    email: 'mike.rodriguez@company.com',
    role: 'Junior Developer',
    department: 'Engineering',
    manager: 'Sarah Chen',
    // avatar: undefined,
    joinDate: '2023-09-01',
    overallReadiness: 67,
    status: getReadinessStatus(67),
    trend: 'up',
    lastActivity: '1 day ago',
    skills: skillTemplates['Junior Developer'],
    programs: programTemplates['Junior Developer'],
    recommendations: [
      {
        id: 'rec-2',
        title: 'JavaScript Fundamentals Review',
        description: 'Focus on ES6+ features and async programming patterns',
        priority: 'high',
        type: 'skill-gap',
        estimatedTime: '1-2 weeks',
        suggestedActions: ['Complete JavaScript Mastery modules', 'Pair programming with senior developer'],
        createdAt: '2024-01-12'
      },
      {
        id: 'rec-3',
        title: 'Testing Best Practices',
        description: 'Improve unit testing skills and TDD practices',
        priority: 'high',
        type: 'skill-gap',
        estimatedTime: '2 weeks',
        suggestedActions: ['Complete Testing with Jest module', 'Write tests for current project features'],
        createdAt: '2024-01-10'
      }
    ],
    recentActivity: [
      {
        id: 'act-3',
        type: 'training_completed',
        title: 'ES6+ Features Module',
        description: 'Completed with 88% score',
        timestamp: '2024-01-14T09:15:00Z'
      }
    ],
    readinessHistory: [
      { date: '2023-12-01', score: 45 },
      { date: '2023-12-15', score: 52 },
      { date: '2024-01-01', score: 60 },
      { date: '2024-01-15', score: 67 }
    ],
    timezone: 'America/New_York',
    preferredContactMethod: 'email',
    nextScheduledSession: {
      type: 'coaching',
      date: '2024-01-20T16:00:00Z',
      title: 'JavaScript Skills Review'
    }
  },
  {
    id: '3',
    name: 'Lisa Wang',
    email: 'lisa.wang@company.com',
    role: 'Product Manager',
    department: 'Product',
    manager: 'David Kim',
    // avatar: undefined,
    joinDate: '2022-01-10',
    overallReadiness: 86,
    status: getReadinessStatus(86),
    trend: 'stable',
    lastActivity: '3 hours ago',
    skills: skillTemplates['Product Manager'],
    programs: programTemplates['Product Manager'],
    recommendations: [
      {
        id: 'rec-4',
        title: 'Advanced Analytics Training',
        description: 'Deepen data analysis skills for better product decisions',
        priority: 'medium',
        type: 'skill-gap',
        estimatedTime: '1 week',
        suggestedActions: ['Complete Data-Driven PM course', 'Shadow data analyst on customer research'],
        createdAt: '2024-01-08'
      }
    ],
    recentActivity: [
      {
        id: 'act-4',
        type: 'milestone_achieved',
        title: 'Product Strategy Certification',
        description: 'Achieved 90% in strategic planning assessment',
        timestamp: '2024-01-13T11:20:00Z'
      }
    ],
    readinessHistory: [
      { date: '2023-12-01', score: 84 },
      { date: '2023-12-15', score: 85 },
      { date: '2024-01-01', score: 86 },
      { date: '2024-01-15', score: 86 }
    ],
    timezone: 'America/Los_Angeles',
    preferredContactMethod: 'teams'
  },
  {
    id: '4',
    name: 'James Thompson',
    email: 'james.thompson@company.com',
    role: 'UX Designer',
    department: 'Design',
    manager: 'Emily Rodriguez',
    // avatar: undefined,
    joinDate: '2023-11-01',
    overallReadiness: 47,
    status: getReadinessStatus(47),
    trend: 'down',
    lastActivity: '5 days ago',
    skills: skillTemplates['UX Designer'],
    programs: programTemplates['UX Designer'],
    recommendations: [
      {
        id: 'rec-5',
        title: 'Immediate Design Foundations Review',
        description: 'Critical skill gaps in fundamental UX principles need urgent attention',
        priority: 'high',
        type: 'skill-gap',
        estimatedTime: '3-4 weeks',
        suggestedActions: ['1:1 intensive coaching sessions', 'Complete UX Foundations course', 'Pair with senior designer'],
        createdAt: '2024-01-15'
      },
      {
        id: 'rec-6',
        title: 'Engagement and Motivation Support',
        description: 'Low activity levels indicate possible engagement issues',
        priority: 'high',
        type: 'engagement',
        estimatedTime: 'Ongoing',
        suggestedActions: ['Schedule career development discussion', 'Assess workload and project fit', 'Connect with mentor'],
        createdAt: '2024-01-16'
      }
    ],
    recentActivity: [
      {
        id: 'act-5',
        type: 'training_completed',
        title: 'User Research Methods',
        description: 'Completed with 65% score',
        timestamp: '2024-01-11T13:45:00Z'
      }
    ],
    readinessHistory: [
      { date: '2023-12-01', score: 55 },
      { date: '2023-12-15', score: 52 },
      { date: '2024-01-01', score: 49 },
      { date: '2024-01-15', score: 47 }
    ],
    timezone: 'America/Chicago',
    preferredContactMethod: 'email'
  },
  {
    id: '5',
    name: 'Emma Davis',
    email: 'emma.davis@company.com',
    role: 'Senior Developer',
    department: 'Engineering',
    manager: 'Alex Thompson',
    // avatar: undefined,
    joinDate: '2021-08-20',
    overallReadiness: 94,
    status: getReadinessStatus(94),
    trend: 'up',
    lastActivity: '30 minutes ago',
    skills: skillTemplates['Senior Developer'].map(skill => ({ ...skill, score: skill.score + 5 })),
    programs: programTemplates['Senior Developer'],
    recommendations: [
      {
        id: 'rec-7',
        title: 'Leadership Mentoring Opportunity',
        description: 'Ready to mentor junior developers and lead technical initiatives',
        priority: 'low',
        type: 'performance',
        estimatedTime: 'Ongoing',
        suggestedActions: ['Assign junior developer mentees', 'Lead architecture discussions', 'Consider tech lead role'],
        createdAt: '2024-01-05'
      }
    ],
    recentActivity: [
      {
        id: 'act-6',
        type: 'milestone_achieved',
        title: 'Technical Leadership Excellence',
        description: 'Achieved top scores across all leadership metrics',
        timestamp: '2024-01-16T08:30:00Z'
      }
    ],
    readinessHistory: [
      { date: '2023-12-01', score: 89 },
      { date: '2023-12-15', score: 91 },
      { date: '2024-01-01', score: 92 },
      { date: '2024-01-15', score: 94 }
    ],
    timezone: 'America/Los_Angeles',
    preferredContactMethod: 'slack'
  }
]

/**
 * Calculate summary statistics from learner data
 */
export function calculateSummaryStats(learners: IndividualLearner[]): LearnerSummaryStats {
  const totalLearners = learners.length
  const averageReadiness = Math.round(
    learners.reduce((sum, learner) => sum + learner.overallReadiness, 0) / totalLearners
  )
  
  const statusCounts = learners.reduce((acc, learner) => {
    acc[learner.status] = (acc[learner.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const trendCounts = learners.reduce((acc, learner) => {
    acc[learner.trend] = (acc[learner.trend] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  return {
    totalLearners,
    averageReadiness,
    readyForDeployment: statusCounts['ready'] || 0,
    needsCoaching: statusCounts['needs-coaching'] || 0,
    atRisk: statusCounts['at-risk'] || 0,
    critical: statusCounts['critical'] || 0,
    trends: {
      improving: trendCounts['up'] || 0,
      declining: trendCounts['down'] || 0,
      stable: trendCounts['stable'] || 0
    }
  }
}

// Export summary stats
export const mockSummaryStats = calculateSummaryStats(mockLearners) 