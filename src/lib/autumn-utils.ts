/**
 * Autumn Integration Utilities
 * 
 * Helper functions for working with Autumn billing in the frontend
 */

export interface AutumnSubscriptionStatus {
  hasActiveSubscription: boolean;
  planId?: string;
  planName?: string;
  status?: 'active' | 'canceled' | 'past_due' | 'unpaid';
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
}

/**
 * Check if user has an active Autumn subscription
 */
export async function checkAutumnSubscription(): Promise<AutumnSubscriptionStatus> {
  try {
    const response = await fetch('/api/subscription/status');
    
    if (!response.ok) {
      return { hasActiveSubscription: false };
    }
    
    const data = await response.json();
    return {
      hasActiveSubscription: data.active || false,
      planId: data.planId,
      planName: data.planName,
      status: data.status,
      currentPeriodEnd: data.currentPeriodEnd,
      cancelAtPeriodEnd: data.cancelAtPeriodEnd,
    };
  } catch (error) {
    console.error('Error checking Autumn subscription:', error);
    return { hasActiveSubscription: false };
  }
}

/**
 * Get Autumn checkout URL for a specific plan
 */
export async function createAutumnCheckout(planId: string, metadata?: Record<string, any>): Promise<string> {
  const response = await fetch('/api/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Include credentials for authentication
    },
    credentials: 'include', // Important: Include cookies for Better Auth
    body: JSON.stringify({
      planId: planId,
      metadata,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create checkout session');
  }

  const result = await response.json();
  
  if (result.type !== 'checkout' || !result.checkoutUrl) {
    throw new Error('Invalid checkout response');
  }

  return result.checkoutUrl;
}

/**
 * Verify payment completion after redirect from Autumn
 */
export async function verifyAutumnPayment(sessionId: string) {
  const response = await fetch(`/api/verify-payment?session_id=${sessionId}`);
  
  if (!response.ok) {
    throw new Error('Failed to verify payment');
  }

  return response.json();
}

/**
 * Format plan pricing for display
 */
export function formatAutumnPrice(amount: number | null, interval: 'month' | 'year' = 'month'): string {
  if (amount === null) return 'Custom';
  
  const price = (amount / 100).toFixed(0);
  return `$${price}/${interval}`;
}

/**
 * Get plan features based on plan ID
 */
export function getAutumnPlanFeatures(planId: string): string[] {
  const features = {
    starter: [
      'Up to 25 users',
      'Basic skill assessments',
      'Standard AI coaching',
      'Email support',
      'Basic analytics',
      'Mobile app access'
    ],
    professional: [
      'Up to 100 users',
      'Advanced skill assessments',
      'Premium AI coaching',
      'Priority support',
      'Advanced analytics & reporting',
      'Custom learning paths',
      'API access',
      'Team collaboration tools'
    ],
    enterprise: [
      'Unlimited users',
      'Custom skill frameworks',
      'Dedicated AI coaching',
      '24/7 dedicated support',
      'Enterprise analytics',
      'Custom integrations',
      'White-label options',
      'On-premise deployment',
      'Success guarantee'
    ]
  };

  return features[planId as keyof typeof features] || [];
}

/**
 * Check if user can upgrade/downgrade between plans
 */
export function canChangePlan(currentPlan: string, targetPlan: string): boolean {
  const planHierarchy = ['starter', 'professional', 'enterprise'];
  const currentIndex = planHierarchy.indexOf(currentPlan);
  const targetIndex = planHierarchy.indexOf(targetPlan);
  
  // Can always upgrade or move to enterprise
  return targetIndex > currentIndex || targetPlan === 'enterprise';
}
