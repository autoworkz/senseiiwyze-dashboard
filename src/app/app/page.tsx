import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { PageContainer, PageHeader } from '@/components/layout/PageContainer'
import { auth } from '@/lib/auth'
import ExecutiveDashboard from '@/components/executive-dashboard/ExecutiveDashboard'
import { DashboardData, UserTableData } from '@/types/dashboard'

async function getDashboardData(): Promise<{ dashboardData: DashboardData; userTableData: UserTableData }> {
  const requestHeaders = await headers()
  // When fetching on the server, we need to provide an absolute URL.
  const host = requestHeaders.get('host')
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
  const baseUrl = `${protocol}://${host}`

  const requestOptions = {
    headers: {
      cookie: requestHeaders.get('cookie') || '',
    },
  }

  try {
    // Fetch all APIs in parallel
    const [dashboardResponse, usersResponse, skillsResponse] = await Promise.all([
      fetch(`${baseUrl}/api/executive-dashboard`, requestOptions),
      fetch(`${baseUrl}/api/users-table`, requestOptions),
      fetch(`${baseUrl}/api/skills`, requestOptions)
    ])

    if (!dashboardResponse.ok) {
      throw new Error('Failed to fetch dashboard data')
    }

    const dashboardResult = await dashboardResponse.json()
    const usersResult = usersResponse.ok ? await usersResponse.json() : []
    const skillsResult = skillsResponse.ok ? await skillsResponse.json() : { success: false }

    let mergedUserData = usersResult
    if (skillsResult.success && skillsResult.data?.users) {
      // Create skill type mapping
      const skillTypeMap: Record<string, string> = {}
      skillsResult.data.skillTypes.forEach((skillType: any) => {
        skillTypeMap[skillType.key] = skillType.name
      })

      // Merge user data with skills data
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

    return {
      dashboardData: dashboardResult,
      userTableData: {
        userData: mergedUserData,
        success: true
      }
    }
  } catch (error) {
    console.error('Failed to fetch data:', error)
    throw new Error('Failed to fetch dashboard data')
  }
}

export default async function DashboardPage() {
  // Server-side session retrieval
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    redirect('/auth/login')
  }

  const { dashboardData, userTableData } = await getDashboardData()

  return (
    <PageContainer className="space-y-8">
      <PageHeader
        title={`Welcome back, ${session.user.name}`}
        description="Here's your executive dashboard overview"
      />
      <ExecutiveDashboard dashboardData={dashboardData} userTableData={userTableData} />
    </PageContainer>
  )
}
