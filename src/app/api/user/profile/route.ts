import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { withAuth } from '@/lib/api/with-auth';

export const GET = withAuth(async (request: NextRequest) => {
  try {
   
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get profile data for the user
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, user_role, is_onboarding, email, name')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      return NextResponse.json(
        { error: 'Failed to fetch profile' },
        { status: 500 }
      );
    }

    // If no profile found, try to find by Better Auth user linkage
    if (!profile) {
      // Check if user is linked in ba_users table
      const { data: baUser, error: baError } = await supabase
        .from('ba_users')
        .select('profile_id')
        .eq('id', userId)
        .maybeSingle();

      if (baError) {
        console.error('Error checking ba_users:', baError);
      }

      if (baUser?.profile_id) {
        // Get the linked profile
        const { data: linkedProfile, error: linkedError } = await supabase
          .from('profiles')
          .select('id, user_role, is_onboarding, email, name')
          .eq('id', baUser.profile_id)
          .maybeSingle();

        if (linkedError) {
          console.error('Error fetching linked profile:', linkedError);
        } else if (linkedProfile) {
          return NextResponse.json({
            profile: linkedProfile,
            source: 'linked'
          });
        }
      }
    }

    return NextResponse.json({
      profile: profile || null,
      source: profile ? 'direct' : 'not_found'
    });

  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}); 
