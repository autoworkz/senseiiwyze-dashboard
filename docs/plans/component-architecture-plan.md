# Component Architecture Plan

## Overview
This document defines the component architecture strategy for the SenseiiWyze Dashboard, establishing patterns, hierarchies, and best practices for building maintainable, scalable, and reusable React components.

## Architecture Principles

### 1. Component Philosophy
- **Single Responsibility**: Each component serves one clear purpose
- **Composition over Inheritance**: Build complex UIs from simple building blocks
- **Props over State**: Prefer controlled components with data flowing down
- **Accessibility First**: WCAG 2.1 AA compliance built into every component
- **Performance by Default**: Optimize rendering from the start

### 2. Design System Foundation
- **Base**: shadcn/ui components as primitives
- **Styling**: Tailwind CSS with semantic color system
- **Variants**: CVA (class-variance-authority) for component variations
- **Animation**: Framer Motion for complex interactions
- **Icons**: Lucide React for consistent iconography

## Component Hierarchy

### Level 1: Primitive Components
**Location**: `/src/components/ui/`
**Purpose**: Atomic building blocks from shadcn/ui

```
ui/
├── button.tsx
├── card.tsx
├── input.tsx
├── label.tsx
├── select.tsx
├── dialog.tsx
├── tabs.tsx
├── table.tsx
├── skeleton.tsx
└── avatar.tsx
```

### Level 2: Base Components
**Location**: `/src/components/base/`
**Purpose**: Enhanced primitives with app-specific defaults

```typescript
// Example: BaseButton.tsx
interface BaseButtonProps extends ButtonProps {
  loading?: boolean
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
}

export function BaseButton({ 
  loading, 
  icon: Icon, 
  iconPosition = 'left',
  children,
  disabled,
  ...props 
}: BaseButtonProps) {
  return (
    <Button disabled={disabled || loading} {...props}>
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : Icon && iconPosition === 'left' ? (
        <Icon className="mr-2 h-4 w-4" />
      ) : null}
      {children}
      {Icon && iconPosition === 'right' && !loading ? (
        <Icon className="ml-2 h-4 w-4" />
      ) : null}
    </Button>
  )
}
```

### Level 3: Feature Components
**Location**: `/src/components/features/`
**Purpose**: Business logic encapsulation

```
features/
├── auth/
│   ├── LoginForm.tsx
│   ├── SignupForm.tsx
│   └── PasswordReset.tsx
├── dashboard/
│   ├── MetricCard.tsx
│   ├── ChartContainer.tsx
│   └── ActivityFeed.tsx
├── users/
│   ├── UserTable.tsx
│   ├── UserProfile.tsx
│   └── UserActions.tsx
└── common/
    ├── DataTable.tsx
    ├── SearchBar.tsx
    └── FilterPanel.tsx
```

### Level 4: Layout Components
**Location**: `/src/components/layouts/`
**Purpose**: Page structure and navigation

```
layouts/
├── DashboardLayout.tsx
├── AuthLayout.tsx
├── SettingsLayout.tsx
├── PageHeader.tsx
├── Sidebar.tsx
└── MobileNav.tsx
```

### Level 5: Page Components
**Location**: `/src/app/*/page.tsx`
**Purpose**: Route-specific compositions

## Component Patterns

### 1. Compound Components
For complex, related UI elements that work together:

```typescript
// TabsCompound.tsx
interface TabsCompoundProps {
  children: React.ReactNode
  defaultValue?: string
  className?: string
}

const TabsRoot = ({ children, ...props }: TabsCompoundProps) => (
  <Tabs {...props}>{children}</Tabs>
)

const TabsList = ({ children }: { children: React.ReactNode }) => (
  <TabsListPrimitive>{children}</TabsListPrimitive>
)

const TabsTrigger = ({ value, children }: TabsTriggerProps) => (
  <TabsTriggerPrimitive value={value}>{children}</TabsTriggerPrimitive>
)

const TabsContent = ({ value, children }: TabsContentProps) => (
  <TabsContentPrimitive value={value}>{children}</TabsContentPrimitive>
)

export const TabsCompound = Object.assign(TabsRoot, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
})
```

### 2. Render Props Pattern
For flexible component composition:

```typescript
interface DataFetcherProps<T> {
  url: string
  children: (data: T | null, loading: boolean, error: Error | null) => React.ReactNode
}

export function DataFetcher<T>({ url, children }: DataFetcherProps<T>) {
  const { data, loading, error } = useFetch<T>(url)
  return <>{children(data, loading, error)}</>
}

// Usage
<DataFetcher url="/api/users">
  {(users, loading, error) => (
    loading ? <Skeleton /> : 
    error ? <ErrorMessage error={error} /> :
    <UserList users={users} />
  )}
</DataFetcher>
```

### 3. Higher-Order Components (HOCs)
For cross-cutting concerns:

```typescript
// withAuth.tsx
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredRole?: UserRole
) {
  return function AuthenticatedComponent(props: P) {
    const { user, isLoading } = useAuth()
    
    if (isLoading) return <LoadingSpinner />
    if (!user) return <Navigate to="/login" />
    if (requiredRole && user.role !== requiredRole) {
      return <AccessDenied />
    }
    
    return <Component {...props} />
  }
}

// Usage
const ProtectedAdminPage = withAuth(AdminDashboard, UserRole.ADMIN)
```

### 4. Custom Hooks Pattern
For reusable component logic:

```typescript
// useTableControls.ts
interface UseTableControlsOptions {
  defaultSort?: string
  defaultPageSize?: number
}

export function useTableControls(options: UseTableControlsOptions = {}) {
  const [sorting, setSorting] = useState(options.defaultSort)
  const [filters, setFilters] = useState({})
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: options.defaultPageSize || 10
  })
  
  const resetControls = () => {
    setSorting(options.defaultSort)
    setFilters({})
    setPagination({ page: 1, pageSize: options.defaultPageSize || 10 })
  }
  
  return {
    sorting,
    filters,
    pagination,
    setSorting,
    setFilters,
    setPagination,
    resetControls
  }
}
```

## Component Standards

### 1. File Structure
```typescript
// ComponentName.tsx
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { ComponentNameProps } from './types'

export function ComponentName({ 
  className,
  ...props 
}: ComponentNameProps) {
  // State
  const [state, setState] = useState()
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, [])
  
  // Handlers
  const handleClick = () => {
    // Handler logic
  }
  
  // Render
  return (
    <div className={cn('default-classes', className)}>
      {/* Component content */}
    </div>
  )
}
```

### 2. TypeScript Conventions
```typescript
// types.ts
export interface ComponentNameProps {
  // Required props first
  id: string
  value: string
  
  // Optional props
  label?: string
  description?: string
  
  // Event handlers
  onChange?: (value: string) => void
  onBlur?: () => void
  
  // Style props
  className?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  
  // Component-specific props
  loading?: boolean
  error?: string
}
```

### 3. Props Guidelines
- Use descriptive prop names
- Group related props
- Provide sensible defaults
- Document complex props
- Use TypeScript for type safety

### 4. State Management Rules
```typescript
// Local state for UI
const [isOpen, setIsOpen] = useState(false)

// Derived state
const isValid = useMemo(() => validateForm(formData), [formData])

// Global state via Zustand
const { user, updateUser } = useUserStore()

// Server state via React Query
const { data, isLoading } = useQuery({
  queryKey: ['users', userId],
  queryFn: () => fetchUser(userId)
})
```

## Component Categories

### 1. Presentational Components
Pure UI components without business logic:

```typescript
export function Badge({ 
  children, 
  variant = 'default',
  className 
}: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)}>
      {children}
    </span>
  )
}
```

### 2. Container Components
Components that manage state and logic:

```typescript
export function UserListContainer() {
  const { users, loading, error, fetchUsers } = useUsers()
  
  useEffect(() => {
    fetchUsers()
  }, [])
  
  if (loading) return <UserListSkeleton />
  if (error) return <ErrorBoundary error={error} />
  
  return <UserList users={users} />
}
```

### 3. Page Components
Top-level route components:

```typescript
export default function UsersPage() {
  return (
    <DashboardLayout>
      <PageHeader 
        title="Users" 
        description="Manage your application users"
      />
      <UserListContainer />
    </DashboardLayout>
  )
}
```

### 4. Utility Components
Helper components for common patterns:

```typescript
// ErrorBoundary.tsx
export function ErrorBoundary({ 
  children, 
  fallback 
}: ErrorBoundaryProps) {
  // Error boundary implementation
}

// LoadingBoundary.tsx
export function LoadingBoundary({ 
  loading, 
  children 
}: LoadingBoundaryProps) {
  return loading ? <Skeleton /> : children
}
```

## Performance Optimization

### 1. Code Splitting
```typescript
// Lazy load heavy components
const AnalyticsChart = lazy(() => import('./AnalyticsChart'))

// Usage with Suspense
<Suspense fallback={<ChartSkeleton />}>
  <AnalyticsChart data={data} />
</Suspense>
```

### 2. Memoization
```typescript
// Memoize expensive components
export const ExpensiveList = memo(({ items }: ExpensiveListProps) => {
  return (
    <ul>
      {items.map(item => (
        <ExpensiveListItem key={item.id} item={item} />
      ))}
    </ul>
  )
})

// Memoize expensive calculations
const sortedData = useMemo(
  () => data.sort((a, b) => b.value - a.value),
  [data]
)
```

### 3. Virtual Scrolling
```typescript
// For large lists
import { useVirtual } from '@tanstack/react-virtual'

export function VirtualList({ items }: VirtualListProps) {
  const parentRef = useRef<HTMLDivElement>(null)
  
  const virtualizer = useVirtual({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  })
  
  return (
    <div ref={parentRef} className="h-[400px] overflow-auto">
      <div style={{ height: `${virtualizer.totalSize}px` }}>
        {virtualizer.virtualItems.map(virtualItem => (
          <div
            key={virtualItem.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <ListItem item={items[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  )
}
```

## Testing Strategy

### 1. Unit Tests
```typescript
// ComponentName.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { ComponentName } from './ComponentName'

describe('ComponentName', () => {
  it('renders with default props', () => {
    render(<ComponentName />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
  
  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<ComponentName onClick={handleClick} />)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### 2. Integration Tests
```typescript
// UserFlow.test.tsx
describe('User Management Flow', () => {
  it('creates a new user', async () => {
    render(<UsersPage />)
    
    // Open create dialog
    fireEvent.click(screen.getByText('Add User'))
    
    // Fill form
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'John Doe' }
    })
    
    // Submit
    fireEvent.click(screen.getByText('Create'))
    
    // Verify
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
  })
})
```

### 3. Visual Regression Tests
```typescript
// ComponentName.visual.test.tsx
import { render } from '@testing-library/react'
import { ComponentName } from './ComponentName'

describe('ComponentName Visual', () => {
  it('matches snapshot', () => {
    const { container } = render(<ComponentName />)
    expect(container).toMatchSnapshot()
  })
})
```

## Accessibility Standards

### 1. ARIA Requirements
```typescript
export function Modal({ isOpen, title, children }: ModalProps) {
  return (
    <Dialog open={isOpen}>
      <DialogContent
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <DialogHeader>
          <DialogTitle id="modal-title">{title}</DialogTitle>
        </DialogHeader>
        <div id="modal-description">{children}</div>
      </DialogContent>
    </Dialog>
  )
}
```

### 2. Keyboard Navigation
```typescript
export function NavigableList({ items }: NavigableListProps) {
  const [focusedIndex, setFocusedIndex] = useState(0)
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setFocusedIndex(prev => 
          Math.min(prev + 1, items.length - 1)
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setFocusedIndex(prev => Math.max(prev - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        handleSelect(items[focusedIndex])
        break
    }
  }
  
  return (
    <ul role="listbox" onKeyDown={handleKeyDown}>
      {items.map((item, index) => (
        <li
          key={item.id}
          role="option"
          aria-selected={index === focusedIndex}
          tabIndex={index === focusedIndex ? 0 : -1}
        >
          {item.label}
        </li>
      ))}
    </ul>
  )
}
```

### 3. Screen Reader Support
```typescript
export function LoadingState({ message }: LoadingStateProps) {
  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <Spinner />
      <span className="sr-only">{message}</span>
    </div>
  )
}
```

## Component Documentation

### 1. Storybook Integration
```typescript
// ComponentName.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { ComponentName } from './ComponentName'

const meta: Meta<typeof ComponentName> = {
  title: 'Components/ComponentName',
  component: ComponentName,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'ghost'],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Click me',
  },
}

export const Loading: Story = {
  args: {
    children: 'Loading...',
    loading: true,
  },
}
```

### 2. JSDoc Comments
```typescript
/**
 * A flexible data table component with sorting, filtering, and pagination
 * 
 * @example
 * ```tsx
 * <DataTable
 *   columns={columns}
 *   data={users}
 *   onSort={handleSort}
 *   onFilter={handleFilter}
 * />
 * ```
 */
export function DataTable<T>({ 
  columns, 
  data, 
  onSort, 
  onFilter 
}: DataTableProps<T>) {
  // Implementation
}
```

### 3. README Files
Each feature folder should have a README:

```markdown
# Dashboard Components

This folder contains all dashboard-related components.

## Components

### MetricCard
Displays a single metric with icon and trend indicator.

**Props:**
- `title`: Metric title
- `value`: Current value
- `change`: Percentage change
- `icon`: Lucide icon component

**Usage:**
```tsx
<MetricCard
  title="Total Revenue"
  value="$45,231.89"
  change={20.1}
  icon={DollarSign}
/>
```
```

## Migration Path

### From Current Components

#### Phase 1: Audit (Week 1)
1. Catalog all existing components
2. Identify duplicates and inconsistencies
3. Map components to new architecture
4. Create migration priority list

#### Phase 2: Refactor (Week 2-3)
1. Move primitives to `/components/ui`
2. Create base components layer
3. Refactor feature components
4. Update imports throughout codebase

#### Phase 3: Enhancement (Week 4)
1. Add missing TypeScript types
2. Implement accessibility features
3. Add component tests
4. Create Storybook stories

#### Phase 4: Documentation (Week 5)
1. Write component documentation
2. Create usage guidelines
3. Build component library site
4. Train team on new patterns

## Component Library Structure

### Public API
```typescript
// src/components/index.ts
// Primitives
export * from './ui'

// Base Components
export { BaseButton } from './base/BaseButton'
export { BaseInput } from './base/BaseInput'
export { BaseCard } from './base/BaseCard'

// Feature Components
export { LoginForm } from './features/auth/LoginForm'
export { UserTable } from './features/users/UserTable'
export { MetricCard } from './features/dashboard/MetricCard'

// Layouts
export { DashboardLayout } from './layouts/DashboardLayout'
export { AuthLayout } from './layouts/AuthLayout'

// Utilities
export { ErrorBoundary } from './utils/ErrorBoundary'
export { LoadingBoundary } from './utils/LoadingBoundary'
```

## Tooling & Infrastructure

### 1. Development Tools
- **Storybook**: Component development environment
- **React DevTools**: Debugging and profiling
- **TypeScript**: Type safety and IntelliSense
- **ESLint**: Code quality enforcement
- **Prettier**: Code formatting

### 2. Build Tools
- **Vite/Next.js**: Fast builds and HMR
- **PostCSS**: CSS processing
- **Tailwind CSS**: Utility-first styling
- **Bundle Analyzer**: Size optimization

### 3. Testing Tools
- **Jest**: Unit testing framework
- **React Testing Library**: Component testing
- **Playwright**: E2E testing
- **Chromatic**: Visual regression testing

## Best Practices Checklist

### For Every Component:
- [ ] Has clear single responsibility
- [ ] Uses TypeScript for all props
- [ ] Includes proper ARIA attributes
- [ ] Handles loading and error states
- [ ] Is keyboard navigable
- [ ] Has unit tests
- [ ] Is documented with examples
- [ ] Uses semantic color utilities
- [ ] Follows naming conventions
- [ ] Is exported from index file

### For Feature Components:
- [ ] Encapsulates business logic
- [ ] Uses custom hooks for logic
- [ ] Handles edge cases
- [ ] Has integration tests
- [ ] Includes error boundaries
- [ ] Implements proper data fetching
- [ ] Uses proper state management
- [ ] Has loading skeletons
- [ ] Includes analytics tracking
- [ ] Supports internationalization

## Component Governance

### 1. Review Process
- All new components require code review
- Components must meet accessibility standards
- Performance impact must be measured
- Documentation must be complete

### 2. Deprecation Process
1. Mark component as deprecated in code
2. Add console warning in development
3. Update documentation with migration path
4. Remove after 2 release cycles

### 3. Version Control
- Components follow semantic versioning
- Breaking changes require major version bump
- New features require minor version bump
- Bug fixes require patch version bump

## Future Considerations

### 1. Component Federation
- Micro-frontend architecture
- Shared component libraries
- Cross-team component sharing
- Runtime component loading

### 2. AI-Assisted Development
- Component generation from designs
- Automated testing generation
- Accessibility audit automation
- Performance optimization suggestions

### 3. Advanced Patterns
- Server Components integration
- Streaming SSR support
- React Server Actions
- Suspense boundaries optimization

## Conclusion

This component architecture provides a scalable foundation for building and maintaining the SenseiiWyze Dashboard. By following these patterns and standards, we ensure consistency, maintainability, and excellent user experience across the application.

Regular reviews and updates of this architecture will ensure it continues to meet the evolving needs of the project and development team.