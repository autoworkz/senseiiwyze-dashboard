"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Plus, RefreshCw, Download, Upload } from "lucide-react"

import { DataTable } from "@/components/ui/data-table"
import { useClientSideDataTable, useServerSideDataTable } from "@/hooks/use-data-table"
import {
  createTextColumn,
  createDateColumn,
  createCurrencyColumn,
  createStatusColumn,
  createBooleanColumn,
  createActionsColumn,
  createAvatarColumn,
  createEmailColumn,
  createProgressColumn,
  commonActions,
  statusPresets,
  StatusOption,
} from "@/lib/table-utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Example data types
interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: "admin" | "user" | "manager"
  status: "active" | "inactive" | "pending"
  lastLogin: Date
  isVerified: boolean
  salary: number
  completionRate: number
  department: string
  joinDate: Date
}

interface Project {
  id: string
  name: string
  description: string
  status: "active" | "completed" | "pending" | "cancelled"
  progress: number
  budget: number
  startDate: Date
  endDate: Date
  manager: string
  team: string[]
}

// Generate mock data
const generateUsers = (count: number): User[] => {
  const roles: User["role"][] = ["admin", "user", "manager"]
  const statuses: User["status"][] = ["active", "inactive", "pending"]
  const departments = ["Engineering", "Marketing", "Sales", "Design", "HR", "Finance"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `user-${i + 1}`,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 1}`,
    role: roles[Math.floor(Math.random() * roles.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    isVerified: Math.random() > 0.3,
    salary: Math.floor(Math.random() * 100000) + 40000,
    completionRate: Math.floor(Math.random() * 100),
    department: departments[Math.floor(Math.random() * departments.length)],
    joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
  }))
}

const generateProjects = (count: number): Project[] => {
  const statuses: Project["status"][] = ["active", "completed", "pending", "cancelled"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `project-${i + 1}`,
    name: `Project ${i + 1}`,
    description: `Description for project ${i + 1}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    progress: Math.floor(Math.random() * 100),
    budget: Math.floor(Math.random() * 1000000) + 10000,
    startDate: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + Math.random() * 180 * 24 * 60 * 60 * 1000),
    manager: `Manager ${i + 1}`,
    team: [`Member ${i + 1}`, `Member ${i + 2}`],
  }))
}

// Status options for different entity types
const userStatusOptions: StatusOption[] = [
  statusPresets.active,
  statusPresets.inactive,
  statusPresets.pending,
]

const projectStatusOptions: StatusOption[] = [
  statusPresets.active,
  { value: "completed", label: "Completed", color: "default" },
  statusPresets.pending,
  { value: "cancelled", label: "Cancelled", color: "destructive" },
]

export function DataTableExample() {
  // Mock data
  const users = React.useMemo(() => generateUsers(100), [])
  const projects = React.useMemo(() => generateProjects(50), [])

  // User table columns
  const userColumns: ColumnDef<User>[] = React.useMemo(() => [
    createAvatarColumn<User>("avatar", "User", "name"),
    createTextColumn<User>("name", "Name"),
    createEmailColumn<User>("email"),
    createTextColumn<User>("department", "Department"),
    createStatusColumn<User>("status", userStatusOptions),
    createBooleanColumn<User>("isVerified", "Verified"),
    createCurrencyColumn<User>("salary", "Salary"),
    createProgressColumn<User>("completionRate", "Completion"),
    createDateColumn<User>("lastLogin", "Last Login"),
    createDateColumn<User>("joinDate", "Join Date"),
    createActionsColumn<User>([
      commonActions.view((user) => console.log("View user:", user)),
      commonActions.edit((user) => console.log("Edit user:", user)),
      commonActions.delete((user) => console.log("Delete user:", user)),
    ]),
  ], [])

  // Project table columns
  const projectColumns: ColumnDef<Project>[] = React.useMemo(() => [
    createTextColumn<Project>("name", "Project Name"),
    createTextColumn<Project>("description", "Description"),
    createStatusColumn<Project>("status", projectStatusOptions),
    createProgressColumn<Project>("progress", "Progress"),
    createCurrencyColumn<Project>("budget", "Budget"),
    createTextColumn<Project>("manager", "Manager"),
    createDateColumn<Project>("startDate", "Start Date"),
    createDateColumn<Project>("endDate", "End Date"),
    createActionsColumn<Project>([
      commonActions.view((project) => console.log("View project:", project)),
      commonActions.edit((project) => console.log("Edit project:", project)),
      {
        label: "Clone",
        icon: Upload,
        onClick: (project) => console.log("Clone project:", project),
      },
      commonActions.delete((project) => console.log("Delete project:", project)),
    ]),
  ], [])

  // Client-side table for users
  const userTable = useClientSideDataTable({
    data: users,
    columns: userColumns,
    initialPageSize: 20,
  })

  // Client-side table for projects
  const projectTable = useClientSideDataTable({
    data: projects,
    columns: projectColumns,
    initialPageSize: 10,
  })

  // Server-side table example
  const serverTable = useServerSideDataTable({
    columns: userColumns,
    fetchData: async (params) => {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock server-side filtering and pagination
      let filteredUsers = [...users]
      
      // Apply global filter
      if (params.globalFilter) {
        filteredUsers = filteredUsers.filter(user =>
          user.name.toLowerCase().includes(params.globalFilter.toLowerCase()) ||
          user.email.toLowerCase().includes(params.globalFilter.toLowerCase())
        )
      }
      
      // Apply column filters
      params.columnFilters.forEach(filter => {
        if (filter.value) {
          filteredUsers = filteredUsers.filter(user =>
            String(user[filter.id as keyof User]).toLowerCase().includes(String(filter.value).toLowerCase())
          )
        }
      })
      
      // Apply sorting
      if (params.sorting.length > 0) {
        const sort = params.sorting[0]
        filteredUsers.sort((a, b) => {
          const aVal = a[sort.id as keyof User]
          const bVal = b[sort.id as keyof User]
          if (aVal < bVal) return sort.desc ? 1 : -1
          if (aVal > bVal) return sort.desc ? -1 : 1
          return 0
        })
      }
      
      // Apply pagination
      const startIndex = params.pagination.pageIndex * params.pagination.pageSize
      const paginatedUsers = filteredUsers.slice(startIndex, startIndex + params.pagination.pageSize)
      
      return {
        data: paginatedUsers,
        pageCount: Math.ceil(filteredUsers.length / params.pagination.pageSize),
        rowCount: filteredUsers.length,
      }
    },
  })

  const handleExport = () => {
    console.log("Export selected users:", userTable.selectedData)
  }

  const handleRefresh = () => {
    console.log("Refreshing data...")
    serverTable.refetch()
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Data Table Examples</h1>
        <p className="text-muted-foreground">
          Comprehensive examples of the feature-rich data table component
        </p>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users (Client-side)</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="server">Server-side Example</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Users Table</CardTitle>
              <CardDescription>
                Client-side table with all features enabled. Supports sorting, filtering,
                pagination, row selection, and column visibility.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                {...userTable.tableProps}
                actions={
                  <>
                    <Button onClick={handleExport} disabled={userTable.selectedData.length === 0}>
                      <Download className="mr-2 h-4 w-4" />
                      Export ({userTable.selectedData.length})
                    </Button>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add User
                    </Button>
                  </>
                }
                filterPlaceholder="Search users..."
                noDataMessage="No users found."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Selected Users</CardTitle>
              <CardDescription>
                Data from selected rows is automatically available
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="text-sm bg-muted p-4 rounded overflow-auto max-h-40">
                {JSON.stringify(userTable.selectedData, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Projects Table</CardTitle>
              <CardDescription>
                Another example with different data types and column configurations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                {...projectTable.tableProps}
                actions={
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Project
                  </Button>
                }
                filterPlaceholder="Search projects..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="server" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Server-side Table</CardTitle>
              <CardDescription>
                Example of server-side rendering with loading states and async data fetching.
                All filtering, sorting, and pagination happens on the server.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                {...serverTable.tableProps}
                actions={
                  <Button onClick={handleRefresh} disabled={serverTable.loading}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${serverTable.loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                }
                filterPlaceholder="Search users (server-side)..."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Simpler examples for quick usage

export function SimpleUserTable() {
  const users = React.useMemo(() => generateUsers(20), [])
  
  const columns: ColumnDef<User>[] = [
    createTextColumn<User>("name", "Name"),
    createEmailColumn<User>("email"),
    createStatusColumn<User>("status", userStatusOptions),
    createCurrencyColumn<User>("salary", "Salary"),
  ]

  const table = useClientSideDataTable({
    data: users,
    columns,
    enableRowSelection: false,
  })

  return <DataTable {...table.tableProps} />
}

export function MinimalTable() {
  const data = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
  ]

  const columns: ColumnDef<typeof data[0]>[] = [
    createTextColumn("name", "Name"),
    createEmailColumn("email"),
  ]

  const table = useClientSideDataTable({
    data,
    columns,
    enableRowSelection: false,
    enableColumnVisibility: false,
    enableGlobalFilter: false,
    enablePagination: false,
  })

  return <DataTable {...table.tableProps} />
}