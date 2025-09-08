import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if user has a session by looking at Better Auth session cookie
  const sessionCookie = request.cookies.get('better-auth.session_token');
  
  if (!sessionCookie) {
    // No session, redirect to login for protected paths
    const isPublicPath = pathname === '/' || pathname === '/login' || pathname === '/signup';
    if (!isPublicPath) {
      console.log(`🔄 No session found for protected route, redirecting to login from ${pathname}`);
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    return NextResponse.next();
  }

  // User has a session, allow them to proceed
  // Onboarding/profile checks should be handled client-side or in page components
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (files in the public folder)
     * - auth (authentication routes)
     * - _vercel (Vercel-specific paths)
     * - monitoring (monitoring paths)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public|auth|_vercel|monitoring).*)',
  ],
};
