import { create } from "zustand"
import { persist } from "zustand/middleware"

interface NotificationSettings {
  email: boolean
  push: boolean
  marketing: boolean
  security: boolean
}

interface UserProfile {
  name: string
  email: string
  bio: string
}

interface SettingsStore {
  profile: UserProfile
  notifications: NotificationSettings
  setProfile: (profile: Partial<UserProfile>) => void
  setNotifications: (notifications: Partial<NotificationSettings>) => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      profile: {
        name: "John Doe",
        email: "john@example.com",
        bio: "Software developer passionate about creating great user experiences.",
      },
      notifications: {
        email: true,
        push: true,
        marketing: false,
        security: true,
      },
      setProfile: (profile) =>
        set((state) => ({
          profile: { ...state.profile, ...profile },
        })),
      setNotifications: (notifications) =>
        set((state) => ({
          notifications: { ...state.notifications, ...notifications },
        })),
    }),
    {
      name: "settings-storage",
    },
  ),
)
