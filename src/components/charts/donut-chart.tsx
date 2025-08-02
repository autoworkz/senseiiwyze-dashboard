"use client"

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useChartConfig, useChartColors } from '@/hooks/use-chart-config'
import { ChartContainer } from './chart-container'
import { cn } from '@/lib/utils'

export interface DonutChartDataPoint {
  name: string
  value: number
  color?: string
}

interface DonutChartProps {
  data: DonutChartDataPoint[] | number
  title?: string
  description?: string
  className?: string
  height?: number
  showCard?: boolean
  showTooltip?: boolean
  showLegend?: boolean
  showLabels?: boolean
  showValues?: boolean
  innerRadius?: number
  outerRadius?: number
  startAngle?: number
  endAngle?: number
  centerContent?: React.ReactNode
  action?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export function DonutChart({
  data,
  title,
  description,
  className,
  height,
  showCard = true,
  showTooltip = true,
  showLegend = false,
  showLabels = false,
  showValues = false,
  innerRadius,
  outerRadius,
  startAngle = 90,
  endAngle = -270,
  centerContent,
  action,
  size = 'md'
}: DonutChartProps) {
  const config = useChartConfig()
  const colors = useChartColors(data.length)

  // Determine dimensions based on size
  const chartHeight = height || (size === 'sm' ? 200 : size === 'lg' ? 400 : 300)
  const radius = size === 'sm' ? { inner: 30, outer: 70 } 
    : size === 'lg' ? { inner: 80, outer: 140 }
    : { inner: 50, outer: 100 }

  const finalInnerRadius = innerRadius ?? radius.inner
  const finalOuterRadius = outerRadius ?? radius.outer

  // Custom label function
  const renderLabel = (entry: DonutChartDataPoint) => {
    if (showLabels && showValues) {
      return `${entry.name}: ${entry.value}`
    }
    if (showLabels) {
      return entry.name
    }
    if (showValues) {
      return entry.value.toString()
    }
    return ''
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      return (
        <div 
          className="rounded-lg border bg-background p-3 shadow-lg"
          style={config.tooltip}
        >
          <div className="flex items-center gap-2">
            <div 
              className="h-3 w-3 rounded-full" 
              style={{ backgroundColor: data.color }}
            />
            <span className="font-medium">{data.name}</span>
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            Value: {data.value}
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <ChartContainer
      title={title}
      description={description}
      height={chartHeight}
      showCard={showCard}
      className={className}
      action={action}
    >
      <div className="relative w-full h-full">
        <PieChart
          width={400}
          height={400}
          role={config.accessibility.role}
          aria-label={config.accessibility.ariaLabel}
        >
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={showLabels || showValues ? renderLabel : false}
            outerRadius={finalOuterRadius}
            innerRadius={finalInnerRadius}
            fill="#8884d8"
            dataKey="value"
            startAngle={startAngle}
            endAngle={endAngle}
            animationDuration={config.animations.duration.slow}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color || colors[index]}
              />
            ))}
          </Pie>
          
          {showTooltip && (
            <Tooltip 
              content={<CustomTooltip />}
              animationDuration={config.animations.duration.fast}
            />
          )}
          
          {showLegend && (
            <Legend
              wrapperStyle={{
                fontSize: size === 'sm' ? '10px' : '12px',
                color: config.colors.text
              }}
            />
          )}
        </PieChart>

        {/* Center content for donut charts */}
        {centerContent && finalInnerRadius > 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              {centerContent}
            </div>
          </div>
        )}
      </div>
    </ChartContainer>
  )
}

// Helper component for center content
export function DonutCenterContent({
  value,
  label,
  className
}: {
  value: string | number
  label?: string
  className?: string
}) {
  return (
    <div className={cn("text-center", className)}>
      <div className="text-2xl font-bold text-foreground">
        {value}
      </div>
      {label && (
        <div className="text-sm text-muted-foreground">
          {label}
        </div>
      )}
    </div>
  )
}

// Preset configurations
export const DONUT_CHART_PRESETS = {
  simple: {
    showTooltip: true,
    showLegend: false,
    showLabels: false,
    showValues: false,
    size: 'sm' as const
  },
  detailed: {
    showTooltip: true,
    showLegend: true,
    showLabels: false,
    showValues: false,
    size: 'lg' as const
  },
  minimal: {
    showTooltip: true,
    showLegend: false,
    showLabels: false,
    showValues: false,
    showCard: false,
    size: 'sm' as const
  }
} as const