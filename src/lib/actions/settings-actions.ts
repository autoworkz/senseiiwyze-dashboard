'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

interface ProfileUpdateData {
  displayName: string
  workplace?: string
  jobTitle?: string
  bio?: string
}

interface NotificationPreferences {
  emailNotifications: boolean
  pushNotifications: boolean
  marketingEmails: boolean
}

interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system'
  language: string
}

export async function updateProfileAction(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session?.user) {
    redirect('/auth/login')
  }

  try {
    const profileData: ProfileUpdateData = {
      displayName: formData.get('displayName') as string,
      workplace: formData.get('workplace') as string || undefined,
      jobTitle: formData.get('jobTitle') as string || undefined,
      bio: formData.get('bio') as string || undefined,
    }

    // TODO: Update user profile in database
    // For now, this is a placeholder that would update the user's profile
    console.log('Updating profile:', profileData)

    // Revalidate the settings page to show updated data
    revalidatePath('/app/settings')
    
    return { success: true, message: 'Profile updated successfully' }
  } catch (error) {
    console.error('Profile update error:', error)
    return { error: 'Failed to update profile' }
  }
}

export async function updateNotificationPreferencesAction(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session?.user) {
    redirect('/auth/login')
  }

  try {
    const preferences: NotificationPreferences = {
      emailNotifications: formData.get('emailNotifications') === 'true',
      pushNotifications: formData.get('pushNotifications') === 'true',
      marketingEmails: formData.get('marketingEmails') === 'true',
    }

    // TODO: Update notification preferences in database
    console.log('Updating notification preferences:', preferences)

    revalidatePath('/app/settings')
    
    return { success: true, message: 'Notification preferences updated' }
  } catch (error) {
    console.error('Notification preferences update error:', error)
    return { error: 'Failed to update notification preferences' }
  }
}

export async function updateAppearanceAction(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session?.user) {
    redirect('/auth/login')
  }

  try {
    const settings: AppearanceSettings = {
      theme: formData.get('theme') as 'light' | 'dark' | 'system',
      language: formData.get('language') as string,
    }

    // Theme is now handled client-side by next-themes
    // TODO: Update language and other appearance settings in database
    console.log('Updating appearance settings:', settings)

    revalidatePath('/app/settings')
    
    return { success: true, message: 'Appearance settings updated' }
  } catch (error) {
    console.error('Appearance settings update error:', error)
    return { error: 'Failed to update appearance settings' }
  }
}