'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { Github, Chrome, MessageSquare } from 'lucide-react'

interface SocialLoginProps {
  callbackURL?: string
  className?: string
}

export function SocialLogin({ callbackURL = '/dashboard', className }: SocialLoginProps) {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null)

  const handleSocialLogin = async (provider: 'github' | 'google' | 'discord') => {
    try {
      setLoadingProvider(provider)
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
      icon: Github,
      variant: 'outline' as const,
    },
    {
      id: 'google' as const,
      name: 'Google',
      icon: Chrome,
      variant: 'outline' as const,
    },
    {
      id: 'discord' as const,
      name: 'Discord',
      icon: MessageSquare,
      variant: 'outline' as const,
    },
  ]

  return (
    <div className={`space-y-3 ${className}`}>
      {providers.map(({ id, name, icon: Icon, variant }) => (
        <Button
          key={id}
          onClick={() => handleSocialLogin(id)}
          disabled={loadingProvider !== null}
          variant={variant}
          className="w-full"
        >
          <Icon className="mr-2 h-4 w-4" />
          {loadingProvider === id ? 'Signing in...' : `Continue with ${name}`}
        </Button>
      ))}
    </div>
  )
}