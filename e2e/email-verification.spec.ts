import { test } from '@playwright/test'

// Marked skip until full email-verification flow is implemented
test.skip('completes email-verification flow', async ({ page }) => {
  /* Planned steps:
     1. Sign up with a new email on /signup
     2. Intercept outgoing verification email to grab the link
     3. Visit the verification URL and expect success state
     4. Confirm user can now sign in normally
  */
})
