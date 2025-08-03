# Interactive Micro-Interactions System

A modular micro-interactions system that enhances shadcn/ui components without modifying them. This system provides three ways to add polished micro-interactions to your UI.

## Features

- **Non-intrusive**: Wraps shadcn/ui components without modifying them
- **Modular**: Three different approaches for different use cases
- **Accessible**: Respects `prefers-reduced-motion` automatically
- **Customizable**: Multiple intensity levels and effect types
- **Type-safe**: Full TypeScript support with proper type inference

## Three Usage Approaches

### 1. Wrapper Components (Recommended)

Enhanced versions of shadcn components with built-in micro-interactions.

```tsx
import { InteractiveButton, InteractiveCard, InteractiveInput } from '@/components/interactive'

// Basic usage with default interactions
<InteractiveButton variant="default">Click me</InteractiveButton>

// With custom effects and intensity
<InteractiveButton 
  variant="outline"
  effect="glow"
  intensity="strong"
>
  Enhanced Button
</InteractiveButton>

// Interactive cards
<InteractiveCard effect="lift" clickable>
  <InteractiveCardHeader>
    <InteractiveCardTitle>Hover me</InteractiveCardTitle>
  </InteractiveCardHeader>
  <InteractiveCardContent>
    This card lifts on hover.
  </InteractiveCardContent>
</InteractiveCard>
```

### 2. Utility Classes

Add micro-interactions to any element using CSS utility classes.

```tsx
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

// Scale effect on any button
<Button className="interactive-scale">Scale on Hover</Button>

// Lift effect on any card
<Card className="interactive-lift cursor-pointer">
  Hoverable Card
</Card>

// Intensity variations
<Button className="interactive-subtle">Subtle Animation</Button>
<Button className="interactive-strong">Strong Animation</Button>
```

### 3. useInteractive Hook

Programmatically add micro-interactions using a React hook.

```tsx
import { useInteractive } from '@/components/interactive'
import { Button } from '@/components/ui/button'

function MyComponent() {
  const { className, ...props } = useInteractive({
    type: 'button',
    effect: 'glow',
    intensity: 'strong'
  })

  return (
    <Button className={className} {...props}>
      Hook-Enhanced Button
    </Button>
  )
}
```

## Available Effects

### Core Effects
- `scale` - Scales element on hover/active
- `lift` - Lifts element with enhanced shadow
- `glow` - Adds glowing effect on hover/focus
- `pulse` - Continuous pulsing animation
- `float` - Gentle floating animation
- `focus-ring` - Enhanced focus ring for inputs

### Intensity Levels
- `subtle` - Minimal animations (150ms, small transforms)
- `normal` - Default animations (200ms, standard transforms)
- `strong` - Enhanced animations (250ms, larger transforms)

## API Reference

### InteractiveButton

```tsx
interface InteractiveButtonProps extends ButtonProps {
  intensity?: 'subtle' | 'normal' | 'strong'
  effect?: 'scale' | 'lift' | 'glow' | 'pulse'
  // All standard Button props are supported
}
```

### InteractiveCard

```tsx
interface InteractiveCardProps extends CardProps {
  intensity?: 'subtle' | 'normal' | 'strong'
  effect?: 'lift' | 'scale' | 'glow' | 'float'
  clickable?: boolean // Adds cursor pointer and enhanced feedback
}
```

### InteractiveInput

```tsx
interface InteractiveInputProps extends InputProps {
  intensity?: 'subtle' | 'normal' | 'strong'
  effect?: 'glow' | 'lift' | 'scale' | 'focus-ring'
}
```

### useInteractive Hook

```tsx
interface UseInteractiveOptions {
  type?: 'button' | 'card' | 'input' | 'generic'
  intensity?: 'subtle' | 'normal' | 'strong'
  effect?: 'scale' | 'lift' | 'glow' | 'pulse' | 'float' | 'focus-ring'
  className?: string
  disabled?: boolean
  clickable?: boolean
}

interface UseInteractiveReturn {
  className: string
  // Future: Additional props for enhanced functionality
}
```

## CSS Utility Classes

All utility classes can be applied to any element:

### Base Classes
- `.interactive-base` - Basic interactive foundation
- `.btn-micro` - Button-specific interactions (auto-applied to shadcn buttons)
- `.card-micro` - Card-specific interactions (auto-applied to shadcn cards)
- `.input-micro` - Input-specific interactions (auto-applied to shadcn inputs)

### Effect Classes
- `.interactive-scale` - Scale effect
- `.interactive-lift` - Lift effect with shadow
- `.interactive-glow` - Glow effect
- `.interactive-pulse` - Pulsing animation
- `.interactive-float` - Floating animation
- `.interactive-focus-ring` - Enhanced focus ring
- `.interactive-clickable` - Clickable feedback

### Intensity Classes
- `.interactive-subtle` - Subtle interactions
- `.interactive-strong` - Strong interactions

## Accessibility

The system automatically respects the user's motion preferences:

- When `prefers-reduced-motion: reduce` is set, all animations are disabled
- Focus indicators remain visible for keyboard navigation
- Hover states are preserved for mouse users

## Examples

### Dashboard Card with Interaction

```tsx
<InteractiveCard effect="lift" clickable className="cursor-pointer">
  <InteractiveCardHeader>
    <InteractiveCardTitle>Revenue</InteractiveCardTitle>
  </InteractiveCardHeader>
  <InteractiveCardContent>
    <div className="text-2xl font-bold">$45,231</div>
  </InteractiveCardContent>
</InteractiveCard>
```

### Form with Enhanced Inputs

```tsx
<form className="space-y-4">
  <InteractiveInput 
    placeholder="Email"
    effect="glow"
    type="email"
  />
  <InteractiveInput 
    placeholder="Password"
    effect="focus-ring"
    type="password"
  />
  <InteractiveButton type="submit" effect="scale">
    Sign In
  </InteractiveButton>
</form>
```

### Navigation with Utility Classes

```tsx
<nav className="space-x-4">
  <Button variant="ghost" className="interactive-scale">
    Home
  </Button>
  <Button variant="ghost" className="interactive-lift">
    About
  </Button>
  <Button variant="default" className="interactive-glow">
    Contact
  </Button>
</nav>
```

## Demo

Visit `/app/interactive-demo` to see all effects in action and experiment with different combinations.

## Customization

To add new effects, extend the CSS in `src/styles/micro-interactions.css`:

```css
.interactive-custom-effect {
  @apply transition-all duration-200 ease-out;
}

.interactive-custom-effect:hover {
  /* Your custom effect here */
  transform: rotateZ(5deg);
}
```

Then add it to the effect mappings in the components and hook.