export interface User {
  id: number
  email: string
  provider?: string
}

export interface LoginResponse {
  token: string
  user: User
}

export type SocialProvider = 'google' | 'facebook' | 'github'

/**
 * Authentication service for handling login, logout, and social authentication
 */
class AuthService {
  private readonly baseUrl = '/api/auth'
  private readonly timeout = 5000 // 5 seconds

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
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
      throw new Error(errorData.message || `HTTP ${response.status}`)
    }
    return response.json()
  }

  /**
   * Authenticates user with email and password
   * @param email - User's email address
   * @param password - User's password
   * @returns Promise resolving to login response
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.fetchWithTimeout(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    return this.handleResponse<LoginResponse>(response)
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

    const response = await this.fetchWithTimeout(`${this.baseUrl}/social/${provider}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return this.handleResponse<LoginResponse>(response)
  }

  /**
   * Logs out the current user
   * @returns Promise that resolves when logout is complete
   */
  async logout(): Promise<void> {
    const response = await this.fetchWithTimeout(`${this.baseUrl}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    await this.handleResponse<{ message: string }>(response)
  }
}

export const authService = new AuthService()