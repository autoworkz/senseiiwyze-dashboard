import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface StandardSkeletonProps {
  className?: string
  type?: 'text' | 'heading' | 'button' | 'input' | 'avatar' | 'badge' | 'card'
}

// Define consistent skeleton sizes that match actual content dimensions
const skeletonSizes = {
  text: 'h-4 w-full',
  heading: 'h-6 w-48',
  button: 'h-9 w-24',
  input: 'h-9 w-full',
  avatar: 'h-8 w-8 rounded-full',
  badge: 'h-5 w-16',
  card: 'h-[120px] w-full', // Match our standardized card min-height
}

export function StandardSkeleton({ type = 'text', className }: StandardSkeletonProps) {
  return <Skeleton className={cn(skeletonSizes[type], className)} />
}

// Settings-specific skeleton that matches actual component sizes
export function SettingsFormSkeleton() {
  return (
    <div className="space-y-6">
      {/* Form fields */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <StandardSkeleton type="text" className="w-24" /> {/* Label */}
          <StandardSkeleton type="input" /> {/* Input field */}
        </div>
      ))}

      {/* Save button */}
      <StandardSkeleton type="button" className="w-32" />
    </div>
  )
}

// Tab skeleton that matches actual tab dimensions
export function TabsSkeleton({ tabs = 4 }: { tabs?: number }) {
  return (
    <div className="flex space-x-1 bg-muted/50 p-1 rounded-lg">
      {Array.from({ length: tabs }).map((_, i) => (
        <StandardSkeleton
          key={i}
          className="h-8 flex-1 rounded-md" // Match actual tab height
        />
      ))}
    </div>
  )
}

// Card grid skeleton with consistent sizing
export function CardGridSkeleton({ cards = 3 }: { cards?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: cards }).map((_, i) => (
        <StandardSkeleton key={i} type="card" className="rounded-lg" />
      ))}
    </div>
  )
}

// Profile form skeleton with realistic dimensions
export function ProfileFormSkeleton() {
  return (
    <div className="space-y-4">
      {/* Profile picture */}
      <div className="flex items-center gap-4">
        <StandardSkeleton type="avatar" className="h-16 w-16" />
        <div className="space-y-1">
          <StandardSkeleton type="text" className="w-32" />
          <StandardSkeleton type="text" className="w-24 h-3" />
        </div>
      </div>

      {/* Form fields */}
      <SettingsFormSkeleton />
    </div>
  )
}
