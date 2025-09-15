import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { withAuth } from "@/lib/api/with-auth";
import { createOrUpdateProfile, type DbUserRole } from "@/lib/profile-creation";

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

      console.log('✅ Profile created/updated for invitation acceptance:', {
        userId: session.user.id,
        profileId,
        role: invitation.role,
        organizationId: invitation.organizationId,
        isNewProfile
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
    
    // Redirect to app dashboard
    return NextResponse.redirect(new URL('/app', request.nextUrl.origin));

  } catch (error) {
    console.error("Accept invitation error:", error);
    return NextResponse.redirect(new URL("/app", request.nextUrl.origin));
  }
});