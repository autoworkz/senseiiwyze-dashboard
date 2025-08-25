import { NextRequest, NextResponse } from 'next/server';
import { paymentSessionStorage } from '@/lib/payment-session-storage';

export async function GET(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Debug endpoint only available in development' },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (sessionId) {
      // Get specific session
      const session = paymentSessionStorage.get(sessionId);
      return NextResponse.json({
        sessionId,
        session,
        found: !!session,
      });
    } else {
      // Get all sessions
      const allSessions = paymentSessionStorage.getAllSessions();
      return NextResponse.json({
        totalSessions: allSessions.length,
        sessions: allSessions,
      });
    }
  } catch (error) {
    console.error('Debug sessions error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve session data' },
      { status: 500 }
    );
  }
}
