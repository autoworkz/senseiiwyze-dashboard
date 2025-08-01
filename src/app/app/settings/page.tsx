'use client'

import { useSession } from '@/lib/auth-client'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  User, 
  Palette, 
  CreditCard, 
  Bell, 
  Shield, 
  Globe,
  Mail,
  Briefcase,
  Calendar,
  Upload,
  Check,
  X,
  Info
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface User {
  role: 'learner' | 'admin' | 'executive' | 'ceo' | 'worker' | 'frontliner'
  name: string
  email: string
}

export default function SettingsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const activeTab = searchParams.get('tab') || 'general'
  const { data: session, isPending } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  
  // Form states
  const [displayName, setDisplayName] = useState('')
  const [workplace, setWorkplace] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [bio, setBio] = useState('')
  const [theme, setTheme] = useState('system')
  const [language, setLanguage] = useState('en')
  
  // Notification states
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [marketingEmails, setMarketingEmails] = useState(false)

  useEffect(() => {
    if (session?.user) {
      const userData = {
        role: (session.user.role as User['role']) || 'learner',
        name: session.user.name,
        email: session.user.email
      }
      setUser(userData)
      setDisplayName(userData.name)
    }
  }, [session])

  const handleTabChange = (value: string) => {
    router.push(`?tab=${value}`)
  }

  const handleSave = () => {
    // Simulate save
    setHasUnsavedChanges(false)
    // Show success toast/notification
  }

  const handleCancel = () => {
    // Reset form
    setHasUnsavedChanges(false)
    if (user) {
      setDisplayName(user.name)
    }
  }

  if (isPending) {
    return (
      <div className="container max-w-4xl py-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container max-w-4xl py-6">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to access settings.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings, preferences, and billing
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-muted/50">
          <TabsTrigger 
            value="general" 
            className="relative py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <span className="flex items-center gap-2">
              <User className="h-4 w-4" />
              General
            </span>
            {activeTab === 'general' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-t-sm" />
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="profile"
            className="relative py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <span className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Profile
            </span>
            {activeTab === 'profile' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-t-sm" />
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="billing"
            className="relative py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <span className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Billing
            </span>
            {activeTab === 'billing' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-t-sm" />
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="notifications"
            className="relative py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <span className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </span>
            {activeTab === 'notifications' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-t-sm" />
            )}
          </TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-6">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information and bio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => {
                    setDisplayName(e.target.value)
                    setHasUnsavedChanges(true)
                  }}
                  className="focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  disabled
                  className="bg-muted cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  Your email address from authentication: {user.email}
                </p>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="workplace">Workplace</Label>
                <Input
                  id="workplace"
                  placeholder="Enter your workplace"
                  value={workplace}
                  onChange={(e) => {
                    setWorkplace(e.target.value)
                    setHasUnsavedChanges(true)
                  }}
                  className="focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  placeholder="Enter your job title"
                  value={jobTitle}
                  onChange={(e) => {
                    setJobTitle(e.target.value)
                    setHasUnsavedChanges(true)
                  }}
                  className="focus:ring-2 focus:ring-primary"
                />
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize the appearance of the interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Theme</Label>
                <RadioGroup 
                  value={theme} 
                  onValueChange={(value) => {
                    setTheme(value)
                    setHasUnsavedChanges(true)
                  }}
                  className="grid grid-cols-3 gap-4"
                >
                  <Label 
                    htmlFor="light" 
                    className={cn(
                      "flex flex-col items-center justify-center rounded-md border-2 p-4 hover:bg-accent cursor-pointer transition-all",
                      theme === 'light' && "border-primary bg-accent"
                    )}
                  >
                    <RadioGroupItem value="light" id="light" className="sr-only" />
                    <div className="mb-2 h-16 w-16 rounded-md bg-white border shadow-sm" />
                    <span className="text-sm font-medium">Light</span>
                  </Label>
                  
                  <Label 
                    htmlFor="dark" 
                    className={cn(
                      "flex flex-col items-center justify-center rounded-md border-2 p-4 hover:bg-accent cursor-pointer transition-all",
                      theme === 'dark' && "border-primary bg-accent"
                    )}
                  >
                    <RadioGroupItem value="dark" id="dark" className="sr-only" />
                    <div className="mb-2 h-16 w-16 rounded-md bg-slate-900 border shadow-sm" />
                    <span className="text-sm font-medium">Dark</span>
                  </Label>
                  
                  <Label 
                    htmlFor="system" 
                    className={cn(
                      "flex flex-col items-center justify-center rounded-md border-2 p-4 hover:bg-accent cursor-pointer transition-all",
                      theme === 'system' && "border-primary bg-accent"
                    )}
                  >
                    <RadioGroupItem value="system" id="system" className="sr-only" />
                    <div className="mb-2 h-16 w-16 rounded-md bg-gradient-to-br from-white to-slate-900 border shadow-sm" />
                    <span className="text-sm font-medium">System</span>
                  </Label>
                </RadioGroup>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="language">Language</Label>
                <Select 
                  value={language} 
                  onValueChange={(value) => {
                    setLanguage(value)
                    setHasUnsavedChanges(true)
                  }}
                >
                  <SelectTrigger id="language" className="focus:ring-2 focus:ring-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="pt">Portuguese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Professional Profile
              </CardTitle>
              <CardDescription>
                Manage your professional information and skills
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  value={bio}
                  onChange={(e) => {
                    setBio(e.target.value)
                    setHasUnsavedChanges(true)
                  }}
                  className="min-h-[100px] focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid gap-2">
                <Label>Profile Picture</Label>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photo
                  </Button>
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Skills & Expertise</Label>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">+ Add Skill</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy Settings
              </CardTitle>
              <CardDescription>
                Control who can see your profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Public Profile</Label>
                  <p className="text-sm text-muted-foreground">
                    Make your profile visible to other users
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Learning Progress</Label>
                  <p className="text-sm text-muted-foreground">
                    Display your course progress on your profile
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Current Plan
              </CardTitle>
              <CardDescription>
                Manage your subscription and billing details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
                <div>
                  <h3 className="font-semibold">Free Plan</h3>
                  <p className="text-sm text-muted-foreground">Basic features with limited access</p>
                </div>
                <Button>Upgrade</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>
                Add or update your payment information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                <CreditCard className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>
                View your past invoices and transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center py-4">
                No billing history available
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Notifications
              </CardTitle>
              <CardDescription>
                Choose what emails you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Learning Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about course updates and deadlines
                  </p>
                </div>
                <Switch 
                  checked={emailNotifications}
                  onCheckedChange={(checked) => {
                    setEmailNotifications(checked)
                    setHasUnsavedChanges(true)
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Team Messages</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications for team communications
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Updates about new features and promotions
                  </p>
                </div>
                <Switch 
                  checked={marketingEmails}
                  onCheckedChange={(checked) => {
                    setMarketingEmails(checked)
                    setHasUnsavedChanges(true)
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Push Notifications
              </CardTitle>
              <CardDescription>
                Control notifications on your devices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications on your browser
                  </p>
                </div>
                <Switch 
                  checked={pushNotifications}
                  onCheckedChange={(checked) => {
                    setPushNotifications(checked)
                    setHasUnsavedChanges(true)
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save/Cancel buttons - Sticky at bottom */}
      {hasUnsavedChanges && (
        <div className="sticky bottom-6 bg-background/95 backdrop-blur-sm border rounded-lg p-4 shadow-lg flex items-center justify-between">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Info className="h-4 w-4" />
            You have unsaved changes
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Check className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}