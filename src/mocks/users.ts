import { User, UserRole, UserStatus } from '@/types/user'

// Mock user data for testing and development
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'john.doe@company.com',
    name: 'John Doe',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    programReadiness: 95,
    lastActive: '2 hours ago',
    createdAt: '2024-01-15T10:30:00Z',
    metadata: {
      location: 'San Francisco, CA',
      timezone: 'America/Los_Angeles',
      preferences: {
        theme: 'dark',
        notifications: true,
        language: 'en'
      },
      tags: ['admin', 'premium', 'early-adopter']
    },
    department: 'Engineering',
    completedModules: 12,
    totalModules: 12
  },
  {
    id: '2',
    email: 'jane.smith@company.com',
    name: 'Jane Smith',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    programReadiness: 78,
    lastActive: '1 day ago',
    createdAt: '2024-02-20T14:15:00Z',
    metadata: {
      location: 'New York, NY',
      timezone: 'America/New_York',
      preferences: {
        theme: 'light',
        notifications: false,
        language: 'en'
      },
      tags: ['premium', 'marketing']
    },
    department: 'Marketing',
    completedModules: 8,
    totalModules: 12
  },
  {
    id: '3',
    email: 'mike.wilson@company.com',
    name: 'Mike Wilson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
    role: UserRole.USER,
    status: UserStatus.INACTIVE,
    programReadiness: 45,
    lastActive: '1 week ago',
    createdAt: '2024-03-10T09:45:00Z',
    metadata: {
      location: 'Chicago, IL',
      timezone: 'America/Chicago',
      preferences: {
        theme: 'dark',
        notifications: true,
        language: 'en'
      },
      tags: ['basic', 'sales']
    },
    department: 'Sales',
    completedModules: 5,
    totalModules: 12
  },
  {
    id: '4',
    email: 'sarah.johnson@company.com',
    name: 'Sarah Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    role: UserRole.GUEST,
    status: UserStatus.SUSPENDED,
    programReadiness: 12,
    lastActive: '2 weeks ago',
    createdAt: '2024-04-05T16:20:00Z',
    metadata: {
      location: 'Austin, TX',
      timezone: 'America/Chicago',
      preferences: {
        theme: 'light',
        notifications: false,
        language: 'en'
      },
      tags: ['guest', 'trial']
    },
    department: 'Support',
    completedModules: 1,
    totalModules: 12
  },
  {
    id: '5',
    email: 'david.brown@company.com',
    name: 'David Brown',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    programReadiness: 88,
    lastActive: '3 hours ago',
    createdAt: '2024-01-25T11:00:00Z',
    metadata: {
      location: 'Seattle, WA',
      timezone: 'America/Los_Angeles',
      preferences: {
        theme: 'dark',
        notifications: true,
        language: 'en'
      },
      tags: ['premium', 'engineering']
    },
    department: 'Engineering',
    completedModules: 10,
    totalModules: 12
  },
  {
    id: '6',
    email: 'emma.davis@company.com',
    name: 'Emma Davis',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    programReadiness: 67,
    lastActive: '5 hours ago',
    createdAt: '2024-02-28T13:30:00Z',
    metadata: {
      location: 'Boston, MA',
      timezone: 'America/New_York',
      preferences: {
        theme: 'light',
        notifications: true,
        language: 'en'
      },
      tags: ['basic', 'operations']
    },
    department: 'Operations',
    completedModules: 7,
    totalModules: 12
  },
  {
    id: '7',
    email: 'alex.chen@company.com',
    name: 'Alex Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    programReadiness: 92,
    lastActive: '30 minutes ago',
    createdAt: '2024-01-10T08:15:00Z',
    metadata: {
      location: 'Toronto, ON',
      timezone: 'America/Toronto',
      preferences: {
        theme: 'dark',
        notifications: true,
        language: 'en'
      },
      tags: ['admin', 'premium', 'technical-lead']
    },
    department: 'Engineering',
    completedModules: 12,
    totalModules: 12
  },
  {
    id: '8',
    email: 'lisa.garcia@company.com',
    name: 'Lisa Garcia',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa',
    role: UserRole.USER,
    status: UserStatus.INACTIVE,
    programReadiness: 34,
    lastActive: '3 days ago',
    createdAt: '2024-03-15T10:45:00Z',
    metadata: {
      location: 'Miami, FL',
      timezone: 'America/New_York',
      preferences: {
        theme: 'light',
        notifications: false,
        language: 'es'
      },
      tags: ['basic', 'sales']
    },
    department: 'Sales',
    completedModules: 4,
    totalModules: 12
  },
  {
    id: '9',
    email: 'tom.anderson@company.com',
    name: 'Tom Anderson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tom',
    role: UserRole.GUEST,
    status: UserStatus.ACTIVE,
    programReadiness: 23,
    lastActive: '1 day ago',
    createdAt: '2024-04-12T15:30:00Z',
    metadata: {
      location: 'Denver, CO',
      timezone: 'America/Denver',
      preferences: {
        theme: 'light',
        notifications: true,
        language: 'en'
      },
      tags: ['guest', 'trial']
    },
    department: 'Support',
    completedModules: 2,
    totalModules: 12
  },
  {
    id: '10',
    email: 'rachel.kim@company.com',
    name: 'Rachel Kim',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rachel',
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    programReadiness: 81,
    lastActive: '4 hours ago',
    createdAt: '2024-02-05T12:00:00Z',
    metadata: {
      location: 'Portland, OR',
      timezone: 'America/Los_Angeles',
      preferences: {
        theme: 'dark',
        notifications: true,
        language: 'en'
      },
      tags: ['premium', 'marketing']
    },
    department: 'Marketing',
    completedModules: 9,
    totalModules: 12
  }
]

// Helper functions for generating different types of mock data
export const generateMockUser = (overrides: Partial<User> = {}): User => {
  const id = (Date.now() + Math.random()).toString()
  const names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack']
  const departments = ['Engineering', 'Marketing', 'Sales', 'Support', 'Operations']
  const name = names[Math.floor(Math.random() * names.length)]
  
  return {
    id,
    email: `${name.toLowerCase()}@company.com`,
    name,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.toLowerCase()}`,
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    programReadiness: Math.floor(Math.random() * 100),
    lastActive: `${Math.floor(Math.random() * 30) + 1} days ago`,
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: {
      location: 'Unknown',
      timezone: 'UTC',
      preferences: {
        theme: 'light',
        notifications: true,
        language: 'en'
      },
      tags: ['basic']
    },
    department: departments[Math.floor(Math.random() * departments.length)],
    completedModules: Math.floor(Math.random() * 12),
    totalModules: 12,
    ...overrides
  }
}

export const generateMockUsers = (count: number, overrides: Partial<User> = {}): User[] => {
  return Array.from({ length: count }, (_, index) => 
    generateMockUser({ 
      id: (index + 1).toString(),
      ...overrides 
    })
  )
}

// Specific mock data for different scenarios
export const mockActiveUsers = mockUsers.filter(user => user.status === UserStatus.ACTIVE)
export const mockInactiveUsers = mockUsers.filter(user => user.status === UserStatus.INACTIVE)
export const mockSuspendedUsers = mockUsers.filter(user => user.status === UserStatus.SUSPENDED)
export const mockAdminUsers = mockUsers.filter(user => user.role === UserRole.ADMIN)
export const mockGuestUsers = mockUsers.filter(user => user.role === UserRole.GUEST)

// Mock data for testing specific features
export const mockUsersWithHighReadiness = mockUsers.filter(user => user.programReadiness >= 80)
export const mockUsersWithLowReadiness = mockUsers.filter(user => user.programReadiness <= 30)
export const mockUsersByDepartment = {
  Engineering: mockUsers.filter(user => user.department === 'Engineering'),
  Marketing: mockUsers.filter(user => user.department === 'Marketing'),
  Sales: mockUsers.filter(user => user.department === 'Sales'),
  Support: mockUsers.filter(user => user.department === 'Support'),
  Operations: mockUsers.filter(user => user.department === 'Operations')
}

// Mock pagination data
export const mockPaginationData = {
  page: 1,
  pageSize: 10,
  total: mockUsers.length,
  totalPages: Math.ceil(mockUsers.length / 10)
}

// Mock filter data
export const mockFilterData = {
  search: '',
  status: [] as UserStatus[],
  roles: [] as UserRole[],
  tags: [] as string[]
}

// Mock sorting data
export const mockSortingData = {
  field: 'createdAt' as keyof User,
  direction: 'desc' as 'asc' | 'desc'
}

// Filter interface for consistency with the store
export interface UserFilters {
  search: string;
  status: UserStatus[];
  roles: UserRole[];
  dateRange?: { from: string; to: string };
  tags: string[];
}

// Filter users based on criteria
export const filterUsers = (users: User[], filters: UserFilters): User[] => {
  return users.filter(user => {
    // Search filter
    if (filters.search && !user.name.toLowerCase().includes(filters.search.toLowerCase()) && 
        !user.email.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    // Status filter
    if (filters.status.length > 0 && !filters.status.includes(user.status)) {
      return false;
    }
    
    // Role filter
    if (filters.roles.length > 0 && !filters.roles.includes(user.role)) {
      return false;
    }
    
    // Date range filter
    if (filters.dateRange?.from && filters.dateRange?.to) {
      const userDate = new Date(user.createdAt);
      const fromDate = new Date(filters.dateRange.from);
      const toDate = new Date(filters.dateRange.to);
      
      if (userDate < fromDate || userDate > toDate) {
        return false;
      }
    }
    
    // Tags filter
    if (filters.tags.length > 0 && !filters.tags.some(tag => user.metadata.tags.includes(tag))) {
      return false;
    }
    
    return true;
  });
};

// Sort users by field and direction
export const sortUsers = (users: User[], field: keyof User, direction: 'asc' | 'desc'): User[] => {
  return [...users].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];
    
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return direction === 'asc' ? -1 : 1;
    if (bVal == null) return direction === 'asc' ? 1 : -1;
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

// Paginate users
export const paginateUsers = (users: User[], page: number, pageSize: number): User[] => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return users.slice(start, end);
}; 