"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDebouncedSettingsStore } from "@/stores/debounced-settings-store"
import { useDebouncedTheme } from "@/hooks/use-debounced-theme"
import { User, Bell, Palette, Mail, Smartphone, StoreIcon as Marketing, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

export function AccountSection() {
  const { profile, notifications, pendingChanges, updateProfile, updateNotifications, isSaving, isDebouncing } =
    useDebouncedSettingsStore()
  const { theme, setTheme } = useDebouncedTheme()

  const currentProfile = {
    ...profile,
    ...pendingChanges.profile,
  }

  const currentNotifications = {
    ...notifications,
    ...pendingChanges.notifications,
  }

  const handleProfileChange = (field: keyof typeof profile, value: string) => {
    updateProfile({ [field]: value })
  }

  const handleNotificationChange = (key: keyof typeof notifications, value: boolean) => {
    updateNotifications({ [key]: value })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Account & Preferences</h1>
        <p className="text-muted-foreground">Manage your profile, notifications, and appearance settings</p>
      </div>

      {/* Profile Section */}
      <Card className={cn("transition-all", pendingChanges.profile ? "ring-2 ring-primary/20" : "")}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
            {pendingChanges.profile && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                {isDebouncing ? "Pending" : "Modified"}
              </span>
            )}
          </CardTitle>
          <CardDescription>Update your personal information and profile details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={currentProfile.name}
                  onChange={(e) => handleProfileChange("name", e.target.value)}
                  placeholder="Enter your full name"
                  disabled={isSaving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={currentProfile.email}
                  onChange={(e) => handleProfileChange("email", e.target.value)}
                  placeholder="Enter your email"
                  disabled={isSaving}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="workplace">Workplace</Label>
              <Input
                id="workplace"
                name="workplace"
                value={currentProfile.workplace}
                onChange={(e) => handleProfileChange("workplace", e.target.value)}
                placeholder="Enter your workplace"
                disabled={isSaving}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                name="jobTitle"
                value={currentProfile.jobTitle}
                onChange={(e) => handleProfileChange("jobTitle", e.target.value)}
                placeholder="Enter your job title"
                disabled={isSaving}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card className={cn("transition-all", pendingChanges.notifications ? "ring-2 ring-primary/20" : "")}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
            {pendingChanges.notifications && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                {isDebouncing ? "Pending" : "Modified"}
              </span>
            )}
          </CardTitle>
          <CardDescription>Choose what notifications you want to receive</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="email-notifications" className="text-sm font-medium">
                    Email Notifications
                  </Label>
                  <p className="text-xs text-muted-foreground">Receive notifications via email</p>
                </div>
              </div>
              <Switch
                id="email-notifications"
                checked={currentNotifications.email}
                onCheckedChange={(checked) => handleNotificationChange("email", checked)}
                disabled={isSaving}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Marketing className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="marketing-notifications" className="text-sm font-medium">
                    Marketing Communications
                  </Label>
                  <p className="text-xs text-muted-foreground">Updates about new features and promotions</p>
                </div>
              </div>
              <Switch
                id="marketing-notifications"
                checked={currentNotifications.marketing}
                onCheckedChange={(checked) => handleNotificationChange("marketing", checked)}
                disabled={isSaving}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Smartphone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="push-notifications" className="text-sm font-medium">
                    Push Notifications
                  </Label>
                  <p className="text-xs text-muted-foreground">Receive push notifications on your device</p>
                </div>
              </div>
              <Switch
                id="push-notifications"
                checked={currentNotifications.push}
                onCheckedChange={(checked) => handleNotificationChange("push", checked)}
                disabled={isSaving}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="security-notifications" className="text-sm font-medium">
                    Security Alerts
                  </Label>
                  <p className="text-xs text-muted-foreground">Important security and account notifications</p>
                </div>
              </div>
              <Switch
                id="security-notifications"
                checked={currentNotifications.security}
                onCheckedChange={(checked) => handleNotificationChange("security", checked)}
                disabled={isSaving}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance Section */}
      <Card className={cn("transition-all", pendingChanges.theme ? "ring-2 ring-primary/20" : "")}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme & Appearance
            {pendingChanges.theme && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                {isDebouncing ? "Pending" : "Modified"}
              </span>
            )}
          </CardTitle>
          <CardDescription>Customize the appearance of your interface</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme-select">Theme</Label>
                <Select
                  value={theme}
                  onValueChange={(value: "light" | "dark" | "system") => setTheme(value)}
                  disabled={isSaving}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Choose your preferred theme or use system setting</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div
                className={cn(
                  "p-3 rounded-lg border-2 cursor-pointer transition-colors",
                  theme === "light" ? "border-primary" : "border-border",
                  isSaving && "opacity-50 cursor-not-allowed",
                )}
                onClick={() => !isSaving && setTheme("light")}
              >
                <div className="bg-background rounded p-2 mb-2">
                  <div className="h-1.5 bg-foreground rounded mb-1"></div>
                  <div className="h-1 bg-muted-foreground rounded w-3/4"></div>
                </div>
                <p className="text-xs font-medium text-center">Light</p>
              </div>

              <div
                className={cn(
                  "p-3 rounded-lg border-2 cursor-pointer transition-colors",
                  theme === "dark" ? "border-primary" : "border-border",
                  isSaving && "opacity-50 cursor-not-allowed",
                )}
                onClick={() => !isSaving && setTheme("dark")}
              >
                <div className="bg-slate-900 rounded p-2 mb-2">
                  <div className="h-1.5 bg-slate-100 rounded mb-1"></div>
                  <div className="h-1 bg-slate-400 rounded w-3/4"></div>
                </div>
                <p className="text-xs font-medium text-center">Dark</p>
              </div>

              <div
                className={cn(
                  "p-3 rounded-lg border-2 cursor-pointer transition-colors",
                  theme === "system" ? "border-primary" : "border-border",
                  isSaving && "opacity-50 cursor-not-allowed",
                )}
                onClick={() => !isSaving && setTheme("system")}
              >
                <div className="bg-gradient-to-r from-background to-slate-900 rounded p-2 mb-2">
                  <div className="h-1.5 bg-gradient-to-r from-foreground to-slate-100 rounded mb-1"></div>
                  <div className="h-1 bg-gradient-to-r from-muted-foreground to-slate-400 rounded w-3/4"></div>
                </div>
                <p className="text-xs font-medium text-center">System</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
