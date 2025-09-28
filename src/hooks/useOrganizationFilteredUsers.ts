import { useMemo, useState, useEffect } from 'react'
import { User, DashboardData, UserTableData } from '@/types/dashboard'
import { useUser } from '@/contexts/UserContext'

interface OrganizationMembersResponse {
  success: boolean
  profileIds: string[]
  memberCount: number
}

interface OrganizationFilteredDataResult {
  filteredDashboardData: DashboardData | null
  filteredUserTableData: UserTableData | null
  isLoading: boolean
  error: string | null
}

/**
 * Unified hook to filter both dashboard and user table data by the current active organization
 * This hook acts as middleware - it takes raw data and filters it by organization membership
 * Returns filtered data that can be passed to existing hooks (useFilteredDashboardData and useFilteredUsers)
 */
export const useOrganizationFilteredData = (
  dashboardData: DashboardData | null,
  userTableData: UserTableData | null
): OrganizationFilteredDataResult => {
  const { user, isLoading: userLoading } = useUser()
  const [organizationProfileIds, setOrganizationProfileIds] = useState<string[]>([])
  const [isLoadingMembers, setIsLoadingMembers] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch organization members when organization changes
  useEffect(() => {
    const fetchOrganizationMembers = async () => {
      if (!user?.organizationId) {
        setOrganizationProfileIds([])
        setError(null)
        return
      }

      setIsLoadingMembers(true)
      setError(null)

      try {
        const response = await fetch(`/api/organization/members`)
        const data: OrganizationMembersResponse = await response.json()

        if (data.success) {
          setOrganizationProfileIds(data.profileIds)
        } else {
          setError('Failed to fetch organization members')
          setOrganizationProfileIds([])
        }
      } catch (err) {
        console.error('Error fetching organization members:', err)
        setError('Error fetching organization members')
        setOrganizationProfileIds([])
      } finally {
        setIsLoadingMembers(false)
      }
    }

    fetchOrganizationMembers()
  }, [user?.organizationId])

  return useMemo(() => {
    // If user is still loading, return loading state
    if (userLoading) {
      return {
        filteredDashboardData: null,
        filteredUserTableData: null,
        isLoading: true,
        error: null
      }
    }

    // If user has no active organization, return original data
    if (!user?.organizationId) {
      return {
        filteredDashboardData: dashboardData,
        filteredUserTableData: userTableData,
        isLoading: false,
        error: null
      }
    }

    // If still loading organization members, return loading state
    if (isLoadingMembers) {
      return {
        filteredDashboardData: null,
        filteredUserTableData: null,
        isLoading: true,
        error: null
      }
    }

    // If there was an error fetching members, return error state
    if (error) {
      return {
        filteredDashboardData: null,
        filteredUserTableData: null,
        isLoading: false,
        error
      }
    }

    // Filter dashboard data to only include users who are members of the organization
    let filteredDashboardData = dashboardData
    if (dashboardData && dashboardData.success && organizationProfileIds.length > 0) {
      filteredDashboardData = {
        ...dashboardData,
        userData: dashboardData.userData.filter(user => 
          organizationProfileIds.includes(user.profile_id)
        )
      }
    }

    // Filter user table data to only include users who are members of the organization
    let filteredUserTableData = userTableData
    if (userTableData && userTableData.success && organizationProfileIds.length > 0) {
      filteredUserTableData = {
        ...userTableData,
        userData: userTableData.userData.filter(user => 
          organizationProfileIds.includes(user.user_id)
        )
      }
    }

    return {
      filteredDashboardData,
      filteredUserTableData,
      isLoading: false,
      error: null
    }
  }, [dashboardData, userTableData, user, userLoading, organizationProfileIds, isLoadingMembers, error])
}

