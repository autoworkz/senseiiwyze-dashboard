'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from '@/lib/auth-client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    const performLogout = async () => {
      try {
        await signOut({ callbackURL: '/auth/login' })
        // Redirect to login after a brief delay
        setTimeout(() => {
          router.push('/auth/login')
        }, 2000)
      } catch (error) {
        console.error('Logout error:', error)
        router.push('/auth/login')
      }
    }

    performLogout()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img
              src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg"
              className="h-12 w-12"
              alt="SenseiiWyze Logo"
            />
          </div>
          <CardTitle className="text-2xl">Signing Out</CardTitle>
          <CardDescription>
            You are being signed out of SenseiiWyze...
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">
            Redirecting to login page...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
