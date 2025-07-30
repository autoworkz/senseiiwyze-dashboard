import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { middlewareLogger } from "@/lib/logger";

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
  "/", // Landing page - accessible to everyone
  "/auth/login",
  "/auth/signup",
  "/auth",
  "/api/auth",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/unauthorized",
];

/**
 * Sentry and monitoring routes that should bypass all middleware checks
 */
const sentryRoutes = [
  "/monitoring", // Sentry tunnel route configured in next.config.ts
  "/_sentry", // Sentry internal routes
  "/api/sentry", // Sentry API endpoints
  "/api/sentry-tunnel", // Alternative Sentry tunnel
  "/api/monitoring", // Alternative monitoring endpoint
  "/_monitoring", // Additional monitoring variants
  "/sentry", // Direct Sentry routes
  "/api/telemetry", // Telemetry endpoints
  "/api/errors", // Error reporting endpoints
  "/api/performance", // Performance monitoring
  "/api/replay", // Session replay endpoints
  "/sentry-example-page", // Sentry example page
];

// Create next-intl middleware using the routing configuration
const intlMiddleware = createMiddleware(routing);

/**
 * Extract locale from pathname and return both locale and pathname without locale
 */
function parseLocaleFromPath(pathname: string): {
  locale: string | null;
  pathnameWithoutLocale: string;
} {
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment && routing.locales.includes(firstSegment as any)) {
    return {
      locale: firstSegment,
      pathnameWithoutLocale: "/" + segments.slice(1).join("/") || "/",
    };
  }

  return {
    locale: null,
    pathnameWithoutLocale: pathname,
  };
}

/**
 * Create a locale-aware URL
 */
function createLocalizedUrl(
  path: string,
  locale: string | null,
  baseUrl: string,
): string {
  // Use default locale if none provided
  const targetLocale = locale || "en";

  // Always add locale prefix for 'always' strategy
  const localizedPath = path.startsWith("/")
    ? `/${targetLocale}${path}`
    : `/${targetLocale}/${path}`;
  return new URL(localizedPath, baseUrl).toString();
}

/**
 * Check if a route is public (doesn't require authentication)
 */
function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );
}

/**
 * Check if a route is a Sentry/monitoring route that should bypass all checks
 */
function isSentryRoute(pathname: string): boolean {
  return sentryRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );
}

/**
 * Check if user role can access the requested route
 */
function canAccessRoute(
  userRole: string | undefined | null,
  pathname: string,
): boolean {
  if (!userRole) return false;

  // Handle multiple roles (comma-separated)
  const userRoles = userRole.split(",").map((r) => r.trim());

  // Stakeholder-based role mapping
  const roleRouteMapping = {
    // Platform administration
    admin: ["/platform"],
    "platform-admin": ["/platform"],
    "super-admin": ["/platform"],

    // Enterprise/Corporate L&D
    enterprise: ["/enterprise"],
    corporate: ["/enterprise"],
    "l&d-director": ["/enterprise"],
    executive: ["/enterprise"],
    frontliner: ["/enterprise"],
    ceo: ["/enterprise"],

    // Coaching
    coach: ["/coach"],
    mentor: ["/coach"],
    "team-lead": ["/coach"],
    worker: ["/coach"],

    // Learning (all roles can access their personal learning)
    learner: ["/learner"],
    student: ["/learner"],
    professional: ["/learner"],

    // Academic institutions
    institution: ["/institution"],
    academic: ["/institution"],
    "program-director": ["/institution"],
    university: ["/institution"],
  };

  // Special access: Allow all authenticated users to access shared routes
  if (pathname.startsWith("/shared")) {
    return true;
  }

  // Special access: All roles can access learner routes for personal development
  if (pathname.startsWith("/learner")) {
    return true;
  }

  // Check if any of the user's roles allow access to this route
  for (const role of userRoles) {
    const allowedRoutes =
      roleRouteMapping[role as keyof typeof roleRouteMapping];
    if (allowedRoutes?.some((route) => pathname.startsWith(route))) {
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
    return "/learner"; // Default to learner dashboard
  }
  const roles = userRole.split(",").map((r) => r.trim());
  const primaryRole = roles[0];

  switch (primaryRole) {
    // Platform administration
    case "admin":
    case "platform-admin":
    case "super-admin":
      return "/platform";

    // Enterprise/Corporate L&D
    case "enterprise":
    case "corporate":
    case "l&d-director":
    case "executive":
    case "frontliner":
    case "ceo":
      return "/enterprise";

    // Coaching
    case "coach":
    case "mentor":
    case "team-lead":
    case "worker":
      return "/coach";

    // Learning
    case "learner":
    case "student":
    case "professional":
      return "/learner";

    // Academic institutions
    case "institution":
    case "academic":
    case "program-director":
    case "university":
      return "/institution";

    default:
      return "/learner"; // Default to learner dashboard
  }
}

export async function middleware(request: NextRequest) {
  middlewareLogger.debug("Middleware entered");

  const { pathname } = request.nextUrl;

  middlewareLogger.info("Middleware running for path", { pathname });

  // FIRST: Skip middleware for Sentry/monitoring routes (highest priority)
  if (isSentryRoute(pathname)) {
    middlewareLogger.debug(
      "Sentry/monitoring route detected, bypassing checks",
      { pathname },
    );
    return NextResponse.next();
  }

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico"
  ) {
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

  middlewareLogger.debug("Locale detection completed", {
    locale: locale || "none (default)",
    pathnameWithoutLocale,
  });

  // Skip middleware for public routes (check without locale)
  if (isPublicRoute(pathnameWithoutLocale)) {
    middlewareLogger.debug("Public route access granted", {
      route: pathnameWithoutLocale,
    });
    return intlResponse;
  }

  middlewareLogger.info("Protected route authentication check", {
    route: pathnameWithoutLocale,
  });

  try {
    // Get session using Better Auth's recommended approach for Next.js 15+
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      middlewareLogger.info("No session found, redirecting to login", {
        route: pathnameWithoutLocale,
      });
      const loginUrl = createLocalizedUrl("/auth/login", locale, request.url);
      return NextResponse.redirect(loginUrl);
    }

    middlewareLogger.info("Session found for user", {
      email: session.user.email,
      role: session.user.role,
      route: pathnameWithoutLocale,
    });

    // Root route is now public - authenticated users can visit landing page
    // Remove automatic redirect to dashboard for root route

    // Handle auth routes (login/signup) - redirect authenticated users to their dashboard
    const authRoutes = ["/auth/login", "/auth/signup"];
    if (authRoutes.includes(pathnameWithoutLocale)) {
      const defaultRoute = getDefaultRouteForRole(session.user.role);
      const dashboardUrl = createLocalizedUrl(
        defaultRoute,
        locale,
        request.url,
      );
      middlewareLogger.info("Authenticated user redirected from auth route", {
        email: session.user.email,
        redirectTo: dashboardUrl,
      });
      return NextResponse.redirect(dashboardUrl);
    }

    // Check role-based access for protected routes (check without locale)
    if (!canAccessRoute(session.user.role, pathnameWithoutLocale)) {
      middlewareLogger.warn("User access denied for route", {
        email: session.user.email,
        role: session.user.role,
        route: pathnameWithoutLocale,
      });
      const defaultRoute = getDefaultRouteForRole(session.user.role);
      const unauthorizedRedirectUrl = createLocalizedUrl(
        defaultRoute,
        locale,
        request.url,
      );
      middlewareLogger.info("User redirected to authorized route", {
        email: session.user.email,
        redirectTo: unauthorizedRedirectUrl,
      });
      return NextResponse.redirect(unauthorizedRedirectUrl);
    }

    middlewareLogger.debug("User authorized for route", {
      email: session.user.email,
      role: session.user.role,
      route: pathnameWithoutLocale,
    });
    return intlResponse;
  } catch (error) {
    middlewareLogger.error(
      "Middleware error occurred",
      error instanceof Error ? error : new Error(String(error)),
    );
    // On error, redirect to login for safety
    const loginUrl = createLocalizedUrl("/auth/login", locale, request.url);
    middlewareLogger.info("Error recovery: redirecting to login", { loginUrl });
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
     * - sentry-example-page (Sentry example page)
     */
    "/((?!_next/static|_next/image|favicon.ico|api|sentry-example-page).*)",
  ],
};
