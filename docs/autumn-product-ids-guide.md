# How to Get Autumn Product IDs

Autumn uses **Product IDs** (not Price IDs like Stripe) for creating checkout sessions. Here's how to get them:

## Step 1: Access Autumn Dashboard
1. Go to [https://useautumn.com/](https://useautumn.com/)
2. Sign up or log in to your account
3. Complete the onboarding process

## Step 2: Create Products
1. Navigate to the **Products** section in your Autumn dashboard
2. Create a new product for each subscription plan:

### Starter Product
- **Product Name**: "Starter Plan"
- **Description**: "Perfect for small teams up to 25 users"
- **Price**: $29/month
- **Billing**: Monthly recurring

### Professional Product  
- **Product Name**: "Professional Plan"
- **Description**: "Ideal for growing teams up to 100 users"
- **Price**: $59/month
- **Billing**: Monthly recurring

### Enterprise Product
- **Product Name**: "Enterprise Plan" 
- **Description**: "Custom solution for large organizations"
- **Price**: Custom (contact sales)
- **Billing**: Monthly recurring

## Step 3: Copy Product IDs
After creating each product, Autumn will generate unique **Product IDs**. These typically look like:
- `prod_abc123def456`
- `product_1234567890`
- Or similar format

**Important**: Copy the **Product ID**, not any pricing or plan ID.

## Step 4: Update Environment Variables
Add the Product IDs to your `.env.local` file:

```bash
# Autumn API Configuration
AUTUMN_API_KEY=sk_live_or_test_your_actual_key_here
AUTUMN_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Autumn Product IDs (from your dashboard)
AUTUMN_STARTER_PRODUCT_ID=prod_your_starter_product_id
AUTUMN_PROFESSIONAL_PRODUCT_ID=prod_your_professional_product_id
AUTUMN_ENTERPRISE_PRODUCT_ID=prod_your_enterprise_product_id

# Your application URL
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## Step 5: Test Integration
1. Restart your development server
2. Go through the onboarding flow
3. Try selecting the Starter plan
4. Verify the checkout session creates successfully

## Common Issues
- **Product not found**: Make sure you're using the Product ID, not a Price ID
- **API key issues**: Ensure your API key matches the environment (test/live) of your products
- **Permissions**: Verify your API key has permissions to create checkout sessions

## Need Help?
- Check Autumn's documentation: [Autumn Docs](https://docs.useautumn.com/)
- Contact Autumn support if you can't find the Product IDs in your dashboard
- Test with their sandbox environment first before going live
