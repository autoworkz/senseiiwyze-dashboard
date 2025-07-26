'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'

interface SocialLoginProps {
  callbackURL?: string
  className?: string
}

export function SocialLogin({ callbackURL = '/dashboard', className }: SocialLoginProps) {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null)

  const handleSocialLogin = async (provider: 'github' | 'google') => {
    try {
      setLoadingProvider(provider)
      
      // Use Better Auth's signIn.social method
      await authClient.signIn.social({
        provider,
        callbackURL,
      })
      
    } catch (error) {
      console.error(`${provider} login failed:`, error)
      setLoadingProvider(null)
    }
  }

  const providers = [
    {
      id: 'github' as const,
      name: 'GitHub',
    },
    {
      id: 'google' as const,
      name: 'Google',
    },
  ]

  return (
    <div className={`space-y-3 ${className}`}>
      {providers.map(({ id, name }) => (
        <Button
          key={id}
          onClick={() => handleSocialLogin(id)}
          disabled={loadingProvider !== null}
          variant="outline"
          className="w-full"
        >
          {loadingProvider === id ? 'Signing in...' : `Continue with ${name}`}
        </Button>
      ))}
    </div>
  )
}