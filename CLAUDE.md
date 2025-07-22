# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
pnpm test             # Run all tests once
pnpm test:watch       # Run tests in watch mode (use for TDD)
pnpm test:coverage    # Generate test coverage report
```

### Running a Single Test
```bash
# Run tests matching a pattern
pnpm test -- LoginPage
pnpm test -- useLoginForm

# Run tests in a specific file
pnpm test -- src/components/__tests__/LoginPage.test.tsx

# Run tests with debugging
pnpm test -- --detectOpenHandles
```

## Architecture Overview

This is a Next.js 15 application using the App Router pattern with TypeScript and shadcn/ui components.

### Core Technologies
- **Framework**: Next.js 15 with App Router
- **UI Library**: shadcn/ui (Radix UI primitives + Tailwind CSS)
- **State Management**: Zustand with localStorage persistence
- **Validation**: Zod schemas with custom utilities
- **Styling**: Tailwind CSS with neutral theme (easily customizable)

### Key Architectural Decisions

1. **Component Pattern**: All interactive components use `'use client'` directive. Components are composed using shadcn/ui primitives (Button, Input, Label, etc.) with variant-based styling through CVA (class-variance-authority).

2. **State Management**: 
   - Local state for component-specific UI (useState)
   - Global state via Zustand store (`lib/store.ts`) for user profiles, settings, and projects
   - Form state managed through custom hooks (e.g., `useLoginForm`)

3. **Multi-Step Process**: The app implements a multi-step flow (`/step1`, `/step2`, `/step3`) with global navigation through the Navbar component.

4. **Authentication Flow**: 
   - Login page redirects to `/step1` on successful authentication
   - Support for email/password and social authentication (Google, Facebook, GitHub)
   - Authentication service uses singleton pattern with proper error handling

5. **Validation Architecture**:
   - Zod schemas define validation rules (`utils/validationSchema.ts`)
   - Utility functions provide reusable validation (`utils/validation.ts`)
   - Password requirements: min 8 chars, uppercase, lowercase, number, special char

6. **Testing Strategy**: Test-Driven Development (TDD) approach with Jest and React Testing Library. Tests should be written before implementation.

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

#### Theme Implementation
```tsx
// ✅ CORRECT - Uses semantic colors
<div className="bg-background text-foreground">
  <div className="bg-card p-6 rounded-lg border">
    <h2 className="text-lg font-semibold">Title</h2>
    <p className="text-muted-foreground">Description</p>
    <Button className="bg-primary text-primary-foreground">Action</Button>
  </div>
</div>

// ❌ WRONG - Uses hardcoded colors
<div className="bg-white text-gray-900">
  <div className="bg-gray-50 p-6 rounded-lg border-gray-200">
    <h2 className="text-gray-800">Title</h2>
    <p className="text-gray-600">Description</p>
    <Button className="bg-blue-600 text-white">Action</Button>
  </div>
</div>
```

This approach ensures the entire application can switch themes (light/dark/custom) by simply changing CSS variables, without modifying any component code.

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

### Current Implementation Status
- ✅ Authentication system (login page)
- ✅ Multi-step process routing
- ✅ Global state management
- ✅ Form validation
- ✅ Responsive navbar
- 🚧 Settings page (in progress)
- ⏳ API routes (not yet implemented)

## Account Context Awareness

The application implements multi-account support (personal vs team accounts). Key considerations:
- Always show which account context is active
- Account switcher should be prominent in the UI
- Forms and actions must clearly indicate which account they affect
- Consider confirmation dialogs for critical actions that specify the account