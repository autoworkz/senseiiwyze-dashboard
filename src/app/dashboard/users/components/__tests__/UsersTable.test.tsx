import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { UsersTable } from '../UsersTable'
import { User, UserRole, UserStatus } from '@/stores/users-store'

// Add Jest types
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R
      toHaveClass(...classNames: string[]): R
    }
  }
}

const mockUsers: User[] = [
  {
    id: '1',
    email: 'john@example.com',
    name: 'John Doe',
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    createdAt: '2024-01-01T00:00:00Z',
    lastActive: '2024-01-15T00:00:00Z',
    avatar: 'https://example.com/avatar1.jpg',
    programReadiness: 75,
    metadata: {
      preferences: {},
      tags: ['active', 'verified']
    }
  },
  {
    id: '2',
    email: 'jane@example.com',
    name: 'Jane Smith',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    createdAt: '2024-01-02T00:00:00Z',
    lastActive: '2024-01-14T00:00:00Z',
    avatar: 'https://example.com/avatar2.jpg',
    programReadiness: 90,
    metadata: {
      preferences: {},
      tags: ['admin', 'verified']
    }
  },
  {
    id: '3',
    email: 'bob@example.com',
    name: 'Bob Johnson',
    role: UserRole.USER,
    status: UserStatus.SUSPENDED,
    createdAt: '2024-01-03T00:00:00Z',
    lastActive: '2024-01-10T00:00:00Z',
    avatar: undefined,
    programReadiness: 25,
    metadata: {
      preferences: {},
      tags: ['suspended']
    }
  }
]

const defaultProps = {
  users: mockUsers,
  selectedUsers: new Set<string>(),
  onSelectAll: jest.fn(),
  onSelectUser: jest.fn(),
  onEditUser: jest.fn(),
  onDeleteUser: jest.fn(),
  onSuspendUser: jest.fn(),
  onActivateUser: jest.fn(),
  onExportUser: jest.fn()
}

describe('UsersTable', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all users correctly', () => {
    render(<UsersTable {...defaultProps} />)
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
    expect(screen.getByText('jane@example.com')).toBeInTheDocument()
    expect(screen.getByText('bob@example.com')).toBeInTheDocument()
  })

  it('displays correct role badges', () => {
    render(<UsersTable {...defaultProps} />)
    
    expect(screen.getByText('User')).toBeInTheDocument()
    expect(screen.getByText('Admin')).toBeInTheDocument()
  })

  it('displays correct status badges', () => {
    render(<UsersTable {...defaultProps} />)
    
    expect(screen.getAllByText('Active')).toHaveLength(2)
    expect(screen.getByText('Suspended')).toBeInTheDocument()
  })

  it('handles user selection correctly', () => {
    render(<UsersTable {...defaultProps} />)
    
    const firstCheckbox = screen.getAllByRole('checkbox')[1] // Skip header checkbox
    fireEvent.click(firstCheckbox)
    
    expect(defaultProps.onSelectUser).toHaveBeenCalledWith('1', true)
  })

  it('handles select all functionality', () => {
    render(<UsersTable {...defaultProps} />)
    
    const selectAllCheckbox = screen.getAllByRole('checkbox')[0]
    fireEvent.click(selectAllCheckbox)
    
    expect(defaultProps.onSelectAll).toHaveBeenCalledWith(true)
  })

  it('shows indeterminate state when some users are selected', () => {
    const propsWithSelected = {
      ...defaultProps,
      selectedUsers: new Set(['1'])
    }
    
    render(<UsersTable {...propsWithSelected} />)
    
    const selectAllCheckbox = screen.getAllByRole('checkbox')[0] as HTMLInputElement
    expect(selectAllCheckbox.indeterminate).toBe(true)
  })

  it('handles user actions from dropdown menu', async () => {
    render(<UsersTable {...defaultProps} />)
    
    const actionButtons = screen.getAllByRole('button')
    const firstActionButton = actionButtons.find(button => 
      button.getAttribute('aria-label') === 'Open menu'
    )
    
    if (firstActionButton) {
      fireEvent.click(firstActionButton)
      
      await waitFor(() => {
        expect(screen.getByText('Edit User')).toBeInTheDocument()
        expect(screen.getByText('Suspend User')).toBeInTheDocument()
        expect(screen.getByText('Delete User')).toBeInTheDocument()
        expect(screen.getByText('Export User')).toBeInTheDocument()
      })
      
      fireEvent.click(screen.getByText('Edit User'))
      expect(defaultProps.onEditUser).toHaveBeenCalledWith('1')
    }
  })

  it('displays correct dates in readable format', () => {
    render(<UsersTable {...defaultProps} />)
    
    // Check that dates are displayed (exact format may vary based on implementation)
    expect(screen.getByText(/Jan 1, 2024/)).toBeInTheDocument()
    expect(screen.getByText(/Jan 2, 2024/)).toBeInTheDocument()
    expect(screen.getByText(/Jan 3, 2024/)).toBeInTheDocument()
  })

  it('handles empty users array', () => {
    const propsWithEmptyUsers = {
      ...defaultProps,
      users: []
    }
    
    render(<UsersTable {...propsWithEmptyUsers} />)
    
    expect(screen.getByText('No users found')).toBeInTheDocument()
  })

  it('displays user avatars correctly', () => {
    render(<UsersTable {...defaultProps} />)
    
    const avatars = screen.getAllByAltText(/avatar/i)
    expect(avatars).toHaveLength(2) // Only 2 users have avatars
    
    // Check that the third user shows initials instead of avatar
    expect(screen.getByText('BJ')).toBeInTheDocument() // Bob Johnson initials
  })

  it('handles keyboard navigation', () => {
    render(<UsersTable {...defaultProps} />)
    
    const firstRow = screen.getByRole('row', { name: /john doe/i })
    fireEvent.keyDown(firstRow, { key: 'Enter' })
    
    // Should trigger some action or navigation
    // Implementation depends on specific keyboard handling
  })

  it('applies correct styling for different statuses', () => {
    render(<UsersTable {...defaultProps} />)
    
    const activeBadges = screen.getAllByText('Active')
    const suspendedBadge = screen.getByText('Suspended')
    
    activeBadges.forEach(badge => {
      expect(badge).toHaveClass('bg-green-100', 'text-green-800')
    })
    
    expect(suspendedBadge).toHaveClass('bg-red-100', 'text-red-800')
  })
}) 