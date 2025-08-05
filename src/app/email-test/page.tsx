'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type EmailType =
  | 'password-reset'
  | 'login-code'
  | 'verification'
  | 'welcome'
  | 'new-device'
  | 'security-alert'
  | 'magic-link'

interface EmailTestResponse {
  success?: boolean
  error?: string
  data?: any
  message?: string
}

export default function EmailTestPage() {
  const [emailType, setEmailType] = useState<EmailType>('welcome')
  const [recipientEmail, setRecipientEmail] = useState('')
  const [loading, setLoading] = useState(false)

  // Email-specific fields
  const [userName, setUserName] = useState('Test User')
  const [resetLink, setResetLink] = useState(
    'https://app.senseiwyze.com/auth/reset-password?token=test'
  )
  const [loginCode, setLoginCode] = useState('123456')
  const [verificationLink, setVerificationLink] = useState(
    'https://app.senseiwyze.com/auth/verify-email?token=test'
  )
  const [magicLink, setMagicLink] = useState(
    'https://app.senseiwyze.com/auth/magic-link?token=test'
  )
  const [alertType, setAlertType] = useState<
    'suspicious_login' | 'password_changed' | 'failed_attempts'
  >('suspicious_login')
  const [loginDevice, setLoginDevice] = useState('Chrome on Mac OS X')
  const [loginLocation, setLoginLocation] = useState('San Francisco, CA')
  const [loginIp, setLoginIp] = useState('192.168.1.1')

  const sendTestEmail = async () => {
    if (!recipientEmail) {
      toast.error('Please enter a recipient email')
      return
    }

    setLoading(true)

    try {
      const emailData: any = {
        type: emailType,
        email: recipientEmail,
      }

      // Add email-specific data
      switch (emailType) {
        case 'password-reset':
          emailData.resetLink = resetLink
          break
        case 'login-code':
          emailData.code = loginCode
          break
        case 'verification':
          emailData.verificationLink = verificationLink
          break
        case 'welcome':
          emailData.name = userName
          break
        case 'new-device':
          emailData.loginDevice = loginDevice
          emailData.loginLocation = loginLocation
          emailData.loginIp = loginIp
          emailData.loginDate = new Date().toLocaleString()
          break
        case 'security-alert':
          emailData.userName = userName
          emailData.alertType = alertType
          emailData.ipAddress = loginIp
          emailData.location = loginLocation
          emailData.device = loginDevice
          emailData.timestamp = new Date().toLocaleString()
          break
        case 'magic-link':
          emailData.magicLink = magicLink
          break
      }

      const response = await fetch('/api/email-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      })

      const result = await response.json() as EmailTestResponse

      if (response.ok) {
        toast.success('Test email sent successfully!')
      } else {
        toast.error(result.error || 'Failed to send test email')
      }
    } catch (error) {
      toast.error('Error sending test email')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Email Template Testing</CardTitle>
          <CardDescription>
            Test and preview email templates before integrating with authentication flows
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email-type">Email Type</Label>
            <Select value={emailType} onValueChange={(value) => setEmailType(value as EmailType)}>
              <SelectTrigger id="email-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="welcome">Welcome Email</SelectItem>
                <SelectItem value="verification">Email Verification</SelectItem>
                <SelectItem value="password-reset">Password Reset</SelectItem>
                <SelectItem value="login-code">Login Code (OTP)</SelectItem>
                <SelectItem value="magic-link">Magic Link</SelectItem>
                <SelectItem value="new-device">New Device Alert</SelectItem>
                <SelectItem value="security-alert">Security Alert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Email</Label>
            <Input
              id="recipient"
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="test@example.com"
            />
          </div>

          {/* Email-specific fields */}
          {(emailType === 'welcome' || emailType === 'security-alert') && (
            <div className="space-y-2">
              <Label htmlFor="user-name">User Name</Label>
              <Input
                id="user-name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Test User"
              />
            </div>
          )}

          {emailType === 'password-reset' && (
            <div className="space-y-2">
              <Label htmlFor="reset-link">Reset Link</Label>
              <Input
                id="reset-link"
                value={resetLink}
                onChange={(e) => setResetLink(e.target.value)}
                placeholder="https://app.senseiwyze.com/auth/reset-password?token=test"
              />
            </div>
          )}

          {emailType === 'login-code' && (
            <div className="space-y-2">
              <Label htmlFor="login-code">Login Code</Label>
              <Input
                id="login-code"
                value={loginCode}
                onChange={(e) => setLoginCode(e.target.value)}
                placeholder="123456"
                maxLength={6}
              />
            </div>
          )}

          {emailType === 'verification' && (
            <div className="space-y-2">
              <Label htmlFor="verification-link">Verification Link</Label>
              <Input
                id="verification-link"
                value={verificationLink}
                onChange={(e) => setVerificationLink(e.target.value)}
                placeholder="https://app.senseiwyze.com/auth/verify-email?token=test"
              />
            </div>
          )}

          {emailType === 'magic-link' && (
            <div className="space-y-2">
              <Label htmlFor="magic-link">Magic Link</Label>
              <Input
                id="magic-link"
                value={magicLink}
                onChange={(e) => setMagicLink(e.target.value)}
                placeholder="https://app.senseiwyze.com/auth/magic-link?token=test"
              />
            </div>
          )}

          {(emailType === 'new-device' || emailType === 'security-alert') && (
            <>
              <div className="space-y-2">
                <Label htmlFor="login-device">Device</Label>
                <Input
                  id="login-device"
                  value={loginDevice}
                  onChange={(e) => setLoginDevice(e.target.value)}
                  placeholder="Chrome on Mac OS X"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-location">Location</Label>
                <Input
                  id="login-location"
                  value={loginLocation}
                  onChange={(e) => setLoginLocation(e.target.value)}
                  placeholder="San Francisco, CA"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-ip">IP Address</Label>
                <Input
                  id="login-ip"
                  value={loginIp}
                  onChange={(e) => setLoginIp(e.target.value)}
                  placeholder="192.168.1.1"
                />
              </div>
            </>
          )}

          {emailType === 'security-alert' && (
            <div className="space-y-2">
              <Label htmlFor="alert-type">Alert Type</Label>
              <Select value={alertType} onValueChange={(value) => setAlertType(value as any)}>
                <SelectTrigger id="alert-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="suspicious_login">Suspicious Login</SelectItem>
                  <SelectItem value="password_changed">Password Changed</SelectItem>
                  <SelectItem value="failed_attempts">Failed Login Attempts</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Button onClick={sendTestEmail} disabled={loading} className="w-full">
            {loading ? 'Sending...' : 'Send Test Email'}
          </Button>

          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> Make sure you have configured your RESEND_API_KEY in your
              environment variables. Test emails will be sent using the configured email service.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
