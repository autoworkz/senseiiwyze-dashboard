"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreHorizontal, Loader2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DateRange } from 'react-day-picker'
import Link from "next/link"

import { useUsersStore } from '@/stores/users-store'
import { UserRole, UserStatus } from '@/types/user'
import { UserListHeader } from '../components/UserListHeader'
import { UserBulkActions } from '../components/UserBulkActions'
import { UserSearchFilters } from '../components/UserSearchFilters'
import { UserPagination } from '../components/UserPagination'
import { UserActionDialogs } from '../components/UserActionDialogs'

export default function UserListPage() {
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set())
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [bulkAction, setBulkAction] = useState<'delete' | 'activate' | 'suspend' | null>(null)

  // Use individual selectors to avoid infinite loops
  const users = useUsersStore((state) => state.users)
  const filters = useUsersStore((state) => state.filters)
  const pagination = useUsersStore((state) => state.pagination)
  const isLoading = useUsersStore((state) => state.isLoading)
  const error = useUsersStore((state) => state.error)
  const fetchUsers = useUsersStore((state) => state.fetchUsers)
  const setFilters = useUsersStore((state) => state.setFilters)
  const setPage = useUsersStore((state) => state.setPage)
  const setPageSize = useUsersStore((state) => state.setPageSize)
  const resetFilters = useUsersStore((state) => state.resetFilters)
  const resetError = useUsersStore((state) => state.resetError)
  const bulkDeleteUsers = useUsersStore((state) => state.bulkDeleteUsers)
  const bulkUpdateUsers = useUsersStore((state) => state.bulkUpdateUsers)

  // Load users on component mount
  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

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

  const handleBulkActivate = () => {
    setBulkAction('activate')
    setShowStatusDialog(true)
  }

  const handleBulkSuspend = () => {
    setBulkAction('suspend')
    setShowStatusDialog(true)
  }

  const handleBulkDeleteClick = () => {
    setBulkAction('delete')
    setShowDeleteDialog(true)
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

  const allSelected = users.length > 0 && selectedUsers.size === users.length
  const someSelected = selectedUsers.size > 0 && selectedUsers.size < users.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <UserListHeader />

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button variant="ghost" size="sm" onClick={resetError}>
              <span className="sr-only">Dismiss</span>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Bulk Actions */}
      <UserBulkActions
        selectedCount={selectedUsers.size}
        onClearSelection={() => setSelectedUsers(new Set())}
        onExport={handleExportUsers}
        onActivate={handleBulkActivate}
        onSuspend={handleBulkSuspend}
        onDelete={handleBulkDeleteClick}
      />

      {/* Search and Filters */}
      <UserSearchFilters
        filters={filters}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onRoleChange={handleRoleChange}
        onDateRangeChange={handleDateRangeChange}
        onClearFilters={handleClearFilters}
      />

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
              <UserPagination
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Action Dialogs */}
      <UserActionDialogs
        showDeleteDialog={showDeleteDialog}
        showStatusDialog={showStatusDialog}
        selectedCount={selectedUsers.size}
        bulkAction={bulkAction}
        onDeleteDialogChange={setShowDeleteDialog}
        onStatusDialogChange={setShowStatusDialog}
        onConfirmDelete={handleBulkDelete}
        onConfirmStatusChange={handleBulkStatusChange}
      />
    </div>
  )
}