# React-ARIA Integration Guide

This guide covers the integration of React-ARIA components in the senseiiwyze-dashboard project to enhance accessibility and provide a better user experience for all users, including those using assistive technologies.

## Overview

React-ARIA is a library of React hooks that provides accessible UI primitives for building design systems and component libraries. It handles complex accessibility requirements like keyboard navigation, screen reader support, and focus management.

## Architecture

Our React-ARIA integration follows a hybrid approach:

- **Enhanced Components**: New React-ARIA versions of key components alongside existing Radix UI components
- **Utility Layer**: Shared accessibility utilities and patterns
- **Focus Management**: Comprehensive focus management system
- **Testing Integration**: Automated accessibility testing with axe-core

## Available Components

### Core Components

#### AriaButton
Enhanced button component with React-ARIA features:

```tsx
import { AriaButton } from '@/components/ui/aria-button'

// Basic usage
<AriaButton onPress={() => console.log('clicked')}>
  Click me
</AriaButton>

// With loading state
<AriaButton 
  isLoading 
  loadingText="Processing..."
  onPress={handleSubmit}
>
  Submit
</AriaButton>

// Different variants
<AriaButton variant="destructive" size="lg">
  Delete
</AriaButton>
```

**Features:**
- Enhanced keyboard navigation
- Loading states with proper ARIA attributes
- Focus ring management
- Screen reader announcements

#### AriaInput
Enhanced input component with comprehensive accessibility:

```tsx
import { AriaInput } from '@/components/ui/aria-input'

// With label and validation
<AriaInput
  label="Email Address"
  type="email"
  isRequired
  error={errors.email}
  description="We'll never share your email"
  value={email}
  onChange={setEmail}
/>

// Simple field version (for use with external labels)
<AriaInputField
  type="password"
  error={errors.password}
  value={password}
  onChange={setPassword}
/>
```

**Features:**
- Automatic label association
- Error message handling with live regions
- Validation state management
- Description text support

#### AriaCheckbox
Accessible checkbox with enhanced features:

```tsx
import { AriaCheckbox } from '@/components/ui/aria-checkbox'

<AriaCheckbox
  isSelected={accepted}
  onChange={setAccepted}
  error={errors.terms}
>
  I accept the terms and conditions
</AriaCheckbox>
```

#### AriaSwitch
Toggle switch with proper accessibility:

```tsx
import { AriaSwitch } from '@/components/ui/aria-switch'

<AriaSwitch
  isSelected={enabled}
  onChange={setEnabled}
  description="Receive email notifications"
>
  Enable notifications
</AriaSwitch>
```

#### AriaTable
Accessible data table with sorting and selection:

```tsx
import { AriaTable } from '@/components/ui/aria-table'

<AriaTable
  aria-label="User data"
  selectionMode="multiple"
  sortDescriptor={sortDescriptor}
  onSortChange={setSortDescriptor}
  onSelectionChange={setSelectedKeys}
>
  <TableHeader>
    <Column key="name" allowsSorting>Name</Column>
    <Column key="email" allowsSorting>Email</Column>
    <Column key="role">Role</Column>
  </TableHeader>
  <TableBody items={users}>
    {(user) => (
      <Row key={user.id}>
        <Cell>{user.name}</Cell>
        <Cell>{user.email}</Cell>
        <Cell>{user.role}</Cell>
      </Row>
    )}
  </TableBody>
</AriaTable>
```

## Utility Functions

### Accessibility Utilities

```tsx
import { 
  mergeAriaProps, 
  createAriaId, 
  createValidationAriaProps,
  screenReaderUtils 
} from '@/lib/aria-utils'

// Merge ARIA props safely
const mergedProps = mergeAriaProps(baseProps, ariaProps)

// Generate unique IDs
const labelId = createAriaId('input-label')

// Create validation ARIA attributes
const validationProps = createValidationAriaProps(
  error, 
  description, 
  errorId, 
  descriptionId
)

// Screen reader announcements
screenReaderUtils.announce('Form submitted successfully', 'polite')
```

### Focus Management Hooks

```tsx
import { 
  useModalFocus, 
  useMenuFocus, 
  useFocusTrap,
  useContainerFocus 
} from '@/hooks/useFocusManagement'

// Modal focus management
const modalRef = useModalFocus(isOpen)

// Menu focus management
const { containerRef, handleKeyDown } = useMenuFocus(isMenuOpen)

// Focus trapping
const trapRef = useFocusTrap(isActive)

// Container focus utilities
const { focusFirst, focusLast, focusNext, focusPrevious } = useContainerFocus()
```

## Best Practices

### When to Use React-ARIA vs Radix UI

**Use React-ARIA for:**
- Complex form components requiring advanced validation
- Data tables with sorting and selection
- Custom interactive components
- Components requiring fine-grained focus management
- New components where you want maximum accessibility control

**Keep Radix UI for:**
- Simple UI components (badges, separators, avatars)
- Components that work well with current implementation
- Third-party integrations that expect Radix UI patterns

### Component Development Guidelines

1. **Always provide labels**: Every interactive element needs an accessible name
2. **Handle error states**: Use live regions for dynamic error messages
3. **Implement keyboard navigation**: Support all relevant keyboard interactions
4. **Test with screen readers**: Verify the experience with assistive technology
5. **Use semantic HTML**: Choose the right HTML elements for the job

### Focus Management

```tsx
// Good: Proper focus management in modals
const MyModal = ({ isOpen, onClose }) => {
  const modalRef = useModalFocus(isOpen)
  
  return isOpen ? (
    <div 
      ref={modalRef}
      role="dialog" 
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <h2 id="modal-title">Modal Title</h2>
      {/* Modal content */}
    </div>
  ) : null
}

// Good: Keyboard navigation in menus
const MyMenu = ({ isOpen }) => {
  const { containerRef, handleKeyDown } = useMenuFocus(isOpen)
  
  return (
    <div 
      ref={containerRef}
      role="menu"
      onKeyDown={handleKeyDown}
    >
      {/* Menu items */}
    </div>
  )
}
```

### Error Handling

```tsx
// Good: Proper error announcement
const handleSubmit = async () => {
  try {
    await submitForm()
    screenReaderUtils.announce('Form submitted successfully', 'polite')
  } catch (error) {
    setErrors({ general: error.message })
    screenReaderUtils.announce(`Error: ${error.message}`, 'assertive')
  }
}
```

## Testing

### Automated Accessibility Testing

```tsx
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

test('component should not have accessibility violations', async () => {
  const { container } = render(<MyComponent />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

### Manual Testing Checklist

- [ ] Keyboard navigation works correctly
- [ ] Screen reader announces content properly
- [ ] Focus indicators are visible
- [ ] Error messages are announced
- [ ] Loading states are communicated
- [ ] All interactive elements have accessible names

## Migration Strategy

1. **Start with forms**: Begin by migrating form components as they benefit most from React-ARIA
2. **Enhance gradually**: Add React-ARIA components alongside existing ones
3. **Test thoroughly**: Ensure no regressions in existing functionality
4. **Document patterns**: Create examples for common use cases
5. **Train team**: Share knowledge about accessibility best practices

## Performance Considerations

- React-ARIA hooks are lightweight and tree-shakeable
- Bundle size impact is minimal when using only needed hooks
- Server-side rendering is fully supported
- No runtime performance impact on accessibility features

## Browser Support

React-ARIA supports all modern browsers and provides graceful degradation for older browsers. It works with:

- Chrome/Edge 88+
- Firefox 87+
- Safari 14+
- iOS Safari 14+
- Android Chrome 88+

## Resources

- [React-ARIA Documentation](https://react-spectrum.adobe.com/react-aria/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)

