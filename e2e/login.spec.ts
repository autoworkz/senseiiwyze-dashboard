import { test, expect } from '@playwright/test'
import { emailSchema, passwordSchema } from '@/utils/validationSchema'

// Demo-credential matrix (email → expected redirect)
const demoCases = [
  { email: 'learner@demo.com', redirect: '/me' },
  { email: 'admin@demo.com',   redirect: '/team' },
  { email: 'executive@demo.com', redirect: '/org' },
] as const

for (const { email, redirect } of demoCases) {
  test(`logs in as ${email} and lands on ${redirect}`, async ({ page }) => {
    await page.goto('/login')

    await page.fill('input[id="email"]', email)
    await page.fill('input[id="password"]', 'Demo@123456710')
    await page.click('button:has-text("Sign In")')

    await page.waitForURL(redirect, { timeout: 5_000 })
    await expect(page).toHaveURL(new RegExp(`${redirect}$`))
  })
} 