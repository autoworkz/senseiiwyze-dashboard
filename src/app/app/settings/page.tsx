'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useDebouncedSettingsStore } from '@/stores/debounced-settings-store'
import { useSession } from '@/lib/auth-client'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  CheckCircle, 
  Loader2, 
  AlertCircle, 
  Camera, 
  CreditCard, 
  Download, 
  Calendar,
  TrendingUp,
  Clock,
  Users,
  Settings as SettingsIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface User {
  role: 'learner' | 'admin' | 'executive' | 'ceo' | 'worker' | 'frontliner'
  name: string
  email: string
  id: string
}

export default function SettingsPage() {
  const searchParams = useSearchParams()
  const activeTab = searchParams.get('tab') || 'general'
  
  const { data: session, isPending } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    bio: '',
    workplace: '',
    jobTitle: '',
    location: '',
    website: '',
  })
  
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

  // Helper function to get user initials
  const getInitials = (name: string) => {
    if (!name?.trim()) return "U"
    return name.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  useEffect(() => {
    if (session?.user) {
      const userData = {
        role: (session.user.role as User['role']) || 'learner',
        name: session.user.name,
        email: session.user.email,
        id: session.user.id
      }
      setUser(userData)
      
      // Update store with user data from auth
      updateProfile({
        name: session.user.name,
        email: session.user.email
      })

      // Initialize profile data with session data
      setProfileData({
        name: session.user.name || '',
        email: session.user.email || '',
        bio: '',
        workplace: '',
        jobTitle: '',
        location: '',
        website: '',
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

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving profile data:', profileData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    // Reset to original data
    if (session?.user) {
      setProfileData({
        name: session.user.name || '',
        email: session.user.email || '',
        bio: '',
        workplace: '',
        jobTitle: '',
        location: '',
        website: '',
      })
    }
    setIsEditing(false)
  }

  if (isPending) {
    return (
      <div className="p-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
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
    <main className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings, preferences, and billing
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

      <Tabs value={activeTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* General Settings Tab */}
        <TabsContent value="general" className="space-y-6">
          <div className="grid gap-6 max-w-2xl">
            {/* Profile Information */}
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
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid gap-6 max-w-2xl">
            {/* Profile Header */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>
                  Your profile picture and basic information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="" alt={user.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {user.role} Account
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Information */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details and contact information
                  </CardDescription>
                </div>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                      type="email"
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell us about yourself..."
                    disabled={!isEditing}
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="workplace">Workplace</Label>
                    <Input
                      id="workplace"
                      value={profileData.workplace}
                      onChange={(e) => setProfileData(prev => ({ ...prev, workplace: e.target.value }))}
                      placeholder="Your company or organization"
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input
                      id="jobTitle"
                      value={profileData.jobTitle}
                      onChange={(e) => setProfileData(prev => ({ ...prev, jobTitle: e.target.value }))}
                      placeholder="Your job title"
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="City, Country"
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={profileData.website}
                      onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                      placeholder="https://yourwebsite.com"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Read-only account details from your authentication provider
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">User ID</Label>
                    <p className="mt-1 font-mono text-xs bg-muted px-2 py-1 rounded">
                      {user.id}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">Role</Label>
                    <p className="mt-1 capitalize bg-muted px-2 py-1 rounded text-xs">
                      {user.role}
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-xs text-muted-foreground">
                    Account created and managed through Better Auth. Some information may be 
                    synced with your authentication provider.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <div className="max-w-6xl space-y-8">
            {/* Current Plan */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Current Plan
                    </CardTitle>
                    <CardDescription>Your active subscription and plan details</CardDescription>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Enterprise Pro</h3>
                    <p className="text-2xl font-bold text-primary">$299/month</p>
                    <p className="text-sm text-muted-foreground">Base platform fee (70%)</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Success Fee</h3>
                    <p className="text-2xl font-bold text-orange-600">$128/month</p>
                    <p className="text-sm text-muted-foreground">Based on outcomes (30%)</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Total</h3>
                    <p className="text-2xl font-bold">$427/month</p>
                    <p className="text-sm text-muted-foreground">Current billing cycle</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Next billing date</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      February 28, 2025
                    </p>
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline">Change Plan</Button>
                    <Button>Manage Subscription</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Success Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Success Metrics
                  </CardTitle>
                  <CardDescription>Performance indicators affecting your success fee</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Certification Pass Rate</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        92%
                      </Badge>
                      <span className="text-sm text-muted-foreground">Target: 85%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Skill Acquisition Speed</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        2.3x
                      </Badge>
                      <span className="text-sm text-muted-foreground">Target: 2.0x</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Training Completion Rate</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                        78%
                      </Badge>
                      <span className="text-sm text-muted-foreground">Target: 80%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Readiness Index Accuracy</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        89%
                      </Badge>
                      <span className="text-sm text-muted-foreground">Target: 87%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Usage Overview
                  </CardTitle>
                  <CardDescription>Current month usage statistics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Learners</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">247</span>
                      <span className="text-sm text-muted-foreground">/ 500 included</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">AI Coaching Sessions</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">1,834</span>
                      <span className="text-sm text-muted-foreground">/ unlimited</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Assessments Completed</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">156</span>
                      <span className="text-sm text-muted-foreground">this month</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Learning Paths Active</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">89</span>
                      <span className="text-sm text-muted-foreground">in progress</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
                <CardDescription>Manage your payment information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-md flex items-center justify-center">
                      <span className="text-white text-xs font-bold">VISA</span>
                    </div>
                    <div>
                      <p className="font-medium">•••• •••• •••• 4242</p>
                      <p className="text-sm text-muted-foreground">Expires 12/27</p>
                    </div>
                  </div>
                  <Button variant="outline">Update Payment</Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Invoices */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Invoices
                </CardTitle>
                <CardDescription>Your recent billing history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { date: 'Jan 28, 2025', amount: '$427.00', status: 'Paid', invoice: 'INV-2025-001' },
                    { date: 'Dec 28, 2024', amount: '$395.00', status: 'Paid', invoice: 'INV-2024-012' },
                    { date: 'Nov 28, 2024', amount: '$423.00', status: 'Paid', invoice: 'INV-2024-011' },
                  ].map((invoice, index) => (
                    <div key={index} className="flex justify-between items-center py-2">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium">{invoice.invoice}</p>
                          <p className="text-sm text-muted-foreground">{invoice.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold">{invoice.amount}</span>
                        <Badge 
                          variant="secondary" 
                          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        >
                          {invoice.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <div className="grid gap-6 max-w-2xl">
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
          </div>
        </TabsContent>
      </Tabs>
    </main>
  )
}