import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { PageContainer, PageHeader } from '@/components/layout/PageContainer'
import { auth } from '@/lib/auth'
import { ExecutiveDashboard } from '@/components/executive-dashboard/ExecutiveDashboard'
import { DashboardData, UserTableData } from '@/types/dashboard'

async function getDashboardData(): Promise<{ dashboardData: DashboardData; userTableData: UserTableData }> {
  const requestHeaders = await headers()
  // When fetching on the server, we need to provide an absolute URL.
  const host = requestHeaders.get('host')
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
  const url = `${protocol}://${host}/api/executive-dashboard`

  const response = await fetch(url, {
    headers: {
      cookie: requestHeaders.get('cookie') || '',
    },
  })
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard data')
  }
  return response.json()
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
