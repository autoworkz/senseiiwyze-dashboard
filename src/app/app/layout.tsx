import { ReactNode, Suspense } from 'react'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { GlobalNavigation } from '@/components/layout/GlobalNavigation'
import { ThemeProvider } from '@/components/theme/theme-provider'
import { getThemeFromCookies } from '@/lib/actions/theme-actions'
import { DashboardErrorBoundary } from '@/components/error/error-boundary'
import { NavigationSkeleton } from '@/components/loading/loading-skeletons'
import { Toaster } from '@/components/ui/sonner'

interface AppLayoutProps {
  children: ReactNode
}

// Loading component matching your existing design
function AuthLoadingFallback() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading your dashboard...</p>
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

  // Get server-side theme preference
  const serverTheme = await getThemeFromCookies()

  // Layout with global navigation header - preserving your exact structure
  return (
    <ThemeProvider serverTheme={serverTheme}>
      <div className="min-h-screen bg-background">
        <Suspense fallback={<NavigationSkeleton />}>
          <GlobalNavigation user={session.user} />
        </Suspense>
        <main className="min-h-0">
          <DashboardErrorBoundary>
            <Suspense fallback={<AuthLoadingFallback />}>
              {children}
            </Suspense>
          </DashboardErrorBoundary>
        </main>
      </div>
      <Toaster />
    </ThemeProvider>
  )
}