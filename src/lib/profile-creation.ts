import { supabase } from '@/lib/supabase';

export type DbUserRole = 'admin-executive' | 'admin-manager';

export interface CreateProfileParams {
  userId: string;
  email: string;
  name: string;
  role: DbUserRole;
  organizationId?: string;
}

export interface CreateProfileResult {
  profileId: string;
  isNewProfile: boolean;
}

/**
 * Creates or updates a profile for a Better Auth user
 * Uses the same logic as useProfileLink hook
 */
export async function createOrUpdateProfile(
  params: CreateProfileParams
): Promise<CreateProfileResult> {
  const { userId, email, name, role, organizationId } = params;

  try {
    // 1) Check if profile already exists by email (same as hook)
    const { data: existingProfile, error: existingErr } = await supabase
      .from('profiles')
      .select('id, user_role, is_onboarding')
      .eq('email', email)
      .maybeSingle();

    if (existingErr && existingErr.code !== 'PGRST116') {
      // PGRST116 is "Results contain 0 rows" for maybeSingle
      throw existingErr;
    }

    let profileId: string | undefined = existingProfile?.id;
    let isNewProfile = false;

    // 2) If not exist, create new profile (same as hook)
    if (!profileId) {
      const { data: created, error: createErr } = await supabase
        .from('profiles')
        .insert({
          email,
          name,
          is_onboarding: role === 'admin-executive', // Only admin-executive needs onboarding
          onboarding_step: role === 'admin-executive' ? 1 : -1, // Only set step for admin-executive
          onboarding_org_id: organizationId, // Set the organization they're joining
        })
        .select('id')
        .single();

      if (createErr) {
        throw createErr;
      }

      profileId = created.id;
      isNewProfile = true;
      console.log('✅ Created new profile for invited user:', profileId, 'role:', role, 'onboarding:', role === 'admin-executive');
    } else {
      console.log('✅ Found existing profile:', profileId, 'role:', existingProfile?.user_role, 'onboarding:', existingProfile?.is_onboarding);
    }

    // 3) Link profile to Better Auth user in ba_users (same as hook)
    const { error: linkErr } = await supabase
      .from('ba_users' as any)
      .update({ profile_id: profileId, role })
      .eq('id', userId);

    if (linkErr) {
      throw linkErr;
    }

    console.log('✅ Linked profile to Better Auth user:', userId, '→', profileId, 'role:', role);

    return { profileId: profileId!, isNewProfile };
  } catch (error) {
    console.error('Error creating/updating profile:', error);
    throw error;
  }
}
