# B2B2C Engine Implementation Tasks

> Generated from: docs/plans/b2b2c-engine-implementation-plan.md
> Created: 2025-07-26
> Total Tasks: 27

## Overview
This document tracks all tasks created from the B2B2C Engine Implementation Plan. The implementation focuses on creating a multi-faceted dashboard system with three distinct user types: CEO, Worker, and Frontliner.

### 📊 Progress Summary (Updated: 2025-01-27)
- **Phase 1 Foundation**: 9/10 tasks complete (90%) ✅
- **Phase 2 Core Components**: 0/9 tasks complete (0%) ⏳
- **Phase 3 Integration**: 0/8 tasks complete (0%) ⏳
- **Phase 4 Dashboard Migration**: 0/12 tasks complete (0%) 🆕
- **Overall Progress**: 9/39 tasks complete (23%)

## Phase 1: Foundation (Week 1) - High Priority ⚡

### Layout & Navigation
- [x] **Create responsive layout components** ✅ - Build responsive layouts for CEO, Worker, and Frontliner dashboards
  - *COMPLETE*: Desktop (`DashboardNav`) and mobile navigation, responsive sidebar (`DashboardSidebar`)
- [x] **Implement role-based routing** ✅ - Add automatic redirection based on user role  
  - *COMPLETE*: Role-based navigation (`learner`/`admin`/`executive` → `/me/*`/`/team/*`/`/org/*`)
- [x] **Set up navigation structure** ✅ - Create navigation for all three user facets
  - *COMPLETE*: Full navigation structure with icons, descriptions, and responsive design

### Authentication & Permissions
- [x] **Extend authentication with roles** ✅ - Add support for CEO, Worker, Frontliner roles
  - *COMPLETE*: B2B2C access control system implemented with proper role definitions
- [x] **Implement permission middleware** ✅ - Create role-specific access control
  - *COMPLETE*: Route protection middleware with role-based access enforcement
- [x] **Add session management** ✅ - Handle multiple user types with role context persistence
  - *COMPLETE*: Better Auth integration with `getCurrentUser()` and session management

### State & Data Management
- [x] **Configure Zustand stores** ✅ - Set up stores for each dashboard type
  - *COMPLETE*: Multiple Zustand stores configured (theme, settings, account-context)
- [x] **Implement proper state management** ✅ - Zustand store with persistence and API tracking
  - *COMPLETE*: Comprehensive Zustand data store following official best practices with staleness checking
- [ ] **Set up real-time sync** - Add WebSocket connections for live data

## Phase 2: Core Components (Week 2-3) - Medium Priority 🔨

### Readiness Index Visualization
- [ ] **Create visualization components** - Build radar charts, progress bars, heat maps
- [ ] **Implement calculation algorithms** - Add weighted metrics calculations
- [ ] **Build drill-down interfaces** - Enable hierarchical data exploration

### Dashboard-Specific Components
- [ ] **CEO dashboard components** - Executive summaries, KPIs, strategic planning tools
- [ ] **Worker dashboard components** - Team management, analytics, reporting tools
- [ ] **Frontliner mobile components** - Forms, status updates, offline capability

### Data Integration
- [ ] **Connect to API endpoints** - Wire up all dashboard components
- [ ] **Implement caching strategies** - Add Redis for frequently accessed data
- [ ] **Add real-time updates** - Enable live updates across components

## Phase 3: Component Delegation & Integration (Week 4) - Low Priority 📋

### Component Standards
- [ ] **Define component contracts** - Create clear interfaces for delegation
- [ ] **Create documentation** - Comprehensive component docs
- [ ] **Establish testing requirements** - Write component tests

### Delegation Process
- [ ] **Set up development workflow** - Team delegation process
- [ ] **Create review process** - Integration guidelines
- [ ] **Implement integration testing** - Test component interactions

### Final Integration
- [ ] **Assemble all components** - End-to-end testing
- [ ] **Optimize performance** - Meet <2s dashboard load time target
- [ ] **Establish deployment pipeline** - CI/CD for B2B2C engine

## Phase 4: Dashboard Migration (Week 5) - High Priority 🔄

### Legacy Dashboard Content Migration
- [ ] **Audit existing dashboard content** - Catalog all pages and components in `/dashboard/*`
- [ ] **Migrate user management** - Move `/dashboard/users/*` → `/team/users/` (Worker access)
- [ ] **Migrate analytics dashboards** - Distribute analytics based on role scope
- [ ] **Migrate programs management** - Move `/dashboard/programs/*` → `/team/curriculum/` (Worker access)

### CEO Dashboard Content (Personal Focus)
- [ ] **Migrate user dashboard** - Move `/dashboard/user-dashboard/*` → `/me/overview/` 
- [ ] **Migrate skills tracking** - Move `/dashboard/skills/*` → `/me/skills/` (Personal skill development)
- [ ] **Create personal analytics** - Extract user-specific metrics for `/me/analytics/`

### Worker Dashboard Content (Team Management)
- [ ] **Create team analytics** - Move team-focused analytics → `/team/analytics/`
- [ ] **Migrate curriculum management** - Reorganize programs and courses for team oversight
- [ ] **Create intervention dashboard** - New task management interface for team support

### Frontliner Dashboard Content (Executive Oversight)
- [ ] **Migrate program readiness** - Move `/dashboard/program-readiness-dashboard/*` → `/org/readiness/`
- [ ] **Migrate data overview** - Move `/dashboard/data-overview/*` → `/org/insights/`
- [ ] **Create executive analytics** - Organization-wide metrics and strategic insights

### Legacy Cleanup
- [ ] **Remove old dashboard routes** - Clean up `/dashboard/*` after migration
- [ ] **Update navigation references** - Fix any hardcoded links to old dashboard paths

## Success Metrics 📊

### Technical Deliverables
- Responsive layout for all three user types
- Unified authentication with RBAC
- Complete Readiness Index visualization
- Optimized API aggregation (40% reduction)
- Mobile-first frontliner interface
- Real-time data synchronization

### Performance Targets
- Dashboard load time < 2 seconds
- Mobile responsiveness < 1 second
- API call reduction by 40%
- 99.9% uptime for real-time features

### User Experience Goals
- Intuitive navigation per user type
- Clear Readiness Index insights
- Seamless mobile experience
- Efficient data workflows

## Task Status Legend
- ⚡ High Priority (Phase 1)
- 🔨 Medium Priority (Phase 2)
- 📋 Low Priority (Phase 3)
- 🔄 High Priority (Phase 4 - Migration)
- ✅ Completed
- 🚧 In Progress
- ⏸️ Blocked
- 🆕 New

## 🔍 Key Files to Examine

### Navigation & Layout (✅ Complete)
- `src/components/layout/DashboardNav.tsx` - Main navigation component
- `src/components/layout/DashboardSidebar.tsx` - Desktop sidebar navigation  
- `src/app/(dashboard)/layout.tsx` - Dashboard layout integration
- `src/lib/navigation-config.ts` - Navigation configuration and utilities

### Authentication & Roles (✅ Complete)
- `src/lib/auth.ts` - Better Auth configuration with `getCurrentUser()` and permission checking
- `src/lib/auth-client.ts` - Client-side auth utilities with B2B2C access control
- `src/lib/permissions.ts` - B2B2C role definitions and access control system
- `middleware.ts` - Route protection middleware for role-based access
- `src/components/layout/UserMenu.tsx` - User authentication UI

### State Management (✅ Complete)
- `src/stores/theme-store.ts` - Theme management
- `src/stores/settings-navigation-store.ts` - Settings navigation
- `src/stores/account-context-store.ts` - Account context
- `src/stores/debounced-settings-store.ts` - Debounced settings

### Zustand Data Management (✅ Complete)
- `src/stores/data-store.ts` - Main Zustand store with async actions and persistence
- `src/hooks/use-dashboard-data.ts` - Convenient hooks for dashboard data consumption
- `src/components/examples/zustand-usage-example.tsx` - Complete usage examples
- `src/app/api/dashboard/ceo/route.ts` - CEO dashboard aggregated endpoint
- `src/app/api/dashboard/worker/route.ts` - Worker dashboard aggregated endpoint  
- `src/app/api/dashboard/frontliner/route.ts` - Frontliner dashboard aggregated endpoint

### Dashboard Routes (🚧 In Progress)
- `src/app/(dashboard)/me/` - Learner dashboard routes
- `src/app/(dashboard)/team/` - Admin dashboard routes  
- `src/app/(dashboard)/org/` - Executive dashboard routes

### Legacy Dashboard Content (🔄 Migration Needed)
- `src/app/dashboard/` - **OLD**: Contains existing dashboard pages that need migration
- `src/app/dashboard/users/` - User management (→ `/team/users/`)
- `src/app/dashboard/analytics/` - Analytics dashboards (→ distribute by role)
- `src/app/dashboard/programs/` - Programs management (→ `/team/curriculum/`)
- `src/app/dashboard/skills/` - Skills tracking (→ `/me/skills/`)
- `src/app/dashboard/user-dashboard/` - User dashboard (→ `/me/overview/`)
- `src/app/dashboard/program-readiness-dashboard/` - Program readiness (→ `/org/readiness/`)
- `src/app/dashboard/data-overview/` - Data overview (→ `/org/insights/`)
- `src/app/settings/` - Settings pages (needs role-based access control)

## ⚠️ Important Notes

### Terminology Mapping
The current implementation uses different role names than the B2B2C plan:
- **B2B2C Plan**: CEO, Worker, Frontliner
- **Current Implementation**: learner, admin, executive  
- **Routes**: `/me/*`, `/team/*`, `/org/*`

This is **functionally correct** but may need terminology alignment.

### ✅ Authentication & Permissions Complete

**Implemented B2B2C Access Control System:**

1. **Complete Role System** (`src/lib/permissions.ts`)
   - CEO (learner): Personal development and learning focus
   - Worker (admin): Team management and coordination  
   - Frontliner (executive): Organization oversight and strategy

2. **Real User Authentication** (`src/lib/auth.ts`)
   - `getCurrentUser()` function implemented with Better Auth session retrieval
   - Permission checking utilities for resource-based access control
   - Role-based route protection helpers

3. **Route Protection Middleware** (`middleware.ts`)
   - Automatic redirection based on user roles
   - Role-based access enforcement for `/me/*`, `/team/*`, `/org/*`
   - Session validation and authentication requirement

4. **Better Auth Integration**
   - Organization and admin plugins configured with B2B2C roles
   - Client-side access control for frontend permission checking
   - Multi-role support with comma-separated role handling

### 🔐 Better Auth Integration Documentation

**Complete Authentication & Authorization System Implementation:**

#### 1. **Server-Side Configuration** (`src/lib/auth.ts`)

**Core Better Auth Setup:**
```typescript
import { betterAuth } from "better-auth";
import { 
  organization, admin, apiKey, multiSession, 
  emailOTP, magicLink, twoFactor, username 
} from "better-auth/plugins";

export const auth = betterAuth({
  database: new Database("database.sqlite"),
  emailAndPassword: { enabled: true },
  socialProviders: { github: {...}, google: {...} },
  plugins: [
    // B2B2C Organization Management
    organization({
      ac,                                    // Access controller
      roles: { ceo, worker, frontliner },   // B2B2C roles
      allowUserToCreateOrganization: true,
      membershipLimit: 100,
      invitationExpiresIn: 48 * 60 * 60    // 48 hours
    }),
    
    // B2B2C Admin System
    admin({
      ac,                                    // Same access controller
      roles: { ceo, worker, frontliner },   // Same B2B2C roles
      defaultRole: "learner",               // Default to CEO role
      adminRoles: ["worker", "frontliner"]  // Who can perform admin actions
    }),
    
    // Additional plugins for enterprise features
    apiKey(),      // API key authentication
    multiSession(), // Multi-device support
    emailOTP(),    // Email verification
    magicLink(),   // Passwordless login
    twoFactor(),   // 2FA security
    username()     // Username-based login
  ]
});
```

**Server API Functions:**
```typescript
// User session management
export async function getCurrentUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ? {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role: session.user.role || "learner",
    organizationId: session.session.activeOrganizationId
  } : null;
}

// Permission checking
export async function checkUserPermission(resource: string, action: string) {
  const user = await getCurrentUser();
  if (!user) return false;
  
  const result = await auth.api.userHasPermission({
    body: { userId: user.id, permissions: { [resource]: [action] } }
  });
  return result.success;
}
```

#### 2. **Role-Based Access Control** (`src/lib/permissions.ts`)

**B2B2C Permission System:**
```typescript
import { createAccessControl } from "better-auth/plugins/access";

// Resource-based permission structure
export const statement = {
  personal: ["view", "update", "goals", "games", "learning"],     // CEO focus
  team: ["view", "manage", "tasks", "courses", "messages"],      // Worker focus
  organization: ["view", "manage", "reports", "presentation"],    // Frontliner focus
  project: ["create", "read", "update", "delete", "share"],      // Shared resource
  user: ["view", "create", "update", "delete", "assign-role"],   // User management
  analytics: ["view", "export", "dashboard", "insights"],        // Data access
  system: ["settings", "integrations", "security", "audit"]      // System admin
} as const;

const ac = createAccessControl(statement);

// B2B2C Role Definitions
export const ceo = ac.newRole({          // CEO (learner) - Personal development
  personal: ["view", "update", "goals", "games", "learning"],
  project: ["create", "read", "update"],
  analytics: ["view", "dashboard"]
});

export const worker = ac.newRole({       // Worker (admin) - Team management  
  team: ["view", "manage", "tasks", "courses", "messages", "analytics"],
  user: ["view", "update", "assign-role"],
  project: ["create", "read", "update", "delete"],
  analytics: ["view", "dashboard", "insights"],
  personal: ["view"]
});

export const frontliner = ac.newRole({   // Frontliner (executive) - Strategic oversight
  organization: ["view", "manage", "reports", "presentation", "strategy"],
  team: ["view", "analytics"],
  user: ["view", "create", "update", "delete", "assign-role"],
  project: ["create", "read", "update", "delete", "share"],
  analytics: ["view", "export", "dashboard", "insights"],
  system: ["settings", "integrations", "security"],
  personal: ["view"]
});
```

#### 3. **Client-Side Configuration** (`src/lib/auth-client.ts`)

**Better Auth Client Setup:**
```typescript
import { createAuthClient } from "better-auth/react";
import { 
  organizationClient, adminClient, apiKeyClient, 
  multiSessionClient, twoFactorClient 
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  
  plugins: [
    // B2B2C Organization Client
    organizationClient({
      ac,                                   // Same access controller as server
      roles: { ceo, worker, frontliner }   // Same B2B2C roles
    }),
    
    // B2B2C Admin Client  
    adminClient({
      ac,                                   // Same access controller
      roles: { ceo, worker, frontliner }   // Same roles for consistency
    }),
    
    // Enterprise features
    multiSessionClient(),                   // Multi-device management
    apiKeyClient(),                        // API key management
    twoFactorClient()                      // 2FA support
  ]
});
```

**Client API Usage:**
```typescript
// Organization management
await authClient.organization.inviteMember({
  email: "user@example.com",
  role: "worker"  // Assign Worker role
});

// Admin operations
await authClient.admin.setRole({
  userId: "user-id",
  role: "frontliner"  // Promote to Frontliner
});

// Permission checking (client-side)
const canManageTeam = await authClient.admin.hasPermission({
  permissions: { team: ["manage"] }
});
```

#### 4. **Route Protection Middleware** (`middleware.ts`)

**B2B2C Route Enforcement:**
```typescript
import { auth } from "@/lib/auth";

const roleRouteMapping = {
  learner: ['/me'],     ceo: ['/me'],         // CEO routes
  admin: ['/team'],     worker: ['/team'],    // Worker routes  
  executive: ['/org'],  frontliner: ['/org']  // Frontliner routes
};

export default async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  const userRole = session.user?.role;
  const pathname = request.nextUrl.pathname;
  
  // Role-based access control
  if (!canAccessRoute(userRole, pathname)) {
    const defaultRoute = getDefaultRouteForRole(userRole || 'learner');
    return NextResponse.redirect(new URL(defaultRoute, request.url));
  }
}
```

#### 5. **API Integration Patterns**

**Server Actions with Better Auth:**
```typescript
// Server action example
"use server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function updateUserRole(userId: string, newRole: string) {
  // Check admin permissions
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
  
  // Verify user can assign roles
  const hasPermission = await auth.api.userHasPermission({
    body: {
      userId: session.user.id,
      permissions: { user: ["assign-role"] }
    }
  });
  
  if (!hasPermission.success) throw new Error("Insufficient permissions");
  
  // Update user role
  return await auth.api.admin.setRole({
    body: { userId, role: newRole }
  });
}
```

**API Route Examples:**
```typescript
// API route: /api/team/members
import { auth } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
  
  // Check team management permissions
  const canViewTeam = await auth.api.userHasPermission({
    body: {
      userId: session.user.id,
      permissions: { team: ["view"] }
    }
  });
  
  if (!canViewTeam.success) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }
  
  // Return team data
  return Response.json({ members: [] });
}
```

#### 6. **Database Schema Extensions**

**Better Auth Tables:**
```sql
-- Core auth tables (auto-generated)
user: id, email, name, role, emailVerified, image, createdAt, updatedAt
session: id, userId, expiresAt, token, ipAddress, userAgent
account: id, userId, accountId, providerId, accessToken, refreshToken

-- Organization plugin tables
organization: id, name, slug, logo, createdAt, updatedAt
member: id, userId, organizationId, role, createdAt, updatedAt
invitation: id, email, organizationId, role, status, expiresAt

-- Admin plugin extensions
user: + role, banned, banReason, banExpires
session: + impersonatedBy

-- API key plugin tables
apiKey: id, name, key, userId, permissions, enabled, expiresAt
```

### 📊 Zustand State Management Implementation Details

**What the New Zustand System Provides:**

The new implementation follows official Zustand best practices, replacing the previous simple in-memory cache with proper state management:

**Key Features:**
- **Async Actions**: Data fetching directly in Zustand store actions
- **Persistent Storage**: Selective persistence with `partialize` for timestamps only
- **Staleness Checking**: Built-in timestamp-based data freshness validation
- **Permission Integration**: Better Auth permissions checked within each action
- **Invalidation System**: Granular data invalidation by category or specific keys
- **External Tracking Compatible**: Works with any external API monitoring solution

**Before (Old API Aggregation):**
```typescript
// Manual cache management, no persistence
const data = await APIAggregationService.getCEODashboardData();
// Lost on page refresh, no tracking
```

**After (Zustand Best Practices):**
```typescript
// Automatic data management with persistence
const { personal, loading, refetch } = useDataStore((state) => ({
  personal: state.personal,
  loading: state.loading.personal,
  refetch: state.fetchAllPersonalData,
}));

// Auto-fetches, persists timestamps, tracks API calls
useEffect(() => { refetch(); }, []);
```

**Implementation Architecture:**

1. **Main Data Store** (`src/stores/data-store.ts`)
   - **Personal Data**: CEO dashboard data with 5-minute staleness
   - **Team Data**: Worker dashboard data with 3-minute staleness
   - **Organization Data**: Frontliner dashboard data with 10-minute staleness
   - **Persistence**: Only timestamps persist across sessions (lightweight)
   - **External Tracking**: Compatible with any external API monitoring

2. **Store Features**
   ```typescript
   // Automatic staleness checking
   if (!isStale(timestamp, STALE_TIMES.personal)) return; // Skip fetch
   
   // Permission-based fetching
   const canView = await checkUserPermission('personal', 'view');
   
   // Selective invalidation
   invalidatePersonalData(['metrics', 'goals']); // Only these keys
   
   // Staleness checking
   if (!isStale(timestamp, STALE_TIMES.personal)) return; // Skip if fresh
   ```

3. **Usage Examples**
   ```typescript
   // Simple data consumption
   const personal = useDataStore((state) => state.personal);
   const fetchMetrics = useDataStore((state) => state.fetchPersonalMetrics);
   
   // Check staleness
   const isStale = useDataStore((state) => 
     state.isDataStale('personal', 'metrics')
   );
   
   // Invalidate and refetch
   const invalidate = useDataStore((state) => state.invalidatePersonalData);
   invalidate(['metrics']); // Next access will refetch
   ```

**Key Benefits Over Previous System:**
- **Proper State Management**: No more ad-hoc caching, follows Zustand best practices
- **Persistence**: Data freshness survives page refreshes
- **Granular Control**: Individual data types can be invalidated
- **Better Performance**: Only fetch stale data, automatic deduplication
- **External Tracking Ready**: Works seamlessly with your existing monitoring tools
- **Type Safety**: Full TypeScript support with proper types
- **Simplified Architecture**: Clean, maintainable code without complex cache logic

### 🔄 Dashboard Migration Strategy

**Phase 4 Implementation Plan:**

1. **Migration Mapping**
   ```
   Legacy Structure → B2B2C Structure:
   
   /dashboard/users/*              → /team/users/          (Worker/admin)
   /dashboard/analytics/*          → /me/, /team/, /org/   (Role-specific)  
   /dashboard/programs/*           → /team/curriculum/     (Worker/admin)
   /dashboard/skills/*             → /me/skills/           (CEO/learner)
   /dashboard/user-dashboard/*     → /me/overview/         (CEO/learner)
   /dashboard/program-readiness/*  → /org/readiness/       (Frontliner/exec)
   /dashboard/data-overview/*      → /org/insights/        (Frontliner/exec)
   /settings/*                     → Role-based access     (All roles)
   ```

2. **Migration Process with Better Auth Integration**
   ```typescript
   // Step 1: Copy existing pages to new locations
   // Step 2: Add Better Auth permission checks to each page
   // Step 3: Update imports and route references  
   // Step 4: Apply role-based access control using checkUserPermission()
   // Step 5: Test functionality with real user sessions
   // Step 6: Remove old dashboard routes
   ```

3. **Role-Specific Content Distribution**
   ```typescript
   // CEO (learner) - Personal focus
   - Personal analytics: checkUserPermission("analytics", "dashboard")
   - Individual skill development: checkUserPermission("personal", "learning")
   - Goal tracking: checkUserPermission("personal", "goals")
   
   // Worker (admin) - Team focus  
   - Team member management: checkUserPermission("user", "update")
   - Curriculum oversight: checkUserPermission("team", "courses")
   - Team analytics: checkUserPermission("team", "analytics")
   
   // Frontliner (executive) - Strategic focus
   - Organization insights: checkUserPermission("organization", "reports")
   - Program readiness: checkUserPermission("organization", "strategy")
   - Executive reports: checkUserPermission("analytics", "export")
   ```

#### 7. **Component Integration Examples**

**Protected Component Pattern:**
```typescript
import { useSession } from "@/lib/auth-client";
import { checkUserRole } from "@/lib/auth";

export function TeamManagementPanel() {
  const { data: session } = useSession();
  
  if (!session) return <LoginPrompt />;
  
  // Client-side role check
  const isWorker = session.user.role === 'worker' || session.user.role === 'admin';
  if (!isWorker) return <AccessDenied />;
  
  return <TeamDashboard />;
}
```

**Server Component with Permissions:**
```typescript
import { getCurrentUser, checkUserPermission } from "@/lib/auth";

export default async function OrganizationReports() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  
  const canViewReports = await checkUserPermission("organization", "reports");
  if (!canViewReports) redirect('/unauthorized');
  
  return <ExecutiveReports user={user} />;
}
```

### Implementation Notes
- All tasks have been added to the TodoWrite system
- Tasks are tagged with #b2b2c-engine for easy filtering
- Each phase builds on the previous one
- Component delegation strategy allows parallel development in Phase 3
- **Phase 1 foundation is 80% complete** - ready for Phase 2 component development
- **Phase 4 added**: Dashboard migration from legacy `/dashboard/*` to B2B2C structure

### Next Priority: Phase 4 Dashboard Migration
Since authentication and roles are now complete, **Phase 4 migration should be prioritized** to:
1. Consolidate existing dashboard functionality into the B2B2C structure
2. Remove duplicate dashboard routes and layouts
3. Ensure role-appropriate content distribution
4. Clean up legacy code and improve maintainability