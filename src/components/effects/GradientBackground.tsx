'use client'

import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface GradientBackgroundProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'astral' | 'neural' | 'warmth' | 'cosmic' | 'aurora' | 'mesh'
  intensity?: 'subtle' | 'medium' | 'vibrant'
  direction?: 'radial' | 'linear' | 'conic'
  overlay?: boolean
  children?: React.ReactNode
}

/**
 * GradientBackground component for creating full-page gradient backgrounds
 * Inspired by modern web design with sophisticated color transitions
 */
const GradientBackground = forwardRef<HTMLDivElement, GradientBackgroundProps>(
  (
    {
      className,
      variant = 'astral',
      intensity = 'medium',
      direction = 'radial',
      overlay = false,
      children,
      ...props
    },
    ref
  ) => {
    const intensityMap = {
      subtle: { opacity: '0.3', blur: 'blur-3xl' },
      medium: { opacity: '0.5', blur: 'blur-2xl' },
      vibrant: { opacity: '0.7', blur: 'blur-xl' },
    }

    const { opacity, blur } = intensityMap[intensity]

    const gradientVariants = {
      astral: {
        radial: `
          radial-gradient(circle at 20% 80%, oklch(var(--primary) / ${opacity}) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, oklch(var(--secondary) / ${opacity}) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, oklch(var(--accent) / ${opacity}) 0%, transparent 50%)
        `,
        linear: `linear-gradient(135deg, oklch(var(--primary) / ${opacity}), oklch(var(--secondary) / ${opacity}), oklch(var(--accent) / ${opacity}))`,
        conic: `conic-gradient(from 0deg at 50% 50%, oklch(var(--primary) / ${opacity}), oklch(var(--secondary) / ${opacity}), oklch(var(--accent) / ${opacity}), oklch(var(--primary) / ${opacity}))`,
      },
      neural: {
        radial: `
          radial-gradient(circle at 10% 20%, oklch(var(--primary) / ${opacity}) 0%, transparent 50%),
          radial-gradient(circle at 90% 80%, oklch(var(--accent) / ${opacity}) 0%, transparent 50%)
        `,
        linear: `linear-gradient(225deg, oklch(var(--primary) / ${opacity}), oklch(var(--accent) / ${opacity}))`,
        conic: `conic-gradient(from 45deg at 50% 50%, oklch(var(--primary) / ${opacity}), oklch(var(--accent) / ${opacity}), oklch(var(--primary) / ${opacity}))`,
      },
      warmth: {
        radial: `
          radial-gradient(circle at 30% 70%, oklch(var(--secondary) / ${opacity}) 0%, transparent 60%),
          radial-gradient(circle at 70% 30%, oklch(var(--chart-5) / ${opacity}) 0%, transparent 60%)
        `,
        linear: `linear-gradient(45deg, oklch(var(--secondary) / ${opacity}), oklch(var(--chart-5) / ${opacity}))`,
        conic: `conic-gradient(from 90deg at 50% 50%, oklch(var(--secondary) / ${opacity}), oklch(var(--chart-5) / ${opacity}), oklch(var(--secondary) / ${opacity}))`,
      },
      cosmic: {
        radial: `
          radial-gradient(ellipse at top left, oklch(var(--accent) / ${opacity}) 0%, transparent 50%),
          radial-gradient(ellipse at top right, oklch(var(--primary) / ${opacity}) 0%, transparent 50%),
          radial-gradient(ellipse at bottom center, oklch(var(--secondary) / ${opacity}) 0%, transparent 50%)
        `,
        linear: `linear-gradient(0deg, oklch(var(--secondary) / ${opacity}), oklch(var(--primary) / ${opacity}), oklch(var(--accent) / ${opacity}))`,
        conic: `conic-gradient(from 180deg at 50% 50%, oklch(var(--secondary) / ${opacity}), oklch(var(--primary) / ${opacity}), oklch(var(--accent) / ${opacity}), oklch(var(--secondary) / ${opacity}))`,
      },
      aurora: {
        radial: `
          radial-gradient(circle at 0% 50%, oklch(var(--chart-2) / ${opacity}) 0%, transparent 50%),
          radial-gradient(circle at 100% 50%, oklch(var(--chart-4) / ${opacity}) 0%, transparent 50%),
          radial-gradient(circle at 50% 100%, oklch(var(--chart-3) / ${opacity}) 0%, transparent 50%)
        `,
        linear: `linear-gradient(120deg, oklch(var(--chart-2) / ${opacity}), oklch(var(--chart-4) / ${opacity}), oklch(var(--chart-3) / ${opacity}))`,
        conic: `conic-gradient(from 270deg at 50% 50%, oklch(var(--chart-2) / ${opacity}), oklch(var(--chart-4) / ${opacity}), oklch(var(--chart-3) / ${opacity}), oklch(var(--chart-2) / ${opacity}))`,
      },
      mesh: {
        radial: `
          radial-gradient(circle at 25% 25%, oklch(var(--primary) / ${opacity}) 0%, transparent 50%),
          radial-gradient(circle at 75% 25%, oklch(var(--secondary) / ${opacity}) 0%, transparent 50%),
          radial-gradient(circle at 25% 75%, oklch(var(--accent) / ${opacity}) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, oklch(var(--chart-4) / ${opacity}) 0%, transparent 50%)
        `,
        linear: `linear-gradient(45deg, oklch(var(--primary) / ${opacity}), oklch(var(--secondary) / ${opacity}), oklch(var(--accent) / ${opacity}), oklch(var(--chart-4) / ${opacity}))`,
        conic: `conic-gradient(from 0deg at 50% 50%, oklch(var(--primary) / ${opacity}), oklch(var(--secondary) / ${opacity}), oklch(var(--accent) / ${opacity}), oklch(var(--chart-4) / ${opacity}), oklch(var(--primary) / ${opacity}))`,
      },
    }

    return (
      <div
        ref={ref}
        className={cn('fixed inset-0 pointer-events-none', blur, className)}
        style={{
          background: gradientVariants[variant][direction],
          zIndex: overlay ? 10 : -1,
        }}
        {...props}
      >
        {children}
      </div>
    )
  }
)

GradientBackground.displayName = 'GradientBackground'

export { GradientBackground }
