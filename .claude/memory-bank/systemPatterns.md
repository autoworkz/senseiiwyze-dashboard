# System Patterns

## Architecture Overview
Next.js 15 application using App Router pattern with TypeScript, shadcn/ui components, and Zustand state management. Deployed to Cloudflare Workers with enforced pnpm package management.

## Key Technologies
- **Primary**: Next.js 15 (App Router), TypeScript 5.8.3, React 19
- **UI Framework**: shadcn/ui (Radix UI primitives + Tailwind CSS 4.1.1)
- **State Management**: Zustand 5.0.6 with localStorage persistence
- **Validation**: Zod 4.0.5 with custom utilities
- **Testing**: Jest 30.0.5 + React Testing Library 16.3.0
- **Deployment**: Cloudflare Workers via @opennextjs/cloudflare

## Established Patterns

### Code Organization
- **Pages**: App Router structure in `src/app/` (default exports)
- **Components**: Named exports in `src/components/` with ui/ subdirectory
- **Hooks**: Custom React hooks in `src/hooks/`
- **Services**: Class-based API services in `src/services/`
- **Utilities**: Helper functions and schemas in `src/utils/`
- **Libraries**: Core utilities and store in `src/lib/`

### Component Patterns
- **Interactive Components**: Always use 'use client' directive
- **UI Components**: Composed using shadcn/ui primitives (Button, Input, Label, etc.)
- **Styling**: Variant-based styling through CVA (class-variance-authority)
- **Color System**: ONLY semantic color utilities (bg-background, text-foreground, etc.)
- **Imports**: Always use @/ alias for src directory imports

### Data Flow
- **Local State**: useState for component-specific UI state
- **Global State**: Zustand store (lib/store.ts) for user profiles, settings, projects
- **Form State**: Custom hooks (e.g., useLoginForm) for form management
- **Validation**: Zod schemas with reusable validation utilities

### Development Patterns
- **Testing**: Test-Driven Development (TDD) approach
- **Error Handling**: Structured error handling with proper TypeScript typing
- **Authentication**: Multi-step flow with social auth support (Google, Facebook, GitHub)
- **Account Context**: Support for personal vs team account switching

## Critical Paths
### Most Important Files
- `src/lib/store.ts`: Zustand state management with persistence
- `src/utils/validationSchema.ts`: Zod schemas for validation rules
- `src/components/ui/`: shadcn/ui component library
- `CLAUDE.md`: Project guidance and architectural decisions
- `package.json`: Enforces pnpm usage and dependency management

### Key Dependencies
- **shadcn/ui**: Component system built on Radix UI primitives
- **Zustand**: Lightweight state management with persistence
- **Zod**: Runtime type validation and schema definition
- **Tailwind CSS**: Utility-first CSS with semantic color system
- **@opennextjs/cloudflare**: Cloudflare Workers deployment adapter

## Don't Break These
- **Package Manager**: Must use pnpm (enforced via packageManager field and scripts)
- **Color System**: Never use hardcoded colors (bg-gray-100, text-blue-600, etc.)
- **Import Pattern**: Always use @/ alias for internal imports
- **Component Pattern**: Interactive components require 'use client'
- **Validation**: Password requirements (8+ chars, upper, lower, number, special)

## Architecture Decisions
### Recent Decisions
- **2025-07-25**: Added comprehensive Memory Bank system for context preservation
- **Recent**: Implemented shadcn/ui component library with semantic theming
- **Recent**: Enforced pnpm package manager with multiple enforcement mechanisms
- **Recent**: Adopted Test-Driven Development approach with Jest + RTL

### Future Considerations
- API routes implementation (currently using mock data)
- Real-time data streaming capabilities
- Advanced user role management system
- Third-party integrations beyond authentication
- Performance optimization for large datasets

## Current Implementation Status
- ✅ shadcn/ui component system with semantic colors
- ✅ Multi-step authentication flow (/step1, /step2, /step3)
- ✅ Dashboard implementations (program readiness, executive, user)
- ✅ Zustand state management with persistence
- ✅ Form validation with Zod schemas
- ✅ Cloudflare Workers deployment setup
- 🚧 Settings page and account context switching
- ⏳ Backend API integration
- ⏳ Real-time data features