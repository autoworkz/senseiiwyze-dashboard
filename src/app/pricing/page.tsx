import PricingTable from "@/components/autumn/pricing-table";
import { AUTUMN_PRODUCTS } from "@/config/autumn-products";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start with a 14-day free trial. No credit card required. 
            Upgrade or cancel anytime.
          </p>
        </div>

        <PricingTable productDetails={AUTUMN_PRODUCTS} />

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
          
          <div className="max-w-3xl mx-auto text-left space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">What is the Readiness Index?</h3>
              <p className="text-muted-foreground">
                Our proprietary AI algorithm predicts training success with 87% accuracy 
                before enrollment, helping you invest in the right training at the right time.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">How does the success guarantee work?</h3>
              <p className="text-muted-foreground">
                We're so confident in our approach that 30% of our fee is tied to your 
                team's certification pass rates. If learners don't achieve their goals, 
                you get a partial refund.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">What are AI credits?</h3>
              <p className="text-muted-foreground">
                AI credits power our coaching features, including personalized learning paths, 
                real-time assistance, and progress insights. Each interaction consumes credits 
                based on complexity.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Can I change plans anytime?</h3>
              <p className="text-muted-foreground">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect 
                at the next billing cycle, with prorated adjustments for upgrades.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}