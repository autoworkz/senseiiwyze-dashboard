"use client"
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface UserData {
  id: string
  name: string
  role: string
  level: number
  skills: {
    vision: number
    grit: number
    logic: number
    algorithm: number
    problemSolving: number
  }
  overallReadiness: number
  programReadiness: Record<string, number>
  bestProgram: {
    name: string
    readiness: number
  }
  skillDetails: Record<string, Record<string, number>>
  initials: string
}

export function AnalyticsPanel({ user }: { user: UserData }) {
  const skillData = Object.entries(user.skills).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }))

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Skill Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={skillData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 text-sm text-muted-foreground">
          <p>
            This chart visualizes the user's proficiency across key skills: Vision, Grit, Logic,
            Algorithm, and Problem Solving.
          </p>
          <p className="mt-2">
            <strong>Overall Readiness:</strong> {user.overallReadiness}% - An aggregate measure of
            the user's preparedness across all assessed areas.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
