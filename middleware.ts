import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip middleware for certain paths
  const skipPaths = [
    '/api/',
    '/_next/',
    '/favicon.ico',
    '/auth/',
    '/test-checkout',
    '/public/',
    '/_vercel',
    '/monitoring'
  ];
  
  if (skipPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  try {
    // Check if user has a session by looking at Better Auth session cookie
    const sessionCookie = request.cookies.get('better-auth.session_token');
    
    if (!sessionCookie) {
      // No session, redirect to login (except for public paths)
      const publicPaths = ['/', '/login', '/signup'];
      if (!publicPaths.includes(pathname)) {
        console.log(`🔄 No session found, redirecting to login from ${pathname}`);
        return NextResponse.redirect(new URL('/auth/login', request.url));
      }
      return NextResponse.next();
    }

    // User has a session, check their profile and onboarding status
    // We'll make a lightweight API call to check user status
    const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/user/profile/status`, {
      method: 'GET',
      headers: {
        'Cookie': request.headers.get('cookie') || '',
        'X-Internal-Request': 'true',
      },
    });

    if (profileResponse.ok) {
      const { user_role, is_onboarding, hasProfile } = await profileResponse.json();
      
      // If user doesn't have a profile yet, redirect to onboarding
      if (!hasProfile) {
        if (!pathname.startsWith('/onboarding')) {
          console.log(`🔄 No profile found, redirecting to onboarding from ${pathname}`);
          return NextResponse.redirect(new URL('/onboarding', request.url));
        }
        return NextResponse.next();
      }
      
      // Check if user is admin-executive and needs onboarding
      if (user_role === 'admin-executive' && is_onboarding) {
        if (!pathname.startsWith('/onboarding')) {
          console.log(`🔄 Admin-executive needs onboarding, redirecting from ${pathname}`);
          return NextResponse.redirect(new URL('/onboarding', request.url));
        }
      } else if (user_role === 'admin-executive' && !is_onboarding) {
        // Admin-executive who has completed onboarding
        if (pathname.startsWith('/onboarding')) {
          console.log(`✅ Admin-executive completed onboarding, redirecting to dashboard`);
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      }
      
      // For other roles or completed onboarding, allow normal access
      // You can add more role-based logic here
    } else {
      // If we can't check profile status, allow the request to continue
      // This prevents blocking users if the profile API has issues
      console.log(`⚠️ Could not check profile status, allowing request to ${pathname}`);
    }

  } catch (error) {
    console.error('Middleware error:', error);
    // On error, allow the request to continue to prevent blocking users
  }

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
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
