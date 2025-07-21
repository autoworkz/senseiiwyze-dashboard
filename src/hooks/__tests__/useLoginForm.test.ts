import { renderHook, act } from '@testing-library/react'
import { useLoginForm } from '../useLoginForm'

// Mock the validation utilities
jest.mock('../../utils/validation', () => ({
  validateForm: jest.fn(),
}))

import { validateForm } from '../../utils/validation'
const mockValidateForm = validateForm as jest.MockedFunction<typeof validateForm>

describe('useLoginForm Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockValidateForm.mockReturnValue({})
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useLoginForm())

    expect(result.current.formData).toEqual({
      email: '',
      password: '',
    })
    expect(result.current.errors).toEqual({})
    expect(result.current.isSubmitting).toBe(false)
    expect(result.current.isLoading).toBe(false)
  })

  it('should update form data when updateField is called', () => {
    const { result } = renderHook(() => useLoginForm())

    act(() => {
      result.current.updateField('email', 'test@example.com')
    })

    expect(result.current.formData.email).toBe('test@example.com')
    expect(result.current.formData.password).toBe('')
  })

  it('should clear field-specific errors when updating field', () => {
    const { result } = renderHook(() => useLoginForm())

    // Set initial errors
    act(() => {
      result.current.setErrors({
        email: 'Email error',
        password: 'Password error',
        general: 'General error',
      })
    })

    // Update email field
    act(() => {
      result.current.updateField('email', 'test@example.com')
    })

    expect(result.current.errors).toEqual({
      password: 'Password error',
    })
  })

  it('should validate form and return validation result', () => {
    const { result } = renderHook(() => useLoginForm())
    
    mockValidateForm.mockReturnValue({ email: 'Invalid email' })

    act(() => {
      result.current.updateField('email', 'invalid-email')
    })

    let isValid: boolean
    act(() => {
      isValid = result.current.validateForm()
    })

    expect(isValid!).toBe(false)
    expect(result.current.errors).toEqual({ email: 'Invalid email' })
    expect(mockValidateForm).toHaveBeenCalledWith({
      email: 'invalid-email',
      password: '',
    })
  })

  it('should return true when form is valid', () => {
    const { result } = renderHook(() => useLoginForm())
    
    mockValidateForm.mockReturnValue({})

    act(() => {
      result.current.updateField('email', 'test@example.com')
      result.current.updateField('password', 'password123')
    })

    let isValid: boolean
    act(() => {
      isValid = result.current.validateForm()
    })

    expect(isValid!).toBe(true)
    expect(result.current.errors).toEqual({})
  })

  it('should handle async operations with loading states', async () => {
    const { result } = renderHook(() => useLoginForm())

    expect(result.current.isSubmitting).toBe(false)
    expect(result.current.isLoading).toBe(false)

    act(() => {
      result.current.setIsSubmitting(true)
    })

    expect(result.current.isSubmitting).toBe(true)

    act(() => {
      result.current.setIsLoading(true)
    })

    expect(result.current.isLoading).toBe(true)
  })

  it('should reset form to initial state', () => {
    const { result } = renderHook(() => useLoginForm())

    // Set some data and errors
    act(() => {
      result.current.updateField('email', 'test@example.com')
      result.current.updateField('password', 'password123')
      result.current.setErrors({ general: 'Some error' })
      result.current.setIsSubmitting(true)
    })

    // Reset form
    act(() => {
      result.current.resetForm()
    })

    expect(result.current.formData).toEqual({
      email: '',
      password: '',
    })
    expect(result.current.errors).toEqual({})
    expect(result.current.isSubmitting).toBe(false)
    expect(result.current.isLoading).toBe(false)
  })
})