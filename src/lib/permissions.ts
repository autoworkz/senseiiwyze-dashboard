import { createAccessControl } from "better-auth/plugins/access";

/**
 * B2B2C Engine Access Control System
 * 
 * This defines the permission structure for the three user types:
 * - CEO (learner): Personal development and learning focus
 * - Worker (admin): Team management and oversight 
 * - Frontliner (executive): Organization-wide strategic control
 */

// Define the permission statements for all resources
export const statement = {
  // Personal/Learning resources (CEO/learner focused)
  personal: ["view", "update", "goals", "games", "learning"],
  
  // Team management resources (Worker/admin focused)  
  team: ["view", "manage", "tasks", "courses", "messages", "analytics"],
  
  // Organization-wide resources (Frontliner/executive focused)
  organization: ["view", "manage", "reports", "presentation", "strategy"],
  
  // Project management (shared across roles with different levels)
  project: ["create", "read", "update", "delete", "share"],
  
  // User management capabilities
  user: ["view", "create", "update", "delete", "assign-role", "ban"],
  
  // Data and analytics
  analytics: ["view", "export", "dashboard", "insights"],
  
  // System administration
  system: ["settings", "integrations", "security", "audit"]
} as const;

// Create the access controller
const ac = createAccessControl(statement);

/**
 * CEO Role (learner): Personal development and goal achievement
 * Routes: /me/* 
 * Focus: Individual learning, goal setting, skill development
 */
export const ceo = ac.newRole({
  personal: ["view", "update", "goals", "games", "learning"],
  project: ["create", "read", "update"], // Can manage their own projects
  analytics: ["view", "dashboard"], // View personal analytics
});

/**
 * Worker Role (admin): Team management and coordination
 * Routes: /team/*
 * Focus: Managing learners, curriculum, tasks, and team performance
 */
export const worker = ac.newRole({
  team: ["view", "manage", "tasks", "courses", "messages", "analytics"],
  user: ["view", "update", "assign-role"], // Can manage team members
  project: ["create", "read", "update", "delete"], // Full project management
  analytics: ["view", "dashboard", "insights"], // Team analytics
  personal: ["view"], // Can view team member progress
});

/**
 * Frontliner Role (executive): Strategic oversight and organization management
 * Routes: /org/*
 * Focus: High-level insights, strategic planning, organizational reports
 */
export const frontliner = ac.newRole({
  organization: ["view", "manage", "reports", "presentation", "strategy"],
  team: ["view", "analytics"], // Can view all teams
  user: ["view", "create", "update", "delete", "assign-role"], // Full user management
  project: ["create", "read", "update", "delete", "share"], // Full project access
  analytics: ["view", "export", "dashboard", "insights"], // Complete analytics access
  system: ["settings", "integrations", "security"], // System administration
  personal: ["view"], // Can view all personal progress
});

/**
 * Legacy role mappings for backward compatibility
 * These map to the current component interfaces
 */
export const learner = ceo;
export const admin = worker; 
export const executive = frontliner;

// Export the access controller for use in auth configuration
export { ac };

/**
 * Helper function to check if a role has specific permissions
 */
export function roleHasPermission(
  role: 'ceo' | 'worker' | 'frontliner' | 'learner' | 'admin' | 'executive',
  resource: keyof typeof statement,
  action: string
): boolean {
  const roleMap = {
    ceo,
    worker, 
    frontliner,
    learner: ceo,
    admin: worker,
    executive: frontliner
  };
  
  const rolePermissions = roleMap[role];
  // This would need to be implemented based on the role's actual permissions
  // For now, this is a placeholder that would integrate with Better Auth's permission checking
  return true; // Placeholder implementation
}

/**
 * B2B2C Engine Role Definitions
 * 
 * CEO (learner):
 * - Personal dashboard with goals, games, learning modules
 * - Individual progress tracking and skill development
 * - Limited project creation for personal use
 * 
 * Worker (admin):
 * - Team management dashboard
 * - Curriculum and course management
 * - Task assignment and intervention management  
 * - Team member progress monitoring
 * - Communication and messaging tools
 * 
 * Frontliner (executive):
 * - Organization-wide strategic dashboard
 * - Executive reports and analytics
 * - Presentation mode for stakeholders
 * - Complete user and system management
 * - High-level organizational insights
 */ 