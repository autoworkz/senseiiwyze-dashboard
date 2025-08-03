"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { 
  ArrowUpDown, 
  MoreHorizontal, 
  Mail, 
  Phone, 
  Shield, 
  User, 
  Calendar,
  MapPin,
  Briefcase
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DataTable, DataTableColumnHeader, DataTableRowActions } from "./data-table"
import { TableToolbar } from "./table-toolbar"
import { FilterConfig, FilterValue } from "./table-filters"

// Sample data type
export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'editor'
  status: 'active' | 'inactive' | 'pending'
  department: string
  joinDate: string
  avatar?: string
  phone?: string
  location?: string
}

// Sample data
const sampleUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com", 
    role: "admin",
    status: "active",
    department: "Engineering",
    joinDate: "2023-01-15",
    avatar: "https://avatar.vercel.sh/john",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA"
  },
  {
    id: "2", 
    name: "Jane Smith",
    email: "jane@example.com",
    role: "user",
    status: "active", 
    department: "Design",
    joinDate: "2023-03-20",
    avatar: "https://avatar.vercel.sh/jane",
    phone: "+1 (555) 234-5678",
    location: "New York, NY"
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "editor",
    status: "inactive",
    department: "Marketing",
    joinDate: "2022-11-08",
    avatar: "https://avatar.vercel.sh/bob",
    phone: "+1 (555) 345-6789", 
    location: "Chicago, IL"
  },
  {
    id: "4",
    name: "Alice Williams",
    email: "alice@example.com",
    role: "user",
    status: "pending",
    department: "Sales",
    joinDate: "2023-12-01",
    avatar: "https://avatar.vercel.sh/alice",
    phone: "+1 (555) 456-7890",
    location: "Austin, TX"
  },
  {
    id: "5",
    name: "Charlie Brown",
    email: "charlie@example.com",
    role: "admin",
    status: "active",
    department: "Engineering",
    joinDate: "2022-08-15",
    avatar: "https://avatar.vercel.sh/charlie",
    phone: "+1 (555) 567-8901",
    location: "Seattle, WA"
  }
]

// Status badge component
function StatusBadge({ status }: { status: User['status'] }) {
  const variants = {
    active: { variant: "default" as const, label: "Active" },
    inactive: { variant: "secondary" as const, label: "Inactive" },
    pending: { variant: "outline" as const, label: "Pending" }
  }
  
  const { variant, label } = variants[status]
  
  return <Badge variant={variant}>{label}</Badge>
}

// Role badge component
function RoleBadge({ role }: { role: User['role'] }) {
  const variants = {
    admin: { variant: "destructive" as const, label: "Admin", icon: Shield },
    editor: { variant: "default" as const, label: "Editor", icon: User },
    user: { variant: "secondary" as const, label: "User", icon: User }
  }
  
  const { variant, label, icon: Icon } = variants[role]
  
  return (
    <Badge variant={variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  )
}

// Column definitions
export const userColumns: ColumnDef<User>[] = [
  {
    id: "user",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User" />
    ),
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{user.name}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => <RoleBadge role={row.getValue("role")} />,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "status", 
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "department",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Department" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Briefcase className="h-4 w-4 text-muted-foreground" />
        {row.getValue("department")}
      </div>
    ),
  },
  {
    accessorKey: "joinDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Join Date" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("joinDate"))
      return (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          {date.toLocaleDateString()}
        </div>
      )
    },
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => {
      const location = row.getValue("location") as string
      return location ? (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          {location}
        </div>
      ) : (
        <span className="text-muted-foreground">—</span>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original
      
      return (
        <DataTableRowActions
          row={row}
          actions={[
            {
              label: "Edit",
              onClick: (user: User) => console.log("Edit user:", user.name),
            },
            {
              label: "Send Email", 
              onClick: (user: User) => console.log("Email user:", user.email),
            },
            {
              label: "Call",
              onClick: (user: User) => console.log("Call user:", user.phone),
            },
            {
              label: "Delete",
              onClick: (user: User) => console.log("Delete user:", user.name),
              destructive: true,
            },
          ]}
        />
      )
    },
  },
]

// Filter configuration
const userFilters: FilterConfig[] = [
  {
    id: "role",
    label: "Role",
    type: "multiselect",
    options: [
      { label: "Admin", value: "admin", icon: Shield },
      { label: "Editor", value: "editor", icon: User },
      { label: "User", value: "user", icon: User },
    ],
  },
  {
    id: "status", 
    label: "Status",
    type: "multiselect",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
      { label: "Pending", value: "pending" },
    ],
  },
  {
    id: "department",
    label: "Department", 
    type: "select",
    placeholder: "Select department...",
    options: [
      { label: "Engineering", value: "Engineering" },
      { label: "Design", value: "Design" },
      { label: "Marketing", value: "Marketing" },
      { label: "Sales", value: "Sales" },
    ],
  },
  {
    id: "joinDate",
    label: "Join Date",
    type: "daterange",
    placeholder: "Select date range...",
  },
  {
    id: "location",
    label: "Location",
    type: "text",
    placeholder: "Search location...",
  },
]

export function TableExample() {
  const [data, setData] = React.useState<User[]>(sampleUsers)
  const [selectedRows, setSelectedRows] = React.useState<User[]>([])
  const [filterValues, setFilterValues] = React.useState<FilterValue[]>([])
  const [loading, setLoading] = React.useState(false)

  // Simulate data loading
  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }

  // Filter data based on filter values
  const filteredData = React.useMemo(() => {
    let filtered = [...data]

    filterValues.forEach(filter => {
      if (!filter.value) return

      switch (filter.id) {
        case 'role':
          if (Array.isArray(filter.value) && filter.value.length > 0) {
            filtered = filtered.filter(user => filter.value.includes(user.role))
          }
          break
        case 'status':
          if (Array.isArray(filter.value) && filter.value.length > 0) {
            filtered = filtered.filter(user => filter.value.includes(user.status))
          }
          break
        case 'department':
          filtered = filtered.filter(user => 
            user.department === filter.value
          )
          break
        case 'location':
          filtered = filtered.filter(user =>
            user.location?.toLowerCase().includes(filter.value.toLowerCase())
          )
          break
        case 'joinDate':
          if (Array.isArray(filter.value) && filter.value[0] && filter.value[1]) {
            const [from, to] = filter.value
            filtered = filtered.filter(user => {
              const joinDate = new Date(user.joinDate)
              return joinDate >= new Date(from) && joinDate <= new Date(to)
            })
          }
          break
      }
    })

    return filtered
  }, [data, filterValues])

  return (
    <div className="space-y-6">
      <TableToolbar
        title="Team Members"
        description="Manage your team members and their roles"
        selectedCount={selectedRows.length}
        totalCount={filteredData.length}
        enableFilters
        filters={userFilters}
        filterValues={filterValues}
        onFilterChange={setFilterValues}
        onAdd={() => console.log("Add new user")}
        onExport={() => console.log("Export users")}
        onImport={() => console.log("Import users")}
        onBulkDelete={() => console.log("Bulk delete:", selectedRows)}
        secondaryActions={[
          {
            label: "Refresh",
            onClick: handleRefresh,
            icon: ArrowUpDown,
          },
          {
            label: "Send Invites",
            onClick: () => console.log("Send invites to:", selectedRows),
            icon: Mail,
          },
        ]}
        bulkActions={[
          {
            label: "Change Role",
            onClick: () => console.log("Change role for:", selectedRows),
            icon: Shield,
          },
          {
            label: "Send Message",
            onClick: () => console.log("Send message to:", selectedRows),
            icon: Mail,
          },
        ]}
      />

      <DataTable
        columns={userColumns}
        data={filteredData}
        searchKey="name"
        searchPlaceholder="Search users..."
        enableSelection
        enableColumnVisibility
        enablePagination
        pageSize={10}
        loading={loading}
        onRowSelect={setSelectedRows}
        onRowClick={(user) => console.log("Row clicked:", user)}
        emptyMessage="No users found. Try adjusting your search or filters."
      />
    </div>
  )
}