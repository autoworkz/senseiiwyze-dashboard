import * as React from "react"
import { useCheckbox } from "@react-aria/checkbox"
import { useFocusRing } from "@react-aria/focus"
import { useToggleState } from "@react-stately/toggle"
import { mergeProps } from "@react-aria/utils"
import { AriaCheckboxProps } from "@react-types/checkbox"
import { Check, Minus } from "lucide-react"

import { cn } from "@/lib/utils"
import { createAriaId, createValidationAriaProps } from "@/lib/aria-utils"

export interface AriaCheckboxProps extends AriaCheckboxProps {
  className?: string
  /**
   * Error message to display
   */
  error?: string
  /**
   * Helper text to display
   */
  description?: string
  /**
   * Size variant
   */
  size?: "sm" | "default" | "lg"
  /**
   * Custom error message ID
   */
  errorId?: string
  /**
   * Custom description ID
   */
  descriptionId?: string
}

const checkboxSizes = {
  sm: "h-3 w-3",
  default: "h-4 w-4",
  lg: "h-5 w-5",
}

const iconSizes = {
  sm: "h-2.5 w-2.5",
  default: "h-3 w-3",
  lg: "h-4 w-4",
}

const AriaCheckbox = React.forwardRef<HTMLInputElement, AriaCheckboxProps>(
  (
    {
      className,
      children,
      error,
      description,
      size = "default",
      errorId: externalErrorId,
      descriptionId: externalDescriptionId,
      isSelected,
      defaultSelected,
      onChange,
      ...props
    },
    forwardedRef
  ) => {
    const ref = React.useRef<HTMLInputElement>(null)
    const inputRef = forwardedRef || ref

    // Generate unique IDs
    const labelId = React.useMemo(() => createAriaId("checkbox-label"), [])
    const errorId = React.useMemo(() => externalErrorId || createAriaId("checkbox-error"), [externalErrorId])
    const descriptionId = React.useMemo(() => externalDescriptionId || createAriaId("checkbox-description"), [externalDescriptionId])

    // State management
    const state = useToggleState({
      isSelected,
      defaultSelected,
      onChange,
    })

    // React-ARIA checkbox hook
    const { inputProps } = useCheckbox(
      {
        ...props,
        children,
        isSelected: state.isSelected,
        onChange: state.toggle,
        validationState: error ? "invalid" : "valid",
      },
      state,
      inputRef as React.RefObject<HTMLInputElement>
    )

    // Focus ring hook
    const { isFocusVisible, focusProps } = useFocusRing()

    // Merge props
    const mergedInputProps = mergeProps(inputProps, focusProps)

    // Create validation ARIA props
    const validationProps = createValidationAriaProps(error, description, errorId, descriptionId)

    // Dynamic classes
    const checkboxClasses = cn(
      // Base styles
      "peer shrink-0 rounded-sm border border-primary shadow-xs",
      "focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      "data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground",
      
      // Size styles
      checkboxSizes[size],
      
      // State styles
      {
        // Focus styles
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2": isFocusVisible,
        // Error styles
        "border-destructive ring-destructive/20": error,
      },
      
      className
    )

    const labelClasses = cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      {
        "text-destructive": error,
      }
    )

    const errorClasses = "text-sm text-destructive mt-1"
    const descriptionClasses = "text-sm text-muted-foreground mt-1"

    // Determine checkbox state for styling
    const isIndeterminate = state.isSelected === "indeterminate"
    const isChecked = state.isSelected === true

    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <input
              ref={inputRef}
              className="sr-only"
              {...mergedInputProps}
              {...validationProps}
              aria-labelledby={children ? labelId : undefined}
            />
            
            <div
              className={checkboxClasses}
              data-state={isIndeterminate ? "indeterminate" : isChecked ? "checked" : "unchecked"}
              role="presentation"
            >
              {isChecked && (
                <Check 
                  className={cn("text-current", iconSizes[size])}
                  aria-hidden="true"
                />
              )}
              {isIndeterminate && (
                <Minus 
                  className={cn("text-current", iconSizes[size])}
                  aria-hidden="true"
                />
              )}
            </div>
          </div>
          
          {children && (
            <label
              id={labelId}
              className={labelClasses}
              onClick={() => state.toggle()}
            >
              {children}
            </label>
          )}
        </div>
        
        {description && (
          <div
            id={descriptionId}
            className={descriptionClasses}
          >
            {description}
          </div>
        )}
        
        {error && (
          <div
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

AriaCheckbox.displayName = "AriaCheckbox"

export { AriaCheckbox }
export type { AriaCheckboxProps }
