import React, { AriaAttributes } from 'react'
import { cn } from './utils'

/**
 * Utility functions for React-ARIA integration
 */

/**
 * Merges ARIA attributes with existing props, handling conflicts gracefully
 */
export function mergeAriaProps<T extends Record<string, any>>(
  baseProps: T,
  ariaProps: AriaAttributes & Record<string, any>
): T & AriaAttributes {
  return {
    ...baseProps,
    ...ariaProps,
    className: cn(baseProps.className, ariaProps.className),
  }
}

/**
 * Creates a unique ID for accessibility purposes
 */
export function createAriaId(prefix: string = 'aria'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Combines multiple ARIA describedby values
 */
export function combineAriaDescribedBy(...ids: (string | undefined)[]): string | undefined {
  const validIds = ids.filter(Boolean)
  return validIds.length > 0 ? validIds.join(' ') : undefined
}

/**
 * Combines multiple ARIA labelledby values
 */
export function combineAriaLabelledBy(...ids: (string | undefined)[]): string | undefined {
  const validIds = ids.filter(Boolean)
  return validIds.length > 0 ? validIds.join(' ') : undefined
}

/**
 * Creates ARIA attributes for form validation states
 */
export function createValidationAriaProps(
  error?: string,
  description?: string,
  errorId?: string,
  descriptionId?: string
) {
  const describedBy = combineAriaDescribedBy(
    error ? errorId : undefined,
    description ? descriptionId : undefined
  )

  return {
    'aria-invalid': error ? 'true' : 'false',
    'aria-describedby': describedBy,
  } as const
}

/**
 * Focus management utilities
 */
export const focusUtils = {
  /**
   * Focuses the first focusable element within a container
   */
  focusFirst: (container: HTMLElement): boolean => {
    const focusable = container.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (focusable) {
      focusable.focus()
      return true
    }
    return false
  },

  /**
   * Focuses the last focusable element within a container
   */
  focusLast: (container: HTMLElement): boolean => {
    const focusable = Array.from(
      container.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    )
    const last = focusable[focusable.length - 1]
    if (last) {
      last.focus()
      return true
    }
    return false
  },

  /**
   * Traps focus within a container
   */
  trapFocus: (container: HTMLElement, event: KeyboardEvent): void => {
    if (event.key !== 'Tab') return

    const focusable = Array.from(
      container.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    )

    if (focusable.length === 0) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (event.shiftKey) {
      if (document.activeElement === first) {
        event.preventDefault()
        last.focus()
      }
    } else {
      if (document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
  },
}

/**
 * Keyboard navigation utilities
 */
export const keyboardUtils = {
  /**
   * Standard keyboard event handlers
   */
  isEnterOrSpace: (event: KeyboardEvent): boolean => {
    return event.key === 'Enter' || event.key === ' '
  },

  isEscape: (event: KeyboardEvent): boolean => {
    return event.key === 'Escape'
  },

  isArrowKey: (event: KeyboardEvent): boolean => {
    return ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)
  },

  /**
   * Prevents default behavior for specific keys
   */
  preventDefaultForKeys: (event: KeyboardEvent, keys: string[]): void => {
    if (keys.includes(event.key)) {
      event.preventDefault()
    }
  },
}

/**
 * Screen reader utilities
 */
export const screenReaderUtils = {
  /**
   * Creates a live region announcement
   */
  announce: (message: string, priority: 'polite' | 'assertive' = 'polite'): void => {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', priority)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message

    document.body.appendChild(announcement)

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  },

  /**
   * Creates screen reader only text
   */
  createSROnlyText: (text: string): React.ReactNode => {
    return React.createElement('span', { className: 'sr-only' }, text)
  },
}

/**
 * Common ARIA patterns
 */
export const ariaPatterns = {
  /**
   * Button that controls another element
   */
  expandButton: (expanded: boolean, controlsId: string) => ({
    'aria-expanded': expanded,
    'aria-controls': controlsId,
  }),

  /**
   * Menu button pattern
   */
  menuButton: (expanded: boolean, menuId: string) => ({
    'aria-haspopup': 'menu' as const,
    'aria-expanded': expanded,
    'aria-controls': menuId,
  }),

  /**
   * Dialog trigger pattern
   */
  dialogTrigger: (dialogId: string) => ({
    'aria-haspopup': 'dialog' as const,
    'aria-controls': dialogId,
  }),

  /**
   * Loading state pattern
   */
  loading: (isLoading: boolean, label?: string) => ({
    'aria-busy': isLoading,
    'aria-label': isLoading ? label || 'Loading...' : undefined,
  }),
}
