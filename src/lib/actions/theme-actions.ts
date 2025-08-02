'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

type Theme = 'light' | 'dark' | 'system'

const THEME_COOKIE_NAME = 'theme'
const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

export async function setThemeAction(theme: Theme) {
  const cookieStore = await cookies()
  
  cookieStore.set(THEME_COOKIE_NAME, theme, {
    maxAge: THEME_COOKIE_MAX_AGE,
    httpOnly: false, // Allow client-side access for theme switching
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  })

  // Revalidate all pages to apply new theme
  revalidatePath('/', 'layout')
  
  return { success: true, theme }
}

export async function getThemeFromCookies(): Promise<Theme> {
  const cookieStore = await cookies()
  const themeCookie = cookieStore.get(THEME_COOKIE_NAME)
  
  const theme = themeCookie?.value as Theme
  
  // Validate theme value
  if (theme && ['light', 'dark', 'system'].includes(theme)) {
    return theme
  }
  
  return 'system' // Default fallback
}