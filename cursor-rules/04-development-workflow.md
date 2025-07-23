# Development Workflow Rules

## Test-Driven Development (TDD)

### Approach
- Write tests BEFORE implementing features
- Use Jest and React Testing Library
- Follow TDD cycle: Red → Green → Refactor

### Test File Structure
- Test files should be in `__tests__` directories
- Naming convention: `ComponentName.test.tsx` or `hookName.test.ts`
- Import test utilities from `@testing-library/react`

### Test Examples
```typescript
// Component test
import { render, screen } from '@testing-library/react'
import { LoginPage } from '@/components/LoginPage'

describe('LoginPage', () => {
  it('renders login form', () => {
    render(<LoginPage />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })
})

// Hook test
import { renderHook, act } from '@testing-library/react'
import { useLoginForm } from '@/hooks/useLoginForm'

describe('useLoginForm', () => {
  it('validates email format', () => {
    const { result } = renderHook(() => useLoginForm())
    
    act(() => {
      result.current.setEmail('invalid-email')
    })
    
    expect(result.current.errors.email).toBeTruthy()
  })
})
```

## Code Quality Standards

### Linting
- Run `pnpm lint` before committing
- Fix all ESLint warnings and errors
- Use consistent code formatting

### TypeScript
- Use strict TypeScript configuration
- Define proper interfaces and types
- Avoid `any` type - use proper typing

### Component Structure
```typescript
// ✅ Good component structure
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ComponentProps {
  title: string
  onSubmit: (data: FormData) => void
}

export function Component({ title, onSubmit }: ComponentProps) {
  const [value, setValue] = useState('')

  return (
    <div className="bg-card p-4 rounded-lg border">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <Input 
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="mt-2"
      />
      <Button 
        onClick={() => onSubmit({ value })}
        className="mt-2 bg-primary text-primary-foreground"
      >
        Submit
      </Button>
    </div>
  )
}
```

## Git Workflow
- Write descriptive commit messages
- Test changes before committing
- Use feature branches for new development
- Keep commits atomic and focused 