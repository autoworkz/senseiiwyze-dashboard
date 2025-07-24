# shadcn/ui Components

This document provides an overview of the shadcn/ui components used in the SenseiiWyze Dashboard application.

## Components Added

### Core UI Components

- **Table**: Used for displaying tabular data with headers, rows, and cells
- **Card**: Container component with header, content, and footer sections
- **Skeleton**: Loading placeholder for UI elements
- **Progress**: Visual indicator for showing progress or completion percentage

### Custom Components

#### DataOverview

A custom component built using shadcn/ui primitives that provides a comprehensive data overview with:

- Searchable table interface
- Progress indicators with color-coded status
- Loading states with skeleton placeholders
- Status badges for different user states

## Usage Examples

### Basic Table

```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export function BasicTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>John Doe</TableCell>
          <TableCell>Active</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
```

### Card Component

```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function BasicCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard Overview</CardTitle>
        <CardDescription>Summary of key metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content goes here</p>
      </CardContent>
    </Card>
  )
}
```

### Progress Indicator

```tsx
import { Progress } from '@/components/ui/progress'

export function BasicProgress() {
  return <Progress value={75} className="h-2" />
}
```

### Loading Skeleton

```tsx
import { Skeleton } from '@/components/ui/skeleton'

export function LoadingState() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  )
}
```

## Theming

All components use semantic color tokens from the shadcn/ui theme:

- `background` / `foreground`: Main background and text colors
- `card` / `card-foreground`: Card component colors
- `primary` / `primary-foreground`: Primary action colors
- `secondary` / `secondary-foreground`: Secondary element colors
- `muted` / `muted-foreground`: Muted/disabled state colors
- `accent` / `accent-foreground`: Accent/highlight colors
- `destructive` / `destructive-foreground`: Error/warning colors

## Adding More Components

To add more shadcn/ui components, use the CLI:

```bash
pnpm dlx shadcn@latest add <component-name>
```

Available components include:
- accordion, alert, alert-dialog, avatar
- badge, button, calendar, card
- checkbox, collapsible, command, context-menu
- dialog, drawer, dropdown-menu
- form, hover-card, input, label
- menubar, navigation-menu, popover
- progress, radio-group, scroll-area
- select, separator, sheet, skeleton
- slider, switch, table, tabs
- textarea, toast, toggle, tooltip