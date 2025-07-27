import { LucideIcon } from "lucide-react";
import {
  Home,
  Users,
  UserCheck,
  LineChart,
  Settings,
  Shield,
  BarChart3,
  Building2,
  MessageSquare,
  BookOpen,
  Target,
  Gamepad2,
  CheckCircle,
  TrendingUp,
  PieChart,
  Globe,
  CreditCard,
  FileText,
  Presentation,
  Brain,
  Award,
  Calendar,
  Bell
} from "lucide-react";

export interface NavigationItem {
  title: string;
  href: string;
  icon?: LucideIcon;
  description?: string;
  children?: NavigationItem[];
  badge?: string;
  external?: boolean;
  requiredRole?: string[];
}

export interface NavigationContext {
  key: 'executive' | 'team' | 'personal';
  title: string;
  description: string;
  basePath: string;
  roles: string[];
}

// Define the three main dashboard contexts
export const navigationContexts: NavigationContext[] = [
  {
    key: 'executive',
    title: 'Executive',
    description: 'C-suite dashboard for strategic oversight',
    basePath: '/org',
    roles: ['executive', 'frontliner', 'ceo']
  },
  {
    key: 'team',
    title: 'Team',
    description: 'Team management and coordination',
    basePath: '/team',
    roles: ['admin', 'worker']
  },
  {
    key: 'personal',
    title: 'Personal',
    description: 'Individual learning and development',
    basePath: '/me',
    roles: ['learner', 'ceo', 'admin', 'executive'] // All roles can access personal
  }
];

// Executive Dashboard Navigation (C-suite focus)
export const executiveNavigation: NavigationItem[] = [
  {
    title: "Executive Overview",
    href: "/org",
    icon: BarChart3,
    description: "Strategic KPIs and organizational insights"
  },
  {
    title: "Financial Analytics",
    href: "/org/financials",
    icon: TrendingUp,
    description: "Revenue, costs, and financial performance"
  },
  {
    title: "Performance Reports",
    href: "/org/reports", 
    icon: FileText,
    description: "Comprehensive performance analysis"
  },
  {
    title: "Strategic Planning",
    href: "/org/strategy",
    icon: Target,
    description: "OKRs, roadmaps, and strategic initiatives"
  },
  {
    title: "Risk & Compliance",
    href: "/org/compliance",
    icon: Shield,
    description: "Risk management and regulatory compliance"
  },
  {
    title: "Board Presentation",
    href: "/org/presentation",
    icon: Presentation,
    description: "Executive presentation mode"
  }
];

// Team Dashboard Navigation (Management focus)
export const teamNavigation: NavigationItem[] = [
  {
    title: "Team Overview",
    href: "/team",
    icon: Users,
    description: "Team performance and member insights"
  },
  {
    title: "User Management",
    href: "/team/users",
    icon: UserCheck,
    description: "Manage team members and assignments"
  },
  {
    title: "Intervention Tasks",
    href: "/team/tasks",
    icon: CheckCircle,
    description: "Support tasks and interventions"
  },
  {
    title: "Curriculum Management",
    href: "/team/courses",
    icon: BookOpen,
    description: "Course content and learning paths"
  },
  {
    title: "Team Analytics",
    href: "/team/analytics",
    icon: PieChart,
    description: "Performance metrics and trends"
  },
  {
    title: "Communication",
    href: "/team/messages",
    icon: MessageSquare,
    description: "Team messaging and announcements"
  }
];

// Personal Dashboard Navigation (Individual focus)
export const personalNavigation: NavigationItem[] = [
  {
    title: "Personal Overview",
    href: "/me",
    icon: Home,
    description: "Your personal dashboard and progress"
  },
  {
    title: "Goals & Objectives",
    href: "/me/goals",
    icon: Target,
    description: "Track your personal objectives"
  },
  {
    title: "Executive Learning",
    href: "/me/learn",
    icon: BookOpen,
    description: "Leadership development and training"
  },
  {
    title: "Skill Development",
    href: "/me/skills",
    icon: Brain,
    description: "Leadership skills and competencies"
  },
  {
    title: "Performance Review",
    href: "/me/performance",
    icon: Award,
    description: "Personal performance and achievements"
  }
];

// Learner-focused navigation (for learner role only)
export const learnerPersonalNavigation: NavigationItem[] = [
  {
    title: "Learning Dashboard",
    href: "/me",
    icon: Home,
    description: "Your learning dashboard and progress"
  },
  {
    title: "Goals & Objectives",
    href: "/me/goals",
    icon: Target,
    description: "Track your learning objectives"
  },
  {
    title: "Learning Path",
    href: "/me/learn",
    icon: BookOpen,
    description: "Courses and educational content"
  },
  {
    title: "Skill Development",
    href: "/me/skills",
    icon: Brain,
    description: "Skill assessments and growth"
  },
  {
    title: "Games & Engagement",
    href: "/me/games",
    icon: Gamepad2,
    description: "Learning through gamification"
  },
  {
    title: "Achievements",
    href: "/me/achievements",
    icon: Award,
    description: "Your accomplishments and badges"
  }
];

// Global settings navigation (available to all roles)
export const globalSettingsNavigation: NavigationItem[] = [
  {
    title: "Profile Settings",
    href: "/settings/profile",
    icon: UserCheck,
    description: "Personal profile and preferences"
  },
  {
    title: "Account & Security",
    href: "/settings/security",
    icon: Shield,
    description: "Security settings and authentication"
  },
  {
    title: "Notifications",
    href: "/settings/notifications",
    icon: Bell,
    description: "Communication preferences"
  },
  {
    title: "Appearance",
    href: "/settings/appearance",
    icon: Settings,
    description: "Theme and display settings"
  },
  {
    title: "Billing & Plans",
    href: "/settings/billing",
    icon: CreditCard,
    description: "Subscription and payment information"
  },
  {
    title: "Integrations",
    href: "/settings/integrations",
    icon: Globe,
    description: "Third-party app connections"
  }
];

// Map navigation items by context
export const navigationByContext = {
  executive: executiveNavigation,
  team: teamNavigation,
  personal: personalNavigation,
};

// Role-specific personal navigation mapping
export const personalNavigationByRole = {
  learner: learnerPersonalNavigation,
  ceo: personalNavigation,
  executive: personalNavigation,
  frontliner: personalNavigation,
  admin: personalNavigation,
  worker: personalNavigation,
};

// Legacy role mapping for backward compatibility
export const legacyRoleMapping = {
  'learner': 'personal',
  'admin': 'team', 
  'executive': 'executive',
  'ceo': 'executive',
  'worker': 'team',
  'frontliner': 'executive',
} as const;

/**
 * Get the appropriate dashboard context for a user's role
 */
export function getDashboardContextForRole(role: string): NavigationContext {
  const contextKey = legacyRoleMapping[role as keyof typeof legacyRoleMapping] || 'personal';
  return navigationContexts.find(ctx => ctx.key === contextKey) || navigationContexts[2]; // fallback to personal
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
  if (contextKey === 'personal' && userRole) {
    return personalNavigationByRole[userRole as keyof typeof personalNavigationByRole] || personalNavigation;
  }
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
  items: NavigationItem[] = executiveNavigation
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
