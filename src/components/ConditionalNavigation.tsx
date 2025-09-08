'use client'

import { useUser } from '@/contexts/UserContext'
import { GlobalNavigation } from '@/components/layout/GlobalNavigation'

interface ConditionalNavigationProps {
  user: any
}

export function ConditionalNavigation({ user }: ConditionalNavigationProps) {
  const { onboardingStatus } = useUser()

  // Don't show navigation during onboarding
  if (onboardingStatus.needsOnboarding) {
    return null
  }

  return <GlobalNavigation user={user} />
}
