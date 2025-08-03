'use client'

import { forwardRef } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export interface InteractiveInputProps extends React.ComponentProps<'input'> {
  intensity?: 'subtle' | 'normal' | 'strong'
  effect?: 'glow' | 'lift' | 'scale' | 'focus-ring'
}

const intensityClasses = {
  subtle: 'interactive-subtle',
  normal: '', // Default micro-interactions from input-micro
  strong: 'interactive-strong',
}

const effectClasses = {
  glow: 'interactive-glow',
  lift: 'interactive-lift',
  scale: 'interactive-scale',
  'focus-ring': 'interactive-focus-ring',
}

/**
 * InteractiveInput - Enhanced version of shadcn Input with customizable micro-interactions
 *
 * Wraps the shadcn Input component without modifying it, adding optional enhanced
 * micro-interactions that can be customized via props.
 *
 * @param intensity - Controls the strength of interactions (subtle | normal | strong)
 * @param effect - Adds specific interaction effects (glow | lift | scale | focus-ring)
 */
const InteractiveInput = forwardRef<HTMLInputElement, InteractiveInputProps>(
  ({ className, intensity = 'normal', effect, ...props }, ref) => {
    const interactiveClasses = cn(
      intensity !== 'normal' && intensityClasses[intensity],
      effect && effectClasses[effect],
      className
    )

    return <Input ref={ref} className={interactiveClasses} {...props} />
  }
)

InteractiveInput.displayName = 'InteractiveInput'

export { InteractiveInput }
