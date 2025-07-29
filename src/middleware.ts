import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import createMiddleware from 'next-intl/middleware';
import { locales } from '@/i18n';

/**
 * B2B2C Engine Middleware with Better Auth Integration & i18n
 * 
 * Provides authentication and role-based route protection with full internationalization:
 * - CEO (learner): /me/* routes - Personal development and learning
 * - Worker (admin): /team/* routes - Team management and coordination  
 * - Frontliner (executive): /org/* routes - Organization oversight and strategy
 * 
 * All routes are locale-aware and properly redirect with locale prefixes.
 */

/**
 * Public routes that don't require authentication (without locale prefix)
 */
const publicRoutes = [
    '/login',
    '/signup', 
    '/auth',
    '/api/auth',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/unauthorized'
];

// Create next-intl middleware
const intlMiddleware = createMiddleware({
    locales,
    defaultLocale: 'en',
    localePrefix: 'as-needed'
});

/**
 * Extract locale from pathname and return both locale and pathname without locale
 */
function parseLocaleFromPath(pathname: string): { locale: string | null; pathnameWithoutLocale: string } {
    const segments = pathname.split('/').filter(Boolean);
    const firstSegment = segments[0];
    
    if (firstSegment && locales.includes(firstSegment as any)) {
        return {
            locale: firstSegment,
            pathnameWithoutLocale: '/' + segments.slice(1).join('/') || '/'
        };
    }
    
    return {
        locale: null,
        pathnameWithoutLocale: pathname
    };
}

/**
 * Create a locale-aware URL
 */
function createLocalizedUrl(path: string, locale: string | null, baseUrl: string): string {
    // If no locale or it's the default locale, return path as-is for 'as-needed' strategy
    if (!locale || locale === 'en') {
        return new URL(path, baseUrl).toString();
    }
    
    // Add locale prefix for non-default locales
    const localizedPath = path.startsWith('/') ? `/${locale}${path}` : `/${locale}/${path}`;
    return new URL(localizedPath, baseUrl).toString();
}

/**
 * Check if a route is public (doesn't require authentication)
 */
function isPublicRoute(pathname: string): boolean {
    return publicRoutes.some(route => 
        pathname === route || pathname.startsWith(route + '/')
    );
}

// /**
//  * Check if user role can access the requested route
//  */
function canAccessRoute(userRole: string | undefined | null, pathname: string): boolean {
    if (!userRole) return false;
    
    // Handle multiple roles (comma-separated)
    const userRoles = userRole.split(',').map(r => r.trim());
    
    // Import role mapping from auth.ts
    const roleRouteMapping = {
        // CEO/learner routes - personal development
        learner: ['/me'],
        ceo: ['/me'],
        
        // Worker/admin routes - team management  
        admin: ['/team'],
        worker: ['/team'],
        
        // Frontliner/executive routes - organizational oversight
        executive: ['/org'],
        frontliner: ['/org'],
    };
    
    // Check if any of the user's roles allow access to this route
    for (const role of userRoles) {
        const allowedRoutes = roleRouteMapping[role as keyof typeof roleRouteMapping];
        if (allowedRoutes?.some(route => pathname.startsWith(route))) {
            return true;
        }
    }
    
    return false;
}

/**
 * Get default route for user role (without locale prefix)
 */
function getDefaultRouteForRole(userRole: string | undefined | null): string {
    if (!userRole) {
        return '/me'; // Default to CEO/learner dashboard
    }
    const roles = userRole.split(',').map(r => r.trim());
    const primaryRole = roles[0];
    
    switch (primaryRole) {
        case 'ceo':
        case 'learner':
            return '/me';
        case 'worker':
        case 'admin':
            return '/team';
        case 'frontliner':
        case 'executive':
            return '/org';
        default:
            return '/me'; // Default to CEO/learner dashboard
    }
}

export async function middleware(request: NextRequest) {
    console.log('🔥 Middleware entered');

    const { pathname } = request.nextUrl;
    
    console.log('🚀 Middleware running for:', pathname);
    
    // Skip middleware for static files and API routes
    if (pathname.startsWith('/_next') || 
        pathname.startsWith('/api') || 
        pathname === '/favicon.ico') {
        return NextResponse.next();
    }

    // Handle internationalization first
    const intlResponse = intlMiddleware(request);
    
    // If intl middleware redirects, return that response
    if (intlResponse.status === 302 || intlResponse.status === 307) {
        return intlResponse;
    }

    // Parse locale from pathname using helper function
    const { locale, pathnameWithoutLocale } = parseLocaleFromPath(pathname);
    
    console.log('🌍 Detected locale:', locale || 'none (default)');
    console.log('🛣️  Path without locale:', pathnameWithoutLocale);
    
    // Skip middleware for public routes (check without locale)
    if (isPublicRoute(pathnameWithoutLocale)) {
        console.log('✅ Public route, allowing access');
        return intlResponse;
    }

    console.log('🔐 Protected route detected, checking authentication...');
    
    try {
        // Get session using Better Auth's recommended approach for Next.js 15+
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            console.log('❌ No session found, redirecting to login');
            const loginUrl = createLocalizedUrl('/login', locale, request.url);
            return NextResponse.redirect(loginUrl);
        }

        console.log('✅ Session found for user:', session.user.email);
        console.log('👤 User role:', session.user.role);

        // Handle root route redirect - redirect to appropriate dashboard
        if (pathnameWithoutLocale === '/' || pathnameWithoutLocale === '') {
            const defaultRoute = getDefaultRouteForRole(session.user.role);
            const dashboardUrl = createLocalizedUrl(defaultRoute, locale, request.url);
            console.log('🔄 Root route access, redirecting to user dashboard:', dashboardUrl);
            return NextResponse.redirect(dashboardUrl);
        }

        // Handle auth routes (login/signup) - redirect authenticated users to their dashboard
        const authRoutes = ['/login', '/signup'];
        if (authRoutes.includes(pathnameWithoutLocale)) {
            const defaultRoute = getDefaultRouteForRole(session.user.role);
            const dashboardUrl = createLocalizedUrl(defaultRoute, locale, request.url);
            console.log('🔄 Authenticated user accessing auth route, redirecting to:', dashboardUrl);
            return NextResponse.redirect(dashboardUrl);
        }

        // Check role-based access for protected routes (check without locale)
        if (!canAccessRoute(session.user.role, pathnameWithoutLocale)) {
            console.log('🚫 User does not have permission for this route');
            const defaultRoute = getDefaultRouteForRole(session.user.role);
            const unauthorizedRedirectUrl = createLocalizedUrl(defaultRoute, locale, request.url);
            console.log('🔄 Redirecting to authorized route:', unauthorizedRedirectUrl);
            return NextResponse.redirect(unauthorizedRedirectUrl);
        }

        console.log('✅ User has permission for this route');
        return intlResponse;

    } catch (error) {
        console.error('❌ Error in middleware:', error);
        // On error, redirect to login for safety
        const loginUrl = createLocalizedUrl('/login', locale, request.url);
        console.log('🔄 Error occurred, redirecting to login:', loginUrl);
        return NextResponse.redirect(loginUrl);
    }
}

export const config = {
    runtime: "nodejs",
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - api routes (handled separately)
         */
        '/((?!_next/static|_next/image|favicon.ico|api).*)',
    ],
};