import { create } from 'zustand';
import { persist, combine } from 'zustand/middleware';
import { mockUsers, generateMockUsers, filterUsers, sortUsers, paginateUsers } from '@/mocks/users';
import { 
  User, 
  UserRole, 
  UserStatus, 
  UserMetadata, 
  UserFilters, 
  UserSorting, 
  PaginationState, 
  UserActivity 
} from '@/types/user';

// Main store state
export interface UsersState {
  // Data
  users: User[];
  selectedUser: User | null;
  userActivities: Record<string, UserActivity[]>;
  
  // UI State
  filters: UserFilters;
  sorting: UserSorting;
  pagination: PaginationState;
  isLoading: boolean;
  isDetailLoading: boolean;
  error: string | null;
  
  // Actions
  // Data fetching
  fetchUsers: (page?: number, pageSize?: number) => Promise<void>;
  fetchUserById: (id: string) => Promise<void>;
  fetchUserActivities: (userId: string) => Promise<void>;
  
  // CRUD operations
  createUser: (user: Omit<User, 'id' | 'createdAt' | 'lastActive'>) => Promise<void>;
  updateUser: (id: string, updates: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  
  // Bulk operations
  bulkUpdateUsers: (ids: string[], updates: Partial<User>) => Promise<void>;
  bulkDeleteUsers: (ids: string[]) => Promise<void>;
  
  // User actions
  suspendUser: (id: string) => Promise<void>;
  activateUser: (id: string) => Promise<void>;
  resetUserPassword: (id: string) => Promise<void>;
  
  // State management
  setSelectedUser: (user: User | null) => void;
  setFilters: (filters: Partial<UserFilters>) => void;
  setSorting: (field: keyof User, direction: 'asc' | 'desc') => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  
  // Local state updates (optimistic updates)
  updateLocalUser: (id: string, updates: Partial<User>) => void;
  removeLocalUser: (id: string) => void;
  addLocalUser: (user: User) => void;
  
  // Reset actions
  resetFilters: () => void;
  resetError: () => void;
  clearSelectedUser: () => void;
}

// Default values
const defaultFilters: UserFilters = {
  search: '',
  status: [],
  roles: [],
  tags: []
};

const defaultSorting: UserSorting = {
  field: 'createdAt',
  direction: 'desc'
};

const defaultPagination: PaginationState = {
  page: 1,
  pageSize: 10,
  total: 0
};

// Create the store
export const useUsersStore = create<UsersState>()(
  persist(
    (set, get) => ({
      // Initial state
      users: [],
      selectedUser: null,
      userActivities: {},
      filters: defaultFilters,
      sorting: defaultSorting,
      pagination: defaultPagination,
      isLoading: false,
      isDetailLoading: false,
      error: null,

      // Data fetching actions
      fetchUsers: async (page = get().pagination.page, pageSize = get().pagination.pageSize) => {
        set({ isLoading: true, error: null });
        try {
          // This will be replaced with actual API call
          // For now, we'll simulate the API response structure
          const response = await mockFetchUsers(page, pageSize, get().filters, get().sorting);
          
          set({
            users: response.users,
            pagination: {
              ...get().pagination,
              page,
              pageSize,
              total: response.total
            },
            isLoading: false
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch users',
            isLoading: false
          });
        }
      },

      fetchUserById: async (id: string) => {
        set({ isDetailLoading: true, error: null });
        try {
          const user = await mockFetchUserById(id);
          set({
            selectedUser: user,
            isDetailLoading: false
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch user',
            isDetailLoading: false
          });
        }
      },

      fetchUserActivities: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
          const activities = await mockFetchUserActivities(userId);
          set({
            userActivities: {
              ...get().userActivities,
              [userId]: activities
            },
            isLoading: false
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch user activities',
            isLoading: false
          });
        }
      },

      // CRUD operations
      createUser: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const newUser = await mockCreateUser(userData);
          set({
            users: [...get().users, newUser],
            pagination: {
              ...get().pagination,
              total: get().pagination.total + 1
            },
            isLoading: false
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to create user',
            isLoading: false
          });
        }
      },

      updateUser: async (id: string, updates: Partial<User>) => {
        set({ isLoading: true, error: null });
        try {
          const updatedUser = await mockUpdateUser(id, updates);
          set({
            users: get().users.map(user => 
              user.id === id ? { ...user, ...updatedUser } : user
            ),
            selectedUser: get().selectedUser?.id === id 
              ? { ...get().selectedUser, ...updatedUser }
              : get().selectedUser,
            isLoading: false
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update user',
            isLoading: false
          });
        }
      },

      deleteUser: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          await mockDeleteUser(id);
          set({
            users: get().users.filter(user => user.id !== id),
            selectedUser: get().selectedUser?.id === id ? null : get().selectedUser,
            pagination: {
              ...get().pagination,
              total: get().pagination.total - 1
            },
            isLoading: false
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to delete user',
            isLoading: false
          });
        }
      },

      // Bulk operations
      bulkUpdateUsers: async (ids: string[], updates: Partial<User>) => {
        set({ isLoading: true, error: null });
        try {
          await mockBulkUpdateUsers(ids, updates);
          set({
            users: get().users.map(user => 
              ids.includes(user.id) ? { ...user, ...updates } : user
            ),
            isLoading: false
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update users',
            isLoading: false
          });
        }
      },

      bulkDeleteUsers: async (ids: string[]) => {
        set({ isLoading: true, error: null });
        try {
          await mockBulkDeleteUsers(ids);
          set({
            users: get().users.filter(user => !ids.includes(user.id)),
            pagination: {
              ...get().pagination,
              total: get().pagination.total - ids.length
            },
            isLoading: false
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to delete users',
            isLoading: false
          });
        }
      },

      // User actions
      suspendUser: async (id: string) => {
        return get().updateUser(id, { status: UserStatus.SUSPENDED });
      },

      activateUser: async (id: string) => {
        return get().updateUser(id, { status: UserStatus.ACTIVE });
      },

      resetUserPassword: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          await mockResetUserPassword(id);
          set({ isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to reset password',
            isLoading: false
          });
        }
      },

      // State management actions
      setSelectedUser: (user) => set({ selectedUser: user }),
      
      setFilters: (filters) => set({
        filters: { ...get().filters, ...filters }
      }),
      
      setSorting: (field, direction) => set({
        sorting: { field, direction }
      }),
      
      setPage: (page) => set({
        pagination: { ...get().pagination, page }
      }),
      
      setPageSize: (pageSize) => set({
        pagination: { ...get().pagination, pageSize }
      }),

      // Local state updates (optimistic updates)
      updateLocalUser: (id, updates) => set({
        users: get().users.map(user => 
          user.id === id ? { ...user, ...updates } : user
        ),
        selectedUser: get().selectedUser?.id === id 
          ? { ...get().selectedUser, ...updates } as User
          : get().selectedUser
      }),
      
      removeLocalUser: (id) => set({
        users: get().users.filter(user => user.id !== id),
        selectedUser: get().selectedUser?.id === id ? null : get().selectedUser
      }),
      
      addLocalUser: (user) => set({
        users: [...get().users, user]
      }),

      // Reset actions
      resetFilters: () => set({ filters: defaultFilters }),
      resetError: () => set({ error: null }),
      clearSelectedUser: () => set({ selectedUser: null })
    }),
    {
      name: 'users-store',
      partialize: (state) => ({
        filters: state.filters,
        sorting: state.sorting,
        pagination: state.pagination
      })
    }
  )
);

// Mock API functions (to be replaced with real API calls)
const mockFetchUsers = async (
  page: number, 
  pageSize: number, 
  filters: UserFilters, 
  sorting: UserSorting
): Promise<{ users: User[]; total: number }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Use the comprehensive mock data from src/mocks/users.ts
  let filteredUsers = filterUsers(mockUsers, {
    search: filters.search,
    status: filters.status,
    roles: filters.roles,
    dateRange: filters.dateRange,
    tags: filters.tags
  });

  // Apply sorting
  filteredUsers = sortUsers(filteredUsers, sorting.field, sorting.direction);

  // Apply pagination
  const total = filteredUsers.length;
  const paginatedUsers = paginateUsers(filteredUsers, page, pageSize);

  return {
    users: paginatedUsers,
    total
  };
};

const mockFetchUserById = async (id: string): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Find user in mock data
  const user = mockUsers.find(u => u.id === id);
  if (!user) {
    throw new Error('User not found');
  }
  
  return user;
};

const mockFetchUserActivities = async (userId: string): Promise<UserActivity[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return [
    {
      id: '1',
      action: 'Completed Module 5',
      timestamp: '2 hours ago',
      details: 'Advanced Features'
    },
    {
      id: '2',
      action: 'Updated profile',
      timestamp: '1 day ago'
    },
    {
      id: '3',
      action: 'Joined team meeting',
      timestamp: '3 days ago',
      details: 'Q4 Planning'
    },
    {
      id: '4',
      action: 'Submitted feedback',
      timestamp: '1 week ago'
    },
    {
      id: '5',
      action: 'Started Module 4',
      timestamp: '2 weeks ago',
      details: 'Core Concepts'
    }
  ];
};

const mockCreateUser = async (userData: Omit<User, 'id' | 'createdAt' | 'lastActive'>): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const newUser: User = {
    ...userData,
    id: (Date.now()).toString(),
    createdAt: new Date().toISOString(),
    lastActive: 'Just now'
  };
  
  return newUser;
};

const mockUpdateUser = async (id: string, updates: Partial<User>): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    id,
    ...updates
  } as User;
};

const mockDeleteUser = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
};

const mockBulkUpdateUsers = async (ids: string[], updates: Partial<User>): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
};

const mockBulkDeleteUsers = async (ids: string[]): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
};

const mockResetUserPassword = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
};
