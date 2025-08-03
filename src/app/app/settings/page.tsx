import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { SettingsErrorBoundary } from '@/components/error/error-boundary'
import { PageContainer, PageHeader } from '@/components/layout/PageContainer'
import { SettingsSkeleton } from '@/components/loading/loading-skeletons'
import { SettingsContent } from '@/components/settings/SettingsContent'
import { auth } from '@/lib/auth'

interface User {
  role: 'learner' | 'admin' | 'executive' | 'ceo' | 'worker' | 'frontliner'
  name: string
  email: string
}

export default async function SettingsPage() {
  // Server-side session retrieval
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    redirect('/auth/login')
  }

  // Transform session data server-side - keeping your exact user interface
  const user: User = {
    role: (session.user.role as User['role']) || 'learner',
    name: session.user.name || 'User',
    email: session.user.email || '',
  }

  // TODO: Fetch user's current settings from database
  // For now, using default values that would come from the database
  const userSettings = {
    displayName: user.name,
    workplace: '',
    jobTitle: '',
    bio: '',
    theme: 'system' as const, // Default theme, will be managed client-side by next-themes
    language: 'en',
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
  }

  return (
    <PageContainer maxWidth="narrow" className="space-y-8">
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
