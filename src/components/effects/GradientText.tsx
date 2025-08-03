'use client'

import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface GradientTextProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'brand' | 'vibrant' | 'subtle' | 'neural' | 'warmth' | 'rainbow'
  animate?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  children: React.ReactNode
}

/**
 * GradientText component for creating beautiful gradient text effects
 * Uses our brand color system with oklch() colors for consistent theming
 */
const GradientText = forwardRef<HTMLSpanElement, GradientTextProps>(
  ({ className, variant = 'brand', animate = false, size = 'md', children, ...props }, ref) => {
    const gradientClasses = {
      brand: 'bg-gradient-to-r from-primary via-secondary to-accent',
      vibrant: 'bg-gradient-to-r from-accent via-primary to-secondary',
      subtle: 'bg-gradient-to-r from-foreground/80 via-foreground to-foreground/80',
      neural: 'bg-gradient-to-r from-primary to-accent',
      warmth: 'bg-gradient-to-r from-secondary to-chart-5',
      rainbow: 'bg-gradient-to-r from-chart-1 via-chart-2 via-chart-3 via-chart-4 to-chart-5',
    }

    const sizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl font-bold',
    }

    return (
      <span
        ref={ref}
        className={cn(
          'inline-block bg-clip-text text-transparent',
          gradientClasses[variant],
          sizeClasses[size],
          animate && 'animate-gradient-x',
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)

GradientText.displayName = 'GradientText'

export { GradientText }
