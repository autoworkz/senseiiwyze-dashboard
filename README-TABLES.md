# Advanced Data Table System

A fully-featured, hook-based React table component built on top of TanStack Table with shadcn/UI theming. This system provides maximum flexibility while maintaining ease of use through intuitive hooks and utility functions.

## Features

### Core Features
- ✅ **Server-side and Client-side rendering**
- ✅ **Row selection with batch operations**
- ✅ **Column sorting and filtering**
- ✅ **Global search**
- ✅ **Pagination with customizable page sizes**
- ✅ **Column visibility controls**
- ✅ **Loading states**
- ✅ **Responsive design**
- ✅ **Keyboard accessibility**

### Advanced Features
- ✅ **Action columns with dropdown menus**
- ✅ **Status badges with icons**
- ✅ **Avatar columns**
- ✅ **Date formatting**
- ✅ **Currency formatting**
- ✅ **Progress bars**
- ✅ **Boolean indicators**
- ✅ **Email/Phone links**
- ✅ **Custom cell renderers**

### Hook-based Interface
- ✅ **Simple client-side hook**
- ✅ **Server-side hook with automatic fetching**
- ✅ **State management utilities**
- ✅ **Selected data access**

## Quick Start

### Basic Example

```tsx
import { DataTable } from "@/components/ui/data-table"
import { useClientSideDataTable } from "@/hooks/use-data-table"
import { createTextColumn, createEmailColumn } from "@/lib/table-utils"

interface User {
  id: string
  name: string
  email: string
}

function UsersTable() {
  const data: User[] = [
    { id: "1", name: "John Doe", email: "john@example.com" },
    { id: "2", name: "Jane Smith", email: "jane@example.com" },
  ]

  const columns = [
    createTextColumn<User>("name", "Name"),
    createEmailColumn<User>("email"),
  ]

  const table = useClientSideDataTable({
    data,
    columns,
  })

  return <DataTable {...table.tableProps} />
}
```

### Advanced Example with All Features

```tsx
import { DataTable } from "@/components/ui/data-table"
import { useClientSideDataTable } from "@/hooks/use-data-table"
import {
  createTextColumn,
  createEmailColumn,
  createStatusColumn,
  createCurrencyColumn,
  createDateColumn,
  createActionsColumn,
  createAvatarColumn,
  commonActions,
  statusPresets,
} from "@/lib/table-utils"

interface Employee {
  id: string
  name: string
  email: string
  avatar?: string
  salary: number
  status: "active" | "inactive"
  joinDate: Date
}

function EmployeesTable() {
  const employees: Employee[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      avatar: "https://example.com/avatar1.jpg",
      salary: 75000,
      status: "active",
      joinDate: new Date("2023-01-15"),
    },
    // ... more data
  ]

  const statusOptions = [
    statusPresets.active,
    statusPresets.inactive,
  ]

  const columns = [
    createAvatarColumn<Employee>("avatar", "Employee", "name"),
    createTextColumn<Employee>("name", "Name"),
    createEmailColumn<Employee>("email"),
    createStatusColumn<Employee>("status", statusOptions),
    createCurrencyColumn<Employee>("salary", "Salary"),
    createDateColumn<Employee>("joinDate", "Join Date"),
    createActionsColumn<Employee>([
      commonActions.view((employee) => console.log("View", employee)),
      commonActions.edit((employee) => console.log("Edit", employee)),
      commonActions.delete((employee) => console.log("Delete", employee)),
    ]),
  ]

  const table = useClientSideDataTable({
    data: employees,
    columns,
    initialPageSize: 25,
  })

  return (
    <DataTable
      {...table.tableProps}
      actions={
        <Button disabled={table.selectedData.length === 0}>
          Export Selected ({table.selectedData.length})
        </Button>
      }
      filterPlaceholder="Search employees..."
    />
  )
}
```

## Server-side Example

```tsx
import { useServerSideDataTable } from "@/hooks/use-data-table"

function ServerSideTable() {
  const table = useServerSideDataTable({
    columns,
    fetchData: async (params) => {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      })
      
      return response.json() // { data, pageCount, rowCount }
    },
  })

  return (
    <DataTable
      {...table.tableProps}
      actions={
        <Button onClick={table.refetch} disabled={table.loading}>
          Refresh
        </Button>
      }
    />
  )
}
```

## Column Utilities

### Text Columns
```tsx
createTextColumn<T>("fieldName", "Header", {
  enableSorting: true,
  className: "font-medium",
  transform: (value) => value.toUpperCase(),
})
```

### Status/Badge Columns
```tsx
const statusOptions = [
  { value: "active", label: "Active", color: "default", icon: Check },
  { value: "inactive", label: "Inactive", color: "secondary", icon: X },
]

createStatusColumn<T>("status", statusOptions, "Status")
```

### Date Columns
```tsx
createDateColumn<T>("createdAt", "Created", "MMM dd, yyyy", true) // includeTime
```

### Currency Columns
```tsx
createCurrencyColumn<T>("amount", "Amount", "USD", "en-US")
```

### Boolean Columns
```tsx
createBooleanColumn<T>("isActive", "Active", "Yes", "No")
```

### Progress Columns
```tsx
createProgressColumn<T>("completion", "Progress", 100) // max value
```

### Avatar Columns
```tsx
createAvatarColumn<T>("avatar", "User", "name") // nameField optional
```

### Action Columns
```tsx
createActionsColumn<T>([
  commonActions.view((row) => viewUser(row.id)),
  commonActions.edit((row) => editUser(row.id)),
  {
    label: "Custom Action",
    icon: Star,
    onClick: (row) => customAction(row),
    variant: "secondary",
    disabled: (row) => !row.canEdit,
    hidden: (row) => row.status === "archived",
  },
])
```

## Hooks

### useClientSideDataTable
Perfect for smaller datasets that can be loaded entirely client-side.

```tsx
const table = useClientSideDataTable({
  data,
  columns,
  enableRowSelection: true,
  enableColumnVisibility: true,
  enableGlobalFilter: true,
  enableColumnFilters: true,
  enablePagination: true,
  enableSorting: true,
  initialPageSize: 10,
  pageSizeOptions: [10, 20, 50, 100],
})
```

### useServerSideDataTable
For large datasets that require server-side processing.

```tsx
const table = useServerSideDataTable({
  columns,
  fetchData: async (params) => {
    // params contains: pagination, sorting, columnFilters, globalFilter
    const result = await api.fetchUsers(params)
    return {
      data: result.users,
      pageCount: result.totalPages,
      rowCount: result.totalCount,
    }
  },
  initialPageSize: 25,
})
```

### useDataTable (Low-level)
For maximum control and custom implementations.

```tsx
const table = useDataTable({
  data,
  columns,
  enableServerSide: false,
  onServerSideChange: (state) => {
    // Handle state changes manually
  },
  // ... all other options
})
```

## State Management

### Accessing State
```tsx
const { state, selectedData } = table

// Current pagination
console.log(state.pagination.pageIndex, state.pagination.pageSize)

// Current sorting
console.log(state.sorting)

// Selected rows data
console.log(selectedData)
```

### Controlling State
```tsx
// Reset everything
table.resetAll()

// Reset specific states
table.resetSelection()
table.resetFilters()
table.resetSorting()
table.resetPagination()

// Set state manually
table.setPagination({ pageIndex: 0, pageSize: 50 })
table.setSorting([{ id: "name", desc: false }])
```

## Customization

### Custom Actions
```tsx
const customActions = [
  {
    label: "Archive",
    icon: Archive,
    onClick: (row) => archiveUser(row.id),
    variant: "secondary" as const,
    disabled: (row) => row.status === "archived",
  },
  {
    label: "Send Email",
    icon: Mail,
    onClick: (row) => sendEmail(row.email),
    hidden: (row) => !row.email,
  },
]
```

### Custom Status Options
```tsx
const projectStatusOptions = [
  { value: "planning", label: "Planning", color: "outline", icon: Clock },
  { value: "active", label: "In Progress", color: "default", icon: Play },
  { value: "completed", label: "Completed", color: "default", icon: Check },
  { value: "cancelled", label: "Cancelled", color: "destructive", icon: X },
]
```

### Table Actions
```tsx
<DataTable
  {...table.tableProps}
  actions={
    <>
      <Button onClick={handleExport} disabled={!table.selectedData.length}>
        Export ({table.selectedData.length})
      </Button>
      <Button onClick={handleAdd}>
        Add New
      </Button>
    </>
  }
/>
```

## TypeScript Support

The system is fully typed with TypeScript. Column utilities automatically infer types from your data structure:

```tsx
interface User {
  id: string
  name: string
  email: string
  status: "active" | "inactive"
}

// TypeScript knows these are valid keys
createTextColumn<User>("name", "Name")       // ✅
createTextColumn<User>("email", "Email")     // ✅
createTextColumn<User>("invalid", "Invalid") // ❌ TypeScript error
```

## Performance

- **Virtualization**: Built-in support for large datasets
- **Memoization**: All computations are properly memoized
- **Selective Re-renders**: Only affected components re-render on state changes
- **Server-side**: Supports pagination, sorting, and filtering on the server

## Accessibility

- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels and descriptions
- **Focus Management**: Logical tab order
- **High Contrast**: Supports system theme preferences

## Common Patterns

### Export Selected Data
```tsx
const handleExport = () => {
  const csvData = table.selectedData.map(user => ({
    name: user.name,
    email: user.email,
    status: user.status,
  }))
  downloadCSV(csvData)
}
```

### Bulk Actions
```tsx
const handleBulkDelete = async () => {
  const ids = table.selectedData.map(user => user.id)
  await api.deleteUsers(ids)
  table.resetSelection()
  refetchData()
}
```

### Custom Filtering
```tsx
// Server-side filtering
const fetchData = async (params) => {
  const filters = params.columnFilters.reduce((acc, filter) => {
    acc[filter.id] = filter.value
    return acc
  }, {})
  
  return api.fetchUsers({
    page: params.pagination.pageIndex,
    limit: params.pagination.pageSize,
    sort: params.sorting[0]?.id,
    order: params.sorting[0]?.desc ? 'desc' : 'asc',
    search: params.globalFilter,
    ...filters,
  })
}
```

## Migration from Other Tables

### From Basic HTML Tables
Replace `<table>` elements with `<DataTable>` and define columns using the utility functions.

### From Other React Table Libraries
The hook-based approach makes migration straightforward - just wrap your existing data and column definitions.

## Best Practices

1. **Memoize columns** to prevent unnecessary re-renders
2. **Use server-side** for datasets larger than 1000 rows
3. **Enable only needed features** to keep the interface clean
4. **Provide meaningful actions** that users actually need
5. **Use consistent status options** across your application
6. **Handle loading states** gracefully
7. **Test with screen readers** for accessibility

## Troubleshooting

### Common Issues

**Columns not updating**: Make sure to memoize your columns array
```tsx
const columns = useMemo(() => [...], [])
```

**Performance issues**: Consider server-side rendering for large datasets

**TypeScript errors**: Ensure your data type matches the column accessors

**Styling issues**: Check that all required UI components are installed