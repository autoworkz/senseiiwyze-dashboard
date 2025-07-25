"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Trash2, UserCheck, UserX } from "lucide-react"

interface UserBulkActionsProps {
  selectedCount: number
  onClearSelection: () => void
  onExport: () => void
  onActivate: () => void
  onSuspend: () => void
  onDelete: () => void
  className?: string
}

export function UserBulkActions({
  selectedCount,
  onClearSelection,
  onExport,
  onActivate,
  onSuspend,
  onDelete,
  className
}: UserBulkActionsProps) {
  if (selectedCount === 0) return null

  return (
    <Card className={`border-accent bg-accent/10 ${className || ''}`}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-foreground">
              {selectedCount} user{selectedCount !== 1 ? 's' : ''} selected
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear selection
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="border-accent text-accent-foreground hover:bg-accent"
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onActivate}
              className="border-green-500/20 text-green-700 hover:bg-green-50 dark:border-green-400/20 dark:text-green-400 dark:hover:bg-green-950/20"
            >
              <UserCheck className="mr-2 h-4 w-4" />
              Activate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onSuspend}
              className="border-orange-500/20 text-orange-700 hover:bg-orange-50 dark:border-orange-400/20 dark:text-orange-400 dark:hover:bg-orange-950/20"
            >
              <UserX className="mr-2 h-4 w-4" />
              Suspend
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="border-destructive/20 text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 