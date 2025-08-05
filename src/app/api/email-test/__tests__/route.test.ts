import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as emailLib from '@/lib/email'
import { POST } from '../route'

// Mock the email library
vi.mock('@/lib/email', () => ({
  sendPasswordResetEmail: vi.fn(),
  sendLoginCodeEmail: vi.fn(),
  sendVerificationEmail: vi.fn(),
  sendWelcomeEmail: vi.fn(),
  sendNewDeviceEmail: vi.fn(),
  sendSecurityAlertEmail: vi.fn(),
  sendMagicLinkEmail: vi.fn(),
}))

describe('Email Test API Route', () => {
  let mockRequest: any

  beforeEach(() => {
    vi.clearAllMocks()
    // Mock successful responses by default
    Object.values(emailLib).forEach((fn) => {
      if (typeof fn === 'function') {
        ;(fn as any).mockResolvedValue({ data: { id: 'test-id' } })
      }
    })
  })

  const createRequest = (body: any) =>
    ({
      json: async () => body,
    }) as any

  describe('POST /api/email-test', () => {
    it('should send password reset email', async () => {
      mockRequest = createRequest({
        type: 'password-reset',
        email: 'test@example.com',
        resetLink: 'https://app.test.com/reset',
      })

      const response = await POST(mockRequest)
      const result = await response.json()

      expect(emailLib.sendPasswordResetEmail).toHaveBeenCalledWith({
        email: 'test@example.com',
        resetLink: 'https://app.test.com/reset',
      })
      expect(response.status).toBe(200)
      expect(result.success).toBe(true)
      expect(result.message).toBe('Test password-reset email sent to test@example.com')
    })

    it('should send login code email', async () => {
      mockRequest = createRequest({
        type: 'login-code',
        email: 'user@test.com',
        code: '123456',
      })

      const response = await POST(mockRequest)
      const result = await response.json()

      expect(emailLib.sendLoginCodeEmail).toHaveBeenCalledWith({
        email: 'user@test.com',
        code: '123456',
      })
      expect(result.success).toBe(true)
    })

    it('should send verification email', async () => {
      mockRequest = createRequest({
        type: 'verification',
        email: 'verify@test.com',
        verificationLink: 'https://app.test.com/verify',
      })

      const response = await POST(mockRequest)

      expect(emailLib.sendVerificationEmail).toHaveBeenCalledWith({
        email: 'verify@test.com',
        verificationLink: 'https://app.test.com/verify',
      })
    })

    it('should send welcome email', async () => {
      mockRequest = createRequest({
        type: 'welcome',
        email: 'welcome@test.com',
        name: 'John Doe',
      })

      const response = await POST(mockRequest)

      expect(emailLib.sendWelcomeEmail).toHaveBeenCalledWith({
        email: 'welcome@test.com',
        name: 'John Doe',
      })
    })

    it('should send new device email', async () => {
      mockRequest = createRequest({
        type: 'new-device',
        email: 'device@test.com',
        loginDevice: 'Chrome',
        loginLocation: 'New York',
        loginIp: '192.168.1.1',
        loginDate: '2024-01-15',
      })

      const response = await POST(mockRequest)

      expect(emailLib.sendNewDeviceEmail).toHaveBeenCalledWith({
        email: 'device@test.com',
        loginDevice: 'Chrome',
        loginLocation: 'New York',
        loginIp: '192.168.1.1',
        loginDate: '2024-01-15',
      })
    })

    it('should send security alert email with default security link', async () => {
      mockRequest = createRequest({
        type: 'security-alert',
        email: 'alert@test.com',
        userName: 'Jane',
        alertType: 'suspicious_login',
        ipAddress: '10.0.0.1',
        location: 'Unknown',
        device: 'Unknown Device',
        timestamp: '2024-01-15',
      })

      const response = await POST(mockRequest)

      expect(emailLib.sendSecurityAlertEmail).toHaveBeenCalledWith({
        email: 'alert@test.com',
        userName: 'Jane',
        alertType: 'suspicious_login',
        ipAddress: '10.0.0.1',
        location: 'Unknown',
        device: 'Unknown Device',
        timestamp: '2024-01-15',
        securityLink: 'https://app.senseiwyze.com/app/settings/security',
      })
    })

    it('should send magic link email', async () => {
      mockRequest = createRequest({
        type: 'magic-link',
        email: 'magic@test.com',
        magicLink: 'https://app.test.com/magic',
      })

      const response = await POST(mockRequest)

      expect(emailLib.sendMagicLinkEmail).toHaveBeenCalledWith({
        email: 'magic@test.com',
        magicLink: 'https://app.test.com/magic',
      })
    })

    it('should return 400 for missing email', async () => {
      mockRequest = createRequest({
        type: 'welcome',
        // email missing
      })

      const response = await POST(mockRequest)
      const result = await response.json()

      expect(response.status).toBe(400)
      expect(result.error).toBe('Email address is required')
    })

    it('should return 400 for invalid email type', async () => {
      mockRequest = createRequest({
        type: 'invalid-type',
        email: 'test@test.com',
      })

      const response = await POST(mockRequest)
      const result = await response.json()

      expect(response.status).toBe(400)
      expect(result.error).toBe('Invalid email type')
    })

    it('should handle email send errors', async () => {
      vi.mocked(emailLib.sendWelcomeEmail).mockResolvedValueOnce({
        error: new Error('Send failed'),
      })

      mockRequest = createRequest({
        type: 'welcome',
        email: 'error@test.com',
        name: 'Error Test',
      })

      const response = await POST(mockRequest)
      const result = await response.json()

      expect(response.status).toBe(500)
      expect(result.error).toBe('Send failed')
    })

    it('should handle unexpected errors', async () => {
      vi.mocked(emailLib.sendWelcomeEmail).mockRejectedValueOnce(new Error('Unexpected error'))

      mockRequest = createRequest({
        type: 'welcome',
        email: 'crash@test.com',
      })

      const response = await POST(mockRequest)
      const result = await response.json()

      expect(response.status).toBe(500)
      expect(result.error).toBe('Failed to send test email')
    })
  })
})
