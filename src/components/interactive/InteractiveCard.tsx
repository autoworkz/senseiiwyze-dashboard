'use client'

import { forwardRef } from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface InteractiveCardProps extends React.ComponentProps<'div'> {
  intensity?: 'subtle' | 'normal' | 'strong'
  effect?: 'lift' | 'scale' | 'glow' | 'float'
  clickable?: boolean
}

const intensityClasses = {
  subtle: 'interactive-subtle',
  normal: '', // Default micro-interactions from card-micro
  strong: 'interactive-strong',
}

const effectClasses = {
  lift: 'interactive-lift',
  scale: 'interactive-scale',
  glow: 'interactive-glow',
  float: 'interactive-float',
}

/**
 * InteractiveCard - Enhanced version of shadcn Card with customizable micro-interactions
 *
 * Wraps the shadcn Card component without modifying it, adding optional enhanced
 * micro-interactions that can be customized via props.
 *
 * @param intensity - Controls the strength of interactions (subtle | normal | strong)
 * @param effect - Adds specific interaction effects (lift | scale | glow | float)
 * @param clickable - Adds cursor pointer and enhanced interaction feedback
 */
const InteractiveCard = forwardRef<HTMLDivElement, InteractiveCardProps>(
  ({ className, intensity = 'normal', effect, clickable = false, ...props }, ref) => {
    const interactiveClasses = cn(
      intensity !== 'normal' && intensityClasses[intensity],
      effect && effectClasses[effect],
      clickable && 'cursor-pointer interactive-clickable',
      className
    )

    return <Card ref={ref} className={interactiveClasses} {...props} />
  }
)

InteractiveCard.displayName = 'InteractiveCard'

// Re-export all card sub-components for convenience
const InteractiveCardHeader = CardHeader
const InteractiveCardFooter = CardFooter
const InteractiveCardTitle = CardTitle
const InteractiveCardAction = CardAction
const InteractiveCardDescription = CardDescription
const InteractiveCardContent = CardContent

export {
  InteractiveCard,
  InteractiveCardHeader,
  InteractiveCardFooter,
  InteractiveCardTitle,
  InteractiveCardAction,
  InteractiveCardDescription,
  InteractiveCardContent,
}
