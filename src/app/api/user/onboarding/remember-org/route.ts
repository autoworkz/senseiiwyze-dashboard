import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api/with-auth";
import { supabase } from "@/lib/supabase";

export const GET = withAuth(async (req: Request, { session }) => {
  const row = await supabase.from('profiles').select('onboarding_org_id').eq('id', session.user.profile_id).single();
  
  return NextResponse.json({ onboarding_org_id: row?.data?.onboarding_org_id ?? null });
});

export const POST = withAuth(async (req: Request, { session }) => {
  const { onboarding_org_id } = await req.json();   
  const result = await supabase.from('ba_users').select('profile_id').eq('id', session.user.id).single();
  if (result.statusText != 'OK' || !result.data?.profile_id) {
    return NextResponse.json({ error: "profile_not_found" }, { status: 404 });
  }else{
    await supabase.from('profiles').update({ onboarding_org_id: onboarding_org_id ?? null }).eq('id', result.data?.profile_id);
  }

  return NextResponse.json({ ok: true });
});
