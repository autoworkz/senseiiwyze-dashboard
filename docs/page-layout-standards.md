# Page Layout Standards

## Overview

All pages in the app should use the standardized `PageContainer` and `PageHeader` components for consistent layouts and padding.

## Components

### PageContainer

Located: `src/components/layout/PageContainer.tsx`

**Default Usage:**
```tsx
import { PageContainer } from '@/components/layout/PageContainer'

export default function MyPage() {
  return (
    <PageContainer className="space-y-8">
      {/* Your page content */}
    </PageContainer>
  )
}
```

**Props:**
- `maxWidth`: `'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | '7xl' | 'full'` (default: `'6xl'`)
- `noPadding`: `boolean` - Removes default padding for custom layouts
- `className`: `string` - Additional Tailwind classes

**Max Width Guidelines:**
- `'4xl'` - Settings, forms, focused content (1024px)
- `'6xl'` - Default for most pages (1152px)  
- `'7xl'` - Analytics, dashboards with wide content (1280px)
- `'full'` - Special layouts that need full width

### PageHeader

**Basic Usage:**
```tsx
import { PageHeader } from '@/components/layout/PageContainer'

<PageHeader 
  title="Page Title"
  description="Optional description text"
/>
```

**With Action Buttons:**
```tsx
<PageHeader 
  title="User Management"
  description="Manage users and permissions"
>
  <Button variant="outline">Filter</Button>
  <Button>Add User</Button>
</PageHeader>
```

## Standard Pattern

Every page should follow this pattern:

```tsx
import { PageContainer, PageHeader } from '@/components/layout/PageContainer'

export default function MyPage() {
  return (
    <PageContainer maxWidth="6xl" className="space-y-8">
      <PageHeader 
        title="Page Title"
        description="Page description"
      >
        {/* Optional action buttons */}
      </PageHeader>
      
      {/* Page content */}
      <Card>
        {/* Content */}
      </Card>
    </PageContainer>
  )
}
```

## Benefits

1. **Consistent Spacing**: All pages have standardized padding and margins
2. **Responsive Design**: Automatic responsive behavior across screen sizes
3. **Easy Maintenance**: Changes to layout affect all pages automatically
4. **Developer Experience**: Simple, reusable pattern for new pages
5. **Design System**: Enforces consistent visual hierarchy

## Migration

When updating existing pages:

1. Import `PageContainer` and `PageHeader`
2. Replace outer `div` with `PageContainer`
3. Replace header sections with `PageHeader`
4. Remove manual padding/margin classes
5. Test responsive behavior

## Examples

See these files for reference implementations:
- `src/app/app/page.tsx` - Dashboard with custom greeting
- `src/app/app/settings/page.tsx` - Form-focused layout
- `src/app/app/analytics/page.tsx` - Wide dashboard layout
- `src/app/app/users/page.tsx` - Table with actions