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

## Important Notes

- Product-specific files in `.agent-os/product/` override any global standards
- User's specific instructions override (or amend) instructions found in `.agent-os/specs/...`
- Always adhere to established patterns, code style, and best practices documented above.