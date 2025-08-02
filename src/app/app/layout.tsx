import { ReactNode, Suspense } from 'react'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { GlobalNavigation } from '@/components/layout/GlobalNavigation'

interface AppLayoutProps {
  children: ReactNode
}

// Loading component matching your existing design
function AuthLoadingFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}

export default async function AppLayout({ children }: AppLayoutProps) {
  // Server-side session validation - Better Auth Best Practice
  const session = await auth.api.getSession({
    headers: await headers()
  })

  // Redirect to login if not authenticated
  if (!session?.user) {
    redirect('/auth/login')
  }

  // Layout with global navigation header - preserving your exact structure
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<div className="h-16 bg-card border-b" />}>
        <GlobalNavigation user={session.user} />
      </Suspense>
      <main className="container mx-auto px-4 md:px-6 py-6">
        <Suspense fallback={<AuthLoadingFallback />}>
          {children}
        </Suspense>
      </main>
    </div>
  )
}