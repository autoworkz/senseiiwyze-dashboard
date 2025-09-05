import { useMemo } from 'react'
import { User, DashboardData, UserTableData, ReadinessRange, SkillData, ProgramReadinessData } from '@/types/dashboard'

export const useFilteredUsers = (data: DashboardData | UserTableData | null) => {
  return useMemo(() => {
    if (!data || !data.success) {
      return {
        filteredUsers: [],
        hasData: false,
        totalFilteredUsers: 0
      }
    }

    // Function to check if a user has meaningful data
    const hasUserData = (user: User): boolean => {
      // Check if user has skills data (at least one skill > 0)
      const hasSkills = user.skills && Object.values(user.skills).some(skill => skill > 0)
      
      // Check if user has overall readiness > 0
      const hasReadiness = user.overallReadiness > 0
      
      // Check if user has program readiness data
      const hasProgramReadiness = user.programReadiness && Object.keys(user.programReadiness).length > 0
      
      // User is considered to have data if they have at least skills OR readiness OR program readiness
      return hasSkills || hasReadiness || hasProgramReadiness
    }

    // Filter users with data
    const filteredUsers = data.userData.filter(hasUserData)
    const totalFilteredUsers = filteredUsers.length

    return {
      filteredUsers,
      hasData: totalFilteredUsers > 0,
      totalFilteredUsers
    }
  }, [data])
}

// Hook specifically for dashboard data that also recalculates aggregates
export const useFilteredDashboardData = (dashboardData: DashboardData | null) => {
  // First, get the filtered users using the basic hook
  const { filteredUsers, hasData, totalFilteredUsers } = useFilteredUsers(dashboardData)

  // Then, recalculate aggregates based on filtered users
  return useMemo(() => {
    if (!dashboardData || !dashboardData.success || !hasData) {
      return {
        filteredData: null,
        hasData: false,
        totalFilteredUsers: 0
      }
    }

    // Recalculate readiness ranges based on filtered users
    const calculateReadinessRanges = (): ReadinessRange[] => {
      const ranges = [
        { name: '0% - 25%', min: 0, max: 25 },
        { name: '26% - 50%', min: 26, max: 50 },
        { name: '51% - 65%', min: 51, max: 65 },
        { name: '66% - 74%', min: 66, max: 74 },
        { name: '75% - 85%', min: 75, max: 85 },
        { name: '86% - 100%', min: 86, max: 100 }
      ]

      return ranges.map(range => ({
        name: range.name,
        count: filteredUsers.filter(user => 
          user.overallReadiness >= range.min && user.overallReadiness <= range.max
        ).length
      }))
    }

    // Recalculate average skills based on filtered users
    const calculateAverageSkills = (): SkillData[] => {
      const skillKeys = ['vision', 'grit', 'logic', 'algorithm', 'problemSolving']
      const skillLabels = ['Vision', 'Grit', 'Logic', 'Algorithm', 'Problem Solving']

      return skillKeys.map((skill, index) => {
        const total = filteredUsers.reduce((sum, user) => {
          return sum + (user.skills?.[skill] || 0)
        }, 0)
        const average = Math.round(total / filteredUsers.length)

        return {
          subject: skillLabels[index],
          A: average
        }
      })
    }

    // Recalculate program readiness based on filtered users
    const calculateProgramReadiness = (): ProgramReadinessData[] => {
      const programNames = Object.keys(dashboardData.programThresholds || {})
      
      return programNames.map(programName => {
        const programUsers = filteredUsers.filter(user => 
          user.programReadiness && user.programReadiness[programName] !== undefined
        )

        if (programUsers.length === 0) {
          return {
            name: programName,
            readiness: 0,
            threshold: dashboardData.programThresholds?.[programName] || 0
          }
        }

        const totalReadiness = programUsers.reduce((sum, user) => 
          sum + (user.programReadiness[programName] || 0), 0
        )
        const avgReadiness = Math.round(totalReadiness / programUsers.length)

        return {
          name: programName,
          readiness: avgReadiness,
          threshold: dashboardData.programThresholds?.[programName] || 0
        }
      })
    }

    // Create filtered dashboard data with recalculated aggregates
    const filteredData: DashboardData = {
      ...dashboardData,
      userData: filteredUsers,
      totalUsers: totalFilteredUsers,
      readinessRanges: calculateReadinessRanges(),
      avgSkills: calculateAverageSkills(),
      programReadiness: calculateProgramReadiness()
    }

    return {
      filteredData,
      hasData: true,
      totalFilteredUsers
    }
  }, [dashboardData, filteredUsers, hasData, totalFilteredUsers])
}
