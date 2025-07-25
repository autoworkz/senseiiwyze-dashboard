"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { DateRange } from 'react-day-picker'
import { UserRole, UserStatus } from '@/types/user'

interface UserFilters {
  search: string
  status: UserStatus[]
  roles: UserRole[]
  dateRange?: { from: string; to: string }
}

interface UserSearchFiltersProps {
  filters: UserFilters
  onSearchChange: (value: string) => void
  onStatusChange: (value: string) => void
  onRoleChange: (value: string) => void
  onDateRangeChange: (range: DateRange | undefined) => void
  onClearFilters: () => void
}

export function UserSearchFilters({
  filters,
  onSearchChange,
  onStatusChange,
  onRoleChange,
  onDateRangeChange,
  onClearFilters
}: UserSearchFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)

  const hasActiveFilters = filters.status.length > 0 || filters.roles.length > 0 || 
                          filters.dateRange || filters.search

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={filters.search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? "bg-accent" : ""}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2">
                  {filters.status.length + filters.roles.length + (filters.dateRange ? 1 : 0)}
                </Badge>
              )}
            </Button>
            {hasActiveFilters && (
              <Button variant="ghost" onClick={onClearFilters} size="sm">
                <X className="mr-2 h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      {/* Advanced Filters */}
      {showFilters && (
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Status</label>
              <Select onValueChange={onStatusChange} value="">
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserStatus.ACTIVE}>Active</SelectItem>
                  <SelectItem value={UserStatus.INACTIVE}>Inactive</SelectItem>
                  <SelectItem value={UserStatus.SUSPENDED}>Suspended</SelectItem>
                </SelectContent>
              </Select>
              {filters.status.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {filters.status.map(status => (
                    <Badge key={status} variant="secondary" className="text-xs">
                      {status}
                      <button
                        onClick={() => onStatusChange(status)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Role Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Role</label>
              <Select onValueChange={onRoleChange} value="">
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                  <SelectItem value={UserRole.USER}>User</SelectItem>
                  <SelectItem value={UserRole.GUEST}>Guest</SelectItem>
                </SelectContent>
              </Select>
              {filters.roles.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {filters.roles.map(role => (
                    <Badge key={role} variant="secondary" className="text-xs">
                      {role}
                      <button
                        onClick={() => onRoleChange(role)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Date Range Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Date Range</label>
              <DateRangePicker
                date={filters.dateRange ? {
                  from: new Date(filters.dateRange.from),
                  to: new Date(filters.dateRange.to)
                } : undefined}
                onDateChange={onDateRangeChange}
              />
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
} 