# UI Components Documentation

This document provides comprehensive documentation for all UI components implemented in the SenseiiWyze dashboard application.

## Table of Contents

1. [Theme System](#theme-system)
2. [Navigation Components](#navigation-components)
3. [Data Visualization](#data-visualization)
4. [Table Components](#table-components)
5. [Form Components](#form-components)
6. [Upload Components](#upload-components)
7. [Notification System](#notification-system)
8. [Search Components](#search-components)
9. [Dashboard Widgets](#dashboard-widgets)
10. [Accessibility Features](#accessibility-features)

## Theme System

### Overview
The application uses `next-themes` for theme management with support for light, dark, and high-contrast modes.

### Usage
```tsx
import { useTheme } from "next-themes"

const { theme, setTheme } = useTheme()
```

### Available Themes
- `light` - Default light theme
- `dark` - Dark theme with reduced eye strain
- `light-high-contrast` - High contrast light theme for accessibility
- `dark-high-contrast` - High contrast dark theme for accessibility

### Theme Toggle Component
Located at: `src/components/theme-toggle.tsx`

```tsx
<ThemeToggle />
```

## Navigation Components

### GlobalNavigation
Located at: `src/components/layout/GlobalNavigation.tsx`

#### Features
- Dynamic sliding underline that follows hover
- Hover-triggered dropdown menus
- Active route highlighting
- Responsive mobile menu

#### Props
```tsx
interface GlobalNavigationProps {
  // No required props - uses internal routing
}
```

#### Example Usage
```tsx
<GlobalNavigation />
```

## Data Visualization

### Chart Components
Located at: `src/components/charts/`

#### LineChart
```tsx
interface LineChartProps {
  data: Array<{ name: string; [key: string]: any }>
  dataKeys: string[]
  height?: number
  colors?: string[]
}
```

#### BarChart
```tsx
interface BarChartProps {
  data: Array<{ name: string; [key: string]: any }>
  dataKeys: string[]
  height?: number
  stacked?: boolean
  colors?: string[]
}
```

#### PieChart
```tsx
interface PieChartProps {
  data: Array<{ name: string; value: number }>
  height?: number
  colors?: string[]
}
```

#### AreaChart
```tsx
interface AreaChartProps {
  data: Array<{ name: string; [key: string]: any }>
  dataKeys: string[]
  height?: number
  stacked?: boolean
  colors?: string[]
}
```

### Example Usage
```tsx
import { LineChart } from "@/components/charts/line-chart"

<LineChart 
  data={salesData}
  dataKeys={["sales", "revenue"]}
  height={300}
  colors={["#8b5cf6", "#3b82f6"]}
/>
```

## Table Components

### DataTable
Located at: `src/components/tables/data-table.tsx`

#### Features
- Column sorting
- Filtering
- Pagination
- Row selection
- Bulk actions
- Column visibility toggle
- Export functionality

#### Props
```tsx
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onRowSelection?: (selectedRows: TData[]) => void
  pageSize?: number
}
```

### TableToolbar
Located at: `src/components/tables/table-toolbar.tsx`

#### Props
```tsx
interface TableToolbarProps {
  selectedCount: number
  onBulkAction?: (action: string) => void
  bulkActions?: Array<{
    label: string
    onClick: () => void
    icon?: React.ComponentType<{ className?: string }>
    destructive?: boolean
  }>
  secondaryActions?: Array<{
    label: string
    onClick: () => void
    icon?: React.ComponentType<{ className?: string }>
  }>
  onSearch?: (value: string) => void
  onFilter?: () => void
  onExport?: () => void
  onImport?: () => void
  onColumnToggle?: () => void
}
```

## Form Components

### MultiStepForm
Located at: `src/components/forms/multi-step-form.tsx`

#### Features
- Progress indicator
- Step validation
- Navigation between steps
- Form state persistence

#### Props
```tsx
interface MultiStepFormProps {
  steps: Array<{
    id: string
    label: string
    description?: string
    content: React.ReactNode
    validation?: () => boolean
  }>
  onComplete: (data: any) => void
  initialData?: any
}
```

### Example Usage
```tsx
<MultiStepForm
  steps={[
    {
      id: "personal",
      label: "Personal Info",
      content: <PersonalInfoForm />,
      validation: () => validatePersonalInfo()
    },
    {
      id: "preferences",
      label: "Preferences",
      content: <PreferencesForm />
    }
  ]}
  onComplete={handleFormComplete}
/>
```

## Upload Components

### FileUpload
Located at: `src/components/upload/file-upload.tsx`

#### Features
- Drag and drop support
- Multiple file selection
- File type validation
- Upload progress tracking
- Preview for images
- Size limit enforcement

#### Props
```tsx
interface FileUploadProps {
  onUpload: (files: UploadedFile[]) => void
  accept?: string[]
  maxSize?: number // in bytes
  maxFiles?: number
  multiple?: boolean
}
```

### Example Usage
```tsx
<FileUpload
  onUpload={handleFileUpload}
  accept={["image/*", "application/pdf"]}
  maxSize={10 * 1024 * 1024} // 10MB
  maxFiles={5}
  multiple
/>
```

## Notification System

### Enhanced Notifications
Located at: `src/components/notifications/enhanced-notifications.tsx`

#### Toast Functions
```tsx
// Success notification
showSuccessToast("Operation completed successfully")

// Error notification
showErrorToast("An error occurred")

// Warning notification
showWarningToast("Please review your input")

// Info notification
showInfoToast("New updates available")
```

### NotificationBell Component
```tsx
interface NotificationBellProps {
  notifications: Notification[]
  onNotificationClick?: (notification: Notification) => void
  onMarkAsRead?: (id: string) => void
  onMarkAllAsRead?: () => void
}
```

## Search Components

### AdvancedSearch
Located at: `src/components/search/advanced-search.tsx`

#### Features
- Real-time search
- Filter categories
- Search history
- Keyboard shortcuts (Cmd/Ctrl + K)
- Result categorization

#### Props
```tsx
interface AdvancedSearchProps {
  onSearch: (query: string, filters: SearchFilter[]) => void
  placeholder?: string
  categories?: SearchCategory[]
  showFilters?: boolean
  showHistory?: boolean
}
```

### Example Usage
```tsx
<AdvancedSearch
  onSearch={handleSearch}
  categories={[
    { id: "users", label: "Users", icon: Users },
    { id: "courses", label: "Courses", icon: BookOpen }
  ]}
  showFilters
  showHistory
/>
```

## Dashboard Widgets

### DraggableWidget
Located at: `src/components/widgets/draggable-widget.tsx`

#### Features
- Drag and drop repositioning
- Resize handles
- Minimize/maximize states
- Custom content slots

#### Props
```tsx
interface DraggableWidgetProps {
  id: string
  title: string
  children: React.ReactNode
  defaultPosition?: { x: number; y: number }
  defaultSize?: { width: number; height: number }
  minSize?: { width: number; height: number }
  maxSize?: { width: number; height: number }
  canResize?: boolean
  canDrag?: boolean
  onPositionChange?: (position: { x: number; y: number }) => void
  onSizeChange?: (size: { width: number; height: number }) => void
}
```

## Accessibility Features

### High Contrast Mode
The application supports high contrast themes for better accessibility:

- **Activation**: Use the theme toggle to switch to high-contrast modes
- **Color Ratios**: All text meets WCAG AAA standards (7:1 for normal text, 4.5:1 for large text)
- **Focus Indicators**: Enhanced focus rings with 3px outlines
- **Keyboard Navigation**: Full keyboard support for all interactive elements

### Screen Reader Support
- Semantic HTML structure
- ARIA labels and descriptions
- Live regions for dynamic content
- Skip navigation links

### Keyboard Shortcuts
- `Cmd/Ctrl + K` - Open search
- `Esc` - Close modals/dialogs
- `Tab` - Navigate between elements
- `Arrow Keys` - Navigate within components

## Best Practices

### 1. Theme Consistency
Always use semantic color tokens instead of hardcoded colors:

```tsx
// ✅ Good
<div className="bg-background text-foreground">

// ❌ Bad
<div className="bg-white text-gray-900">
```

### 2. Spacing System
Use the 4/8pt spacing system:

```tsx
// ✅ Good
<div className="p-4 mt-8 space-y-2">

// ❌ Bad
<div className="p-3 mt-7 space-y-1.5">
```

### 3. Loading States
Always provide loading feedback:

```tsx
if (loading) {
  return <DashboardSkeleton />
}
```

### 4. Error Handling
Use the toast system for user feedback:

```tsx
try {
  await saveData()
  showSuccessToast("Data saved successfully")
} catch (error) {
  showErrorToast("Failed to save data")
}
```

### 5. Accessibility
- Always include alt text for images
- Use semantic HTML elements
- Provide keyboard navigation
- Test with screen readers

## Component Composition

### Example: Dashboard Page
```tsx
import { GlobalNavigation } from "@/components/layout/GlobalNavigation"
import { DataTable } from "@/components/tables/data-table"
import { LineChart } from "@/components/charts/line-chart"
import { FileUpload } from "@/components/upload/file-upload"
import { NotificationBell } from "@/components/notifications/enhanced-notifications"

export function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <GlobalNavigation />
      
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <NotificationBell notifications={notifications} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart data={revenueData} dataKeys={["revenue"]} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={userColumns} data={users} />
            </CardContent>
          </Card>
        </div>
        
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Upload Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <FileUpload onUpload={handleUpload} accept={["application/pdf"]} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

## Migration Guide

### From Custom Theme to next-themes
If migrating from the previous custom theme implementation:

1. Remove `ThemeProvider` from `providers.tsx`
2. Update theme toggle to use `useTheme` hook
3. Update any custom theme logic to use next-themes API

### From Basic Tables to DataTable
1. Define columns using `@tanstack/react-table` format
2. Replace table markup with `<DataTable>` component
3. Add sorting/filtering handlers as needed

## Troubleshooting

### Common Issues

#### Theme not persisting
Ensure `next-themes` provider is properly configured in the root layout.

#### Charts not rendering
Check that data format matches expected structure and all required props are provided.

#### Drag and drop not working
Verify `@dnd-kit` dependencies are installed and providers are set up.

#### File upload errors
Check file size limits, accepted types, and ensure upload handler is properly implemented.

### Performance Tips

1. **Virtualization**: For large data sets, consider using `@tanstack/react-virtual`
2. **Memoization**: Use `React.memo` for expensive components
3. **Lazy Loading**: Implement code splitting for heavy components
4. **Debouncing**: Add debounce to search and filter inputs

## Support

For issues or questions about these components:

1. Check the component source code for additional inline documentation
2. Review the TypeScript interfaces for detailed prop information
3. Test in Storybook (when available) for interactive examples
4. Consult the team's design system documentation