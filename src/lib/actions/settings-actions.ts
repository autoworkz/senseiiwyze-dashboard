'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'

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
    headers: await headers(),
  });

  if (!session?.user) {
    // You can also return {error} if you don't want a redirect here
    // but your original version redirected, so keeping that behavior.
    return { error: "Unauthorized" };
  }

  try {
    const profileData: ProfileUpdateData = {
      displayName: (formData.get("displayName") as string) || "",
      workplace: (formData.get("workplace") as string) || undefined,
      jobTitle: (formData.get("jobTitle") as string) || undefined,
      bio: (formData.get("bio") as string) || "",
    };

    const userId = session.user.id as string;
    const userEmail = session.user.email as string;

    // 1) Ensure profile exists (by email)
    const { data: existingProfile, error: fetchErr } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", userEmail)
      .maybeSingle();

    if (fetchErr && fetchErr.code !== "PGRST116") {
      throw fetchErr;
    }

    let profileId = existingProfile?.id as string | undefined;

    // 2) Insert if missing
    if (!profileId) {
      const { data: created, error: createErr } = await supabase
        .from("profiles")
        .insert({
          email: userEmail,
          name: profileData.displayName || userEmail,
          workplace: profileData.workplace ?? null,
          job_title: profileData.jobTitle ?? null, // NOTE: snake_case column
          bio: profileData.bio ?? "",               // bio always present now
        })
        .select("id")
        .single();

      if (createErr) throw createErr;
      profileId = created.id;
    }

    // 3) Update profile fields
    const { error: updateErr } = await supabase
      .from("profiles")
      .update({
        name: profileData.displayName || userEmail,
        workplace: profileData.workplace ?? null,
        job_title: profileData.jobTitle ?? null, 
        bio: profileData.bio ?? "",
        updated_at: new Date().toISOString(),
      })
      .eq("id", profileId);

    if (updateErr) throw updateErr;

    // 4) Update common fields in ba_users and link profile_id
    const { error: baUserUpdateErr } = await supabase
      .from("ba_users" as any) 
      .update({
        name: profileData.displayName || session.user.name || userEmail,
        profile_id: profileId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (baUserUpdateErr) throw baUserUpdateErr;

    revalidatePath("/app/settings");
    return { success: true, message: "Profile updated successfully" };
  } catch (error) {
    console.error("Profile update error:", error);
    return { error: "Failed to update profile" };
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

    // Persisting notifications can be added here if/when a table exists
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
      theme: (formData.get('theme') as 'light' | 'dark' | 'system') || 'system',
      language: (formData.get('language') as string) || 'en',
    }

    // Theme is handled by next-themes; persist language if you add a table
    console.log('Updating appearance settings:', settings)

    revalidatePath('/app/settings')
    return { success: true, message: 'Appearance settings updated' }
  } catch (error) {
    console.error('Appearance settings update error:', error)
    return { error: 'Failed to update appearance settings' }
  }
}