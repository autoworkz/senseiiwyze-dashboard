const ONBOARDING_STATUS_KEY = 'onboarding_status'

export interface OnboardingStatus {
  isLoading: boolean
  needsOnboarding: boolean
  hasProfile: boolean
  userRole?: string | null
  onboardingStep: number // -1 = completed, 1-3 = current step (1-based)
}

export const onboardingUtils = {

  clearOnboardingStatus: () => {
    localStorage.removeItem(ONBOARDING_STATUS_KEY)
  },

  getCachedStatus: (): OnboardingStatus | null => {
    try {
      const cached = localStorage.getItem(ONBOARDING_STATUS_KEY)
      return cached ? JSON.parse(cached) : null
    } catch {
      return null
    }
  },

  setOnboardingStatus: (status: OnboardingStatus) => {
    localStorage.setItem(ONBOARDING_STATUS_KEY, JSON.stringify(status))
  },

  isOnboardingCompleted: (onboardingStep: number): boolean => {
    return onboardingStep === -1
  }
}
