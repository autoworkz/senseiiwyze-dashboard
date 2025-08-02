'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { setThemeAction } from '@/lib/actions/theme-actions'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'light' | 'dark'
  isLoading: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  serverTheme?: Theme
}

export function ThemeProvider({ 
  children, 
  defaultTheme = 'system',
  serverTheme = 'system'
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(serverTheme)
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')
  const [isLoading, setIsLoading] = useState(true)

  // Resolve system theme preference
  const resolveSystemTheme = (): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  // Apply theme to document
  const applyTheme = (currentTheme: Theme) => {
    if (typeof window === 'undefined') return

    const root = window.document.documentElement
    const systemTheme = resolveSystemTheme()
    const effectiveTheme = currentTheme === 'system' ? systemTheme : currentTheme

    // Remove existing theme classes
    root.classList.remove('light', 'dark')
    root.classList.add(effectiveTheme)

    setResolvedTheme(effectiveTheme)
  }

  // Set theme with server action
  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme)
    applyTheme(newTheme)
    
    // Update server-side cookie
    try {
      await setThemeAction(newTheme)
    } catch (error) {
      console.error('Failed to save theme preference:', error)
    }
  }

  // Initialize theme on mount
  useEffect(() => {
    // Check if there's a cookie value that differs from server
    const cookieTheme = document.cookie
      .split('; ')
      .find(row => row.startsWith('theme='))
      ?.split('=')[1] as Theme

    const initialTheme = cookieTheme && ['light', 'dark', 'system'].includes(cookieTheme) 
      ? cookieTheme 
      : serverTheme

    setThemeState(initialTheme)
    applyTheme(initialTheme)
    setIsLoading(false)

    // Listen for system theme changes
    if (initialTheme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleSystemThemeChange = () => {
        if (theme === 'system') {
          applyTheme('system')
        }
      }

      mediaQuery.addEventListener('change', handleSystemThemeChange)
      return () => mediaQuery.removeEventListener('change', handleSystemThemeChange)
    }
  }, [serverTheme])

  // Update resolved theme when theme changes
  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const contextValue: ThemeContextType = {
    theme,
    setTheme,
    resolvedTheme,
    isLoading
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}