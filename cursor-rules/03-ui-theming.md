# UI and Theming Rules

## shadcn/ui Integration & Theming

This project uses shadcn/ui components with semantic color system for easy theme switching.

### Required Color Convention

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

### Component Setup
- **Components Location**: `src/components/ui/`
- **Utility Function**: `cn()` in `lib/utils.ts` for class merging
- **Theme Variables**: Defined in CSS custom properties (HSL format)

### Theme Implementation Examples

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