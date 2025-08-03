export interface AutumnProduct {
  id: string;
  name: string;
  description?: string;
  type: 'service' | 'physical' | 'addon';
  display?: {
    name?: string;
    description?: string;
    recommend_text?: string;
    button_text?: string;
    button_url?: string;
    everything_from?: string;
  };
  properties?: {
    interval?: 'month' | 'year' | 'one_time';
    interval_group?: 'month' | 'year';
    is_free?: boolean;
  };
  items: Array<{
    id: string;
    type: 'flat' | 'unit' | 'tier';
    display?: {
      primary_text?: string;
      secondary_text?: string;
    };
    flat?: {
      amount: number;
    };
    unit?: {
      amount: number;
      quantity?: number;
    };
  }>;
}

export const AUTUMN_PRODUCTS: AutumnProduct[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for small teams getting started with AI coaching',
    type: 'service',
    display: {
      name: 'Starter',
      description: 'For teams up to 10 people',
      button_text: 'Start Free Trial',
    },
    properties: {
      is_free: false,
      interval: 'month',
      interval_group: 'month',
    },
    items: [
      {
        id: 'starter-price',
        type: 'flat',
        display: {
          primary_text: '$299',
          secondary_text: 'per month',
        },
        flat: {
          amount: 29900, // Amount in cents
        },
      },
      {
        id: 'starter-assessments',
        type: 'unit',
        display: {
          primary_text: '50 assessments',
          secondary_text: 'per month',
        },
        unit: {
          amount: 0,
          quantity: 50,
        },
      },
      {
        id: 'starter-credits',
        type: 'unit',
        display: {
          primary_text: '1,000 AI credits',
          secondary_text: 'per month',
        },
        unit: {
          amount: 0,
          quantity: 1000,
        },
      },
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Scale your training with advanced AI features',
    type: 'service',
    display: {
      name: 'Professional',
      description: 'For growing teams',
      button_text: 'Start Free Trial',
      recommend_text: 'Most Popular',
    },
    properties: {
      interval: 'month',
      interval_group: 'month',
    },
    items: [
      {
        id: 'pro-price',
        type: 'flat',
        display: {
          primary_text: '$999',
          secondary_text: 'per month',
        },
        flat: {
          amount: 99900, // Amount in cents
        },
      },
      {
        id: 'pro-assessments',
        type: 'unit',
        display: {
          primary_text: '250 assessments',
          secondary_text: 'per month',
        },
        unit: {
          amount: 0,
          quantity: 250,
        },
      },
      {
        id: 'pro-credits',
        type: 'unit',
        display: {
          primary_text: '5,000 AI credits',
          secondary_text: 'per month',
        },
        unit: {
          amount: 0,
          quantity: 5000,
        },
      },
      {
        id: 'pro-success-fee',
        type: 'flat',
        display: {
          primary_text: '30% success fee',
          secondary_text: 'on certification passes',
        },
        flat: {
          amount: 0, // Success-based pricing handled separately
        },
      },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Custom solutions for large organizations',
    type: 'service',
    display: {
      name: 'Enterprise',
      description: 'Unlimited scale & custom features',
      button_text: 'Contact Sales',
      button_url: 'mailto:sales@senseiiwyze.com',
    },
    properties: {
      interval: 'month',
      interval_group: 'month',
    },
    items: [
      {
        id: 'enterprise-price',
        type: 'flat',
        display: {
          primary_text: 'Custom',
          secondary_text: 'pricing',
        },
        flat: {
          amount: 0, // Custom pricing
        },
      },
      {
        id: 'enterprise-assessments',
        type: 'unit',
        display: {
          primary_text: 'Unlimited',
          secondary_text: 'assessments',
        },
        unit: {
          amount: 0,
          quantity: 999999,
        },
      },
      {
        id: 'enterprise-credits',
        type: 'unit',
        display: {
          primary_text: 'Unlimited',
          secondary_text: 'AI credits',
        },
        unit: {
          amount: 0,
          quantity: 999999,
        },
      },
    ],
  },
  // Annual versions with 20% discount
  {
    id: 'starter-annual',
    name: 'Starter Annual',
    description: 'Perfect for small teams getting started with AI coaching',
    type: 'service',
    display: {
      name: 'Starter',
      description: 'For teams up to 10 people',
      button_text: 'Start Free Trial',
      everything_from: 'Save 20%',
    },
    properties: {
      interval: 'year',
      interval_group: 'year',
    },
    items: [
      {
        id: 'starter-annual-price',
        type: 'flat',
        display: {
          primary_text: '$2,388',
          secondary_text: 'per year',
        },
        flat: {
          amount: 238800, // Amount in cents (20% off monthly)
        },
      },
      {
        id: 'starter-annual-assessments',
        type: 'unit',
        display: {
          primary_text: '600 assessments',
          secondary_text: 'per year',
        },
        unit: {
          amount: 0,
          quantity: 600,
        },
      },
      {
        id: 'starter-annual-credits',
        type: 'unit',
        display: {
          primary_text: '12,000 AI credits',
          secondary_text: 'per year',
        },
        unit: {
          amount: 0,
          quantity: 12000,
        },
      },
    ],
  },
  {
    id: 'professional-annual',
    name: 'Professional Annual',
    description: 'Scale your training with advanced AI features',
    type: 'service',
    display: {
      name: 'Professional',
      description: 'For growing teams',
      button_text: 'Start Free Trial',
      recommend_text: 'Best Value',
      everything_from: 'Save 20%',
    },
    properties: {
      interval: 'year',
      interval_group: 'year',
    },
    items: [
      {
        id: 'pro-annual-price',
        type: 'flat',
        display: {
          primary_text: '$7,992',
          secondary_text: 'per year',
        },
        flat: {
          amount: 799200, // Amount in cents (20% off monthly)
        },
      },
      {
        id: 'pro-annual-assessments',
        type: 'unit',
        display: {
          primary_text: '3,000 assessments',
          secondary_text: 'per year',
        },
        unit: {
          amount: 0,
          quantity: 3000,
        },
      },
      {
        id: 'pro-annual-credits',
        type: 'unit',
        display: {
          primary_text: '60,000 AI credits',
          secondary_text: 'per year',
        },
        unit: {
          amount: 0,
          quantity: 60000,
        },
      },
      {
        id: 'pro-annual-success-fee',
        type: 'flat',
        display: {
          primary_text: '30% success fee',
          secondary_text: 'on certification passes',
        },
        flat: {
          amount: 0, // Success-based pricing handled separately
        },
      },
    ],
  },
];

export const AUTUMN_ADDONS: AutumnProduct[] = [
  {
    id: 'extra-assessments',
    name: 'Extra Assessments',
    description: 'Additional assessments when you need more',
    type: 'addon',
    display: {
      name: 'Extra Assessments',
      description: 'Add more assessments to your plan',
      button_text: 'Add to Plan',
    },
    properties: {
      interval: 'one_time',
    },
    items: [
      {
        id: 'extra-assessments-pack',
        type: 'unit',
        display: {
          primary_text: '$5',
          secondary_text: 'per assessment',
        },
        unit: {
          amount: 500, // $5 per assessment in cents
          quantity: 10, // Minimum pack of 10
        },
      },
    ],
  },
  {
    id: 'extra-credits',
    name: 'Extra AI Credits',
    description: 'Additional AI credits for coaching and insights',
    type: 'addon',
    display: {
      name: 'Extra AI Credits',
      description: 'Add more AI credits to your plan',
      button_text: 'Add to Plan',
    },
    properties: {
      interval: 'one_time',
    },
    items: [
      {
        id: 'extra-credits-pack',
        type: 'unit',
        display: {
          primary_text: '$50',
          secondary_text: 'per 1,000 credits',
        },
        unit: {
          amount: 5000, // $50 per 1000 credits in cents
          quantity: 1000, // Pack of 1000
        },
      },
    ],
  },
];