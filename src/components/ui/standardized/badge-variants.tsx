import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface StandardBadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

// Define consistent width classes for badges
const sizeClasses = {
  sm: 'min-w-[60px] text-xs px-2 py-0.5',
  md: 'min-w-[80px] text-sm px-2.5 py-0.5',
  lg: 'min-w-[100px] text-sm px-3 py-1',
}

// Define semantic color variants
const variantClasses = {
  default: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
  destructive: 'bg-destructive text-destructive-foreground',
  outline: 'border-border bg-background',
  success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
}

export function StandardBadge({
  children,
  variant = 'default',
  size = 'md',
  className,
}: StandardBadgeProps) {
  return (
    <Badge
      className={cn(
        'inline-flex items-center justify-center font-medium',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {children}
    </Badge>
  )
}

// Specific badge components for common use cases
export function StatusBadge({ status }: { status: 'active' | 'inactive' | 'pending' }) {
  const config = {
    active: { variant: 'success' as const, label: 'Active' },
    inactive: { variant: 'destructive' as const, label: 'Inactive' },
    pending: { variant: 'warning' as const, label: 'Pending' },
  }

  const { variant, label } = config[status]

  return (
    <StandardBadge variant={variant} size="md">
      {label}
    </StandardBadge>
  )
}

export function RoleBadge({ role }: { role: string }) {
  return (
    <StandardBadge variant="default" size="md" className="capitalize">
      {role}
    </StandardBadge>
  )
}

export function ScoreBadge({ score }: { score: number }) {
  let variant: 'success' | 'warning' | 'destructive' = 'success'

  if (score >= 80) {
    variant = 'success'
  } else if (score >= 60) {
    variant = 'warning'
  } else {
    variant = 'destructive'
  }

  return (
    <StandardBadge variant={variant} size="md">
      {score}%
    </StandardBadge>
  )
}
