import * as React from "react"
import { useTextField } from "@react-aria/textfield"
import { useFocusRing } from "@react-aria/focus"
import { mergeProps } from "@react-aria/utils"
import { AriaTextFieldProps } from "@react-types/textfield"

import { cn } from "@/lib/utils"
import { createAriaId, createValidationAriaProps } from "@/lib/aria-utils"

export interface AriaInputProps extends AriaTextFieldProps {
  className?: string
  /**
   * Error message to display
   */
  error?: string
  /**
   * Helper text to display below the input
   */
  description?: string
  /**
   * Whether to show the error message inline
   */
  showErrorInline?: boolean
  /**
   * Custom error message ID (for external error handling)
   */
  errorId?: string
  /**
   * Custom description ID (for external description handling)
   */
  descriptionId?: string
  /**
   * Input size variant
   */
  size?: "sm" | "default" | "lg"
  /**
   * Input variant
   */
  variant?: "default" | "filled" | "outline"
}

const inputVariants = {
  default: "border-input bg-transparent",
  filled: "border-input bg-muted/50",
  outline: "border-2 border-input bg-transparent",
}

const inputSizes = {
  sm: "h-8 px-2 py-1 text-sm",
  default: "h-9 px-3 py-1",
  lg: "h-10 px-4 py-2",
}

const AriaInput = React.forwardRef<HTMLInputElement, AriaInputProps>(
  (
    {
      className,
      error,
      description,
      showErrorInline = true,
      errorId: externalErrorId,
      descriptionId: externalDescriptionId,
      size = "default",
      variant = "default",
      label,
      isRequired,
      isDisabled,
      isReadOnly,
      ...props
    },
    forwardedRef
  ) => {
    const ref = React.useRef<HTMLInputElement>(null)
    const inputRef = forwardedRef || ref

    // Generate unique IDs for accessibility
    const labelId = React.useMemo(() => createAriaId("input-label"), [])
    const errorId = React.useMemo(() => externalErrorId || createAriaId("input-error"), [externalErrorId])
    const descriptionId = React.useMemo(() => externalDescriptionId || createAriaId("input-description"), [externalDescriptionId])

    // React-ARIA text field hook
    const { labelProps, inputProps, descriptionProps, errorMessageProps } = useTextField(
      {
        ...props,
        label,
        isRequired,
        isDisabled,
        isReadOnly,
        errorMessage: error,
        description,
        validationState: error ? "invalid" : "valid",
      },
      inputRef as React.RefObject<HTMLInputElement>
    )

    // Focus ring hook
    const { isFocusVisible, focusProps } = useFocusRing()

    // Merge props
    const mergedInputProps = mergeProps(inputProps, focusProps)

    // Create validation ARIA props
    const validationProps = createValidationAriaProps(error, description, errorId, descriptionId)

    // Dynamic classes
    const inputClasses = cn(
      // Base styles
      "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
      "flex w-full min-w-0 rounded-md border text-base shadow-xs transition-[color,box-shadow] outline-none",
      "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
      "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
      "md:text-sm",
      
      // Variant styles
      inputVariants[variant],
      
      // Size styles
      inputSizes[size],
      
      // State styles
      {
        // Focus styles
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]": isFocusVisible,
        // Error styles
        "border-destructive ring-destructive/20 dark:ring-destructive/40": error,
        // Dark mode
        "dark:bg-input/30": variant === "default",
      },
      
      className
    )

    const labelClasses = cn(
      "text-sm font-medium leading-none",
      {
        "text-destructive": error,
        "after:content-['*'] after:ml-0.5 after:text-destructive": isRequired,
      }
    )

    const errorClasses = cn(
      "text-sm text-destructive mt-1",
      {
        "sr-only": !showErrorInline,
      }
    )

    const descriptionClasses = cn(
      "text-sm text-muted-foreground mt-1"
    )

    return (
      <div className="space-y-2">
        {label && (
          <label
            {...labelProps}
            id={labelId}
            className={labelClasses}
          >
            {label}
          </label>
        )}
        
        <input
          ref={inputRef}
          data-slot="input"
          className={inputClasses}
          {...mergedInputProps}
          {...validationProps}
          aria-labelledby={label ? labelId : undefined}
        />
        
        {description && (
          <div
            {...descriptionProps}
            id={descriptionId}
            className={descriptionClasses}
          >
            {description}
          </div>
        )}
        
        {error && (
          <div
            {...errorMessageProps}
            id={errorId}
            className={errorClasses}
            role="alert"
            aria-live="polite"
          >
            {error}
          </div>
        )}
      </div>
    )
  }
)

AriaInput.displayName = "AriaInput"

/**
 * Simple input component without label wrapper (for use in forms with external labels)
 */
const AriaInputField = React.forwardRef<HTMLInputElement, Omit<AriaInputProps, 'label'>>(
  (
    {
      className,
      error,
      description,
      errorId: externalErrorId,
      descriptionId: externalDescriptionId,
      size = "default",
      variant = "default",
      isDisabled,
      isReadOnly,
      ...props
    },
    forwardedRef
  ) => {
    const ref = React.useRef<HTMLInputElement>(null)
    const inputRef = forwardedRef || ref

    // Generate unique IDs for accessibility
    const errorId = React.useMemo(() => externalErrorId || createAriaId("input-error"), [externalErrorId])
    const descriptionId = React.useMemo(() => externalDescriptionId || createAriaId("input-description"), [externalDescriptionId])

    // React-ARIA text field hook (without label)
    const { inputProps } = useTextField(
      {
        ...props,
        isDisabled,
        isReadOnly,
        errorMessage: error,
        description,
        validationState: error ? "invalid" : "valid",
      },
      inputRef as React.RefObject<HTMLInputElement>
    )

    // Focus ring hook
    const { isFocusVisible, focusProps } = useFocusRing()

    // Merge props
    const mergedInputProps = mergeProps(inputProps, focusProps)

    // Create validation ARIA props
    const validationProps = createValidationAriaProps(error, description, errorId, descriptionId)

    // Dynamic classes (same as AriaInput)
    const inputClasses = cn(
      "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
      "flex w-full min-w-0 rounded-md border text-base shadow-xs transition-[color,box-shadow] outline-none",
      "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
      "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
      "md:text-sm",
      inputVariants[variant],
      inputSizes[size],
      {
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]": isFocusVisible,
        "border-destructive ring-destructive/20 dark:ring-destructive/40": error,
        "dark:bg-input/30": variant === "default",
      },
      className
    )

    return (
      <input
        ref={inputRef}
        data-slot="input"
        className={inputClasses}
        {...mergedInputProps}
        {...validationProps}
      />
    )
  }
)

AriaInputField.displayName = "AriaInputField"

export { AriaInput, AriaInputField }
export type { AriaInputProps }
