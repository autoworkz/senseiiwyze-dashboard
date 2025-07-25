"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationInfo {
  page: number
  pageSize: number
  total: number
}

interface UserPaginationProps {
  pagination: PaginationInfo
  onPageChange: (page: number) => void
  className?: string
}

export function UserPagination({ pagination, onPageChange, className }: UserPaginationProps) {
  const totalPages = Math.ceil(pagination.total / pagination.pageSize)
  const startIndex = (pagination.page - 1) * pagination.pageSize
  const endIndex = Math.min(startIndex + pagination.pageSize, pagination.total)

  if (totalPages <= 1) return null

  return (
    <div className={`flex items-center justify-between space-x-2 py-4 ${className || ''}`}>
      <div className="text-sm text-muted-foreground">
        Showing {startIndex + 1} to {endIndex} of {pagination.total} results
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={pagination.page === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <div className="text-sm text-muted-foreground">
          Page {pagination.page} of {totalPages}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pagination.page + 1)}
          disabled={pagination.page === totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
} 