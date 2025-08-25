# Autumn Billing Integration Setup

This guide will help you set up Autumn billing integration with Stripe for your SenseiiWyze dashboard.

## Overview

Autumn (https://useautumn.com/) is a billing platform that sits on top of Stripe, providing advanced subscription management, metering, and billing features. This integration handles:

- Subscription plan management
- Stripe checkout sessions
- Webhook handling for payment events
- Customer and subscription lifecycle management

## Setup Steps

### 1. Autumn Account Setup

1. Sign up for an account at [https://useautumn.com/](https://useautumn.com/)
2. Connect your Stripe account to Autumn
3. Complete the onboarding process

### 2. Create Subscription Plans

In your Autumn dashboard, create three subscription plans:

#### Starter Plan
- **Name**: Starter
- **Price**: $29/month
- **Features**: Up to 25 users, basic features
- **Billing**: Monthly recurring

#### Professional Plan
- **Name**: Professional  
- **Price**: $59/month
- **Features**: Up to 100 users, advanced features
- **Billing**: Monthly recurring

#### Enterprise Plan
- **Name**: Enterprise
- **Price**: Custom pricing
- **Features**: Unlimited users, custom features
- **Billing**: Contact sales

### 3. Configure Environment Variables

Copy the example environment file:
```bash
cp .env.autumn.example .env.local
```

Update the following variables in your `.env.local`:

```env
# Autumn API Configuration
AUTUMN_API_KEY=your_autumn_api_key_here
AUTUMN_WEBHOOK_SECRET=your_autumn_webhook_secret_here

# Autumn Plan Price IDs (from your Autumn dashboard)
AUTUMN_STARTER_PRICE_ID=price_xxxxxxxxxxxxx
AUTUMN_PROFESSIONAL_PRICE_ID=price_xxxxxxxxxxxxx  
AUTUMN_ENTERPRISE_PRICE_ID=price_xxxxxxxxxxxxx

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Set Up Webhooks

In your Autumn dashboard:

1. Go to **Webhooks** section
2. Add a new webhook endpoint: `https://your-domain.com/api/webhooks/autumn`
3. Enable the following events:
   - `checkout.session.completed`
   - `subscription.created`
   - `subscription.updated`
   - `subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

4. Copy the webhook secret and add it to your environment variables

### 5. Install Dependencies

The `autumn-js` package is already included in your dependencies. If you need to install it manually:

```bash
pnpm add autumn-js
```

## How It Works

### 1. Plan Selection
- User selects a plan in the onboarding flow
- For Starter/Professional: Redirects to Stripe checkout via Autumn
- For Enterprise: Shows contact sales form

### 2. Payment Processing Flow
1. **Checkout Creation**: Autumn creates a Stripe checkout session
2. **Session Storage**: We store session data locally for verification
3. **User Payment**: User completes payment on Stripe
4. **Webhook Processing**: Autumn/Stripe sends webhooks to update session status
5. **Verification**: Success page verifies payment using stored session data

### 3. Payment Verification
Since Autumn's checkout doesn't have a direct retrieve method, we use a session storage approach:
- Store session data when checkout is created
- Update status via webhooks when payment completes/fails
- Verify payments by checking stored session status

### 4. Subscription Management
- Autumn provides APIs for managing subscriptions
- Handle upgrades, downgrades, cancellations
- Automatic invoice generation and payment retry

## API Routes

The integration includes several API routes:

### `/api/checkout` (POST)
Creates a checkout session for the selected plan.

**Request Body:**
```json
{
  "planId": "starter|professional|enterprise",
  "companyName": "Company Name",
  "employeeCount": "1-10"
}
```

### `/api/verify-payment` (GET)
Verifies a payment session after checkout completion.

**Query Parameters:**
- `session_id`: Stripe checkout session ID

### `/api/webhooks/autumn` (POST)
Handles webhook events from Autumn/Stripe.

## Files Created

- `src/lib/autumn.ts` - Autumn client configuration and helpers
- `src/lib/payment-session-storage.ts` - Session storage utility for payment verification
- `src/app/api/checkout/route.ts` - Checkout session creation with storage
- `src/app/api/verify-payment/route.ts` - Payment verification using stored sessions
- `src/app/api/webhooks/autumn/route.ts` - Webhook handler with session updates
- `src/app/api/debug/sessions/route.ts` - Debug endpoint for viewing stored sessions (dev only)
- `src/app/onboarding/success/page.tsx` - Payment success page
- `src/app/contact-sales/page.tsx` - Enterprise contact form
- `src/components/onboarding/steps/PaymentPlansStep.tsx` - Updated with Autumn integration

## Key Implementation Details

### Session Storage Approach
Since Autumn's checkout function doesn't have a `retrieve` method, we implemented a session storage system:

1. **Storage**: When creating checkout, we store session data in memory (replace with database in production)
2. **Webhooks**: Update session status when payments complete/fail
3. **Verification**: Check stored session status instead of calling non-existent API methods

### Error Handling
- Graceful handling of missing API methods
- Timeout handling for pending payments (10 minutes)
- Automatic cleanup of old sessions (24 hours)
- Comprehensive error messages for debugging

### Development Features
- Debug endpoint to view all stored sessions: `/api/debug/sessions`
- View specific session: `/api/debug/sessions?session_id=xxx`
- Console logging for webhook events
- In-memory storage with automatic cleanup

## Testing

### Local Development
1. Use Autumn's test mode
2. Use Stripe test credit cards
3. Test webhook delivery using tools like ngrok

### Test Credit Cards
- **Success**: 4242424242424242
- **Decline**: 4000000000000002
- **3D Secure**: 4000002500003155

## Security Considerations

1. **Environment Variables**: Never commit API keys to version control
2. **Webhook Verification**: Always verify webhook signatures
3. **Error Handling**: Implement proper error handling for failed payments
4. **Rate Limiting**: Consider rate limiting for API endpoints

## Troubleshooting

### Common Issues

1. **Invalid API Key**: Check that your Autumn API key is correct
2. **Webhook Failures**: Verify webhook URL and secret
3. **Payment Failures**: Check Stripe dashboard for error details
4. **Price ID Errors**: Ensure price IDs match your Autumn dashboard

### Logs

Check the following for debugging:
- Next.js console logs
- Autumn dashboard logs
- Stripe dashboard logs
- Browser network tab

## Next Steps

1. Set up your Autumn account and plans
2. Configure environment variables
3. Test the payment flow in development
4. Deploy to production and update webhook URLs
5. Monitor payments and subscriptions in Autumn dashboard

For more information, visit the [Autumn documentation](https://docs.useautumn.com/).
