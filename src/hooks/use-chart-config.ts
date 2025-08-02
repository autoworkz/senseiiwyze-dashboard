"use client"

import { useTheme } from 'next-themes'
import { useMemo } from 'react'

// Chart color palette using our theme system
export const CHART_COLORS = {
  primary: 'hsl(var(--chart-1))',
  secondary: 'hsl(var(--chart-2))',
  accent: 'hsl(var(--chart-3))',
  success: 'hsl(var(--chart-4))',
  warning: 'hsl(var(--chart-5))',
  // Additional palette for more complex charts
  purple: '#8b5cf6',
  emerald: '#10b981',
  blue: '#3b82f6',
  rose: '#f43f5e',
  amber: '#f59e0b',
  cyan: '#06b6d4',
  orange: '#f97316',
  pink: '#ec4899'
} as const

export interface ChartConfig {
  colors: {
    grid: string
    text: string
    background: string
    border: string
  }
  tooltip: {
    backgroundColor: string
    border: string
    borderRadius: string
    fontSize: string
    boxShadow: string
    transition: string
    padding: string
  }
  animations: {
    duration: {
      fast: number
      medium: number
      slow: number
    }
    easing: string
  }
  accessibility: {
    ariaLabel: string
    role: string
  }
}

export function useChartConfig(): ChartConfig {
  const { theme, systemTheme } = useTheme()
  const activeTheme = theme === 'system' ? systemTheme : theme
  const isDark = activeTheme === 'dark'

  return useMemo(() => ({
    colors: {
      grid: isDark ? 'hsl(var(--border))' : 'hsl(var(--border))',
      text: isDark ? 'hsl(var(--muted-foreground))' : 'hsl(var(--muted-foreground))',
      background: isDark ? 'hsl(var(--card))' : 'hsl(var(--card))',
      border: isDark ? 'hsl(var(--border))' : 'hsl(var(--border))'
    },
    tooltip: {
      backgroundColor: isDark ? 'hsl(var(--popover))' : 'hsl(var(--popover))',
      border: `1px solid hsl(var(--border))`,
      borderRadius: '8px',
      fontSize: '12px',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      transition: 'all 200ms ease-out',
      padding: '8px 12px'
    },
    animations: {
      duration: {
        fast: 300,
        medium: 600,
        slow: 1000
      },
      easing: 'ease-out'
    },
    accessibility: {
      ariaLabel: 'Interactive chart',
      role: 'img'
    }
  }), [isDark])
}

// Hook for generating color palettes for multi-series charts
export function useChartColors(count: number = 1): string[] {
  const colors = Object.values(CHART_COLORS)
  return useMemo(() => {
    if (count <= colors.length) {
      return colors.slice(0, count)
    }
    // Generate additional colors by cycling through the palette
    const result: string[] = []
    for (let i = 0; i < count; i++) {
      result.push(colors[i % colors.length])
    }
    return result
  }, [count, colors])
}

// Hook for responsive chart dimensions
export function useChartDimensions(size: 'sm' | 'md' | 'lg' | 'xl' = 'md') {
  return useMemo(() => {
    const dimensions = {
      sm: { height: 200, margin: { top: 10, right: 10, bottom: 20, left: 0 } },
      md: { height: 300, margin: { top: 20, right: 20, bottom: 40, left: 0 } },
      lg: { height: 400, margin: { top: 30, right: 30, bottom: 60, left: 20 } },
      xl: { height: 500, margin: { top: 40, right: 40, bottom: 80, left: 40 } }
    }
    return dimensions[size]
  }, [size])
}