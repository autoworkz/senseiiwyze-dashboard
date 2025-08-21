"use client"
import React, { useState, useEffect } from 'react'
import { UserTable } from '@/components/executive-dashboard/UserTable'
import { UserMetrics } from '@/components/executive-dashboard/UserMetrics'
import { DataVisualizations } from '@/components/executive-dashboard/DataVisualizations'
import { ProgramReadinessCards } from '@/components/executive-dashboard/ProgramReadinessCards'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface DashboardData {
  userData: any[]
  totalUsers: number
  avgReadiness: number
  readyUsers: number
  coachingUsers: number
  readinessRanges: any[]
  avgSkills: any[]
  programReadiness: any[]
  programThresholds: any
  success: boolean
}

interface UserTableData {
  userData: any[]
  success: boolean
}

export default function ExecutiveDashboard(){
  const [activeTab, setActiveTab] = useState('all')
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [userTableData, setUserTableData] = useState<UserTableData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch all APIs in parallel
        const [dashboardResponse, usersResponse, skillsResponse] = await Promise.all([
          fetch('/api/executive-dashboard'),
          fetch('/api/users-table'),
          fetch('/api/skills')
        ])

        const dashboardResult = await dashboardResponse.json()
        const usersResult = await usersResponse.json()
        const skillsResult = await skillsResponse.json()

        let mergedUserData = usersResult
        if (skillsResult.success && skillsResult.data?.users) {

          const skillTypeMap: Record<string, string> = {}
          skillsResult.data.skillTypes.forEach((skillType: any) => {
            skillTypeMap[skillType.key] = skillType.name
          })

          mergedUserData = usersResult.map((user: any) => {
            const userSkillsData = skillsResult.data.users.find(
              (skillUser: any) => skillUser.userId === user.user_id
            )

            let skillDetails: Record<string, Record<string, number>> = {}

            if (userSkillsData && userSkillsData.subskills) {

              Object.entries(userSkillsData.subskills).forEach(([skillKey, subskills]: [string, any]) => {
                const skillName = skillTypeMap[skillKey] || skillKey
                skillDetails[skillName] = {}
                
                if (Array.isArray(subskills)) {
                  subskills.forEach((subskill: any) => {
                    skillDetails[skillName][subskill.name] = subskill.value
                  })
                }
              })
            }

            // If no database skills found, create empty skillDetails
            if (Object.keys(skillDetails).length === 0) {
              skillDetails = {}
            }

            return {
              ...user,
              skillDetails
            }
          })
        } else {
          // If skills API failed, add empty skillDetails to all users
          mergedUserData = usersResult.map((user: any) => ({
            ...user,
            skillDetails: {}
          }))
        }

        setDashboardData(dashboardResult)
        setUserTableData({
          userData: mergedUserData,
          success: true
        })
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAllData()
  }, [])
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Executive Dashboard</h1>
          <p className="text-muted-foreground mb-6">Loading dashboard data...</p>
          <div className="animate-pulse space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-200 h-64 rounded-lg"></div>
              <div className="bg-gray-200 h-64 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!dashboardData || !dashboardData.success || !userTableData || !userTableData.success) {
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
          Track and manage user skills and program readiness
        </p>
        <UserMetrics data={dashboardData} />
        <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start">
            <TabsTrigger value="all">All Users</TabsTrigger>
            <TabsTrigger value="ready">Ready for Deployment</TabsTrigger>
            <TabsTrigger value="coaching">Needs Coaching</TabsTrigger>
            <TabsTrigger value="programs">Program Readiness</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <DataVisualizations data={dashboardData} />
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
            <ProgramReadinessCards data={dashboardData} />
            <UserTable activeTab={activeTab} data={userTableData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

