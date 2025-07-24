import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // For demonstration purposes, we'll use a simple cookie to check if the user is logged in
  // In a real application, you would use a more secure method like JWT tokens
  const isLoggedIn = request.cookies.has('auth-token')
  
  // Get the pathname of the request
  const { pathname } = request.nextUrl
  
  // If the user is logged in and trying to access the homepage or auth pages, redirect to dashboard
  if (isLoggedIn && (pathname === '/' || pathname.startsWith('/auth'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  // If the user is not logged in and trying to access protected routes, redirect to login
  if (!isLoggedIn && (pathname.startsWith('/dashboard') || pathname.startsWith('/settings'))) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
  
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/', '/dashboard/:path*', '/settings/:path*', '/auth/:path*'],
}