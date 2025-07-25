# Project Brief

## Vision
A comprehensive Next.js 15 dashboard application that provides multi-step authentication flow and data visualization capabilities for business analytics and program readiness tracking.

## Core Problems Solved
- **Complex Data Visualization**: Provides executive, user, and program readiness dashboards for business intelligence
- **Multi-Step Authentication Flow**: Streamlined user onboarding with step-by-step process
- **Scalable Component Architecture**: Uses shadcn/ui for consistent, themeable component system
- **Account Context Management**: Supports both personal and team account contexts

## Success Metrics
- **User Experience**: Seamless authentication flow with clear step progression
- **Performance**: Fast loading times with Next.js 15 App Router optimization
- **Maintainability**: Clean component architecture with proper TypeScript typing
- **Accessibility**: shadcn/ui components ensure WCAG compliance

## Scope Boundaries
### In Scope
- Authentication system with multi-step flow
- Dashboard views (executive, user, program readiness)
- Account context switching (personal vs team)
- Responsive UI with semantic theming
- Form validation and state management

### Out of Scope
- Backend API implementation (currently using mock data)
- Real-time data streaming
- Advanced user role management
- Third-party integrations beyond authentication

## Key Constraints
- **Package Manager**: Must use pnpm (enforced in project configuration)
- **UI Framework**: shadcn/ui with semantic color system (no hardcoded colors)
- **State Management**: Zustand with localStorage persistence
- **Testing**: Test-Driven Development (TDD) with Jest and React Testing Library
- **Architecture**: Next.js 15 App Router pattern with TypeScript

## Deployment Context
- **Production**: Vercel deployment
- **URLs**: 
  - Program Readiness: https://senseii-web-app-tsaw.vercel.app/dashboard/program-readiness-dashboard
  - Executive Dashboard: https://senseii-web-app-tsaw.vercel.app/dashboard/executive-dashboard
  - User Dashboard: https://senseii-web-app-tsaw.vercel.app/dashboard/user-dashboard