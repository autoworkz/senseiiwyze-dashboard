import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth-config'
import logger, { createChildLogger } from '@/lib/logger'

// Create a child logger for middleware
const middlewareLogger = createChildLogger('Middleware')

// This function is marked `async` to use `await` inside
export async function middleware(request: NextRequest) {
  const startTime = Date.now()
  const { pathname } = request.nextUrl
  const userAgent = request.headers.get('user-agent') || 'Unknown'
  const forwardedFor = request.headers.get('x-forwarded-for') || 'Unknown'

  middlewareLogger.info(`Request started: ${request.method} ${pathname}`, {
    userAgent,
    ip: forwardedFor,
    timestamp: new Date().toISOString()
  })

  try {
    // Use Better Auth to check if the user is logged in
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    const isLoggedIn = !!session
    const userId = session?.user?.id || 'anonymous'

    middlewareLogger.debug(`Authentication check completed`, {
      isLoggedIn,
      userId,
      pathname
    })

    // If the user is logged in and trying to access the homepage or auth pages, redirect to dashboard
    if (isLoggedIn && (pathname === '/' || pathname.startsWith('/auth'))) {
      middlewareLogger.info(`Redirecting authenticated user from ${pathname} to /dashboard`, {
        userId,
        pathname
      })
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // If the user is not logged in and trying to access protected routes, redirect to login
    if (!isLoggedIn && (
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/settings') ||
      pathname.startsWith('/me') ||
      pathname.startsWith('/team') ||
      pathname.startsWith('/org')
    )) {
      middlewareLogger.warn(`Unauthorized access attempt to protected route: ${pathname}`, {
        ip: forwardedFor,
        userAgent,
        pathname
      })
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    const duration = Date.now() - startTime
    middlewareLogger.info(`Request completed: ${request.method} ${pathname}`, {
      duration: `${duration}ms`,
      userId,
      pathname
    })

    return NextResponse.next()
  } catch (error) {
    const duration = Date.now() - startTime
    middlewareLogger.error(`Middleware error processing ${request.method} ${pathname}`, error)

    // In case of error, allow the request to continue to prevent blocking the application
    return NextResponse.next()
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/', '/dashboard/:path*', '/settings/:path*', '/auth/:path*', '/me/:path*', '/team/:path*', '/org/:path*'],
}