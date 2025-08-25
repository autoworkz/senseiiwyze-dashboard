import { NextRequest, NextResponse } from 'next/server';
import { autumnHelpers, type PlanId } from '@/lib/autumn';
import { paymentSessionStorage } from '@/lib/payment-session-storage';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    if (!process.env.AUTUMN_API_KEY) {
      console.error('Missing AUTUMN_API_KEY environment variable');
      return NextResponse.json(
        { error: 'Autumn API not configured' },
        { status: 500 }
      );
    }

    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { planId, companyName, employeeCount } = body;

    if (!planId || !['starter', 'professional', 'enterprise'].includes(planId)) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    // Validate that we have the required Product ID for this plan
    const productIdEnvVar = `AUTUMN_${planId.toUpperCase()}_PRODUCT_ID`;
    const productId = process.env[productIdEnvVar];
    
    if (!productId && planId !== 'enterprise') {
      console.error(`Missing environment variable: ${productIdEnvVar}`);
      return NextResponse.json(
        { error: `Product ID not configured for ${planId} plan` },
        { status: 500 }
      );
    }

    // For enterprise plans, don't create checkout - redirect to contact sales
    if (planId === 'enterprise') {
      return NextResponse.json({
        type: 'contact_sales',
        message: 'Enterprise plans require custom pricing. Our sales team will contact you.',
        redirectUrl: '/contact-sales',
      });
    }

    // Create or retrieve customer
    let customerId: string;
    
    try {
      // Try to create a new customer
      console.log('Creating Autumn customer for:', session.user.email);
      const customer = await autumnHelpers.createCustomer({
        email: session.user.email,
        name: session.user.name || 'Unknown',
        companyName: companyName || 'Unknown Company',
        employeeCount: employeeCount || 'Unknown',
      });
      
      customerId = customer.id;
      console.log('Customer created successfully:', customerId);
    } catch (error) {
      console.error('Failed to create Autumn customer:', error);
      return NextResponse.json(
        { error: 'Failed to create customer account. Please check Autumn API configuration.' },
        { status: 500 }
      );
    }

    // Create checkout session
    try {
      console.log('Creating checkout session for plan:', planId);
      const checkoutSession = await autumnHelpers.createCheckoutSession({
        customerId,
        planId: planId as PlanId,
        successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding?step=2`,
      });

      console.log('Checkout session created:', checkoutSession.id);

      // Store session data for later verification
      paymentSessionStorage.store(checkoutSession.id, {
        customerId,
        planId: planId as PlanId,
        status: 'pending',
        metadata: {
          companyName,
          employeeCount,
          userEmail: session.user.email,
          userName: session.user.name,
        },
      });

      return NextResponse.json({
        type: 'checkout',
        checkoutUrl: checkoutSession.url,
        sessionId: checkoutSession.id,
      });
    } catch (error) {
      console.error('Failed to create checkout session:', error);
      return NextResponse.json(
        { error: 'Failed to create checkout session. Please check Autumn Product IDs.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Checkout API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
