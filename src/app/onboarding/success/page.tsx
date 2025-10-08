"use client";

import { Suspense } from "react";
import OnboardingSuccessContent from "@/components/onboarding/OnboardingSuccessContent";

export default function OnboardingSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OnboardingSuccessContent />
    </Suspense>
  );
}
