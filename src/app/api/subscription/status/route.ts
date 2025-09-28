import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // TODO: Implement subscription status check
    // This would typically involve:
    // 1. Getting the user's customer ID from your database
    // 2. Calling Autumn API to get subscription status
    // 3. Returning the current subscription info
    
    // For now, return a placeholder response
    return NextResponse.json({
      active: false,
      planId: null,
      planName: null,
      status: null,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
      message: 'Subscription status check not implemented yet. This requires storing customer IDs in your database.'
    });

    // Example implementation (uncomment when you have customer ID storage):
    /*
    const customerId = await getUserCustomerId(session.user.id);
    
    if (!customerId) {
      return NextResponse.json({
        active: false,
        planId: null,
        planName: null,
        status: null,
      });
    }

    const subscription = await autumnHelpers.getSubscription(customerId);
    
    return NextResponse.json({
      active: subscription.status === 'active',
      planId: subscription.planId,
      planName: subscription.planId,
      status: subscription.status,
      currentPeriodEnd: subscription.currentPeriodEnd,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
    });
    */

  } catch (error) {
    console.error('Subscription status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
