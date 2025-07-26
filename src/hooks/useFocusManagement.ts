import { useRef, useEffect, useCallback } from 'react'
import { useFocusManager } from '@react-aria/focus'
import { focusUtils } from '@/lib/aria-utils'

/**
 * Hook for managing focus within a container
 */
export function useContainerFocus() {
  const containerRef = useRef<HTMLElement>(null)
  const focusManager = useFocusManager()

  const focusFirst = useCallback(() => {
    if (containerRef.current) {
      return focusUtils.focusFirst(containerRef.current)
    }
    return false
  }, [])

  const focusLast = useCallback(() => {
    if (containerRef.current) {
      return focusUtils.focusLast(containerRef.current)
    }
    return false
  }, [])

  const focusNext = useCallback(() => {
    focusManager?.focusNext()
  }, [focusManager])

  const focusPrevious = useCallback(() => {
    focusManager?.focusPrevious()
  }, [focusManager])

  return {
    containerRef,
    focusFirst,
    focusLast,
    focusNext,
    focusPrevious,
  }
}

/**
 * Hook for focus restoration after modal/dialog closes
 */
export function useFocusRestore() {
  const restoreElementRef = useRef<HTMLElement | null>(null)

  const saveFocus = useCallback(() => {
    restoreElementRef.current = document.activeElement as HTMLElement
  }, [])

  const restoreFocus = useCallback(() => {
    if (restoreElementRef.current && typeof restoreElementRef.current.focus === 'function') {
      // Use setTimeout to ensure the element is available in the DOM
      setTimeout(() => {
        restoreElementRef.current?.focus()
      }, 0)
    }
  }, [])

  return {
    saveFocus,
    restoreFocus,
  }
}

/**
 * Hook for focus trapping within a container
 */
export function useFocusTrap(isActive: boolean = true) {
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const container = containerRef.current
    
    const handleKeyDown = (event: KeyboardEvent) => {
      focusUtils.trapFocus(container, event)
    }

    // Focus the first element when trap becomes active
    focusUtils.focusFirst(container)

    container.addEventListener('keydown', handleKeyDown)

    return () => {
      container.removeEventListener('keydown', handleKeyDown)
    }
  }, [isActive])

  return containerRef
}

/**
 * Hook for managing focus in modal dialogs
 */
export function useModalFocus(isOpen: boolean) {
  const { saveFocus, restoreFocus } = useFocusRestore()
  const trapRef = useFocusTrap(isOpen)

  useEffect(() => {
    if (isOpen) {
      saveFocus()
    } else {
      restoreFocus()
    }
  }, [isOpen, saveFocus, restoreFocus])

  return trapRef
}

/**
 * Hook for managing focus in dropdown menus
 */
export function useMenuFocus(isOpen: boolean) {
  const { focusFirst, focusLast, focusNext, focusPrevious, containerRef } = useContainerFocus()

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isOpen) return

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        focusNext()
        break
      case 'ArrowUp':
        event.preventDefault()
        focusPrevious()
        break
      case 'Home':
        event.preventDefault()
        focusFirst()
        break
      case 'End':
        event.preventDefault()
        focusLast()
        break
    }
  }, [isOpen, focusNext, focusPrevious, focusFirst, focusLast])

  useEffect(() => {
    if (isOpen && containerRef.current) {
      // Focus first item when menu opens
      focusFirst()
    }
  }, [isOpen, focusFirst, containerRef])

  return {
    containerRef,
    handleKeyDown,
    focusFirst,
    focusLast,
    focusNext,
    focusPrevious,
  }
}

/**
 * Hook for managing focus in tab panels
 */
export function useTabFocus() {
  const tabListRef = useRef<HTMLElement>(null)
  const { focusFirst, focusLast, focusNext, focusPrevious } = useContainerFocus()

  const handleTabKeyDown = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault()
        focusNext()
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault()
        focusPrevious()
        break
      case 'Home':
        event.preventDefault()
        focusFirst()
        break
      case 'End':
        event.preventDefault()
        focusLast()
        break
    }
  }, [focusNext, focusPrevious, focusFirst, focusLast])

  return {
    tabListRef,
    handleTabKeyDown,
  }
}

/**
 * Hook for managing roving tabindex pattern
 */
export function useRovingTabIndex(items: HTMLElement[], activeIndex: number) {
  useEffect(() => {
    items.forEach((item, index) => {
      if (item) {
        item.tabIndex = index === activeIndex ? 0 : -1
      }
    })
  }, [items, activeIndex])

  const moveToIndex = useCallback((newIndex: number) => {
    const clampedIndex = Math.max(0, Math.min(newIndex, items.length - 1))
    const item = items[clampedIndex]
    if (item) {
      item.focus()
    }
    return clampedIndex
  }, [items])

  const moveNext = useCallback(() => {
    const nextIndex = activeIndex + 1 >= items.length ? 0 : activeIndex + 1
    return moveToIndex(nextIndex)
  }, [activeIndex, items.length, moveToIndex])

  const movePrevious = useCallback(() => {
    const prevIndex = activeIndex - 1 < 0 ? items.length - 1 : activeIndex - 1
    return moveToIndex(prevIndex)
  }, [activeIndex, items.length, moveToIndex])

  const moveFirst = useCallback(() => {
    return moveToIndex(0)
  }, [moveToIndex])

  const moveLast = useCallback(() => {
    return moveToIndex(items.length - 1)
  }, [items.length, moveToIndex])

  return {
    moveToIndex,
    moveNext,
    movePrevious,
    moveFirst,
    moveLast,
  }
}
