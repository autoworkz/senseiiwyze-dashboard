"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Trash2, UserCheck, UserX } from "lucide-react"
import { UserStatus } from '@/stores/users-store'

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
  className = ""
}: UserBulkActionsProps) {
  if (selectedCount === 0) return null

  return (
    <Card className={`border-blue-200 bg-blue-50 ${className}`}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-blue-900">
              {selectedCount} user{selectedCount !== 1 ? 's' : ''} selected
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
              className="text-blue-700 hover:text-blue-900"
            >
              Clear selection
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onActivate}
              className="border-green-300 text-green-700 hover:bg-green-100"
            >
              <UserCheck className="mr-2 h-4 w-4" />
              Activate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onSuspend}
              className="border-orange-300 text-orange-700 hover:bg-orange-100"
            >
              <UserX className="mr-2 h-4 w-4" />
              Suspend
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="border-red-300 text-red-700 hover:bg-red-100"
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