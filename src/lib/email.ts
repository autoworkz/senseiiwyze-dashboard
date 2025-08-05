import { Resend } from 'resend'
import { emailLogger } from '@/lib/logger'
import {
  LoginCodeEmail,
  MagicLinkEmail,
  NewDeviceEmail,
  PasswordResetEmail,
  SecurityAlertEmail,
  VerifyEmail,
  WelcomeEmail,
} from '../../emails'

// Initialize Resend client lazily to avoid API key errors during build time
type ResendLike = {
  emails: { send: (opts: any) => Promise<{ data: any; error: any }> }
  batch: { send: (emails: any[]) => Promise<{ data: any; error: any }> }
}

let resend: ResendLike | null = null

function getResendClient(): ResendLike {
  // If EMAIL_PROVIDER=CONSOLE or we're in test env, return console logger implementation
  if (process.env.EMAIL_PROVIDER === 'CONSOLE') {
    return {
      emails: {
        async send(opts: any) {
          emailLogger.info('Email sent via console provider', {
            from: opts.from,
            to: opts.to,
            subject: opts.subject,
            htmlPreview: opts.html?.slice(0, 200),
          })
          return { data: { preview: true }, error: null }
        },
      },
      batch: {
        async send(emails: any[]) {
          emailLogger.info('Batch emails sent via console provider', {
            count: emails.length,
            subjects: emails.map((e) => e.subject),
          })
          return { data: { preview: true }, error: null }
        },
      },
    } as ResendLike
  }

  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set')
    }
    resend = new Resend(apiKey) as unknown as ResendLike
  }
  return resend
}

// Email configuration
const FROM_EMAIL = 'SenseiiWyze <noreply@senseiwyze.com>'
const REPLY_TO_EMAIL = 'support@senseiwyze.com'

// Types
export interface EmailResponse {
  data?: { id: string }
  error?: Error
}

export interface PasswordResetEmailOptions {
  email: string
  resetLink: string
}

export interface LoginCodeEmailOptions {
  email: string
  code: string
}

export interface VerificationEmailOptions {
  email: string
  verificationLink: string
}

export interface WelcomeEmailOptions {
  email: string
  name?: string
}

export interface NewDeviceEmailOptions {
  email: string
  loginDate?: string
  loginDevice?: string
  loginLocation?: string
  loginIp?: string
}

export interface SecurityAlertEmailOptions {
  email: string
  userName?: string
  alertType: 'suspicious_login' | 'password_changed' | 'failed_attempts'
  ipAddress?: string
  location?: string
  device?: string
  timestamp?: string
  securityLink?: string
}

export interface MagicLinkEmailOptions {
  email: string
  magicLink: string
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail({
  email,
  resetLink,
}: PasswordResetEmailOptions): Promise<EmailResponse> {
  try {
    const resendClient = getResendClient()
    const { data, error } = await resendClient.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Reset your password',
      react: PasswordResetEmail({ resetLink }),
      headers: {
        'X-Entity-Ref-ID': crypto.randomUUID(),
      },
    })

    if (error) {
      emailLogger.error(
        'Error sending password reset email',
        error instanceof Error ? error : new Error(String(error))
      )
      return { error: error as Error }
    }

    emailLogger.info('Password reset email sent successfully', { to: email })
    return { data }
  } catch (error) {
    emailLogger.error(
      'Failed to send password reset email',
      error instanceof Error ? error : new Error(String(error))
    )
    return { error: error as Error }
  }
}

/**
 * Send login verification code email
 */
export async function sendLoginCodeEmail({
  email,
  code,
}: LoginCodeEmailOptions): Promise<EmailResponse> {
  try {
    const resendClient = getResendClient()
    const { data, error } = await resendClient.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Your login code',
      react: LoginCodeEmail({ validationCode: code }),
      headers: {
        'X-Entity-Ref-ID': crypto.randomUUID(),
      },
    })

    if (error) {
      emailLogger.error(
        'Error sending login code email',
        error instanceof Error ? error : new Error(String(error))
      )
      return { error: error as Error }
    }

    emailLogger.info('Login code email sent successfully', { to: email })
    return { data }
  } catch (error) {
    emailLogger.error(
      'Failed to send login code email',
      error instanceof Error ? error : new Error(String(error))
    )
    return { error: error as Error }
  }
}

/**
 * Send email verification link
 */
export async function sendVerificationEmail({
  email,
  verificationLink,
}: VerificationEmailOptions): Promise<EmailResponse> {
  try {
    const resendClient = getResendClient()
    const { data, error } = await resendClient.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Verify your email address',
      react: VerifyEmail({ verificationLink }),
      headers: {
        'X-Entity-Ref-ID': crypto.randomUUID(),
      },
    })

    if (error) {
      emailLogger.error(
        'Error sending verification email',
        error instanceof Error ? error : new Error(String(error))
      )
      return { error: error as Error }
    }

    emailLogger.info('Verification email sent successfully', { to: email })
    return { data }
  } catch (error) {
    emailLogger.error(
      'Failed to send verification email',
      error instanceof Error ? error : new Error(String(error))
    )
    return { error: error as Error }
  }
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail({
  email,
  name,
}: WelcomeEmailOptions): Promise<EmailResponse> {
  try {
    const resendClient = getResendClient()
    const { data, error } = await resendClient.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Welcome to SenseiiWyze!',
      react: WelcomeEmail({ name }),
      replyTo: REPLY_TO_EMAIL,
      headers: {
        'X-Entity-Ref-ID': crypto.randomUUID(),
      },
    })

    if (error) {
      emailLogger.error(
        'Error sending welcome email',
        error instanceof Error ? error : new Error(String(error))
      )
      return { error: error as Error }
    }

    emailLogger.info('Welcome email sent successfully', { to: email, name })
    return { data }
  } catch (error) {
    emailLogger.error(
      'Failed to send welcome email',
      error instanceof Error ? error : new Error(String(error))
    )
    return { error: error as Error }
  }
}

/**
 * Send new device login notification
 */
export async function sendNewDeviceEmail({
  email,
  loginDate,
  loginDevice,
  loginLocation,
  loginIp,
}: NewDeviceEmailOptions): Promise<EmailResponse> {
  try {
    const resendClient = getResendClient()
    const { data, error } = await resendClient.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'New device login',
      react: NewDeviceEmail({
        loginDate,
        loginDevice,
        loginLocation,
        loginIp,
      }),
      headers: {
        'X-Entity-Ref-ID': crypto.randomUUID(),
      },
    })

    if (error) {
      emailLogger.error(
        'Error sending new device email',
        error instanceof Error ? error : new Error(String(error))
      )
      return { error: error as Error }
    }

    emailLogger.info('New device email sent successfully', { to: email })
    return { data }
  } catch (error) {
    emailLogger.error(
      'Failed to send new device email',
      error instanceof Error ? error : new Error(String(error))
    )
    return { error: error as Error }
  }
}

/**
 * Send security alert email
 */
export async function sendSecurityAlertEmail({
  email,
  userName,
  alertType,
  ipAddress,
  location,
  device,
  timestamp,
  securityLink,
}: SecurityAlertEmailOptions): Promise<EmailResponse> {
  try {
    const resendClient = getResendClient()
    const { data, error } = await resendClient.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Security alert for your account',
      react: SecurityAlertEmail({
        userEmail: email,
        userName,
        alertType,
        ipAddress,
        location,
        device,
        timestamp,
        securityLink,
      }),
      headers: {
        'X-Entity-Ref-ID': crypto.randomUUID(),
      },
    })

    if (error) {
      emailLogger.error(
        'Error sending security alert email',
        error instanceof Error ? error : new Error(String(error))
      )
      return { error: error as Error }
    }

    emailLogger.info('Security alert email sent successfully', { to: email, alertType })
    return { data }
  } catch (error) {
    emailLogger.error(
      'Failed to send security alert email',
      error instanceof Error ? error : new Error(String(error))
    )
    return { error: error as Error }
  }
}

/**
 * Send magic link for passwordless login
 */
export async function sendMagicLinkEmail({
  email,
  magicLink,
}: MagicLinkEmailOptions): Promise<EmailResponse> {
  try {
    const resendClient = getResendClient()
    const { data, error } = await resendClient.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Sign in to SenseiiWyze',
      react: MagicLinkEmail({ magicLink }),
      headers: {
        'X-Entity-Ref-ID': crypto.randomUUID(),
      },
    })

    if (error) {
      emailLogger.error(
        'Error sending magic link email',
        error instanceof Error ? error : new Error(String(error))
      )
      return { error: error as Error }
    }

    emailLogger.info('Magic link email sent successfully', { to: email })
    return { data }
  } catch (error) {
    emailLogger.error(
      'Failed to send magic link email',
      error instanceof Error ? error : new Error(String(error))
    )
    return { error: error as Error }
  }
}

/**
 * Batch send emails (for notifications)
 */
export async function sendBatchEmails(
  emails: Array<{
    to: string
    subject: string
    react: React.ReactElement
  }>
): Promise<{ data?: any; error?: Error }> {
  try {
    const resendClient = getResendClient()
    const { data, error } = await resendClient.batch.send(
      emails.map((email) => ({
        from: FROM_EMAIL,
        ...email,
        headers: {
          'X-Entity-Ref-ID': crypto.randomUUID(),
        },
      }))
    )

    if (error) {
      emailLogger.error(
        'Error sending batch emails',
        error instanceof Error ? error : new Error(String(error))
      )
      return { error: error as Error }
    }

    emailLogger.info('Batch emails sent successfully', { count: emails.length })
    return { data }
  } catch (error) {
    emailLogger.error(
      'Failed to send batch emails',
      error instanceof Error ? error : new Error(String(error))
    )
    return { error: error as Error }
  }
}

/**
 * Validate email configuration
 */
export async function validateEmailConfig(): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) {
    emailLogger.error('RESEND_API_KEY is not configured')
    return false
  }

  try {
    // Try to get API key info to validate configuration
    const response = await fetch('https://api.resend.com/api-keys', {
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
    })

    return response.ok
  } catch (error) {
    emailLogger.error('Failed to validate Resend configuration:', error)
    return false
  }
}

// Export a function to get the Resend client for other modules that might need it
export function getResend() {
  return getResendClient()
}
