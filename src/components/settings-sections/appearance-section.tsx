"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDebouncedTheme } from "@/hooks/use-debounced-theme"
import { useDebouncedSettingsStore } from "@/stores/debounced-settings-store"
import { Palette } from "lucide-react"
import { cn } from "@/lib/utils"

export function AppearanceSection() {
  const { theme, setTheme } = useDebouncedTheme()
  const { pendingChanges, isSaving, isDebouncing } = useDebouncedSettingsStore()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Appearance Settings</h1>
        <p className="text-muted-foreground">Customize the appearance of your interface</p>
      </div>

      <Card className={pendingChanges.theme ? "ring-2 ring-primary/20" : ""}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme
            {pendingChanges.theme && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                {isDebouncing ? "Pending" : "Modified"}
              </span>
            )}
          </CardTitle>
          <CardDescription>Customize the appearance of your interface</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme-select">Theme</Label>
              <Select
                value={theme}
                onValueChange={(value: "light" | "dark" | "system") => setTheme(value)}
                disabled={isSaving}
              >
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">Choose your preferred theme or use system setting</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div
                className={cn(
                  "p-4 rounded-lg border-2 cursor-pointer transition-colors",
                  theme === "light" ? "border-primary" : "border-border",
                  isSaving && "opacity-50 cursor-not-allowed",
                )}
                onClick={() => !isSaving && setTheme("light")}
              >
                <div className="bg-background rounded p-2 mb-2">
                  <div className="h-2 bg-foreground rounded mb-1"></div>
                  <div className="h-1 bg-muted-foreground rounded w-3/4"></div>
                </div>
                <p className="text-sm font-medium text-center">Light</p>
              </div>

              <div
                className={cn(
                  "p-4 rounded-lg border-2 cursor-pointer transition-colors",
                  theme === "dark" ? "border-primary" : "border-border",
                  isSaving && "opacity-50 cursor-not-allowed",
                )}
                onClick={() => !isSaving && setTheme("dark")}
              >
                <div className="bg-slate-900 rounded p-2 mb-2">
                  <div className="h-2 bg-slate-100 rounded mb-1"></div>
                  <div className="h-1 bg-slate-400 rounded w-3/4"></div>
                </div>
                <p className="text-sm font-medium text-center">Dark</p>
              </div>

              <div
                className={cn(
                  "p-4 rounded-lg border-2 cursor-pointer transition-colors",
                  theme === "system" ? "border-primary" : "border-border",
                  isSaving && "opacity-50 cursor-not-allowed",
                )}
                onClick={() => !isSaving && setTheme("system")}
              >
                <div className="bg-gradient-to-r from-background to-slate-900 rounded p-2 mb-2">
                  <div className="h-2 bg-gradient-to-r from-foreground to-slate-100 rounded mb-1"></div>
                  <div className="h-1 bg-gradient-to-r from-muted-foreground to-slate-400 rounded w-3/4"></div>
                </div>
                <p className="text-sm font-medium text-center">System</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
