import { CreatePasswordForm } from '@/components/auth/CreatePasswordForm'
import { Suspense } from 'react'

export default function CreatePasswordPage(props: any) {
  const { searchParams } = props as {
    searchParams?: { email?: string; organization?: string }
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreatePasswordForm
        email={searchParams?.email}
        organizationName={searchParams?.organization}
      />
    </Suspense>
  )
}
