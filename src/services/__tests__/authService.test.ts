import { authService } from '../authService'

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
    it('should successfully login with demo credentials', async () => {
      const loginPromise = authService.login('demo@example.com', 'demo123')
      
      // Fast-forward time to simulate the mock delay
      jest.advanceTimersByTime(1000)
      
      const result = await loginPromise

      expect(result).toMatchObject({
        token: expect.stringMatching(/^mock-jwt-token-\d+$/),
        user: {
          id: 1,
          email: 'demo@example.com',
        }
      })
    })

    it('should accept any credentials in mock mode', async () => {
      const loginPromise = authService.login('test@example.com', 'wrongpassword')
      
      // Fast-forward time to simulate the mock delay
      jest.advanceTimersByTime(1000)
      
      const result = await loginPromise
      
      // In mock mode, any credentials are accepted
      expect(result).toMatchObject({
        token: expect.stringMatching(/^mock-jwt-token-\d+$/),
        user: {
          id: 1,
          email: 'test@example.com',
        }
      })
    })

    it('should throw error for missing email', async () => {
      const loginPromise = authService.login('', 'password123')
      
      // Fast-forward time to simulate the mock delay
      jest.advanceTimersByTime(1000)
      
      await expect(loginPromise).rejects.toThrow('Email and password are required')
    })

    it('should throw error for missing password', async () => {
      const loginPromise = authService.login('test@example.com', '')
      
      // Fast-forward time to simulate the mock delay
      jest.advanceTimersByTime(1000)
      
      await expect(loginPromise).rejects.toThrow('Email and password are required')
    })

    it('should simulate network delay', async () => {
      const loginPromise = authService.login('demo@example.com', 'demo123')
      
      // Fast-forward time to simulate the mock delay
      jest.advanceTimersByTime(1000)
      
      await loginPromise
      
      // Verify that the promise resolved after the delay
      expect(loginPromise).resolves.toBeDefined()
    })
  })

  describe('socialLogin', () => {
    it('should successfully login with Google', async () => {
      const loginPromise = authService.socialLogin('google')
      
      // Fast-forward time to simulate the mock delay
      jest.advanceTimersByTime(1500)
      
      const result = await loginPromise

      expect(result).toMatchObject({
        token: expect.stringMatching(/^mock-google-token-\d+$/),
        user: {
          id: expect.any(Number),
          email: 'user@google.com',
          provider: 'google',
        }
      })
    })

    it('should successfully login with Facebook', async () => {
      const loginPromise = authService.socialLogin('facebook')
      
      // Fast-forward time to simulate the mock delay
      jest.advanceTimersByTime(1500)
      
      const result = await loginPromise

      expect(result).toMatchObject({
        token: expect.stringMatching(/^mock-facebook-token-\d+$/),
        user: {
          id: expect.any(Number),
          email: 'user@facebook.com',
          provider: 'facebook',
        }
      })
    })

    it('should successfully login with GitHub', async () => {
      const loginPromise = authService.socialLogin('github')
      
      // Fast-forward time to simulate the mock delay
      jest.advanceTimersByTime(1500)
      
      const result = await loginPromise

      expect(result).toMatchObject({
        token: expect.stringMatching(/^mock-github-token-\d+$/),
        user: {
          id: expect.any(Number),
          email: 'user@github.com',
          provider: 'github',
        }
      })
    })

    it('should throw error for unsupported provider', async () => {
      // @ts-expect-error Testing invalid provider
      await expect(authService.socialLogin('invalid'))
        .rejects.toThrow('Unsupported social login provider: invalid')
    })

    it('should simulate network delay for social login', async () => {
      const loginPromise = authService.socialLogin('google')
      
      // Fast-forward time to simulate the mock delay
      jest.advanceTimersByTime(1500)
      
      await loginPromise
      
      // Verify that the promise resolved after the delay
      expect(loginPromise).resolves.toBeDefined()
    })
  })

  describe('logout', () => {
    it('should successfully logout', async () => {
      const logoutPromise = authService.logout()
      
      // Fast-forward time to simulate the mock delay
      jest.advanceTimersByTime(500)
      
      await expect(logoutPromise).resolves.toBeUndefined()
    })

    it('should simulate logout delay', async () => {
      const logoutPromise = authService.logout()
      
      // Fast-forward time to simulate the mock delay
      jest.advanceTimersByTime(500)
      
      await logoutPromise
      
      // Verify that the promise resolved after the delay
      expect(logoutPromise).resolves.toBeUndefined()
    })
  })
})