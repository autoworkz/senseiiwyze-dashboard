'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useUser } from '@/contexts/UserContext'
import { Loader2 } from 'lucide-react'

interface OnboardingGuardProps {
  children: React.ReactNode
}

export function OnboardingGuard({ children }: OnboardingGuardProps) {
  const { isLoading, onboardingStatus } = useUser()
  const router = useRouter()
  const pathname = usePathname()

  // Handle redirects with useEffect at the top level
  useEffect(() => {
    // Don't redirect if we're on the payment success page
    if (pathname === '/app/onboarding/payment/success') {
      return
    }
    
    if (onboardingStatus.needsOnboarding && !pathname.startsWith('/app/onboarding')) {
      router.push('/app/onboarding')
    } else if (!onboardingStatus.needsOnboarding && pathname.startsWith('/app/onboarding')) {
      router.push('/app')
    }
  }, [onboardingStatus.needsOnboarding, pathname, router])

  // Show loading spinner while checking onboarding status
  if (isLoading || onboardingStatus.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // If user needs onboarding and not on onboarding page, show redirecting message
  if (onboardingStatus.needsOnboarding && !pathname.startsWith('/app/onboarding')) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Redirecting to onboarding...</p>
        </div>
      </div>
    )
  }

  // If user completed onboarding and is on onboarding page, show redirecting message
  if (!onboardingStatus.needsOnboarding && pathname.startsWith('/app/onboarding')) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
