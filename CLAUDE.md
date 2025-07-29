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

## Problem-Solving Approach

**⚠️ CRITICAL: When approaching any complex problem, testing, or implementation task, ALWAYS follow the incremental approach:**

### Start Small → Validate → Expand → Scale

1. **Start Small (5-10 min):** Begin with the most basic validation (e.g., `pnpm build`)
2. **Validate (5-10 min):** Confirm the small step works (e.g., test one page in one locale)  
3. **Expand (10-15 min):** Gradually increase scope (e.g., test all locales for that page)
4. **Scale (15+ min):** Full implementation only after confirming the pattern works

**See:** `cursor-rules/07-incremental-testing-approach.md` for detailed guidelines.

**Why:** Complexity is the enemy of reliability. This approach catches issues early, provides measurable progress, and ensures working deliverables.

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

## Important Notes

- Product-specific files in `.agent-os/product/` override any global standards
- User's specific instructions override (or amend) instructions found in `.agent-os/specs/...`
- Always adhere to established patterns, code style, and best practices documented above
- **ALWAYS apply the incremental approach above to any complex task**