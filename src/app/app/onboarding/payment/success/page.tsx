"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePricingTable, useCustomer } from "autumn-js/react";
import { useOnboardingFlow } from "@/hooks/useOnboardingFlow";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const { refetch: refetchProducts } = usePricingTable();
  const { advanceStep } = useOnboardingFlow();
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const searchParams = useSearchParams();
  const selectedPlan = searchParams.get("plan");
  const fromStep = searchParams.get("from");
  const upgraded = searchParams.get("upgraded");

  useEffect(() => {
    if (isVerifyingPayment) return;
    const checkPayment = async () => {
      setIsVerifyingPayment(true);
      // refetch + confirm entitlement
      const [freshProducts] = await Promise.all([refetchProducts()]);
      const paid = freshProducts?.find(
        (p: any) =>
          (p.id === selectedPlan) &&
          (p.scenario === "active" || p.scenario === "renew" || p.scenario === "scheduled")
      );
      
      if (paid) {
        // If user came from user-import step after upgrading, redirect back to step 3
        if (fromStep === "user-import" && upgraded === "true") {
          router.replace("/app/onboarding&upgraded=true");
        } else {
          // Normal flow: advance to next step
          await advanceStep();
          router.replace("/app/onboarding");
        }
      } else {
        router.replace("/app/onboarding");
      }
    }
    checkPayment();
  }, [router, refetchProducts, selectedPlan, fromStep, upgraded]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <p className="text-sm text-muted-foreground">Finalizing payment…</p>
    </div>
  );    
}
