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
  workplace: string
  jobTitle: string
}

type Theme = "light" | "dark" | "system"

interface PendingChanges {
  profile?: Partial<UserProfile>
  notifications?: Partial<NotificationSettings>
  theme?: Theme
}

interface DebouncedSettingsStore {
  // Current saved state
  profile: UserProfile
  notifications: NotificationSettings
  theme: Theme

  // Pending changes and debounce state
  pendingChanges: PendingChanges
  isDebouncing: boolean
  isSaving: boolean
  lastSaveMessage: string | null
  debounceTimer: NodeJS.Timeout | null

  // Actions
  updateProfile: (profile: Partial<UserProfile>) => void
  updateNotifications: (notifications: Partial<NotificationSettings>) => void
  updateTheme: (theme: Theme) => void
  saveChanges: () => Promise<void>
  clearPendingChanges: () => void
  setDebounceTimer: (timer: NodeJS.Timeout | null) => void
}

const DEBOUNCE_DELAY = 500 // 500ms

export const useDebouncedSettingsStore = create<DebouncedSettingsStore>()(
  persist(
    (set, get) => ({
      // Initial state
      profile: {
        name: "John Doe",
        email: "john@example.com",
        workplace: "",
        jobTitle: "",
      },
      notifications: {
        email: true,
        push: true,
        marketing: false,
        security: true,
      },
      theme: "system",
      pendingChanges: {},
      isDebouncing: false,
      isSaving: false,
      lastSaveMessage: null,
      debounceTimer: null,

      updateProfile: (profileUpdate) => {
        const state = get()

        // Clear existing timer
        if (state.debounceTimer) {
          clearTimeout(state.debounceTimer)
        }

        // Update pending changes
        const newPendingChanges = {
          ...state.pendingChanges,
          profile: {
            ...state.pendingChanges.profile,
            ...profileUpdate,
          },
        }

        // Set new timer
        const timer = setTimeout(async () => {
          await get().saveChanges()
        }, DEBOUNCE_DELAY)

        set({
          pendingChanges: newPendingChanges,
          isDebouncing: true,
          debounceTimer: timer,
          lastSaveMessage: null,
        })
      },

      updateNotifications: (notificationUpdate) => {
        const state = get()

        // Clear existing timer
        if (state.debounceTimer) {
          clearTimeout(state.debounceTimer)
        }

        // Update pending changes
        const newPendingChanges = {
          ...state.pendingChanges,
          notifications: {
            ...state.pendingChanges.notifications,
            ...notificationUpdate,
          },
        }

        // Set new timer
        const timer = setTimeout(async () => {
          await get().saveChanges()
        }, DEBOUNCE_DELAY)

        set({
          pendingChanges: newPendingChanges,
          isDebouncing: true,
          debounceTimer: timer,
          lastSaveMessage: null,
        })
      },

      updateTheme: (theme) => {
        const state = get()

        // Clear existing timer
        if (state.debounceTimer) {
          clearTimeout(state.debounceTimer)
        }

        // Update pending changes
        const newPendingChanges = {
          ...state.pendingChanges,
          theme,
        }

        // Set new timer
        const timer = setTimeout(async () => {
          await get().saveChanges()
        }, DEBOUNCE_DELAY)

        set({
          pendingChanges: newPendingChanges,
          isDebouncing: true,
          debounceTimer: timer,
          lastSaveMessage: null,
        })
      },

      saveChanges: async () => {
        const state = get()

        if (Object.keys(state.pendingChanges).length === 0) {
          return
        }

        set({ isSaving: true, isDebouncing: false })

        try {
          // Simulate API call delay
          await new Promise((resolve) => setTimeout(resolve, 800))

          // Apply pending changes to current state
          const newState: Partial<DebouncedSettingsStore> = {
            isSaving: false,
            lastSaveMessage: "All settings saved successfully!",
            pendingChanges: {},
          }

          if (state.pendingChanges.profile) {
            newState.profile = {
              ...state.profile,
              ...state.pendingChanges.profile,
            }
          }

          if (state.pendingChanges.notifications) {
            newState.notifications = {
              ...state.notifications,
              ...state.pendingChanges.notifications,
            }
          }

          if (state.pendingChanges.theme) {
            newState.theme = state.pendingChanges.theme
          }

          set(newState)

          // Clear success message after 3 seconds
          setTimeout(() => {
            set({ lastSaveMessage: null })
          }, 3000)
        } catch {
          set({
            isSaving: false,
            isDebouncing: false,
            lastSaveMessage: "Failed to save settings. Please try again.",
          })
        }
      },

      clearPendingChanges: () => {
        const state = get()
        if (state.debounceTimer) {
          clearTimeout(state.debounceTimer)
        }
        set({
          pendingChanges: {},
          isDebouncing: false,
          debounceTimer: null,
        })
      },

      setDebounceTimer: (timer) => {
        set({ debounceTimer: timer })
      },
    }),
    {
      name: "debounced-settings-storage",
      partialize: (state) => ({
        profile: state.profile,
        notifications: state.notifications,
        theme: state.theme,
      }),
    },
  ),
)