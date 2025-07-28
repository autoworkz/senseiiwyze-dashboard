import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import chalk from 'chalk';
// import chalk from 'chalk';

/**
 * B2B2C Engine Middleware
 * 
 * Provides authentication and role-based route protection for the three user types:
 * - CEO (learner): /me/* routes - Personal development and learning
 * - Worker (admin): /team/* routes - Team management and coordination  
 * - Frontliner (executive): /org/* routes - Organization oversight and strategy
 */

/**
 * Role-based route mapping for the B2B2C engine
 */
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
} as const;

/**
 * Public routes that don't require authentication
 */
const publicRoutes = [
    '/',
    '/login',
    '/signup', 
    '/auth',
    '/api/auth',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/unauthorized'
];

/**
 * API routes that should bypass role-based checks
 */
const apiRoutes = [
    '/api/auth',
    '/api/debug'
];

/**
 * Check if a route is public (doesn't require authentication)
 */
function isPublicRoute(pathname: string): boolean {
    return publicRoutes.some(route => 
        pathname === route || pathname.startsWith(route + '/')
    );
}

/**
 * Check if a route is an API route that should bypass role checks
 */
function isApiRoute(pathname: string): boolean {
    return apiRoutes.some(route => 
        pathname.startsWith(route)
    );
}

/**
 * Check if user role can access the requested route
 */
function canAccessRoute(userRole: string | undefined | null, pathname: string): boolean {
    if (!userRole) return false;
    
    // Handle multiple roles (comma-separated)
    const userRoles = userRole.split(',').map(r => r.trim());
    
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
 * Get default route for user role
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
    console.log(chalk.red('middleware'));
    // console.log(chalk.blue('pathname', pathname));
    // console.log(chalk.green('authRoutes', authRoutes));
    const { pathname } = request.nextUrl;
    
    const authRoutes = ['/login', '/signup'];
    if (authRoutes.includes(pathname)) {
        try {
            const session = await auth.api.getSession({
                headers: request.headers,
            });

            if (session) {
                const defaultRoute = getDefaultRouteForRole(session.user?.role || 'learner');
                return NextResponse.redirect(new URL(defaultRoute, request.url));
            }
        } catch (error) {
            console.error('Auth route check error:', error);
            // Continue to page if error
        }
        return NextResponse.next();
    }

    // Skip middleware for public routes
    if (isPublicRoute(pathname)) {
        return NextResponse.next();
    }
    
    // Skip role-based checks for API routes  
    if (isApiRoute(pathname)) {
        return NextResponse.next();
    }
    
    try {
        // Get session from Better Auth
        const session = await auth.api.getSession({
            headers: request.headers,
        });

        // Redirect to login if no session
        if (!session) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('callbackUrl', pathname);
            return NextResponse.redirect(loginUrl);
        }

        const userRole = session.user?.role || undefined;
        
        // Redirect to appropriate dashboard if accessing root dashboard routes
        if (pathname === '/dashboard') {
            const defaultRoute = getDefaultRouteForRole(userRole || 'learner');
            return NextResponse.redirect(new URL(defaultRoute, request.url));
        }
        
        // Check role-based access for protected routes
        if (pathname.startsWith('/me') || pathname.startsWith('/team') || pathname.startsWith('/org')) {
            if (!canAccessRoute(userRole, pathname)) {
                // Redirect to user's appropriate dashboard instead of unauthorized page
                const defaultRoute = getDefaultRouteForRole(userRole || 'learner');
                return NextResponse.redirect(new URL(defaultRoute, request.url));
            }
        }
        
        return NextResponse.next();
        
    } catch (error) {
        console.error('Middleware error:', error);
        
        // On error, redirect to login
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }
}

/**
 * Middleware configuration
 * Define which paths should be processed by this middleware
 */
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (public folder)
         */
        '/((?!_next/static|_next/image|favicon.ico|public/).*)',
    ],
};

/**
 * B2B2C Engine Route Protection Summary
 * 
 * CEO (learner):
 * - Access: /me/* routes only
 * - Redirect: Other roles accessing /me/* → their appropriate dashboard
 * - Default: /me (personal development dashboard)
 * 
 * Worker (admin):  
 * - Access: /team/* routes only
 * - Redirect: Other roles accessing /team/* → their appropriate dashboard
 * - Default: /team (team management dashboard)
 * 
 * Frontliner (executive):
 * - Access: /org/* routes only  
 * - Redirect: Other roles accessing /org/* → their appropriate dashboard
 * - Default: /org (organizational dashboard)
 * 
 * Multi-role users:
 * - Access routes for any of their assigned roles
 * - Default route determined by primary (first) role
 */