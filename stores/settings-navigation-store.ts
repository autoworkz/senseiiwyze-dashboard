import { create } from "zustand"

export type SettingsSection = "account" | "team-workspace" | "billing" | "security" | "integrations"

interface SettingsNavigationStore {
  activeSection: SettingsSection
  setActiveSection: (section: SettingsSection) => void
}

export const useSettingsNavigationStore = create<SettingsNavigationStore>((set) => ({
  activeSection: "account",
  setActiveSection: (section) => set({ activeSection: section }),
}))
