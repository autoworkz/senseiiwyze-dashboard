'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { GlobalNavigation } from '@/components/layout/GlobalNavigation'
import { useDebouncedSettingsStore } from '@/stores/debounced-settings-store'
import { useSession } from '@/lib/auth-client'
import { Skeleton } from '@/components/ui/skeleton'
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface User {
  role: 'learner' | 'admin' | 'executive' | 'ceo' | 'worker' | 'frontliner'
  name: string
  email: string
  id: string
}

export default function SettingsPage() {
  const { data: session, isPending } = useSession()
  const [user, setUser] = useState<User | null>(null)
  
  const {
    profile,
    notifications,
    theme,
    pendingChanges,
    isDebouncing,
    isSaving,
    lastSaveMessage,
    updateProfile,
    updateNotifications,
    updateTheme,
  } = useDebouncedSettingsStore()

  useEffect(() => {
    if (session?.user) {
      setUser({
        role: (session.user.role as User['role']) || 'learner',
        name: session.user.name,
        email: session.user.email,
        id: session.user.id
      })
      
      // Update store with user data from auth
      updateProfile({
        name: session.user.name,
        email: session.user.email
      })
    }
  }, [session, updateProfile])

  // Get the current values (merge saved state with pending changes)
  const currentProfile = {
    ...profile,
    ...pendingChanges.profile,
  }
  const currentNotifications = {
    ...notifications,
    ...pendingChanges.notifications,
  }
  const currentTheme = pendingChanges.theme || theme

  if (isPending) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex">
          <div className="w-64 border-r bg-card">
            <div className="p-6 border-b">
              <Skeleton className="h-8 w-32 mb-4" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <div className="flex-1 p-8">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="space-y-6">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to access settings.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <GlobalNavigation user={user} variant="sidebar" />
        
        <div className="flex-1">
          <main className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
              <p className="text-muted-foreground mt-2">
                Manage your account settings and preferences
              </p>
            </div>

            {/* Save Status Indicator */}
            <div className="mb-6">
              {(isDebouncing || isSaving) && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isDebouncing ? 'Changes pending...' : 'Saving changes...'}
                </div>
              )}
              {lastSaveMessage && (
                <div className={cn(
                  "flex items-center gap-2 text-sm",
                  lastSaveMessage.includes('Failed') ? 'text-destructive' : 'text-green-600'
                )}>
                  {lastSaveMessage.includes('Failed') ? (
                    <AlertCircle className="h-4 w-4" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  {lastSaveMessage}
                </div>
              )}
            </div>

            <div className="grid gap-6 max-w-2xl">
              {/* Profile Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information and bio
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Display Name</Label>
                    <Input
                      id="name"
                      value={currentProfile.name}
                      onChange={(e) => updateProfile({ name: e.target.value })}
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      value={currentProfile.email}
                      onChange={(e) => updateProfile({ email: e.target.value })}
                      placeholder="Enter your email"
                      type="email"
                    />
                    <p className="text-xs text-muted-foreground">
                      Your email address from authentication: {user.email}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="workplace">Workplace</Label>
                    <Input
                      id="workplace"
                      value={currentProfile.workplace}
                      onChange={(e) => updateProfile({ workplace: e.target.value })}
                      placeholder="Enter your workplace"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input
                      id="jobTitle"
                      value={currentProfile.jobTitle}
                      onChange={(e) => updateProfile({ jobTitle: e.target.value })}
                      placeholder="Enter your job title"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Theme Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>
                    Customize the appearance of the interface
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select value={currentTheme} onValueChange={updateTheme}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Choose how the interface appears. System will follow your device settings.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Notification Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>
                    Configure your notification preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-xs text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={currentNotifications.email}
                      onCheckedChange={(checked) => updateNotifications({ email: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-xs text-muted-foreground">
                        Receive push notifications in your browser
                      </p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={currentNotifications.push}
                      onCheckedChange={(checked) => updateNotifications({ push: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketing-notifications">Marketing Communications</Label>
                      <p className="text-xs text-muted-foreground">
                        Receive updates about new features and products
                      </p>
                    </div>
                    <Switch
                      id="marketing-notifications"
                      checked={currentNotifications.marketing}
                      onCheckedChange={(checked) => updateNotifications({ marketing: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="security-notifications">Security Alerts</Label>
                      <p className="text-xs text-muted-foreground">
                        Important security notifications and alerts
                      </p>
                    </div>
                    <Switch
                      id="security-notifications"
                      checked={currentNotifications.security}
                      onCheckedChange={(checked) => updateNotifications({ security: checked })}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Account Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    Your account details and authentication status
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">User ID</Label>
                      <p className="mt-1 font-mono text-xs">{user.id}</p>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">Role</Label>
                      <p className="mt-1 capitalize">{user.role}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground mb-2">
                      Settings are automatically saved as you make changes using our debounced store system.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Changes are persisted locally and will be synced with the server in future updates.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}