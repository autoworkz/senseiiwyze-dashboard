/**
 * Payment Session Storage
 * 
 * This utility helps store and retrieve payment session data
 * since Autumn's checkout doesn't have a direct retrieve method.
 * 
 * In a real application, you would store this in your database.
 * For now, we'll use a simple in-memory storage with expiration.
 */

interface PaymentSession {
  id: string;
  customerId: string;
  planId: string;
  status: 'pending' | 'completed' | 'failed';
  metadata?: Record<string, any>;
  createdAt: Date;
  completedAt?: Date;
}

// Simple in-memory storage - replace with database in production
const sessionStorage = new Map<string, PaymentSession>();

// Auto-cleanup old sessions (24 hours)
const CLEANUP_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
setInterval(() => {
  const now = new Date();
  for (const [sessionId, session] of sessionStorage.entries()) {
    if (now.getTime() - session.createdAt.getTime() > CLEANUP_INTERVAL) {
      sessionStorage.delete(sessionId);
    }
  }
}, CLEANUP_INTERVAL);

export const paymentSessionStorage = {
  /**
   * Store a payment session when checkout is created
   */
  store(sessionId: string, data: Omit<PaymentSession, 'id' | 'createdAt'>): void {
    sessionStorage.set(sessionId, {
      id: sessionId,
      createdAt: new Date(),
      ...data,
    });
  },

  /**
   * Retrieve a payment session
   */
  get(sessionId: string): PaymentSession | null {
    return sessionStorage.get(sessionId) || null;
  },

  /**
   * Update session status (typically called from webhook)
   */
  updateStatus(sessionId: string, status: PaymentSession['status'], metadata?: Record<string, any>): void {
    const session = sessionStorage.get(sessionId);
    if (session) {
      session.status = status;
      if (status === 'completed') {
        session.completedAt = new Date();
      }
      if (metadata) {
        session.metadata = { ...session.metadata, ...metadata };
      }
      sessionStorage.set(sessionId, session);
    }
  },

  /**
   * Remove a session
   */
  remove(sessionId: string): void {
    sessionStorage.delete(sessionId);
  },

  /**
   * Get all sessions for debugging
   */
  getAllSessions(): PaymentSession[] {
    return Array.from(sessionStorage.values());
  },
};

// Alternative approach using localStorage (client-side only)
export const clientPaymentStorage = {
  store(sessionId: string, data: any): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`payment_session_${sessionId}`, JSON.stringify({
        ...data,
        timestamp: Date.now(),
      }));
    }
  },

  get(sessionId: string): any | null {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`payment_session_${sessionId}`);
      if (stored) {
        const data = JSON.parse(stored);
        // Check if data is not too old (24 hours)
        if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
          return data;
        } else {
          // Clean up old data
          localStorage.removeItem(`payment_session_${sessionId}`);
        }
      }
    }
    return null;
  },

  remove(sessionId: string): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`payment_session_${sessionId}`);
    }
  },
};
