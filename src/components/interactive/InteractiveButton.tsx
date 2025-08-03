'use client'

import type { VariantProps } from 'class-variance-authority'
import { forwardRef } from 'react'
import { Button, type buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface InteractiveButtonProps
  extends React.ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  intensity?: 'subtle' | 'normal' | 'strong'
  effect?: 'scale' | 'lift' | 'glow' | 'pulse' | 'float'
}

const intensityClasses = {
  subtle: 'interactive-subtle',
  normal: '', // Default micro-interactions from btn-micro
  strong: 'interactive-strong',
}

const effectClasses = {
  scale: 'interactive-scale',
  lift: 'interactive-lift',
  glow: 'interactive-glow',
  pulse: 'interactive-pulse',
  float: 'interactive-float',
}

/**
 * InteractiveButton - Enhanced version of shadcn Button with customizable micro-interactions
 *
 * Wraps the shadcn Button component without modifying it, adding optional enhanced
 * micro-interactions that can be customized via props.
 *
 * @param intensity - Controls the strength of interactions (subtle | normal | strong)
 * @param effect - Adds specific interaction effects (scale | lift | glow | pulse | float)
 */
const InteractiveButton = forwardRef<HTMLButtonElement, InteractiveButtonProps>(
  ({ className, intensity = 'normal', effect, ...props }, ref) => {
    const interactiveClasses = cn(
      intensity !== 'normal' && intensityClasses[intensity],
      effect && effectClasses[effect],
      className
    )

    return <Button ref={ref} className={interactiveClasses} {...props} />
  }
)

InteractiveButton.displayName = 'InteractiveButton'

export { InteractiveButton }
