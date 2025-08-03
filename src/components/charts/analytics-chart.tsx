"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useTheme } from 'next-themes'

const data = [
  { name: 'Mon', readiness: 65, progress: 40 },
  { name: 'Tue', readiness: 68, progress: 45 },
  { name: 'Wed', readiness: 72, progress: 48 },
  { name: 'Thu', readiness: 74, progress: 52 },
  { name: 'Fri', readiness: 78, progress: 58 },
  { name: 'Sat', readiness: 82, progress: 62 },
  { name: 'Sun', readiness: 85, progress: 65 },
]

export function AnalyticsChart() {
  const { theme } = useTheme()
  const gridColor = theme === 'dark' ? '#374151' : '#e5e7eb'
  const textColor = theme === 'dark' ? '#9ca3af' : '#6b7280'
  
  return (
    <div className="h-[100px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={data} 
          margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12, fill: textColor }}
            axisLine={{ stroke: gridColor }}
          />
          <YAxis 
            hide 
            domain={[0, 100]}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
              border: `1px solid ${gridColor}`,
              borderRadius: '8px',
              fontSize: '12px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
              transition: 'all 200ms ease-out',
              padding: '8px 12px'
            }}
            animationDuration={200}
            animationEasing="ease-out"
          />
          <Line 
            type="monotone" 
            dataKey="readiness" 
            stroke="#8b5cf6" 
            strokeWidth={2}
            dot={false}
            animationDuration={1000}
            animationEasing="ease-out"
            activeDot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#ffffff' }}
          />
          <Line 
            type="monotone" 
            dataKey="progress" 
            stroke="#10b981" 
            strokeWidth={2}
            dot={false}
            animationDuration={1200}
            animationEasing="ease-out"
            activeDot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#ffffff' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}