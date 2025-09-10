import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { withAuth } from '@/lib/api/with-auth';

export const GET = withAuth(async (request: NextRequest, { session }) => {
  try {

    const userId = session.user.id;

    const { data: baUser, error: baError } = await supabase
      .from('ba_users')
      .select('profile_id')
      .eq('id', userId)
      .maybeSingle();

    let profileId = baUser?.profile_id;  

    if (profileId) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, is_onboarding, onboarding_step, email, name, onboarding_org_id')
        .eq('id', profileId)
        .maybeSingle();

      if (profile) {
        return NextResponse.json({
          hasProfile: true,
          is_onboarding: profile.is_onboarding,
          onboarding_step: profile.onboarding_step,
          onboarding_org_id: profile.onboarding_org_id,
          profileId: profile.id,
          source: 'existing_link'
        });
      }
    }

    // No profile found
    return NextResponse.json({
      hasProfile: false,
      is_onboarding: true, // Default to true so they go through onboarding
      onboarding_step: 1, // Start at step 1 for new users (1-based)
      profileId: null,
      onboarding_org_id: null,
      source: 'no_profile'
    });

  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Internal server error',
        hasProfile: false,
        is_onboarding: true, // Default to onboarding on error
        onboarding_step: 1, // Start at step 1 on error (1-based)
        onboarding_org_id: null
      },
      { status: 500 }
    );
  }
});
