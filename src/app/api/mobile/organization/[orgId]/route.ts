import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { checkFeatureUsage } from "@/lib/autumn";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import { sendMemberInviteCodeEmail } from "@/lib/email";

function generateCode(length = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < length; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { email, role, name } = await req.json();
    const organizationId = (await params).orgId;

    // Seat check via Autumn
    const seatUsage = await checkFeatureUsage(organizationId, "organization_seats");
    if (!seatUsage || !seatUsage.allowed) {
      return NextResponse.json(
        {
          error: "No available seats",
          message:
            "Your organization has reached its seat limit. Please upgrade your plan to invite more members.",
          remainingSeats: seatUsage?.balance || 0,
          totalSeats: seatUsage?.included_usage || 0,
          usage: seatUsage?.usage || 0,
          unlimited: seatUsage?.unlimited || false,
        },
        { status: 403 }
      );
    }

    // Create the Better Auth invitation
    const invitation = await auth.api.createInvitation({
      body: { email, role, organizationId, resend: true },
      headers: await headers(),
    });

    // Fetch organization name for email context
    let organizationName = "Your Organization";
    try {
      const { data: org } = await (supabase as any)
        .from("ba_organizations")
        .select("name")
        .eq("id", organizationId)
        .maybeSingle();
      if (org?.name) organizationName = org.name as string;
    } catch {}

    // Generate member code (raw + hash) and store in invite_codes
    const code = generateCode(6);
    const codeHash = await bcrypt.hash(code, 10);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const { error: insertErr } = await (supabase as any)
      .from("invite_codes")
      .insert([
        {
          invitation_id: invitation.id,
          org_id: organizationId,
          email,
          code_hash: codeHash,
          expires_at: expiresAt,
        },
      ]);
    if (insertErr) {
      return NextResponse.json({ error: "Failed to create invite code" }, { status: 500 });
    }

    // Send email with raw code
    const sendRes = await sendMemberInviteCodeEmail({
      email,
      organizationName,
      code,
    });
    if (sendRes.error) {
      return NextResponse.json({ error: "Failed to send invite code email" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, invitationId: invitation.id });
  } catch (error) {
    console.error("Mobile org invitation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


