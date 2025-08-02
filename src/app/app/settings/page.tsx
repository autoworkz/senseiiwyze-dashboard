import { Suspense } from 'react'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { SettingsContent } from '@/components/settings/SettingsContent'
import { getThemeFromCookies } from '@/lib/actions/theme-actions'
import { SettingsErrorBoundary } from '@/components/error/error-boundary'
import { SettingsSkeleton } from '@/components/loading/loading-skeletons'

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
    <div className="container max-w-4xl py-6 space-y-6">
      {/* Header - Server-rendered */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings, preferences, and billing
        </p>
      </div>

      {/* Settings content - Client component for interactivity */}
      <SettingsErrorBoundary>
        <Suspense fallback={<SettingsSkeleton />}>
          <SettingsContent user={user} initialSettings={userSettings} />
        </Suspense>
      </SettingsErrorBoundary>
    </div>
  )
}