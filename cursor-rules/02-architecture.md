# Architecture Rules

## Core Technologies
- **Framework**: Next.js 15 with App Router
- **UI Library**: shadcn/ui (Radix UI primitives + Tailwind CSS)
- **State Management**: Zustand with localStorage persistence
- **Validation**: Zod schemas with custom utilities
- **Styling**: Tailwind CSS with neutral theme

## Key Architectural Decisions

### 1. Component Pattern
- All interactive components use `'use client'` directive
- Components are composed using shadcn/ui primitives
- Use variant-based styling through CVA (class-variance-authority)

### 2. State Management
- **Local state**: `useState` for component-specific UI
- **Global state**: Zustand store (`lib/store.ts`) for user profiles, settings, and projects
- **Form state**: Managed through custom hooks (e.g., `useLoginForm`)

### 3. Multi-Step Process
- Implements multi-step flow (`/step1`, `/step2`, `/step3`)
- Global navigation through Navbar component

### 4. Authentication Flow
- Login page redirects to `/step1` on successful authentication
- Support for email/password and social authentication (Google, Facebook, GitHub)
- Authentication service uses singleton pattern with proper error handling

### 5. Validation Architecture
- Zod schemas define validation rules (`utils/validationSchema.ts`)
- Utility functions provide reusable validation (`utils/validation.ts`)
- Password requirements: min 8 chars, uppercase, lowercase, number, special char

### 6. Testing Strategy
- Test-Driven Development (TDD) approach
- Jest and React Testing Library
- Tests should be written before implementation

## Project Structure
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

## Import Convention
Always use the `@/` alias for imports from the src directory:
```typescript
import { Button } from '@/components/ui/button'
import { useLoginForm } from '@/hooks/useLoginForm'
```
``` 