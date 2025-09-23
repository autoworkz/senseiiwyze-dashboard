# SenseiiWyze Payment System Architecture Prompt

Use this prompt to understand how payment processing is implemented in the SenseiiWyze dashboard application.

## Payment Architecture Overview

The application uses **Autumn** (a billing and subscription management platform) integrated with **Stripe** for payment processing. The payment flow is integrated into the onboarding process and supports subscription-based billing.

## Core Payment Components

### 1. Autumn Integration (`src/lib/autumn.ts`)

The app defines product configurations using Autumn's SDK:

```typescript
import { feature, product, featureItem, priceItem } from "atmn";

// Define features (usage-based billing)
export const organizationSeats = feature({
  id: "organization_seats",
  name: "Organization seats",
  type: "continuous_use",
});

// Define products with pricing and features
export const starterProduct = product({
  id: "starter_product",
  name: "Starter Product",
  items: [
    priceItem({
      price: 29,
      interval: "month",
    }),
    featureItem({
      feature_id: organizationSeats.id,
      included_usage: 5,
    }),
  ],
});
```

### 2. Payment Plans Component (`src/components/onboarding/steps/PaymentPlansStep.tsx`)

The main UI component for plan selection and checkout:

```typescript
// Uses Autumn React hooks for real-time pricing
const { products, isLoading: isProductsLoading, error: productsError } = usePricingTable();
const { checkout } = useCustomer();

// Plan selection with live pricing from Autumn
const displayPlans = useMemo(() => {
  return plans.map((p) => {
    const autumnProduct = products?.find((product: any) => p.id === product.id);
    if (!autumnProduct) return p;

    const chosen = findRecurringPrice(autumnProduct, "month");
    const priceText = formatMoney(chosen?.amount);

    return {
      ...p,
      name: autumnProduct.name ?? p.name,
      price: priceText,
      period: chosen?.interval === "year" ? "per user/year" : "per user/month",
    };
  });
}, [products]);

// Checkout process
const handleContinue = async () => {
  try {
    // Save plan to organization metadata
    await savePlan(selectedPlan);
    
    // Launch Autumn checkout dialog
    await checkout({
      productId: selectedPlan,
      dialog: CheckoutDialog,
      successUrl: `${window.location.origin}/app/onboarding/payment/success?plan=${selectedPlan}`,
    });
  } catch (e: any) {
    setError(e?.message || "Failed to update plan");
  }
};
```

### 3. Checkout API (`src/app/api/checkout/route.ts`)

Handles server-side checkout session creation:

```typescript
export async function POST(request: NextRequest) {
  // Get authenticated user session
  const session = await auth.api.getSession({ headers: await headers() });
  
  // Create/retrieve Autumn customer
  const customer = await autumnHelpers.createCustomer({
    email: session.user.email,
    name: session.user.name || 'Unknown',
    companyName: companyName || 'Unknown Company',
    employeeCount: employeeCount || 'Unknown',
  });

  // Create checkout session with Stripe via Autumn
  const checkoutSession = await autumnHelpers.createCheckoutSession({
    customerId: customer.id,
    planId: planId as PlanId,
    successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding/success?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding?step=2`,
  });

  // Store session data for verification
  paymentSessionStorage.store(checkoutSession.id, {
    customerId: customer.id,
    planId: planId as PlanId,
    status: 'pending',
    metadata: {
      companyName,
      employeeCount,
      userEmail: session.user.email,
    },
  });

  return NextResponse.json({
    type: 'checkout',
    checkoutUrl: checkoutSession.url,
    sessionId: checkoutSession.id,
  });
}
```

### 4. Plan Storage (`src/lib/api/organization.ts`)

Saves selected plan to organization metadata:

```typescript
export async function savePlan(selectedPlan: string) {
  // Get current active organization
  const { data: org, error: readErr } = await authClient.organization.getFullOrganization();
  if (readErr) throw readErr;
  if (!org?.id) throw new Error("No active organization selected");

  // Update organization metadata with selected plan
  const prev = coerceMeta(org.metadata);
  const nextMeta = { ...prev, plan: selectedPlan };

  // Save via Better Auth organization API
  const { error: updateErr } = await authClient.organization.update({
    data: { metadata: nextMeta },
    organizationId: org.id,
  });
  if (updateErr) throw updateErr;

  return { success: true, organizationId: org.id, plan: selectedPlan };
}
### 5. Payment Success Handling (`/app/onboarding/payment/success`)

Handles payment completion via redirect URL:

```typescript
// Payment success page receives session_id and plan from URL
// Example: /app/onboarding/payment/success?session_id=cs_123&plan=professional_product

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const plan = searchParams.get('plan');
  
  useEffect(() => {
    const handlePaymentSuccess = async () => {
      if (sessionId && plan) {
        // Verify payment completion
        await verifyPaymentAndUpdateOrganization(sessionId, plan);
        
        // Redirect to next onboarding step
        router.push('/app/onboarding?step=3');
      }
    };
    
    handlePaymentSuccess();
  }, [sessionId, plan]);
}
```

### 6. Pricing Display Component (`src/components/autumn/pricing-table.tsx`)

Reusable component for displaying Autumn pricing:

```typescript
export default function PricingTable() {
  const { products, isLoading, error } = usePricingTable();
  
  // Filter products by billing interval (monthly/annual)
  const intervalFilter = (product: any) => {
    if (isAnnual) {
      return product.properties?.interval_group === "year";
    } else {
      return product.properties?.interval_group === "month";
    }
  };

  return (
    <PricingTableContainer products={products}>
      {products.filter(intervalFilter).map((product: any) => (
        <PricingCard
          key={product.id}
          productId={product.id}
          buttonProps={{
            disabled: product.scenario === "active",
            onClick: async () => {
              // Handle product selection
            },
          }}
        />
      ))}
    </PricingTableContainer>
  );
}
```

## Payment Flow

### 1. **Plan Selection**
- User navigates to payment step in onboarding
- Component fetches live pricing from Autumn API
- User selects a plan (Starter, Professional, Enterprise)

### 2. **Checkout Initiation**
- Plan is saved to organization metadata
- Autumn customer is created/retrieved
- Checkout session is created with Stripe via Autumn
- User is redirected to Stripe checkout page

### 3. **Payment Processing**
- User completes payment on Stripe-hosted checkout
- Stripe processes the payment
- User is redirected to success URL: `/app/onboarding/payment/success?session_id={CHECKOUT_SESSION_ID}&plan={PLAN_ID}`

### 4. **Payment Success Handling**
- Success page receives session_id and plan from URL parameters
- Payment completion is verified (if needed)
- User is automatically redirected to next onboarding step (step 3)

### 5. **Subscription Management**
- Autumn handles recurring billing automatically
- Future subscription updates managed through Autumn dashboard
- Usage tracking for feature-based billing

## Key Features

### **Multi-Tier Pricing**
- **Starter**: $29/month for up to 25 users
- **Professional**: $59/month for up to 100 users  
- **Enterprise**: Custom pricing with contact sales

### **Usage-Based Billing**
- Organization seats tracked as features
- Automatic overage billing
- Real-time usage monitoring

### **Subscription Management**
- Automatic recurring billing
- Upgrade/downgrade handling
- Cancellation and renewal flows

### **Security & Compliance**
- Stripe-powered payment processing
- PCI-compliant checkout flow
- Secure redirect-based flow
- Session-based payment verification

## Environment Variables Required

```bash
# Autumn Configuration
AUTUMN_API_KEY=your_autumn_api_key
AUTUMN_ENVIRONMENT=sandbox # or production

# Stripe Configuration (via Autumn)
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# App URLs for Success Redirects
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Integration Benefits

1. **Seamless UX**: Integrated into onboarding flow
2. **Real-time Pricing**: Live pricing from Autumn API
3. **Automatic Billing**: Recurring subscriptions handled automatically
4. **Usage Tracking**: Feature-based billing with usage limits
5. **Enterprise Ready**: Custom pricing and contact sales flow
6. **Secure**: PCI-compliant via Stripe integration
7. **Redirect-Based**: Simple, reliable payment completion flow

This architecture provides a robust, scalable payment system that handles both simple subscription billing and complex usage-based pricing models.
