import { NextRequest, NextResponse } from 'next/server';
import { paymentSessionStorage } from '@/lib/payment-session-storage';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required', verified: false },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required', verified: false },
        { status: 400 }
      );
    }

    try {
      // Get session data from our storage
      const storedSession = paymentSessionStorage.get(sessionId);
      
      if (!storedSession) {
        return NextResponse.json({
          verified: false,
          error: 'Session not found or expired',
        });
      }

      // Check session status
      if (storedSession.status === 'completed') {
        // Payment was successful
        return NextResponse.json({
          verified: true,
          sessionId: sessionId,
          customerId: storedSession.customerId,
          planId: storedSession.planId,
          metadata: storedSession.metadata,
        });
      } else if (storedSession.status === 'failed') {
        // Payment failed
        return NextResponse.json({
          verified: false,
          error: 'Payment failed',
          status: 'failed',
        });
      } else {
        // Payment still pending - check if it's been too long
        const timeSinceCreated = Date.now() - storedSession.createdAt.getTime();
        const maxWaitTime = 10 * 60 * 1000; // 10 minutes
        
        if (timeSinceCreated > maxWaitTime) {
          // Mark as failed after timeout
          paymentSessionStorage.updateStatus(sessionId, 'failed');
          return NextResponse.json({
            verified: false,
            error: 'Payment verification timeout',
            status: 'timeout',
          });
        }
        
        // Still pending
        return NextResponse.json({
          verified: false,
          error: 'Payment still processing',
          status: 'pending',
        });
      }
    } catch (error) {
      console.error('Error verifying payment session:', error);
      return NextResponse.json(
        { error: 'Failed to verify payment session', verified: false },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error', verified: false },
      { status: 500 }
    );
  }
}
