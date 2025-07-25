# Migration Plan: SenseiiWyze Dashboard to Supabase Integration

## Overview
This document outlines the comprehensive migration plan for integrating Supabase as the backend database and authentication system into the existing SenseiiWyze Dashboard application. The migration will replace mock data implementations with real Supabase functionality while maintaining existing UI/UX patterns.

## Current State Analysis
- **Frontend**: Next.js 15 with App Router
- **State Management**: Zustand with localStorage persistence
- **UI Framework**: shadcn/ui components
- **Data**: Currently using mock data and simulated API calls
- **Authentication**: Cookie-based mock authentication
- **Deployment**: Cloudflare Workers with @opennextjs/cloudflare

## Migration Objectives
1. Replace mock data with Supabase database integration
2. Implement Supabase Auth for authentication system
3. Create database schema for users, activities, and analytics
4. Build API routes for data operations
5. Update store logic to use real API calls
6. Maintain existing UI/UX functionality

---

## 1. Dependencies to Add/Update

### New Dependencies
```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "@supabase/auth-helpers-nextjs": "^0.8.7",
    "@supabase/auth-helpers-react": "^0.4.2",
    "@supabase/auth-ui-react": "^0.4.6",
    "@supabase/auth-ui-shared": "^0.1.8",
    "react-query": "^3.39.3",
    "@tanstack/react-query": "^5.17.0",
    "react-hook-form": "^7.48.2",
    "@hookform/resolvers": "^3.3.2",
    "recharts": "^2.8.0",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "@types/uuid": "^9.0.7",
    "supabase": "^1.120.0"
  }
}
```

### Package Updates
```json
{
  "dependencies": {
    "zod": "^4.0.5" // Already present, will be used for schema validation
  }
}
```

---

## 2. Environment Variable Changes

### New Environment Variables (.env.local)
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database Configuration
DATABASE_URL=your_supabase_postgres_connection_string

# Authentication
SUPABASE_JWT_SECRET=your_supabase_jwt_secret

# Optional: Real-time subscriptions
NEXT_PUBLIC_SUPABASE_REALTIME_ENABLED=true
```

### Updated .env.example
- Add Supabase configuration section
- Update database configuration to reference Supabase
- Add authentication configuration

---

## 3. Database Schema Migrations

### Supabase SQL Migrations

#### Migration 001: Initial User Management Schema
```sql
-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'user', 'guest');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended');

-- Create users table (extends Supabase auth.users)
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  role user_role DEFAULT 'user',
  status user_status DEFAULT 'active',
  program_readiness INTEGER DEFAULT 0 CHECK (program_readiness >= 0 AND program_readiness <= 100),
  department TEXT,
  completed_modules INTEGER DEFAULT 0,
  total_modules INTEGER DEFAULT 12,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user activities table
CREATE TABLE public.user_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user sessions table for tracking
CREATE TABLE public.user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_end TIMESTAMP WITH TIME ZONE,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}'
);

-- Indexes for performance
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_status ON public.user_profiles(status);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_user_profiles_created_at ON public.user_profiles(created_at);
CREATE INDEX idx_user_activities_user_id ON public.user_activities(user_id);
CREATE INDEX idx_user_activities_created_at ON public.user_activities(created_at);
```

#### Migration 002: Row Level Security (RLS)
```sql
-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view all profiles" ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can update any profile" ON public.user_profiles FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- RLS Policies for user_activities
CREATE POLICY "Users can view own activities" ON public.user_activities FOR SELECT USING (
  user_id = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- RLS Policies for user_sessions
CREATE POLICY "Users can view own sessions" ON public.user_sessions FOR SELECT USING (
  user_id = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

#### Migration 003: Database Functions
```sql
-- Function to update user's last active timestamp
CREATE OR REPLACE FUNCTION update_user_last_active()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.user_profiles 
  SET last_active = NOW()
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating last active
CREATE TRIGGER update_last_active_trigger
  AFTER INSERT ON public.user_activities
  FOR EACH ROW
  EXECUTE FUNCTION update_user_last_active();

-- Function to get user dashboard metrics
CREATE OR REPLACE FUNCTION get_dashboard_metrics()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'totalUsers', (SELECT COUNT(*) FROM public.user_profiles),
    'activeUsers', (SELECT COUNT(*) FROM public.user_profiles WHERE status = 'active'),
    'newUsers', (SELECT COUNT(*) FROM public.user_profiles WHERE created_at > NOW() - INTERVAL '30 days'),
    'avgProgramReadiness', (SELECT ROUND(AVG(program_readiness), 2) FROM public.user_profiles WHERE status = 'active'),
    'usersByRole', (
      SELECT json_object_agg(role, count)
      FROM (
        SELECT role, COUNT(*) as count
        FROM public.user_profiles
        GROUP BY role
      ) t
    ),
    'usersByStatus', (
      SELECT json_object_agg(status, count)
      FROM (
        SELECT status, COUNT(*) as count
        FROM public.user_profiles
        GROUP BY status
      ) t
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 4. Code Files to Modify or Create

### New Files to Create

#### 4.1 Supabase Configuration
**File**: `src/lib/supabase/client.ts`
```typescript
// Supabase client configuration for client-side operations
```

**File**: `src/lib/supabase/server.ts`
```typescript
// Supabase client configuration for server-side operations
```

**File**: `src/lib/supabase/middleware.ts`
```typescript
// Middleware helper for Supabase auth
```

#### 4.2 Database Types
**File**: `src/lib/supabase/types.ts`
```typescript
// Generated Supabase types and custom interfaces
```

**File**: `src/lib/supabase/database.types.ts`
```typescript
// Auto-generated database types from Supabase CLI
```

#### 4.3 Auth Components
**File**: `src/components/auth/AuthProvider.tsx`
```typescript
// Supabase Auth context provider
```

**File**: `src/components/auth/ProtectedRoute.tsx`
```typescript
// Route protection component
```

#### 4.4 New API Routes
**File**: `src/app/api/auth/callback/route.ts`
```typescript
// Supabase auth callback handler
```

**File**: `src/app/api/users/route.ts`
```typescript
// GET /api/users - List users with pagination and filtering
// POST /api/users - Create new user
```

**File**: `src/app/api/users/[id]/route.ts`
```typescript
// GET /api/users/[id] - Get user by ID
// PUT /api/users/[id] - Update user
// DELETE /api/users/[id] - Delete user
```

**File**: `src/app/api/users/[id]/activities/route.ts`
```typescript
// GET /api/users/[id]/activities - Get user activities
```

**File**: `src/app/api/users/[id]/suspend/route.ts`
```typescript
// POST /api/users/[id]/suspend - Suspend user
```

**File**: `src/app/api/users/[id]/activate/route.ts`
```typescript
// POST /api/users/[id]/activate - Activate user
```

**File**: `src/app/api/users/bulk/route.ts`
```typescript
// PUT /api/users/bulk - Bulk update users
// DELETE /api/users/bulk - Bulk delete users
```

**File**: `src/app/api/users/dashboard/route.ts`
```typescript
// GET /api/users/dashboard - Get dashboard metrics
```

**File**: `src/app/api/users/analytics/route.ts`
```typescript
// GET /api/users/analytics - Get analytics data
```

#### 4.5 Service Layer Updates
**File**: `src/services/supabaseUserService.ts`
```typescript
// Real Supabase implementation replacing mock functions
```

**File**: `src/services/authService.supabase.ts`
```typescript
// Supabase auth service implementation
```

#### 4.6 Hook Updates
**File**: `src/hooks/useSupabaseAuth.ts`
```typescript
// Custom hook for Supabase authentication
```

**File**: `src/hooks/useUsers.ts`
```typescript
// React Query hooks for user data operations
```

### Files to Modify

#### 4.7 Existing Store Updates
**File**: `src/stores/users-store.ts`
- Replace mock API calls with real Supabase service calls
- Update error handling for Supabase errors
- Add optimistic updates with proper rollback
- Remove mock data generation functions

#### 4.8 Service Layer Updates
**File**: `src/services/userService.ts`
- Replace fetch calls with Supabase client calls
- Update error handling for Supabase errors
- Add proper TypeScript types from Supabase

#### 4.9 Authentication Updates
**File**: `src/services/authService.ts`
- Replace cookie-based auth with Supabase Auth
- Update login/logout/signup methods
- Add session management

**File**: `middleware.ts`
- Replace cookie checking with Supabase session validation
- Update route protection logic
- Add proper error handling

#### 4.10 Component Updates
**File**: `src/components/LoginPage.tsx`
- Replace form submission with Supabase Auth
- Add proper error handling
- Update success/redirect logic

**File**: `src/app/layout.tsx`
- Add Supabase Auth provider
- Add React Query provider
- Update session management

**File**: `src/app/dashboard/users/page.tsx`
- Replace mock data with real API calls
- Add loading and error states
- Update data refresh logic

**File**: `src/app/dashboard/users/list/page.tsx`
- Connect to real user data
- Add server-side filtering and pagination
- Update bulk operations

**File**: `src/app/dashboard/users/[id]/page.tsx`
- Connect to real user detail data
- Add real-time updates via Supabase subscriptions
- Update user actions

---

## 5. API Routes and Middleware

### New API Route Structure
```
src/app/api/
├── auth/
│   ├── callback/
│   │   └── route.ts              # Supabase auth callback
│   ├── login/
│   │   └── route.ts              # Login endpoint
│   ├── logout/
│   │   └── route.ts              # Logout endpoint
│   └── refresh/
│       └── route.ts              # Token refresh
├── users/
│   ├── route.ts                  # GET /api/users, POST /api/users
│   ├── [id]/
│   │   ├── route.ts              # GET, PUT, DELETE /api/users/[id]
│   │   ├── activities/
│   │   │   └── route.ts          # GET /api/users/[id]/activities
│   │   ├── suspend/
│   │   │   └── route.ts          # POST /api/users/[id]/suspend
│   │   └── activate/
│   │       └── route.ts          # POST /api/users/[id]/activate
│   ├── bulk/
│   │   └── route.ts              # PUT, DELETE /api/users/bulk
│   ├── dashboard/
│   │   └── route.ts              # GET /api/users/dashboard
│   └── analytics/
│       └── route.ts              # GET /api/users/analytics
└── health/
    └── route.ts                  # Health check endpoint
```

### Middleware Updates
**File**: `middleware.ts`
- Add Supabase session validation
- Handle auth state changes
- Update route protection rules
- Add proper error responses

---

## 6. Store Integration Points

### Updated Store Architecture
```typescript
// src/stores/users-store.ts modifications:
interface UsersState {
  // Existing properties remain
  
  // New Supabase-specific properties
  supabaseClient: SupabaseClient | null;
  subscription: RealtimeChannel | null;
  
  // Updated actions to use Supabase
  fetchUsers: (page?: number, pageSize?: number) => Promise<void>;
  createUser: (user: CreateUserRequest) => Promise<void>;
  updateUser: (id: string, updates: UpdateUserRequest) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  
  // New Supabase-specific actions
  subscribeToUserChanges: () => void;
  unsubscribeFromUserChanges: () => void;
  syncWithSupabase: () => Promise<void>;
}
```

### Real-time Subscriptions
- Add Supabase real-time subscriptions to user store
- Update UI automatically when data changes
- Handle subscription cleanup on component unmount

---

## 7. Configuration Updates

### Supabase CLI Configuration
**File**: `supabase/config.toml`
```toml
[api]
enabled = true
port = 54321

[auth]
enabled = true
port = 54324

[db]
port = 54322

[studio]
enabled = true
port = 54323

[functions]
enabled = true
```

### Next.js Configuration Updates
**File**: `next.config.ts`
```typescript
// Add Supabase environment variables
// Update headers for CORS if needed
// Add any Supabase-specific webpack config
```

### TypeScript Configuration
**File**: `tsconfig.json`
- Add path mapping for Supabase types
- Update include/exclude patterns if needed

---

## 8. Testing Updates

### New Test Files
**File**: `src/services/__tests__/supabaseUserService.test.ts`
**File**: `src/hooks/__tests__/useSupabaseAuth.test.ts`
**File**: `src/components/auth/__tests__/AuthProvider.test.tsx`

### Updated Test Files
**File**: `src/stores/__tests__/users-store.test.ts`
- Update mocks to use Supabase client mocks
- Test real-time subscription functionality
- Test error handling for Supabase errors

---

## 9. Documentation Updates

### New Documentation Files
**File**: `docs/supabase-setup.md`
- Supabase project setup instructions
- Environment variable configuration
- Database migration guide

**File**: `docs/api-reference.md`
- Complete API endpoint documentation
- Request/response schemas
- Error handling examples

### Updated Documentation Files
**File**: `README.md`
- Add Supabase setup instructions
- Update development workflow
- Add troubleshooting section

---

## 10. Migration Execution Plan

### Phase 1: Foundation Setup (Week 1)
1. **Day 1-2**: Supabase project setup and configuration
   - Create Supabase project
   - Configure environment variables
   - Set up database schema
   - Install required dependencies

2. **Day 3-4**: Authentication migration
   - Implement Supabase Auth
   - Update middleware and route protection
   - Migrate login/logout functionality
   - Test authentication flow

3. **Day 5**: Core API structure
   - Create basic API routes
   - Set up Supabase client configuration
   - Implement error handling patterns

### Phase 2: Data Migration (Week 2)
1. **Day 1-2**: User management API
   - Implement user CRUD operations
   - Add pagination and filtering
   - Test with real data

2. **Day 3-4**: Store integration
   - Update Zustand store to use real APIs
   - Add real-time subscriptions
   - Implement optimistic updates

3. **Day 5**: UI integration
   - Connect existing UI to real data
   - Add loading and error states
   - Test user interactions

### Phase 3: Advanced Features (Week 3)
1. **Day 1-2**: Analytics and reporting
   - Implement dashboard metrics API
   - Add analytics data endpoints
   - Create data aggregation functions

2. **Day 3-4**: Bulk operations and admin features
   - Implement bulk user operations
   - Add user activity tracking
   - Create admin-specific functionality

3. **Day 5**: Performance optimization
   - Add database indexes
   - Implement caching strategies
   - Optimize query performance

### Phase 4: Testing and Polish (Week 4)
1. **Day 1-2**: Comprehensive testing
   - Write unit tests for all new functionality
   - Add integration tests for API endpoints
   - Test real-time features

2. **Day 3-4**: Error handling and edge cases
   - Implement robust error handling
   - Add retry mechanisms
   - Handle offline scenarios

3. **Day 5**: Documentation and deployment
   - Complete API documentation
   - Update user guides
   - Prepare for production deployment

---

## 11. Risk Mitigation Strategies

### Technical Risks
1. **Data Migration Issues**
   - Create comprehensive backup strategy
   - Implement rollback procedures
   - Test migration on staging environment

2. **Performance Degradation**
   - Monitor query performance
   - Implement database indexes
   - Add caching layers where appropriate

3. **Real-time Feature Complexity**
   - Start with simple subscriptions
   - Add error handling for connection issues
   - Implement graceful degradation

### Business Risks
1. **User Experience Disruption**
   - Maintain existing UI patterns
   - Implement feature flags for gradual rollout
   - Provide clear migration communication

2. **Data Security**
   - Implement proper RLS policies
   - Use environment variables for secrets
   - Regular security audits

---

## Success Criteria

### Technical Success Metrics
- [ ] All existing functionality works with Supabase backend
- [ ] Real-time updates function correctly
- [ ] API response times < 500ms for 95% of requests
- [ ] 100% test coverage for new API endpoints
- [ ] Zero data loss during migration

### Business Success Metrics
- [ ] User authentication success rate > 99%
- [ ] Dashboard load time < 2 seconds
- [ ] User management operations complete in < 1 second
- [ ] Real-time updates appear within 500ms
- [ ] Zero security vulnerabilities in penetration testing

---

## Rollback Plan

### Immediate Rollback (if critical issues arise)
1. Revert to previous deployment
2. Restore from database backup
3. Switch back to mock data temporarily
4. Investigate and fix issues in staging

### Partial Rollback Options
1. Disable real-time features while keeping API
2. Fallback to mock data for specific features
3. Use feature flags to control rollout

---

This migration plan provides a comprehensive roadmap for integrating Supabase into the SenseiiWyze Dashboard while maintaining existing functionality and user experience. Each phase builds upon the previous one, allowing for iterative testing and validation throughout the process.

---

# Better-Auth Migration: File-by-File Changes

This section outlines the specific changes needed for each file when migrating from the current mock authentication system to Better-Auth.

## 1. **package.json**

### Changes Required:
```diff
{
  "dependencies": {
+   "better-auth": "^1.0.0",
+   "@better-auth/nextjs": "^1.0.0",
+   "@better-auth/prisma-adapter": "^1.0.0"
  }
}
```

**Impact**: Adds Better-Auth core library, Next.js integration, and Prisma adapter for database operations.

**Migration Notes**:
- Better-Auth provides built-in multi-tenant support
- Includes social OAuth providers (Google, GitHub, etc.)
- TypeScript-first design with excellent type safety

---

## 2. **.env.example**

### Changes Required:
```diff
# Authentication Configuration
+ BETTER_AUTH_URL=http://localhost:3000
+ BETTER_AUTH_SECRET=your-better-auth-secret-key-here
+ BETTER_AUTH_TRUSTED_ORIGINS=http://localhost:3000,https://yourdomain.com

# Database Configuration  
+ DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# OAuth Providers (Optional)
+ GOOGLE_CLIENT_ID=your-google-client-id
+ GOOGLE_CLIENT_SECRET=your-google-client-secret
+ GITHUB_CLIENT_ID=your-github-client-id
+ GITHUB_CLIENT_SECRET=your-github-client-secret

# Multi-tenant Configuration
+ BETTER_AUTH_ENABLE_ORGANIZATIONS=true
+ BETTER_AUTH_DEFAULT_ROLE=member
```

**Impact**: Configures Better-Auth environment variables for authentication, database connection, and multi-tenant features.

**Migration Notes**:
- `BETTER_AUTH_SECRET` should be a cryptographically secure random string
- `BETTER_AUTH_TRUSTED_ORIGINS` prevents CSRF attacks
- OAuth providers are optional but recommended for better UX

---

## 3. **src/services/authService.ts**

### Current State:
```typescript
// Mock authentication with cookie-based sessions
export const authService = {
  login: async (email: string, password: string) => {
    // Mock login logic
  },
  logout: async () => {
    // Mock logout logic
  },
  getCurrentUser: () => {
    // Returns mock user data
  }
};
```

### Changes Required:
```diff
- import { cookies } from 'next/headers';
+ import { betterAuth } from 'better-auth';
+ import { prismaAdapter } from '@better-auth/prisma-adapter';
+ import { organization } from 'better-auth/plugins';
+ import { prisma } from '@/lib/prisma';

- // Mock user data and cookie-based auth
+ const auth = betterAuth({
+   database: prismaAdapter(prisma, {
+     provider: 'postgresql'
+   }),
+   plugins: [
+     organization({
+       allowUserToCreateOrganization: true,
+       organizationLimit: 5
+     })
+   ],
+   socialProviders: {
+     google: {
+       clientId: process.env.GOOGLE_CLIENT_ID!,
+       clientSecret: process.env.GOOGLE_CLIENT_SECRET!
+     },
+     github: {
+       clientId: process.env.GITHUB_CLIENT_ID!,
+       clientSecret: process.env.GITHUB_CLIENT_SECRET!
+     }
+   },
+   trustedOrigins: process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(',') || []
+ });

export const authService = {
-   login: async (email: string, password: string) => {
-     // Mock implementation
-   },
+   signIn: auth.api.signInEmail,
+   signUp: auth.api.signUpEmail,
+   signOut: auth.api.signOut,
+   getSession: auth.api.getSession,
+   
+   // Organization management
+   createOrganization: auth.api.createOrganization,
+   inviteToOrganization: auth.api.inviteToOrganization,
+   acceptInvitation: auth.api.acceptInvitation
};

+ export { auth };
```

**Impact**: Replaces mock authentication with Better-Auth SDK calls, adds multi-tenant organization support.

**Migration Notes**:
- Better-Auth handles session management automatically
- Built-in support for email/password and OAuth authentication
- Organization plugin provides multi-tenancy out of the box

---

## 4. **src/lib/betterAuthClient.ts** (new)

### Changes Required:
```diff
+ import { createAuthClient } from '@better-auth/nextjs';
+ 
+ export const authClient = createAuthClient({
+   baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000'
+ });
+ 
+ export const {
+   signIn,
+   signUp,
+   signOut,
+   useSession,
+   getSession,
+   
+   // Organization hooks
+   useOrganization,
+   createOrganization,
+   inviteToOrganization,
+   switchOrganization
+ } = authClient;
```

**Impact**: Creates Better-Auth client for frontend operations with built-in React hooks.

**Migration Notes**:
- Provides type-safe client-side authentication methods
- Includes React hooks for session and organization management
- Handles token refresh and session persistence automatically

---

## 5. **prisma/migrations/** or **supabase/sql/** (new)

### Database Schema Migration:

#### For Prisma (prisma/schema.prisma):
```diff
+ model Account {
+   id                String  @id @default(cuid())
+   userId            String
+   type              String
+   provider          String
+   providerAccountId String
+   refresh_token     String? @db.Text
+   access_token      String? @db.Text
+   expires_at        Int?
+   token_type        String?
+   scope             String?
+   id_token          String? @db.Text
+   session_state     String?
+   user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
+ 
+   @@unique([provider, providerAccountId])
+   @@map("accounts")
+ }
+ 
+ model Session {
+   id           String   @id @default(cuid())
+   sessionToken String   @unique
+   userId       String
+   expires      DateTime
+   user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
+ 
+   @@map("sessions")
+ }
+ 
+ model User {
+   id            String    @id @default(cuid())
+   name          String?
+   email         String    @unique
+   emailVerified DateTime?
+   image         String?
+   accounts      Account[]
+   sessions      Session[]
+   
+   // Organization relationships
+   organizationMemberships OrganizationMember[]
+   
+   createdAt DateTime @default(now())
+   updatedAt DateTime @updatedAt
+ 
+   @@map("users")
+ }
+ 
+ model Organization {
+   id          String   @id @default(cuid())
+   name        String
+   slug        String   @unique
+   description String?
+   image       String?
+   
+   members     OrganizationMember[]
+   
+   createdAt DateTime @default(now())
+   updatedAt DateTime @updatedAt
+ 
+   @@map("organizations")
+ }
+ 
+ model OrganizationMember {
+   id             String       @id @default(cuid())
+   userId         String
+   organizationId String
+   role           String       @default("member")
+   joinedAt       DateTime     @default(now())
+   
+   user         User         @relation(fields: [userId], references: [id], onDelete: Cascade)
+   organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
+   
+   @@unique([userId, organizationId])
+   @@map("organization_members")
+ }
```

#### For Supabase SQL:
```diff
+ -- Better-Auth required tables
+ CREATE TABLE IF NOT EXISTS accounts (
+   id TEXT PRIMARY KEY,
+   user_id TEXT NOT NULL,
+   type TEXT NOT NULL,
+   provider TEXT NOT NULL,
+   provider_account_id TEXT NOT NULL,
+   refresh_token TEXT,
+   access_token TEXT,
+   expires_at INTEGER,
+   token_type TEXT,
+   scope TEXT,
+   id_token TEXT,
+   session_state TEXT,
+   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
+   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
+   UNIQUE(provider, provider_account_id)
+ );
+ 
+ CREATE TABLE IF NOT EXISTS sessions (
+   id TEXT PRIMARY KEY,
+   session_token TEXT UNIQUE NOT NULL,
+   user_id TEXT NOT NULL,
+   expires TIMESTAMP WITH TIME ZONE NOT NULL,
+   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
+   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
+ );
+ 
+ CREATE TABLE IF NOT EXISTS users (
+   id TEXT PRIMARY KEY,
+   name TEXT,
+   email TEXT UNIQUE NOT NULL,
+   email_verified TIMESTAMP WITH TIME ZONE,
+   image TEXT,
+   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
+   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
+ );
+ 
+ CREATE TABLE IF NOT EXISTS organizations (
+   id TEXT PRIMARY KEY,
+   name TEXT NOT NULL,
+   slug TEXT UNIQUE NOT NULL,
+   description TEXT,
+   image TEXT,
+   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
+   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
+ );
+ 
+ CREATE TABLE IF NOT EXISTS organization_members (
+   id TEXT PRIMARY KEY,
+   user_id TEXT NOT NULL,
+   organization_id TEXT NOT NULL,
+   role TEXT DEFAULT 'member',
+   joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
+   UNIQUE(user_id, organization_id)
+ );
```

**Impact**: Creates database tables required for Better-Auth authentication and multi-tenant organizations.

**Migration Notes**:
- Tables follow Better-Auth's expected schema
- Supports both OAuth accounts and email/password authentication
- Organization tables enable multi-tenancy features

---

## 6. **src/pages/api/auth/** (new)

### **login.ts**:
```diff
+ import { auth } from '@/services/authService';
+ import type { NextApiRequest, NextApiResponse } from 'next';
+ 
+ export default auth.handler;
```

### **logout.ts**:
```diff
+ import { auth } from '@/services/authService';
+ import type { NextApiRequest, NextApiResponse } from 'next';
+ 
+ export default auth.handler;
```

### **callback.ts**:
```diff
+ import { auth } from '@/services/authService';
+ import type { NextApiRequest, NextApiResponse } from 'next';
+ 
+ export default auth.handler;
```

### **[...auth].ts** (catch-all route):
```diff
+ import { auth } from '@/services/authService';
+ import type { NextApiRequest, NextApiResponse } from 'next';
+ 
+ export default auth.handler;
```

**Impact**: Creates API routes for Better-Auth authentication endpoints.

**Migration Notes**:
- Better-Auth provides a single handler for all auth routes
- Supports dynamic routing with Next.js API routes
- Handles OAuth callbacks, sign-in, sign-out automatically

---

## 7. **src/stores/account-context-store.ts**

### Current State:
```typescript
interface AccountContextState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
```

### Changes Required:
```diff
- import { cookies } from 'next/headers';
+ import { useSession, useOrganization } from '@/lib/betterAuthClient';
+ import { authClient } from '@/lib/betterAuthClient';

interface AccountContextState {
-   user: User | null;
-   isAuthenticated: boolean;
+   session: Session | null;
+   user: User | null;
+   organization: Organization | null;
+   isAuthenticated: boolean;
+   isLoading: boolean;
    
-   login: (email: string, password: string) => Promise<void>;
-   logout: () => void;
+   signIn: (email: string, password: string) => Promise<void>;
+   signUp: (email: string, password: string, name: string) => Promise<void>;
+   signOut: () => Promise<void>;
+   
+   // Organization actions
+   createOrganization: (name: string, slug: string) => Promise<void>;
+   switchOrganization: (organizationId: string) => Promise<void>;
+   inviteToOrganization: (email: string, role: string) => Promise<void>;
}

const useAccountContextStore = create<AccountContextState>((set, get) => ({
-   user: null,
-   isAuthenticated: false,
+   session: null,
+   user: null,
+   organization: null,
+   isAuthenticated: false,
+   isLoading: true,

-   login: async (email: string, password: string) => {
-     // Mock login implementation
-   },
+   signIn: async (email: string, password: string) => {
+     try {
+       const result = await authClient.signIn.email({
+         email,
+         password
+       });
+       
+       if (result.data?.session) {
+         set({ 
+           session: result.data.session,
+           user: result.data.user,
+           isAuthenticated: true,
+           isLoading: false
+         });
+       }
+     } catch (error) {
+       console.error('Sign in error:', error);
+       throw error;
+     }
+   },

-   logout: () => {
-     // Mock logout implementation
-   }
+   signUp: async (email: string, password: string, name: string) => {
+     try {
+       const result = await authClient.signUp.email({
+         email,
+         password,
+         name
+       });
+       
+       if (result.data?.session) {
+         set({ 
+           session: result.data.session,
+           user: result.data.user,
+           isAuthenticated: true,
+           isLoading: false
+         });
+       }
+     } catch (error) {
+       console.error('Sign up error:', error);
+       throw error;
+     }
+   },
+   
+   signOut: async () => {
+     try {
+       await authClient.signOut();
+       set({ 
+         session: null,
+         user: null,
+         organization: null,
+         isAuthenticated: false,
+         isLoading: false
+       });
+     } catch (error) {
+       console.error('Sign out error:', error);
+       throw error;
+     }
+   },
+   
+   createOrganization: async (name: string, slug: string) => {
+     try {
+       const result = await authClient.createOrganization({
+         name,
+         slug
+       });
+       
+       if (result.data?.organization) {
+         set({ organization: result.data.organization });
+       }
+     } catch (error) {
+       console.error('Create organization error:', error);
+       throw error;
+     }
+   },
+   
+   switchOrganization: async (organizationId: string) => {
+     try {
+       const result = await authClient.switchOrganization({
+         organizationId
+       });
+       
+       if (result.data?.organization) {
+         set({ organization: result.data.organization });
+       }
+     } catch (error) {
+       console.error('Switch organization error:', error);
+       throw error;
+     }
+   },
+   
+   inviteToOrganization: async (email: string, role: string) => {
+     try {
+       await authClient.inviteToOrganization({
+         email,
+         role
+       });
+     } catch (error) {
+       console.error('Invite to organization error:', error);
+       throw error;
+     }
+   }
}));

+ // Initialize session on store creation
+ if (typeof window !== 'undefined') {
+   authClient.getSession().then((session) => {
+     if (session.data) {
+       useAccountContextStore.setState({
+         session: session.data.session,
+         user: session.data.user,
+         organization: session.data.organization,
+         isAuthenticated: true,
+         isLoading: false
+       });
+     } else {
+       useAccountContextStore.setState({
+         isLoading: false
+       });
+     }
+   });
+ }

export { useAccountContextStore };
```

**Impact**: Transforms the account store to use Better-Auth instead of mock authentication, adds multi-tenant organization support.

**Migration Notes**:
- Better-Auth session management replaces cookie-based auth
- Organization features enable multi-tenancy
- Store automatically syncs with Better-Auth session state
- Proper error handling and loading states

---

## Migration Checklist

### Phase 1: Setup (Day 1)
- [ ] Install Better-Auth dependencies
- [ ] Configure environment variables
- [ ] Run database migrations
- [ ] Create Better-Auth configuration

### Phase 2: Authentication (Day 2-3)
- [ ] Replace authService with Better-Auth implementation
- [ ] Create API auth routes
- [ ] Update account context store
- [ ] Test basic authentication flow

### Phase 3: Multi-tenancy (Day 4-5)
- [ ] Implement organization management
- [ ] Update UI components for organization switching
- [ ] Test invitation and role management
- [ ] Verify tenant data isolation

### Phase 4: Testing & Polish (Day 6-7)
- [ ] Comprehensive authentication testing
- [ ] Organization feature testing
- [ ] Error handling verification
- [ ] Performance optimization
- [ ] Documentation updates

---

## Benefits of Better-Auth Migration

1. **Type Safety**: Full TypeScript support with generated types
2. **Multi-tenancy**: Built-in organization support for SaaS applications
3. **Security**: Industry-standard authentication with CSRF protection
4. **Developer Experience**: Simple API with React hooks
5. **Flexibility**: Supports multiple authentication providers
6. **Performance**: Optimized session management and caching
7. **Standards Compliance**: Follows OAuth 2.0 and OpenID Connect standards

This file-by-file migration plan provides the specific changes needed to implement Better-Auth while maintaining the existing application structure and user experience.
