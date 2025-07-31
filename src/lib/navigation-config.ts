import { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Users,
  FileText,
  UserCircle,
  Target,
  Gamepad2,
  GraduationCap,
  MessageSquare,
  CheckSquare,
  Presentation,
  UserCheck,
  BookOpen,
  Settings,
  CreditCard
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
    basePath: '/dashboard',
    roles: ['learner', 'admin', 'executive', 'ceo', 'worker', 'frontliner', 'coach', 'platform-admin'] // All roles
  },
  {
    key: 'platform',
    title: 'Platform Operations',
    description: 'Internal platform management and analytics',
    basePath: '/platform',
    roles: ['admin', 'platform-admin', 'super-admin']
  },
  {
    key: 'enterprise',
    title: 'Enterprise Dashboard',
    description: 'Corporate L&D and organizational oversight',
    basePath: '/enterprise',
    roles: ['enterprise', 'corporate', 'l&d-director', 'executive', 'frontliner', 'ceo']
  },
  {
    key: 'coach',
    title: 'Coach Dashboard',
    description: 'Team management and learner coaching',
    basePath: '/coach',
    roles: ['coach', 'mentor', 'team-lead', 'admin', 'worker']
  },
  {
    key: 'learner',
    title: 'Learning Dashboard',
    description: 'Individual learning and skill development',
    basePath: '/learner',
    roles: ['learner', 'student', 'professional', 'ceo', 'admin', 'executive'] // All roles can access personal learning
  },
  {
    key: 'institution',
    title: 'Institution Dashboard',
    description: 'Academic program management and student outcomes',
    basePath: '/institution',
    roles: ['institution', 'academic', 'program-director', 'university']
  }
];

// Unified Dashboard Navigation (Main app navigation)
export const dashboardNavigation: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
    description: "Executive overview and key metrics"
  },
  {
    title: "Analytics",
    href: "/analytics",  
    icon: BarChart3,
    description: "Detailed analytics and insights"
  },
  {
    title: "Team",
    href: "/team",
    icon: Users,
    description: "Team management and oversight"
  },
  {
    title: "Learning",
    href: "/learning",
    icon: BookOpen,
    description: "Learning paths and progress"
  },
  {
    title: "Coaching",
    href: "/coaching",
    icon: MessageSquare,
    description: "AI coaching and support"
  },
  {
    title: "Assessment",
    href: "/assessment",
    icon: Target,
    description: "Readiness assessment and evaluation"
  },
  {
    title: "Billing",
    href: "/billing",
    icon: CreditCard,
    description: "Subscription and usage billing"
  },
  {
    title: "Notifications",
    href: "/notifications",
    icon: FileText,
    description: "Alerts and system notifications"
  },
  {
    title: "Help",
    href: "/help",
    icon: FileText,
    description: "Help center and support"
  }
];

// Platform Dashboard Navigation (Internal operations)
export const platformNavigation: NavigationItem[] = [
  {
    title: "Platform Overview",
    href: "/platform",
    icon: BarChart3,
    description: "Platform-wide analytics and operations"
  },
  {
    title: "User Management",
    href: "/platform/users",
    icon: Users,
    description: "Manage all platform users and organizations"
  },
  {
    title: "System Analytics",
    href: "/platform/analytics",
    icon: BarChart3,
    description: "Platform usage and performance metrics"
  },
  {
    title: "Data Overview",
    href: "/platform/data-overview",
    icon: FileText,
    description: "Comprehensive data insights and reporting"
  }
];

// Enterprise Dashboard Navigation (Corporate L&D focus)
export const enterpriseNavigation: NavigationItem[] = [
  {
    title: "Enterprise Overview",
    href: "/enterprise",
    icon: BarChart3,
    description: "Corporate learning and organizational insights"
  },
  {
    title: "Organization Metrics",
    href: "/enterprise/org",
    icon: Users,
    description: "Team readiness and organizational performance"
  },
  {
    title: "Program Readiness",
    href: "/enterprise/program-readiness-dashboard",
    icon: Target,
    description: "Training program effectiveness and ROI"
  },
  {
    title: "Training Programs",
    href: "/enterprise/programs",
    icon: BookOpen,
    description: "Manage and track training initiatives"
  },
  {
    title: "Performance Reports",
    href: "/enterprise/org/reports",
    icon: FileText,
    description: "Comprehensive performance analysis"
  },
  {
    title: "Board Presentation",
    href: "/enterprise/org/presentation",
    icon: Presentation,
    description: "Executive presentation mode"
  }
];

// Coach Dashboard Navigation (Coaching and team management)
export const coachNavigation: NavigationItem[] = [
  {
    title: "Coach Overview",
    href: "/coach",
    icon: Users,
    description: "Coaching dashboard and learner insights"
  },
  {
    title: "My Learners",
    href: "/coach/team",
    icon: UserCheck,
    description: "Manage assigned learners and progress"
  },
  {
    title: "Learner Profiles",
    href: "/coach/team/profile",
    icon: UserCircle,
    description: "Individual learner profiles and details"
  },
  {
    title: "User Management",
    href: "/coach/team/users",
    icon: UserCheck,
    description: "Manage team members and assignments"
  },
  {
    title: "Coaching Tasks",
    href: "/coach/team/tasks",
    icon: CheckSquare,
    description: "Support tasks and interventions"
  },
  {
    title: "Course Management",
    href: "/coach/team/courses",
    icon: BookOpen,
    description: "Course content and learning paths"
  },
  {
    title: "Communication",
    href: "/coach/team/messages",
    icon: MessageSquare,
    description: "Team messaging and announcements"
  }
];

// Learner Dashboard Navigation (Individual learning focus)
export const learnerNavigation: NavigationItem[] = [
  {
    title: "Learning Dashboard",
    href: "/learner",
    icon: UserCircle,
    description: "Your learning dashboard and progress"
  },
  {
    title: "Personal Overview",
    href: "/learner/me",
    icon: UserCircle,
    description: "Your personal learning journey"
  },
  {
    title: "Goals & Objectives",
    href: "/learner/me/goals",
    icon: Target,
    description: "Track your learning objectives"
  },
  {
    title: "Learning Path",
    href: "/learner/me/learn",
    icon: BookOpen,
    description: "Courses and educational content"
  },
  {
    title: "Games & Engagement",
    href: "/learner/me/games",
    icon: Gamepad2,
    description: "Learning through gamification"
  },
  {
    title: "User Dashboard",
    href: "/learner/user-dashboard",
    icon: BarChart3,
    description: "Individual performance and achievements"
  }
];

// Institution Dashboard Navigation (Academic focus)
export const institutionNavigation: NavigationItem[] = [
  {
    title: "Institution Overview",
    href: "/institution",
    icon: GraduationCap,
    description: "Academic program overview and metrics"
  },
  {
    title: "Student Progress",
    href: "/institution/students",
    icon: Users,
    description: "Track student learning outcomes"
  },
  {
    title: "Program Management",
    href: "/institution/programs",
    icon: BookOpen,
    description: "Manage academic programs and curriculum"
  },
  {
    title: "Placement Outcomes",
    href: "/institution/outcomes",
    icon: Target,
    description: "Job placement and career readiness metrics"
  }
];

// Global settings navigation (available to all roles)
export const globalSettingsNavigation: NavigationItem[] = [
  {
    title: "Settings",
    href: "/shared/settings",
    icon: Settings,
    description: "General application settings"
  },
  {
    title: "Skills",
    href: "/shared/skills",
    icon: GraduationCap,
    description: "Skills tracking and development"
  },
  {
    title: "Test Readiness",
    href: "/shared/test-readiness",
    icon: Target,
    description: "Readiness assessments and testing"
  },
  {
    title: "Support Tickets",
    href: "/shared/tickets",
    icon: MessageSquare,
    description: "Help and support requests"
  }
];

// Map navigation items by context
export const navigationByContext = {
  dashboard: dashboardNavigation,
  platform: platformNavigation,
  enterprise: enterpriseNavigation,
  coach: coachNavigation,
  learner: learnerNavigation,
  institution: institutionNavigation,
};

// Role to stakeholder context mapping
export const roleToContextMapping = {
  // Platform administration
  'admin': 'platform',
  'platform-admin': 'platform', 
  'super-admin': 'platform',
  
  // Enterprise/Corporate L&D
  'enterprise': 'enterprise',
  'corporate': 'enterprise',
  'l&d-director': 'enterprise',
  'executive': 'enterprise',
  'frontliner': 'enterprise',
  'ceo': 'enterprise',
  
  // Coaching
  'coach': 'coach',
  'mentor': 'coach',
  'team-lead': 'coach',
  'worker': 'coach',
  
  // Learning
  'learner': 'learner',
  'student': 'learner',
  'professional': 'learner',
  
  // Academic institutions
  'institution': 'institution',
  'academic': 'institution',
  'program-director': 'institution',
  'university': 'institution',
} as const;

// Legacy role mapping for backward compatibility - now defaults to unified dashboard
export const legacyRoleMapping = {
  'learner': 'dashboard',
  'admin': 'dashboard', 
  'executive': 'dashboard',
  'ceo': 'dashboard',
  'worker': 'dashboard',
  'frontliner': 'dashboard',
} as const;

/**
 * Get the appropriate dashboard context for a user's role
 */
export function getDashboardContextForRole(role: string): NavigationContext {
  const contextKey = roleToContextMapping[role as keyof typeof roleToContextMapping] || 
                     legacyRoleMapping[role as keyof typeof legacyRoleMapping] || 
                     'learner';
  return navigationContexts.find(ctx => ctx.key === contextKey) || navigationContexts[3]; // fallback to learner
}

/**
 * Get the default dashboard route for a user's role
 */
export function getDefaultDashboardRoute(role: string): string {
  const context = getDashboardContextForRole(role);
  return context.basePath;
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
  items: NavigationItem[] = platformNavigation
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
    
    // Try to find in all navigation contexts
    let item = null;
    for (const navItems of Object.values(navigationByContext)) {
      item = getNavigationItemByPath(currentPath, navItems);
      if (item) break;
    }
    
    // Also check in settings navigation
    if (!item) {
      item = getNavigationItemByPath(currentPath, globalSettingsNavigation);
    }
    
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
  if (item.href === currentPath) return true;
  
  // Check if any child is active
  if (item.children) {
    return item.children.some(child => isNavigationItemActive(child, currentPath));
  }
  
  // Check if current path starts with item href (for nested routes)
  return currentPath.startsWith(item.href) && item.href !== '/';
}
