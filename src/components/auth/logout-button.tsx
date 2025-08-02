'use client'

import { logoutAction } from '@/lib/actions/auth-actions'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

export function LogoutButton() {
  const handleLogout = async () => {
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