import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Get the current session
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // First, get the profile_id from ba_users table
    const { data: baUser, error: baError } = await supabase
      .from('ba_users')
      .select('profile_id')
      .eq('id', userId)
      .maybeSingle()

    if (baError || !baUser?.profile_id) {
      console.error('Error finding profile for user:', baError)
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    // Update the user's onboarding status in the profiles table
    const { error } = await supabase
      .from('profiles')
      .update({ 
        is_onboarding: false,
        onboarding_step: -1 // Mark as completed
      })
      .eq('id', baUser.profile_id)

    if (error) {
      console.error('Error updating onboarding status:', error)
      return NextResponse.json(
        { error: 'Failed to update onboarding status' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      message: 'Onboarding completed successfully' 
    })

  } catch (error) {
    console.error('Error in onboarding completion:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
