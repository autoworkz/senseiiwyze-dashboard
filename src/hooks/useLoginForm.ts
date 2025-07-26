import { useState, useCallback } from 'react'
import { validateForm as validateFormUtil, FormData, FormErrors } from '@/utils/validation'
import { emailSchema, passwordSchema } from '@/utils/validationSchema'

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
  email: 'demo@example.com',
  password: 'Demo@123456710',
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

  /* ---------- Updates a single field & live-validates ---------- */
  const updateField = useCallback((field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    // Re-validate the edited field on every keystroke
    setErrors(prev => {
      const errs = { ...prev, general: undefined }
      try {
        field === 'email'
          ? emailSchema.parse(value)
          : passwordSchema.parse(value)
        delete errs[field]
      } catch (e: any) {
        errs[field] = e.errors?.[0]?.message ?? 'Invalid value'
      }
      return errs
    })
  }, [])

  /**
   * Validates the current form data
   * @returns boolean indicating if form is valid
   */
  const validateForm = useCallback((): boolean => {
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
    validateForm,
    resetForm,
  }
}