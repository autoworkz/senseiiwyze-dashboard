import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import { checkFeatureUsage, organizationSeats } from "@/lib/autumn";

export async function POST(request: Request) {
  try {
    const { code, email } = (await request.json()) as { code?: string; email?: string };

    if (!code || !email) {
      return NextResponse.json({ error: "missing_params" }, { status: 400 });
    }

    // 1) Find active code (latest unconsumed for this email)
    const { data: codeRow, error: codeErr } = await (supabase as any)
      .from('invite_codes')
      .select('*')
      .eq('email', email)
      .is('consumed_at', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (codeErr || !codeRow) {
      return NextResponse.json({ error: "invalid_or_expired" }, { status: 400 });
    }

    // Check expiry
    if (codeRow.expires_at && new Date(codeRow.expires_at) < new Date()) {
      return NextResponse.json({ error: "invalid_or_expired" }, { status: 400 });
    }

    // Verify code
    const ok = await bcrypt.compare(code, codeRow.code_hash);
    if (!ok) {
      return NextResponse.json({ error: "invalid_or_expired" }, { status: 400 });
    }

    // 2) Validate invitation
    const { data: invite, error: inviteErr } = await (supabase as any)
      .from('ba_invitations')
      .select('*')
      .eq('id', codeRow.invitation_id)
      .maybeSingle();

    if (inviteErr || !invite || invite.status !== "pending" || invite.email !== email) {
      return NextResponse.json({ error: "invalid_or_expired" }, { status: 400 });
    }

    // 3) Seat check via Autumn
    // Customer is organization id (org-based billing)
    const orgId = invite.organization_id as string;
    const seatData = await checkFeatureUsage(orgId, organizationSeats.id);

    if (!seatData || !seatData?.allowed) {
      return NextResponse.json({ error: "insufficient_seats" }, { status: 402 });
    }

    // 4) Ensure user exists (mobile-only flag)
    const { data: existing, error: userErr } = await (supabase)
      .from('ba_users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    let userId = existing?.id as string | undefined;
    if (!existing) {
      const now = new Date().toISOString();
      const uid = crypto.randomUUID();
      const { error: insertErr } = await (supabase as any)
        .from('ba_users')
        .insert([{ id: uid, name: email, email, email_verified: false, created_at: now, updated_at: now, role: 'member' }]);
      if (insertErr) {
        return NextResponse.json({ error: "server_error" }, { status: 500 });
      }
      userId = uid;
    }
        // After inserting into ba_users:
    const { data: existingProfile } = await (supabase as any).from('profiles').select('id').eq('email', email).maybeSingle();

    let profileId = existingProfile?.id;
    if (!profileId) {
    const { data: created, error: createErr } = await (supabase as any)
    .from('profiles')
    .insert({
        email,
        name: email,
        user_role: 'member',          
        is_onboarding: false,       
        onboarding_step: -1
    })
    .select('id')
    .single();
    if (createErr) throw createErr;
       profileId = created.id;
    }

    const { error: linkErr } = await (supabase as any)
    .from('ba_users')
    .update({ profile_id: profileId, is_dashboard_user: false }) // ensure mobile-only
    .eq('id', userId);
    if (linkErr) throw linkErr;

    // 5) Add member to organization (server-side) and mark invitation accepted
    // Ensure membership does not already exist
    const { data: existingMember } = await (supabase as any)
      .from('ba_members')
      .select('id')
      .eq('organization_id', orgId)
      .eq('user_id', userId)
      .maybeSingle();

    if (!existingMember) {
      const { error: insertMemberErr } = await (supabase as any)
        .from('ba_members')
        .insert([{ id: crypto.randomUUID(), organization_id: orgId, user_id: userId, role: 'member', created_at: new Date().toISOString() }]);
      if (insertMemberErr) {
        return NextResponse.json({ error: 'server_error' }, { status: 500 });
      }
    }

    // Update invitation status to accepted
    await (supabase as any)
      .from('ba_invitations')
      .update({ status: 'accepted' })
      .eq('id', codeRow.invitation_id);

    // 6) Mark code consumed
    await (supabase as any)
      .from('invite_codes')
      .update({ consumed_at: new Date().toISOString() })
      .eq('id', codeRow.id);

    return NextResponse.json({ success: true, orgId, userId });
  } catch (error) {
    console.error("/api/mobile/accept-invite error", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}


