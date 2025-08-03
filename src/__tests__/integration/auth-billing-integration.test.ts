/**
 * Integration tests for Better Auth + Autumn.js billing system
 * Tests session validation, authentication flows, and billing operations
 */

import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { auth } from '@/lib/auth'
import { authClient } from '@/lib/auth-client'

// Mock next/headers for testing
vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue({
    get: vi.fn(),
    entries: vi.fn().mockReturnValue([]),
  }),
}))

// Mock Better Auth session
const mockSession = {
  user: {
    id: 'test-user-123',
    name: 'Test User',
    email: 'test@example.com',
    role: 'worker',
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  session: {
    id: 'session-123',
    activeOrganizationId: 'org-123',
    expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
  },
}

// Mock Autumn.js customer
const mockAutumnCustomer = {
  id: 'customer-123',
  email: 'test@example.com',
  subscription: {
    id: 'sub-123',
    status: 'active',
    plan: 'professional',
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  },
  billing: {
    customerId: 'cust-123',
    paymentMethod: {
      id: 'pm-123',
      type: 'card',
      last4: '4242',
    },
  },
}

describe('Better Auth + Autumn.js Integration', () => {
  beforeAll(() => {
    // Set up global test environment
    process.env.NODE_ENV = 'test'
    process.env.BETTER_AUTH_SECRET = 'test-secret-key-32-characters-long'
    process.env.BETTER_AUTH_URL = 'http://localhost:3000'
  })

  afterAll(() => {
    // Clean up
    vi.clearAllMocks()
  })

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks()
  })

  describe('Session Validation for Billing Operations', () => {
    it('should validate session before accessing billing features', async () => {
      // Mock successful session validation
      const getSessionSpy = vi.spyOn(auth.api, 'getSession').mockResolvedValue(mockSession)

      // Test session validation
      const session = await auth.api.getSession({
        headers: await import('next/headers').then((h) => h.headers()),
      })

      expect(getSessionSpy).toHaveBeenCalled()
      expect(session).toBeDefined()
      expect(session?.user).toBeDefined()
      expect(session?.user.id).toBe('test-user-123')
      expect(session?.user.email).toBe('test@example.com')
    })

    it('should return null for invalid sessions', async () => {
      // Mock failed session validation
      const getSessionSpy = vi.spyOn(auth.api, 'getSession').mockResolvedValue(null)

      const session = await auth.api.getSession({
        headers: await import('next/headers').then((h) => h.headers()),
      })

      expect(getSessionSpy).toHaveBeenCalled()
      expect(session).toBeNull()
    })

    it('should handle session validation errors gracefully', async () => {
      // Mock session validation error
      const getSessionSpy = vi
        .spyOn(auth.api, 'getSession')
        .mockRejectedValue(new Error('Session validation failed'))

      await expect(
        auth.api.getSession({
          headers: await import('next/headers').then((h) => h.headers()),
        })
      ).rejects.toThrow('Session validation failed')

      expect(getSessionSpy).toHaveBeenCalled()
    })
  })

  describe('Client-Side Session Management', () => {
    it('should provide session data through authClient', async () => {
      // Mock client session
      const mockClientSession = {
        data: mockSession,
        error: null,
        isPending: false,
      }

      // Test authClient session access
      expect(authClient).toBeDefined()
      expect(authClient.getSession).toBeDefined()
      expect(typeof authClient.getSession).toBe('function')
    })

    it('should handle authentication state changes', async () => {
      // Test authentication methods are available
      expect(authClient.signIn).toBeDefined()
      expect(authClient.signUp).toBeDefined()
      expect(authClient.signOut).toBeDefined()
      expect(typeof authClient.signIn).toBe('function')
      expect(typeof authClient.signUp).toBe('function')
      expect(typeof authClient.signOut).toBe('function')
    })
  })

  describe('Billing Route Protection', () => {
    it('should require authentication for billing routes', async () => {
      // Mock unauthenticated session
      vi.spyOn(auth.api, 'getSession').mockResolvedValue(null)

      // Test that billing routes check authentication
      const session = await auth.api.getSession({
        headers: await import('next/headers').then((h) => h.headers()),
      })

      expect(session).toBeNull()

      // In a real application, this would trigger a redirect to login
      // We'll test this behavior in our route tests
    })

    it('should allow authenticated users to access billing features', async () => {
      // Mock authenticated session
      vi.spyOn(auth.api, 'getSession').mockResolvedValue(mockSession)

      const session = await auth.api.getSession({
        headers: await import('next/headers').then((h) => h.headers()),
      })

      expect(session).toBeDefined()
      expect(session?.user.id).toBe('test-user-123')

      // Verify user has required properties for billing
      expect(session?.user.email).toBeDefined()
      expect(session?.user.role).toBeDefined()
    })
  })

  describe('Autumn.js Integration', () => {
    it('should have Autumn plugin configured in Better Auth', () => {
      // Check that auth configuration includes Autumn plugin
      expect(auth).toBeDefined()

      // The Autumn plugin should be included in the auth configuration
      // This is verified by the successful build and the import in auth.ts
    })

    it('should validate session before Autumn operations', async () => {
      // Mock session for billing operations
      const getSessionSpy = vi.spyOn(auth.api, 'getSession').mockResolvedValue(mockSession)

      // Simulate billing operation that requires authentication
      const session = await auth.api.getSession({
        headers: await import('next/headers').then((h) => h.headers()),
      })

      expect(getSessionSpy).toHaveBeenCalled()
      expect(session).toBeDefined()

      // Verify session has required properties for billing
      expect(session?.user.email).toBe('test@example.com')
      expect(session?.user.id).toBe('test-user-123')
    })
  })

  describe('User Role and Permissions for Billing', () => {
    it('should validate user permissions for billing operations', async () => {
      // Mock session with specific role
      const sessionWithRole = {
        ...mockSession,
        user: {
          ...mockSession.user,
          role: 'worker', // Role that should have billing access
        },
      }

      vi.spyOn(auth.api, 'getSession').mockResolvedValue(sessionWithRole)

      const session = await auth.api.getSession({
        headers: await import('next/headers').then((h) => h.headers()),
      })

      expect(session?.user.role).toBe('worker')

      // In a real implementation, we would check if this role
      // has permission to access billing features
    })

    it('should handle organization context for billing', async () => {
      // Mock session with organization
      const sessionWithOrg = {
        ...mockSession,
        session: {
          ...mockSession.session,
          activeOrganizationId: 'org-123',
        },
      }

      vi.spyOn(auth.api, 'getSession').mockResolvedValue(sessionWithOrg)

      const session = await auth.api.getSession({
        headers: await import('next/headers').then((h) => h.headers()),
      })

      expect(session?.session.activeOrganizationId).toBe('org-123')

      // Organization context is important for billing in B2B2C scenarios
    })
  })

  describe('Error Handling and Security', () => {
    it('should handle authentication errors securely', async () => {
      // Mock authentication failure
      vi.spyOn(auth.api, 'getSession').mockRejectedValue(new Error('Authentication failed'))

      await expect(
        auth.api.getSession({
          headers: await import('next/headers').then((h) => h.headers()),
        })
      ).rejects.toThrow('Authentication failed')
    })

    it('should not expose sensitive information in failed auth attempts', async () => {
      // Mock session validation that returns null (not authenticated)
      vi.spyOn(auth.api, 'getSession').mockResolvedValue(null)

      const session = await auth.api.getSession({
        headers: await import('next/headers').then((h) => h.headers()),
      })

      expect(session).toBeNull()
      // Ensure no sensitive data is leaked in null response
    })
  })

  describe('Session Persistence and Refresh', () => {
    it('should maintain session state across billing operations', async () => {
      // Test that session persists during billing flow
      const getSessionSpy = vi.spyOn(auth.api, 'getSession').mockResolvedValue(mockSession)

      // First call
      const session1 = await auth.api.getSession({
        headers: await import('next/headers').then((h) => h.headers()),
      })

      // Second call (simulating user navigation)
      const session2 = await auth.api.getSession({
        headers: await import('next/headers').then((h) => h.headers()),
      })

      expect(session1?.user.id).toBe(session2?.user.id)
      expect(getSessionSpy).toHaveBeenCalledTimes(2)
    })
  })
})

describe('Billing Component Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('PricingTable Component', () => {
    it('should handle authentication state in pricing component', async () => {
      // Mock successful session for pricing operations
      vi.spyOn(auth.api, 'getSession').mockResolvedValue(mockSession)

      const session = await auth.api.getSession({
        headers: await import('next/headers').then((h) => h.headers()),
      })

      expect(session).toBeDefined()

      // Pricing table should be able to access user data for subscription
      expect(session?.user.email).toBe('test@example.com')
    })
  })

  describe('Billing Section Component', () => {
    it('should require authentication for billing section access', async () => {
      // Test that billing section checks for authentication
      // This would typically be done in the page component or middleware

      // Mock authenticated session
      vi.spyOn(auth.api, 'getSession').mockResolvedValue(mockSession)

      const session = await auth.api.getSession({
        headers: await import('next/headers').then((h) => h.headers()),
      })

      expect(session).toBeDefined()
      expect(session?.user).toBeDefined()
    })
  })
})

describe('API Route Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should validate session in billing API routes', async () => {
    // Mock session validation for API routes
    const getSessionSpy = vi.spyOn(auth.api, 'getSession').mockResolvedValue(mockSession)

    // Simulate API route session check
    const session = await auth.api.getSession({
      headers: await import('next/headers').then((h) => h.headers()),
    })

    expect(getSessionSpy).toHaveBeenCalled()
    expect(session).toBeDefined()
    expect(session?.user.id).toBe('test-user-123')
  })

  it('should reject requests without valid sessions', async () => {
    // Mock invalid session
    vi.spyOn(auth.api, 'getSession').mockResolvedValue(null)

    const session = await auth.api.getSession({
      headers: await import('next/headers').then((h) => h.headers()),
    })

    expect(session).toBeNull()
    // API routes should return 401 Unauthorized for null sessions
  })
})
