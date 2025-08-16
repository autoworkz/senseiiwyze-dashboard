import { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Users,
  UserCircle,
  MessageSquare,
  CheckSquare,
  BookOpen,
  Settings
} from 'lucide-react'

export interface NavigationItem {
  title: string
  href: string
  icon?: LucideIcon
  description?: string
  children?: NavigationItem[]
  badge?: string
  external?: boolean
  requiredRole?: string[]
}

export interface NavigationContext {
  key: 'dashboard' | 'platform' | 'enterprise' | 'coach' | 'learner' | 'institution';
  title: string;
  description: string;
  basePath: string;
  roles: string[];
}

// Define the navigation contexts including unified dashboard
export const navigationContexts: NavigationContext[] = [
  {
    key: 'dashboard',
    title: 'Dashboard',
    description: 'Unified dashboard for all users',
    basePath: '/app',
    roles: ['learner', 'admin', 'executive', 'ceo', 'worker', 'frontliner', 'coach', 'platform-admin'] // All roles
  }
];

// Unified Dashboard Navigation (Main app navigation)
export const dashboardNavigation: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/app",
    icon: BarChart3,
    description: "Executive overview and key metrics"
  },
  // {
  //   title: "Analytics",
  //   href: "/app/analytics",  
  //   icon: BarChart3,
  //   description: "Detailed analytics and insights"
  // },
  {
    title: "Users",
    href: "/app/users",
    icon: Users,
    description: "User management and oversight"
  },
  // {
  //   title: "Team",
  //   href: "/app/team",
  //   icon: Users,
  //   description: "Team management and oversight",
  //   children: [
  //     {
  //       title: "Team Overview",
  //       href: "/app/team",
  //       icon: Users,
  //       description: "Team dashboard and overview"
  //     },
  //     {
  //       title: "Team Profile",
  //       href: "/app/team/profile",
  //       icon: UserCircle,
  //       description: "Team member profiles"
  //     },
  //     {
  //       title: "Courses",
  //       href: "/app/team/courses",
  //       icon: BookOpen,
  //       description: "Course management"
  //     },
  //     {
  //       title: "Tasks",
  //       href: "/app/team/tasks",
  //       icon: CheckSquare,
  //       description: "Team tasks and assignments"
  //     },
  //     {
  //       title: "Messages",
  //       href: "/app/team/messages",
  //       icon: MessageSquare,
  //       description: "Team communication"
  //     }
  //   ]
  // },
  {
    title: "Settings",
    href: "/app/settings",
    icon: Settings,
    description: "Account settings and preferences"
  }
];


// Map navigation items by context
export const navigationByContext = {
  dashboard: dashboardNavigation,
};

// Role to stakeholder context mapping - all roles use dashboard now
export const roleToContextMapping = {
  'admin': 'dashboard',
  'platform-admin': 'dashboard', 
  'super-admin': 'dashboard',
  'enterprise': 'dashboard',
  'corporate': 'dashboard',
  'l&d-director': 'dashboard',
  'executive': 'dashboard',
  'frontliner': 'dashboard',
  'ceo': 'dashboard',
  'coach': 'dashboard',
  'mentor': 'dashboard',
  'team-lead': 'dashboard',
  'worker': 'dashboard',
  'learner': 'dashboard',
  'student': 'dashboard',
  'professional': 'dashboard',
  'institution': 'dashboard',
  'academic': 'dashboard',
  'program-director': 'dashboard',
  'university': 'dashboard',
} as const;

/**
 * Get the appropriate dashboard context for a user's role
 */
export function getDashboardContextForRole(role: string): NavigationContext {
  return navigationContexts[0]; // Always return the unified dashboard
}

/**
 * Get the default dashboard route for a user's role
 */
export function getDefaultDashboardRoute(role: string): string {
  return '/app'; // Always return the unified dashboard route
}

/**
 * Determine current dashboard context from pathname
 */
export function getCurrentContext(pathname: string): NavigationContext | null {
  for (const context of navigationContexts) {
    if (pathname.startsWith(context.basePath)) {
      return context;
    }
  }
  return null;
}

/**
 * Get navigation items for the current context
 */
export function getNavigationForContext(contextKey: string, userRole?: string): NavigationItem[] {
  return navigationByContext[contextKey as keyof typeof navigationByContext] || [];
}

/**
 * Check if user can access a specific context
 */
export function canUserAccessContext(userRole: string, context: NavigationContext): boolean {
  return context.roles.includes(userRole);
}

/**
 * Get all accessible contexts for a user
 */
export function getAccessibleContexts(userRole: string): NavigationContext[] {
  return navigationContexts.filter(context => canUserAccessContext(userRole, context));
}

/**
 * Helper function to get navigation item by path
 */
export function getNavigationItemByPath(
  path: string, 
  items: NavigationItem[] = dashboardNavigation
): NavigationItem | null {
  for (const item of items) {
    if (item.href === path) {
      return item;
    }
    if (item.children) {
      const found = getNavigationItemByPath(path, item.children);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Helper function to get breadcrumb trail
 */
export function getBreadcrumbTrail(path: string): NavigationItem[] {
  const trail: NavigationItem[] = [];
  const segments = path.split('/').filter(Boolean);
  
  let currentPath = '';
  for (const segment of segments) {
    currentPath += `/${segment}`;
    
    // Try to find in dashboard navigation
    let item = getNavigationItemByPath(currentPath, dashboardNavigation);
    
    if (item) {
      trail.push(item);
    } else {
      // Create a default item for unmatched segments
      trail.push({
        title: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
        href: currentPath,
        icon: Settings,
      });
    }
  }
  
  return trail;
}

/**
 * Helper function to check if a navigation item is active
 */
export function isNavigationItemActive(item: NavigationItem, currentPath: string): boolean {
  // Exact match always wins
  if (item.href === currentPath) return true;
  
  // For items with children, check if any child is active
  if (item.children && item.children.length > 0) {
    return item.children.some(child => isNavigationItemActive(child, currentPath));
  }
  
  // No fuzzy matching - only exact matches or active children
  return false;
}
