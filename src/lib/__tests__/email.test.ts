import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  sendBatchEmails,
  sendLoginCodeEmail,
  sendMagicLinkEmail,
  sendNewDeviceEmail,
  sendPasswordResetEmail,
  sendSecurityAlertEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
  validateEmailConfig,
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

describe('Email Service', () => {
  beforeEach(async () => {
    // Reset all mocks
    vi.clearAllMocks()

    // Setup successful response by default
    mockSend.mockResolvedValue({ data: { id: 'email-id' }, error: null })
    mockBatchSend.mockResolvedValue({ data: { ids: ['email-1', 'email-2'] }, error: null })

    // Set RESEND_API_KEY
    process.env.RESEND_API_KEY = 'test-api-key'
  })

  afterEach(() => {
    delete process.env.RESEND_API_KEY
    delete process.env.EMAIL_PROVIDER
  })

  describe('sendPasswordResetEmail', () => {
    it('should send password reset email successfully', async () => {
      const result = await sendPasswordResetEmail({
        email: 'test@example.com',
        resetLink: 'https://app.test.com/reset?token=123',
      })

      expect(mockSend).toHaveBeenCalledWith({
        from: 'SenseiiWyze <noreply@senseiwyze.com>',
        to: 'test@example.com',
        subject: 'Reset your password',
        react: {
          type: 'PasswordResetEmail',
          props: { resetLink: 'https://app.test.com/reset?token=123' },
        },
        headers: { 'X-Entity-Ref-ID': 'test-uuid' },
      })

      expect(result).toEqual({ data: { id: 'email-id' } })
    })

    it('should handle send errors gracefully', async () => {
      mockSend.mockResolvedValueOnce({ data: null, error: new Error('Send failed') })

      const result = await sendPasswordResetEmail({
        email: 'test@example.com',
        resetLink: 'https://app.test.com/reset',
      })

      expect(result.error).toBeDefined()
      expect(result.error?.message).toBe('Send failed')
    })
  })

  describe('sendLoginCodeEmail', () => {
    it('should send login code email with correct formatting', async () => {
      const result = await sendLoginCodeEmail({
        email: 'user@test.com',
        code: '123456',
      })

      expect(mockSend).toHaveBeenCalledWith({
        from: 'SenseiiWyze <noreply@senseiwyze.com>',
        to: 'user@test.com',
        subject: 'Your login code',
        react: { type: 'LoginCodeEmail', props: { code: '123456' } },
        headers: { 'X-Entity-Ref-ID': 'test-uuid' },
      })

      expect(result.data).toBeDefined()
    })
  })

  describe('sendVerificationEmail', () => {
    it('should send verification email with custom link', async () => {
      const result = await sendVerificationEmail({
        email: 'newuser@test.com',
        verificationLink: 'https://app.test.com/verify?token=xyz',
      })

      expect(mockSend).toHaveBeenCalledWith({
        from: 'SenseiiWyze <noreply@senseiwyze.com>',
        to: 'newuser@test.com',
        subject: 'Verify your email address',
        react: {
          type: 'VerifyEmail',
          props: { verificationLink: 'https://app.test.com/verify?token=xyz' },
        },
        headers: { 'X-Entity-Ref-ID': 'test-uuid' },
      })
    })
  })

  describe('sendWelcomeEmail', () => {
    it('should send welcome email with user name', async () => {
      const result = await sendWelcomeEmail({
        email: 'welcome@test.com',
        name: 'John Doe',
      })

      expect(mockSend).toHaveBeenCalledWith({
        from: 'SenseiiWyze <noreply@senseiwyze.com>',
        to: 'welcome@test.com',
        subject: 'Welcome to SenseiiWyze!',
        react: { type: 'WelcomeEmail', props: { name: 'John Doe' } },
        replyTo: 'support@senseiwyze.com',
        headers: { 'X-Entity-Ref-ID': 'test-uuid' },
      })
    })

    it('should handle welcome email without name', async () => {
      const result = await sendWelcomeEmail({
        email: 'welcome@test.com',
      })

      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          react: { type: 'WelcomeEmail', props: { name: undefined } },
        })
      )
    })
  })

  describe('sendNewDeviceEmail', () => {
    it('should send new device alert with all details', async () => {
      const deviceDetails = {
        email: 'security@test.com',
        loginDate: '2024-01-15 10:30:00',
        loginDevice: 'Chrome on Windows',
        loginLocation: 'New York, USA',
        loginIp: '192.168.1.100',
      }

      const result = await sendNewDeviceEmail(deviceDetails)

      expect(mockSend).toHaveBeenCalledWith({
        from: 'SenseiiWyze <noreply@senseiwyze.com>',
        to: 'security@test.com',
        subject: 'New device login',
        react: {
          type: 'NewDeviceEmail',
          props: {
            loginDate: '2024-01-15 10:30:00',
            loginDevice: 'Chrome on Windows',
            loginLocation: 'New York, USA',
            loginIp: '192.168.1.100',
          },
        },
        headers: { 'X-Entity-Ref-ID': 'test-uuid' },
      })
    })
  })

  describe('sendSecurityAlertEmail', () => {
    it('should send security alert for suspicious login', async () => {
      const alertDetails = {
        email: 'alert@test.com',
        userName: 'Jane Smith',
        alertType: 'suspicious_login' as const,
        ipAddress: '10.0.0.1',
        location: 'Unknown Location',
        device: 'Unknown Device',
        timestamp: '2024-01-15 15:45:00',
      }

      const result = await sendSecurityAlertEmail(alertDetails)

      expect(mockSend).toHaveBeenCalledWith({
        from: 'SenseiiWyze <noreply@senseiwyze.com>',
        to: 'alert@test.com',
        subject: 'Security alert for your account',
        react: {
          type: 'SecurityAlertEmail',
          props: {
            userEmail: 'alert@test.com',
            userName: 'Jane Smith',
            alertType: 'suspicious_login',
            ipAddress: '10.0.0.1',
            location: 'Unknown Location',
            device: 'Unknown Device',
            timestamp: '2024-01-15 15:45:00',
            securityLink: undefined,
          },
        },
        headers: { 'X-Entity-Ref-ID': 'test-uuid' },
      })
    })

    it('should handle different alert types', async () => {
      const alertTypes: Array<'suspicious_login' | 'password_changed' | 'failed_attempts'> = [
        'suspicious_login',
        'password_changed',
        'failed_attempts',
      ]

      for (const alertType of alertTypes) {
        await sendSecurityAlertEmail({
          email: 'test@test.com',
          alertType,
        })
      }

      expect(mockSend).toHaveBeenCalledTimes(3)
    })
  })

  describe('sendMagicLinkEmail', () => {
    it('should send magic link email', async () => {
      const result = await sendMagicLinkEmail({
        email: 'magic@test.com',
        magicLink: 'https://app.test.com/magic?token=secret',
      })

      expect(mockSend).toHaveBeenCalledWith({
        from: 'SenseiiWyze <noreply@senseiwyze.com>',
        to: 'magic@test.com',
        subject: 'Sign in to SenseiiWyze',
        react: {
          type: 'MagicLinkEmail',
          props: { magicLink: 'https://app.test.com/magic?token=secret' },
        },
        headers: { 'X-Entity-Ref-ID': 'test-uuid' },
      })
    })
  })

  describe('sendBatchEmails', () => {
    it('should send multiple emails in batch', async () => {
      const emails = [
        {
          to: 'user1@test.com',
          subject: 'Test 1',
          react: { type: 'TestEmail', props: {} } as any,
        },
        {
          to: 'user2@test.com',
          subject: 'Test 2',
          react: { type: 'TestEmail', props: {} } as any,
        },
      ]

      const result = await sendBatchEmails(emails)

      expect(mockBatchSend).toHaveBeenCalledWith([
        {
          from: 'SenseiiWyze <noreply@senseiwyze.com>',
          to: 'user1@test.com',
          subject: 'Test 1',
          react: { type: 'TestEmail', props: {} },
          headers: { 'X-Entity-Ref-ID': 'test-uuid' },
        },
        {
          from: 'SenseiiWyze <noreply@senseiwyze.com>',
          to: 'user2@test.com',
          subject: 'Test 2',
          react: { type: 'TestEmail', props: {} },
          headers: { 'X-Entity-Ref-ID': 'test-uuid' },
        },
      ])

      expect(result.data).toBeDefined()
    })
  })

  describe('Console Email Provider', () => {
    beforeEach(() => {
      process.env.EMAIL_PROVIDER = 'CONSOLE'
    })

    it('should use console logger instead of Resend when EMAIL_PROVIDER=CONSOLE', async () => {
      const emailLoggerModule = await import('@/lib/logger')

      await sendPasswordResetEmail({
        email: 'console@test.com',
        resetLink: 'https://app.test.com/reset',
      })

      expect(mockSend).not.toHaveBeenCalled()
      expect(emailLoggerModule.emailLogger.info).toHaveBeenCalledWith(
        'Email sent via console provider',
        expect.objectContaining({
          from: 'SenseiiWyze <noreply@senseiwyze.com>',
          to: 'console@test.com',
          subject: 'Reset your password',
        })
      )
    })
  })

  describe('validateEmailConfig', () => {
    it('should return false when RESEND_API_KEY is not set', async () => {
      delete process.env.RESEND_API_KEY

      const isValid = await validateEmailConfig()

      expect(isValid).toBe(false)
    })

    it('should validate API key with Resend API', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
      } as any)

      const isValid = await validateEmailConfig()

      expect(fetch).toHaveBeenCalledWith('https://api.resend.com/api-keys', {
        headers: {
          Authorization: 'Bearer test-api-key',
        },
      })
      expect(isValid).toBe(true)
    })

    it('should handle validation errors', async () => {
      global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'))

      const isValid = await validateEmailConfig()

      expect(isValid).toBe(false)
    })
  })

  describe('Error Handling', () => {
    it('should handle Resend API errors', async () => {
      mockSend.mockRejectedValueOnce(new Error('API Error'))

      const result = await sendWelcomeEmail({
        email: 'error@test.com',
        name: 'Test User',
      })

      expect(result.error).toBeDefined()
      expect(result.error?.message).toBe('API Error')
    })
  })
})
