'use client'

import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface GridPatternProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'dots' | 'lines' | 'squares' | 'hexagon'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  intensity?: 'subtle' | 'medium' | 'visible'
  animated?: boolean
  fadeEdges?: boolean
}

/**
 * GridPattern component for adding subtle geometric patterns to backgrounds
 * Perfect for adding depth and texture without overwhelming content
 */
const GridPattern = forwardRef<HTMLDivElement, GridPatternProps>(
  (
    {
      className,
      variant = 'dots',
      size = 'md',
      intensity = 'subtle',
      animated = false,
      fadeEdges = true,
      ...props
    },
    ref
  ) => {
    const sizeMap = {
      sm: { spacing: '20px', strokeWidth: '0.5' },
      md: { spacing: '30px', strokeWidth: '0.75' },
      lg: { spacing: '40px', strokeWidth: '1' },
      xl: { spacing: '60px', strokeWidth: '1.25' },
    }

    const intensityMap = {
      subtle: 'opacity-20',
      medium: 'opacity-30',
      visible: 'opacity-40',
    }

    const { spacing, strokeWidth } = sizeMap[size]

    const patterns = {
      dots: (
        <svg width={spacing} height={spacing} className="fill-current">
          <circle cx="2" cy="2" r="1" />
        </svg>
      ),
      lines: (
        <svg width={spacing} height={spacing} className="stroke-current" fill="none">
          <path d={`M0 0L${spacing} 0M0 0L0 ${spacing}`} strokeWidth={strokeWidth} />
        </svg>
      ),
      squares: (
        <svg width={spacing} height={spacing} className="stroke-current" fill="none">
          <rect x="0" y="0" width={spacing} height={spacing} strokeWidth={strokeWidth} />
        </svg>
      ),
      hexagon: (
        <svg width={spacing} height={spacing} className="stroke-current" fill="none">
          <polygon
            points={`${parseInt(spacing) / 4},${parseInt(spacing) / 8} ${(parseInt(spacing) * 3) / 4},${parseInt(spacing) / 8} ${parseInt(spacing)},${parseInt(spacing) / 2} ${(parseInt(spacing) * 3) / 4},${(parseInt(spacing) * 7) / 8} ${parseInt(spacing) / 4},${(parseInt(spacing) * 7) / 8} 0,${parseInt(spacing) / 2}`}
            strokeWidth={strokeWidth}
          />
        </svg>
      ),
    }

    return (
      <div
        ref={ref}
        className={cn(
          'absolute inset-0 pointer-events-none select-none',
          'text-foreground',
          intensityMap[intensity],
          animated && 'motion-safe:animate-pulse',
          fadeEdges && 'mask-gradient-to-center',
          className
        )}
        style={{
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" width="${spacing}" height="${spacing}" viewBox="0 0 ${spacing} ${spacing}">${patterns[variant].props.children || patterns[variant]}</svg>`
          )}")`,
          backgroundSize: spacing,
          backgroundRepeat: 'repeat',
        }}
        {...props}
      />
    )
  }
)

GridPattern.displayName = 'GridPattern'

export { GridPattern }
