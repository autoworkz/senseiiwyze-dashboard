import { User, UserRole, UserStatus, UserActivity } from '@/stores/users-store';

// User service for handling user-related API calls
class UserService {
  private readonly baseUrl = '/api/users';
  private readonly timeout = 10000; // 10 seconds

  /**
   * Creates a fetch request with timeout
   */
  private async fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  /**
   * Handles API response and throws appropriate errors
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        errorMessage = (errorData as { message?: string }).message || errorMessage;
      } else {
        errorMessage = await response.text() || errorMessage;
      }
      
      throw new Error(errorMessage);
    }
    
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    
    return response.text() as unknown as T;
  }

  /**
   * Fetch users with pagination and filtering
   */
  async fetchUsers(
    page: number = 1,
    pageSize: number = 10,
    filters?: {
      search?: string;
      status?: UserStatus[];
      roles?: UserRole[];
      dateRange?: { from: string; to: string };
    },
    sort?: { field: string; direction: 'asc' | 'desc' }
  ): Promise<{ users: User[]; total: number }> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    if (filters?.search) params.append('search', filters.search);
    if (filters?.status?.length) params.append('status', filters.status.join(','));
    if (filters?.roles?.length) params.append('roles', filters.roles.join(','));
    if (filters?.dateRange) {
      params.append('dateFrom', filters.dateRange.from);
      params.append('dateTo', filters.dateRange.to);
    }
    if (sort) {
      params.append('sortField', sort.field);
      params.append('sortDirection', sort.direction);
    }

    const response = await this.fetchWithTimeout(`${this.baseUrl}?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return this.handleResponse<{ users: User[]; total: number }>(response);
  }

  /**
   * Fetch a single user by ID
   */
  async fetchUserById(id: string): Promise<User> {
    const response = await this.fetchWithTimeout(`${this.baseUrl}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return this.handleResponse<User>(response);
  }

  /**
   * Fetch user activities
   */
  async fetchUserActivities(userId: string): Promise<UserActivity[]> {
    const response = await this.fetchWithTimeout(`${this.baseUrl}/${userId}/activities`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return this.handleResponse<UserActivity[]>(response);
  }

  /**
   * Create a new user
   */
  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'lastActive'>): Promise<User> {
    const response = await this.fetchWithTimeout(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    return this.handleResponse<User>(response);
  }

  /**
   * Update a user
   */
  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const response = await this.fetchWithTimeout(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    return this.handleResponse<User>(response);
  }

  /**
   * Delete a user
   */
  async deleteUser(id: string): Promise<void> {
    const response = await this.fetchWithTimeout(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    await this.handleResponse<{ message: string }>(response);
  }

  /**
   * Bulk update users
   */
  async bulkUpdateUsers(ids: string[], updates: Partial<User>): Promise<void> {
    const response = await this.fetchWithTimeout(`${this.baseUrl}/bulk`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids, updates }),
    });

    await this.handleResponse<{ message: string }>(response);
  }

  /**
   * Bulk delete users
   */
  async bulkDeleteUsers(ids: string[]): Promise<void> {
    const response = await this.fetchWithTimeout(`${this.baseUrl}/bulk`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids }),
    });

    await this.handleResponse<{ message: string }>(response);
  }

  /**
   * Suspend a user
   */
  async suspendUser(id: string): Promise<User> {
    const response = await this.fetchWithTimeout(`${this.baseUrl}/${id}/suspend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return this.handleResponse<User>(response);
  }

  /**
   * Activate a user
   */
  async activateUser(id: string): Promise<User> {
    const response = await this.fetchWithTimeout(`${this.baseUrl}/${id}/activate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return this.handleResponse<User>(response);
  }

  /**
   * Reset user password
   */
  async resetUserPassword(id: string): Promise<void> {
    const response = await this.fetchWithTimeout(`${this.baseUrl}/${id}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    await this.handleResponse<{ message: string }>(response);
  }

  /**
   * Get dashboard metrics
   */
  async fetchDashboardMetrics(): Promise<{
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    userGrowth: number;
    programReadiness: number;
  }> {
    const response = await this.fetchWithTimeout(`${this.baseUrl}/dashboard`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return this.handleResponse<{
      totalUsers: number;
      activeUsers: number;
      newUsers: number;
      userGrowth: number;
      programReadiness: number;
    }>(response);
  }

  /**
   * Get analytics data
   */
  async fetchAnalyticsData(timeRange: string = '30d'): Promise<any> {
    const response = await this.fetchWithTimeout(`${this.baseUrl}/analytics?timeRange=${timeRange}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return this.handleResponse<any>(response);
  }
}

export const userService = new UserService();
