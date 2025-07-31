# Route Groups Structure

> Documentation of the Next.js 15 App Router route groups implementation for SenseiiWyze Dashboard
> 
> **Last Updated:** 2025-07-31
> **Status:** Implemented ✅

## Overview

The application uses Next.js 15 App Router with route groups to create distinct layouts and behavior patterns for different sections of the application.

## Directory Structure

```
src/app/
├── (marketing)/           # Public marketing pages
│   ├── layout.tsx        # Simple passthrough layout
│   ├── page.tsx          # Homepage with Hero229 component
│   └── test.tsx          # Test page
│
├── (app)/                # Protected dashboard pages  
│   ├── layout.tsx        # GlobalNavigation sidebar + auth protection
│   ├── assessment/       # Readiness Index assessments
│   │   └── page.tsx
│   ├── backups/          # Data backups
│   │   └── page.tsx
│   ├── coaching/         # AI coaching interface
│   │   └── page.tsx
│   ├── dashboard/        # Main dashboard hub
│   │   ├── page.tsx
│   │   ├── analytics/
│   │   │   └── page.tsx
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   └── users/
│   │       └── page.tsx
│   ├── graphs/           # Data visualization
│   │   └── page.tsx
│   ├── help/             # Help & support
│   │   └── page.tsx
│   ├── learning/         # Learning modules & paths
│   │   └── page.tsx
│   ├── notifications/    # Notification center
│   │   └── page.tsx
│   ├── overview/         # System overview
│   │   └── page.tsx
│   ├── settings/         # Global settings
│   │   └── page.tsx
│   └── team/             # Team management
│       └── page.tsx
│
├── auth/                 # Authentication pages (no route group)
│   ├── layout.tsx        # Minimal auth layout
│   ├── login/
│   │   └── page.tsx
│   ├── reset-password/
│   │   └── page.tsx
│   └── signup/
│       └── page.tsx
│
├── api/                  # API routes
│   ├── auth/
│   │   └── [...all]/     # Better Auth (hands-off)
│   │       └── route.ts
│   ├── dashboard/        # Dashboard APIs
│   │   ├── ceo/
│   │   │   └── route.ts
│   │   ├── frontliner/
│   │   │   └── route.ts
│   │   ├── performance/
│   │   │   └── route.ts
│   │   └── worker/
│   │       └── route.ts
│   ├── debug/
│   │   └── send-test-email/
│   │       └── route.ts
│   ├── sentry-example-api/
│   │   └── route.ts
│   └── settings/
│       └── route.ts
│
├── favicon.ico
├── global-error.tsx
├── globals.css
├── layout.tsx            # Root layout
├── sentry-example-page/
│   └── page.tsx
└── simple-test/
    └── page.tsx
```

## Route Group Purposes

### (marketing) - Public Pages
- **Purpose**: Marketing and landing pages accessible to all visitors
- **Layout**: Simple passthrough layout with no sidebar
- **Authentication**: Not required
- **URLs**: `/`, `/test`

**Features:**
- Hero section with call-to-action
- Navbar with Login/Signup or Dashboard button (based on auth state)
- Clean, marketing-focused design

### (app) - Protected Dashboard
- **Purpose**: Main application functionality for authenticated users
- **Layout**: GlobalNavigation sidebar with auth protection
- **Authentication**: Required (redirects to `/auth/login` if not authenticated)
- **URLs**: `/dashboard`, `/team`, `/learning`, `/coaching`, etc.

**Features:**
- Persistent sidebar navigation
- Auth protection at layout level
- Role-agnostic access (unified dashboard for all users)
- Real-time session management

### auth/ - Authentication Flow
- **Purpose**: User authentication and account management
- **Layout**: Minimal layout for focused auth experience
- **Authentication**: Redirects to `/dashboard` if already authenticated
- **URLs**: `/auth/login`, `/auth/signup`, `/auth/reset-password`

**Features:**
- Better Auth integration
- Email/password and social login (GitHub, Google, Discord)
- Form validation and error handling
- Responsive design

## URL Structure

### Clean URLs (No Role-Based Routing)
```
Marketing:
  /                    # Homepage with hero
  /test               # Test page

Protected App:
  /dashboard          # Main dashboard (unified for all users)
  /team              # Team management
  /learning          # Learning modules
  /coaching          # AI coaching
  /assessment        # Readiness assessments
  /analytics         # Analytics & reports
  /notifications     # Notifications
  /help              # Help & support

Authentication:
  /auth/login        # Login page
  /auth/signup       # Registration page
  /auth/reset-password # Password reset

API:
  /api/auth/*        # Better Auth endpoints (auto-generated)
  /api/dashboard/*   # Dashboard APIs
```

## Layout Behavior

### Marketing Layout (`(marketing)/layout.tsx`)
```tsx
export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <>
      {children}
    </>
  )
}
```
- Simple passthrough
- No authentication checks
- No persistent navigation

### App Layout (`(app)/layout.tsx`)
```tsx
export default function AppLayout({ children }: AppLayoutProps) {
  const { data: session, isPending } = useSession()

  if (isPending) {
    return <LoadingSpinner />
  }

  if (!session?.user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <GlobalNavigation user={user} variant="sidebar" />
      <main className="ml-64 p-6">
        {children}
      </main>
    </div>
  )
}
```
- Auth protection at layout level
- GlobalNavigation sidebar
- Session management with Better Auth

### Auth Layout (`auth/layout.tsx`)
```tsx
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}
```
- Minimal styling
- No sidebar or persistent navigation
- Focused auth experience

## Authentication Flow

### User States & Navigation

**Not Authenticated:**
1. Lands on `/` (homepage)
2. Sees Login/Signup buttons in navbar
3. Clicks "Get Started" → `/auth/login`
4. After successful login → `/dashboard`

**Authenticated:**
1. Lands on `/` (homepage)
2. Sees "Dashboard" button in navbar
3. Can access any `/dashboard/*` route
4. Protected routes auto-redirect unauthenticated users to `/auth/login`

### Session Management
- **Client-side**: Using Better Auth `useSession()` hook
- **Real-time**: Auth state updates immediately in all components
- **Persistent**: Session maintained across page refreshes
- **Secure**: JWT-based with secure cookies

## Technical Implementation

### Route Group Syntax
- `(marketing)` and `(app)` are route groups (parentheses make them non-URL segments)
- `auth/` is a regular route (becomes part of URL)
- Each route group can have its own `layout.tsx`

### Auth Protection Strategy
- **Layout-level**: Auth checks in `(app)/layout.tsx` protect entire section
- **Component-level**: Individual components use `useSession()` for UI state
- **API-level**: API routes handle their own auth validation

### Benefits of This Architecture
1. **Separation of Concerns**: Marketing vs. App vs. Auth have distinct layouts
2. **Clean URLs**: No nested dashboard paths or role-based routing
3. **Maintainable**: Each section has focused responsibility
4. **Scalable**: Easy to add new pages to appropriate sections
5. **Performance**: Layout-level auth checks avoid repeated validation

## Migration Notes

This structure replaced the previous nested routing approach:
- **Before**: `/dashboard/team-management`, `/dashboard/learning-paths`
- **After**: `/team`, `/learning`

The simplified structure improves:
- URL aesthetics and shareability
- Navigation performance
- Code organization
- User experience consistency

## Development Guidelines

### Adding New Pages

**Marketing Page:**
```bash
# Create in (marketing)/
src/app/(marketing)/new-page/page.tsx
# URL: /new-page
```

**Protected App Page:**
```bash
# Create in (app)/
src/app/(app)/new-feature/page.tsx
# URL: /new-feature (requires auth)
```

**Auth Page:**
```bash
# Create in auth/
src/app/auth/new-auth-flow/page.tsx
# URL: /auth/new-auth-flow
```

### Layout Inheritance
- Pages inherit their route group's layout automatically
- Each layout can access and modify the auth context
- Nested layouts stack (root → route group → page)

This route groups structure provides a clean, maintainable foundation for the SenseiiWyze Dashboard application.

---

## Next Steps Plan

> **Current Status:** Route groups implemented ✅ | Auth flow fixed ✅ | Client-side ready ✅

### Phase 1: Authentication & Navigation Complete ✅
- [x] Implement route groups structure
- [x] Fix client-side auth flow (useSession hooks)
- [x] Update navbar auth state detection
- [x] Test homepage navigation
- [x] Document route groups architecture

### Phase 2: Core Functionality (Next - This Week)
**Priority: High**

#### 2.1 Test & Validate Auth Flow
- [ ] **Test complete auth flow end-to-end**
  - [ ] Homepage → Login → Dashboard
  - [ ] Logout flow and state updates
  - [ ] Social login (GitHub, Google, Discord)
  - [ ] Session persistence across refreshes

#### 2.2 Page Content & Navigation Polish
- [ ] **Implement billing functionality** ("mucho mucho billing")
  - [ ] Billing page structure
  - [ ] Subscription management
  - [ ] Usage tracking integration
- [ ] **Polish navigation UI/UX** (currently "doesn't look good")
  - [ ] GlobalNavigation component styling
  - [ ] Responsive navigation behavior
  - [ ] Active state indicators
  - [ ] Mobile navigation experience

#### 2.3 Page Shell Completion
- [ ] **Expand page functionality after shell structure**
  - [ ] Dashboard page content (remove placeholder)
  - [ ] Team management features
  - [ ] Learning modules interface
  - [ ] Assessment flow implementation
  - [ ] Analytics dashboard content

### Phase 3: Feature Development (Week 2)
**Priority: Medium**

#### 3.1 Readiness Index MVP
- [ ] Assessment questionnaire system
- [ ] Readiness Index calculation engine
- [ ] Score visualization and insights
- [ ] Learning path generator based on scores

#### 3.2 AI Coaching Interface
- [ ] Basic AI coaching chat interface
- [ ] Integration with OpenAI API
- [ ] Coaching recommendations system
- [ ] Progress tracking

#### 3.3 Advanced Dashboard Features
- [ ] Real-time notifications system
- [ ] Team analytics and insights
- [ ] Progress tracking visualization
- [ ] Export functionality

### Phase 4: Production Readiness (Week 3-4)
**Priority: Medium-Low**

#### 4.1 Performance & Optimization
- [ ] Server-side auth migration (move away from client-side)
- [ ] SSR implementation for better performance
- [ ] Bundle optimization
- [ ] Caching strategies

#### 4.2 Enterprise Features
- [ ] Advanced user management
- [ ] Organization settings
- [ ] API rate limiting
- [ ] Audit logging

#### 4.3 Testing & Quality
- [ ] E2E test coverage
- [ ] Performance testing
- [ ] Security audit
- [ ] Cross-browser compatibility

### Phase 5: Market Launch (Month 2)
**Priority: Future**

#### 5.1 MVP Launch Features
- [ ] First paying pilot customer integration
- [ ] Success metrics tracking
- [ ] Customer feedback system
- [ ] Support documentation

#### 5.2 Scale Preparation
- [ ] Database migration to PostgreSQL
- [ ] Infrastructure scaling plan
- [ ] Monitoring and alerting
- [ ] Backup and recovery systems

---

## Current Focus Areas

### Immediate (This Session)
1. ✅ **Route groups documentation** - Complete
2. 🔄 **Test auth flow** - Ready for testing after dev server restart
3. 📋 **Plan billing implementation** - Documentation ready

### Short Term (This Week)
1. **Billing system** - User explicitly requested "mucho mucho billing"
2. **Navigation polish** - User noted "doesn't look good right now"
3. **Page functionality** - Expand from shell structure to real features

### Medium Term (Next 2 Weeks)
1. **Readiness Index** - Core differentiator feature
2. **AI Coaching** - Platform value proposition
3. **Server-side migration** - Performance and security

### Long Term (Month+)
1. **Enterprise features** - B2B2C market requirements
2. **Production scaling** - Handle real user load
3. **Market launch** - First paying customers

---

## Development Principles

Based on user guidance:
- ✅ **Client-side first** - Stay client-side for now, server-side later
- ✅ **Incremental approach** - Start small → validate → expand → scale
- ✅ **Clean URLs** - No role-based routing, unified dashboard
- ✅ **Working deliverables** - Focus on functional features over perfect code
- ✅ **User feedback driven** - Iterate based on explicit user direction