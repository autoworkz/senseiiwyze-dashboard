'use client'

import { forwardRef, type HTMLAttributes, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface BlobAnimationProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'multi'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  intensity?: 'subtle' | 'medium' | 'strong'
  speed?: 'slow' | 'medium' | 'fast'
  blur?: boolean
  respectMotion?: boolean
}

/**
 * BlobAnimation component creates fluid, animated blob backgrounds
 * Perfect for adding organic movement to your UI
 */
const BlobAnimation = forwardRef<HTMLDivElement, BlobAnimationProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      intensity = 'medium',
      speed = 'medium',
      blur = true,
      respectMotion = true,
      ...props
    },
    ref
  ) => {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

    useEffect(() => {
      if (respectMotion) {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
        setPrefersReducedMotion(mediaQuery.matches)

        const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
        mediaQuery.addEventListener('change', handler)
        return () => mediaQuery.removeEventListener('change', handler)
      }
    }, [respectMotion])

    const sizeClasses = {
      sm: 'w-32 h-32',
      md: 'w-64 h-64',
      lg: 'w-96 h-96',
      xl: 'w-[32rem] h-[32rem]',
    }

    const intensityClasses = {
      subtle: 'opacity-30',
      medium: 'opacity-50',
      strong: 'opacity-70',
    }

    const speedClasses = {
      slow: 'duration-[20s]',
      medium: 'duration-[15s]',
      fast: 'duration-[10s]',
    }

    const variantClasses = {
      primary: 'bg-gradient-to-br from-primary/40 via-primary/20 to-primary/60',
      secondary: 'bg-gradient-to-br from-secondary/40 via-secondary/20 to-secondary/60',
      accent: 'bg-gradient-to-br from-accent/40 via-accent/20 to-accent/60',
      multi: 'bg-gradient-to-br from-primary/30 via-secondary/30 to-accent/30',
    }

    // Don't animate if user prefers reduced motion
    const shouldAnimate = !prefersReducedMotion

    return (
      <div
        ref={ref}
        className={cn(
          'absolute rounded-full',
          sizeClasses[size],
          intensityClasses[intensity],
          variantClasses[variant],
          blur && 'blur-xl',
          shouldAnimate && [
            'animate-pulse',
            speedClasses[speed],
            'motion-safe:animate-[blob_15s_ease-in-out_infinite]',
          ],
          className
        )}
        {...props}
        style={{
          animation: shouldAnimate
            ? `blob ${speed === 'slow' ? '20s' : speed === 'fast' ? '10s' : '15s'} ease-in-out infinite`
            : 'none',
        }}
      />
    )
  }
)

BlobAnimation.displayName = 'BlobAnimation'

export { BlobAnimation }
