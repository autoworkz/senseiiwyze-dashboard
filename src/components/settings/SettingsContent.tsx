'use client'

import { useState, useTransition } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useCustomer } from "autumn-js/react";

import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
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
import {
  updateProfileAction,
  updateNotificationPreferencesAction,
  updateAppearanceAction
} from '@/lib/actions/settings-actions'
import { SimpleFileUpload } from '@/components/upload/file-upload'
import { uploadAccountImage } from '@/lib/actions/avatar-upload'

interface User {
  role: 'learner' | 'admin' | 'executive' | 'ceo' | 'worker' | 'frontliner'
  name: string
  email: string
  id: string
}

interface UserSettings {
  displayName: string
  workplace: string
  jobTitle: string
  bio: string
  theme: 'light' | 'dark' | 'system'
  language: string
  emailNotifications: boolean
  pushNotifications: boolean
  marketingEmails: boolean
}

interface SettingsContentProps {
  user: User
  initialSettings: UserSettings
}

export function SettingsContent({ user, initialSettings }: SettingsContentProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const activeTab = searchParams.get('tab') || 'general'
  const [isPending, startTransition] = useTransition()
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const { customer } = useCustomer();

  // Get theme from next-themes
  const { theme: currentTheme, setTheme: setNextTheme } = useTheme()

  // Form states - initialized with server data
  const [displayName, setDisplayName] = useState(initialSettings.displayName)
  const [workplace, setWorkplace] = useState(initialSettings.workplace)
  const [jobTitle, setJobTitle] = useState(initialSettings.jobTitle)
  const [bio, setBio] = useState(initialSettings.bio)
  const [language, setLanguage] = useState(initialSettings.language)
  
  // Notification states
  const [emailNotifications, setEmailNotifications] = useState(initialSettings.emailNotifications)
  const [pushNotifications, setPushNotifications] = useState(initialSettings.pushNotifications)
  const [marketingEmails, setMarketingEmails] = useState(initialSettings.marketingEmails)

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null)

  const handleTabChange = (value: string) => {
    router.push(`?tab=${value}`)
  }
    console.log("Customer data:", customer);
  const handleProfileSave = () => {
    startTransition(async () => {
      let hasProfileChanges = false
      let profileResult = null

      // Check if profile fields have changed
      if (displayName !== initialSettings.displayName ||
          workplace !== initialSettings.workplace ||
          jobTitle !== initialSettings.jobTitle ||
          bio !== initialSettings.bio) {
        
        hasProfileChanges = true
        const formData = new FormData()
        formData.append('displayName', displayName)
        formData.append('workplace', workplace)
        formData.append('jobTitle', jobTitle)
        formData.append('bio', bio)

        profileResult = await updateProfileAction(formData)
        
        if (!profileResult.success) {
          setMessage({ type: 'error', text: profileResult.error || 'Profile update failed' })
          setTimeout(() => setMessage(null), 3000)
          return
        }
      }

      // Handle avatar upload if file was selected
      if (selectedAvatarFile) {
        try {
          const publicUrl = await uploadAccountImage(selectedAvatarFile);
          
          setAvatarUrl(publicUrl)
          setSelectedAvatarFile(null)
        } catch (err: any) {
          setMessage({ type: 'error', text: err?.message || 'Failed to upload avatar' })
          setTimeout(() => setMessage(null), 3000)
          return
        }
      }

      // Set success message based on what was updated
      if (hasProfileChanges && selectedAvatarFile) {
        setMessage({ type: 'success', text: 'Profile and avatar updated successfully' })
      } else if (hasProfileChanges) {
        setMessage({ type: 'success', text: profileResult?.message || 'Profile updated successfully' })
      } else if (selectedAvatarFile) {
        setMessage({ type: 'success', text: 'Avatar updated successfully' })
      }

      setHasUnsavedChanges(false)
      setTimeout(() => setMessage(null), 3000)
    })
  }

  const handleNotificationSave = () => {
    startTransition(async () => {
      const formData = new FormData()
      formData.append('emailNotifications', emailNotifications.toString())
      formData.append('pushNotifications', pushNotifications.toString())
      formData.append('marketingEmails', marketingEmails.toString())

      const result = await updateNotificationPreferencesAction(formData)
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message || 'Preferences updated' })
        setHasUnsavedChanges(false)
      } else {
        setMessage({ type: 'error', text: result.error || 'Update failed' })
      }

      setTimeout(() => setMessage(null), 3000)
    })
  }

  const handleAppearanceSave = () => {
    startTransition(async () => {
      const formData = new FormData()
      // Theme is now handled client-side by next-themes
      formData.append('language', language)

      const result = await updateAppearanceAction(formData)
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message || 'Settings updated' })
        setHasUnsavedChanges(false)
      } else {
        setMessage({ type: 'error', text: result.error || 'Update failed' })
      }

      setTimeout(() => setMessage(null), 3000)
    })
  }

  const handleCancel = () => {
    // Reset form to initial values
    setDisplayName(initialSettings.displayName)
    setWorkplace(initialSettings.workplace)
    setJobTitle(initialSettings.jobTitle)
    setBio(initialSettings.bio)
    // Theme is now managed by next-themes
    setLanguage(initialSettings.language)
    setEmailNotifications(initialSettings.emailNotifications)
    setPushNotifications(initialSettings.pushNotifications)
    setMarketingEmails(initialSettings.marketingEmails)
    setHasUnsavedChanges(false)
  }

  const handleAvatarSelect = async (file: File) => {
    // Only preview and mark as unsaved; upload happens on Save
    try {
      const preview = URL.createObjectURL(file)
      setAvatarUrl(preview)
      setSelectedAvatarFile(file)
      setHasUnsavedChanges(true)
    } catch {
      setMessage({ type: 'error', text: 'Failed to preview image' })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const getUserPlan = () => {
    return customer?.products.filter((p: any) => p.status === 'active')[0]?.name
  }

  return (
    <>
      {/* Message Display */}
      {message && (
        <div className={cn(
          "p-4 rounded-lg border",
          message.type === 'success' ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"
        )}>
          {message.text}
        </div>
      )}

      {/* Tabs - Preserving your exact design */}
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

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleProfileSave}
                  disabled={isPending || !hasUnsavedChanges}
                  className="flex items-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  {isPending ? 'Saving...' : 'Save Profile'}
                </Button>
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
                  value={currentTheme || 'system'} 
                  onValueChange={(value) => {
                    setNextTheme(value)
                    setHasUnsavedChanges(true)
                  }}
                  className="grid grid-cols-3 gap-4"
                >
                  <Label 
                    htmlFor="light" 
                    className={cn(
                      "flex flex-col items-center justify-center rounded-md border-2 p-4 hover:bg-accent cursor-pointer transition-all",
                      currentTheme === 'light' && "border-primary bg-accent"
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
                      currentTheme === 'dark' && "border-primary bg-accent"
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
                      currentTheme === 'system' && "border-primary bg-accent"
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

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleAppearanceSave}
                  disabled={isPending || !hasUnsavedChanges}
                  className="flex items-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  {isPending ? 'Saving...' : 'Save Appearance'}
                </Button>
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
                  <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-semibold overflow-hidden">
                    {avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <SimpleFileUpload
                    onFileSelect={handleAvatarSelect}
                    accept="image/jpeg,image/png,image/webp"
                    maxSize={5 * 1024 * 1024}
                    placeholder="Upload Photo"
                  />
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
                  <h3 className="font-semibold">{getUserPlan()}</h3>
                  {/* <p className="text-sm text-muted-foreground">Basic features with limited access</p> */}
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

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleNotificationSave}
                  disabled={isPending || !hasUnsavedChanges}
                  className="flex items-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  {isPending ? 'Saving...' : 'Save Notifications'}
                </Button>
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
            <Button variant="outline" onClick={handleCancel} disabled={isPending}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      )}
    </>
  )
}