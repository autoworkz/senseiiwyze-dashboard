import { useState, useCallback } from 'react'
import { validateForm as validateFormUtil, FormData, FormErrors } from '@/utils/validation'

export interface UseLoginFormReturn {
  formData: FormData
  errors: FormErrors
  isSubmitting: boolean
  isLoading: boolean
  updateField: (field: keyof FormData, value: string) => void
  setErrors: (errors: FormErrors) => void
  setIsSubmitting: (isSubmitting: boolean) => void
  setIsLoading: (isLoading: boolean) => void
  validateForm: () => boolean
  resetForm: () => void
}

const initialFormData: FormData = {
  email: '',
  password: '',
}

const initialErrors: FormErrors = {}

/**
 * Custom hook for managing login form state and validation
 * @returns Object containing form state and handlers
 */
export const useLoginForm = (): UseLoginFormReturn => {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<FormErrors>(initialErrors)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  /**
   * Updates a specific form field and clears related errors
   */
  const updateField = useCallback((field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))

    // Clear field-specific error and general error when user starts typing
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      delete newErrors.general
      return newErrors
    })
  }, [])

  /**
   * Validates the current form data
   * @returns boolean indicating if form is valid
   */
  const validateFormData = useCallback((): boolean => {
    const validationErrors = validateFormUtil(formData)
    setErrors(validationErrors)
    return Object.keys(validationErrors).length === 0
  }, [formData])

  /**
   * Resets form to initial state
   */
  const resetForm = useCallback(() => {
    setFormData(initialFormData)
    setErrors(initialErrors)
    setIsSubmitting(false)
    setIsLoading(false)
  }, [])

  return {
    formData,
    errors,
    isSubmitting,
    isLoading,
    updateField,
    setErrors,
    setIsSubmitting,
    setIsLoading,
    validateForm: validateFormData,
    resetForm,
  }
}