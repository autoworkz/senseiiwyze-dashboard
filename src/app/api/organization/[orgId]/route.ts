import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { checkFeatureUsage } from "@/lib/autumn";


export async function POST(
  req: Request,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { email, role, name } = await req.json();
    const organizationId = (await params).orgId;

    // Check organization seat limits via Autumn API
    const seatUsage = await checkFeatureUsage(organizationId, "organization_seats");
    
    // Check if organization has available seats
    if (!seatUsage || !seatUsage.allowed) {
      return NextResponse.json(
        { 
          error: "No available seats", 
          message: "Your organization has reached its seat limit. Please upgrade your plan to invite more members.",
          remainingSeats: seatUsage?.balance || 0,
          totalSeats: seatUsage?.included_usage || 0,
          usage: seatUsage?.usage || 0,
          unlimited: seatUsage?.unlimited || false
        },
        { status: 403 }
      );
    }

    // Log seat check for debugging
    console.log("Seat check passed:", {
      organizationId,
      allowed: seatUsage.allowed,
      balance: seatUsage.balance,
      usage: seatUsage.usage,
      included_usage: seatUsage.included_usage,
      unlimited: seatUsage.unlimited
    });


    const invitation = await auth.api.createInvitation({
      body: { email, role, organizationId, resend: true },
      headers: await headers(),
    });

  const callbackURL = `${process.env.NEXT_PUBLIC_APP_URL}/api/organization/accept-invite/${invitation.id}`;

    // Generate and send magic link for invitation
    const magicLinkResponse = await auth.api.signInMagicLink({
      body: {
        email,
        name,
        callbackURL,
        newUserCallbackURL: callbackURL,
      },
      headers: await headers(),
    });

    if (!magicLinkResponse.status) {
      console.error("Failed to generate magic link for invitation:", magicLinkResponse);
      return NextResponse.json(
        { error: "Failed to send invitation email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      ok: true, 
      invitationId: invitation.id,
      message: "Invitation sent successfully"
    });

  } catch (error) {
    console.error("Organization invitation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
