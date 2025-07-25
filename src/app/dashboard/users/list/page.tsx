"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, UserPlus, MoreHorizontal, ChevronLeft, ChevronRight, Filter, X, Loader2, Download, Trash2, UserCheck, UserX } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"
import { useUsersStore, UserRole, UserStatus } from '@/stores/users-store'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { DateRange } from 'react-day-picker'
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function UserListPage() {
  const [showFilters, setShowFilters] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set())
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [bulkAction, setBulkAction] = useState<'delete' | 'activate' | 'suspend' | null>(null)

  const {
    users,
    filters,
    pagination,
    isLoading,
    error,
    fetchUsers,
    setFilters,
    setPage,
    setPageSize,
    resetFilters,
    resetError,
    bulkDeleteUsers,
    bulkUpdateUsers
  } = useUsersStore((state) => ({
    users: state.users,
    filters: state.filters,
    pagination: state.pagination,
    isLoading: state.isLoading,
    error: state.error,
    fetchUsers: state.fetchUsers,
    setFilters: state.setFilters,
    setPage: state.setPage,
    setPageSize: state.setPageSize,
    resetFilters: state.resetFilters,
    resetError: state.resetError,
    bulkDeleteUsers: state.bulkDeleteUsers,
    bulkUpdateUsers: state.bulkUpdateUsers
  }))

  // Load users on component mount
  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  // Update bulk actions visibility when selection changes
  useEffect(() => {
    setShowBulkActions(selectedUsers.size > 0)
  }, [selectedUsers.size])

  // Filter handlers
  const handleStatusChange = (value: string) => {
    const status = value as UserStatus
    const currentStatuses = filters.status
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter(s => s !== status)
      : [...currentStatuses, status]
    
    setFilters({ status: newStatuses })
  }

  const handleRoleChange = (value: string) => {
    const role = value as UserRole
    const currentRoles = filters.roles
    const newRoles = currentRoles.includes(role)
      ? currentRoles.filter(r => r !== role)
      : [...currentRoles, role]
    
    setFilters({ roles: newRoles })
  }

  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      setFilters({
        dateRange: {
          from: range.from.toISOString(),
          to: range.to.toISOString()
        }
      })
    } else {
      setFilters({ dateRange: undefined })
    }
  }

  const handleSearchChange = (value: string) => {
    setFilters({ search: value })
  }

  const handleClearFilters = () => {
    resetFilters()
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    fetchUsers(newPage, pagination.pageSize)
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    fetchUsers(1, newPageSize)
  }

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(new Set(users.map(user => user.id)))
    } else {
      setSelectedUsers(new Set())
    }
  }

  const handleSelectUser = (userId: string, checked: boolean) => {
    const newSelected = new Set(selectedUsers)
    if (checked) {
      newSelected.add(userId)
    } else {
      newSelected.delete(userId)
    }
    setSelectedUsers(newSelected)
  }

  // Bulk action handlers
  const handleBulkDelete = async () => {
    if (selectedUsers.size === 0) return
    
    try {
      await bulkDeleteUsers(Array.from(selectedUsers))
      setSelectedUsers(new Set())
      setShowDeleteDialog(false)
    } catch (error) {
      console.error('Failed to delete users:', error)
    }
  }

  const handleBulkStatusChange = async (status: UserStatus) => {
    if (selectedUsers.size === 0) return
    
    try {
      await bulkUpdateUsers(Array.from(selectedUsers), { status })
      setSelectedUsers(new Set())
      setShowStatusDialog(false)
    } catch (error) {
      console.error('Failed to update users:', error)
    }
  }

  const handleExportUsers = () => {
    const selectedUserData = users.filter(user => selectedUsers.has(user.id))
    const csvContent = [
      ['Name', 'Email', 'Role', 'Status', 'Program Readiness', 'Last Active', 'Department'],
      ...selectedUserData.map(user => [
        user.name,
        user.email,
        user.role,
        user.status,
        `${user.programReadiness}%`,
        user.lastActive,
        user.department || ''
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  // Fetch users when filters change
  useEffect(() => {
    fetchUsers(pagination.page, pagination.pageSize)
  }, [filters, pagination.page, pagination.pageSize, fetchUsers])

  const getStatusBadge = (status: UserStatus) => {
    const variants = {
      [UserStatus.ACTIVE]: "bg-green-100 text-green-800",
      [UserStatus.INACTIVE]: "bg-gray-100 text-gray-800",
      [UserStatus.SUSPENDED]: "bg-red-100 text-red-800"
    }
    return (
      <Badge className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getRoleBadge = (role: UserRole) => {
    const variants = {
      [UserRole.ADMIN]: "bg-purple-100 text-purple-800",
      [UserRole.USER]: "bg-blue-100 text-blue-800",
      [UserRole.GUEST]: "bg-orange-100 text-orange-800"
    }
    return (
      <Badge className={variants[role]}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    )
  }

  const hasActiveFilters = filters.status.length > 0 || filters.roles.length > 0 || 
                          filters.dateRange || filters.search

  const totalPages = Math.ceil(pagination.total / pagination.pageSize)
  const startIndex = (pagination.page - 1) * pagination.pageSize
  const endIndex = Math.min(startIndex + pagination.pageSize, pagination.total)

  const allSelected = users.length > 0 && selectedUsers.size === users.length
  const someSelected = selectedUsers.size > 0 && selectedUsers.size < users.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Users</h1>
          <p className="text-muted-foreground">
            Manage and monitor user accounts and their activities
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/users/new">
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Link>
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button variant="ghost" size="sm" onClick={resetError}>
              <X className="h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Bulk Actions */}
      {showBulkActions && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-blue-900">
                  {selectedUsers.size} user{selectedUsers.size !== 1 ? 's' : ''} selected
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedUsers(new Set())}
                  className="text-blue-700 hover:text-blue-900"
                >
                  Clear selection
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportUsers}
                  className="border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setBulkAction('activate')
                    setShowStatusDialog(true)
                  }}
                  className="border-green-300 text-green-700 hover:bg-green-100"
                >
                  <UserCheck className="mr-2 h-4 w-4" />
                  Activate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setBulkAction('suspend')
                    setShowStatusDialog(true)
                  }}
                  className="border-orange-300 text-orange-700 hover:bg-orange-100"
                >
                  <UserX className="mr-2 h-4 w-4" />
                  Suspend
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setBulkAction('delete')
                    setShowDeleteDialog(true)
                  }}
                  className="border-red-300 text-red-700 hover:bg-red-100"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={filters.search}
                  onChange={(e) => handleSearchChange(e.target.value)}
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
                <Button variant="ghost" onClick={handleClearFilters} size="sm">
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
                <Select onValueChange={handleStatusChange} value="">
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
                          onClick={() => handleStatusChange(status)}
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
                <Select onValueChange={handleRoleChange} value="">
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
                          onClick={() => handleRoleChange(role)}
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
                  onDateChange={handleDateRangeChange}
                />
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
          <CardDescription>
            Showing {users.length} of {pagination.total} users
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading users...</span>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={allSelected}
                        ref={(el) => {
                          if (el && el instanceof HTMLInputElement) {
                            el.indeterminate = someSelected
                          }
                        }}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Program Readiness</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedUsers.has(user.id)}
                          onCheckedChange={(checked) => handleSelectUser(user.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>{user.lastActive}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${user.programReadiness}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {user.programReadiness}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/users/${user.id}`}>
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Edit User</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between space-x-2 py-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {startIndex + 1} to {endIndex} of {pagination.total} results
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
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
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Users</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedUsers.size} user{selectedUsers.size !== 1 ? 's' : ''}? 
              This action cannot be undone and will permanently remove the selected user{selectedUsers.size !== 1 ? 's' : ''} from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Status Change Confirmation Dialog */}
      <AlertDialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {bulkAction === 'activate' ? 'Activate' : 'Suspend'} Users
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {bulkAction === 'activate' ? 'activate' : 'suspend'} {selectedUsers.size} user{selectedUsers.size !== 1 ? 's' : ''}? 
              This will change their account status to {bulkAction === 'activate' ? 'active' : 'suspended'}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => handleBulkStatusChange(bulkAction === 'activate' ? UserStatus.ACTIVE : UserStatus.SUSPENDED)}
              className={bulkAction === 'activate' ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-600 hover:bg-orange-700'}
            >
              {bulkAction === 'activate' ? 'Activate' : 'Suspend'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}