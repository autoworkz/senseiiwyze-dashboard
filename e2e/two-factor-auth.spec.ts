import { test } from '@playwright/test'

// Skipped until 2FA UI/API is ready
test.skip('prompts for and validates 2-factor authentication', async ({ page }) => {
  /* Planned steps:
     1. Log in with a 2FA-enabled account
     2. Await OTP prompt, enter code (use otplib to generate)
     3. Expect successful redirect
  */
})
