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
    <div className="flex gap-6 max-w-7xl">
      {/* Settings Sidebar */}
      <div className="w-80 flex-shrink-0">
        <SettingsSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Status and Actions Bar */}
        {(hasPendingChanges || isSaving) && (
          <div className="flex items-center justify-between bg-card/50 border border-border rounded-lg px-4 py-3 mb-6">
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
        )}

        {/* Content Area */}
        <div className="space-y-6">
          {renderSection()}
        </div>
      </div>
    </div>
  )
}
