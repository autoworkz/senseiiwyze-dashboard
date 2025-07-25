"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface UserGrowthData {
  month: string
  users: number
  active: number
}

interface UserGrowthChartProps {
  data: UserGrowthData[]
  className?: string
}

export function UserGrowthChart({ data, className = "" }: UserGrowthChartProps) {
  return (
    <div className={`w-full h-[400px] ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="users" 
            stroke="#8884d8" 
            strokeWidth={2}
            name="Total Users"
          />
          <Line 
            type="monotone" 
            dataKey="active" 
            stroke="#82ca9d" 
            strokeWidth={2}
            name="Active Users"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
} 