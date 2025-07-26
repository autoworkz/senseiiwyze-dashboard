import { render, screen } from '@testing-library/react'
import { usePathname } from 'next/navigation'
import { DashboardNav } from '../DashboardNav'

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>

describe('DashboardNav', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/me')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Learner Navigation', () => {
    const learnerUser = { role: 'learner' as const, name: 'Test Learner' }

    it('should render learner navigation items', () => {
      render(<DashboardNav user={learnerUser} />)
      
      expect(screen.getByText('Overview')).toBeInTheDocument()
      expect(screen.getByText('Goals')).toBeInTheDocument()
      expect(screen.getByText('Games')).toBeInTheDocument()
      expect(screen.getByText('Learn')).toBeInTheDocument()
    })

    it('should highlight active navigation item', () => {
      mockUsePathname.mockReturnValue('/me/goals')
      render(<DashboardNav user={learnerUser} />)
      
      const goalsLink = screen.getByText('Goals').closest('a')
      expect(goalsLink).toHaveClass('bg-primary')
    })

    it('should have correct navigation links', () => {
      render(<DashboardNav user={learnerUser} />)
      
      expect(screen.getByText('Overview').closest('a')).toHaveAttribute('href', '/me')
      expect(screen.getByText('Goals').closest('a')).toHaveAttribute('href', '/me/goals')
      expect(screen.getByText('Games').closest('a')).toHaveAttribute('href', '/me/games')
      expect(screen.getByText('Learn').closest('a')).toHaveAttribute('href', '/me/learn')
    })
  })

  describe('Admin Navigation', () => {
    const adminUser = { role: 'admin' as const, name: 'Test Admin' }

    it('should render admin navigation items', () => {
      render(<DashboardNav user={adminUser} />)
      
      expect(screen.getByText('Team')).toBeInTheDocument()
      expect(screen.getByText('Tasks')).toBeInTheDocument()
      expect(screen.getByText('Courses')).toBeInTheDocument()
      expect(screen.getByText('Messages')).toBeInTheDocument()
    })

    it('should have correct admin navigation links', () => {
      render(<DashboardNav user={adminUser} />)
      
      expect(screen.getByText('Team').closest('a')).toHaveAttribute('href', '/team')
      expect(screen.getByText('Tasks').closest('a')).toHaveAttribute('href', '/team/tasks')
      expect(screen.getByText('Courses').closest('a')).toHaveAttribute('href', '/team/courses')
      expect(screen.getByText('Messages').closest('a')).toHaveAttribute('href', '/team/messages')
    })
  })

  describe('Executive Navigation', () => {
    const executiveUser = { role: 'executive' as const, name: 'Test Executive' }

    it('should render executive navigation items', () => {
      render(<DashboardNav user={executiveUser} />)
      
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      expect(screen.getByText('Reports')).toBeInTheDocument()
      expect(screen.getByText('Present')).toBeInTheDocument()
    })

    it('should have correct executive navigation links', () => {
      render(<DashboardNav user={executiveUser} />)
      
      expect(screen.getByText('Dashboard').closest('a')).toHaveAttribute('href', '/org')
      expect(screen.getByText('Reports').closest('a')).toHaveAttribute('href', '/org/reports')
      expect(screen.getByText('Present').closest('a')).toHaveAttribute('href', '/org/presentation')
    })
  })

  describe('Mobile Navigation', () => {
    const learnerUser = { role: 'learner' as const, name: 'Test Learner' }

    it('should render mobile navigation variant', () => {
      render(<DashboardNav user={learnerUser} variant="mobile" />)
      
      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('flex', 'justify-around')
    })

    it('should show icons and labels in mobile view', () => {
      render(<DashboardNav user={learnerUser} variant="mobile" />)
      
      // Check for text labels in mobile
      expect(screen.getByText('Overview')).toBeInTheDocument()
      expect(screen.getByText('Goals')).toBeInTheDocument()
      expect(screen.getByText('Games')).toBeInTheDocument()
      expect(screen.getByText('Learn')).toBeInTheDocument()
    })
  })

  describe('Navigation Flow', () => {
    const learnerUser = { role: 'learner' as const, name: 'Test Learner' }

    it('should maintain expected navigation order for learners', () => {
      render(<DashboardNav user={learnerUser} />)
      
      const links = screen.getAllByRole('link')
      const expectedOrder = ['/me', '/me/goals', '/me/games', '/me/learn']
      
      links.forEach((link, index) => {
        expect(link).toHaveAttribute('href', expectedOrder[index])
      })
    })

    it('should handle nested route highlighting', () => {
      mockUsePathname.mockReturnValue('/me/goals/subpage')
      render(<DashboardNav user={learnerUser} />)
      
      const goalsLink = screen.getByText('Goals').closest('a')
      expect(goalsLink).toHaveClass('bg-primary')
    })
  })
})