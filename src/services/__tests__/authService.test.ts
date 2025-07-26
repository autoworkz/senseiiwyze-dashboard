import { authService } from '../authService'

const STRONG_PWD = 'Demo@123456710'

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
      const loginPromise = authService.login('demo@example.com', STRONG_PWD)
      jest.advanceTimersByTime(1000)
      const result = await loginPromise

      expect(result).toMatchObject({
        token: expect.stringMatching(/^mock-jwt-token-\d+$/),
        user: { id: 1, email: 'demo@example.com' }
      })
    })

    it('should reject invalid credentials', async () => {
      const loginPromise = authService.login('demo@example.com', 'Wrong@1234')
      jest.advanceTimersByTime(1000)
      await expect(loginPromise).rejects.toThrow()
    })

    it('should reject missing email', async () => {
      const loginPromise = authService.login('', STRONG_PWD)
      jest.advanceTimersByTime(1000)
      await expect(loginPromise).rejects.toThrow()
    })

    it('should reject missing password', async () => {
      const loginPromise = authService.login('demo@example.com', '')
      jest.advanceTimersByTime(1000)
      await expect(loginPromise).rejects.toThrow()
    })

    it('should reject weak password', async () => {
      const loginPromise = authService.login('demo@example.com', 'weak')
      jest.advanceTimersByTime(1000)
      await expect(loginPromise).rejects.toThrow()
    })

    it('should reject malformed email', async () => {
      const loginPromise = authService.login('not-an-email', STRONG_PWD)
      jest.advanceTimersByTime(1000)
      await expect(loginPromise).rejects.toThrow()
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