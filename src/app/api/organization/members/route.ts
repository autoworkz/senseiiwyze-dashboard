import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { withAuth } from '@/lib/api/with-auth'

export const GET = withAuth(async (request: NextRequest, { session }) => {
  try {
    if (!session?.session?.activeOrganizationId) {
      return NextResponse.json(
        { error: 'No active organization found' },
        { status: 400 }
      )
    }

    const organizationId = session.session.activeOrganizationId

    // Get organization members and their profile IDs
    const { data: members, error: membersError } = await supabase
      .from('ba_members')
      .select(`
        user_id,
        ba_users!inner(
          profile_id
        )
      `)
      .eq('organization_id', organizationId)

    if (membersError) {
      console.error('Error fetching organization members:', membersError)
      return NextResponse.json(
        { error: 'Failed to fetch organization members' },
        { status: 500 }
      )
    }

    // Extract profile IDs from the members
    const profileIds = members
      ?.map(member => member.ba_users?.profile_id)
      .filter(Boolean) || []

    return NextResponse.json({
      success: true,
      profileIds,
      memberCount: profileIds.length,
      organizationId
    })

  } catch (error) {
    console.error('Organization members API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})
