"use client"

import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts'
import { useChartConfig, useChartColors, CHART_COLORS } from '@/hooks/use-chart-config'
import { ChartContainer } from './chart-container'
import { cn } from '@/lib/utils'

export interface LineChartDataPoint {
  [key: string]: string | number
}

export interface LineConfig {
  dataKey: string
  name?: string
  color?: string
  strokeWidth?: number
  strokeDasharray?: string
  dot?: boolean | object
  connectNulls?: boolean
}

interface LineChartProps {
  data: LineChartDataPoint[]
  lines: LineConfig[] | number
  xAxisKey: string
  title?: string
  description?: string
  className?: string
  height?: number
  showCard?: boolean
  showGrid?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
  showLegend?: boolean
  showTooltip?: boolean
  xAxisLabel?: string
  yAxisLabel?: string
  yAxisDomain?: [number | 'auto', number | 'auto']
  referenceLines?: Array<{
    y?: number
    x?: string | number
    label?: string
    color?: string
  }>
  action?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export function LineChart({
  data,
  lines,
  xAxisKey,
  title,
  description,
  className,
  height,
  showCard = true,
  showGrid = true,
  showXAxis = true,
  showYAxis = false,
  showLegend = false,
  showTooltip = true,
  xAxisLabel,
  yAxisLabel,
  yAxisDomain,
  referenceLines = [],
  action,
  size = 'md'
}: LineChartProps) {
  const config = useChartConfig()
  const colors = useChartColors(lines.length)

  // Determine height based on size if not provided
  const chartHeight = height || (size === 'sm' ? 200 : size === 'lg' ? 400 : 300)
  const margins = size === 'sm' 
    ? { top: 10, right: 10, bottom: 20, left: 0 }
    : size === 'lg'
    ? { top: 30, right: 30, bottom: 60, left: 20 }
    : { top: 20, right: 20, bottom: 40, left: 0 }

  return (
    <ChartContainer
      title={title}
      description={description}
      height={chartHeight}
      showCard={showCard}
      className={className}
      action={action}
    >
      <RechartsLineChart
        data={data}
        margin={margins}
        role={config.accessibility.role}
        aria-label={config.accessibility.ariaLabel}
      >
        {showGrid && (
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={config.colors.grid}
            strokeOpacity={0.3}
          />
        )}
        
        {showXAxis && (
          <XAxis
            dataKey={xAxisKey}
            tick={{ 
              fontSize: size === 'sm' ? 10 : 12, 
              fill: config.colors.text 
            }}
            axisLine={{ stroke: config.colors.border }}
            tickLine={{ stroke: config.colors.border }}
            label={xAxisLabel ? { 
              value: xAxisLabel, 
              position: 'insideBottom', 
              offset: -10 
            } : undefined}
          />
        )}
        
        {showYAxis && (
          <YAxis
            tick={{ 
              fontSize: size === 'sm' ? 10 : 12, 
              fill: config.colors.text 
            }}
            axisLine={{ stroke: config.colors.border }}
            tickLine={{ stroke: config.colors.border }}
            domain={yAxisDomain}
            label={yAxisLabel ? { 
              value: yAxisLabel, 
              angle: -90, 
              position: 'insideLeft' 
            } : undefined}
          />
        )}

        {showTooltip && (
          <Tooltip
            contentStyle={config.tooltip}
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

        {/* Reference lines */}
        {referenceLines.map((refLine, index) => (
          <ReferenceLine
            key={index}
            {...refLine}
            stroke={refLine.color || config.colors.text}
            strokeDasharray="2 2"
            strokeOpacity={0.6}
          />
        ))}

        {/* Data lines */}
        {lines.map((lineConfig, index) => (
          <Line
            key={lineConfig.dataKey}
            type="monotone"
            dataKey={lineConfig.dataKey}
            name={lineConfig.name}
            stroke={lineConfig.color || colors[index]}
            strokeWidth={lineConfig.strokeWidth || 2}
            strokeDasharray={lineConfig.strokeDasharray}
            dot={lineConfig.dot || false}
            connectNulls={lineConfig.connectNulls}
            animationDuration={config.animations.duration.slow + index * 200}
            activeDot={{
              r: size === 'sm' ? 3 : 4,
              fill: lineConfig.color || colors[index],
              strokeWidth: 2,
              stroke: config.colors.background
            }}
          />
        ))}
      </RechartsLineChart>
    </ChartContainer>
  )
}

// Preset configurations for common use cases
export const LINE_CHART_PRESETS = {
  analytics: {
    showGrid: true,
    showXAxis: true,
    showYAxis: false,
    showTooltip: true,
    showLegend: false,
    size: 'sm' as const
  },
  dashboard: {
    showGrid: false,
    showXAxis: true,
    showYAxis: false,
    showTooltip: true,
    showLegend: false,
    size: 'sm' as const
  },
  detailed: {
    showGrid: true,
    showXAxis: true,
    showYAxis: true,
    showTooltip: true,
    showLegend: true,
    size: 'lg' as const
  }
} as const