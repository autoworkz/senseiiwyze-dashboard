import { CreatePasswordForm } from '@/components/auth/CreatePasswordForm'
import { Suspense } from 'react'

interface CreatePasswordPageProps {
  searchParams: {
    email?: string
    organization?: string
  }
}

export default function CreatePasswordPage({ searchParams }: CreatePasswordPageProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreatePasswordForm
        email={searchParams.email}
        organizationName={searchParams.organization}
      />
    </Suspense>
  )
}
