import { authService } from '../authService'

// Mock fetch globally
global.fetch = jest.fn()
const mockFetch = fetch as jest.MockedFunction<typeof fetch>

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ token: 'mock-token', user: { id: 1, email: 'test@example.com' } }),
      }
      mockFetch.mockResolvedValueOnce(mockResponse as Response)

      const result = await authService.login('test@example.com', 'password123')

      expect(mockFetch).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
        }),
      })

      expect(result).toEqual({
        token: 'mock-token',
        user: { id: 1, email: 'test@example.com' },
      })
    })

    it('should throw error for invalid credentials', async () => {
      const mockResponse = {
        ok: false,
        status: 401,
        json: async () => ({ message: 'Invalid credentials' }),
      }
      mockFetch.mockResolvedValueOnce(mockResponse as Response)

      await expect(authService.login('test@example.com', 'wrongpassword'))
        .rejects.toThrow('Invalid credentials')

      expect(mockFetch).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'wrongpassword',
        }),
      })
    })

    it('should throw generic error for server errors', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        json: async () => ({ message: 'Internal server error' }),
      }
      mockFetch.mockResolvedValueOnce(mockResponse as Response)

      await expect(authService.login('test@example.com', 'password123'))
        .rejects.toThrow('Internal server error')
    })

    it('should throw network error when fetch fails', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(authService.login('test@example.com', 'password123'))
        .rejects.toThrow('Network error')
    })

    it('should handle timeout', async () => {
      // Mock a delayed response
      mockFetch.mockImplementationOnce(() => 
        new Promise(resolve => setTimeout(resolve, 10000))
      )

      const loginPromise = authService.login('test@example.com', 'password123')
      
      // Fast-forward time to trigger timeout
      jest.advanceTimersByTime(5000)

      await expect(loginPromise).rejects.toThrow('Request timeout')
    })
  })

  describe('socialLogin', () => {
    it('should successfully login with Google', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ 
          token: 'google-token', 
          user: { id: 1, email: 'test@gmail.com', provider: 'google' } 
        }),
      }
      mockFetch.mockResolvedValueOnce(mockResponse as Response)

      const result = await authService.socialLogin('google')

      expect(mockFetch).toHaveBeenCalledWith('/api/auth/social/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      expect(result).toEqual({
        token: 'google-token',
        user: { id: 1, email: 'test@gmail.com', provider: 'google' },
      })
    })

    it('should successfully login with Facebook', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ 
          token: 'facebook-token', 
          user: { id: 2, email: 'test@facebook.com', provider: 'facebook' } 
        }),
      }
      mockFetch.mockResolvedValueOnce(mockResponse as Response)

      const result = await authService.socialLogin('facebook')

      expect(mockFetch).toHaveBeenCalledWith('/api/auth/social/facebook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      expect(result).toEqual({
        token: 'facebook-token',
        user: { id: 2, email: 'test@facebook.com', provider: 'facebook' },
      })
    })

    it('should successfully login with GitHub', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ 
          token: 'github-token', 
          user: { id: 3, email: 'test@github.com', provider: 'github' } 
        }),
      }
      mockFetch.mockResolvedValueOnce(mockResponse as Response)

      const result = await authService.socialLogin('github')

      expect(mockFetch).toHaveBeenCalledWith('/api/auth/social/github', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      expect(result).toEqual({
        token: 'github-token',
        user: { id: 3, email: 'test@github.com', provider: 'github' },
      })
    })

    it('should throw error for unsupported provider', async () => {
      // @ts-expect-error Testing invalid provider
      await expect(authService.socialLogin('invalid'))
        .rejects.toThrow('Unsupported social login provider: invalid')
    })

    it('should handle social login API errors', async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        json: async () => ({ message: 'Social login failed' }),
      }
      mockFetch.mockResolvedValueOnce(mockResponse as Response)

      await expect(authService.socialLogin('google'))
        .rejects.toThrow('Social login failed')
    })
  })

  describe('logout', () => {
    it('should successfully logout', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ message: 'Logged out successfully' }),
      }
      mockFetch.mockResolvedValueOnce(mockResponse as Response)

      await expect(authService.logout()).resolves.toBeUndefined()

      expect(mockFetch).toHaveBeenCalledWith('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    })

    it('should handle logout errors gracefully', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        json: async () => ({ message: 'Logout failed' }),
      }
      mockFetch.mockResolvedValueOnce(mockResponse as Response)

      await expect(authService.logout()).rejects.toThrow('Logout failed')
    })
  })
})