# Next.js 15 Server-Side Refactoring Guide

> **Objective:** Refactor the SenseiiWyze dashboard codebase from client-side patterns to server-side rendering and server actions following Next.js 15 standards and Better Auth best practices.

> **Status:** 🟡 In Progress  
> **Last Updated:** 2025-08-02  
> **Priority:** High

## Executive Summary

The current codebase heavily relies on client-side rendering (`'use client'`) and client-side state management. This guide outlines a comprehensive refactoring approach to leverage Next.js 15's enhanced server-side capabilities, Better Auth's server API, and modern patterns for hydration and Suspense optimization.

## 🔍 Current State Analysis

### Authentication Patterns Identified

#### Issues Found:
1. **Heavy Client-Side Authentication** - All auth logic in browser
2. **Excessive `'use client'` Usage** - Most components are client-side
3. **No Server Actions** - All form submissions handled client-side
4. **Client Session Management** - Session checking in components
5. **Complex Client State** - Multiple `useState` hooks for simple operations

#### Files Analyzed:
- `src/app/auth/login/page.tsx` - Client-side login with useSession, useForm
- `src/app/app/page.tsx` - Client-side dashboard with useSession
- `src/app/app/settings/page.tsx` - Heavy client state (10+ useState hooks)
- `src/lib/auth-client.ts` - Complex client auth config with deprecated functions

## 🎯 Server-Side Refactoring Strategy

### Phase 1: Authentication Server Actions

#### Current Pattern (Client-Side):
```tsx
// src/app/auth/login/page.tsx
'use client'
import { useSession, authClient } from '@/lib/auth-client'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { data: session, isPending } = useSession()
  
  async function onSubmit(values: FormData) {
    setIsLoading(true)
    const { data, error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
      callbackURL: '/dashboard',
    })
    // Handle client-side state...
  }
}
```

#### Recommended Pattern (Server Actions):
```tsx
// src/app/auth/login/page.tsx - Server Component
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { LoginForm } from '@/components/auth/login-form'

export default async function LoginPage() {
  // Server-side session check
  const session = await auth.api.getSession({
    headers: await headers()
  })
  
  if (session) {
    redirect('/dashboard')
  }
  
  return <LoginForm />
}

// src/lib/actions/auth-actions.ts - Server Action
'use server'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  const { data, error } = await auth.api.signInEmail({
    email,
    password,
    headers: await headers()
  })
  
  if (error) {
    return { error: error.message }
  }
  
  redirect('/dashboard')
}
```

### Phase 2: Dashboard Server Components

#### Current Pattern (Client-Side):
```tsx
// src/app/app/page.tsx
'use client'
import { useSession } from '@/lib/auth-client'

export default function DashboardPage() {
  const { data: session, isPending } = useSession()
  const [user, setUser] = useState<User | null>(null)
  
  useEffect(() => {
    if (session?.user) {
      setUser({
        role: session.user.role,
        name: session.user.name,
        email: session.user.email
      })
    }
  }, [session])
  // Client-side loading states...
}
```

#### Recommended Pattern (Server Component):
```tsx
// src/app/app/page.tsx - Server Component
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { DashboardContent } from '@/components/dashboard/dashboard-content'

export default async function DashboardPage() {
  // Server-side session retrieval
  const session = await auth.api.getSession({
    headers: await headers()
  })
  
  if (!session) {
    redirect('/auth/login')
  }
  
  // Transform session data server-side
  const user = {
    role: session.user.role as User['role'] || 'learner',
    name: session.user.name,
    email: session.user.email
  }
  
  // Pass data to client component if needed
  return <DashboardContent user={user} />
}
```

### Phase 3: Settings Server Actions

#### Current Pattern (Client-Side):
```tsx
// src/app/app/settings/page.tsx
'use client'
export default function SettingsPage() {
  const [displayName, setDisplayName] = useState('')
  const [workplace, setWorkplace] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [theme, setTheme] = useState('system')
  // ... 6 more useState hooks
  
  const handleSave = () => {
    // Simulate save - no actual server interaction
    setHasUnsavedChanges(false)
  }
}
```

#### Recommended Pattern (Server Actions):
```tsx
// src/app/app/settings/page.tsx - Server Component
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { SettingsForm } from '@/components/settings/settings-form'

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  
  if (!session) {
    redirect('/auth/login')
  }
  
  return <SettingsForm user={session.user} />
}

// src/lib/actions/settings-actions.ts - Server Actions
'use server'
export async function updateUserProfile(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  
  if (!session) {
    throw new Error('Unauthorized')
  }
  
  // Update user data server-side
  const updates = {
    displayName: formData.get('displayName') as string,
    workplace: formData.get('workplace') as string,
    jobTitle: formData.get('jobTitle') as string,
  }
  
  // Save to database
  await updateUserInDatabase(session.user.id, updates)
  
  revalidateTag('user-profile')
  return { success: true }
}
```

## 📋 Detailed Refactoring Plan

### Phase 1: Authentication Server Actions (Priority: High)

#### File: `src/app/auth/login/page.tsx`

**BEFORE (Current - Client-Side):**
```tsx
'use client'
import { useSession, authClient } from '@/lib/auth-client'
import { useForm } from 'react-hook-form'
import { useState } from 'react'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { data: session, isPending } = useSession()
  
  async function onSubmit(values: FormData) {
    setIsLoading(true)
    const { data, error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
      callbackURL: '/dashboard',
    })
    // Client-side error handling...
  }
  
  if (isPending) return <LoadingSpinner />
  if (session) router.push('/dashboard')
  
  return <LoginForm onSubmit={onSubmit} />
}
```

**AFTER (Server-Side with Actions):**
```tsx
// src/app/auth/login/page.tsx
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { LoginForm } from '@/components/auth/login-form'

export default async function LoginPage() {
  // Server-side session check - No client-side loading states needed
  const session = await auth.api.getSession({
    headers: await headers()
  })
  
  if (session) {
    redirect('/dashboard')
  }
  
  return <LoginForm />
}

// src/lib/actions/auth-actions.ts
'use server'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  const { data, error } = await auth.api.signInEmail({
    email,
    password,
    headers: await headers()
  })
  
  if (error) {
    return { error: error.message }
  }
  
  redirect('/dashboard')
}

// src/components/auth/login-form.tsx
'use client'
import { useFormState } from 'react-dom'
import { loginAction } from '@/lib/actions/auth-actions'

export function LoginForm() {
  const [state, formAction] = useFormState(loginAction, null)
  
  return (
    <form action={formAction}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      {state?.error && <p className="error">{state.error}</p>}
      <button type="submit">Login</button>
    </form>
  )
}
```

**Benefits:**
- ✅ No client-side JavaScript for authentication logic
- ✅ Server-side validation and error handling
- ✅ Immediate redirect without client-side routing
- ✅ Better SEO and faster initial page load

#### File: `src/app/app/page.tsx`

**BEFORE (Current - Client-Side):**
```tsx
'use client'
import { useSession } from '@/lib/auth-client'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
  const { data: session, isPending } = useSession()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (session?.user) {
      setUser({
        role: session.user.role,
        name: session.user.name,
        email: session.user.email
      })
    }
  }, [session])

  if (isPending) return <Skeleton />
  if (!user) return <AuthRequired />
  
  return (
    <div>
      <h1>Welcome back, {user.name}</h1>
      {/* Dashboard content */}
    </div>
  )
}
```

**AFTER (Server Component):**
```tsx
// src/app/app/page.tsx
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { DashboardContent } from '@/components/dashboard/dashboard-content'

export default async function DashboardPage() {
  // Server-side session retrieval - no loading states needed
  const session = await auth.api.getSession({
    headers: await headers()
  })
  
  if (!session) {
    redirect('/auth/login')
  }
  
  // Transform session data server-side
  const user = {
    role: session.user.role as User['role'] || 'learner',
    name: session.user.name,
    email: session.user.email
  }
  
  return (
    <div>
      <h1>Welcome back, {user.name}</h1>
      <DashboardContent user={user} />
    </div>
  )
}
```

**Benefits:**
- ✅ No hydration mismatch issues
- ✅ Faster time to first contentful paint
- ✅ Server-side authentication check
- ✅ Eliminates client-side loading states

### Phase 2: Settings Server Actions (Priority: High)

#### File: `src/app/app/settings/page.tsx`

**BEFORE (Current - Client-Side):**
```tsx
'use client'
export default function SettingsPage() {
  // 10+ useState hooks for form state
  const [displayName, setDisplayName] = useState('')
  const [workplace, setWorkplace] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [theme, setTheme] = useState('system')
  // ... more useState hooks
  
  const handleSave = () => {
    setHasUnsavedChanges(false)
    // No actual server interaction
  }
  
  return (
    <form>
      <input 
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
      />
      {/* More form fields... */}
      <button onClick={handleSave}>Save</button>
    </form>
  )
}
```

**AFTER (Server Actions):**
```tsx
// src/app/app/settings/page.tsx
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { SettingsForm } from '@/components/settings/settings-form'

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  
  if (!session) {
    redirect('/auth/login')
  }
  
  return <SettingsForm user={session.user} />
}

// src/lib/actions/settings-actions.ts
'use server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { revalidateTag } from 'next/cache'

export async function updateUserProfile(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  
  if (!session) {
    throw new Error('Unauthorized')
  }
  
  const updates = {
    displayName: formData.get('displayName') as string,
    workplace: formData.get('workplace') as string,
    jobTitle: formData.get('jobTitle') as string,
  }
  
  // Validate data
  if (!updates.displayName?.trim()) {
    return { error: 'Display name is required' }
  }
  
  // Save to database
  await updateUserInDatabase(session.user.id, updates)
  
  // Revalidate cached data
  revalidateTag('user-profile')
  
  return { success: true, message: 'Profile updated successfully' }
}

// src/components/settings/settings-form.tsx
'use client'
import { useFormState, useFormStatus } from 'react-dom'
import { updateUserProfile } from '@/lib/actions/settings-actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save Changes'}
    </button>
  )
}

export function SettingsForm({ user }: { user: User }) {
  const [state, formAction] = useFormState(updateUserProfile, null)
  
  return (
    <form action={formAction}>
      <input 
        name="displayName" 
        defaultValue={user.name}
        required
      />
      <input 
        name="workplace" 
        defaultValue={user.workplace}
      />
      <input 
        name="jobTitle" 
        defaultValue={user.jobTitle}
      />
      
      {state?.error && (
        <p className="error">{state.error}</p>
      )}
      {state?.success && (
        <p className="success">{state.message}</p>
      )}
      
      <SubmitButton />
    </form>
  )
}
```

**Benefits:**
- ✅ Real server-side data persistence
- ✅ Built-in form validation
- ✅ Progressive enhancement (works without JS)
- ✅ Optimistic UI updates with useFormStatus

### Phase 3: Component Server Migration (Priority: Medium)

#### File: `src/components/layouts/DashboardLayout.tsx`

**BEFORE (Unnecessary Client Component):**
```tsx
'use client'
import React from 'react'

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  return (
    <main className="min-h-screen bg-background">
      <div className="py-8">
        {title && <h1>{title}</h1>}
        <div className="max-w-7xl">{children}</div>
      </div>
    </main>
  )
}
```

**AFTER (Server Component):**
```tsx
// Remove 'use client' - this doesn't need client-side logic
import React from 'react'

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  return (
    <main className="min-h-screen bg-background">
      <div className="py-8">
        {title && <h1>{title}</h1>}
        <div className="max-w-7xl">{children}</div>
      </div>
    </main>
  )
}
```

#### File: `src/components/dashboards/CEODashboard.tsx`

**BEFORE (Unnecessary Client Component):**
```tsx
'use client'
export function CEODashboard() {
  return (
    <DashboardLayout title="CEO Dashboard">
      <div>
        <MetricCard title="MRR" value="$0" />
        <MetricCard title="Users" value="0" />
      </div>
    </DashboardLayout>
  )
}
```

**AFTER (Server Component with Data Fetching):**
```tsx
// src/components/dashboards/CEODashboard.tsx
import { Suspense } from 'react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { fetchCEOMetrics } from '@/lib/data/metrics'

export async function CEODashboard({ userId }: { userId: string }) {
  return (
    <DashboardLayout title="CEO Dashboard">
      <Suspense fallback={<MetricsSkeleton />}>
        <CEOMetrics userId={userId} />
      </Suspense>
    </DashboardLayout>
  )
}

async function CEOMetrics({ userId }: { userId: string }) {
  const metrics = await fetchCEOMetrics(userId)
  
  return (
    <div>
      <MetricCard title="MRR" value={metrics.mrr} />
      <MetricCard title="Users" value={metrics.activeUsers} />
    </div>
  )
}
```

## 🚀 Implementation Roadmap

### Week 1: Authentication Refactoring
- [x] Create server actions for login/signup forms
- [x] Convert auth pages to server components  
- [ ] Implement server-side session validation
- [ ] Remove client-side auth state management
- [ ] Add proper error handling and validation

### Week 2: Dashboard & Core Pages  
- [ ] Convert dashboard pages to server components
- [ ] Implement server-side data fetching with Suspense
- [ ] Add Suspense boundaries for loading states
- [ ] Optimize hydration patterns

### Week 3: Settings & Forms
- [ ] Convert all settings forms to server actions
- [ ] Implement optimistic updates where needed
- [ ] Add server-side form validation
- [ ] Implement proper error states

### Week 4: Performance & Polish
- [ ] Add proper caching strategies with tags
- [ ] Implement streaming where beneficial  
- [ ] Optimize bundle sizes and eliminate unused client code
- [ ] Add comprehensive testing for server actions

## ⚡ Performance & Caching Strategy

### Next.js 15 Caching Approach
```tsx
// src/lib/data/metrics.ts
import { unstable_cache } from 'next/cache'

export const fetchCEOMetrics = unstable_cache(
  async (userId: string) => {
    // Expensive database query
    return await db.query.getUserMetrics(userId)
  },
  ['ceo-metrics'],
  {
    tags: ['user-metrics', 'ceo-dashboard'],
    revalidate: 300 // 5 minutes
  }
)
```

### Server Action Performance
```tsx
// src/lib/actions/settings-actions.ts
'use server'
import { revalidateTag } from 'next/cache'

export async function updateUserProfile(formData: FormData) {
  // Update database
  await updateUser(userId, data)
  
  // Revalidate specific cached data
  revalidateTag('user-profile')
  revalidateTag('dashboard-metrics')
  
  return { success: true }
}
```

## 📚 Key Documentation References

Based on research using Context7 and Firecrawl:

### Next.js 15 Server Actions:
- Use `'use server'` directive for server actions
- Async request APIs (headers, cookies, params) are now async
- Caching defaults changed - GET routes no longer cached by default
- Server actions handle form submissions and data mutations

### Better Auth Server API:
- Use `auth.api.getSession()` for server-side session retrieval
- Use `auth.api.signInEmail()` for server-side authentication
- Headers must be passed to server API calls using `await headers()`
- Server-side operations are more secure and performant
- Use `nextCookies()` plugin for server action cookie handling
- RSCs cannot set cookies - use server actions or route handlers for mutations

### Key Better Auth Patterns from Official Docs:

#### Server Component Session Check:
```tsx
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers() // Required for cookie access
  })
  
  if (!session) {
    redirect("/sign-in")
  }
  
  return <h1>Welcome {session.user.name}</h1>
}
```

#### Server Action Authentication:
```tsx
// src/lib/auth.ts - Add nextCookies plugin
import { betterAuth } from "better-auth"
import { nextCookies } from "better-auth/next-js"

export const auth = betterAuth({
  // ... your config
  plugins: [
    nextCookies() // MUST be last plugin - enables cookie setting in server actions
  ]
})

// src/lib/actions/auth-actions.ts
'use server'
import { auth } from "@/lib/auth"

export async function signInAction(email: string, password: string) {
  // With nextCookies plugin, cookies are automatically set
  const { data, error } = await auth.api.signInEmail({
    body: {
      email,
      password,
    }
  })
  
  if (error) {
    return { error: error.message }
  }
  
  // Session cookie is now set automatically
  return { success: true }
}
```

#### Important Notes:
- **Always pass headers**: `headers: await headers()` is required for session retrieval
- **RSCs can't set cookies**: Use server actions or route handlers for authentication
- **Use nextCookies plugin**: Essential for server actions that need to set cookies
- **Cookie cache limitations**: RSCs won't refresh cookie cache until server interaction

### Better Auth Middleware Patterns:

#### Lightweight Session Check (Recommended):
```tsx
// middleware.ts
import { NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request)
  
  // ⚠️ WARNING: This only checks existence, not validity!
  // Always validate on the server for protected actions
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ["/app/:path*", "/dashboard/:path*"]
}
```

#### Cookie Cache for Better Performance:
```tsx
// middleware.ts - Using cookie cache
import { getCookieCache } from "better-auth/cookies"

export async function middleware(request: NextRequest) {
  // Gets session from cookie cache (avoids API call)
  const session = await getCookieCache(request)
  
  if (!session) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }
  
  // Can access session data without server call
  console.log("User:", session.user.email)
  
  return NextResponse.next()
}
```

#### Custom Cookie Configuration:
```tsx
// If you have custom cookie names/prefixes
const sessionCookie = getSessionCookie(request, {
  cookieName: "my_session_cookie",
  cookiePrefix: "my_prefix"
})
```

### Common Better Auth Pitfalls & Solutions:

#### 1. Missing Headers in Server Actions:
```tsx
// ❌ WRONG - Missing headers
export async function getProfile() {
  const session = await auth.api.getSession() // Will fail!
}

// ✅ CORRECT - Include headers
export async function getProfile() {
  const session = await auth.api.getSession({
    headers: await headers()
  })
}
```

#### 2. OAuth in Server Actions:
```tsx
// ❌ WRONG - OAuth needs browser redirect
'use server'
export async function githubLogin() {
  await auth.api.signInSocial({ provider: 'github' }) // Won't work!
}

// ✅ CORRECT - Keep OAuth client-side
'use client'
export function GitHubButton() {
  return (
    <button onClick={() => authClient.signIn.social({ 
      provider: 'github',
      callbackURL: '/dashboard'
    })}>
      Sign in with GitHub
    </button>
  )
}
```

#### 3. Server Action Response Handling:
```tsx
// src/lib/actions/auth-actions.ts
'use server'
export async function signInAction(formData: FormData) {
  const response = await auth.api.signInEmail({
    body: {
      email: formData.get('email') as string,
      password: formData.get('password') as string
    },
    asResponse: true // Get full response object
  })
  
  // Can access response headers, status, etc.
  if (!response.ok) {
    const error = await response.json()
    return { error: error.message }
  }
  
  return { success: true }
}

## ⚠️ Migration Risks & Safety Strategy

### Critical Risk Areas

#### 1. Authentication State Management
**Files at Risk:**
- `src/lib/auth-client.ts` - Complex client auth with 500+ lines
- `src/app/auth/login/page.tsx` - Client-side session checks
- `src/components/layout/GlobalNavigation.tsx` - Uses client auth hooks

**Specific Risks:**
- 🔴 **Session state mismatch** between client/server
- 🔴 **OAuth redirect loops** if not handled properly
- 🔴 **Lost authentication** during migration

**Safe Migration Strategy:**
```tsx
// STEP 1: Create parallel server action (don't remove client yet)
// src/lib/actions/auth-actions.ts
'use server'
export async function loginActionV2(formData: FormData) {
  // New server implementation
}

// STEP 2: Feature flag the implementation
// src/app/auth/login/page.tsx
const useServerActions = process.env.NEXT_PUBLIC_USE_SERVER_ACTIONS === 'true'

export default function LoginPage() {
  if (useServerActions) {
    return <ServerLoginForm /> // New implementation
  }
  return <ClientLoginForm /> // Existing implementation
}

// STEP 3: Test thoroughly, then remove old code
```

#### 2. Form State & Validation
**Files at Risk:**
- `src/app/app/settings/page.tsx` - 10+ useState hooks
- `src/components/settings-sections/*.tsx` - All use client state

**Specific Risks:**
- 🟡 **Lost form data** on navigation
- 🟡 **Validation timing issues** 
- 🟡 **User experience degradation**

**Safe Migration Strategy:**
```tsx
// STEP 1: Implement progressive enhancement
// Keep client validation as backup
export function SettingsForm({ user }) {
  return (
    <form 
      action={updateUserProfile} // Server action
      onSubmit={(e) => {
        // Client-side validation still works if JS enabled
        if (!validateForm(e.currentTarget)) {
          e.preventDefault()
          return false
        }
      }}
    >
```

#### 3. Theme & UI State
**Files at Risk:**
- `src/components/theme-provider.tsx`
- `src/hooks/use-debounced-theme.ts`
- `src/stores/debounced-settings-store.ts`

**Specific Risks:**
- 🟡 **Flash of unstyled content** (FOUC)
- 🟡 **Hydration mismatches** with theme
- 🟡 **Lost user preferences**

**Safe Migration Strategy:**
```tsx
// Add theme script to prevent FOUC
// src/app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              const theme = localStorage.getItem('theme') || 'system';
              if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
              }
            `
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

### File-by-File Risk Matrix

| File | Risk Level | Dependencies | Safe Migration Order |
|------|------------|--------------|---------------------|
| `src/app/(marketing)/page.tsx` | 🟢 Low | None | Phase 1 - Already server-side |
| `src/app/auth/login/page.tsx` | 🔴 High | auth-client, hooks | Phase 2 - After auth actions |
| `src/app/auth/signup/page.tsx` | 🔴 High | auth-client, hooks | Phase 2 - With login |
| `src/app/app/page.tsx` | 🟡 Medium | useSession hook | Phase 3 - After auth |
| `src/app/app/settings/page.tsx` | 🟡 Medium | Multiple hooks | Phase 4 - After forms |
| `src/components/theme-provider.tsx` | 🟡 Medium | Global state | Phase 1 - Early fix |
| `src/components/layout/GlobalNavigation.tsx` | 🔴 High | Auth, routing | Phase 5 - After auth |
| `src/components/dashboards/*.tsx` | 🟢 Low | Static content | Phase 1 - Quick wins |

### Safe Testing Strategy

#### 1. Parallel Implementation Testing
```bash
# Run both implementations side-by-side
NEXT_PUBLIC_USE_SERVER_ACTIONS=true pnpm dev # Port 3000
NEXT_PUBLIC_USE_SERVER_ACTIONS=false pnpm dev --port 3001 # Port 3001

# Compare behavior between both versions
```

#### 2. Progressive Rollout
```tsx
// src/lib/feature-flags.ts
export function useServerActions(feature: string): boolean {
  // Start with 10% of users
  const rolloutPercentage = {
    'auth': 0.1,
    'settings': 0.0, // Not ready yet
    'dashboard': 0.5, // 50% rollout
  }[feature] || 0
  
  const userId = getUserId()
  const hash = hashUserId(userId)
  return hash < rolloutPercentage
}
```

#### 3. Rollback Strategy
```json
// package.json
{
  "scripts": {
    "dev": "next dev",
    "dev:client": "NEXT_PUBLIC_FORCE_CLIENT=true next dev",
    "dev:server": "NEXT_PUBLIC_FORCE_SERVER=true next dev",
    "rollback": "git checkout main -- 'src/**/*.tsx' && pnpm install"
  }
}
```

### 🔄 Incremental Migration with Validation Loops

Following **Start Small → Validate → Expand → Scale** for EVERY component:

#### Example: Login Page Migration

**🟢 START SMALL (Day 1 - 2 hours)**
```tsx
// FIRST: Just create the server action, don't use it yet
// src/lib/actions/auth-actions.ts
'use server'
export async function testLoginAction(formData: FormData) {
  console.log('Server action called:', {
    email: formData.get('email'),
    timestamp: new Date().toISOString()
  })
  return { success: true, message: 'Test passed' }
}

// Add a test button to existing login page
<button onClick={async () => {
  const form = new FormData()
  form.append('email', 'test@example.com')
  const result = await testLoginAction(form)
  console.log('Server action result:', result)
}}>
  Test Server Action
</button>
```

**✅ VALIDATE (Day 1 - 30 minutes)**
- Does the server action execute?
- Are logs appearing in server console?
- Any CORS or header issues?
- **Feedback Loop**: Fix any issues before proceeding

**📈 EXPAND (Day 2 - 2 hours)**
```tsx
// NOW: Add real authentication logic
'use server'
export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  // Add validation
  if (!email || !password) {
    return { error: 'Missing credentials' }
  }
  
  // Test with Better Auth
  try {
    const { data, error } = await auth.api.signInEmail({
      email,
      password,
      headers: await headers()
    })
    
    if (error) return { error: error.message }
    return { success: true }
  } catch (e) {
    return { error: 'Server error' }
  }
}

// Create minimal test form
export function TestLoginForm() {
  const [state, formAction] = useFormState(loginAction, null)
  
  return (
    <form action={formAction} className="p-4 border">
      <h3>Server Action Test</h3>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      {state?.error && <p className="text-red-500">{state.error}</p>}
      <button type="submit">Test Login</button>
    </form>
  )
}
```

**✅ VALIDATE (Day 2 - 1 hour)**
- Test with valid credentials
- Test with invalid credentials  
- Test network failures
- Check session creation
- **Feedback Loop**: Compare with existing client behavior

**🚀 SCALE (Day 3 - 4 hours)**
```tsx
// FINALLY: Full implementation with feature flag
export default function LoginPage() {
  const showNewForm = searchParams.get('new') === 'true'
  
  if (showNewForm) {
    return <NewServerLoginForm /> // Full server implementation
  }
  
  return <ExistingClientLoginForm /> // Current implementation
}

// Test URLs:
// /auth/login - Existing client form
// /auth/login?new=true - New server form
```

### Safe Validation Loops for Each Component Type

#### 1. Authentication Components
```bash
# Validation Loop (2-hour cycles)
START → Create server action stub
VALIDATE → Test action execution
EXPAND → Add auth logic
VALIDATE → Test auth flow
EXPAND → Add error handling
VALIDATE → Test error cases
SCALE → Full implementation
VALIDATE → A/B test both versions
```

#### 2. Dashboard Components  
```bash
# Validation Loop (1-hour cycles)
START → Remove 'use client' from one component
VALIDATE → Check for hydration errors
EXPAND → Add Suspense boundary
VALIDATE → Test loading states
EXPAND → Add server data fetching
VALIDATE → Check performance
SCALE → Convert all dashboards
```

#### 3. Form Components
```bash
# Validation Loop (3-hour cycles)
START → Create one server action
VALIDATE → Test form submission
EXPAND → Add validation
VALIDATE → Test validation cases
EXPAND → Add optimistic UI
VALIDATE → Test user experience
SCALE → Convert all forms
```

### Rollback Decision Tree

```mermaid
Is it working? 
├─ YES → Continue to next validation
└─ NO → Can it be fixed in 30 min?
    ├─ YES → Fix and revalidate
    └─ NO → Is it critical?
        ├─ YES → Rollback immediately
        └─ NO → Document issue, continue with flag off
```

### Migration Checkpoints

#### ✅ Before Each Migration Phase:
1. **Create feature branch**: `git checkout -b refactor/phase-1-auth`
2. **Add monitoring**: Track errors in both implementations
3. **Set up A/B testing**: Compare performance metrics
4. **Document rollback plan**: Clear steps to revert

#### ✅ After Each Component Migration:
1. **Performance check**: Measure LCP, FID, CLS
2. **Error monitoring**: Check logs for new errors
3. **User testing**: Get feedback from small group
4. **Load testing**: Ensure server can handle actions

#### ✅ Safe Deployment Checklist:
```bash
# Before deployment
- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] Performance benchmarks met
- [ ] Rollback plan documented
- [ ] Feature flags configured
- [ ] Error monitoring active

# Deployment steps
1. Deploy with feature flag OFF
2. Test in production with flag
3. Gradually increase rollout %
4. Monitor metrics closely
5. Full rollout after 48 hours
```

## 📋 Next Implementation Guides

This guide provides the foundation. Additional focused guides will be created:

1. **Authentication Implementation Guide** (`auth-server-actions-guide.md`)
2. **Dashboard Components Migration** (`dashboard-migration-guide.md`) 
3. **Performance & Testing Strategy** (`performance-testing-guide.md`)

Each guide will include:
- Step-by-step implementation
- Code examples and patterns
- Testing strategies
- Performance benchmarks

## 🌊 Hydration & Suspense Optimization Opportunities

### Current Hydration Issues

#### Over-Client-Side Components:
Many components are unnecessarily marked as `'use client'` when they could be server components:

```tsx
// CURRENT: Unnecessary client component
'use client'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'

export function CEODashboard() {
  return (
    <DashboardLayout title="CEO Dashboard">
      <div>Static content here...</div>
    </DashboardLayout>
  )
}
```

#### Components That Can Be Server Components:
- `DashboardLayout.tsx` - Just renders children, no client logic
- `CEODashboard.tsx` - Static metric cards, no interactivity
- `WorkerDashboard.tsx` - Similar static content
- `FrontlinerDashboard.tsx` - Similar static content

### Recommended Suspense Patterns

#### Pattern 1: Server Component with Client Islands
```tsx
// src/app/dashboard/page.tsx - Server Component
import { Suspense } from 'react'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { DashboardMetrics } from '@/components/dashboard/metrics'
import { InteractiveChart } from '@/components/dashboard/interactive-chart'

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  
  return (
    <div>
      {/* Server-rendered static content */}
      <h1>Welcome, {session.user.name}</h1>
      
      {/* Suspense boundary for async data */}
      <Suspense fallback={<MetricsSkeleton />}>
        <DashboardMetrics userId={session.user.id} />
      </Suspense>
      
      {/* Client component island for interactivity */}
      <InteractiveChart userId={session.user.id} />
    </div>
  )
}
```

#### Pattern 2: Progressive Enhancement for Forms
```tsx
// src/components/settings/settings-form.tsx
'use client'
import { useFormStatus } from 'react-dom'
import { updateUserProfile } from '@/lib/actions/settings-actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save Changes'}
    </button>
  )
}

export function SettingsForm({ user }: { user: User }) {
  return (
    <form action={updateUserProfile}>
      <input name="displayName" defaultValue={user.name} />
      <input name="workplace" defaultValue={user.workplace} />
      <SubmitButton />
    </form>
  )
}
```

### Theme Provider Optimization

#### Current Theme Management Issue:
```tsx
// src/components/theme-provider.tsx - Current
"use client"
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useDebouncedTheme() // Client-side theme handling
  return <>{children}</>
}
```

#### Optimized Pattern with suppressHydrationWarning:
```tsx
// src/app/layout.tsx - Optimized
export default function RootLayout({ children }: { children: React.Node }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}

// src/components/theme-provider.tsx - Server/Client boundary
import { ThemeScript } from './theme-script'
import { ClientThemeProvider } from './client-theme-provider'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeScript />
      <ClientThemeProvider>{children}</ClientThemeProvider>
    </>
  )
}
```

### Loading States & Streaming

#### Current Loading Pattern (Client-Side):
```tsx
// Current pattern with client-side loading
const { data: session, isPending } = useSession()

if (isPending) {
  return <Skeleton />
}
```

#### Optimized Pattern (Server-Side with Streaming):
```tsx
// Server component with Suspense streaming
export default async function DashboardPage() {
  return (
    <div>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardData />
      </Suspense>
    </div>
  )
}

async function DashboardData() {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  
  const metrics = await fetchUserMetrics(session.user.id)
  
  return <MetricsDisplay metrics={metrics} />
}
```

## 🚨 Edge Cases & Gotchas

### OAuth Provider Edge Cases

**Risk Files:**
- `src/app/auth/login/page.tsx` - Social login handlers
- `src/lib/auth-client.ts` - OAuth configurations

**Common Issues:**
```tsx
// ❌ WRONG: OAuth in server action
'use server'
export async function githubLogin() {
  // This won't work - OAuth needs browser redirect
  await auth.api.signInSocial({ provider: 'github' })
}

// ✅ CORRECT: Keep OAuth client-side
'use client'
export function SocialLogins() {
  const handleGithubLogin = async () => {
    await authClient.signIn.social({
      provider: 'github',
      callbackURL: '/dashboard'
    })
  }
  
  return <button onClick={handleGithubLogin}>GitHub</button>
}
```

### Zustand Store Migration

**Risk Files:**
- `src/stores/debounced-settings-store.ts`
- Components using `useDebouncedSettingsStore`

**Migration Strategy:**
```tsx
// Phase 1: Keep store for UI state only
export const useUIStore = create((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ 
    sidebarOpen: !state.sidebarOpen 
  }))
}))

// Phase 2: Move data to server
// Replace: const { profile } = useProfileStore()
// With: Server-side data fetching
export async function ProfilePage() {
  const profile = await fetchProfile() // Server-side
  return <ProfileForm profile={profile} />
}
```

### Multi-Tab Session Sync

**Risk:** Session state inconsistency across tabs

**Solution:**
```tsx
// src/components/session-sync.tsx
'use client'
export function SessionSync() {
  useEffect(() => {
    const channel = new BroadcastChannel('auth_sync')
    
    channel.onmessage = (event) => {
      if (event.data.type === 'logout') {
        router.refresh() // Trigger server re-fetch
      }
    }
    
    return () => channel.close()
  }, [])
  
  return null
}
```

### File Upload Handling

**Risk Files:**
- Settings page with avatar upload
- Any form with file inputs

**Server Action Solution:**
```tsx
// src/lib/actions/upload-actions.ts
'use server'
export async function uploadAvatar(formData: FormData) {
  const file = formData.get('avatar') as File
  
  if (!file || file.size === 0) {
    return { error: 'No file selected' }
  }
  
  // Validate file type and size server-side
  if (file.size > 5 * 1024 * 1024) {
    return { error: 'File too large (max 5MB)' }
  }
  
  // Upload to R2/S3
  const url = await uploadToStorage(file)
  
  return { success: true, url }
}
```

## 📊 Performance Monitoring

### Key Metrics to Track

```tsx
// src/lib/monitoring.ts
export function trackMigrationMetrics(component: string) {
  // Before migration
  const beforeMetrics = {
    'login-page': {
      lcp: 2.1, // Largest Contentful Paint
      fid: 85,  // First Input Delay
      cls: 0.12, // Cumulative Layout Shift
      ttfb: 420, // Time to First Byte
      bundleSize: 145 // KB
    }
  }
  
  // Expected after migration
  const targetMetrics = {
    'login-page': {
      lcp: 1.2,  // -43% improvement
      fid: 30,   // -65% improvement
      cls: 0.05, // -58% improvement
      ttfb: 200, // -52% improvement
      bundleSize: 89 // -39% reduction
    }
  }
}
```

### Real User Monitoring

```tsx
// src/app/app/layout.tsx
export default function AppLayout({ children }) {
  return (
    <>
      <Script
        id="rum-tracking"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // Track server action performance
            if (window.performance) {
              const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                  if (entry.name.includes('server-action')) {
                    console.log('Server Action:', {
                      name: entry.name,
                      duration: entry.duration,
                      timestamp: entry.startTime
                    })
                  }
                }
              });
              observer.observe({ entryTypes: ['measure'] });
            }
          `
        }}
      />
      {children}
    </>
  )
}
```

## 🔀 Best Practices for Merging Client & Server Side

### The Hybrid Approach: Best of Both Worlds

Instead of choosing purely client or server, use a hybrid approach that leverages the strengths of each:

#### 1. Server Components + Client Islands Pattern

```tsx
// src/app/dashboard/page.tsx - Server Component (Shell)
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { DashboardMetrics } from './dashboard-metrics'
import { InteractiveChart } from './interactive-chart'
import { RealtimeNotifications } from './realtime-notifications'

export default async function DashboardPage() {
  // Server-side authentication & data fetching
  const session = await auth.api.getSession({
    headers: await headers()
  })
  
  const metrics = await fetchMetrics(session.user.id)
  
  return (
    <div>
      {/* Server-rendered static content */}
      <h1>Welcome, {session.user.name}</h1>
      
      {/* Server component with data */}
      <DashboardMetrics metrics={metrics} />
      
      {/* Client component for interactivity */}
      <InteractiveChart userId={session.user.id} />
      
      {/* Client component for real-time features */}
      <RealtimeNotifications userId={session.user.id} />
    </div>
  )
}
```

#### 2. Progressive Enhancement Pattern

```tsx
// src/components/forms/user-form.tsx
'use client'
import { useFormState } from 'react-dom'
import { updateUserProfile } from '@/lib/actions/user-actions'
import { useOptimistic } from 'react'

export function UserForm({ user }: { user: User }) {
  const [state, formAction] = useFormState(updateUserProfile, null)
  const [optimisticUser, setOptimisticUser] = useOptimistic(user)
  
  return (
    <form 
      action={formAction}
      onSubmit={(e) => {
        // Optimistic update for instant feedback
        const formData = new FormData(e.currentTarget)
        setOptimisticUser({
          ...user,
          name: formData.get('name') as string
        })
      }}
    >
      <input 
        name="name" 
        defaultValue={optimisticUser.name}
      />
      
      {/* Works without JavaScript */}
      <button type="submit">Save</button>
      
      {/* Enhanced experience with JavaScript */}
      <FormStatus />
    </form>
  )
}

function FormStatus() {
  const { pending } = useFormStatus()
  return pending ? <Spinner /> : null
}
```

#### 3. Server Actions + Client Hooks Pattern

```tsx
// src/lib/actions/auth-actions.ts
'use server'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function serverSignIn(email: string, password: string) {
  const { data, error } = await auth.api.signInEmail({
    body: { email, password }
  })
  
  if (error) return { error: error.message }
  
  revalidatePath('/dashboard')
  return { success: true, user: data.user }
}

// src/hooks/use-auth.ts
'use client'
import { useTransition } from 'react'
import { serverSignIn } from '@/lib/actions/auth-actions'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  
  const signIn = async (email: string, password: string) => {
    startTransition(async () => {
      const result = await serverSignIn(email, password)
      
      if (result.success) {
        router.push('/dashboard')
      } else {
        // Handle error client-side
        toast.error(result.error)
      }
    })
  }
  
  return { signIn, isPending }
}
```

### Hybrid Authentication Strategy

#### The Three-Layer Approach:

```tsx
// Layer 1: Server Component (Protection & Initial Data)
// src/app/protected/page.tsx
export default async function ProtectedPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  
  if (!session) redirect('/login')
  
  return <ProtectedContent session={session} />
}

// Layer 2: Client Wrapper (Session Management)
// src/components/auth/session-provider.tsx
'use client'
export function SessionProvider({ 
  children, 
  initialSession 
}: { 
  children: React.ReactNode
  initialSession: Session | null 
}) {
  // Client-side session management for real-time updates
  const { data: session } = useSession({
    initialData: initialSession
  })
  
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  )
}

// Layer 3: Client Components (Interactive Features)
// src/components/user-menu.tsx
'use client'
export function UserMenu() {
  const session = useContext(SessionContext)
  const [isOpen, setIsOpen] = useState(false)
  
  // Client-side interactivity with server-provided data
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger>
        {session?.user.name}
      </DropdownMenuTrigger>
      {/* ... */}
    </DropdownMenu>
  )
}
```

### Data Fetching Merge Strategy

#### Server-First with Client Enhancement:

```tsx
// src/app/products/page.tsx - Server Component
export default async function ProductsPage() {
  // Initial data from server
  const products = await fetchProducts()
  
  return (
    <>
      {/* Server-rendered list for SEO */}
      <ProductList products={products} />
      
      {/* Client component for filtering/sorting */}
      <ProductFilters initialProducts={products} />
    </>
  )
}

// src/components/products/product-filters.tsx
'use client'
import { useState, useTransition } from 'react'
import { filterProducts } from '@/lib/actions/product-actions'

export function ProductFilters({ initialProducts }) {
  const [products, setProducts] = useState(initialProducts)
  const [isPending, startTransition] = useTransition()
  
  const handleFilter = (filters: Filters) => {
    startTransition(async () => {
      // Server action for heavy computation
      const filtered = await filterProducts(filters)
      setProducts(filtered)
    })
  }
  
  return (
    <>
      <FilterUI onFilter={handleFilter} disabled={isPending} />
      <ProductGrid products={products} loading={isPending} />
    </>
  )
}
```

### Form Handling Best Practices

#### Merge Server Validation with Client UX:

```tsx
// src/lib/actions/form-actions.ts
'use server'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2)
})

export async function submitForm(formData: FormData) {
  // Server-side validation
  const result = schema.safeParse({
    email: formData.get('email'),
    name: formData.get('name')
  })
  
  if (!result.success) {
    return { 
      errors: result.error.flatten().fieldErrors 
    }
  }
  
  // Process form...
  return { success: true }
}

// src/components/forms/contact-form.tsx
'use client'
export function ContactForm() {
  const [errors, setErrors] = useState({})
  
  return (
    <form 
      action={async (formData) => {
        // Client-side validation for instant feedback
        const email = formData.get('email') as string
        if (!email.includes('@')) {
          setErrors({ email: 'Invalid email' })
          return
        }
        
        // Server action for processing
        const result = await submitForm(formData)
        if (result.errors) {
          setErrors(result.errors)
        }
      }}
    >
      {/* Form fields with error display */}
    </form>
  )
}
```

### When to Use What

| Feature | Server-Side | Client-Side | Hybrid Approach |
|---------|-------------|-------------|-----------------|
| **Authentication Check** | ✅ Initial validation | ❌ | ✅ Server check + client session |
| **Data Fetching** | ✅ Initial load | ✅ Updates | ✅ Server prefetch + client refresh |
| **Form Submission** | ✅ Processing | ✅ Validation | ✅ Both with progressive enhancement |
| **Navigation** | ✅ Hard navigation | ✅ Soft navigation | ✅ Server-side with client prefetch |
| **Real-time Features** | ❌ | ✅ WebSockets | ✅ Server data + client updates |
| **SEO Content** | ✅ Always | ❌ | ✅ Server render + client enhance |

### Migration Checklist for Hybrid Approach

```typescript
// Before starting migration:
const migrationChecklist = {
  identify: {
    staticContent: [], // Move to server components
    interactiveUI: [], // Keep as client components  
    dataFetching: [], // Move to server, enhance with client
    forms: [], // Server actions + client validation
    realtime: [] // Keep client with server data
  },
  
  plan: {
    phase1: "Move static content to server",
    phase2: "Convert data fetching to server",
    phase3: "Implement server actions for forms",
    phase4: "Add client enhancements",
    phase5: "Optimize with Suspense boundaries"
  },
  
  validate: {
    seo: "Check server-rendered content",
    performance: "Measure Core Web Vitals",
    functionality: "Test with JS disabled",
    ux: "Ensure smooth interactions"
  }
}
```

## 🏛️ Next.js 15 Project Structure Standards & Routing Conventions

Based on the official Next.js 15 documentation and current best practices research, here are the key standards:

### File-System Based Routing

Next.js 15 uses **file-system based routing** where folders define route segments and special files create UI:

#### Routing Files (Official Next.js 15 Conventions):
| File | Extensions | Purpose |
|------|------------|---------|
| `layout` | `.js` `.jsx` `.tsx` | Layout UI shared across routes |
| `page` | `.js` `.jsx` `.tsx` | Unique UI for a route (makes route publicly accessible) |
| `loading` | `.js` `.jsx` `.tsx` | Loading UI and Suspense fallbacks |
| `not-found` | `.js` `.jsx` `.tsx` | Not found UI (404 pages) |
| `error` | `.js` `.jsx` `.tsx` | Error UI and Error boundaries |
| `global-error` | `.js` `.jsx` `.tsx` | Global error UI (must include html/body tags) |
| `route` | `.js` `.ts` | API endpoint |
| `template` | `.js` `.jsx` `.tsx` | Re-rendered layout (for animations) |
| `default` | `.js` `.jsx` `.tsx` | Parallel route fallback page |

### Project Organization Strategies (Official Next.js Recommendations)

Next.js is **unopinionated** about project structure but provides several organization strategies:

#### Strategy 1: Store Files Outside App (Clean Separation)
```
src/
├── app/                   # Pure routing
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── app/
│   │   ├── page.tsx       # Dashboard
│   │   └── settings/page.tsx
│   └── layout.tsx
├── components/            # Reusable UI components
├── lib/                   # Complex logic, API clients
├── utils/                 # Pure helper functions
└── styles/               # Global styles
```

#### Strategy 2: Store Files in App Root (Colocation)
```
src/app/
├── _components/          # Private folder (underscore prefix)
├── _lib/                 # Private utilities
├── auth/
│   ├── login/page.tsx
│   ├── _components/      # Auth-specific components
│   └── signup/page.tsx
├── app/
│   ├── page.tsx
│   └── settings/page.tsx
└── layout.tsx
```

#### Strategy 3: Split by Feature (Domain-Driven)
```
src/app/
├── _components/          # Global shared components
├── _lib/                 # Global utilities
├── auth/
│   ├── login/
│   │   ├── page.tsx
│   │   ├── _components/  # Login-specific components
│   │   └── _utils/       # Login utilities
│   └── signup/page.tsx
└── app/
    ├── page.tsx
    ├── settings/
    │   ├── page.tsx
    │   └── _components/
    └── _shared/          # Dashboard-wide components
```

### Route Groups (Optional Organizational Tool)

Route groups `(folderName)` organize routes **without affecting URLs**:

#### Current Project Route Structure (As Preferred):
```
src/app/
├── auth/              # Keep as-is (NO route groups)
│   ├── login/page.tsx    → /auth/login
│   └── signup/page.tsx   → /auth/signup
├── app/               # Keep as-is (NO route groups)  
│   ├── page.tsx          → /app (dashboard)
│   └── settings/page.tsx → /app/settings
├── (marketing)/       # Route groups acceptable here only
│   ├── about/page.tsx    → /about
│   └── pricing/page.tsx  → /pricing
└── page.tsx           → / (homepage)
```

**Important:** Route groups are **only acceptable for marketing/public routes** directly under `src/app/`. The `auth/` and `app/` directories should remain as-is.

### Private Folders (Underscore Prefix)

Private folders `_folderName` are **not routable** and excluded from routing:

```
src/app/
├── auth/
│   ├── login/page.tsx       # Routable: /auth/login
│   ├── _components/         # Private: Not routable
│   │   └── LoginForm.tsx
│   └── _utils/              # Private: Not routable
│       └── validation.ts
└── _shared/                 # Private: Not routable
    └── constants.ts
```

**Use Cases for Private Folders:**
- Separating UI logic from routing logic
- Organizing internal files and components
- Avoiding naming conflicts with future Next.js conventions

### Colocation Strategy

Next.js allows **safe colocation** of project files within route segments:

```
src/app/
├── auth/
│   ├── login/
│   │   ├── page.tsx         # Creates /auth/login route
│   │   ├── LoginForm.tsx    # Safe to colocate (not routable)
│   │   ├── hooks.ts         # Safe to colocate
│   │   └── styles.module.css # Safe to colocate
│   └── layout.tsx           # Shared auth layout
```

**Key Rule:** Only `page.js` and `route.js` files make routes publicly accessible.

### Component Hierarchy (Official Next.js 15)

Components render in this specific hierarchy:

1. `layout.js` (outermost)
2. `template.js` 
3. `error.js` (React error boundary)
4. `loading.js` (React suspense boundary)
5. `not-found.js` (React error boundary)
6. `page.js` or nested `layout.js` (innermost)

### Next.js 15 New Features & Breaking Changes

Based on official Next.js 15 release notes:

#### Caching Changes (Breaking):
- **GET Route Handlers:** Changed from cached by default → **uncached by default**
- **Client Router Cache:** Changed from cached by default → **uncached by default**

#### New Stable Features:
- **Bundling External Packages:** New config options for App and Pages Router
- **React 19 Support:** Full support with backward compatibility for React 18
- **Enhanced Server Actions:** Better performance and error handling

#### Important Updates:
- `instrumentation.js` and `middleware.js` now use vendored React packages
- New `unstable_rethrow` function for proper Next.js error handling
- Server Action transforms disabled in Pages Router

### Dynamic Routes & Advanced Patterns

#### Dynamic Segments:
```tsx
// app/users/[id]/page.tsx
interface UserPageProps {
  params: Promise<{ id: string }>  // Note: params is now async in Next.js 15
}

export default async function UserPage({ params }: UserPageProps) {
  const { id } = await params  // Must await params
  return <h1>User: {id}</h1>
}
```

#### Catch-All Routes:
```tsx
// app/blog/[...slug]/page.tsx
interface BlogPostProps {
  params: Promise<{ slug?: string[] }>
}

export default async function BlogPost({ params }: BlogPostProps) {
  const { slug } = await params
  return <h1>Blog: {slug?.join('/') || 'home'}</h1>
}
```

#### Search Parameters (Next.js 15):
```tsx
// Server Component
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const filters = (await searchParams).filters  // Must await searchParams
  return <div>Filters: {filters}</div>
}
```

### Parallel Routes & Interception

#### Named Slots (Parallel Routes):
```
src/app/
├── @modal/              # Named slot
│   └── login/page.tsx
├── @sidebar/            # Named slot  
│   └── page.tsx
├── layout.tsx           # Receives both slots as props
└── page.tsx
```

```tsx
// app/layout.tsx
export default function Layout({
  children,
  modal,
  sidebar,
}: {
  children: React.ReactNode
  modal: React.ReactNode
  sidebar: React.ReactNode
}) {
  return (
    <>
      {sidebar}
      {children}
      {modal}
    </>
  )
}
```

#### Route Interception:
```
src/app/
├── feed/
│   └── page.tsx         # /feed
├── photo/
│   └── [id]/page.tsx    # /photo/123
└── @modal/
    └── (.)photo/        # Intercepts /photo/123 when navigating from /feed
        └── [id]/page.tsx
```

### Modern Metadata API

```tsx
// app/blog/[slug]/page.tsx
import { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await fetchPost(slug)

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      images: [post.coverImage],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
    },
  }
}
```

### API Routes & Server Functions

#### Route Handlers (API Routes)
Next.js 15 API routes use the `route.js/ts` file convention:

```tsx
// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params  // Must await params in Next.js 15
  
  try {
    const user = await getUserById(id)
    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    )
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  
  // Server-side validation
  const validatedData = userSchema.parse(body)
  
  const newUser = await createUser(validatedData)
  return NextResponse.json(newUser, { status: 201 })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const updates = await request.json()
  
  const updatedUser = await updateUser(id, updates)
  return NextResponse.json(updatedUser)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  await deleteUser(id)
  return new NextResponse(null, { status: 204 })
}
```

#### API Route Structure
```
src/app/api/
├── auth/
│   └── [...all]/
│       └── route.ts         # ⚠️ BETTER AUTH AUTO-GENERATED - DO NOT MODIFY
├── users/
│   ├── route.ts             # GET /api/users, POST /api/users
│   └── [id]/
│       └── route.ts         # GET /api/users/[id], PATCH, DELETE
├── dashboard/
│   └── metrics/route.ts     # GET /api/dashboard/metrics
└── health/route.ts          # GET /api/health
```

**⚠️ IMPORTANT: Better Auth API Routes**

Better Auth automatically generates all authentication API endpoints at `src/app/api/auth/[...all]/route.ts`:

- `POST /api/auth/sign-in/email`
- `POST /api/auth/sign-up/email`  
- `POST /api/auth/sign-out`
- `GET /api/auth/get-session`
- `POST /api/auth/sign-in/github` (OAuth)
- `POST /api/auth/sign-in/google` (OAuth)
- And all other auth endpoints...

**DO NOT create manual auth API routes** - Better Auth handles all authentication endpoints automatically.

#### How to Interact with Better Auth Endpoints

**✅ CORRECT - Use Better Auth client library:**
```tsx
// Client-side
import { authClient } from '@/lib/auth-client'

const session = await authClient.getSession()
const { data, error } = await authClient.signIn.email({ email, password })
```

**✅ CORRECT - Use Better Auth server API:**
```tsx
// Server-side
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

const session = await auth.api.getSession({
  headers: await headers()
})
```

**❌ INCORRECT - Never create manual API routes:**
```tsx
// DON'T DO THIS - Better Auth handles this automatically
// app/api/auth/login/route.ts
export async function POST() { /* ... */ }
```

**❌ INCORRECT - Never call auth endpoints directly:**
```tsx
// DON'T DO THIS - Use auth client/server API instead
fetch('/api/auth/get-session')
```

#### Server Actions vs API Routes

**Use Server Actions when:**
- Form submissions and mutations
- Direct database operations
- Internal application logic
- Progressive enhancement needed

**Use API Routes when:**
- External API consumption
- Webhooks and third-party integrations
- Complex request/response handling
- Public APIs for other clients

#### API Route Best Practices

```tsx
// app/api/dashboard/metrics/route.ts
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Authentication check
    const session = await auth.api.getSession({
      headers: await headers()
    })
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Role-based access control
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }
    
    // Fetch data
    const metrics = await getDashboardMetrics(session.user.id)
    
    // Set cache headers (Next.js 15: uncached by default)
    return NextResponse.json(metrics, {
      headers: {
        'Cache-Control': 'private, max-age=300', // 5 minutes
      },
    })
    
  } catch (error) {
    console.error('Metrics API Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
```

#### API Route Middleware Pattern

```tsx
// lib/api-middleware.ts
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export function withAuth(handler: Function) {
  return async (request: NextRequest, context: any) => {
    const session = await auth.api.getSession({
      headers: await headers()
    })
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Add session to context
    return handler(request, { ...context, session })
  }
}

export function withValidation(schema: any) {
  return function(handler: Function) {
    return async (request: NextRequest, context: any) => {
      try {
        const body = await request.json()
        const validatedData = schema.parse(body)
        
        return handler(request, { ...context, body: validatedData })
      } catch (error) {
        return NextResponse.json(
          { error: 'Validation failed', details: error.errors },
          { status: 400 }
        )
      }
    }
  }
}

// Usage
// app/api/users/route.ts
import { withAuth, withValidation } from '@/lib/api-middleware'
import { userSchema } from '@/lib/schemas'

export const POST = withAuth(
  withValidation(userSchema)(
    async (request: NextRequest, { session, body }) => {
      const user = await createUser(body, session.user.id)
      return NextResponse.json(user, { status: 201 })
    }
  )
)
```

### Error Handling Architecture
```tsx
'use client'
 
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    // Must include html and body tags
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2>Something went wrong!</h2>
            <p>{error.message}</p>
            <button onClick={() => reset()}>Try again</button>
          </div>
        </div>
      </body>
    </html>
  )
}
```

#### Route-Level Error Boundary (`app/(dashboard)/error.tsx`):
```tsx
'use client'
import { useEffect } from 'react'
 
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log to error reporting service
    console.error(error)
  }, [error])
 
  return (
    <div className="rounded-lg border bg-destructive/10 p-4">
      <h2 className="text-lg font-semibold">Dashboard Error</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {error.message || 'An unexpected error occurred'}
      </p>
      <button
        onClick={reset}
        className="mt-4 rounded bg-primary px-4 py-2 text-sm"
      >
        Retry
      </button>
    </div>
  )
}
```

#### Server Action Error Handling:
```tsx
'use server'
import { unstable_rethrow } from 'next/navigation'

export async function updateProfile(formData: FormData) {
  try {
    const result = await updateDatabase(formData)
    return { success: true, data: result }
  } catch (error) {
    // Let Next.js handle navigation errors (redirect, notFound)
    unstable_rethrow(error)
    
    // Handle other errors
    if (error instanceof ValidationError) {
      return { error: error.message, fields: error.fields }
    }
    
    // Generic error
    return { error: 'Failed to update profile' }
  }
}
```

### Not Found Pages

#### Route-Level Not Found (`app/(dashboard)/not-found.tsx`):
```tsx
import Link from 'next/link'
 
export default function DashboardNotFound() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center">
      <h2 className="text-2xl font-semibold">Page Not Found</h2>
      <p className="mt-2 text-muted-foreground">
        The dashboard page you're looking for doesn't exist.
      </p>
      <Link
        href="/dashboard"
        className="mt-4 text-primary hover:underline"
      >
        Return to Dashboard
      </Link>
    </div>
  )
}
```

### Loading UI Patterns

#### Route Loading (`app/(dashboard)/loading.tsx`):
```tsx
export default function DashboardLoading() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-48 animate-pulse rounded bg-muted" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    </div>
  )
}
```

### Metadata & SEO

#### Dynamic Metadata:
```tsx
// app/(marketing)/products/[id]/page.tsx
import { Metadata } from 'next'
 
export async function generateMetadata({ 
  params 
}: { 
  params: { id: string } 
}): Promise<Metadata> {
  const product = await fetchProduct(params.id)
 
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      images: [product.image],
    },
  }
}
```

### Performance Optimizations

#### Parallel Data Fetching:
```tsx
// app/dashboard/page.tsx
export default async function DashboardPage() {
  // Parallel fetching for better performance
  const [user, metrics, notifications] = await Promise.all([
    fetchUser(),
    fetchMetrics(),
    fetchNotifications(),
  ])
  
  return (
    <DashboardLayout>
      <UserInfo user={user} />
      <Metrics data={metrics} />
      <Notifications items={notifications} />
    </DashboardLayout>
  )
}
```

#### Streaming with Suspense:
```tsx
// app/dashboard/page.tsx
import { Suspense } from 'react'

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<MetricsSkeleton />}>
        <Metrics />
      </Suspense>
      
      <Suspense fallback={<ChartSkeleton />}>
        <Charts />
      </Suspense>
    </DashboardLayout>
  )
}
```

## 🔄 Next Steps

This document will be updated iteratively as implementation progresses. Each phase will include:
1. Specific code examples
2. Performance benchmarks
3. Testing strategies
4. Migration checkpoints

---

> **Note:** This guide follows the incremental refactoring approach - Start Small → Validate → Expand → Scale

> **Remember:** Every change should be validated in small loops before expanding scope!