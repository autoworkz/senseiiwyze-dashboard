'use client'

import { Slot } from '@radix-ui/react-slot'
import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'brand' | 'vibrant' | 'subtle' | 'neural' | 'warmth' | 'glass'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  animated?: boolean
  glow?: boolean
  asChild?: boolean
  children: React.ReactNode
}

/**
 * GradientButton component with sophisticated visual effects
 * Features gradient backgrounds, glass morphism, and glow effects
 */
const GradientButton = forwardRef<HTMLButtonElement, GradientButtonProps>(
  (
    {
      className,
      variant = 'brand',
      size = 'md',
      animated = false,
      glow = false,
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'

    const baseClasses =
      'relative inline-flex items-center justify-center rounded-md font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'

    const variantClasses = {
      brand:
        'bg-gradient-to-r from-primary via-secondary to-accent text-primary-foreground hover:shadow-lg hover:shadow-primary/25',
      vibrant:
        'bg-gradient-to-r from-accent via-primary to-secondary text-accent-foreground hover:shadow-lg hover:shadow-accent/25',
      subtle:
        'bg-gradient-to-r from-muted to-muted/80 text-muted-foreground border border-border hover:from-muted/80 hover:to-muted',
      neural:
        'bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-lg hover:shadow-primary/25',
      warmth:
        'bg-gradient-to-r from-secondary to-chart-5 text-secondary-foreground hover:shadow-lg hover:shadow-secondary/25',
      glass:
        'bg-card/50 backdrop-blur-sm border border-border/50 text-card-foreground hover:bg-card/70',
    }

    const sizeClasses = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 py-2',
      lg: 'h-11 px-6 text-lg',
      xl: 'h-12 px-8 text-xl',
    }

    const glowClasses = glow
      ? {
          brand: 'hover:shadow-2xl hover:shadow-primary/30',
          vibrant: 'hover:shadow-2xl hover:shadow-accent/30',
          subtle: 'hover:shadow-lg hover:shadow-foreground/10',
          neural: 'hover:shadow-2xl hover:shadow-primary/30',
          warmth: 'hover:shadow-2xl hover:shadow-secondary/30',
          glass: 'hover:shadow-xl hover:shadow-foreground/10',
        }[variant]
      : ''

    return (
      <Comp
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          glowClasses,
          animated && 'hover:scale-105 active:scale-95',
          className
        )}
        ref={ref}
        {...props}
      >
        {/* Shimmer effect overlay */}
        {animated && (
          <div className="absolute inset-0 rounded-md opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000" />
          </div>
        )}
        <span className="relative z-10">{children}</span>
      </Comp>
    )
  }
)

GradientButton.displayName = 'GradientButton'

export { GradientButton }
