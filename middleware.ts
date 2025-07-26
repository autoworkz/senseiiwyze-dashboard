import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales } from './src/i18n';

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: 'en'
});

export function middleware(request: NextRequest) {
  // Handle internationalization first
  const intlResponse = intlMiddleware(request);
  
  // For demonstration purposes, we'll use a simple cookie to check if the user is logged in
  // In a real application, you would use a more secure method like JWT tokens
  const isLoggedIn = request.cookies.has('auth-token')
  
  // Get the pathname of the request (without locale prefix)
  const { pathname } = request.nextUrl
  const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '/'
  
  // If the user is logged in and trying to access the homepage or auth pages, redirect to dashboard
  if (isLoggedIn && (pathnameWithoutLocale === '/' || pathnameWithoutLocale.startsWith('/auth'))) {
    const locale = pathname.split('/')[1]
    const redirectUrl = new URL(`/${locale}/dashboard`, request.url)
    return NextResponse.redirect(redirectUrl)
  }
  
  // If the user is not logged in and trying to access protected routes, redirect to login
  if (!isLoggedIn && (pathnameWithoutLocale.startsWith('/dashboard') || pathnameWithoutLocale.startsWith('/settings'))) {
    const locale = pathname.split('/')[1]
    const redirectUrl = new URL(`/${locale}/auth/login`, request.url)
    return NextResponse.redirect(redirectUrl)
  }
  
  return intlResponse || NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/', '/(de|en|es|fr)/:path*', '/dashboard/:path*', '/settings/:path*', '/auth/:path*'],
}
