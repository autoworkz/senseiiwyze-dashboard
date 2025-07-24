"use client"

import { Badge } from "@/components/ui/badge"
import { useDebouncedSettingsStore } from "@/stores/debounced-settings-store"
import { CheckCircle, Clock, Loader2 } from "lucide-react"

export function SettingsStatus() {
  const { isDebouncing, isSaving, lastSaveMessage, pendingChanges } = useDebouncedSettingsStore()

  const hasPendingChanges = Object.keys(pendingChanges).length > 0

  if (isSaving) {
    return (
      <Badge variant="secondary" className="flex items-center gap-2">
        <Loader2 className="h-3 w-3 animate-spin" />
        Saving changes...
      </Badge>
    )
  }

  if (isDebouncing && hasPendingChanges) {
    return (
      <Badge variant="outline" className="flex items-center gap-2">
        <Clock className="h-3 w-3" />
        Changes pending...
      </Badge>
    )
  }

  if (lastSaveMessage) {
    return (
      <Badge variant="secondary" className="flex items-center gap-2">
        <CheckCircle className="h-3 w-3" />
        {lastSaveMessage}
      </Badge>
    )
  }

  return null
}
