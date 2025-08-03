'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'

export interface UseInteractiveOptions {
  /** Component type for appropriate default interactions */
  type?: 'button' | 'card' | 'input' | 'generic'
  /** Controls the strength of interactions */
  intensity?: 'subtle' | 'normal' | 'strong'
  /** Adds specific interaction effects */
  effect?: 'scale' | 'lift' | 'glow' | 'pulse' | 'float' | 'focus-ring'
  /** Additional className to merge */
  className?: string
  /** Disable all interactions (respects prefers-reduced-motion automatically) */
  disabled?: boolean
  /** Make element clickable with enhanced feedback */
  clickable?: boolean
}

export interface UseInteractiveReturn {
  /** Combined className with all interaction classes */
  className: string
  /** Props to spread onto the component (currently empty, future extensibility) */
  [key: string]: any
}

const baseClasses = {
  button: 'btn-micro',
  card: 'card-micro',
  input: 'input-micro',
  generic: 'interactive-base',
}

const intensityClasses = {
  subtle: 'interactive-subtle',
  normal: '',
  strong: 'interactive-strong',
}

const effectClasses = {
  scale: 'interactive-scale',
  lift: 'interactive-lift',
  glow: 'interactive-glow',
  pulse: 'interactive-pulse',
  float: 'interactive-float',
  'focus-ring': 'interactive-focus-ring',
}

/**
 * useInteractive - React hook for adding micro-interactions to any component
 *
 * Returns className and props that can be spread onto any element to add
 * consistent micro-interactions. Automatically respects prefers-reduced-motion.
 *
 * @example
 * ```tsx
 * // Basic usage
 * const { className, ...props } = useInteractive({ type: 'button' })
 * return <Button className={className} {...props}>Click me</Button>
 *
 * // With custom effects
 * const { className } = useInteractive({
 *   type: 'card',
 *   effect: 'lift',
 *   intensity: 'strong'
 * })
 * return <div className={className}>Interactive card</div>
 * ```
 */
export function useInteractive(options: UseInteractiveOptions = {}): UseInteractiveReturn {
  const {
    type = 'generic',
    intensity = 'normal',
    effect,
    className: customClassName,
    disabled = false,
    clickable = false,
  } = options

  const className = useMemo(() => {
    if (disabled) {
      return cn(customClassName)
    }

    return cn(
      // Base interaction class for the component type
      baseClasses[type],
      // Intensity variation
      intensity !== 'normal' && intensityClasses[intensity],
      // Specific effect
      effect && effectClasses[effect],
      // Clickable enhancement
      clickable && 'cursor-pointer interactive-clickable',
      // User's custom classes
      customClassName
    )
  }, [type, intensity, effect, customClassName, disabled, clickable])

  return {
    className,
    // Future: Could add event handlers, data attributes, etc.
    // onMouseEnter: handleMouseEnter,
    // onMouseLeave: handleMouseLeave,
    // 'data-interactive': true,
  }
}
