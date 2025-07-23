# Cursor Rules for senseiiwyze-dashboard

This directory contains cursor rules for the senseiiwyze-dashboard project, extracted from CLAUDE.md.

## Rules Overview

### 1. [Package Manager Rules](./01-package-manager.md)
- pnpm requirement and commands
- Package management guidelines
- Testing commands

### 2. [Architecture Rules](./02-architecture.md)
- Core technologies and patterns
- Project structure
- Import conventions
- State management approach

### 3. [UI and Theming Rules](./03-ui-theming.md)
- shadcn/ui integration
- Semantic color system
- Theme implementation
- Component styling guidelines

### 4. [Development Workflow Rules](./04-development-workflow.md)
- Test-Driven Development (TDD)
- Code quality standards
- Git workflow
- Component structure patterns

### 5. [Account Context Rules](./05-account-context.md)
- Multi-account support
- Account context visibility
- UI implementation guidelines
- State management for accounts

### 6. [Implementation Status Rules](./06-implementation-status.md)
- Current project status
- Development priorities
- Guidelines for new features
- Code review checklist

## Quick Reference

### Essential Commands
```bash
pnpm dev          # Start development
pnpm test         # Run tests
pnpm build        # Build for production
pnpm lint         # Run linting
```

### Key Patterns
- Use `@/` alias for imports
- Use semantic colors (bg-background, text-foreground, etc.)
- Write tests before implementation
- Use `'use client'` for interactive components
- Follow TDD approach

### Critical Rules
1. **ALWAYS use pnpm** - never npm or yarn
2. **ALWAYS use semantic colors** - never hardcoded colors
3. **ALWAYS write tests first** - follow TDD
4. **ALWAYS use proper TypeScript types** - avoid `any`
5. **ALWAYS use @/ import alias** - for src directory imports

## Usage

These rules should be referenced when:
- Setting up development environment
- Writing new components
- Implementing features
- Reviewing code
- Onboarding new developers

For detailed information, refer to the individual rule files above. 