import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { withAuth } from "@/lib/api/with-auth";
import { createOrUpdateProfile, type DbUserRole } from "@/lib/profile-creation";
import { supabase } from "@/lib/supabase";

export const GET = withAuth(async (
  request: NextRequest,
  { params, session }: { params: Promise<{ invitationId: string }>, session: any }
) => {
  const { invitationId } = await params;
  
  try {

    // Get invitation details
    const invitation = await auth.api.getInvitation({
      query: { id: invitationId },
      headers: await headers(),
    });

    if (!invitation) {
      // Unknown invitation ID or error - redirect to app
      return NextResponse.redirect(new URL("/app", request.nextUrl.origin));
    }

    if (invitation.status !== "pending") {
      // Already accepted/revoked/expired - redirect to app
      return NextResponse.redirect(new URL("/app", request.nextUrl.origin));
    }

    // Check email match
    const invitedEmail = (invitation.email ?? "").toLowerCase();
    const authedEmail = (session.user.email ?? "").toLowerCase();

    if (!invitedEmail || invitedEmail !== authedEmail) {
      // Email mismatch - redirect to mismatch page
      const mismatchUrl = `/app/organization/invite-mismatch` +
        `?invited=${encodeURIComponent(invitedEmail)}` +
        `&current=${encodeURIComponent(authedEmail)}` +
        `&invitationId=${encodeURIComponent(invitationId)}`;
      
      return NextResponse.redirect(new URL(mismatchUrl, request.nextUrl.origin));
    }

    // Accept invitation
    try {
      await auth.api.acceptInvitation({
        body: { invitationId },
        headers: await headers(),
      });
    } catch (error) {
      console.error("Failed to accept invitation:", error);
      return NextResponse.redirect(new URL("/app", request.nextUrl.origin));
    }

    // Create or update profile with the invitation role
    try {
      const { profileId, isNewProfile } = await createOrUpdateProfile({
        userId: session.user.id,
        email: session.user.email,
        name: session.user.name || session.user.email,
        role: (invitation.role as DbUserRole) || 'admin-manager', // Use invitation role, default to admin-manager
        organizationId: invitation.organizationId,
      });

    } catch (error) {
      console.error("Failed to create/update profile:", error);
    }

    // Set active organization
    if (invitation.organizationId) {
      await auth.api.setActiveOrganization({
        body: { organizationId: invitation.organizationId },
        headers: await headers(),
      });
    }
    
    // Check if user has a password account (entry in ba_accounts table)
    const { data: accounts, error: accountsError } = await supabase
      .from('ba_accounts')
      .select('*')
      .eq('user_id', session.user.id);

    if (accountsError) {
      console.error("Failed to check user accounts:", accountsError);
    }

    const hasPasswordAccount = accounts && accounts.length > 0;

    if (hasPasswordAccount) {
      // User already has a password, redirect to app
      return NextResponse.redirect(new URL('/app', request.nextUrl.origin));
    } else {
      // User doesn't have a password account, redirect to create password
      // Get organization name for the redirect
      let organizationName = '';
      try {
        const organization = await auth.api.getFullOrganization({
          query: { organizationId: invitation.organizationId },
          headers: await headers(),
        });
        organizationName = organization?.name || '';
      } catch (orgError) {
        console.error("Failed to get organization name:", orgError);
      }
      
      // Redirect to create password page with user email and organization name
      const createPasswordUrl = `/create-password?email=${encodeURIComponent(session.user.email)}&organization=${encodeURIComponent(organizationName)}`;
      return NextResponse.redirect(new URL(createPasswordUrl, request.nextUrl.origin));
    }

  } catch (error) {
    console.error("Accept invitation error:", error);
    return NextResponse.redirect(new URL("/app", request.nextUrl.origin));
  }
});