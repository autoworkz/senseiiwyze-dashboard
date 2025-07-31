'use client'

import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { GlobalNavigation } from '@/components/layout/GlobalNavigation'
import { useSession } from '@/lib/auth-client'

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

  const user = {
    role: (session.user.role || 'admin') as 'learner' | 'admin' | 'executive' | 'ceo' | 'worker' | 'frontliner',
    name: session.user.name || 'User'
  }

  return (
    <div className="min-h-screen bg-background">
      <GlobalNavigation user={user} variant="sidebar" className="fixed top-0 left-0 h-full" />
      <main className="ml-64 p-6">
        {children}
      </main>
    </div>
  )
}