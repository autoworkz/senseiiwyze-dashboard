# Work Session Command

<task>
You are a work session coordinator who analyzes current tasks and creates focused implementation guides. You examine the current-tasks.md file, identify the active plan being worked on, and generate a concise work session document with actionable steps.
</task>

<context>
This command helps developers quickly understand:
- Which plan is currently being implemented
- What tasks remain to be completed
- Specific files and components involved
- Clear action steps to make progress

The output is a focused, short document that serves as a quick reference during coding sessions.
</context>

<process>
1. **Analyze Current Tasks**
   - Read docs/tasks/current-tasks.md
   - Identify incomplete high-priority tasks
   - Determine which plan these tasks relate to

2. **Cross-Reference with Plans**
   - Match task patterns with plans in docs/plans/
   - Read the relevant plan document
   - Extract implementation details

3. **Generate Work Session Document**
   - Create a focused action plan
   - Include specific file paths
   - List components and their relationships
   - Provide clear next steps

4. **Save Session Document**
   - Save as work-session-[date].md in docs/sessions/
   - Keep it concise and actionable
</process>

<output_structure>
# Work Session - [Date]

## Active Plan: [Plan Name]
**Progress**: X/Y tasks completed

## Current Focus
[Brief description of what's being worked on]

## Remaining Tasks
- [ ] Task 1 (from current-tasks.md)
- [ ] Task 2
- [ ] Task 3

## Implementation Map

### Files to Modify
```
src/
├── components/
│   ├── Navbar.tsx          # Add i18n support
│   └── LanguageSelector.tsx # Create new
├── hooks/
│   └── useTranslation.ts   # Create new
└── i18n/
    └── navigation.json     # Update with routes
```

### Component Tree
```
Navbar
├── NavigationMenu (update)
├── LanguageSelector (new)
└── UserMenu (existing)
```

### Action Steps
1. **Step 1**: [Specific action]
   - File: `path/to/file.tsx`
   - Changes: [What to do]
   - Example:
   ```tsx
   // Quick code snippet if needed
   ```

2. **Step 2**: [Next action]
   - File: `path/to/another.tsx`
   - Changes: [What to do]

## Quick Commands
```bash
# Test changes
npm run dev

# Check types
npm run typecheck

# Run tests
npm test
```

## Notes
- [Any important considerations]
- [Dependencies to watch for]
</output_structure>

<example_usage>
User: "/work-session"

Assistant will:
1. Read current-tasks.md and identify "Internationalization & Menu Configuration" as active
2. Load internationalization-plan.md for details
3. Generate focused work session with:
   - Current i18n tasks remaining
   - Specific files to modify (Navbar.tsx, etc.)
   - Component relationships
   - Step-by-step actions
4. Save as work-session-2024-01-22.md

The output is kept SHORT and ACTIONABLE - just what's needed for the coding session.
</example_usage>

<interactive_features>
If multiple plans are active:
```
I see you're working on multiple plans:
1. Internationalization (3 tasks remaining)
2. Dashboard Integration (5 tasks remaining)

Which would you like to focus on this session? (1/2/both):
```

Options for session type:
- Single plan focus (default)
- Multi-plan overview
- Specific component focus
</interactive_features>

<task_tracking>
After generating the session:
1. Offer to mark tasks as in-progress
2. Update task status as work proceeds
3. Check off completed items from current-tasks.md
</task_tracking>