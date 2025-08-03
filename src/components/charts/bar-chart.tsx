"use client"

import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts'
import { useChartConfig, useChartColors, CHART_COLORS } from '@/hooks/use-chart-config'
import { ChartContainer } from './chart-container'

export interface BarChartDataPoint {
  [key: string]: string | number
}

export interface BarConfig {
  dataKey: string
  name?: string
  color?: string
  radius?: [number, number, number, number]
  stackId?: string
}

interface BarChartProps {
  data: BarChartDataPoint[]
  bars: BarConfig[] | number
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
  layout?: 'horizontal' | 'vertical'
  referenceLines?: Array<{
    y?: number
    x?: string | number
    label?: string
    color?: string
  }>
  action?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export function BarChart({
  data,
  bars,
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
  layout = 'vertical',
  referenceLines = [],
  action,
  size = 'md'
}: BarChartProps) {
  const config = useChartConfig()
  const barCount = typeof bars === 'number' ? bars : bars.length
  const colors = useChartColors(barCount)

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
      <RechartsBarChart
        data={data}
        margin={margins}
        layout={layout}
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
            dataKey={layout === 'vertical' ? xAxisKey : undefined}
            type={layout === 'vertical' ? 'category' : 'number'}
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
            dataKey={layout === 'horizontal' ? xAxisKey : undefined}
            type={layout === 'horizontal' ? 'category' : 'number'}
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

        {/* Data bars */}
        {typeof bars === 'number' ? (
          // Generate bars based on data keys when bars is a number
          Array.from({ length: bars }, (_, index) => {
            const dataKeys = Object.keys(data[0] || {}).filter(key => key !== xAxisKey)
            const dataKey = dataKeys[index] || `value${index + 1}`
            return (
              <Bar
                key={dataKey}
                dataKey={dataKey}
                name={dataKey}
                fill={colors[index]}
                radius={[4, 4, 0, 0]}
                animationDuration={config.animations.duration.slow + index * 100}
              />
            )
          })
        ) : (
          bars.map((barConfig, index) => (
            <Bar
              key={barConfig.dataKey}
              dataKey={barConfig.dataKey}
              name={barConfig.name}
              fill={barConfig.color || colors[index]}
              radius={barConfig.radius || [4, 4, 0, 0]}
              stackId={barConfig.stackId}
              animationDuration={config.animations.duration.slow + index * 100}
            />
          ))
        )}
      </RechartsBarChart>
    </ChartContainer>
  )
}

// Preset configurations for common use cases
export const BAR_CHART_PRESETS = {
  simple: {
    showGrid: true,
    showXAxis: true,
    showYAxis: false,
    showTooltip: true,
    showLegend: false,
    size: 'sm' as const,
    layout: 'vertical' as const
  },
  horizontal: {
    showGrid: true,
    showXAxis: false,
    showYAxis: true,
    showTooltip: true,
    showLegend: false,
    size: 'md' as const,
    layout: 'horizontal' as const
  },
  stacked: {
    showGrid: true,
    showXAxis: true,
    showYAxis: true,
    showTooltip: true,
    showLegend: true,
    size: 'lg' as const,
    layout: 'vertical' as const
  }
} as const