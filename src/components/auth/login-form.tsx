'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { supabase } from '@/lib/supabase'

export function LoginForm() {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsPending(true)
    setError(null)
    
    try {
      const email = formData.get('email') as string
      const password = formData.get('password') as string

      // Guard: block mobile-only accounts from dashboard sign-in
      const { data: userRow } = await (supabase as any)
        .from('ba_users')
        .select('*')
        .eq('email', email)
        .maybeSingle()
      console.log("userRow", userRow)
      if (userRow && userRow.is_dashboard_user === false) {
        setError('Unauthorized')
        return
      }

      const result = await authClient.signIn.email({
        email,
        password,
      })
      if (result?.error) {
        setError(result.error.message || 'Authentication failed')
      }
    } catch (error) {
      setError('Authentication failed')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4 w-full max-w-sm">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          required
          disabled={isPending}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          required
          disabled={isPending}
        />
      </div>
      
      {error && (
        <div className="text-sm text-destructive">
          {error}
        </div>
      )}
      
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          'Sign in'
        )}
      </Button>
    </form>
  )
}