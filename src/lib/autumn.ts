import { Autumn } from 'autumn-js';

/**
 * Autumn Billing Integration Configuration
 * 
 * IMPORTANT NOTES:
 * 1. This configuration is based on the autumn-js SDK structure
 * 2. Autumn uses product_id (not price_id like Stripe) for checkout sessions
 * 3. The Result type handling assumes the SDK returns objects with 'data' and 'error' properties
 * 4. You may need to adjust property names based on the actual response structure
 * 
 * SETUP REQUIRED:
 * 1. Create products in your Autumn dashboard (not price plans)
 * 2. Copy the product IDs (not price IDs) from your Autumn dashboard
 * 3. Add these product IDs to your environment variables
 * 4. Test with real API calls to confirm property names
 * 5. Update environment variables with your actual Autumn credentials
 * 
 * HOW TO GET PRODUCT IDs:
 * 1. Go to your Autumn dashboard
 * 2. Navigate to Products section
 * 3. Create products for each plan (Starter, Professional, Enterprise)
 * 4. Copy the Product ID (not Price ID) for each product
 * 5. Add them to your .env.local file as AUTUMN_*_PRODUCT_ID
 */

// Initialize Autumn client
export const autumn = new Autumn({
  secretKey: process.env.AUTUMN_API_KEY!,
  // Let Autumn SDK use default URLs based on the API key
});

// Plan configurations that match your current plans
export const AUTUMN_PLANS = {
  starter: {
    id: 'starter',
    name: 'Starter',
    productId: process.env.AUTUMN_STARTER_PRODUCT_ID!, // You'll get this from Autumn dashboard
    amount: 2900, // $29.00 in cents
    interval: 'month',
    userLimit: 25,
  },
  professional: {
    id: 'professional', 
    name: 'Professional',
    productId: process.env.AUTUMN_PROFESSIONAL_PRODUCT_ID!, // You'll get this from Autumn dashboard
    amount: 5900, // $59.00 in cents
    interval: 'month',
    userLimit: 100,
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise', 
    productId: process.env.AUTUMN_ENTERPRISE_PRODUCT_ID!, // You'll get this from Autumn dashboard
    amount: 10000, // Custom pricing
    interval: 'month',
    userLimit: null, // Unlimited
  },
} as const;

export type PlanId = keyof typeof AUTUMN_PLANS;

// Types for Autumn integration
export interface AutumnCustomer {
  id: string;
  email: string;
  name: string;
  companyName?: string;
  metadata?: Record<string, any>;
}

export interface AutumnSubscription {
  id: string;
  customerId: string;
  planId: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid';
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

// Helper functions for Autumn operations
export const autumnHelpers = {
  async createCustomer(data: {
    email: string;
    name: string;
    companyName: string;
    employeeCount: string;
  }): Promise<AutumnCustomer> {
    try {
      const customerResult = await autumn.customers.create({
        email: data.email,
        name: data.name,
        metadata: {
          companyName: data.companyName,
          employeeCount: data.employeeCount,
          source: 'onboarding',
          createdAt: new Date().toISOString(),
        },
      });
      
      // Handle Autumn Result type - check if it has data property
      if ('data' in customerResult && customerResult.data) {
        const customer = customerResult.data;
        return {
          id: customer.id || '',
          email: customer.email || data.email,
          name: customer.name || data.name,
          companyName: data.companyName,
          metadata: customer.metadata,
        };
      } else {
        const error = 'error' in customerResult ? customerResult.error : null;
        throw new Error(error?.message || 'Failed to create customer');
      }
    } catch (error) {
      console.error('Error creating Autumn customer:', error);
      throw new Error('Failed to create customer');
    }
  },

  async createSubscription(customerId: string, planId: PlanId): Promise<AutumnSubscription> {
    try {
      const plan = AUTUMN_PLANS[planId];
      
      if (planId === 'enterprise') {
        // For enterprise plans, we don't create a subscription immediately
        // Instead, we mark the customer for sales follow-up
        throw new Error('Enterprise plans require sales contact');
      }

      // Note: This is a simplified approach - Autumn may handle subscriptions through checkout
      // You may need to adjust this based on your actual Autumn setup
      throw new Error('Direct subscription creation not implemented - use checkout flow');
    } catch (error) {
      console.error('Error creating Autumn subscription:', error);
      throw new Error('Failed to create subscription');
    }
  },

  async createCheckoutSession(data: {
    customerId: string;
    planId: PlanId;
    successUrl: string;
    cancelUrl: string;
  }) {
    try {
      const plan = AUTUMN_PLANS[data.planId];
      
      const sessionResult = await autumn.checkout({
        customer_id: data.customerId,
        product_id: plan.productId,
        success_url: data.successUrl,
        customer_data: {
          email: '', // Will be filled from customer record
        },
        checkout_session_params: {
          mode: 'subscription',
          cancel_url: data.cancelUrl,
          metadata: {
            planId: data.planId,
            planName: plan.name,
          },
        },
      });

      // Handle Autumn Result type - check if it has data property
      if ('data' in sessionResult && sessionResult.data) {
        const session = sessionResult.data;
        // Use available properties from CheckoutResult
        return {
          id: String(Math.random()), // Temporary ID until we can access the real one
          url: session.url || '',
          customer: data.customerId,
          metadata: {
            planId: data.planId,
            planName: plan.name,
          },
        };
      } else {
        const error = 'error' in sessionResult ? sessionResult.error : null;
        throw new Error(error?.message || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error creating Autumn checkout session:', error);
      throw new Error('Failed to create checkout session');
    }
  },

  async getCustomer(customerId: string): Promise<AutumnCustomer> {
    try {
      const customerResult = await autumn.customers.get(customerId);
      
      // Handle Autumn Result type - check if it has data property
      if ('data' in customerResult && customerResult.data) {
        const customer = customerResult.data;
        return {
          id: customer.id || '',
          email: customer.email || '',
          name: customer.name || '',
          companyName: customer.metadata?.companyName,
          metadata: customer.metadata,
        };
      } else {
        const error = 'error' in customerResult ? customerResult.error : null;
        throw new Error(error?.message || 'Failed to retrieve customer');
      }
    } catch (error) {
      console.error('Error retrieving Autumn customer:', error);
      throw new Error('Failed to retrieve customer');
    }
  },

  async getSubscription(subscriptionId: string): Promise<AutumnSubscription> {
    try {
      // Note: This may need to be adjusted based on actual Autumn API
      // For now, we'll return a placeholder implementation
      throw new Error('Subscription retrieval not implemented - check Autumn API documentation');
    } catch (error) {
      console.error('Error retrieving Autumn subscription:', error);
      throw new Error('Failed to retrieve subscription');
    }
  },

  getPlanDetails(planId: PlanId) {
    return AUTUMN_PLANS[planId];
  },
};
