'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { SocialLogin } from '@/components/auth/social-login'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check for messages from URL params
    const messageParam = searchParams?.get('message')
    if (messageParam === 'verify-email') {
      setMessage('Please check your email and click the verification link to activate your account.')
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Use Better Auth to sign in
      const { data, error: authError } = await authClient.signIn.email({
        email,
        password,
        callbackURL: '/dashboard',
      })

      if (authError) {
        throw new Error(authError.message || 'Invalid credentials')
      }

      // If successful, the user will be redirected by Better Auth
      // For now, let's manually redirect based on role if we need custom logic
      router.push('/dashboard')

    } catch (error) {
      console.error('Login error:', error)
      setError(error instanceof Error ? error.message : 'Invalid credentials. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md bg-card text-card-foreground">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img
              src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg"
              className="h-12 w-12"
              alt="SenseiiWyze Logo"
            />
          </div>
          <CardTitle className="text-2xl text-foreground">Welcome to SenseiiWyze</CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to access your personalized tech coaching dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Social Login Options */}
          <div className="space-y-4">
            <SocialLogin callbackURL="/dashboard" />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>
          </div>

          {error && (
            <Alert className="mt-4" variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {message && (
            <Alert className="mt-4">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t">
            <div className="space-y-4">
              <div className="text-center">
                <a
                  href="/auth/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot your password?
                </a>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <a href="/auth/signup" className="text-primary hover:underline">
                    Sign up
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Demo login buttons for testing */}
          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-muted-foreground text-center mb-3">
              Demo Accounts (for testing):
            </p>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  setEmail('learner@demo.com')
                  setPassword('Demo@123456710')
                }}
              >
                👨‍🎓 Learner Demo
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  setEmail('admin@demo.com')
                  setPassword('Demo@123456710')
                }}
              >
                👥 Admin Demo
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  setEmail('executive@demo.com')
                  setPassword('Demo@123456710')
                }}
              >
                📊 Executive Demo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 