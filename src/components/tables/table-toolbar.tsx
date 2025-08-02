"use client"

import * as React from "react"
import { Download, Filter, MoreHorizontal, Plus, Trash2, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { TableFilters, FilterConfig, FilterValue } from "./table-filters"
import { cn } from "@/lib/utils"

interface TableToolbarProps {
  title?: string
  description?: string
  selectedCount?: number
  totalCount?: number
  
  // Actions
  onAdd?:( () => void) | (() => void)
  onBulkDelete?:( () => void) | (() => void)
  onExport?:( () => void) | (() => void)
  onImport?:( () => void) | (() => void)
  
  // Filters
  enableFilters?: boolean
  filters?: FilterConfig[]
  filterValues?: FilterValue[]
  onFilterChange?:( (values: FilterValue[]) => void) | React.Dispatch<React.SetStateAction<FilterValue[]>>
  
  // Custom actions
  primaryAction?: {
    label: string
    onClick: () => void
    icon?: React.ComponentType<{ className?: string }>
  }
  secondaryActions?: Array<{
    label: string
    onClick: () => void
    icon?: React.ComponentType<{ className?: string }>
    destructive?: boolean
  }>
  
  // Bulk actions (shown when items are selected)
  bulkActions?: Array<{
    label: string
    onClick: () => void
    icon?: React.ComponentType<{ className?: string }>
    destructive?: boolean
  }>
  
  className?: string
  children?: React.ReactNode
}

export function TableToolbar({
  title,
  description,
  selectedCount = 0,
  totalCount,
  onAdd,
  onBulkDelete,
  onExport,
  onImport,
  enableFilters = false,
  filters = [],
  filterValues = [],
  onFilterChange,
  primaryAction,
  secondaryActions = [],
  bulkActions = [],
  className,
  children,
}: TableToolbarProps) {
  const [showFilters, setShowFilters] = React.useState(false)
  const hasActiveFilters = filterValues.some(f => f.value !== undefined && f.value !== null && f.value !== '')

  // Default secondary actions
  const defaultSecondaryActions = [
    ...(onExport ? [{ label: "Export", onClick: onExport, icon: Download, destructive: false }] : []),
    ...(onImport ? [{ label: "Import", onClick: onImport, icon: Upload, destructive: false }] : []),
    ...(secondaryActions || []),
  ]

  // Default bulk actions
  const defaultBulkActions = [
    ...(onBulkDelete ? [{ label: "Delete", onClick: onBulkDelete, icon: Trash2, destructive: true }] : []),
    ...bulkActions,
  ]

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="space-y-1">
          {title && (
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          )}
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
          {totalCount !== undefined && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{totalCount} total items</span>
              {selectedCount > 0 && (
                <Badge variant="secondary">
                  {selectedCount} selected
                </Badge>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Bulk Actions (shown when items are selected) */}
          {selectedCount > 0 && defaultBulkActions.length > 0 && (
            <div className="flex items-center gap-2">
              {defaultBulkActions.slice(0, 2).map((action, index) => (
                <Button
                  key={index}
                  variant={action.destructive ? "destructive" : "outline"}
                  size="sm"
                  onClick={action.onClick}
                  className="gap-2"
                >
                  {action.icon && <action.icon className="h-4 w-4" />}
                  {action.label}
                </Button>
              ))}
              {defaultBulkActions.length > 2 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Bulk Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {defaultBulkActions.slice(2).map((action, index) => (
                      <DropdownMenuItem
                        key={index}
                        onClick={action.onClick}
                        className={cn(
                          "gap-2",
                          action.destructive && "text-destructive focus:text-destructive"
                        )}
                      >
                        {action.icon && <action.icon className="h-4 w-4" />}
                        {action.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          )}

          {/* Regular Actions (shown when no items are selected) */}
          {selectedCount === 0 && (
            <div className="flex items-center gap-2">
              {/* Filter Toggle */}
              {enableFilters && filters.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn("gap-2", hasActiveFilters && "bg-accent")}
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                      {filterValues.filter(f => f.value !== undefined && f.value !== null && f.value !== '').length}
                    </Badge>
                  )}
                </Button>
              )}

              {/* Primary Action */}
              {primaryAction && (
                <Button onClick={primaryAction.onClick} className="gap-2">
                  {primaryAction.icon && <primaryAction.icon className="h-4 w-4" />}
                  {primaryAction.label}
                </Button>
              )}

              {/* Add Button (default primary action) */}
              {!primaryAction && onAdd && (
                <Button onClick={onAdd} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add New
                </Button>
              )}

              {/* Secondary Actions */}
              {defaultSecondaryActions.length > 0 && (
                <>
                  {defaultSecondaryActions.slice(0, 2).map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={action.onClick}
                      className="gap-2"
                    >
                      {action.icon && <action.icon className="h-4 w-4" />}
                      {action.label}
                    </Button>
                  ))}
                  {defaultSecondaryActions.length > 2 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>More Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {defaultSecondaryActions.slice(2).map((action, index) => (
                          <DropdownMenuItem
                            key={index}
                            onClick={action.onClick}
                            className={cn(
                              "gap-2",
                              action.destructive && "text-destructive focus:text-destructive"
                            )}
                          >
                            {action.icon && <action.icon className="h-4 w-4" />}
                            {action.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </>
              )}
            </div>
          )}

          {/* Custom Children */}
          {children}
        </div>
      </div>

      {/* Filters */}
      {enableFilters && showFilters && filters.length > 0 && onFilterChange && (
        <div className="rounded-lg border bg-card p-4">
          <TableFilters
            filters={filters}
            values={filterValues}
            onChange={onFilterChange}
          />
        </div>
      )}
    </div>
  )
}