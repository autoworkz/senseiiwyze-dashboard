'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { authClient } from '../../../lib/auth-client'
import { Github } from 'lucide-react'

interface GitHubLoginButtonProps {
  callbackURL?: string
  className?: string
  children?: React.ReactNode
}

export function GitHubLoginButton({ 
  callbackURL = '/dashboard', 
  className,
  children 
}: GitHubLoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleGitHubLogin = async () => {
    try {
      setIsLoading(true)
      await authClient.signIn.social({
        provider: 'github',
        callbackURL,
      })
    } catch (error) {
      console.error('GitHub login failed:', error)
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleGitHubLogin}
      disabled={isLoading}
      variant="outline"
      className={className}
    >
      <Github className="mr-2 h-4 w-4" />
      {children || (isLoading ? 'Signing in...' : 'Continue with GitHub')}
    </Button>
  )
}