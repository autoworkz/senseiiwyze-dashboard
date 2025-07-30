"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDebouncedSettingsStore } from "@/stores/debounced-settings-store";
import { User } from "lucide-react";

export function ProfileSection() {
  const { profile, pendingChanges, updateProfile, isSaving, isDebouncing } =
    useDebouncedSettingsStore();

  const currentProfile = {
    ...profile,
    ...pendingChanges.profile,
  };

  const handleProfileChange = (field: keyof typeof profile, value: string) => {
    updateProfile({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your personal information and profile details</p>
      </div>

      <Card className={pendingChanges.profile ? "ring-2 ring-primary/20" : ""}>
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
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={currentProfile.bio}
                onChange={(e) => handleProfileChange("bio", e.target.value)}
                placeholder="Tell us about yourself"
                className="min-h-[100px]"
                disabled={isSaving}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
