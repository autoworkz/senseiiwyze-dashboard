"use client"

import { useEffect } from "react"
import { SettingsSidebar } from "@/components/settings-sidebar"
import { SettingsStatus } from "@/components/settings-status"
import { useSettingsNavigationStore } from "@/stores/settings-navigation-store"
import { useDebouncedSettingsStore } from "@/stores/debounced-settings-store"
import { useAccountContextStore } from "@/stores/account-context-store"

// Import compressed section components
import { AccountSection } from "@/components/settings-sections/account-section"
import { TeamWorkspaceSection } from "@/components/settings-sections/team-workspace-section"
import { IntegrationsSection } from "@/components/settings-sections/integrations-section"
import { BillingSection } from "@/components/settings-sections/billing-section"
import { SecuritySection } from "@/components/settings-sections/security-section"

import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"

export default function SettingsPage() {
  const { activeSection } = useSettingsNavigationStore()
  const { pendingChanges, saveChanges, clearPendingChanges, isSaving } = useDebouncedSettingsStore()
  const { initializeWithDefaults } = useAccountContextStore()

  const hasPendingChanges = Object.keys(pendingChanges).length > 0

  // Initialize account context with defaults on mount
  useEffect(() => {
    initializeWithDefaults()
  }, [initializeWithDefaults])

  const handleManualSave = async () => {
    await saveChanges()
  }

  const handleDiscardChanges = () => {
    clearPendingChanges()
  }

  const renderSection = () => {
    switch (activeSection) {
      case "account":
        return <AccountSection />
      case "team":
        return <TeamWorkspaceSection />
      case "billing":
        return <BillingSection />
      case "security":
        return <SecuritySection />
      case "integrations":
        return <IntegrationsSection />
      default:
        return <AccountSection />
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <SettingsSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header with status and actions */}
        <div className="border-b border-border bg-card/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <SettingsStatus />
            {hasPendingChanges && !isSaving && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleDiscardChanges} disabled={isSaving}>
                  Discard
                </Button>
                <Button size="sm" onClick={handleManualSave} disabled={isSaving} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Now
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl">{renderSection()}</div>
        </div>
      </div>
    </div>
  )
}
