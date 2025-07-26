'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'

interface MetricCardProps {
  title: string
  value: string
  change: string
}

function MetricCard({ title, value, change }: MetricCardProps) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{change}</p>
    </div>
  )
}

export function WorkerDashboard() {
  return (
    <DashboardLayout
      title="Worker Dashboard"
      subtitle="Training progress and skill development"
    >
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Current Training</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Learning Progress"
            value="0%"
            change="Complete"
          />
          <MetricCard
            title="Skills Mastered"
            value="0"
            change="Skills"
          />
          <MetricCard
            title="Readiness Score"
            value="0"
            change="Out of 100"
          />
          <MetricCard
            title="Study Streak"
            value="0"
            change="Days"
          />
        </div>
      </div>
    </DashboardLayout>
  )
}