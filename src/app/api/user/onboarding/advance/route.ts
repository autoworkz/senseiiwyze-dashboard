import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api/with-auth";
import { supabase } from "@/lib/supabase";

const TOTAL_STEPS = 3;

export const POST = withAuth(async (req: Request, { session }) => {
    
  const result = await supabase.from('ba_users').select('profile_id').eq('id', session.user.id).single();
  if (result.statusText != 'OK' || !result.data?.profile_id) {
    return NextResponse.json({ error: "profile_not_found" }, { status: 404 });
  }
  const profileId = result.data?.profile_id;

  const response = await supabase.from('profiles').select('onboarding_step').eq('id', profileId).single();

  if (!response.data) {
    return NextResponse.json({ error: "profile_not_found" }, { status: 404 });
  }

  const currentStep = response.data.onboarding_step ?? 1;

  const nextStep = Math.min(currentStep + 1, TOTAL_STEPS);

  if (nextStep > currentStep) {
    await supabase.from('profiles').update({ onboarding_step: nextStep, is_onboarding: true }).eq('id', profileId);
  }

  return NextResponse.json({ step: nextStep });
});


export const GET = withAuth(async (req: Request, { session }) => {
  
  return NextResponse.json({ ok: true });
});