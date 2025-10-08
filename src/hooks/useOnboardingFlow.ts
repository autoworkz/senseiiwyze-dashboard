import { useUser } from "@/contexts/UserContext";    

export function useOnboardingFlow() {
  const { user, isLoading, refreshUser } = useUser();

  async function advanceStep() {
    const res = await fetch("/api/user/onboarding/advance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      await refreshUser();
    }
  }

  return {
    step: user?.onboardingStep ?? 1,
    isLoading,
    advanceStep,
  };
}
