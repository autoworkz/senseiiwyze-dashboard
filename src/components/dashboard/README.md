# User Dashboard Components

A comprehensive set of reusable dashboard components built with React, TypeScript, Tailwind CSS, and shadcn/ui, featuring Apple-inspired glass morphism design.

## 🌟 Features

- **Glass Morphism Design**: Apple-inspired glass effects with backdrop blur and transparency
- **Fully Responsive**: Optimized for all screen sizes with mobile-first approach
- **Modular Architecture**: Reusable components that can be mixed and matched
- **TypeScript Support**: Full type safety with comprehensive interfaces
- **Accessibility**: Built with accessibility best practices
- **Dark Mode Ready**: Supports both light and dark themes

## 📁 Component Structure

```
src/components/dashboard/
├── user-dashboard-layout.tsx      # Main layout container and grid system
├── dashboard-header.tsx           # Header with breadcrumbs and actions
├── user-profile-card.tsx         # User information and status display
├── metrics-overview.tsx          # Performance metrics with progress indicators
├── detailed-metrics-cards.tsx    # Detailed metrics in card format
├── goals-objectives.tsx          # Goals tracking and progress
├── activity-timeline.tsx         # Activity and feedback timeline
├── performance-analytics.tsx     # Analytics with tabbed charts
├── dashboard-footer.tsx          # Footer with actions and timestamps
└── README.md                     # This documentation file

src/components/ui/
└── glass-card.tsx                # Enhanced card component with glass effects

src/types/
└── dashboard.ts                  # TypeScript interfaces and types
```

## 🎨 Glass Morphism Styling

The components use custom CSS classes for glass effects:

### Glass Variants
- `glass-card`: Default glass effect
- `glass-subtle`: Light glass effect
- `glass-strong`: Heavy glass effect with more blur
- `glass-hover`: Interactive hover effects

### Usage in Tailwind
```tsx
<div className="glass-card p-6">
  // Content with glass morphism effect
</div>
```

## 🧩 Core Components

### 1. UserDashboardLayout
Main container component that provides the layout structure and gradient background.

```tsx
<UserDashboardLayout>
  <DashboardGrid columns={12} gap={6}>
    <DashboardSection gridSpan={4}>
      // Content
    </DashboardSection>
  </DashboardGrid>
</UserDashboardLayout>
```

**Props:**
- `children`: ReactNode
- `className?`: string

### 2. DashboardHeader
Header component with breadcrumb navigation and action buttons.

```tsx
<DashboardHeader
  title="Dashboard Title"
  subtitle="Optional subtitle"
  breadcrumb={breadcrumbItems}
  actions={actionButtons}
/>
```

**Props:**
- `title`: string
- `subtitle?`: string
- `breadcrumb?`: BreadcrumbItem[]
- `actions?`: ActionButton[]

### 3. UserProfileCard
Displays user information, avatar, and status badges.

```tsx
<UserProfileCard user={userData} />
```

**Props:**
- `user`: UserProfileData
- `className?`: string

### 4. MetricsOverview
Shows key performance metrics with circular and linear progress indicators.

```tsx
<MetricsOverview metrics={metricsData} />
```

**Props:**
- `metrics`: MetricData
- `className?`: string

### 5. DetailedMetricsCards
Three-card layout showing detailed performance metrics, skills, and program readiness.

```tsx
<DetailedMetricsCards data={detailedMetricsData} />
```

**Props:**
- `data`: DetailedMetricsData
- `className?`: string

### 6. GoalsObjectives
Displays goals with progress tracking and status indicators.

```tsx
<GoalsObjectives goals={goalsData} />
```

**Props:**
- `goals`: Goal[]
- `className?`: string

### 7. ActivityTimeline
Timeline view of recent activities and feedback.

```tsx
<ActivityTimeline activities={activitiesData} />
```

**Props:**
- `activities`: ActivityItem[]
- `className?`: string

### 8. PerformanceAnalytics
Tabbed analytics component with multiple chart views.

```tsx
<PerformanceAnalytics />
```

**Props:**
- `className?`: string

### 9. DashboardFooter
Footer with action buttons and last updated information.

```tsx
<DashboardFooter
  lastUpdated="2024-10-21T14:30:00Z"
  onGenerateReport={() => {}}
  onScheduleReview={() => {}}
  onSendFeedback={() => {}}
/>
```

**Props:**
- `lastUpdated?`: string
- `onGenerateReport?`: () => void
- `onScheduleReview?`: () => void
- `onSendFeedback?`: () => void

## 📊 Data Types

All components use TypeScript interfaces defined in `src/types/dashboard.ts`:

### Key Interfaces
- `UserProfileData`: User information and status
- `MetricData`: Basic performance metrics
- `DetailedMetricsData`: Comprehensive metrics data
- `Goal`: Goal tracking information
- `ActivityItem`: Timeline activity data
- `UserDashboardData`: Complete dashboard data structure

## 🎯 Grid System

The dashboard uses a flexible 12-column grid system:

```tsx
<DashboardGrid columns={12} gap={6}>
  <DashboardSection gridSpan={4}>
    // Takes 4 columns (1/3 width)
  </DashboardSection>
  <DashboardSection gridSpan={8}>
    // Takes 8 columns (2/3 width)
  </DashboardSection>
</DashboardGrid>
```

### Grid Span Options
- `gridSpan`: 1-12 (responsive breakpoints included)
- Automatic responsive behavior for different screen sizes

## 🎨 Customization

### Theme Colors
The components support multiple color variants:
- `blue`: Primary actions and metrics
- `green`: Success states and achievements
- `purple`: Skills and development
- `orange`: Collaboration and teamwork
- `red`: Warnings and overdue items
- `yellow`: Pending states

### Status Variants
- `ready`: Green styling for completed/ready states
- `in_progress`: Blue styling for ongoing tasks
- `not_ready`: Red styling for incomplete states
- `pending`: Yellow styling for waiting states
- `overdue`: Red styling for overdue items

## 📱 Responsive Design

All components are built with mobile-first responsive design:

- **Mobile**: Single column layout
- **Tablet**: 2-3 column layouts
- **Desktop**: Full grid layouts up to 12 columns
- **Large Desktop**: Enhanced spacing and larger grids

## 🚀 Usage Example

Here's a complete example of setting up the dashboard:

```tsx
import { UserDashboardLayout, DashboardGrid, DashboardSection } from "@/components/dashboard/user-dashboard-layout"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { UserProfileCard } from "@/components/dashboard/user-profile-card"
// ... other imports

export default function Dashboard() {
  return (
    <UserDashboardLayout>
      <DashboardHeader
        title="User Dashboard"
        subtitle="Performance overview"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Dashboard", current: true }
        ]}
      />
      
      <DashboardGrid columns={12} gap={6}>
        <DashboardSection gridSpan={4}>
          <UserProfileCard user={userData} />
        </DashboardSection>
        
        <DashboardSection gridSpan={8}>
          <MetricsOverview metrics={metricsData} />
        </DashboardSection>
      </DashboardGrid>
    </UserDashboardLayout>
  )
}
```

## 🎪 Demo

Visit `/dashboard/user/demo` to see the complete dashboard in action with mock data.

## 🔧 Dependencies

- React 18+
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Lucide React (for icons)
- class-variance-authority (for component variants)

## 📝 Notes

- All components are client-side rendered (`"use client"`)
- Glass effects require backdrop-filter support (modern browsers)
- Components are optimized for performance with proper memoization where needed
- Accessibility features include proper ARIA labels and keyboard navigation