"use client"
import React, { useState, useEffect } from 'react'
import { Header } from '@/components/program-readiness-dashboard/components/Header'
import { UserProfileCard } from '@/components/program-readiness-dashboard/components/UserProfileCard'
import { TrainingTable } from '@/components/program-readiness-dashboard/components/TrainingTable'
import { AnalyticsPanel } from '@/components/program-readiness-dashboard/components/AnalyticsPanel'
import { AdminActions } from '@/components/program-readiness-dashboard/components/AdminActions'
import { ProgramReadinessAssessment } from '@/components/program-readiness-dashboard/components/ProgramReadinessAssessment'
import { SkillBubbleChart } from '@/components/program-readiness-dashboard/components/SkillBubbleChart'
import { SkillsCharts } from '@/components/user-dashboard/components/SkillsCharts'
import { UserData } from '@/types/user-data'

interface DashboardData {
  user: UserData
  programRequirements: Record<string, Record<string, number>>
  programCoverUrls: Record<string, string | null>
  success: boolean
}

export function ProgramReadinessView({ userId }: { userId: string }) {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/program-readiness-dashboard?userId=${userId}`)
                const result:any = await response.json()
                setDashboardData(result)
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error)
            } finally {
                setLoading(false)
            }
        }

        if (userId) {
            fetchData()
        }
    }, [userId])

    if (loading) {
        return (
            <div className="container py-6 space-y-8">
                <div className="animate-pulse space-y-8">
                    <div className="h-8 bg-gray-200 rounded w-64"></div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="h-64 bg-gray-200 rounded"></div>
                        <div className="lg:col-span-2 h-64 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-96 bg-gray-200 rounded"></div>
                </div>
            </div>
        )
    }

    if (!dashboardData || !dashboardData.success) {
        return (
            <div className="container py-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600">Failed to load dashboard data</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container py-6 space-y-8">
            <Header />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <UserProfileCard user={dashboardData.user} />
                <div className="lg:col-span-2">
                    <AnalyticsPanel user={dashboardData.user} />
                </div>
            </div>
            <SkillsCharts user={dashboardData.user} />
            <SkillBubbleChart user={dashboardData.user} />
            <ProgramReadinessAssessment 
              user={dashboardData.user} 
              programRequirements={dashboardData.programRequirements}
              programCoverUrls={dashboardData.programCoverUrls}
            />
            <TrainingTable 
              user={dashboardData.user}
              programRequirements={dashboardData.programRequirements}
            />
            {/* <AdminActions /> */}
        </div>
    )
}
