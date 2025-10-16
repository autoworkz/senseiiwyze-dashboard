"use client"

import { useState, useEffect } from 'react'
import { UserTable } from './UserTable'
import { UserMetrics } from './UserMetrics'
import { DataVisualizations } from './DataVisualizations'
import { ProgramReadinessCards } from './ProgramReadinessCards'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useFilteredDashboardData, useFilteredUsers } from '@/hooks/useFilteredUsers'
// import { useOrganizationFilteredData } from '@/hooks/useOrganizationFilteredUsers'
import { DashboardData, UserTableData } from '@/types/dashboard'
import { useFilteredUsersContext } from '@/contexts/FilteredUsersContext'
import { useOrganizationFilteredData } from '@/hooks/useOrganizationFilteredUsers'

interface ExecutiveDashboardProps {
  dashboardData: DashboardData
  userTableData: UserTableData
}

export default function ExecutiveDashboard({ dashboardData, userTableData }: ExecutiveDashboardProps){
  const [activeTab, setActiveTab] = useState('all')
  
  const {
    filteredDashboardData,
    filteredUserTableData,
    isLoading: isOrgLoading,
    error: orgError
  } = useOrganizationFilteredData(dashboardData, userTableData)

  const { filteredData, hasData, totalFilteredUsers } = useFilteredDashboardData(filteredDashboardData)
  
  const { filteredUsers: filteredTableUsers } = useFilteredUsers(filteredUserTableData)
  
  const { setFilteredUserIds, setAvgReadiness, avgReadiness } = useFilteredUsersContext()
  // Set the filtered user IDs in context whenever the data changes
  useEffect(() => {
    if (filteredUserTableData && filteredUserTableData.success) {
      const userIds = filteredTableUsers.map(user => user.user_id)
      setFilteredUserIds(userIds)
      
      // Also set the average readiness in context
      const avgReadiness =  filteredTableUsers.length > 0 
      ? Math.round(filteredTableUsers.reduce((sum, user) => sum + (user.overallReadiness || 0), 0) / filteredTableUsers.length)
      : 0
      setAvgReadiness(avgReadiness)
    }
  }, [filteredTableUsers, setFilteredUserIds, setAvgReadiness])

  

  if (isOrgLoading) {
    return (
      <div className="min-h-screen w-full bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Executive Dashboard</h1>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-600">Loading organization data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (orgError) {
    return (
      <div className="min-h-screen w-full bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Executive Dashboard</h1>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-600">Warning: Could not load organization data. Showing all users.</p>
            <p className="text-yellow-500 text-sm mt-1">Error: {orgError}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!hasData || !filteredData) {
    return (
      <div className="min-h-screen w-full bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Executive Dashboard</h1>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-600">No users with data found. Users need to complete assessments and activities to appear in the dashboard.</p>
          </div>
        </div>
      </div>
    )
  }

  // Now we can have conditional logic after all hooks
  if (!filteredDashboardData || !filteredDashboardData.success || !filteredUserTableData || !filteredUserTableData.success) {
    return (
      <div className="min-h-screen w-full bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Executive Dashboard</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">Failed to load dashboard data</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Executive Dashboard</h1>
        <p className="text-muted-foreground mb-6">
          Track and manage user skills and program readiness ({totalFilteredUsers} users with data)
        </p>
        <UserMetrics data={filteredData} avgReadiness={avgReadiness} />
        <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start">
            <TabsTrigger value="all">All Users</TabsTrigger>
            <TabsTrigger value="ready">Ready for Deployment</TabsTrigger>
            <TabsTrigger value="coaching">Needs Coaching</TabsTrigger>
            <TabsTrigger value="programs">Program Readiness</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <DataVisualizations data={filteredData} />
            <UserTable activeTab={activeTab} data={userTableData} />
          </TabsContent>
          <TabsContent value="ready">
            <div className="rounded-lg border bg-card p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">
                Ready for Deployment
              </h2>
              <p className="text-muted-foreground">
                These users have achieved an overall readiness score of 75% or
                higher and are ready for deployment to various programs.
              </p>
            </div>
            <UserTable activeTab={activeTab} data={userTableData} />
          </TabsContent>
          <TabsContent value="coaching">
            <div className="rounded-lg border bg-card p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">
                Users Needing Coaching
              </h2>
              <p className="text-muted-foreground">
                These users have an overall readiness score below 75% and would
                benefit from additional coaching and development.
              </p>
            </div>
            <UserTable activeTab={activeTab} data={userTableData} />
          </TabsContent>
          <TabsContent value="programs">
            <div className="rounded-lg border bg-card p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">
                Program Readiness Overview
              </h2>
              <p className="text-muted-foreground">
                This view shows the readiness levels for each program and how
                many users meet the threshold requirements.
              </p>
            </div>
            <ProgramReadinessCards data={filteredData} />
            <UserTable activeTab={activeTab} data={userTableData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

