"use client"
import React, { useState, useEffect } from 'react'
import { Header } from '@/components/program-readiness-dashboard/components/Header'
import { UserProfileCard } from '@/components/program-readiness-dashboard/components/UserProfileCard'
import { AnalyticsPanel } from '@/components/program-readiness-dashboard/components/AnalyticsPanel'
import { ProgramReadinessAssessment } from '@/components/program-readiness-dashboard/components/ProgramReadinessAssessment'
import { SkillBubbleChart } from '@/components/program-readiness-dashboard/components/SkillBubbleChart'
import { SkillsCharts } from '@/components/user-dashboard/components/SkillsCharts'
import { UserData } from '@/types/user-data'
import { Eye } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface DashboardData {
    user: UserData
    programRequirements: Record<string, Record<string, number>>
    skillRequirements?: Record<string, Record<string, number>>
    subskillRequirements?: Record<string, Record<string, number>>
    programCoverUrls: Record<string, string | null>
    success: boolean
}

export function ProgramReadinessView({ userId }: { userId: string }) {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                // First fetch dashboard data to get user ID
                const dashboardResponse = await fetch(`/api/program-readiness-dashboard/${userId}`)
                const dashboardResult = await dashboardResponse.json()

                if (dashboardResult.success && dashboardResult.user?.id) {
                    
                    // Fetch skills data for the specific user
                    const skillsResponse = await fetch(`/api/skills/${dashboardResult.user.id}`)
                    const skillsResult = await skillsResponse.json()

                    // Merge skills data with dashboard data
                    let mergedDashboardData = dashboardResult
                    if (skillsResult.success && skillsResult.data) {
                        
                        // Create skill type lookup from the API response
                        const skillTypeMap: Record<string, string> = {}
                        skillsResult.data.skillTypes.forEach((skillType: any) => {
                            skillTypeMap[skillType.key] = skillType.name
                        })

                        // Create enhanced skillDetails object
                        let enhancedSkillDetails: Record<string, Record<string, number>> = {}
                        
                        // Extract parent skills proficiency from skills API
                        let parentSkillsProficiency: Record<string, number> = {}

                        // Process parent skills
                        if (skillsResult.data.skills) {
                            Object.entries(skillsResult.data.skills).forEach(([skillKey, skillData]: [string, any]) => {
                                const skillName = skillTypeMap[skillKey] || skillKey
                                parentSkillsProficiency[skillName] = skillData.value
                            })
                        }

                        // Process subskills from single user skills API
                        if (skillsResult.data.subskills) {
                            Object.entries(skillsResult.data.subskills).forEach(([skillKey, subskills]: [string, any]) => {
                                const skillName = skillTypeMap[skillKey] || skillKey
                                enhancedSkillDetails[skillName] = {}
                                
                                if (Array.isArray(subskills)) {
                                    subskills.forEach((subskill: any) => {
                                        enhancedSkillDetails[skillName][subskill.name] = subskill.value
                                    })
                                }
                            })
                        }
                        // If no database skills found, keep existing skillDetails
                        if (Object.keys(enhancedSkillDetails).length === 0) {
                            enhancedSkillDetails = dashboardResult.user.skillDetails || {}
                        }

                        // Update the dashboard data with enhanced skill details and parent skills
                        mergedDashboardData = {
                            ...dashboardResult,
                            user: {
                                ...dashboardResult.user,
                                skillDetails: enhancedSkillDetails,
                                parentSkillsProficiency: parentSkillsProficiency
                            }
                        }
                    }

                    setDashboardData(mergedDashboardData)
                } else {
                    setDashboardData(dashboardResult)
                }
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

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
            <SkillBubbleChart 
              user={dashboardData.user} 
              skillRequirements={dashboardData.skillRequirements}
              subskillRequirements={dashboardData.subskillRequirements}
            />
            <ProgramReadinessAssessment 
              user={dashboardData.user} 
              programRequirements={dashboardData.programRequirements}
              programCoverUrls={dashboardData.programCoverUrls}
            />
            {/* <TrainingTable
                user={dashboardData.user}
                programRequirements={dashboardData.programRequirements}
            /> */}
            {/* <AdminActions /> */}
                <Button disabled className="w-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center">
                    <Eye className="w-5 h-5 mr-2 text-white" />
                    <h3 className="text-md font-semibold text-white">User Analysis Developed From This Data</h3>
                </Button>
        </div>
    )
}
