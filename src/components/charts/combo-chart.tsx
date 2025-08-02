"use client"

import { ComposedChart, Bar, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts'
import { useChartConfig, useChartColors } from '@/hooks/use-chart-config'
import { ChartContainer } from './chart-container'

export interface ComboChartDataPoint {
  [key: string]: string | number
}

export interface ComboSeriesConfig {
  type: 'bar' | 'line' | 'area'
  dataKey: string
  name?: string
  color?: string
  yAxisId?: 'left' | 'right'
  // Bar specific
  radius?: [number, number, number, number]
  stackId?: string
  // Line specific
  strokeWidth?: number
  strokeDasharray?: string
  dot?: boolean | object
  // Area specific
  fillOpacity?: number
  connectNulls?: boolean
}

interface ComboChartProps {
  data: ComboChartDataPoint[]
  series: ComboSeriesConfig[] | number
  xAxisKey: string
  title?: string
  description?: string
  className?: string
  height?: number
  showCard?: boolean
  showGrid?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
  showRightYAxis?: boolean
  showLegend?: boolean
  showTooltip?: boolean
  xAxisLabel?: string
  leftYAxisLabel?: string
  rightYAxisLabel?: string
  leftYAxisDomain?: [number | 'auto', number | 'auto']
  rightYAxisDomain?: [number | 'auto', number | 'auto']
  referenceLines?: Array<{
    y?: number
    x?: string | number
    label?: string
    color?: string
    yAxisId?: 'left' | 'right'
  }>
  action?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export function ComboChart({
  data,
  series,
  xAxisKey,
  title,
  description,
  className,
  height,
  showCard = true,
  showGrid = true,
  showXAxis = true,
  showYAxis = false,
  showRightYAxis = false,
  showLegend = false,
  showTooltip = true,
  xAxisLabel,
  leftYAxisLabel,
  rightYAxisLabel,
  leftYAxisDomain,
  rightYAxisDomain,
  referenceLines = [],
  action,
  size = 'md'
}: ComboChartProps) {
  const config = useChartConfig()
  const colors = useChartColors(series.length)

  // Determine height based on size if not provided
  const chartHeight = height || (size === 'sm' ? 200 : size === 'lg' ? 400 : 300)
  const margins = size === 'sm' 
    ? { top: 10, right: 10, bottom: 20, left: 0 }
    : size === 'lg'
    ? { top: 30, right: 30, bottom: 60, left: 20 }
    : { top: 20, right: 20, bottom: 40, left: 0 }

  // Separate series by type for rendering
  const barSeries = series.filter(s => s.type === 'bar')
  const lineSeries = series.filter(s => s.type === 'line')
  const areaSeries = series.filter(s => s.type === 'area')

  return (
    <ChartContainer
      title={title}
      description={description}
      height={chartHeight}
      showCard={showCard}
      className={className}
      action={action}
    >
      <ComposedChart
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
            yAxisId="left"
            tick={{ 
              fontSize: size === 'sm' ? 10 : 12, 
              fill: config.colors.text 
            }}
            axisLine={{ stroke: config.colors.border }}
            tickLine={{ stroke: config.colors.border }}
            domain={leftYAxisDomain}
            label={leftYAxisLabel ? { 
              value: leftYAxisLabel, 
              angle: -90, 
              position: 'insideLeft' 
            } : undefined}
          />
        )}
        
        {showRightYAxis && (
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ 
              fontSize: size === 'sm' ? 10 : 12, 
              fill: config.colors.text 
            }}
            axisLine={{ stroke: config.colors.border }}
            tickLine={{ stroke: config.colors.border }}
            domain={rightYAxisDomain}
            label={rightYAxisLabel ? { 
              value: rightYAxisLabel, 
              angle: 90, 
              position: 'insideRight' 
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
            yAxisId={refLine.yAxisId || 'left'}
          />
        ))}

        {/* Area series (render first, behind other elements) */}
        {areaSeries.map((seriesConfig, index) => {
          const seriesIndex = series.findIndex(s => s === seriesConfig)
          return (
            <Area
              key={`area-${seriesConfig.dataKey}`}
              type="monotone"
              dataKey={seriesConfig.dataKey}
              name={seriesConfig.name}
              stroke={seriesConfig.color || colors[seriesIndex]}
              fill={seriesConfig.color || colors[seriesIndex]}
              fillOpacity={seriesConfig.fillOpacity || 0.1}
              connectNulls={seriesConfig.connectNulls}
              yAxisId={seriesConfig.yAxisId || 'left'}
              animationDuration={config.animations.duration.slow + index * 200}
            />
          )
        })}

        {/* Bar series */}
        {barSeries.map((seriesConfig, index) => {
          const seriesIndex = series.findIndex(s => s === seriesConfig)
          return (
            <Bar
              key={`bar-${seriesConfig.dataKey}`}
              dataKey={seriesConfig.dataKey}
              name={seriesConfig.name}
              fill={seriesConfig.color || colors[seriesIndex]}
              radius={seriesConfig.radius || [4, 4, 0, 0]}
              stackId={seriesConfig.stackId}
              yAxisId={seriesConfig.yAxisId || 'left'}
              animationDuration={config.animations.duration.slow + index * 100}
            />
          )
        })}

        {/* Line series (render last, on top) */}
        {lineSeries.map((seriesConfig, index) => {
          const seriesIndex = series.findIndex(s => s === seriesConfig)
          return (
            <Line
              key={`line-${seriesConfig.dataKey}`}
              type="monotone"
              dataKey={seriesConfig.dataKey}
              name={seriesConfig.name}
              stroke={seriesConfig.color || colors[seriesIndex]}
              strokeWidth={seriesConfig.strokeWidth || 2}
              strokeDasharray={seriesConfig.strokeDasharray}
              dot={seriesConfig.dot || false}
              connectNulls={seriesConfig.connectNulls}
              yAxisId={seriesConfig.yAxisId || 'left'}
              animationDuration={config.animations.duration.slow + index * 200}
              activeDot={{
                r: size === 'sm' ? 3 : 4,
                fill: seriesConfig.color || colors[seriesIndex],
                strokeWidth: 2,
                stroke: config.colors.background
              }}
            />
          )
        })}
      </ComposedChart>
    </ChartContainer>
  )
}

// Preset configurations for common use cases
export const COMBO_CHART_PRESETS = {
  barAndLine: {
    showGrid: true,
    showXAxis: true,
    showYAxis: true,
    showRightYAxis: false,
    showTooltip: true,
    showLegend: true,
    size: 'md' as const
  },
  dualAxis: {
    showGrid: true,
    showXAxis: true,
    showYAxis: true,
    showRightYAxis: true,
    showTooltip: true,
    showLegend: true,
    size: 'lg' as const
  },
  areaAndLine: {
    showGrid: true,
    showXAxis: true,
    showYAxis: false,
    showRightYAxis: false,
    showTooltip: true,
    showLegend: false,
    size: 'md' as const
  }
} as const