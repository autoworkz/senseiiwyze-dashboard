"use client"

import type React from "react"
import { useDebouncedTheme } from "@/hooks/use-debounced-theme"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // The theme effect is handled in the hook
  useDebouncedTheme()

  return <>{children}</>
}
