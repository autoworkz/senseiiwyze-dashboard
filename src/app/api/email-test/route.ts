import { type NextRequest, NextResponse } from 'next/server'
import {
  sendLoginCodeEmail,
  sendMagicLinkEmail,
  sendOrganizationMagicLinkEmail,
  sendNewDeviceEmail,
  sendPasswordResetEmail,
  sendSecurityAlertEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
  type EmailResponse,
} from '@/lib/email'

interface EmailTestBody {
  type: 'password-reset' | 'login-code' | 'verification' | 'welcome' | 'new-device' | 'security-alert' | 'magic-link' | 'organization-magic-link' | 'organization-magic-link-context'
  email: string
  resetLink?: string
  code?: string
  verificationLink?: string
  name?: string
  loginDate?: string
  loginDevice?: string
  loginLocation?: string
  loginIp?: string
  userName?: string
  alertType?: 'suspicious_login' | 'password_changed' | 'failed_attempts'
  ipAddress?: string
  location?: string
  device?: string
  timestamp?: string
  securityLink?: string
  magicLink?: string
  organizationName?: string
  invitedByUsername?: string
  invitedByEmail?: string
  invitationId?: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as EmailTestBody
    const { type, email, ...emailData } = body

    if (!email) {
      return NextResponse.json({ error: 'Email address is required' }, { status: 400 })
    }

    let result: EmailResponse | null = null;

    switch (type) {
      case 'password-reset':
        result = await sendPasswordResetEmail({
          to: email,                                     // ✅ use "to", not "email"
          subject: "Test password reset",
          html: "<p>Testing Resend + Better Auth reset mail.</p>",
        });
        break

      case 'login-code':
        result = await sendLoginCodeEmail({
          email,
          code: emailData.code!,
        })
        break

      case 'verification':
        result = await sendVerificationEmail({
          email,
          verificationLink: emailData.verificationLink!,
        })
        break

      case 'welcome':
        result = await sendWelcomeEmail({
          email,
          name: emailData.name,
        })
        break

      case 'new-device':
        result = await sendNewDeviceEmail({
          email,
          loginDate: emailData.loginDate,
          loginDevice: emailData.loginDevice,
          loginLocation: emailData.loginLocation,
          loginIp: emailData.loginIp,
        })
        break

      case 'security-alert':
        result = await sendSecurityAlertEmail({
          email,
          userName: emailData.userName,
          alertType: emailData.alertType!,
          ipAddress: emailData.ipAddress,
          location: emailData.location,
          device: emailData.device,
          timestamp: emailData.timestamp,
          securityLink:
            emailData.securityLink || 'https://app.senseiwyze.com/app/settings/security',
        })
        break

      case 'magic-link':
        result = await sendMagicLinkEmail({
          email,
          magicLink: emailData.magicLink!,
        })
        break

      case 'organization-magic-link':
        result = await sendOrganizationMagicLinkEmail({
          email,
          magicLink: emailData.magicLink!,
          organizationName: emailData.organizationName || 'Test Organization',
          invitedByUsername: emailData.invitedByUsername || 'Test Inviter',
          invitedByEmail: emailData.invitedByEmail || 'inviter@test.com',
          inviteeEmail: email,
        })
        break

      case 'organization-magic-link-context':
        // Test the organization invite context utility
        const { getOrganizationInviteContext } = await import('@/lib/organization-invite-context');
        const context = await getOrganizationInviteContext(emailData.invitationId || 'test-id');
        
        if (context) {
          result = await sendOrganizationMagicLinkEmail({
            email,
            magicLink: emailData.magicLink!,
            organizationName: context.organizationName,
            invitedByUsername: context.inviterName,
            invitedByEmail: context.inviterEmail,
            inviteeEmail: context.inviteeEmail,
          });
        } else {
          return NextResponse.json({ error: 'Failed to get organization invite context' }, { status: 400 });
        }
        break

      default:
        return NextResponse.json({ error: 'Invalid email type' }, { status: 400 })
    }

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: `Test ${type} email sent to ${email}`,
    })
  } catch (error) {
    console.error('Email test error:', error)
    return NextResponse.json({ error: 'Failed to send test email' }, { status: 500 })
  }
}
