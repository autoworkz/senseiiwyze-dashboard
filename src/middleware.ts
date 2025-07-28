import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

// /**
//  * B2B2C Engine Middleware with Better Auth Integration
//  * 
//  * Provides authentication and role-based route protection for the three user types:
//  * - CEO (learner): /me/* routes - Personal development and learning
//  * - Worker (admin): /team/* routes - Team management and coordination  
//  * - Frontliner (executive): /org/* routes - Organization oversight and strategy
//  */

// /**
//  * Public routes that don't require authentication
//  */
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
    console.log('🔥 Middleware entered');

    const { pathname } = request.nextUrl;
    
    console.log('🚀 Middleware running for:', pathname);
    
    // return NextResponse.next();
    // // Skip middleware for static files and API routes
    if (pathname.startsWith('/_next') || 
        pathname.startsWith('/api') || 
        pathname === '/favicon.ico') {
        return NextResponse.next();
    }
    
    // Skip middleware for public routes
    if (isPublicRoute(pathname)) {
        console.log('✅ Public route, allowing access');
        return NextResponse.next();
    }
    

    // console.log('🔐 Protected route detected, checking authentication...');
    
    try {
        // Get session using Better Auth's recommended approach for Next.js 15+
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            console.log('❌ No session found, redirecting to login');
            return NextResponse.redirect(new URL('/login', request.url));
        }

        console.log('✅ Session found for user:', session.user.email);
        console.log('👤 User role:', session.user.role);

        // Handle auth routes (login/signup) - redirect authenticated users
        const authRoutes = ['/login', '/signup'];
        if (authRoutes.includes(pathname)) {
            const defaultRoute = getDefaultRouteForRole(session.user.role);
            console.log('🔄 Authenticated user accessing auth route, redirecting to:', defaultRoute);
            return NextResponse.redirect(new URL(defaultRoute, request.url));
        }

        // Check role-based access for protected routes
        if (!canAccessRoute(session.user.role, pathname)) {
            console.log('🚫 User does not have permission for this route');
            const defaultRoute = getDefaultRouteForRole(session.user.role);
            return NextResponse.redirect(new URL(defaultRoute, request.url));
        }

        console.log('✅ User has permission for this route');
        return NextResponse.next();

    } catch (error) {
        console.error('❌ Error in middleware:', error);
        // On error, redirect to login for safety
        return NextResponse.redirect(new URL('/login', request.url));
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