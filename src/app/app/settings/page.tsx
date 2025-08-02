import { Suspense } from 'react'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { SettingsContent } from '@/components/settings/SettingsContent'
import { getThemeFromCookies } from '@/lib/actions/theme-actions'
import { SettingsErrorBoundary } from '@/components/error/error-boundary'
import { SettingsSkeleton } from '@/components/loading/loading-skeletons'
import { PageContainer, PageHeader } from '@/components/layout/PageContainer'

interface User {
  role: 'learner' | 'admin' | 'executive' | 'ceo' | 'worker' | 'frontliner'
  name: string
  email: string
}


export default async function SettingsPage() {
  // Server-side session retrieval
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session?.user) {
    redirect('/auth/login')
  }

  // Transform session data server-side - keeping your exact user interface
  const user: User = {
    role: (session.user.role as User['role']) || 'learner',
    name: session.user.name || 'User',
    email: session.user.email || ''
  }

  // Get server-side theme preference
  const serverTheme = await getThemeFromCookies()

  // TODO: Fetch user's current settings from database
  // For now, using default values that would come from the database
  const userSettings = {
    displayName: user.name,
    workplace: '',
    jobTitle: '',
    bio: '',
    theme: serverTheme,
    language: 'en',
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
  }

  return (
    <PageContainer maxWidth="4xl" className="space-y-8">
      <PageHeader 
        title="Settings"
        description="Manage your account settings, preferences, and billing"
      />

      {/* Settings content - Client component for interactivity */}
      <SettingsErrorBoundary>
        <Suspense fallback={<SettingsSkeleton />}>
          <SettingsContent user={user} initialSettings={userSettings} />
        </Suspense>
      </SettingsErrorBoundary>
    </PageContainer>
  )
}