'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error with additional context for authenticated users
    console.error('Dashboard error:', error)
    
    // In production, send to error tracking service with user context
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { tags: { section: 'dashboard' } })
    }
  }, [error])

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-xl">Dashboard Error</CardTitle>
          <CardDescription>
            There was a problem loading your dashboard. This might be a temporary issue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Show error details in development */}
          {process.env.NODE_ENV === 'development' && (
            <div className="p-3 bg-muted rounded-md">
              <h4 className="font-medium text-sm mb-1">Development Error:</h4>
              <p className="text-xs font-mono text-muted-foreground break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-muted-foreground mt-1">
                  Digest: {error.digest}
                </p>
              )}
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button onClick={reset} variant="outline" className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
            <Button asChild className="w-full">
              <Link href="/app">
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>
          </div>

          <div className="flex justify-center">
            <Button asChild variant="ghost" size="sm">
              <Link href="/app/settings">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Still having issues?{' '}
              <Link href="/support" className="text-primary hover:underline">
                Get help
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}