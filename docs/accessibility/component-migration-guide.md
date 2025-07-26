# Component Migration Guide: Radix UI to React-ARIA

This guide provides step-by-step instructions for migrating components from Radix UI to React-ARIA, along with examples and best practices.

## Migration Strategy

### Phase 1: Assessment and Planning
1. **Audit existing components** - Identify which components would benefit from React-ARIA
2. **Prioritize by impact** - Focus on frequently used and accessibility-critical components
3. **Create compatibility layer** - Ensure smooth transition without breaking changes

### Phase 2: Implementation
1. **Create React-ARIA versions** - Build enhanced components alongside existing ones
2. **Maintain API compatibility** - Keep similar props and behavior where possible
3. **Add enhanced features** - Leverage React-ARIA's advanced accessibility features

### Phase 3: Adoption
1. **Update documentation** - Provide clear migration examples
2. **Gradual rollout** - Migrate components one at a time
3. **Team training** - Educate developers on new patterns

## Component-by-Component Migration

### Button Component

#### Before (Radix UI + Custom)
```tsx
import { Slot } from "@radix-ui/react-slot"

const Button = ({ asChild, className, ...props }) => {
  const Comp = asChild ? Slot : "button"
  return <Comp className={cn(buttonVariants(), className)} {...props} />
}
```

#### After (React-ARIA Enhanced)
```tsx
import { useButton } from "@react-aria/button"
import { useFocusRing } from "@react-aria/focus"

const AriaButton = ({ className, onPress, ...props }) => {
  const ref = useRef()
  const { buttonProps, isPressed } = useButton({ onPress, ...props }, ref)
  const { isFocusVisible, focusProps } = useFocusRing()
  
  return (
    <button
      ref={ref}
      className={cn(buttonVariants(), className)}
      {...mergeProps(buttonProps, focusProps)}
    />
  )
}
```

#### Migration Benefits
- Enhanced keyboard navigation
- Better focus management
- Loading state handling
- Screen reader improvements

### Input Component

#### Before (Basic HTML Input)
```tsx
const Input = ({ className, type, ...props }) => {
  return (
    <input
      type={type}
      className={cn("flex h-9 w-full rounded-md border...", className)}
      {...props}
    />
  )
}
```

#### After (React-ARIA Enhanced)
```tsx
import { useTextField } from "@react-aria/textfield"

const AriaInput = ({ label, error, description, ...props }) => {
  const ref = useRef()
  const { labelProps, inputProps, errorMessageProps } = useTextField({
    label,
    errorMessage: error,
    description,
    validationState: error ? "invalid" : "valid",
    ...props
  }, ref)
  
  return (
    <div>
      {label && <label {...labelProps}>{label}</label>}
      <input ref={ref} {...inputProps} />
      {error && <div {...errorMessageProps} role="alert">{error}</div>}
    </div>
  )
}
```

#### Migration Benefits
- Automatic label association
- Error message handling
- Validation state management
- Better screen reader support

### Checkbox Component

#### Before (Radix UI)
```tsx
import * as Checkbox from "@radix-ui/react-checkbox"

const CheckboxComponent = ({ children, ...props }) => (
  <Checkbox.Root {...props}>
    <Checkbox.Indicator>
      <Check className="h-4 w-4" />
    </Checkbox.Indicator>
  </Checkbox.Root>
)
```

#### After (React-ARIA Enhanced)
```tsx
import { useCheckbox } from "@react-aria/checkbox"
import { useToggleState } from "@react-stately/toggle"

const AriaCheckbox = ({ children, onChange, ...props }) => {
  const state = useToggleState({ onChange, ...props })
  const ref = useRef()
  const { inputProps } = useCheckbox({ children, ...props }, state, ref)
  
  return (
    <label>
      <input ref={ref} {...inputProps} />
      <div data-state={state.isSelected ? "checked" : "unchecked"}>
        {state.isSelected && <Check />}
      </div>
      {children}
    </label>
  )
}
```

#### Migration Benefits
- Enhanced state management
- Better keyboard support
- Improved screen reader experience
- Consistent focus behavior

## Migration Patterns

### 1. Props Mapping

Many props can be mapped directly, but some require transformation:

```tsx
// Radix UI pattern
<RadixButton disabled={isLoading} onClick={handleClick}>
  Submit
</RadixButton>

// React-ARIA pattern
<AriaButton isDisabled={isLoading} onPress={handleClick}>
  Submit
</AriaButton>
```

**Common Mappings:**
- `disabled` → `isDisabled`
- `onClick` → `onPress`
- `checked` → `isSelected`
- `defaultChecked` → `defaultSelected`

### 2. Event Handling

React-ARIA uses different event patterns:

```tsx
// Before: DOM events
const handleClick = (event) => {
  event.preventDefault()
  // handle click
}

// After: React-ARIA events
const handlePress = () => {
  // React-ARIA handles preventDefault automatically
  // handle press (works for click, Enter, Space)
}
```

### 3. State Management

React-ARIA often requires explicit state management:

```tsx
// Before: Uncontrolled
<input type="checkbox" defaultChecked />

// After: Controlled with state
const [isSelected, setIsSelected] = useState(false)
<AriaCheckbox isSelected={isSelected} onChange={setIsSelected} />
```

### 4. Styling Integration

Maintain existing styling patterns:

```tsx
// Keep existing class variance authority patterns
const ariaButtonVariants = cva(
  "inline-flex items-center justify-center...",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground...",
        // ... other variants
      }
    }
  }
)

// Apply dynamic classes based on React-ARIA state
const buttonClasses = cn(
  ariaButtonVariants({ variant, size }),
  {
    "ring-2 ring-ring": isFocusVisible,
    "scale-95": isPressed,
  },
  className
)
```

## Common Migration Challenges

### 1. Ref Forwarding

React-ARIA components need proper ref handling:

```tsx
// Solution: Use forwardRef and merge refs
const AriaButton = forwardRef<HTMLButtonElement, AriaButtonProps>(
  (props, forwardedRef) => {
    const ref = useRef<HTMLButtonElement>(null)
    const buttonRef = forwardedRef || ref
    
    const { buttonProps } = useButton(props, buttonRef)
    
    return <button ref={buttonRef} {...buttonProps} />
  }
)
```

### 2. Compound Components

Some Radix UI patterns need restructuring:

```tsx
// Before: Compound component pattern
<Dialog.Root>
  <Dialog.Trigger />
  <Dialog.Content />
</Dialog.Root>

// After: Single component with hooks
const MyDialog = ({ isOpen, onOpenChange, trigger, children }) => {
  const { dialogProps, titleProps } = useDialog({ isOpen }, ref)
  
  return (
    <>
      {trigger}
      {isOpen && (
        <div {...dialogProps}>
          {children}
        </div>
      )}
    </>
  )
}
```

### 3. Server-Side Rendering

Ensure SSR compatibility:

```tsx
// Use useIsomorphicLayoutEffect for SSR safety
import { useIsomorphicLayoutEffect } from '@react-aria/utils'

const AriaComponent = () => {
  useIsomorphicLayoutEffect(() => {
    // Effect that needs to run on both client and server
  }, [])
}
```

## Testing Migration

### 1. Accessibility Testing

```tsx
// Test both old and new components
describe('Button Migration', () => {
  it('should maintain accessibility in migrated component', async () => {
    const { container: oldContainer } = render(<OldButton>Click</OldButton>)
    const { container: newContainer } = render(<AriaButton>Click</AriaButton>)
    
    const oldResults = await axe(oldContainer)
    const newResults = await axe(newContainer)
    
    expect(oldResults).toHaveNoViolations()
    expect(newResults).toHaveNoViolations()
    
    // New component should have equal or better accessibility
    expect(newResults.violations.length).toBeLessThanOrEqual(oldResults.violations.length)
  })
})
```

### 2. Behavioral Testing

```tsx
// Ensure behavior is preserved or enhanced
it('should maintain click behavior after migration', async () => {
  const handlePress = jest.fn()
  
  render(<AriaButton onPress={handlePress}>Click me</AriaButton>)
  
  const button = screen.getByRole('button')
  
  // Test mouse click
  await userEvent.click(button)
  expect(handlePress).toHaveBeenCalledTimes(1)
  
  // Test keyboard activation (enhanced behavior)
  await userEvent.type(button, '{enter}')
  expect(handlePress).toHaveBeenCalledTimes(2)
  
  await userEvent.type(button, ' ')
  expect(handlePress).toHaveBeenCalledTimes(3)
})
```

## Rollback Strategy

Always maintain the ability to rollback:

```tsx
// Feature flag approach
import { useFeatureFlag } from '@/hooks/useFeatureFlag'
import { Button as RadixButton } from '@/components/ui/button'
import { AriaButton } from '@/components/ui/aria-button'

export const Button = (props) => {
  const useAriaComponents = useFeatureFlag('aria-components')
  
  return useAriaComponents ? 
    <AriaButton {...props} /> : 
    <RadixButton {...props} />
}
```

## Performance Considerations

### Bundle Size Impact

```bash
# Analyze bundle size before and after migration
npm run build:analyze

# React-ARIA is tree-shakeable, so only imported hooks are bundled
# Typical size increase: 5-15KB gzipped for full component set
```

### Runtime Performance

- React-ARIA hooks are optimized for performance
- No significant runtime overhead
- Better performance in some cases due to optimized event handling

## Team Adoption

### 1. Training Materials

Create internal documentation:
- Component comparison charts
- Migration examples
- Best practices guide
- Common pitfalls and solutions

### 2. Code Review Guidelines

Update review checklist:
- [ ] Accessibility attributes are properly implemented
- [ ] Keyboard navigation works correctly
- [ ] Error states are handled with live regions
- [ ] Focus management is appropriate
- [ ] Tests cover accessibility scenarios

### 3. Development Tools

Set up helpful tooling:
- ESLint rules for accessibility
- Automated accessibility testing in CI
- Browser extensions for manual testing
- Screen reader testing guidelines

## Conclusion

Migrating to React-ARIA is an investment in accessibility and user experience. While it requires initial effort, the benefits include:

- **Better accessibility** - WCAG 2.1 AA compliance out of the box
- **Enhanced UX** - Improved keyboard navigation and screen reader support
- **Consistency** - Standardized interaction patterns across components
- **Future-proofing** - Built on web standards and best practices

Take a gradual approach, prioritize high-impact components, and ensure thorough testing throughout the migration process.

