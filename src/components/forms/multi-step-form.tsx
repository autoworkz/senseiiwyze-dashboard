"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

export interface FormStep {
  id: string
  title: string
  description?: string
  component: React.ComponentType<{
    data: any
    onChange: (data: any) => void
    onNext: () => void
    onPrev: () => void
    errors?: Record<string, string>
  }>
  validation?: (data: any) => Record<string, string> | null
  optional?: boolean
}

interface MultiStepFormProps {
  steps: FormStep[]
  initialData?: any
  onSubmit: (data: any) => Promise<void> | void
  onCancel?: () => void
  className?: string
  showProgress?: boolean
  showStepNumbers?: boolean
  allowSkipOptional?: boolean
  submitLabel?: string
  cancelLabel?: string
  loading?: boolean
}

export function MultiStepForm({
  steps,
  initialData = {},
  onSubmit,
  onCancel,
  className,
  showProgress = true,
  showStepNumbers = true,
  allowSkipOptional = true,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  loading = false,
}: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [formData, setFormData] = React.useState(initialData)
  const [stepErrors, setStepErrors] = React.useState<Record<number, Record<string, string>>>({})
  const [completedSteps, setCompletedSteps] = React.useState<Set<number>>(new Set())
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const totalSteps = steps.length
  const progress = ((currentStep + 1) / totalSteps) * 100
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === totalSteps - 1
  const currentStepConfig = steps[currentStep]

  // Update form data
  const updateFormData = (stepData: any) => {
    setFormData((prev: any) => ({ ...prev, ...stepData }))
  }

  // Validate current step
  const validateCurrentStep = () => {
    const step = steps[currentStep]
    if (!step.validation) return true

    const errors = step.validation(formData)
    if (errors && Object.keys(errors).length > 0) {
      setStepErrors(prev => ({ ...prev, [currentStep]: errors }))
      return false
    }

    // Clear errors for this step
    setStepErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[currentStep]
      return newErrors
    })
    return true
  }

  // Navigate to next step
  const handleNext = () => {
    if (validateCurrentStep()) {
      setCompletedSteps(prev => new Set([...prev, currentStep]))
      setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1))
    }
  }

  // Navigate to previous step
  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }

  // Skip optional step
  const handleSkip = () => {
    if (currentStepConfig.optional && allowSkipOptional) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1))
    }
  }

  // Navigate to specific step
  const goToStep = (stepIndex: number) => {
    if (stepIndex <= currentStep || completedSteps.has(stepIndex - 1)) {
      setCurrentStep(stepIndex)
    }
  }

  // Submit form
  const handleSubmit = async () => {
    if (!validateCurrentStep()) return

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const StepComponent = currentStepConfig.component
  const currentErrors = stepErrors[currentStep] || {}

  return (
    <div className={cn("space-y-6", className)}>
      {/* Progress Bar */}
      {showProgress && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Step {currentStep + 1} of {totalSteps}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {/* Step Navigation */}
      <div className="flex items-center justify-center space-x-2 overflow-x-auto pb-2">
        {steps.map((step, index) => {
          const isActive = index === currentStep
          const isCompleted = completedSteps.has(index)
          const isAccessible = index <= currentStep || completedSteps.has(index - 1)

          return (
            <React.Fragment key={step.id}>
              <button
                onClick={() => isAccessible && goToStep(index)}
                disabled={!isAccessible}
                className={cn(
                  "flex items-center justify-center rounded-full transition-all",
                  showStepNumbers ? "h-8 w-8" : "h-3 w-3",
                  isActive && "ring-2 ring-primary ring-offset-2",
                  isCompleted ? "bg-primary text-primary-foreground" : 
                  isActive ? "bg-primary text-primary-foreground" :
                  isAccessible ? "bg-muted hover:bg-muted/80" : "bg-muted/50",
                  !isAccessible && "cursor-not-allowed opacity-50"
                )}
              >
                {showStepNumbers ? (
                  isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )
                ) : null}
              </button>
              {index < steps.length - 1 && (
                <div className={cn(
                  "h-0.5 w-8 transition-colors",
                  isCompleted ? "bg-primary" : "bg-muted"
                )} />
              )}
            </React.Fragment>
          )
        })}
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {showStepNumbers && (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                {currentStep + 1}
              </span>
            )}
            {currentStepConfig.title}
            {currentStepConfig.optional && (
              <span className="text-sm font-normal text-muted-foreground">(Optional)</span>
            )}
          </CardTitle>
          {currentStepConfig.description && (
            <CardDescription>{currentStepConfig.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <StepComponent
            data={formData}
            onChange={updateFormData}
            onNext={handleNext}
            onPrev={handlePrev}
            errors={currentErrors}
          />
        </CardContent>
      </Card>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {!isFirstStep && (
            <Button
              type="button"
              variant="outline"
              onClick={handlePrev}
              disabled={loading || isSubmitting}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
          )}
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={loading || isSubmitting}
            >
              {cancelLabel}
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {currentStepConfig.optional && allowSkipOptional && !isLastStep && (
            <Button
              type="button"
              variant="ghost"
              onClick={handleSkip}
              disabled={loading || isSubmitting}
            >
              Skip
            </Button>
          )}
          
          {isLastStep ? (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={loading || isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? "Submitting..." : submitLabel}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleNext}
              disabled={loading || isSubmitting}
              className="gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// Helper hook for form step state management
export function useFormStep(initialData: any = {}) {
  const [data, setData] = React.useState(initialData)
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const updateField = (field: string, value: any) => {
    setData((prev: any) => ({ ...prev, [field]: value }))
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const setFieldError = (field: string, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }))
  }

  const clearErrors = () => {
    setErrors({})
  }

  return {
    data,
    setData,
    errors,
    setErrors,
    updateField,
    setFieldError,
    clearErrors,
  }
}