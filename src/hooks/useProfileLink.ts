"use client";

import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export type DbUserRole = 'admin-executive' | 'admin-manager'

interface EnsureProfileParams {
  userId: string
  email: string
  name: string
}

interface EnsureProfileResult {
  profileId: string
}

export function useProfileLink() {
  const [isLinking, setIsLinking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const ensureProfileLinked = useCallback(async (
    params: EnsureProfileParams
  ): Promise<EnsureProfileResult> => {
    const { userId, email, name } = params
    setIsLinking(true)
    setError(null)

    try {
      // 1) Check if profile already exists by email
      const { data: existingProfile, error: existingErr } = await supabase
        .from('profiles')
        .select('id, user_role, is_onboarding')
        .eq('email', email)
        .maybeSingle()

      if (existingErr && existingErr.code !== 'PGRST116') {
        // PGRST116 is "Results contain 0 rows" for maybeSingle
        throw existingErr
      }

      let profileId: string | undefined = existingProfile?.id

      // 2) If not exist, create new profile
      if (!profileId) {
        const { data: created, error: createErr } = await supabase
          .from('profiles')
          .insert({
            email,
            name,
            user_role: 'admin-executive', // Default role for new profiles
            is_onboarding: true // New profiles need onboarding
          })
          .select('id')
          .single()

        if (createErr) {
          throw createErr
        }

        profileId = created.id
        console.log('✅ Created new profile for admin-executive:', profileId)
      } else {
        console.log('✅ Found existing profile:', profileId, 'role:', existingProfile?.user_role, 'onboarding:', existingProfile?.is_onboarding)
      }

      // 3) Link profile to Better Auth user in ba_users
      const { error: linkErr } = await supabase
        .from('ba_users' as any)
        .update({ profile_id: profileId })
        .eq('id', userId)

      if (linkErr) {
        throw linkErr
      }

      console.log('✅ Linked profile to Better Auth user:', userId, '→', profileId)

      return { profileId: profileId! }
    } catch (err: any) {
      setError(err?.message || 'Failed to ensure profile link')
      throw err
    } finally {
      setIsLinking(false)
    }
  }, [])

  const completeOnboarding = useCallback(async (profileId: string) => {
    setIsLinking(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_onboarding: false })
        .eq('id', profileId)

      if (error) {
        throw error
      }

      console.log('✅ Onboarding completed for profile:', profileId)
    } catch (err: any) {
      setError(err?.message || 'Failed to complete onboarding')
      throw err
    } finally {
      setIsLinking(false)
    }
  }, [])

  return { isLinking, error, ensureProfileLinked }
} 