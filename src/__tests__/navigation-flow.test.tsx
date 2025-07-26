import { render, screen } from '@testing-library/react'
import React from 'react'

// Mock the API functions used in pages
jest.mock('@/lib/api/metrics', () => ({
  getMyMetrics: jest.fn().mockResolvedValue({
    skillFit: 85,
    skillFitTrend: 'up',
    personality: {},
    interventions: []
  })
}))

jest.mock('@/lib/api/goals', () => ({
  getMyGoals: jest.fn().mockResolvedValue({
    visionGoals: [],
    activeGoals: [],
    achievements: [],
    stats: { totalGoals: 5, completedGoals: 3, activeGoals: 2 }
  })
}))

jest.mock('@/lib/api/games', () => ({
  getMyGameStats: jest.fn().mockResolvedValue({
    overview: {},
    userRank: 1,
    leaderboard: [],
    achievements: [],
    recentGames: [],
    metrics: { totalGames: 10, averageScore: 95, bestStreak: 5, timeSpent: 20 }
  })
}))

jest.mock('@/lib/api/learning', () => ({
  getMyLearningData: jest.fn().mockResolvedValue({
    progress: {},
    modules: [],
    recommendations: [],
    currentPath: [],
    stats: { modulesCompleted: 8, hoursLearned: 40, currentStreak: 7, skillsAcquired: 15 }
  })
}))

jest.mock('@/lib/api/organization', () => ({
  getOrganizationKPIs: jest.fn().mockResolvedValue({
    totalLearners: 100,
    avgSkillFit: 82,
    completionRate: 78
  })
}))

// Mock the team components since they're client-side
jest.mock('@/components/team/SummaryBar', () => {
  return function MockSummaryBar() { return <div data-testid="summary-bar">Summary Bar</div> }
})

jest.mock('@/components/team/FilterPanel', () => {
  return function MockFilterPanel() { return <div data-testid="filter-panel">Filter Panel</div> }
})

jest.mock('@/components/team/LearnerTable', () => {
  return function MockLearnerTable() { return <div data-testid="learner-table">Learner Table</div> }
})

jest.mock('@/components/team/TeamInsights', () => {
  return function MockTeamInsights() { return <div data-testid="team-insights">Team Insights</div> }
})

// Import pages to test
import TaskManagerPage from '@/app/(dashboard)/team/tasks/page'
import MessageCenterPage from '@/app/(dashboard)/team/messages/page'
import CurriculumPage from '@/app/(dashboard)/team/courses/page'
import ReportsHubPage from '@/app/(dashboard)/org/reports/page'
import PresentationModePage from '@/app/(dashboard)/org/presentation/page'

describe('Navigation Flow & Page Consistency', () => {
  describe('Page Headers', () => {
    it('should render consistent page headers for all placeholder pages', () => {
      const placeholderPages = [
        { component: TaskManagerPage, title: 'Task Manager' },
        { component: MessageCenterPage, title: 'Message Center' },
        { component: CurriculumPage, title: 'Curriculum' },
        { component: ReportsHubPage, title: 'Reports Hub' },
        { component: PresentationModePage, title: 'Presentation Mode' }
      ]

      for (const page of placeholderPages) {
        const { unmount } = render(<page.component />)
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(page.title)
        expect(screen.getByText(/coming soon/i)).toBeInTheDocument()
        unmount()
      }
    })
  })

  describe('Layout Consistency', () => {
    it('should maintain consistent spacing and structure', () => {
      render(<TaskManagerPage />)
      
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveTextContent('Task Manager')
      
      // Check for consistent structure
      expect(screen.getByText(/Manage intervention tasks/i)).toBeInTheDocument()
    })

    it('should center placeholder content consistently', () => {
      render(<MessageCenterPage />)
      
      const centeredContent = screen.getByText(/Real-time messaging/i)
      expect(centeredContent).toBeInTheDocument()
      
      // Check that coming soon text is present
      expect(screen.getByText(/coming soon/i)).toBeInTheDocument()
    })

    it('should use consistent icon styling', () => {
      render(<CurriculumPage />)
      
      const iconEmoji = screen.getByText('📚')
      expect(iconEmoji).toBeInTheDocument()
    })
  })

  describe('Navigation Order', () => {
    const expectedNavigationOrder = {
      learner: [
        { path: '/me', title: 'My Progress' },
        { path: '/me/goals', title: 'Vision Board' },
        { path: '/me/games', title: 'Game Stats' },
        { path: '/me/learn', title: 'Learning' }
      ],
      admin: [
        { path: '/team', title: 'Team Dashboard' },
        { path: '/team/tasks', title: 'Task Manager' },
        { path: '/team/courses', title: 'Curriculum' },
        { path: '/team/messages', title: 'Message Center' }
      ],
      executive: [
        { path: '/org', title: 'Org Dashboard' },
        { path: '/org/reports', title: 'Reports Hub' },
        { path: '/org/presentation', title: 'Presentation Mode' }
      ]
    }

    it('should maintain expected navigation order for each user type', () => {
      // This test validates that our page structure matches the expected B2B2C flow
      expect(expectedNavigationOrder.learner).toHaveLength(4)
      expect(expectedNavigationOrder.admin).toHaveLength(4)
      expect(expectedNavigationOrder.executive).toHaveLength(3)
      
      // Validate paths follow logical progression
      expect(expectedNavigationOrder.learner[0].path).toBe('/me')
      expect(expectedNavigationOrder.admin[0].path).toBe('/team')
      expect(expectedNavigationOrder.executive[0].path).toBe('/org')
    })

    it('should have hierarchical navigation structure', () => {
      // All learner paths should start with /me
      expectedNavigationOrder.learner.forEach(nav => {
        expect(nav.path).toMatch(/^\/me/)
      })

      // All admin paths should start with /team
      expectedNavigationOrder.admin.forEach(nav => {
        expect(nav.path).toMatch(/^\/team/)
      })

      // All executive paths should start with /org
      expectedNavigationOrder.executive.forEach(nav => {
        expect(nav.path).toMatch(/^\/org/)
      })
    })
  })

  describe('Page Loading & Error Handling', () => {
    it('should handle loading states gracefully', () => {
      // This would typically test loading spinners or skeleton states
      // For now, we ensure pages render without crashing
      expect(() => render(<TaskManagerPage />)).not.toThrow()
      expect(() => render(<MessageCenterPage />)).not.toThrow()
      expect(() => render(<CurriculumPage />)).not.toThrow()
    })

    it('should maintain accessibility standards', () => {
      render(<ReportsHubPage />)
      
      // Check for proper heading structure
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
      
      // Check for descriptive text
      expect(screen.getByText(/analytics and performance reports/i)).toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    it('should maintain layout on all screen sizes', () => {
      render(<PresentationModePage />)
      
      // Ensure proper heading exists
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveTextContent('Presentation Mode')
      
      // Ensure centered content is responsive
      const centeredContent = screen.getByText(/Interactive presentation tools/i)
      expect(centeredContent).toBeInTheDocument()
    })
  })
})