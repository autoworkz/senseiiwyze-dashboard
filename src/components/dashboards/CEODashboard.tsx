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

export function CEODashboard() {
  return (
    <DashboardLayout
      title="CEO Dashboard"
      subtitle="Executive overview and company metrics"
    >
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Key Metrics</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Monthly Recurring Revenue"
            value="$0"
            change="+0% from last month"
          />
          <MetricCard
            title="Active Learners"
            value="0"
            change="+0% from last month"
          />
          <MetricCard
            title="Completion Rate"
            value="0%"
            change="+0% from last month"
          />
          <MetricCard
            title="Readiness Index Accuracy"
            value="0%"
            change="+0% from last month"
          />
        </div>
      </div>
    </DashboardLayout>
  )
}