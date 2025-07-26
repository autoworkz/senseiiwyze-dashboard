import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

// This function is marked `async` to use `await` inside
export async function middleware(request: NextRequest) {
  // Use Better Auth to check if the user is logged in
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  const isLoggedIn = !!session

  // Get the pathname of the request
  const { pathname } = request.nextUrl

  // If the user is logged in and trying to access the homepage or auth pages, redirect to dashboard
  if (isLoggedIn && (pathname === '/' || pathname.startsWith('/auth'))) {
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
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/', '/dashboard/:path*', '/settings/:path*', '/auth/:path*', '/me/:path*', '/team/:path*', '/org/:path*'],
}