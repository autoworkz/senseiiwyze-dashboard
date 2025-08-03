import { Product } from 'autumn-js';

export interface PricingFeature {
  name: string;
  starter: string | boolean;
  professional: string | boolean;
  enterprise: string | boolean;
}

export const PRICING_FEATURES: PricingFeature[] = [
  {
    name: 'Readiness Index Assessment',
    starter: true,
    professional: true,
    enterprise: true,
  },
  {
    name: 'AI Coaching',
    starter: 'Basic',
    professional: 'Advanced',
    enterprise: 'Custom AI Models',
  },
  {
    name: 'Learning Path Generation',
    starter: true,
    professional: true,
    enterprise: true,
  },
  {
    name: 'Team Analytics',
    starter: 'Basic Reports',
    professional: 'Advanced Analytics',
    enterprise: 'Custom Dashboards',
  },
  {
    name: 'Success Guarantee',
    starter: false,
    professional: true,
    enterprise: true,
  },
  {
    name: 'API Access',
    starter: false,
    professional: 'Limited',
    enterprise: 'Unlimited',
  },
  {
    name: 'Integrations',
    starter: 'Basic',
    professional: 'All Standard',
    enterprise: 'Custom + Priority',
  },
  {
    name: 'Support',
    starter: 'Email',
    professional: 'Priority Email',
    enterprise: 'Dedicated CSM',
  },
  {
    name: 'Training',
    starter: 'Self-Service',
    professional: 'Group Sessions',
    enterprise: 'Custom Onboarding',
  },
  {
    name: 'SLA',
    starter: false,
    professional: '99.5%',
    enterprise: '99.9%',
  },
];

export function getPricingTableContent(products: Product[]) {
  // Helper function to get features for a specific product
  const getProductFeatures = (productId: string) => {
    return PRICING_FEATURES.map(feature => {
      const value = feature[productId as keyof PricingFeature];
      return {
        name: feature.name,
        included: value !== false,
        description: typeof value === 'string' ? value : undefined,
      };
    });
  };

  return {
    features: PRICING_FEATURES,
    getProductFeatures,
  };
}