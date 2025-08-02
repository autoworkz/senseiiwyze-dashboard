"use client"

import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts'
import { useChartConfig, useChartColors } from '@/hooks/use-chart-config'
import { ChartContainer } from './chart-container'

export interface AreaChartDataPoint {
  [key: string]: string | number
}

export interface AreaConfig {
  dataKey: string
  name?: string
  color?: string
  strokeWidth?: number
  fillOpacity?: number
  stackId?: string
  connectNulls?: boolean
}

interface AreaChartProps {
  data: AreaChartDataPoint[]
  areas: AreaConfig[] | number
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

export function AreaChart({
  data,
  areas,
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
}: AreaChartProps) {
  const config = useChartConfig()
  const colors = useChartColors(areas.length)

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
      <RechartsAreaChart
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

        {/* Data areas */}
        {areas.map((areaConfig, index) => (
          <Area
            key={areaConfig.dataKey}
            type="monotone"
            dataKey={areaConfig.dataKey}
            name={areaConfig.name}
            stroke={areaConfig.color || colors[index]}
            fill={areaConfig.color || colors[index]}
            strokeWidth={areaConfig.strokeWidth || 2}
            fillOpacity={areaConfig.fillOpacity || 0.1}
            stackId={areaConfig.stackId}
            connectNulls={areaConfig.connectNulls}
            animationDuration={config.animations.duration.slow + index * 200}
          />
        ))}
      </RechartsAreaChart>
    </ChartContainer>
  )
}

// Preset configurations for common use cases
export const AREA_CHART_PRESETS = {
  simple: {
    showGrid: true,
    showXAxis: true,
    showYAxis: false,
    showTooltip: true,
    showLegend: false,
    size: 'sm' as const
  },
  stacked: {
    showGrid: true,
    showXAxis: true,
    showYAxis: true,
    showTooltip: true,
    showLegend: true,
    size: 'lg' as const
  },
  minimal: {
    showGrid: false,
    showXAxis: true,
    showYAxis: false,
    showTooltip: true,
    showLegend: false,
    showCard: false,
    size: 'sm' as const
  }
} as const