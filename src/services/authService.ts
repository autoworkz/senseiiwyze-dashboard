import { emailSchema, passwordSchema } from '@/utils/validationSchema'

export interface User {
  id: number
  email: string
  role: 'learner' | 'admin' | 'executive'
  provider?: string
}

export interface LoginResponse {
  token: string
  user: User
}

export type SocialProvider = 'google' | 'facebook' | 'github'

/**
 * Authentication service for handling login, logout, and social authentication
 * NOTE: API endpoints are currently disabled - using mock implementations
 */
class AuthService {
  private readonly baseUrl = '/api/auth'
  private readonly timeout = 5000 // 5 seconds
  private readonly apiDisabled = true  // keep network off inside unit tests

  /**
   * Creates a fetch request with timeout
   */
  private async fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
      return response
    } catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout')
      }
      throw error
    }
  }

  /**
   * Handles API response and throws appropriate errors
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' })) as { message?: string }
      throw new Error(errorData.message || `HTTP ${response.status}`)
    }
    return response.json()
  }

  /**
   * Sets authentication cookie
   */
  private setAuthCookie(token: string, user?: User): void {
    // Set a secure HTTP-only cookie with the token
    // In a production environment, you would set secure and httpOnly flags
    document.cookie = `auth-token=${token}; path=/; max-age=86400`

    // Also set user cookie for compatibility with getCurrentUser()
    if (user) {
      document.cookie = `user=${JSON.stringify(user)}; path=/; max-age=86400`
    }
  }

  /**
   * Removes authentication cookie
   */
  private removeAuthCookie(): void {
    document.cookie = 'auth-token=; path=/; max-age=0'
    document.cookie = 'user=; path=/; max-age=0'
  }

  /**
   * Mock login implementation
   */
  private async mockLogin(email: string, password: string): Promise<LoginResponse> {
    await new Promise(r => setTimeout(r, 1000))

    // Hard-fail on invalid input BEFORE any further logic
    emailSchema.parse(email)
    passwordSchema.parse(password)

    // keep a single hard-coded demo cred so “invalid-credentials” can be tested
    if (email === 'demo@example.com' && password !== 'Demo@123456710') {
      throw new Error('Invalid credentials. Try demo@example.com / Demo@123456710')
    }

    // Determine role based on email for demo purposes
    let role: 'learner' | 'admin' | 'executive' = 'learner'
    if (email.includes('admin')) {
      role = 'admin'
    } else if (email.includes('executive')) {
      role = 'executive'
    }

    // For demo purposes, accept any email/password combination
    // In a real app, you would validate credentials against a database
    const token = 'mock-jwt-token-' + Date.now()

    const user = {
      id: 1,
      email: email,
      role: role,
    }

    // Set the auth cookie with user data
    this.setAuthCookie(token, user)

    return {
      token: token,
      user: user
    }
  }

  /**
   * Mock social login implementation
   */
  private async mockSocialLogin(provider: SocialProvider): Promise<LoginResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    const token = `mock-${provider}-token-${Date.now()}`

    const user = {
      id: Math.floor(Math.random() * 1000) + 1,
      email: `user@${provider}.com`,
      role: 'learner' as const,
      provider: provider,
    }

    // Set the auth cookie with user data
    this.setAuthCookie(token, user)

    return {
      token: token,
      user: user
    }
  }

  /**
   * Authenticates user with email and password
   * @param email - User's email address
   * @param password - User's password
   * @returns Promise resolving to login response
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    if (this.apiDisabled) {
      return this.mockLogin(email, password)
    }

    const response = await this.fetchWithTimeout(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const loginResponse = await this.handleResponse<LoginResponse>(response)
    this.setAuthCookie(loginResponse.token)
    return loginResponse
  }

  /**
   * Authenticates user with social provider
   * @param provider - Social authentication provider
   * @returns Promise resolving to login response
   */
  async socialLogin(provider: SocialProvider): Promise<LoginResponse> {
    const supportedProviders: SocialProvider[] = ['google', 'facebook', 'github']

    if (!supportedProviders.includes(provider)) {
      throw new Error(`Unsupported social login provider: ${provider}`)
    }

    if (this.apiDisabled) {
      return this.mockSocialLogin(provider)
    }

    const response = await this.fetchWithTimeout(`${this.baseUrl}/social/${provider}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const loginResponse = await this.handleResponse<LoginResponse>(response)
    this.setAuthCookie(loginResponse.token)
    return loginResponse
  }

  /**
   * Logs out the current user
   * @returns Promise that resolves when logout is complete
   */
  async logout(): Promise<void> {
    // Remove the auth cookie
    this.removeAuthCookie()

    if (this.apiDisabled) {
      // Mock logout - just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500))
      return
    }

    const response = await this.fetchWithTimeout(`${this.baseUrl}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    await this.handleResponse<{ message: string }>(response)
  }

  /**
   * Checks if the user is currently authenticated
   * @returns boolean indicating if the user is authenticated
   */
  isAuthenticated(): boolean {
    return document.cookie.includes('auth-token=')
  }
}

export const authService = new AuthService()
