"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface UserEngagementData {
  day: string
  sessions: number
  duration: number
}

interface UserEngagementChartProps {
  data: UserEngagementData[]
  className?: string
}

export function UserEngagementChart({ data, className = "" }: UserEngagementChartProps) {
  return (
    <div className={`w-full h-[400px] ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Bar 
            yAxisId="left"
            dataKey="sessions" 
            fill="#8884d8" 
            name="Sessions"
          />
          <Bar 
            yAxisId="right"
            dataKey="duration" 
            fill="#82ca9d" 
            name="Duration (min)"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
} 