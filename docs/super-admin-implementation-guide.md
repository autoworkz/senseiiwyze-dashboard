# Super Admin Role Implementation Guide for SenseiiWyze Dashboard

## Overview
This document explains the complete super admin role implementation in our Next.js application using Better Auth with organization management. The super admin role provides platform-wide access to all organizations and administrative functions.

### Database Schema
- **`ba_users`**: User records with role field (comma-separated for multiple roles)
- **`ba_accounts`**: Authentication accounts (credential, social providers)
- **`organization`**: Organization records
- **`members`**: Organization membership records
- **`invitations`**: Organization invitation records

## Super Admin Role Configuration

### 1. Permission System (`src/lib/permissions.ts`)
```typescript
// Super admin has full platform access
export const superAdmin = ac.newRole({
  organization: ["view", "update", "manage"],     // All org settings
  team: ["view", "manage"],                       // All team management
  billing: ["view", "manage", "invoice", "subscription"], // All billing
  reports: ["view"],                              // All reports
  enterprise: ["sso", "scim", "contracts", "security"], // Enterprise features
  assessment: ["assign", "view"],                 // Assessment management
  user: ["view", "create", "update", "delete"],   // User management
  invitation: ["create"],                         // Invitation creation
});
```

### 2. Better Auth Configuration (`src/lib/auth.ts`)
```typescript
// Organization plugin with super admin role
organization({
  ac,
  roles: {
    "admin-executive": adminExecutive,
    "admin-manager": adminManager,
    "super-admin": superAdmin,  // ← Super admin role defined
  },
  allowUserToCreateOrganization: async (user) => {
    const result = await canUserCreateOrganization(user.id, user.role);
    return result.canCreate;  // Super admins can create unlimited orgs
  },
  creatorRole: "admin-executive", // Default role for new org creators
  organizationLimit: 1,           // Default limit (super admins bypass this)
  membershipLimit: 100,
  invitationLimit: 50,
}),

// Admin plugin with super admin access
admin({
  ac,
  roles: {
    "admin-executive": adminExecutive,
    "admin-manager": adminManager,
    "super-admin": superAdmin,  // ← Super admin gets admin access
  },
  defaultRole: "admin-executive",
  adminRoles: ["admin-executive", "admin-manager", "super-admin"],
}),
```

### 3. Organization Creation Limits (`src/lib/organization-limits.ts`)
```typescript
export async function canUserCreateOrganization(userId: string, userRole: string) {
  const roles = String(userRole ?? "").split(",").map(r => r.trim());
  
  // Super admins can create unlimited organizations
  if (roles.includes("super-admin")) {
    return { canCreate: true };
  }
  
  // Admin executives limited to 1 organization
  if (roles.includes("admin-executive")) {
    // Check current count...
  }
  
  // Admin managers cannot create organizations
  if (roles.includes("admin-manager")) {
    return { canCreate: false, reason: "Admin managers cannot create organizations" };
  }
}
```

## Super Admin Detection & Utilities

### 1. Super Admin Check (`src/lib/auth.ts`)
```typescript
export async function isSuperAdmin(userId?: string): Promise<boolean> {
  if (!userId) {
    const session = await auth.api.getSession({ headers: await headers() });
    userId = session?.user?.id;
  }
  
  const baUser = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (baUser.length === 0) return false;
  
  const userRoles = String(baUser[0].role ?? "").split(",").map(r => r.trim());
  return userRoles.includes("super-admin");
}
```

### 2. Route Access Control
```typescript
export const roleRouteMapping = {
  "super-admin": [
    "/org", "/org/settings", "/org/billing",
    "/team", "/reports", "/enterprise",
    "/admin", "/admin/organizations", "/admin/users" // Additional super-admin routes
  ],
} as const;

export async function canAccessRoute(pathname: string): Promise<boolean> {
  const user = await getCurrentUser();
  
  // Super admins have access to all routes
  if (user.isSuperAdmin) return true;
  
  // Check role-based access for other users...
}
```

### 3. Current User Context
```typescript
export async function getCurrentUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  
  return {
    id: session.user.id,
    email: session.user.email,
    role: session.user.role,
    // ... other fields
    isSuperAdmin: await isSuperAdmin(session.user.id),
    canAccessAllOrganizations: await isSuperAdmin(session.user.id),
  };
}
```

## Super Admin Creation Process

### 1. Database Setup (`create-super-admin.sql`)
```sql
-- Create super admin user
INSERT INTO public.ba_users (
  id, name, email, email_verified, created_at, updated_at, role
) VALUES (
  'super-admin-001',
  'Platform Administrator',
  'admin@senseiwyze.com',  -- CHANGE THIS EMAIL
  true,
  NOW(),
  NOW(),
  'super-admin'
);

-- Create password account
INSERT INTO public.ba_accounts (
  id, account_id, provider_id, user_id, password, created_at, updated_at
) VALUES (
  'super-admin-account-001',
  'super-admin-001',
  'credential',
  'super-admin-001',
  '$2a$10$N9qo8uLOickgx2ZMRZoMye6p294mkldOXdw6LjTmQjwDp4Y0jOmIW', -- "SuperAdmin123!"
  NOW(),
  NOW()
);
```

### 2. Manual Creation Steps
1. **Run SQL Script**: Execute `create-super-admin.sql` in Supabase SQL Editor
2. **Update Credentials**: Change email and password in the script
3. **Generate Password Hash**: Use bcrypt-generator.com with rounds=10
4. **Verify Creation**: Check the verification query in the script

### 3. Security Considerations
- **Change Default Password**: Never use "SuperAdmin123!" in production
- **Secure Email**: Use a secure admin email address
- **Remove Script**: Delete the SQL file after running for security
- **Access Logging**: Monitor super admin access patterns

## Super Admin Capabilities

### 1. Organization Management
- **View All Organizations**: Access to every organization in the platform
- **Create Unlimited Organizations**: No limit on organization creation
- **Manage Any Organization**: Full CRUD access to organization settings
- **Billing Management**: Access to all billing and subscription data

### 2. User Management
- **View All Users**: Platform-wide user directory
- **Create/Update/Delete Users**: Full user lifecycle management
- **Role Assignment**: Assign any role to any user
- **Invitation Management**: Create and manage invitations

### 3. Platform Administration
- **Enterprise Features**: SSO, SCIM, contracts, security settings
- **Assessment Management**: Assign and view all assessments
- **Reports Access**: Platform-wide analytics and reporting
- **System Configuration**: Access to platform-level settings

## Current Implementation Status

### ✅ Completed
- Super admin role definition and permissions
- Database schema and user creation script
- Better Auth integration with organization plugin
- Route access control and permission checking
- Organization creation limits and bypasses
- Super admin detection utilities

### 🚧 In Progress
- Super admin dashboard UI components
- Organization switching functionality
- Bulk user management tools

### ⏳ Planned
- Super admin audit logging
- Advanced reporting for super admins
- Automated super admin provisioning
- Multi-tenant organization management

## Usage Examples

### 1. Check Super Admin Status
```typescript
import { isSuperAdmin } from '@/lib/auth';

const isSuper = await isSuperAdmin();
if (isSuper) {
  // Show super admin features
}
```

### 2. Protect Super Admin Routes
```typescript
import { canAccessRoute } from '@/lib/auth';

const canAccess = await canAccessRoute('/admin/organizations');
if (!canAccess) {
  // Redirect or show error
}
```

### 3. Organization Creation Bypass
```typescript
import { canUserCreateOrganization } from '@/lib/organization-limits';

const result = await canUserCreateOrganization(userId, userRole);
if (result.canCreate) {
  // Allow organization creation
}
```

## Troubleshooting

### Common Issues
1. **"You are not allowed to create a new organization"**
   - Check if user has `super-admin` role in `ba_users.role` field
   - Verify `canUserCreateOrganization` function is working
   - Check Better Auth organization plugin configuration

2. **Super Admin Not Detected**
   - Verify role field contains `super-admin` (case-sensitive)
   - Check `isSuperAdmin` function database query
   - Ensure user session is properly authenticated

3. **Permission Denied Errors**
   - Verify super admin role is defined in Better Auth plugins
   - Check access control configuration in `permissions.ts`
   - Ensure route mapping includes super admin routes

## Next Steps for ChatGPT

When working with this super admin system:

1. **Always check super admin status** before implementing admin features
2. **Use the existing utilities** (`isSuperAdmin`, `canAccessRoute`, etc.)
3. **Follow the permission system** defined in `permissions.ts`
4. **Respect organization limits** unless user is super admin
5. **Test with actual super admin user** created via SQL script
6. **Consider security implications** of super admin access
7. **Use Better Auth APIs** for user and organization management
8. **Follow the established patterns** for role-based access control

This super admin system provides comprehensive platform management capabilities while maintaining security and proper access controls.
