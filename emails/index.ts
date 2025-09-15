// Core authentication emails
export { PasswordResetEmail } from './password-reset';
export { LoginCodeEmail } from './login-code';
export { VerifyEmail } from './verify-email';
export { MagicLinkEmail } from './magic-link';

// Account management emails  
export { WelcomeEmail } from './welcome-email';
export { NewDeviceEmail } from './new-device';
export { SecurityAlertEmail } from './security-alert';
export { OrganizationInviteEmail } from './organization-invite';
export { OrganizationMagicLinkEmail } from './organization-magic-link';

// React Email examples (for reference)
export { default as NotionMagicLinkEmail } from './notion-magic-link';
export { default as PlaidVerifyIdentityEmail } from './plaid-verify-identity';
export { default as StripeWelcomeEmail } from './stripe-welcome';
export { default as VercelInviteUserEmail } from './vercel-invite-user';