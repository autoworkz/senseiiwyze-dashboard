"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Keyboard, X, Search, Filter, Download, Trash2, UserPlus, Settings } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface KeyboardShortcut {
  key: string
  description: string
  action: () => void
  category: 'navigation' | 'actions' | 'search' | 'bulk'
}

interface UserKeyboardShortcutsProps {
  onSearch: () => void
  onFilter: () => void
  onExport: () => void
  onDelete: () => void
  onAddUser: () => void
  onSettings: () => void
  onSelectAll: () => void
  onClearSelection: () => void
  className?: string
}

export function UserKeyboardShortcuts({
  onSearch,
  onFilter,
  onExport,
  onDelete,
  onAddUser,
  onSettings,
  onSelectAll,
  onClearSelection,
  className = ""
}: UserKeyboardShortcutsProps) {
  const [showShortcuts, setShowShortcuts] = useState(false)

  const shortcuts: KeyboardShortcut[] = [
    // Navigation
    {
      key: "⌘ + K",
      description: "Search users",
      action: onSearch,
      category: "search"
    },
    {
      key: "⌘ + F",
      description: "Open filters",
      action: onFilter,
      category: "search"
    },
    {
      key: "⌘ + N",
      description: "Add new user",
      action: onAddUser,
      category: "actions"
    },
    {
      key: "⌘ + E",
      description: "Export selected",
      action: onExport,
      category: "bulk"
    },
    {
      key: "⌘ + A",
      description: "Select all users",
      action: onSelectAll,
      category: "bulk"
    },
    {
      key: "Escape",
      description: "Clear selection",
      action: onClearSelection,
      category: "bulk"
    },
    {
      key: "⌘ + Delete",
      description: "Delete selected",
      action: onDelete,
      category: "bulk"
    },
    {
      key: "⌘ + ,",
      description: "Open settings",
      action: onSettings,
      category: "actions"
    }
  ]

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent shortcuts when typing in input fields
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
      const cmdKey = isMac ? event.metaKey : event.ctrlKey

      // Search
      if (cmdKey && event.key === 'k') {
        event.preventDefault()
        onSearch()
      }

      // Filter
      if (cmdKey && event.key === 'f') {
        event.preventDefault()
        onFilter()
      }

      // New user
      if (cmdKey && event.key === 'n') {
        event.preventDefault()
        onAddUser()
      }

      // Export
      if (cmdKey && event.key === 'e') {
        event.preventDefault()
        onExport()
      }

      // Select all
      if (cmdKey && event.key === 'a') {
        event.preventDefault()
        onSelectAll()
      }

      // Clear selection
      if (event.key === 'Escape') {
        event.preventDefault()
        onClearSelection()
      }

      // Delete
      if (cmdKey && event.key === 'Delete') {
        event.preventDefault()
        onDelete()
      }

      // Settings
      if (cmdKey && event.key === ',') {
        event.preventDefault()
        onSettings()
      }

      // Show shortcuts help
      if (cmdKey && event.key === '?') {
        event.preventDefault()
        setShowShortcuts(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onSearch, onFilter, onAddUser, onExport, onSelectAll, onClearSelection, onDelete, onSettings])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'search': return <Search className="h-4 w-4" />
      case 'actions': return <UserPlus className="h-4 w-4" />
      case 'bulk': return <Download className="h-4 w-4" />
      default: return <Keyboard className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'search': return 'bg-blue-100 text-blue-800'
      case 'actions': return 'bg-green-100 text-green-800'
      case 'bulk': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = []
    }
    acc[shortcut.category].push(shortcut)
    return acc
  }, {} as Record<string, KeyboardShortcut[]>)

  return (
    <>
      {/* Keyboard shortcuts help button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowShortcuts(true)}
        className={`gap-2 ${className}`}
      >
        <Keyboard className="h-4 w-4" />
        Shortcuts
        <Badge variant="secondary" className="ml-1">
          ⌘ + ?
        </Badge>
      </Button>

      {/* Shortcuts dialog */}
      <Dialog open={showShortcuts} onOpenChange={setShowShortcuts}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Keyboard className="h-5 w-5" />
              Keyboard Shortcuts
            </DialogTitle>
            <DialogDescription>
              Use these keyboard shortcuts to navigate and perform actions quickly.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
              <div key={category}>
                <div className="flex items-center gap-2 mb-3">
                  {getCategoryIcon(category)}
                  <h3 className="font-semibold capitalize">{category}</h3>
                </div>
                <div className="grid gap-2">
                  {categoryShortcuts.map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 rounded-md border"
                    >
                      <span className="text-sm">{shortcut.description}</span>
                      <Badge variant="outline" className="font-mono">
                        {shortcut.key}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <Button onClick={() => setShowShortcuts(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 