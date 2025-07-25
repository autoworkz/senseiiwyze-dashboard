"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface UserRetentionData {
  cohort: string
  week1: number
  week2: number
  week3: number
  week4: number
}

interface UserRetentionChartProps {
  data: UserRetentionData[]
  className?: string
}

export function UserRetentionChart({ data, className = "" }: UserRetentionChartProps) {
  // Transform data for stacked bar chart
  const transformedData = data.map(item => ({
    cohort: item.cohort,
    'Week 1': item.week1,
    'Week 2': item.week2,
    'Week 3': item.week3,
    'Week 4': item.week4,
  }))

  return (
    <div className={`w-full h-[400px] ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={transformedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="cohort" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Week 1" stackId="a" fill="#8884d8" />
          <Bar dataKey="Week 2" stackId="a" fill="#82ca9d" />
          <Bar dataKey="Week 3" stackId="a" fill="#ffc658" />
          <Bar dataKey="Week 4" stackId="a" fill="#ff7300" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
} 