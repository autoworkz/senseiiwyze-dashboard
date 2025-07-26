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

export function FrontlinerDashboard() {
  return (
    <DashboardLayout
      title="Frontliner Dashboard"
      subtitle="Customer service metrics and performance"
    >
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Daily Metrics</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Active Tickets"
            value="0"
            change="Open"
          />
          <MetricCard
            title="Avg Response Time"
            value="0"
            change="Minutes"
          />
          <MetricCard
            title="Customer Satisfaction"
            value="0%"
            change="Rating"
          />
          <MetricCard
            title="Resolved Today"
            value="0"
            change="Tickets"
          />
        </div>
      </div>
    </DashboardLayout>
  )
}