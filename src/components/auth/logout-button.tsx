'use client'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { logoutAction } from '@/lib/actions/auth-actions'
import { onboardingUtils } from '@/utils/onboarding'

export function LogoutButton() {
  const handleLogout = async () => {
    // Clear onboarding status from localStorage
    onboardingUtils.clearOnboardingStatus()
    
    await logoutAction()
  }

  return (
    <DropdownMenuItem 
      onClick={handleLogout}
      className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
    >
      Sign out
    </DropdownMenuItem>
  )
}