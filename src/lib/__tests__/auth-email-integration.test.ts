import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  sendMagicLinkEmail,
  sendPasswordResetEmail,
  sendSecurityAlertEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from '../email'

// Mock Resend
const mockSend = vi.fn()
const mockBatchSend = vi.fn()

vi.mock('resend', () => ({
  Resend: vi.fn(() => ({
    emails: {
      send: mockSend,
    },
    batch: {
      send: mockBatchSend,
    },
  })),
}))

vi.mock('@/lib/logger', () => ({
  emailLogger: {
    info: vi.fn(),
    error: vi.fn(),
  },
}))

// Mock React Email components
vi.mock('../../../emails', () => ({
  PasswordResetEmail: vi.fn((props) => ({ type: 'PasswordResetEmail', props })),
  LoginCodeEmail: vi.fn((props) => ({ type: 'LoginCodeEmail', props })),
  VerifyEmail: vi.fn((props) => ({ type: 'VerifyEmail', props })),
  WelcomeEmail: vi.fn((props) => ({ type: 'WelcomeEmail', props })),
  NewDeviceEmail: vi.fn((props) => ({ type: 'NewDeviceEmail', props })),
  SecurityAlertEmail: vi.fn((props) => ({ type: 'SecurityAlertEmail', props })),
  MagicLinkEmail: vi.fn((props) => ({ type: 'MagicLinkEmail', props })),
}))

// Mock crypto.randomUUID
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: vi.fn(() => 'test-uuid'),
  },
  writable: true,
})

// Mock Better Auth integration scenarios
describe('Auth Email Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.RESEND_API_KEY = 'test-key'
    process.env.BETTER_AUTH_URL = 'http://localhost:3000'

    // Setup successful response by default
    mockSend.mockResolvedValue({ data: { id: 'email-id' }, error: null })
    mockBatchSend.mockResolvedValue({ data: { ids: ['email-1', 'email-2'] }, error: null })
  })

  describe('User Registration Flow', () => {
    it('should send verification email after user signup', async () => {
      // Simulate user registration
      const newUser = {
        email: 'newuser@example.com',
        name: 'New User',
      }

      // Generate verification token (this would come from Better Auth)
      const verificationToken = 'verify-token-123'
      const verificationLink = `${process.env.BETTER_AUTH_URL}/auth/verify-email?token=${verificationToken}`

      // Send verification email
      const result = await sendVerificationEmail({
        email: newUser.email,
        verificationLink,
      })

      expect(result.data).toBeDefined()
      expect(result.error).toBeUndefined()
    })

    it('should send welcome email after email verification', async () => {
      // Simulate verified user
      const verifiedUser = {
        email: 'verified@example.com',
        name: 'Verified User',
      }

      // Send welcome email
      const result = await sendWelcomeEmail({
        email: verifiedUser.email,
        name: verifiedUser.name,
      })

      expect(result.data).toBeDefined()
      expect(result.error).toBeUndefined()
    })
  })

  describe('Password Reset Flow', () => {
    it('should handle complete password reset flow', async () => {
      const userEmail = 'forgetful@example.com'

      // Step 1: User requests password reset
      const resetToken = 'reset-token-456'
      const resetLink = `${process.env.BETTER_AUTH_URL}/auth/reset-password?token=${resetToken}`

      const resetResult = await sendPasswordResetEmail({
        email: userEmail,
        resetLink,
      })

      expect(resetResult.data).toBeDefined()

      // Step 2: After password change, send security alert
      const alertResult = await sendSecurityAlertEmail({
        email: userEmail,
        alertType: 'password_changed',
        timestamp: new Date().toISOString(),
      })

      expect(alertResult.data).toBeDefined()
    })

    it('should handle invalid reset token scenario', async () => {
      // This would typically trigger after multiple failed attempts
      const result = await sendSecurityAlertEmail({
        email: 'attacker@example.com',
        alertType: 'failed_attempts',
        ipAddress: '192.168.1.100',
        location: 'Unknown Location',
        device: 'Unknown Browser',
      })

      expect(result.data).toBeDefined()
    })
  })

  describe('Magic Link Flow', () => {
    it('should send magic link for passwordless authentication', async () => {
      const userEmail = 'passwordless@example.com'
      const magicToken = 'magic-token-789'
      const magicLink = `${process.env.BETTER_AUTH_URL}/auth/magic-link?token=${magicToken}`

      const result = await sendMagicLinkEmail({
        email: userEmail,
        magicLink,
      })

      expect(result.data).toBeDefined()
      expect(result.error).toBeUndefined()
    })
  })

  describe('Security Alerts', () => {
    it('should send alert for new device login', async () => {
      const deviceInfo = {
        email: 'security-conscious@example.com',
        userName: 'Security User',
        loginDate: new Date().toLocaleString(),
        loginDevice: 'Chrome 120 on macOS',
        loginLocation: 'San Francisco, CA, USA',
        loginIp: '73.189.45.123',
      }

      // First, send new device alert
      const newDeviceResult = await sendSecurityAlertEmail({
        email: deviceInfo.email,
        userName: deviceInfo.userName,
        alertType: 'suspicious_login',
        ipAddress: deviceInfo.loginIp,
        location: deviceInfo.loginLocation,
        device: deviceInfo.loginDevice,
        timestamp: deviceInfo.loginDate,
        securityLink: `${process.env.BETTER_AUTH_URL}/app/settings/security`,
      })

      expect(newDeviceResult.data).toBeDefined()
    })

    it('should handle account lockout scenario', async () => {
      const result = await sendSecurityAlertEmail({
        email: 'locked@example.com',
        alertType: 'failed_attempts',
        ipAddress: '10.0.0.1',
        timestamp: new Date().toISOString(),
      })

      expect(result.data).toBeDefined()
    })
  })

  describe('Error Scenarios', () => {
    it('should handle email delivery failures gracefully', async () => {
      // Simulate Resend API failure
      mockSend.mockResolvedValueOnce({ data: null, error: new Error('API Error') })

      const result = await sendWelcomeEmail({
        email: 'fail@example.com',
        name: 'Fail User',
      })

      expect(result.error).toBeDefined()
      expect(result.error?.message).toBe('API Error')
    })

    it('should use console provider in development', async () => {
      process.env.EMAIL_PROVIDER = 'CONSOLE'
      const { emailLogger } = await import('@/lib/logger')

      vi.spyOn(emailLogger, 'info')

      const result = await sendVerificationEmail({
        email: 'dev@example.com',
        verificationLink: 'http://localhost:3000/verify',
      })

      expect(result.data).toBeDefined()
      expect(emailLogger.info).toHaveBeenCalledWith(
        'Email sent via console provider',
        expect.any(Object)
      )
    })
  })

  describe('Batch Operations', () => {
    it('should handle bulk notifications', async () => {
      const { sendBatchEmails } = await import('../email')
      const { WelcomeEmail } = await import('../../../emails')

      const newUsers = [
        { email: 'user1@example.com', name: 'User One' },
        { email: 'user2@example.com', name: 'User Two' },
        { email: 'user3@example.com', name: 'User Three' },
      ]

      const emails = newUsers.map((user) => ({
        to: user.email,
        subject: 'Welcome to SenseiiWyze!',
        react: WelcomeEmail({ name: user.name }),
      }))

      const result = await sendBatchEmails(emails)
      expect(result.data).toBeDefined()
    })
  })

  describe('Link Generation', () => {
    it('should generate correct auth links with proper domain', () => {
      const baseUrl = process.env.BETTER_AUTH_URL
      const token = 'test-token-123'

      const links = {
        verify: `${baseUrl}/auth/verify-email?token=${token}`,
        reset: `${baseUrl}/auth/reset-password?token=${token}`,
        magic: `${baseUrl}/auth/magic-link?token=${token}`,
      }

      expect(links.verify).toContain('/auth/verify-email')
      expect(links.reset).toContain('/auth/reset-password')
      expect(links.magic).toContain('/auth/magic-link')
      expect(links.verify).toContain(token)
    })
  })
})
