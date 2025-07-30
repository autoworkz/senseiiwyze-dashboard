import { createAuthClient } from "better-auth/react";
import {
    twoFactorClient,
    usernameClient,
    anonymousClient,
    magicLinkClient,
    emailOTPClient,
    apiKeyClient,
    adminClient,
    organizationClient,
    multiSessionClient,
    inferAdditionalFields,
    // phoneNumberClient
} from "better-auth/client/plugins";
import type { auth } from "./auth";
import { authLogger } from '@/lib/logger-client';

// Import B2B2C access control system for client-side usage
import { 
    ac, 
    ceo, 
    worker, 
    frontliner, 
    learner, 
    admin as adminRole, 
    executive 
} from "./permissions";

/**
 * Better Auth client configuration for the frontend
 * Matches the server configuration with corresponding client plugins
 */
export const authClient = createAuthClient({
    /**
     * Base URL for the auth server
     * Optional if client and server are on the same domain
     */
    baseURL: process.env.NODE_ENV === "production" 
        ? process.env.NEXT_PUBLIC_APP_URL 
        : "http://localhost:3000",
    
    /**
     * Global fetch options for all auth requests
     * Configure error handling, retries, and request/response interceptors
     */
    fetchOptions: {
        onError: async (context) => {
            const { response, request } = context;
            
            // Handle rate limiting
            if (response.status === 429) {
                const retryAfter = response.headers.get("X-Retry-After");
                authLogger.warn('Rate limit exceeded', { retryAfter, url: request.url });
            }
            
            // Handle authentication errors
            if (response.status === 401) {
                authLogger.warn('Authentication failed', { url: request.url });
            }
            
            // Handle server errors
            if (response.status >= 500) {
                authLogger.error('Server error during auth request', { status: response.status, url: request.url });
            }
        },
        onSuccess: async (context) => {
            const { response } = context;
            
            // Log successful auth operations in development
            if (process.env.NODE_ENV === "development") {
                authLogger.info('Auth operation successful', { url: response.url });
            }
        },
    },
    
    /**
     * Client plugins that correspond to server plugins
     * Must match the plugins configured in auth.ts
     */
    plugins: [
        // Multi-session client plugin

        multiSessionClient(),
        
        // Organization client plugin for team/workspace management with B2B2C access control
        organizationClient({
            ac,
            roles: {
                // B2B2C primary roles
                ceo,
                worker,
                frontliner,
                // Legacy compatibility roles
                learner,
                admin: adminRole,
                executive
            }
        }),
        
        // Admin client plugin for administrative operations with B2B2C access control
        adminClient({
            ac,
            roles: {
                // B2B2C primary roles
                ceo,
                worker,
                frontliner,
                // Legacy compatibility roles
                learner,
                admin: adminRole,
                executive
            }
        }),
        
        // API key client plugin for programmatic access
        apiKeyClient(),
        
        // Email OTP client plugin for one-time password authentication
        emailOTPClient(),
        
        // Magic link client plugin for passwordless authentication
        magicLinkClient(),
        
        // Anonymous client plugin for guest authentication
        anonymousClient(),
        
        // Username client plugin for username-based authentication
        usernameClient(),
        
        // Two-factor authentication client plugin
        twoFactorClient({
            onTwoFactorRedirect: () => {
                // Handle redirect to 2FA page
                window.location.href = "/auth/two-factor";
            }
        }),
        
        // Infer additional fields from server configuration
        // This provides type safety for custom fields and server extensions
        inferAdditionalFields<typeof auth>(),
    ],
});

/**
 * Core authentication methods
 * Export the main sign-in/sign-up methods for convenience
 */
export const signIn = authClient.signIn;
export const signUp = authClient.signUp;
export const signOut = authClient.signOut;

/**
 * React hooks for session management
 */
export const useSession = authClient.useSession;

/**
 * Organization management
 * Access organization-related functionality
 */
export const organization = authClient.organization;

/**
 * Admin functionality
 * Access admin-related operations
 */
export const admin = authClient.admin;

/**
 * Two-factor authentication
 */
export const twoFactor = authClient.twoFactor;

/**
 * API key management
 */
export const apiKey = authClient.apiKey;

/**
 * Multi-session management
 */
export const multiSession = authClient.multiSession;

/**
 * Type inference from the auth client
 * Use these types in your components
 */
export type Session = typeof authClient.$Infer.Session;

/**
 * Auth client instance with all configured plugins
 * Use this for direct access to the full client API
 */
export { authClient as client };

/**
 * CLIENT-SIDE ROLE & PERMISSIONS MANAGEMENT
 * Helper functions for role identification and permission checking
 */

/**
 * Get the current user's role from the session
 */
export function getCurrentUserRole(): string | null {
  const session = authClient.useSession();
  return session.data?.user?.role || null;
}

/**
 * Check if the current user has a specific role
 */
export function hasRole(role: string): boolean {
  const currentRole = getCurrentUserRole();
  if (!currentRole) return false;
  
  // Handle comma-separated roles (multi-role support)
  const userRoles = currentRole.split(',').map(r => r.trim());
  return userRoles.includes(role);
}

/**
 * Check if the current user has any of the specified roles
 */
export function hasAnyRole(roles: string[]): boolean {
  return roles.some(role => hasRole(role));
}

/**
 * Check if the current user has all of the specified roles
 */
export function hasAllRoles(roles: string[]): boolean {
  return roles.every(role => hasRole(role));
}

/**
 * B2B2C Role Checking Functions
 */
export const roleCheckers = {
  // Primary B2B2C roles
  isCEO: () => hasRole('ceo') || hasRole('learner'),
  isWorker: () => hasRole('worker') || hasRole('admin'),
  isFrontliner: () => hasRole('frontliner') || hasRole('executive'),
  
  // Legacy compatibility
  isLearner: () => hasRole('learner') || hasRole('ceo'),
  isAdmin: () => hasRole('admin') || hasRole('worker'),
  isExecutive: () => hasRole('executive') || hasRole('frontliner'),
  
  // Permission-based checks
  canManageTeam: () => hasAnyRole(['worker', 'admin', 'frontliner', 'executive']),
  canViewOrganization: () => hasAnyRole(['frontliner', 'executive']),
  canManageUsers: () => hasAnyRole(['worker', 'admin', 'frontliner', 'executive']),
  canAccessPersonalData: () => hasAnyRole(['ceo', 'learner', 'worker', 'admin', 'frontliner', 'executive']),
};

/**
 * Client-side orchestration for server-side permission checking
 * These functions make API calls to your server to verify permissions
 */

/**
 * Check a single permission by calling the server
 */
export async function checkPermission(resource: string, action: string): Promise<boolean> {
  try {
    const session = authClient.useSession();
    if (!session.data?.user?.id) return false;

    // Make API call to your server's permission endpoint
    const response = await fetch('/api/auth/permissions/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resource,
        action,
      }),
    });

    if (!response.ok) {
      authLogger.warn('Permission check failed', { status: response.status, resource, action });
      return false;
    }

    const result = await response.json() as { hasPermission?: boolean };
    return result.hasPermission || false;
  } catch (error) {
    authLogger.error('Permission check error', error instanceof Error ? error : new Error(String(error)));
    return false;
  }
}

/**
 * Check multiple permissions in a single server call for efficiency
 */
export async function checkMultiplePermissions(
  permissions: Record<string, string[]>
): Promise<Record<string, boolean>> {
  try {
    const session = authClient.useSession();
    if (!session.data?.user?.id) {
      // Return false for all permissions if not authenticated
      return Object.keys(permissions).reduce((acc, resource) => {
        permissions[resource].forEach(action => {
          acc[`${resource}.${action}`] = false;
        });
        return acc;
      }, {} as Record<string, boolean>);
    }

    // Make API call to your server's batch permission endpoint
    const response = await fetch('/api/auth/permissions/batch-check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ permissions }),
    });

    if (!response.ok) {
      authLogger.warn('Batch permission check failed', { status: response.status, permissions: permissions.length });
      // Return false for all permissions on error
      return Object.keys(permissions).reduce((acc, resource) => {
        permissions[resource].forEach(action => {
          acc[`${resource}.${action}`] = false;
        });
        return acc;
      }, {} as Record<string, boolean>);
    }

    const result = await response.json() as { permissions?: Record<string, boolean> };
    return result.permissions || {};
  } catch (error) {
    authLogger.error('Batch permission check error', error instanceof Error ? error : new Error(String(error)));
    // Return false for all permissions on error
    return Object.keys(permissions).reduce((acc, resource) => {
      permissions[resource].forEach(action => {
        acc[`${resource}.${action}`] = false;
      });
      return acc;
    }, {} as Record<string, boolean>);
  }
}

/**
 * Resource-specific permission helpers for common UI checks
 */
export const permissions = {
  // Personal data permissions (CEO/learner focus)
  personal: {
    canView: () => checkPermission('personal', 'view'),
    canUpdate: () => checkPermission('personal', 'update'),
    canManageGoals: () => checkPermission('personal', 'goals'),
    canAccessGames: () => checkPermission('personal', 'games'),
    canViewLearning: () => checkPermission('personal', 'learning'),
  },
  
  // Team data permissions (Worker/admin focus)
  team: {
    canView: () => checkPermission('team', 'view'),
    canManage: () => checkPermission('team', 'manage'),
    canViewTasks: () => checkPermission('team', 'tasks'),
    canManageCourses: () => checkPermission('team', 'courses'),
    canViewMessages: () => checkPermission('team', 'messages'),
    canViewAnalytics: () => checkPermission('team', 'analytics'),
  },
  
  // Organization permissions (Frontliner/executive focus)
  organization: {
    canView: () => checkPermission('organization', 'view'),
    canManage: () => checkPermission('organization', 'manage'),
    canViewReports: () => checkPermission('organization', 'reports'),
    canManagePresentation: () => checkPermission('organization', 'presentation'),
    canViewStrategy: () => checkPermission('organization', 'strategy'),
  },
  
  // User management permissions
  user: {
    canView: () => checkPermission('user', 'view'),
    canCreate: () => checkPermission('user', 'create'),
    canUpdate: () => checkPermission('user', 'update'),
    canDelete: () => checkPermission('user', 'delete'),
    canAssignRole: () => checkPermission('user', 'assign-role'),
  },
  
  // Analytics permissions
  analytics: {
    canView: () => checkPermission('analytics', 'view'),
    canExport: () => checkPermission('analytics', 'export'),
    canViewDashboard: () => checkPermission('analytics', 'dashboard'),
    canViewInsights: () => checkPermission('analytics', 'insights'),
  },
  
  // System permissions
  system: {
    canManageSettings: () => checkPermission('system', 'settings'),
    canManageIntegrations: () => checkPermission('system', 'integrations'),
    canManageSecurity: () => checkPermission('system', 'security'),
    canViewAudit: () => checkPermission('system', 'audit'),
  },
};

/**
 * Navigation helpers for role-based routing
 */
export const navigation = {
  /**
   * Get the default dashboard route for the current user's role
   */
  getDefaultDashboardRoute(): string {
    if (roleCheckers.isCEO()) return '/me';
    if (roleCheckers.isWorker()) return '/team';
    if (roleCheckers.isFrontliner()) return '/org';
    return '/me'; // Fallback to personal dashboard
  },
  
  /**
   * Check if the current user can access a specific route
   */
  canAccessRoute(route: string): boolean {
    const normalizedRoute = route.toLowerCase();
    
    if (normalizedRoute.startsWith('/me')) {
      return roleCheckers.canAccessPersonalData();
    }
    
    if (normalizedRoute.startsWith('/team')) {
      return roleCheckers.canManageTeam();
    }
    
    if (normalizedRoute.startsWith('/org')) {
      return roleCheckers.canViewOrganization();
    }
    
    // Allow access to other routes by default
    return true;
  },
  
  /**
   * Get all accessible routes for the current user
   */
  getAccessibleRoutes(): string[] {
    const routes: string[] = [];
    
    if (roleCheckers.canAccessPersonalData()) {
      routes.push('/me');
    }
    
    if (roleCheckers.canManageTeam()) {
      routes.push('/team');
    }
    
    if (roleCheckers.canViewOrganization()) {
      routes.push('/org');
    }
    
    return routes;
  },
};

/**
 * Session utilities
 */
export const sessionUtils = {
  /**
   * Get the current user's organization ID
   */
  getOrganizationId(): string | null {
    const session = authClient.useSession();
    return session.data?.session?.activeOrganizationId || null;
  },
  
  /**
   * Get the current user's full profile
   */
  getCurrentUser() {
    const session = authClient.useSession();
    if (!session.data?.user) return null;
    
    return {
      id: session.data.user.id,
      name: session.data.user.name,
      email: session.data.user.email,
      role: session.data.user.role || 'learner',
      organizationId: session.data.session?.activeOrganizationId,
      isAuthenticated: true,
    };
  },
  
  /**
   * Check if the user is authenticated
   */
  isAuthenticated(): boolean {
    const session = authClient.useSession();
    return !!session.data?.user?.id;
  },
};

/**
 * Client-side permission checking utilities
 * Safe for use in Zustand stores and client components
 */
export const clientPermissions = {
  /**
   * Check if the current user has specific permissions (client-side)
   * This is a simplified version that uses role-based checks
   */
  checkUserPermission(resource: string, action: string): boolean {
    try {
      const user = sessionUtils.getCurrentUser();
      if (!user) return false;

      // Map common resource/action combinations to role checks
      switch (resource) {
        case 'personal':
          return roleCheckers.canAccessPersonalData();
        
        case 'team':
          if (action === 'view' || action === 'analytics' || action === 'courses' || action === 'messages') {
            return roleCheckers.canManageTeam();
          }
          return false;
        
        case 'organization':
          if (action === 'view' || action === 'reports' || action === 'strategy') {
            return roleCheckers.canViewOrganization();
          }
          return false;
        
        case 'user':
          if (action === 'update') {
            return roleCheckers.canManageUsers();
          }
          return false;
        
        case 'system':
          if (action === 'audit') {
            return roleCheckers.isCEO() || roleCheckers.isAdmin();
          }
          return false;
        
        case 'analytics':
          if (action === 'dashboard') {
            return roleCheckers.canAccessPersonalData();
          }
          if (action === 'export') {
            return roleCheckers.canViewOrganization();
          }
          return false;
        
        default:
          // Default to allowing access for unknown resources
          authLogger.warn('Unknown resource or action in permission check', { resource, action });
          return true;
      }
    } catch (error) {
      authLogger.error('Client-side permission check error', error instanceof Error ? error : new Error(String(error)));
      return false;
    }
  },

  /**
   * Batch check multiple permissions at once
   */
  checkMultiplePermissions(checks: Array<{resource: string, action: string}>): boolean[] {
    return checks.map(({resource, action}) => 
      this.checkUserPermission(resource, action)
    );
  },

  /**
   * Check if user can access a specific dashboard section
   */
  canAccessDashboard(section: 'personal' | 'team' | 'organization'): boolean {
    switch (section) {
      case 'personal':
        return this.checkUserPermission('personal', 'view');
      case 'team':
        return this.checkUserPermission('team', 'view');
      case 'organization':
        return this.checkUserPermission('organization', 'view');
      default:
        return false;
    }
  },
};

/**
 * Default export for convenience
 */
export default authClient;