'use client'

import { useParams } from 'next/navigation'
import UserDashboardPage from '@/components/user-dashboard/UserDashboardPage'

export default function UserDetailPage() {
  const params = useParams()
  const userId = params.id as string

  return <UserDashboardPage userId={userId}/>
}
