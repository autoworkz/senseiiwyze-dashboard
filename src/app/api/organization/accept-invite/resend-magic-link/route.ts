import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, invitationId, name } = await req.json();

    if (!email || !invitationId) {
      return NextResponse.json(
        { error: "Email and invitation ID are required" },
        { status: 400 }
      );
    }

    // Get the existing invitation to verify it exists and get details
    const invitation = await auth.api.getInvitation({
      query: { id: invitationId },
      headers: await headers(),
    });

    if (!invitation) {
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 }
      );
    }

    if (invitation.status !== "pending") {
      return NextResponse.json(
        { error: "Invitation is no longer pending" },
        { status: 400 }
      );
    }

    // Verify email matches the invitation
    if (invitation.email?.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json(
        { error: "Email does not match invitation" },
        { status: 400 }
      );
    }

    // Create callback URL for the existing invitation
    const callbackURL = `${process.env.NEXT_PUBLIC_APP_URL}/app/organization/accept-invite/${invitationId}`;

    // Generate and send magic link for the existing invitation
    const magicLinkResponse = await auth.api.signInMagicLink({
      body: {
        email,
        callbackURL,
        newUserCallbackURL: callbackURL,
      },
      headers: await headers(),
    });

    if (!magicLinkResponse.status) {
      console.error("Failed to generate magic link for resend:", magicLinkResponse);
      return NextResponse.json(
        { error: "Failed to send magic link" },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: "Magic link sent successfully",
      invitationId: invitationId
    });

  } catch (error) {
    console.error("Resend magic link error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
