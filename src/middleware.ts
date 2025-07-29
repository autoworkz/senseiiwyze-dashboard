import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import createMiddleware from 'next-intl/middleware';
import { locales } from '@/i18n';

/**
 * B2B2C Stakeholder-Based Middleware with Better Auth Integration & i18n
 * 
 * Provides authentication and role-based route protection with full internationalization:
 * - Platform Admins: /platform/* routes - Internal platform operations
 * - Enterprise L&D: /enterprise/* routes - Corporate learning and ROI management  
 * - Coaches: /coach/* routes - Team management and learner coaching
 * - Learners: /learner/* routes - Individual learning and skill development
 * - Institutions: /institution/* routes - Academic program management
 * 
 * All routes are locale-aware and properly redirect with locale prefixes.
 */

/**
 * Public routes that don't require authentication (without locale prefix)
 */
const publicRoutes = [
    '/',                // Landing page - accessible to everyone
    '/auth/login',
    '/auth/signup', 
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
    localePrefix: 'always'
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
    // Use default locale if none provided
    const targetLocale = locale || 'en';
    
    // Always add locale prefix for 'always' strategy
    const localizedPath = path.startsWith('/') ? `/${targetLocale}${path}` : `/${targetLocale}/${path}`;
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

/**
 * Check if user role can access the requested route
 */
function canAccessRoute(userRole: string | undefined | null, pathname: string): boolean {
    if (!userRole) return false;
    
    // Handle multiple roles (comma-separated)
    const userRoles = userRole.split(',').map(r => r.trim());
    
    // Stakeholder-based role mapping
    const roleRouteMapping = {
        // Platform administration
        'admin': ['/platform'],
        'platform-admin': ['/platform'], 
        'super-admin': ['/platform'],
        
        // Enterprise/Corporate L&D
        'enterprise': ['/enterprise'],
        'corporate': ['/enterprise'],
        'l&d-director': ['/enterprise'],
        'executive': ['/enterprise'],
        'frontliner': ['/enterprise'],
        'ceo': ['/enterprise'],
        
        // Coaching
        'coach': ['/coach'],
        'mentor': ['/coach'],
        'team-lead': ['/coach'],
        'worker': ['/coach'],
        
        // Learning (all roles can access their personal learning)
        'learner': ['/learner'],
        'student': ['/learner'],
        'professional': ['/learner'],
        
        // Academic institutions
        'institution': ['/institution'],
        'academic': ['/institution'],
        'program-director': ['/institution'],
        'university': ['/institution'],
    };
    
    // Special access: Allow all authenticated users to access shared routes
    if (pathname.startsWith('/shared')) {
        return true;
    }
    
    // Special access: All roles can access learner routes for personal development
    if (pathname.startsWith('/learner')) {
        return true;
    }
    
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
        return '/learner'; // Default to learner dashboard
    }
    const roles = userRole.split(',').map(r => r.trim());
    const primaryRole = roles[0];
    
    switch (primaryRole) {
        // Platform administration
        case 'admin':
        case 'platform-admin':
        case 'super-admin':
            return '/platform';
            
        // Enterprise/Corporate L&D
        case 'enterprise':
        case 'corporate':
        case 'l&d-director':
        case 'executive':
        case 'frontliner':
        case 'ceo':
            return '/enterprise';
            
        // Coaching
        case 'coach':
        case 'mentor':
        case 'team-lead':
        case 'worker':
            return '/coach';
            
        // Learning
        case 'learner':
        case 'student':
        case 'professional':
            return '/learner';
            
        // Academic institutions
        case 'institution':
        case 'academic':
        case 'program-director':
        case 'university':
            return '/institution';
            
        default:
            return '/learner'; // Default to learner dashboard
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
            const loginUrl = createLocalizedUrl('/auth/login', locale, request.url);
            return NextResponse.redirect(loginUrl);
        }

        console.log('✅ Session found for user:', session.user.email);
        console.log('👤 User role:', session.user.role);

        // Root route is now public - authenticated users can visit landing page
        // Remove automatic redirect to dashboard for root route

        // Handle auth routes (login/signup) - redirect authenticated users to their dashboard
        const authRoutes = ['/auth/login', '/auth/signup'];
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
        const loginUrl = createLocalizedUrl('/auth/login', locale, request.url);
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