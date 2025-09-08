'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/contexts/UserContext'

export function useCompleteOnboarding() {
  const [isCompleting, setIsCompleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { refreshUser } = useUser()

  const completeOnboarding = async () => {
    try {
      setIsCompleting(true)
      setError(null)

      // Update the database
      try {
        const response = await fetch('/api/user/onboarding/complete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Failed to complete onboarding')
        }

        // Don't refresh user data immediately - let the redirect handle it
        // The UserContext will refresh when the user lands on the dashboard
      } catch (dbError) {
        console.error('Database update failed:', dbError)
        throw dbError
      }

      // Redirect to dashboard after successful completion
      router.push('/app')
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsCompleting(false)
    }
  }

  return {
    completeOnboarding,
    isCompleting,
    error,
  }
}
