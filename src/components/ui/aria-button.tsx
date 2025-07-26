import * as React from "react"
import { useButton } from "@react-aria/button"
import { useFocusRing } from "@react-aria/focus"
import { mergeProps } from "@react-aria/utils"
import { AriaButtonProps } from "@react-types/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const ariaButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const focusRingStyles = {
  default: "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  destructive: "focus-visible:ring-2 focus-visible:ring-destructive/50 focus-visible:ring-offset-2",
  outline: "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  secondary: "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  ghost: "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  link: "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
}

export interface CustomAriaButtonProps
  extends Omit<AriaButtonProps<'button'>, 'children'>,
    VariantProps<typeof ariaButtonVariants> {
  className?: string
  children?: React.ReactNode
  /**
   * Whether the button should render as a child element (using Slot)
   */
  asChild?: boolean
  /**
   * Loading state - shows loading indicator and disables interaction
   */
  isLoading?: boolean
  /**
   * Loading text for screen readers
   */
  loadingText?: string
  /**
   * Icon to show when loading
   */
  loadingIcon?: React.ReactNode
}

const AriaButton = React.forwardRef<HTMLButtonElement, CustomAriaButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      children,
      isLoading = false,
      loadingText = "Loading...",
      loadingIcon,
      isDisabled,
      ...props
    },
    forwardedRef
  ) => {
    const ref = React.useRef<HTMLButtonElement>(null)
    const buttonRef = forwardedRef || ref

    // Disable button when loading
    const disabled = isDisabled || isLoading

    // React-ARIA button hook
    const { buttonProps, isPressed } = useButton(
      {
        ...props,
        isDisabled: disabled,
        'aria-label': isLoading ? loadingText : props['aria-label'],
      },
      buttonRef as React.RefObject<HTMLButtonElement>
    )

    // Focus ring hook for enhanced focus management
    const { isFocusVisible, focusProps } = useFocusRing()

    // Merge all props
    const mergedProps = mergeProps(buttonProps, focusProps)

    // Dynamic classes based on state
    const stateClasses = cn(
      ariaButtonVariants({ variant, size }),
      {
        // Focus ring styles
        [focusRingStyles[variant || 'default']]: isFocusVisible,
        // Pressed state
        "scale-95": isPressed && !disabled,
        // Loading state
        "cursor-wait": isLoading,
      },
      className
    )

    const buttonContent = (
      <>
        {isLoading && (
          <>
            {loadingIcon || (
              <svg
                className="animate-spin size-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
            <span className="sr-only">{loadingText}</span>
          </>
        )}
        {children}
      </>
    )

    return (
      <button
        ref={buttonRef}
        data-slot="button"
        className={stateClasses}
        {...mergedProps}
        // Additional ARIA attributes for loading state
        aria-busy={isLoading}
        aria-live={isLoading ? "polite" : undefined}
      >
        {buttonContent}
      </button>
    )
  }
)

AriaButton.displayName = "AriaButton"

export { AriaButton, ariaButtonVariants }
export type { AriaButtonProps }
