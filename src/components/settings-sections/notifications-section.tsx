"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useDebouncedSettingsStore } from "@/stores/debounced-settings-store"
import { Bell, Mail, Smartphone, StoreIcon as Marketing, Shield } from "lucide-react"

export function NotificationsSection() {
  const { notifications, pendingChanges, updateNotifications, isSaving, isDebouncing } = useDebouncedSettingsStore()

  const currentNotifications = {
    ...notifications,
    ...pendingChanges.notifications,
  }

  const handleNotificationChange = (key: keyof typeof notifications, value: boolean) => {
    updateNotifications({ [key]: value })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Notification Settings</h1>
        <p className="text-muted-foreground">Choose what notifications you want to receive</p>
      </div>

      <Card className={pendingChanges.notifications ? "ring-2 ring-primary/20" : ""}>
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
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="email-notifications" className="text-sm font-medium">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
              </div>
              <Switch
                id="email-notifications"
                checked={currentNotifications.email}
                onCheckedChange={(checked) => handleNotificationChange("email", checked)}
                disabled={isSaving}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Smartphone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="push-notifications" className="text-sm font-medium">
                    Push Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">Receive push notifications on your device</p>
                </div>
              </div>
              <Switch
                id="push-notifications"
                checked={currentNotifications.push}
                onCheckedChange={(checked) => handleNotificationChange("push", checked)}
                disabled={isSaving}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Marketing className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="marketing-notifications" className="text-sm font-medium">
                    Marketing Communications
                  </Label>
                  <p className="text-sm text-muted-foreground">Receive updates about new features and promotions</p>
                </div>
              </div>
              <Switch
                id="marketing-notifications"
                checked={currentNotifications.marketing}
                onCheckedChange={(checked) => handleNotificationChange("marketing", checked)}
                disabled={isSaving}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="security-notifications" className="text-sm font-medium">
                    Security Alerts
                  </Label>
                  <p className="text-sm text-muted-foreground">Important security and account notifications</p>
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
    </div>
  )
}
