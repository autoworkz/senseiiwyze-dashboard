"use client";

import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Check, Star, ArrowRight, ArrowLeft, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { OnboardingData } from '../OnboardingFlow';
import { savePlan } from '@/lib/api/organization';
import { usePricingTable, useCustomer, CheckoutDialog } from 'autumn-js/react';
import { findRecurringPrice, formatMoney } from '@/utils/pricing';
import { useRouter } from 'next/navigation';
import { useOnboardingFlow } from '@/hooks/useOnboardingFlow';
import { useUser } from '@/contexts/UserContext';
import authClient from '@/lib/auth-client';


interface PaymentPlansStepProps {
  data: OnboardingData & { selectedPlan?: string };
  onComplete: (data: Partial<OnboardingData & {
    selectedPlan: string;
    paymentSessionId?: string;
    customerId?: string;
  }>) => Promise<void>;
  onBack: () => void;
}

const plans = [
  {
    id: 'starter_product', // Autumn product id
    name: 'Starter',
    description: 'Perfect for small teams getting started',
    price: '$29',
    period: 'per user/month',
    popular: false,
    features: [
      'Up to 25 users',
      'Basic skill assessments',
      'Standard AI coaching',
      'Email support',
      'Basic analytics',
      'Mobile app access'
    ],
    color: 'border-border',
    buttonText: 'Start with Starter'
  },
  {
    id: 'professional_product',
    name: 'Professional',
    description: 'Most popular for growing organizations',
    price: '$59',
    period: 'per user/month',
    popular: true,
    features: [
      'Up to 100 users',
      'Advanced skill assessments',
      'Premium AI coaching',
      'Priority support',
      'Advanced analytics & reporting',
      'Custom learning paths',
      'API access',
      'Team collaboration tools'
    ],
    color: 'border-primary',
    buttonText: 'Choose Professional'
  },
  {
    id: 'enterprise_product',
    name: 'Enterprise',
    description: 'For large organizations with custom needs',
    price: 'Custom',
    period: 'contact for pricing',
    popular: false,
    features: [
      'Unlimited users',
      'Custom skill frameworks',
      'Dedicated AI coaching',
      '24/7 dedicated support',
      'Enterprise analytics',
      'Custom integrations',
      'White-label options',
      'On-premise deployment',
      'Success guarantee'
    ],
    color: 'border-custom-blue',
    buttonText: 'Choose Enterprise'
  }
];

export function PaymentPlansStep({ data, onComplete, onBack }: PaymentPlansStepProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>(data.selectedPlan || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const { user } = useUser();
  const { products, isLoading: isProductsLoading, error: productsError, refetch: refetchProducts } = usePricingTable();
  const { checkout, refetch: refetchCustomer } = useCustomer();
  const { advanceStep } = useOnboardingFlow();

  // Get user count from organization metadata
  const userCount = useMemo(() => {
    if (user?.onboardingOrgMetadata) {
      const metadata = user.onboardingOrgMetadata;
      return parseInt(metadata?.sizeEstimate || metadata?.employeeCount || '1');
    }
    return 1;
  }, [user?.onboardingOrgMetadata]);

  const tryAdvanceIfActive = async () => {
    // refetch both sources to be fresh
    await Promise.all([refetchProducts(), refetchCustomer()]);
    const paid = products?.find(
      (p: any) =>
        (p.id === selectedPlan) &&
        (p.scenario === "active" || p.scenario === "renew" || p.scenario === "scheduled")
    );
    if (paid) {
      await advanceStep();
      router.replace("/app/onboarding");
      return true;
    }
    return false;
  }


  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    setError(''); // Clear any previous errors
  };

  const handleContinue = async () => {
    if (!selectedPlan) return;
    setIsLoading(true); setError("");
    console.log("selectedPlan", selectedPlan);

    try {
      // Save the selected plan before redirecting
      await savePlan(selectedPlan);
      await checkout({
        productId: 'starter',
        dialog: CheckoutDialog,
        options: [{ quantity: userCount, featureId: "organization_seats" }],
        // some SDK versions support these; harmless if ignored:
        successUrl: `${window.location.origin}/app/onboarding/payment/success?plan=${selectedPlan}&users=${userCount}`,
        // cancelUrl: `${window.location.origin}/app/onboarding?step=2`,
      });
      // Redirect to Autumn checkout
      // await tryAdvanceIfActive();
    } catch (e: any) {
      setError(e?.message || "Failed to update plan");
    } finally {
      setIsLoading(false);
    }
  };

  const displayPlans = useMemo(() => {
    return plans.map((p) => {
      const autumnProduct = products?.find((product: any) => p.id === product.id);
      if (!autumnProduct) {
        // Fallback calculation for static plans
        const basePrice = parseFloat(p.price.replace('$', '')) || 0;
        const totalPrice = basePrice * userCount;
        console.log("totalPrice", totalPrice);
        return {
          ...p,
          price: `$${totalPrice}`,
          period: `per month ($${basePrice}/user × ${userCount} user${userCount !== 1 ? 's' : ''})`,
        };
      }

      const chosen = findRecurringPrice(autumnProduct, "month");
      const perUserPrice = chosen?.amount || 0;
      console.log("perUserPrice", perUserPrice);
      console.log("userCount", userCount);
      const totalPrice = perUserPrice * userCount;
      console.log("totalPrice", totalPrice);
      return {
        ...p,
        // Prefer Autumn's name (keeps your 'Enterprise' etc. in sync with Dashboard/CLI)
        name: autumnProduct.name ?? p.name,
        // Show total price and per-user breakdown
        price: `$${totalPrice}`,
        period: `per month ($${perUserPrice}/user × ${userCount} user${userCount !== 1 ? 's' : ''})`,
      };
    });
  }, [products, userCount]);

  // Loading / error states
  if (isProductsLoading) {
    return (
      <div className="p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full animate-pulse mb-4" />
          <h1 className="text-3xl font-bold mb-2">Loading plans…</h1>
          <p className="text-muted-foreground">Fetching live pricing from Autumn</p>
        </div>
      </div>
    );
  }
  if (productsError) {
    return (
      <div className="p-8">
        <Alert className="max-w-3xl mx-auto">
          <AlertDescription>
            Couldn’t load pricing. Please check your Autumn setup and try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-custom-blue rounded-full flex items-center justify-center mb-4">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Choose your plan</h1>
          <p className="text-muted-foreground text-lg">
            Select the perfect plan for your organization's learning journey
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8">
          {displayPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className={cn(
                  "relative cursor-pointer transition-all duration-300 hover:shadow-lg",
                  plan.color,
                  selectedPlan === plan.id && "ring-2 ring-primary shadow-lg scale-105",
                  plan.popular && "border-primary shadow-md",
                  isLoading && "opacity-60 cursor-not-allowed"
                )}
                onClick={() => !isLoading && handlePlanSelect(plan.id)}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-primary to-custom-blue text-white px-4 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="text-sm">{plan.description}</CardDescription>

                  {/* Price */}
                  <div className="mt-4">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-3xl font-bold">{plan.price}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{plan.period}</p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Features List */}
                  <ul className="space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <motion.li
                        key={featureIndex}
                        className="flex items-start gap-2 text-sm"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + featureIndex * 0.05 }}
                      >
                        <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* Select Button */}
                  <Button
                    className={cn(
                      "w-full mt-6 text-white",
                      "bg-primary hover:bg-primary/90",
                      selectedPlan === plan.id && "ring-2 ring-primary/50"
                    )}
                    variant={selectedPlan === plan.id ? "default" : "outline"}
                    disabled={isLoading}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isLoading) {
                        handlePlanSelect(plan.id);
                      }
                    }}
                  >
                    {selectedPlan === plan.id ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Selected
                      </>
                    ) : (
                      plan.buttonText
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto mb-6"
          >
            <Alert className="border-destructive/50 text-destructive dark:border-destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-custom-blue/5 border border-custom-blue/20 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-custom-blue flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-custom-blue mb-2">What's included in all plans:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-custom-blue" />
                    <span>14-day free trial</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-custom-blue" />
                    <span>No setup fees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-custom-blue" />
                    <span>Cancel anytime</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-custom-blue" />
                    <span>Data export available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto mb-6"
          >
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="w-4 h-4" />
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <Button
            variant="outline"
            size="lg"
            onClick={onBack}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!selectedPlan || isLoading}
            className="bg-primary text-white hover:bg-primary/90 min-w-32"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* Trust Indicators with Autumn Branding */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-8"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
              <span>Powered by Autumn</span>
            </div>
            <div className="text-muted-foreground">•</div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-4 h-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
              <span>Secured by Stripe</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            🔒 Secure payment processing • 💳 Accept all major credit cards • 📞 24/7 support available
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
