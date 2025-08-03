"use client"

import { AnalyticsChart } from '@/components/charts/analytics-chart'
import { UsersChart } from '@/components/charts/users-chart'

export function DashboardMetrics() {
  return (
    <>
      <div className="analytics-chart">
        <AnalyticsChart />
      </div>
      <div className="users-chart">
        <UsersChart />
      </div>
    </>
  )
}