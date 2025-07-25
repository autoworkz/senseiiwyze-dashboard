import { LucideIcon } from "lucide-react";
import {
  Home,
  Users,
  UserCheck,
  LineChart,
  Settings,
  Shield,
  BarChart3,
  Globe,
  Code,
  Brain,
  Cloud,
  Database,
  Sparkle,
  MessageSquare,
  BookOpen,
  CreditCard,
  Banknote,
  ShoppingCart,
  Plane,
  Gamepad2,
  Factory,
  Truck,
  Lock,
  Fingerprint,
} from "lucide-react";

export interface NavigationItem {
  title: string;
  href: string;
  icon?: LucideIcon;
  description?: string;
  children?: NavigationItem[];
  badge?: string;
  external?: boolean;
}

export interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

// Dashboard navigation items that can be dynamically rendered
export const dashboardNavigation: NavigationItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: Home,
    description: "Dashboard overview and key metrics",
  },
  {
    title: "Users",
    href: "/dashboard/users",
    icon: Users,
    description: "User management and analytics",
    children: [
      {
        title: "User Dashboard",
        href: "/dashboard/users",
        icon: UserCheck,
        description: "Overview of user metrics and statistics",
      },
      {
        title: "User Management",
        href: "/dashboard/users/list",
        icon: Users,
        description: "Manage all users in your organization",
      },
      {
        title: "User Analytics",
        href: "/dashboard/users/analytics",
        icon: LineChart,
        description: "Deep insights into user behavior and trends",
      },
    ],
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    description: "Application settings and preferences",
  },
];

// Platform navigation for the main navbar
export const platformNavigation: NavigationSection[] = [
  {
    title: "Solutions",
    items: [
      {
        title: "First solution",
        description: "Vestibulum scelerisque quis nisl ut convallis.",
        href: "#",
        icon: Cloud,
      },
      {
        title: "Another solution",
        description: "Curabitur vehicula malesuada enim a cursus.",
        href: "#",
        icon: Lock,
      },
      {
        title: "And a third solution",
        description: "Proin aliquam feugiat lobortis.",
        href: "#",
        icon: Fingerprint,
      },
      {
        title: "And a fourth solution",
        description: "Donec nec sapien nec dolor.",
        href: "#",
        icon: Cloud,
      },
    ],
  },
  {
    title: "By Use Case",
    items: [
      { title: "Banking", href: "#", icon: CreditCard },
      { title: "Fintech", href: "#", icon: Banknote },
      { title: "E-commerce", href: "#", icon: ShoppingCart },
      { title: "Travel & Hospitality", href: "#", icon: Plane },
      { title: "Real Estate", href: "#", icon: Home },
      { title: "Gaming", href: "#", icon: Gamepad2 },
      { title: "Manufacturing", href: "#", icon: Factory },
      { title: "Logistics", href: "#", icon: Truck },
    ],
  },
];

// Resources navigation for the main navbar
export const resourcesNavigation: NavigationItem[] = [
  {
    title: "AI Powered",
    description: "Explore AI-powered resources",
    href: "#",
    icon: Sparkle,
  },
  {
    title: "AI Development",
    description: "Tools and frameworks for AI development",
    href: "#",
    icon: Code,
  },
  {
    title: "Machine Learning",
    description: "Resources for machine learning enthusiasts",
    href: "#",
    icon: Brain,
  },
  {
    title: "Data Management",
    description: "Best practices for data management",
    href: "#",
    icon: Database,
  },
  {
    title: "Cloud AI",
    description: "Cloud-based AI solutions",
    href: "#",
    icon: Cloud,
  },
  {
    title: "AI Security",
    description: "Secure your AI applications",
    href: "#",
    icon: Shield,
  },
  {
    title: "AI Configuration",
    description: "Configure AI systems effectively",
    href: "#",
    icon: Settings,
  },
  {
    title: "AI Analytics",
    description: "Analyze AI performance metrics",
    href: "#",
    icon: BarChart3,
  },
  {
    title: "Global AI Trends",
    description: "Stay updated with global AI trends",
    href: "#",
    icon: Globe,
  },
  {
    title: "AI Community",
    description: "Join the AI community",
    href: "#",
    icon: Users,
  },
  {
    title: "AI Learning",
    description: "Learn AI from the best resources",
    href: "#",
    icon: BookOpen,
  },
  {
    title: "AI Support",
    description: "Get support for AI-related queries",
    href: "#",
    icon: MessageSquare,
  },
];

// Main navigation structure
export const mainNavigation: NavigationItem[] = [
  {
    title: "Platform",
    href: "#",
    children: platformNavigation.flatMap(section => section.items),
  },
  {
    title: "Users",
    href: "/dashboard/users",
    children: dashboardNavigation.find(item => item.title === "Users")?.children || [],
  },
  {
    title: "Developer",
    href: "#",
  },
  {
    title: "Resources",
    href: "#",
    children: resourcesNavigation,
  },
];

// Helper function to get navigation item by path
export function getNavigationItemByPath(path: string, items: NavigationItem[] = dashboardNavigation): NavigationItem | null {
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

// Helper function to get breadcrumb trail
export function getBreadcrumbTrail(path: string): NavigationItem[] {
  const trail: NavigationItem[] = [];
  const segments = path.split('/').filter(Boolean);
  
  let currentPath = '';
  for (const segment of segments) {
    currentPath += `/${segment}`;
    const item = getNavigationItemByPath(currentPath);
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

// Helper function to check if a navigation item is active
export function isNavigationItemActive(item: NavigationItem, currentPath: string): boolean {
  if (item.href === currentPath) return true;
  
  // Check if any child is active
  if (item.children) {
    return item.children.some(child => isNavigationItemActive(child, currentPath));
  }
  
  // Check if current path starts with item href (for nested routes)
  return currentPath.startsWith(item.href) && item.href !== '/';
}
