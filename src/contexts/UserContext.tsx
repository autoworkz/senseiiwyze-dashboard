'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { onboardingUtils, OnboardingStatus } from '@/utils/onboarding'

interface User {
  id: string
  name: string
  email: string
  role: string | null
  image?: string | null
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
  // Profile-specific data
  profileId?: string
  workplace?: string
  jobTitle?: string
  profilePhoto?: string
  isOnboarding: boolean
  onboardingStep: number
  // Organization context
  organizationId?: string | null
  onboardingOrgId?: string | null
}

interface UserContextType {
  user: User | null
  isLoading: boolean
  error: string | null
  onboardingStatus: OnboardingStatus
  refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [onboardingStatus, setOnboardingStatus] = useState<OnboardingStatus>({
    isLoading: true,
    needsOnboarding: false,
    hasProfile: false,
    onboardingStep: -1,
  })
  const fetchUserData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Get Better Auth session
      const session = await authClient.getSession()
      if (!session?.data?.user) {
        setUser(null)
        setOnboardingStatus({
          isLoading: false,
          needsOnboarding: false,
          hasProfile: false,
          onboardingStep: -1,
        })
        return
      }

      const baUser = session.data.user
      
      // Fetch profile data from API
      const response = await fetch('/api/user/profile/status', {
        method: 'GET',
        headers: {
          'X-Internal-Request': 'true',
        },
      })

      let profileData = null
      if (response.ok) {
        const data = await response.json()
        profileData = data
      }

      // Combine Better Auth user with profile data
      const combinedUser: User = {
        id: baUser.id,
        name: profileData?.name || baUser.name || baUser.email || "Unknown User",
        email: baUser.email,
        role: baUser.role || null,
        image: baUser.image,
        emailVerified: baUser.emailVerified,
        createdAt: baUser.createdAt,
        updatedAt: baUser.updatedAt,
        // Profile-specific data
        profileId: profileData?.profileId,
        workplace: profileData?.workplace,
        jobTitle: profileData?.job_title,
        profilePhoto: profileData?.profile_photo,
        isOnboarding: profileData?.is_onboarding ?? false,
        onboardingStep: profileData?.onboarding_step ?? -1,
        // Organization context
        organizationId: session.data.session?.activeOrganizationId,
        onboardingOrgId: profileData?.onboarding_org_id,
      }


      if (combinedUser.onboardingStep >= 2 && combinedUser.onboardingOrgId) {
        if (combinedUser.organizationId !== combinedUser.onboardingOrgId) {
          await authClient.organization.setActive({
            organizationId: combinedUser.onboardingOrgId,
          });

          combinedUser.organizationId = combinedUser.onboardingOrgId;
        }
      }
      
      setUser(combinedUser)
    
      // Update onboarding status
      const needsOnboarding = combinedUser.isOnboarding
      const hasProfile = !!combinedUser.profileId
      const newOnboardingStatus = {
        isLoading: false,
        needsOnboarding,
        hasProfile,
        userRole: combinedUser.role,
        onboardingStep: combinedUser.onboardingStep,
      }

      setOnboardingStatus(newOnboardingStatus)
      onboardingUtils.setOnboardingStatus(newOnboardingStatus)

    } catch (err) {
      console.error('Error fetching user data:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch user data')
      
      // Set fallback status
      setOnboardingStatus({
        isLoading: false,
        needsOnboarding: false,
        hasProfile: true,
        onboardingStep: -1,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const refreshUser = async () => {
    await fetchUserData()
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  return (
    <UserContext.Provider value={{
      user,
      isLoading,
      error,
      onboardingStatus,
      refreshUser,
    }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
