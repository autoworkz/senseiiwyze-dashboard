"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useTheme } from 'next-themes'

const data = [
  { name: 'Active', value: 156 },
  { name: 'Pending', value: 23 },
  { name: 'Inactive', value: 12 },
]

export function UsersChart() {
  const { theme } = useTheme()
  const gridColor = theme === 'dark' ? '#374151' : '#e5e7eb'
  const textColor = theme === 'dark' ? '#9ca3af' : '#6b7280'
  
  return (
    <div className="h-[100px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data} 
          margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12, fill: textColor }}
            axisLine={{ stroke: gridColor }}
          />
          <YAxis hide />
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
          <Bar 
            dataKey="value" 
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
            animationDuration={1000}
            animationEasing="ease-out"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}