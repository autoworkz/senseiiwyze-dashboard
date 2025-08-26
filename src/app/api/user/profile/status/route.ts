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
    const userEmail = session.user.email;

    // First, check if user has a linked profile in ba_users
    const { data: baUser, error: baError } = await supabase
      .from('ba_users')
      .select('profile_id')
      .eq('id', userId)
      .maybeSingle();

    let profileId = baUser?.profile_id;

    // If no profile_id in ba_users, try to find profile by email
    if (!profileId && userEmail) {
      const { data: profileByEmail, error: emailError } = await supabase
        .from('profiles')
        .select('id, user_role, is_onboarding')
        .eq('email', userEmail)
        .maybeSingle();

      if (profileByEmail) {
        profileId = profileByEmail.id;
        
        // Link the profile to the user in ba_users
        await supabase
          .from('ba_users')
          .update({ profile_id: profileId })
          .eq('id', userId);

        return NextResponse.json({
          hasProfile: true,
          user_role: profileByEmail.user_role,
          is_onboarding: profileByEmail.is_onboarding,
          profileId: profileId,
          source: 'linked_by_email'
        });
      }
    }

    // If we have a profile_id, get the profile data
    if (profileId) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, user_role, is_onboarding, email, name')
        .eq('id', profileId)
        .maybeSingle();

      if (profile) {
        return NextResponse.json({
          hasProfile: true,
          user_role: profile.user_role,
          is_onboarding: profile.is_onboarding,
          profileId: profile.id,
          source: 'existing_link'
        });
      }
    }

    // No profile found
    return NextResponse.json({
      hasProfile: false,
      user_role: null,
      is_onboarding: true, // Default to true so they go through onboarding
      profileId: null,
      source: 'no_profile'
    });

  } catch (error) {
    console.error('Profile status API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        hasProfile: false,
        is_onboarding: true // Default to onboarding on error
      },
      { status: 500 }
    );
  }
}
