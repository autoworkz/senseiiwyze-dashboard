import { User, UserFilters, UserSorting, PaginationState, UserActivity } from '@/stores/users-store'

// API Response types
interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
  message?: string
  success: boolean
}

interface ApiError {
  message: string
  code: string
  details?: any
}

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'
const API_TIMEOUT = 10000 // 10 seconds
const MAX_RETRIES = 3

class UserApiService {
  private baseUrl: string
  private timeout: number
  private maxRetries: number

  constructor(baseUrl = API_BASE_URL, timeout = API_TIMEOUT, maxRetries = MAX_RETRIES) {
    this.baseUrl = baseUrl
    this.timeout = timeout
    this.maxRetries = maxRetries
  }

  // Generic request method with retry logic
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: `HTTP ${response.status}: ${response.statusText}`,
          code: response.status.toString(),
        })) as ApiError

        throw new Error(errorData.message)
      }

      return await response.json()
    } catch (error) {
      clearTimeout(timeoutId)

      // Retry logic for network errors
      if (retryCount < this.maxRetries && this.isRetryableError(error)) {
        const delay = Math.pow(2, retryCount) * 1000 // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay))
        return this.request<T>(endpoint, options, retryCount + 1)
      }

      throw error
    }
  }

  private isRetryableError(error: any): boolean {
    return (
      error.name === 'AbortError' ||
      error.message.includes('network') ||
      error.message.includes('timeout') ||
      error.message.includes('fetch')
    )
  }

  // User CRUD operations
  async getUsers(
    page = 1,
    pageSize = 10,
    filters?: UserFilters,
    sorting?: UserSorting
  ): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...(filters?.search && { search: filters.search }),
      ...(filters?.status?.length && { status: filters.status.join(',') }),
      ...(filters?.roles?.length && { roles: filters.roles.join(',') }),
      ...(filters?.dateRange?.from && { from: filters.dateRange.from }),
      ...(filters?.dateRange?.to && { to: filters.dateRange.to }),
      ...(sorting?.field && { sortBy: sorting.field }),
      ...(sorting?.direction && { sortDir: sorting.direction }),
    })

    return this.request<PaginatedResponse<User>>(`/users?${params}`)
  }

  async getUserById(id: string): Promise<User> {
    const response = await this.request<ApiResponse<User>>(`/users/${id}`)
    return response.data
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'lastActive'>): Promise<User> {
    const response = await this.request<ApiResponse<User>>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
    return response.data
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const response = await this.request<ApiResponse<User>>(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
    return response.data
  }

  async deleteUser(id: string): Promise<void> {
    await this.request(`/users/${id}`, {
      method: 'DELETE',
    })
  }

  // Bulk operations
  async bulkUpdateUsers(ids: string[], updates: Partial<User>): Promise<void> {
    await this.request('/users/bulk-update', {
      method: 'PATCH',
      body: JSON.stringify({ ids, updates }),
    })
  }

  async bulkDeleteUsers(ids: string[]): Promise<void> {
    await this.request('/users/bulk-delete', {
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    })
  }

  // User actions
  async suspendUser(id: string): Promise<void> {
    await this.request(`/users/${id}/suspend`, {
      method: 'POST',
    })
  }

  async activateUser(id: string): Promise<void> {
    await this.request(`/users/${id}/activate`, {
      method: 'POST',
    })
  }

  async resetUserPassword(id: string): Promise<{ temporaryPassword: string }> {
    const response = await this.request<ApiResponse<{ temporaryPassword: string }>>(
      `/users/${id}/reset-password`,
      { method: 'POST' }
    )
    return response.data
  }

  async sendNotification(id: string, message: string): Promise<void> {
    await this.request(`/users/${id}/notify`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    })
  }

  // User activities
  async getUserActivities(userId: string): Promise<UserActivity[]> {
    const response = await this.request<ApiResponse<UserActivity[]>>(`/users/${userId}/activities`)
    return response.data
  }

  // Analytics
  async getUserAnalytics(dateRange?: { from: string; to: string }): Promise<any> {
    const params = new URLSearchParams()
    if (dateRange?.from) params.append('from', dateRange.from)
    if (dateRange?.to) params.append('to', dateRange.to)

    return this.request(`/users/analytics?${params}`)
  }

  async exportUsers(filters?: UserFilters, format: 'csv' | 'json' = 'csv'): Promise<Blob> {
    const params = new URLSearchParams({
      format,
      ...(filters?.search && { search: filters.search }),
      ...(filters?.status?.length && { status: filters.status.join(',') }),
      ...(filters?.roles?.length && { roles: filters.roles.join(',') }),
      ...(filters?.dateRange?.from && { from: filters.dateRange.from }),
      ...(filters?.dateRange?.to && { to: filters.dateRange.to }),
    })

    const response = await fetch(`${this.baseUrl}/users/export?${params}`)
    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`)
    }
    return response.blob()
  }

  // Real-time updates (WebSocket simulation)
  async subscribeToUserUpdates(userId: string, callback: (update: any) => void): Promise<() => void> {
    // In a real implementation, this would use WebSocket
    // For now, we'll simulate with polling
    const interval = setInterval(async () => {
      try {
        const user = await this.getUserById(userId)
        callback({ type: 'user_update', data: user })
      } catch (error) {
        console.error('Error polling user updates:', error)
      }
    }, 5000) // Poll every 5 seconds

    return () => clearInterval(interval)
  }
}

// Export singleton instance
export const userApiService = new UserApiService()

// Export types for external use
export type { ApiResponse, PaginatedResponse, ApiError } 