import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Check if this is an internal request
    const internalRequest = request.headers.get('X-Internal-Request');
    if (internalRequest !== 'true') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get session from Better Auth
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { error: 'No session found' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // First, check if user has a linked profile in ba_users
    const { data: baUser, error: baError } = await supabase
      .from('ba_users')
      .select('profile_id')
      .eq('id', userId)
      .maybeSingle();

    let profileId = baUser?.profile_id;  

    // If we have a profile_id, get the profile data
    if (profileId) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, is_onboarding, onboarding_step, email, name')
        .eq('id', profileId)
        .maybeSingle();

      if (profile) {
        return NextResponse.json({
          hasProfile: true,
          is_onboarding: profile.is_onboarding,
          onboarding_step: profile.onboarding_step,
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
      source: 'no_profile'
    });

  } catch (error) {
    console.error('Profile status API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        hasProfile: false,
        is_onboarding: true, // Default to onboarding on error
        onboarding_step: 1 // Start at step 1 on error (1-based)
      },
      { status: 500 }
    );
  }
}
