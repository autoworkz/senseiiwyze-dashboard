"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePricingTable, useCustomer } from "autumn-js/react";
import { useOnboardingFlow } from "@/hooks/useOnboardingFlow";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const { products, refetch: refetchProducts } = usePricingTable();
  const { refetch: refetchCustomer } = useCustomer();
  const { advanceStep } = useOnboardingFlow();
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const searchParams = useSearchParams();
  const selectedPlan = searchParams.get("plan");

  useEffect(() => {
    if (isVerifyingPayment) return;
    const checkPayment = async () => {
      setIsVerifyingPayment(true);
      // refetch + confirm entitlement
      await Promise.all([refetchProducts(), refetchCustomer()]);
      const paid = products?.find(
        (p: any) =>
          (p.id === selectedPlan) &&
          (p.scenario === "active" || p.scenario === "renew" || p.scenario === "scheduled")
      );
      console.log("paid", paid);
      if (paid) {
        await advanceStep();
      }
      router.replace("/app/onboarding");
    }
    checkPayment();
  }, [router, products, refetchProducts, refetchCustomer]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <p className="text-sm text-muted-foreground">Finalizing payment…</p>
    </div>
  );    
}
