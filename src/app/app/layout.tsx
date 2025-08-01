'use client'

import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { useSession } from '@/lib/auth-client'
import { GlobalNavigation } from '@/components/layout/GlobalNavigation'

interface AppLayoutProps {
  children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { data: session, isPending } = useSession()

  // Show loading while checking auth
  if (isPending) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!session?.user) {
    redirect('/auth/login')
  }

  // Layout with global navigation header
  return (
    <div className="min-h-screen bg-background">
      <GlobalNavigation />
      <main className="container mx-auto px-4 md:px-6 py-6">
        {children}
      </main>
    </div>
  )
}