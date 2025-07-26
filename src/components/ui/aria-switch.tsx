import * as React from "react"
import { useSwitch } from "@react-aria/switch"
import { useFocusRing } from "@react-aria/focus"
import { useToggleState } from "@react-stately/toggle"
import { mergeProps } from "@react-aria/utils"
import { AriaSwitchProps } from "@react-types/switch"

import { cn } from "@/lib/utils"
import { createAriaId, createValidationAriaProps } from "@/lib/aria-utils"

export interface AriaSwitchProps extends AriaSwitchProps {
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

const switchSizes = {
  sm: {
    root: "h-4 w-7",
    thumb: "h-3 w-3 data-[state=checked]:translate-x-3 data-[state=unchecked]:translate-x-0",
  },
  default: {
    root: "h-5 w-9",
    thumb: "h-4 w-4 data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
  },
  lg: {
    root: "h-6 w-11",
    thumb: "h-5 w-5 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
  },
}

const AriaSwitch = React.forwardRef<HTMLInputElement, AriaSwitchProps>(
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
    const labelId = React.useMemo(() => createAriaId("switch-label"), [])
    const errorId = React.useMemo(() => externalErrorId || createAriaId("switch-error"), [externalErrorId])
    const descriptionId = React.useMemo(() => externalDescriptionId || createAriaId("switch-description"), [externalDescriptionId])

    // State management
    const state = useToggleState({
      isSelected,
      defaultSelected,
      onChange,
    })

    // React-ARIA switch hook
    const { inputProps } = useSwitch(
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

    // Get size styles
    const sizeStyles = switchSizes[size]

    // Dynamic classes
    const switchClasses = cn(
      // Base styles
      "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent",
      "shadow-xs transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      
      // Size styles
      sizeStyles.root,
      
      // State styles
      {
        // Focus styles
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background": isFocusVisible,
        // Error styles
        "data-[state=checked]:bg-destructive data-[state=unchecked]:border-destructive": error,
      },
      
      className
    )

    const thumbClasses = cn(
      // Base styles
      "pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform",
      
      // Size and position styles
      sizeStyles.thumb
    )

    const labelClasses = cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      {
        "text-destructive": error,
      }
    )

    const errorClasses = "text-sm text-destructive mt-1"
    const descriptionClasses = "text-sm text-muted-foreground mt-1"

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
              className={switchClasses}
              data-state={state.isSelected ? "checked" : "unchecked"}
              role="presentation"
              onClick={() => state.toggle()}
            >
              <div
                className={thumbClasses}
                data-state={state.isSelected ? "checked" : "unchecked"}
              />
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

AriaSwitch.displayName = "AriaSwitch"

export { AriaSwitch }
export type { AriaSwitchProps }
