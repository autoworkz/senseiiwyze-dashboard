import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import {
  InteractiveCard,
  InteractiveCardContent,
  InteractiveCardHeader,
  InteractiveCardTitle,
} from './index'

// Define consistent minimum heights matching our StandardCard
const minHeightMap = {
  sm: 'min-h-[120px]',
  md: 'min-h-[180px]',
  lg: 'min-h-[240px]',
  auto: '',
}

interface StandardizedInteractiveCardProps {
  children: ReactNode
  minHeight?: keyof typeof minHeightMap
  effect?: 'lift' | 'scale' | 'glow' | 'float'
  clickable?: boolean
  intensity?: 'subtle' | 'normal' | 'strong'
  className?: string
}

export function StandardizedInteractiveCard({
  children,
  minHeight = 'md',
  effect = 'lift',
  clickable,
  intensity,
  className,
}: StandardizedInteractiveCardProps) {
  return (
    <InteractiveCard
      effect={effect}
      clickable={clickable}
      intensity={intensity}
      className={cn(minHeightMap[minHeight], 'flex flex-col', className)}
    >
      {children}
    </InteractiveCard>
  )
}

// KPI Card variant with consistent small height
export function InteractiveKPICard({
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
    <StandardizedInteractiveCard minHeight="sm" effect="lift" clickable>
      <InteractiveCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <InteractiveCardTitle className="text-sm font-medium">{title}</InteractiveCardTitle>
        {icon}
      </InteractiveCardHeader>
      <InteractiveCardContent className="flex-1 flex flex-col justify-center">
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
      </InteractiveCardContent>
    </StandardizedInteractiveCard>
  )
}
