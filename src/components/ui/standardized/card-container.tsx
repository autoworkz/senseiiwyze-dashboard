import type { ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StandardCardProps {
  children: ReactNode
  className?: string
  minHeight?: 'sm' | 'md' | 'lg' | 'auto'
}

interface StandardCardHeaderProps {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
  className?: string
}

interface StandardCardContentProps {
  children: ReactNode
  className?: string
  noPadding?: boolean
}

const minHeightMap = {
  sm: 'min-h-[120px]',
  md: 'min-h-[180px]',
  lg: 'min-h-[240px]',
  auto: '',
}

export function StandardCard({ children, className, minHeight = 'auto' }: StandardCardProps) {
  return <Card className={cn(minHeightMap[minHeight], 'flex flex-col', className)}>{children}</Card>
}

export function StandardCardHeader({
  title,
  description,
  icon,
  action,
  className,
}: StandardCardHeaderProps) {
  return (
    <CardHeader
      className={cn('flex flex-row items-center justify-between space-y-0 pb-2', className)}
    >
      <div className="flex flex-col space-y-1">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {description && <CardDescription className="text-xs">{description}</CardDescription>}
      </div>
      <div className="flex items-center gap-2">
        {icon}
        {action}
      </div>
    </CardHeader>
  )
}

export function StandardCardContent({ children, className, noPadding }: StandardCardContentProps) {
  return (
    <CardContent className={cn('flex-1', noPadding ? 'p-0' : '', className)}>
      {children}
    </CardContent>
  )
}

// KPI Card specific component with fixed height
export function KPICard({
  title,
  value,
  subtitle,
  icon,
  trend,
}: {
  title: string
  value: string | number
  subtitle?: string
  icon?: ReactNode
  trend?: { value: string; positive: boolean }
}) {
  return (
    <StandardCard minHeight="sm">
      <StandardCardHeader title={title} icon={icon} />
      <StandardCardContent>
        <div className="space-y-1">
          <div className="text-2xl font-bold">{value}</div>
          {subtitle && (
            <p className="text-xs text-muted-foreground">
              {trend && (
                <span
                  className={cn('font-medium', trend.positive ? 'text-green-600' : 'text-red-600')}
                >
                  {trend.value}
                </span>
              )}
              {trend && subtitle && ' '}
              {subtitle}
            </p>
          )}
        </div>
      </StandardCardContent>
    </StandardCard>
  )
}
