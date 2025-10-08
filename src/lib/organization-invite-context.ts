import { supabase } from '@/lib/supabase';

export interface OrganizationInviteContext {
  organizationName: string;
  inviterName: string;
  inviterEmail: string;
  inviteeEmail: string;
}

/**
 * Get organization invitation context for magic link emails
 * @param invitationId - The invitation ID from the callback URL
 * @returns Organization invite context or null if not found
 */
export async function getOrganizationInviteContext(invitationId: string): Promise<OrganizationInviteContext | null> {
  console.log('🔍 [OrganizationInviteContext] Starting context retrieval for invitation ID:', invitationId);
  
  try {
    console.log('📡 [OrganizationInviteContext] Querying Supabase for invitation details...');
    
    // Get invitation details from Supabase with proper joins
    const { data: invitation, error: invitationError } = await supabase
      .from('ba_invitations')
      .select(`
        organization_id,
        email,
        inviter_id,
        organization:organization_id (
          name
        ),
        inviter:inviter_id (
          name,
          email
        )
      `)
      .eq('id', invitationId)
      .single();

    console.log('📊 [OrganizationInviteContext] Supabase query result:', {
      hasData: !!invitation,
      hasError: !!invitationError,
      error: invitationError,
      rawData: invitation
    });

    if (invitationError) {
      console.error('❌ [OrganizationInviteContext] Failed to get invitation from Supabase:', invitationError);
      return null;
    }

    if (!invitation) {
      console.error('❌ [OrganizationInviteContext] No invitation found for ID:', invitationId);
      return null;
    }

    console.log('✅ [OrganizationInviteContext] Invitation found, extracting details...');

    // Extract organization and inviter details with fallbacks
    const organizationName = invitation.organization?.name || 'Your Organization';
    const inviterName = invitation.inviter?.name || invitation.inviter?.email || 'Team Member';
    const inviterEmail = invitation.inviter?.email || 'team@senseiiwyze.com';
    const inviteeEmail = invitation.email;

    const context = {
      organizationName,
      inviterName,
      inviterEmail,
      inviteeEmail,
    };

    console.log('🎯 [OrganizationInviteContext] Context successfully built:', {
      organizationName,
      inviterName,
      inviterEmail,
      inviteeEmail,
      usedFallbacks: {
        organizationName: !invitation.organization?.name,
        inviterName: !invitation.inviter?.name && !invitation.inviter?.email,
        inviterEmail: !invitation.inviter?.email,
      }
    });

    return context;
  } catch (error) {
    console.error('💥 [OrganizationInviteContext] Unexpected error:', error);
    return null;
  }
}
