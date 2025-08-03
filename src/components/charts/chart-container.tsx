"use client"

import * as React from 'react'
import { ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ChartContainerProps {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
  height?: number | string
  showCard?: boolean
  action?: React.ReactNode
}

export function ChartContainer({
  title,
  description,
  children,
  className,
  height = 300,
  showCard = true,
  action
}: ChartContainerProps) {
  const chartContent = (
    <div 
      className={cn("w-full", className)} 
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
    >
      <ResponsiveContainer width="100%" height="100%">
        {children as React.ReactElement}
      </ResponsiveContainer>
    </div>
  )

  if (!showCard) {
    return chartContent
  }

  return (
    <Card>
      {(title || description || action) && (
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            {title && <CardTitle className="text-base font-medium">{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {action && <div className="flex items-center space-x-2">{action}</div>}
        </CardHeader>
      )}
      <CardContent className="pt-0">
        {chartContent}
      </CardContent>
    </Card>
  )
}

// Mini chart container for dashboard cards
export function MiniChartContainer({
  children,
  className,
  height = 100
}: {
  children: React.ReactNode
  className?: string
  height?: number
}) {
  return (
    <div 
      className={cn("w-full", className)} 
      style={{ height: `${height}px` }}
    >
      <ResponsiveContainer width="100%" height="100%">
        {children as React.ReactElement}
      </ResponsiveContainer>
    </div>
  )
}