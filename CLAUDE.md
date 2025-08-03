# CLAUDE.md

Guidance for Claude Code working with this repository.

## Memory Bank

Refer to `.claude/memory-bank/activeContext.md` for current session state and immediate focus.

Key files:
- `activeContext.md` - Current state (update after each session)
- `projectbrief.md` - What & Why
- `systemPatterns.md` - Architecture patterns
- `progress.md` - Status tracking

## Package Manager

**⚠️ IMPORTANT: This project REQUIRES pnpm as the package manager.**

- **Required**: pnpm >= 9.0.0
- **Node.js**: >= 18.0.0
- **Lock file**: pnpm-lock.yaml (DO NOT use package-lock.json or yarn.lock)

## Commands

### Development
```bash
pnpm dev          # Start development server at localhost:3000
pnpm build        # Build for production
pnpm deploy       # Deploy to Cloudflare Workers
pnpm lint         # Run ESLint checks
```

### Package Management
```bash
pnpm install      # Install dependencies
pnpm add <pkg>    # Add a dependency
pnpm remove <pkg> # Remove a dependency
pnpm update       # Update dependencies
pnpm audit        # Security audit
```

### Testing
```bash
pnpm test             # Run all tests
pnpm test:watch       # Watch mode for TDD
pnpm test -- <pattern> # Run specific tests
```

### Docker Development
```bash
# Docker Compose with file watching (recommended)
just compose-watch-dev  # Uses Docker Compose's built-in watch feature

# Traditional Docker development commands
just dev-docker         # Development with HMR + watchers enabled
just dev-docker-detached # Start in detached mode
just dev-docker-stop    # Stop all Docker services
```

**Docker Compose Watch Integration:**
- Uses [Docker Compose watch](https://docs.docker.com/compose/file-watch/) for efficient file synchronization
- Automatically syncs `src/`, `pages/`, and `components/` directories
- Rebuilds container on configuration changes (`package.json`, `next.config.ts`, etc.)
- **Requirements**: Docker Compose v2.22+ with `develop.watch` support
- **External dependency**: Requires Docker Desktop or Docker Engine with Compose V2

## ⚠️ HANDS-OFF DIRECTORIES

**DO NOT MODIFY THESE DIRECTORIES - THEY ARE MANAGED BY EXTERNAL SYSTEMS:**

- `src/app/api/auth/[...all]/` - Better Auth auto-generated API routes
- Any files with `// @generated` comments
- `.next/` build directory

### Better Auth API Routes

**⚠️ CRITICAL: DO NOT create manual authentication API routes.**

Better Auth automatically handles ALL authentication endpoints through `src/app/api/auth/[...all]/route.ts`:
- Sign in/up, OAuth, session management, password reset, etc.
- Includes `/api/auth/get-session` for session retrieval
- **Only use Server Actions for auth operations in forms**
- **Never create `src/app/api/auth/login/route.ts` or similar manual auth endpoints**

#### How to Use Better Auth (REQUIRED PATTERNS):

**✅ Server-side:** Use `auth.api.getSession({ headers: await headers() })`
**✅ Client-side:** Use `authClient.getSession()` from `@/lib/auth-client`
**✅ Server Actions:** Use Better Auth server API for form submissions
**❌ Never:** Call `/api/auth/*` endpoints directly with `fetch()`
**❌ Never:** Create manual auth API routes that conflict with Better Auth

## Architecture Overview

This is a Next.js 15 application using the App Router pattern with TypeScript and shadcn/ui components.

### Core Technologies
- **Framework**: Next.js 15 with App Router
- **UI Library**: shadcn/ui (Radix UI primitives + Tailwind CSS)
- **State Management**: Zustand with localStorage persistence
- **Validation**: Zod schemas with custom utilities
- **Styling**: Tailwind CSS with neutral theme (easily customizable)

### Key Architecture

- **Components**: `'use client'` directive, shadcn/ui primitives with CVA
- **State**: Zustand for global state, custom hooks for forms
- **Auth**: Better Auth with email/social providers
- **Validation**: Zod schemas (password: 8+ chars, mixed case, number, special)
- **Testing**: TDD with Jest + React Testing Library

### shadcn/ui Integration & Theming

This project uses shadcn/ui components with semantic color system for easy theme switching.

#### Required Color Convention
**ALWAYS use shadcn/ui semantic color utilities instead of hardcoded colors:**

✅ **DO use these semantic utilities:**
- `bg-background` / `text-foreground` (main background and text)
- `bg-card` / `text-card-foreground` (card backgrounds)
- `bg-primary` / `text-primary-foreground` (primary actions)
- `bg-secondary` / `text-secondary-foreground` (secondary elements)
- `bg-muted` / `text-muted-foreground` (muted/disabled states)
- `bg-accent` / `text-accent-foreground` (accents/highlights)
- `bg-destructive` / `text-destructive-foreground` (errors/warnings)
- `border` / `ring` (borders and focus rings)
- `bg-popover` / `text-popover-foreground` (popovers/dropdowns)

❌ **NEVER use hardcoded colors like:**
- `bg-gray-100`, `text-gray-900`
- `bg-slate-50`, `text-zinc-700`
- `bg-neutral-200`, `text-stone-800`
- Any specific color values

#### Component Setup
- **Components Location**: `src/components/ui/`
- **Utility Function**: `cn()` in `lib/utils.ts` for class merging
- **Theme Variables**: Defined in CSS custom properties (HSL format)



### Project Structure Patterns

```
src/
├── app/           # Next.js routes (pages use default export)
├── components/    # React components (use named exports)
│   └── ui/       # shadcn/ui components
├── hooks/        # Custom React hooks
├── services/     # API service layer (class-based)
├── utils/        # Utility functions and schemas
└── lib/          # Core libraries (store, utils)
```

### Import Convention
Always use the `@/` alias for imports from the src directory:
```typescript
import { Button } from '@/components/ui/button'
import { useLoginForm } from '@/hooks/useLoginForm'
```





## Agent OS Documentation

### Product Context
- **Mission & Vision:** @.agent-os/product/mission.md
- **Technical Architecture:** @.agent-os/product/tech-stack.md
- **Development Roadmap:** @.agent-os/product/roadmap.md
- **Decision History:** @.agent-os/product/decisions.md

### Development Standards
- **Code Style:** @~/.agent-os/standards/code-style.md
- **Best Practices:** @~/.agent-os/standards/best-practices.md

### Project Management
- **Active Specs:** @.agent-os/specs/
- **Spec Planning:** Use `@~/.agent-os/instructions/create-spec.md`
- **Tasks Execution:** Use `@~/.agent-os/instructions/execute-tasks.md`

## Workflow Instructions

When asked to work on this codebase:

1. **First**, check @.agent-os/product/roadmap.md for current priorities
2. **Then**, follow the appropriate instruction file:
   - For new features: @.agent-os/instructions/create-spec.md
   - For tasks execution: @.agent-os/instructions/execute-tasks.md
3. **Always**, adhere to the standards in the files listed above

## Problem-Solving Approach

**⚠️ CRITICAL: When approaching any complex problem, testing, or implementation task, ALWAYS follow the incremental approach:**

### Start Small → Validate → Expand → Scale

1. **Start Small (5-10 min):** Begin with the most basic validation (e.g., `pnpm build`)
2. **Validate (5-10 min):** Confirm the small step works (e.g., test one page in one locale)  
3. **Expand (10-15 min):** Gradually increase scope (e.g., test all locales for that page)
4. **Scale (15+ min):** Full implementation only after confirming the pattern works

**See:** `cursor-rules/07-incremental-testing-approach.md` for detailed guidelines.

**Why:** Complexity is the enemy of reliability. This approach catches issues early, provides measurable progress, and ensures working deliverables.

## Development Workflow Guidelines

### Background Process Restrictions

**⚠️ IMPORTANT: Claude cannot run background processes yet.**

- **DO NOT run `pnpm dev`** - Claude cannot monitor background processes or get their status
- **Avoid long-running processes** - This prevents ghost processes and getting stuck
- **Use iterative development** - User will provide state information and feedback
- **Test incrementally** - Build, test specific functionality, then iterate

### Browser Testing with MCP Tools

**Use `browser-tools-mcp` for real-time validation:**
- Take screenshots to verify UI changes
- Check console logs for errors
- Test user interactions and navigation
- Validate responsive design
- Debug runtime issues

**Example Browser Testing Workflow:**
```typescript
// 1. Take screenshot to see current state
await mcp__browser-tools-mcp__takeScreenshot();

// 2. Check for console errors
await mcp__browser-tools-mcp__getConsoleErrors();

// 3. Navigate and test functionality
await mcp__chrome-mcp-server__chrome_navigate({ url: "http://localhost:3000/dashboard" });
await mcp__chrome-mcp-server__chrome_screenshot({ filename: "dashboard-test.png" });
```

### Development Cycle
1. **Make changes** to code
2. **Run build** to check for errors (`pnpm build`)
3. **User starts dev server** and provides feedback
4. **Use browser MCP tools** to validate changes
5. **Iterate** based on feedback and browser testing

## Available MCP Tools

This project has access to powerful MCP (Model Context Protocol) servers that provide additional capabilities for testing, automation, and development workflows.

### Chrome MCP Server Tools

**Purpose:** Browser automation, testing, and web interaction for quality assurance and debugging.

**When to use:** For testing routing behavior, form interactions, visual validation, network debugging, and end-to-end testing workflows.

| Tool Name | Description | Use Case |
|-----------|-------------|----------|
| `mcp__chrome-mcp-server__get_windows_and_tabs` | Get list of all open browser windows and their tabs | Session management, tab organization |
| `mcp__chrome-mcp-server__chrome_navigate` | Navigate to a specific URL | Testing routes, page navigation |
| `mcp__chrome-mcp-server__chrome_screenshot` | Take a screenshot of the current page or specific element | Visual regression testing, documentation |
| `mcp__chrome-mcp-server__chrome_close_tabs` | Close specific browser tabs | Cleanup, resource management |
| `mcp__chrome-mcp-server__chrome_go_back_or_forward` | Navigate back or forward in browser history | History navigation testing |
| `mcp__chrome-mcp-server__chrome_get_web_content` | Get the text content of the current page | Content validation, scraping |
| `mcp__chrome-mcp-server__chrome_click_element` | Click on a specific element on the page | UI interaction testing |
| `mcp__chrome-mcp-server__chrome_fill_or_select` | Fill form fields or select options | Form testing, user flow automation |
| `mcp__chrome-mcp-server__chrome_get_interactive_elements` | Get list of interactive elements on the page | UI discovery, accessibility testing |
| `mcp__chrome-mcp-server__chrome_network_request` | Make network requests through the browser | API testing, network simulation |
| `mcp__chrome-mcp-server__chrome_network_debugger_start` | Start network debugging/monitoring | Performance analysis, API debugging |
| `mcp__chrome-mcp-server__chrome_network_debugger_stop` | Stop network debugging/monitoring | End debugging session |
| `mcp__chrome-mcp-server__chrome_network_capture_start` | Start capturing network traffic | Traffic analysis, security testing |
| `mcp__chrome-mcp-server__chrome_network_capture_stop` | Stop capturing network traffic | End traffic capture |
| `mcp__chrome-mcp-server__chrome_keyboard` | Send keyboard input to the browser | Keyboard shortcut testing, input simulation |
| `mcp__chrome-mcp-server__chrome_history` | Access browser history | Navigation testing, history validation |
| `mcp__chrome-mcp-server__chrome_bookmark_search` | Search browser bookmarks | Bookmark management, user preference testing |
| `mcp__chrome-mcp-server__chrome_bookmark_add` | Add new bookmarks | User workflow testing |
| `mcp__chrome-mcp-server__chrome_bookmark_delete` | Delete bookmarks | Cleanup, user preference testing |
| `mcp__chrome-mcp-server__search_tabs_content` | Search content across open tabs | Content discovery, multi-tab testing |
| `mcp__chrome-mcp-server__chrome_inject_script` | Inject JavaScript into the current page | Custom testing scripts, debugging |
| `mcp__chrome-mcp-server__chrome_send_command_to_inject_script` | Send commands to injected scripts | Advanced automation, custom workflows |
| `mcp__chrome-mcp-server__chrome_console` | Access browser console messages | Debugging, error monitoring |

**Example Chrome MCP Usage:**
```typescript
// Test internationalized routing
await mcp__chrome-mcp-server__chrome_navigate({ url: "http://localhost:3000" });
await mcp__chrome-mcp-server__chrome_screenshot({ filename: "homepage-test.png" });
await mcp__chrome-mcp-server__chrome_click_element({ 
  element: "Get Started button", 
  ref: "button-selector" 
});
```

### Other Available MCP Servers

- **GitHub MCP**: Repository management, issue tracking, pull requests
- **Supabase MCP**: Database operations, authentication, real-time features  
- **Tavily MCP**: Web search and content extraction
- **Context7 MCP**: Library documentation and code examples
- **OpenMemory MCP**: Persistent memory and context management
- **Firecrawl MCP**: Advanced web scraping and content analysis

**Integration Tip:** Use Chrome MCP tools as part of your incremental testing approach - test one page/route first, then expand to full application testing.

## Better Auth Schema Management

This project uses a re-export schema architecture to prevent conflicts when Better Auth regenerates schema files.

### Schema File Structure

- **`auth-schema.ts`** - Auto-generated by Better Auth (no prefixes)
- **`lib/db/schema.auth.ts`** - Our controlled version with `ba_` prefixes  
- **`lib/db/schema.ts`** - Master schema re-exporting both auth and app schemas
- **`drizzle/schema.ts`** - Application-specific tables (profiles, notifications, etc.)

### Merging Better Auth Updates

When Better Auth regenerates `auth-schema.ts`, use the merge prompt:

1. **Read the prompt**: `docs/better-auth-schema-merge-prompt.md`
2. **Apply transformations**: Add `ba_` prefixes to table names
3. **Update references**: Ensure foreign keys point to prefixed tables
4. **Test changes**: Run `pnpm build` to verify

### Table Prefix Rules

All Better Auth tables use `ba_` prefix to avoid conflicts:
- `user` → `ba_users`
- `session` → `ba_sessions`  
- `account` → `ba_accounts`
- `verification` → `ba_verifications`
- etc.

### Import Pattern

Always import from the master schema:
```typescript
import { db } from '@/lib/db'
import { users, profiles } from '@/lib/db/schema'
```

## Route Structure Preferences

**⚠️ IMPORTANT: DO NOT use private route groups for auth and app routes.**

The current route structure should be preserved as-is:
- `src/app/auth/` - Authentication routes (login, signup, etc.) - KEEP AS IS
- `src/app/app/` - Application routes (dashboard, settings, etc.) - KEEP AS IS
- `src/app/` - Marketing/public routes - Route groups are acceptable here only

**DO NOT** refactor `auth/` or `app/` into route groups like `(auth)` or `(dashboard)`. 
**Route groups are only acceptable for marketing/public routes directly under `src/app/`.**

## Better Auth Integration Rules

**⚠️ CRITICAL: Follow these rules to prevent integration issues and ensure proper Better Auth functionality.**

### Session Handling Rules

1. **Server-Side Session Access**
   ```typescript
   // ✅ ALWAYS use auth.api.getSession with headers in server environments
   import { auth } from '@/lib/auth'
   import { headers } from 'next/headers'
   
   const session = await auth.api.getSession({
     headers: await headers() // REQUIRED in Next.js 15
   })
   ```

2. **Client-Side Session Access**
   ```typescript
   // ✅ Use authClient for client-side session management
   import { authClient } from '@/lib/auth-client'
   
   const { data: session } = authClient.useSession()
   // OR for one-time access:
   const session = await authClient.getSession()
   ```

3. **Session Validation vs Cookie Check**
   ```typescript
   // ❌ NEVER use just cookie existence for security decisions
   const cookieExists = request.cookies.get('better-auth.session_token')
   
   // ✅ ALWAYS validate full session for security-critical operations
   const session = await auth.api.getSession({ headers })
   if (!session?.user) {
     return redirect('/auth/login')
   }
   ```

### Middleware Security Rules

4. **Middleware Limitations**
   ```typescript
   // ⚠️ Middleware has limited session validation capabilities
   // Use for route protection only, NOT for user-specific data access
   
   export default function middleware(request: NextRequest) {
     // ✅ Basic route protection is OK
     const isAuthenticated = request.cookies.get('better-auth.session_token')
     
     if (!isAuthenticated && request.nextUrl.pathname.startsWith('/app')) {
       return NextResponse.redirect('/auth/login')
     }
     
     // ❌ NEVER make authorization decisions based on user roles in middleware
     // ❌ NEVER access user data or permissions in middleware
   }
   ```

5. **Full Session Validation Required**
   ```typescript
   // ✅ Use full session validation in page components for user data
   import { auth } from '@/lib/auth'
   import { headers } from 'next/headers'
   
   export default async function Page() {
     const session = await auth.api.getSession({
       headers: await headers()
     })
     
     if (!session?.user) {
       redirect('/auth/login')
     }
     
     // Now safe to use session.user data
     return <div>Welcome {session.user.name}</div>
   }
   ```

### Database Schema Management Rules

6. **NEVER Manually Modify Better Auth Schema**
   ```bash
   # ❌ NEVER run manual migrations on Better Auth tables
   # ❌ NEVER modify Better Auth schema directly
   
   # ✅ ALWAYS use Better Auth CLI for schema changes
   npx @better-auth/cli generate
   npx @better-auth/cli migrate
   ```

7. **Schema Update Process**
   ```typescript
   // 1. Update Better Auth configuration in lib/auth.ts
   // 2. Run Better Auth CLI to regenerate schema
   // 3. Apply our ba_ prefix transformations via merge prompt
   // 4. Test with pnpm build
   ```

### API Usage Rules

8. **Client vs Server API Conflicts**
   ```typescript
   // ❌ NEVER mix client and server APIs in the same file
   // This causes hydration mismatches and runtime errors
   
   // ✅ Server Components - use auth.api
   const session = await auth.api.getSession({ headers: await headers() })
   
   // ✅ Client Components - use authClient
   const { data: session } = authClient.useSession()
   ```

9. **Server Actions Authentication**
   ```typescript
   // ✅ Use auth.api in Server Actions
   'use server'
   
   import { auth } from '@/lib/auth'
   import { headers } from 'next/headers'
   
   export async function updateProfile(formData: FormData) {
     const session = await auth.api.getSession({
       headers: await headers()
     })
     
     if (!session?.user) {
       throw new Error('Unauthorized')
     }
     
     // Safe to proceed with authenticated user
   }
   ```

### Plugin Configuration Rules

10. **nextCookies Plugin Order**
    ```typescript
    // ⚠️ CRITICAL: nextCookies plugin MUST be last in plugins array
    import { betterAuth } from 'better-auth'
    import { nextCookies } from 'better-auth/next-js'
    
    export const auth = betterAuth({
      plugins: [
        // Other plugins first
        twoFactor(),
        passkey(),
        // ✅ nextCookies MUST be last
        nextCookies()
      ]
    })
    ```

### Environment Variables Rules

11. **Critical Environment Variables**
    ```bash
    # ✅ REQUIRED in all environments
    BETTER_AUTH_SECRET=your-secret-key-min-32-chars
    BETTER_AUTH_URL=http://localhost:3000  # or your domain
    
    # ⚠️ BETTER_AUTH_SECRET must be at least 32 characters
    # ⚠️ BETTER_AUTH_URL must match your actual domain
    # ⚠️ Missing these causes silent authentication failures
    ```

12. **OAuth Configuration Rules**
    ```typescript
    // ✅ OAuth providers require exact redirect URI matching
    export const auth = betterAuth({
      socialProviders: {
        github: {
          clientId: process.env.GITHUB_CLIENT_ID!,
          clientSecret: process.env.GITHUB_CLIENT_SECRET!,
          // ⚠️ Redirect URI must EXACTLY match OAuth app settings
          redirectURI: `${process.env.BETTER_AUTH_URL}/api/auth/callback/github`
        }
      }
    })
    
    // ⚠️ Common OAuth issues:
    // - Mismatched redirect URIs (localhost vs 127.0.0.1)
    // - Missing trailing slashes
    // - HTTP vs HTTPS mismatches
    // - Port number differences
    ```

### Error Handling Rules

13. **Better Auth Error Types**
    ```typescript
    import { APIError } from 'better-auth/api'
    
    // ✅ Handle Better Auth specific errors
    try {
      await auth.api.signInEmail({ email, password })
    } catch (error) {
      if (error instanceof APIError) {
        // Handle Better Auth errors specifically
        if (error.status === 401) {
          return { error: 'Invalid credentials' }
        }
      }
      throw error // Re-throw unknown errors
    }
    ```

14. **Type Safety Rules**
    ```typescript
    // ✅ Always check session existence before accessing user data
    const session = await auth.api.getSession({ headers: await headers() })
    
    if (session?.user) {
      // ✅ Safe to access session.user properties
      const userId = session.user.id
      const email = session.user.email
    }
    
    // ❌ NEVER assume session exists without checking
    const userId = session.user.id // Could throw if session is null
    ```

### Integration Testing Rules

15. **Session Testing Patterns**
    ```typescript
    // ✅ Test both authenticated and unauthenticated states
    describe('Protected Route', () => {
      it('redirects when not authenticated', async () => {
        // Test without session
      })
      
      it('renders content when authenticated', async () => {
        // Test with valid session
      })
    })
    ```

### Common Pitfalls to Avoid

16. **Authentication Anti-Patterns**
    ```typescript
    // ❌ Don't cache sessions across requests without validation
    // ❌ Don't rely on client-side session state for security
    // ❌ Don't use session data in middleware for authorization
    // ❌ Don't mix Better Auth with other auth libraries
    // ❌ Don't manually parse session tokens
    // ❌ Don't store sensitive data in client-side session state
    ```

17. **Performance Considerations**
    ```typescript
    // ✅ Use React Suspense boundaries for session loading
    // ✅ Implement proper loading states
    // ✅ Cache session data appropriately on client-side
    // ✅ Use Server Components when possible to reduce client bundles
    ```

**🎯 Key Takeaway:** Better Auth handles the complexity - follow its patterns rather than fighting them. When in doubt, check the session properly and use the appropriate API (server vs client) for your context.

## User Management Rules

**⚠️ IMPORTANT: NO ROLE SELECTION OR ROLE-BASED FEATURES**

**What NOT to implement:**
- **DO NOT** add role selection dropdowns in signup/login forms
- **DO NOT** create role-based routing or access control systems
- **DO NOT** add role-related fields to user profile interfaces
- **DO NOT** implement role management dashboards or admin panels
- **DO NOT** create "Admin", "User", "Manager" role hierarchies

**What TO keep/implement:**
- ✅ **Email signup/signin** with email/password authentication
- ✅ **OAuth providers** (GitHub, Google, Discord, etc.)
- ✅ **Basic user profile** (name, email, image, preferences)
- ✅ **Session management** and authentication flows
- ✅ **Email verification** and password reset
- ✅ **User settings** and profile management

## shadcn/ui Component Modification Rules

**⚠️ CRITICAL: NEVER EDIT SHADCN/UI COMPONENTS DIRECTLY**

**Established Rule:** All shadcn/ui components in `src/components/ui/` are standardized and provide a solid foundation. **Everything must be additive, not modificative.**

### What NOT to do:
- ❌ **NEVER** edit files in `src/components/ui/` directly
- ❌ **NEVER** modify shadcn/ui component internals
- ❌ **NEVER** change existing shadcn/ui component APIs
- ❌ **NEVER** add custom props to shadcn/ui components
- ❌ **NEVER** alter shadcn/ui styling patterns

### What TO do instead:
- ✅ **CREATE wrapper components** that enhance shadcn/ui components
- ✅ **CREATE additional utility classes** in globals.css for styling enhancements
- ✅ **CREATE enhancement layers** like micro-interactions or visual effects
- ✅ **CREATE custom components** that compose shadcn/ui primitives
- ✅ **EXTEND functionality** through composition patterns

### Examples of Proper Enhancement Patterns:

#### ✅ Wrapper Component Pattern:
```typescript
// src/components/enhanced/InteractiveButton.tsx
import { Button, ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface InteractiveButtonProps extends ButtonProps {
  microInteraction?: boolean
  glow?: boolean
}

export function InteractiveButton({ 
  microInteraction, 
  glow, 
  className, 
  ...props 
}: InteractiveButtonProps) {
  return (
    <Button
      className={cn(
        microInteraction && 'transition-transform hover:scale-105',
        glow && 'hover:shadow-lg hover:shadow-primary/25',
        className
      )}
      {...props}
    />
  )
}
```

#### ✅ Composition Pattern:
```typescript
// src/components/composed/GradientCard.tsx
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function GradientCard({ className, ...props }) {
  return (
    <Card className={cn('bg-gradient-to-br from-primary/5 to-secondary/5', className)}>
      <CardHeader className="pb-3">
        <div className="h-1 w-12 bg-gradient-to-r from-primary to-secondary rounded-full" />
      </CardHeader>
      <CardContent {...props} />
    </Card>
  )
}
```

#### ✅ Utility Extension Pattern:
```css
/* src/app/globals.css - Add to @layer utilities */
@layer utilities {
  .btn-glow {
    @apply transition-all duration-200;
    box-shadow: 0 0 0 0 hsl(var(--primary) / 0);
  }
  
  .btn-glow:hover {
    box-shadow: 0 0 20px 2px hsl(var(--primary) / 0.3);
  }
}
```

### File Organization for Enhancements:
```
src/components/
├── ui/                    # ← NEVER TOUCH - shadcn/ui components
├── enhanced/              # ← Wrapper components with additional features  
├── composed/              # ← Custom components using shadcn/ui primitives
├── effects/               # ← Visual effects and animations
└── micro-interactions/    # ← Interaction enhancements
```

### Why This Rule Exists:
1. **Maintainability:** shadcn/ui updates won't break our customizations
2. **Standardization:** Consistent base components across the entire app
3. **Debugging:** Clear separation between base components and enhancements
4. **Team Collaboration:** Other developers can safely update shadcn/ui components
5. **Best Practices:** Follows React composition over inheritance principles

**🎯 Key Principle:** Always enhance through composition and wrapper patterns, never through direct modification of shadcn/ui components.

## Important Notes

- Product-specific files in `.agent-os/product/` override any global standards
- User's specific instructions override (or amend) instructions found in `.agent-os/specs/...`
- Always adhere to established patterns, code style, and best practices documented above
- **ALWAYS apply the incremental approach above to any complex task**
- **NEVER edit shadcn/ui components directly - always use additive enhancement patterns**