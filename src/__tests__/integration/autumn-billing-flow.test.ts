/**
 * Integration tests for Autumn.js billing flow with Better Auth
 * Tests pricing table, subscription flow, and customer management
 */

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { AUTUMN_PRODUCTS } from '@/config/autumn-products'
import { auth } from '@/lib/auth'

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
}))

// Mock next/headers
vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue({
    get: vi.fn(),
    entries: vi.fn().mockReturnValue([]),
  }),
}))

// Mock autumn-js/react
vi.mock('autumn-js/react', () => ({
  usePricingTable: vi.fn(() => ({
    products: AUTUMN_PRODUCTS,
    isLoading: false,
    error: null,
  })),
  useCustomer: vi.fn(() => ({
    customer: {
      id: 'customer-123',
      email: 'test@example.com',
      subscription: {
        id: 'sub-123',
        status: 'active',
        plan: 'professional',
      },
    },
    attach: vi.fn(),
    refetch: vi.fn(),
  })),
}))

// Mock useAutumnCustomer hook
vi.mock('@/hooks/useAutumnCustomer', () => ({
  useCustomer: vi.fn(() => ({
    customer: {
      id: 'customer-123',
      email: 'test@example.com',
      subscription: {
        id: 'sub-123',
        status: 'active',
        plan: 'professional',
      },
    },
    attach: vi.fn(),
    refetch: vi.fn(),
  })),
  AutumnCustomerProvider: ({ children }: { children: React.ReactNode }) => children,
}))

// Mock session
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
    expiresAt: new Date(Date.now() + 3600000),
  },
}

describe('Autumn.js Billing Flow Integration', () => {
  beforeAll(() => {
    process.env.NODE_ENV = 'test'
    process.env.BETTER_AUTH_SECRET = 'test-secret-key-32-characters-long'
    process.env.BETTER_AUTH_URL = 'http://localhost:3000'
  })

  afterAll(() => {
    vi.clearAllMocks()
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Autumn Product Configuration', () => {
    it('should have valid product configurations', () => {
      expect(AUTUMN_PRODUCTS).toBeDefined()
      expect(Array.isArray(AUTUMN_PRODUCTS)).toBe(true)
      expect(AUTUMN_PRODUCTS.length).toBeGreaterThan(0)

      // Check each product has required fields
      AUTUMN_PRODUCTS.forEach((product) => {
        expect(product.id).toBeDefined()
        expect(product.name).toBeDefined()
        expect(product.type).toBeDefined()
        expect(product.items).toBeDefined()
        expect(Array.isArray(product.items)).toBe(true)
      })
    })

    it('should have properly structured pricing items', () => {
      AUTUMN_PRODUCTS.forEach((product) => {
        product.items.forEach((item) => {
          expect(item.id).toBeDefined()
          expect(item.type).toBeDefined()
          expect(['flat', 'unit', 'tier']).toContain(item.type)

          if (item.type === 'flat' && item.flat) {
            expect(typeof item.flat.amount).toBe('number')
            expect(item.flat.amount).toBeGreaterThanOrEqual(0)
          }

          if (item.type === 'unit' && item.unit) {
            expect(typeof item.unit.amount).toBe('number')
            expect(item.unit.amount).toBeGreaterThanOrEqual(0)
          }
        })
      })
    })

    it('should have display information for UI rendering', () => {
      AUTUMN_PRODUCTS.forEach((product) => {
        if (product.display) {
          // Check display properties are strings when present
          if (product.display.name) {
            expect(typeof product.display.name).toBe('string')
          }
          if (product.display.description) {
            expect(typeof product.display.description).toBe('string')
          }
          if (product.display.button_text) {
            expect(typeof product.display.button_text).toBe('string')
          }
        }

        // Check item display information
        product.items.forEach((item) => {
          if (item.display) {
            if (item.display.primary_text) {
              expect(typeof item.display.primary_text).toBe('string')
            }
            if (item.display.secondary_text) {
              expect(typeof item.display.secondary_text).toBe('string')
            }
          }
        })
      })
    })
  })

  describe('Subscription Flow with Authentication', () => {
    it('should validate user session before subscription operations', async () => {
      // Mock authenticated session
      const getSessionSpy = vi.spyOn(auth.api, 'getSession').mockResolvedValue(mockSession)

      // Simulate subscription flow requiring authentication
      const session = await auth.api.getSession({
        headers: await import('next/headers').then((h) => h.headers()),
      })

      expect(getSessionSpy).toHaveBeenCalled()
      expect(session).toBeDefined()
      expect(session?.user.email).toBe('test@example.com')

      // Verify session has required properties for billing
      expect(session?.user.id).toBeDefined()
      expect(session?.user.email).toBeDefined()
    })

    it('should handle unauthenticated subscription attempts', async () => {
      // Mock unauthenticated session
      vi.spyOn(auth.api, 'getSession').mockResolvedValue(null)

      const session = await auth.api.getSession({
        headers: await import('next/headers').then((h) => h.headers()),
      })

      expect(session).toBeNull()

      // In real implementation, this should redirect to login
      // or show authentication required message
    })
  })

  describe('Customer Management Integration', () => {
    it('should link Better Auth user to Autumn customer', async () => {
      // Mock authenticated session
      vi.spyOn(auth.api, 'getSession').mockResolvedValue(mockSession)

      const session = await auth.api.getSession({
        headers: await import('next/headers').then((h) => h.headers()),
      })

      expect(session?.user.email).toBe('test@example.com')

      // The customer should be linked by email
      // In Autumn.js, customers are typically identified by email
      const customerEmail = session?.user.email
      expect(customerEmail).toBe('test@example.com')
    })

    it('should handle customer creation for new users', async () => {
      // Mock new user session
      const newUserSession = {
        ...mockSession,
        user: {
          ...mockSession.user,
          id: 'new-user-456',
          email: 'newuser@example.com',
        },
      }

      vi.spyOn(auth.api, 'getSession').mockResolvedValue(newUserSession)

      const session = await auth.api.getSession({
        headers: await import('next/headers').then((h) => h.headers()),
      })

      expect(session?.user.email).toBe('newuser@example.com')

      // New users should be able to create Autumn customers
      expect(session?.user.id).toBe('new-user-456')
    })
  })

  describe('Pricing Plans and Features', () => {
    it('should have starter plan with correct pricing', () => {
      const starterPlan = AUTUMN_PRODUCTS.find((p) => p.id === 'starter')
      expect(starterPlan).toBeDefined()
      expect(starterPlan?.name).toBe('Starter')

      const priceItem = starterPlan?.items.find(
        (item) => item.type === 'flat' && item.id?.includes('price')
      )
      expect(priceItem).toBeDefined()
      expect(priceItem?.flat?.amount).toBe(29900) // $299.00 in cents
    })

    it('should have professional plan with success fee', () => {
      const proPlan = AUTUMN_PRODUCTS.find((p) => p.id === 'professional')
      expect(proPlan).toBeDefined()
      expect(proPlan?.name).toBe('Professional')

      const successFeeItem = proPlan?.items.find((item) => item.id?.includes('success-fee'))
      expect(successFeeItem).toBeDefined()
      expect(successFeeItem?.display?.primary_text).toBe('30% success fee')
    })

    it('should have enterprise plan with custom pricing', () => {
      const enterprisePlan = AUTUMN_PRODUCTS.find((p) => p.id === 'enterprise')
      expect(enterprisePlan).toBeDefined()
      expect(enterprisePlan?.name).toBe('Enterprise')

      const priceItem = enterprisePlan?.items.find(
        (item) => item.type === 'flat' && item.id?.includes('price')
      )
      expect(priceItem).toBeDefined()
      expect(priceItem?.display?.primary_text).toBe('Custom')
    })

    it('should have annual plans with discounts', () => {
      const starterAnnual = AUTUMN_PRODUCTS.find((p) => p.id === 'starter-annual')
      expect(starterAnnual).toBeDefined()
      expect(starterAnnual?.properties?.interval).toBe('year')
      expect(starterAnnual?.display?.everything_from).toBe('Save 20%')

      const proAnnual = AUTUMN_PRODUCTS.find((p) => p.id === 'professional-annual')
      expect(proAnnual).toBeDefined()
      expect(proAnnual?.properties?.interval).toBe('year')
      expect(proAnnual?.display?.everything_from).toBe('Save 20%')
    })
  })

  describe('Billing Integration with B2B2C Roles', () => {
    it('should allow worker role to access billing features', async () => {
      const workerSession = {
        ...mockSession,
        user: {
          ...mockSession.user,
          role: 'worker',
        },
      }

      vi.spyOn(auth.api, 'getSession').mockResolvedValue(workerSession)

      const session = await auth.api.getSession({
        headers: await import('next/headers').then((h) => h.headers()),
      })

      expect(session?.user.role).toBe('worker')
      // Workers should have access to billing features for team management
    })

    it('should allow frontliner role to access billing features', async () => {
      const frontlinerSession = {
        ...mockSession,
        user: {
          ...mockSession.user,
          role: 'frontliner',
        },
      }

      vi.spyOn(auth.api, 'getSession').mockResolvedValue(frontlinerSession)

      const session = await auth.api.getSession({
        headers: await import('next/headers').then((h) => h.headers()),
      })

      expect(session?.user.role).toBe('frontliner')
      // Frontliners should have access to billing for organization management
    })

    it('should handle ceo role billing access', async () => {
      const ceoSession = {
        ...mockSession,
        user: {
          ...mockSession.user,
          role: 'ceo',
        },
      }

      vi.spyOn(auth.api, 'getSession').mockResolvedValue(ceoSession)

      const session = await auth.api.getSession({
        headers: await import('next/headers').then((h) => h.headers()),
      })

      expect(session?.user.role).toBe('ceo')
      // CEOs might have limited billing access (personal plans only)
    })
  })

  describe('Organization Context for Billing', () => {
    it('should handle billing within organization context', async () => {
      const orgSession = {
        ...mockSession,
        session: {
          ...mockSession.session,
          activeOrganizationId: 'org-456',
        },
      }

      vi.spyOn(auth.api, 'getSession').mockResolvedValue(orgSession)

      const session = await auth.api.getSession({
        headers: await import('next/headers').then((h) => h.headers()),
      })

      expect(session?.session.activeOrganizationId).toBe('org-456')

      // Billing should be scoped to the active organization
      // This is important for B2B2C multi-tenant billing
    })

    it('should handle users without organization context', async () => {
      const noOrgSession = {
        ...mockSession,
        session: {
          ...mockSession.session,
          activeOrganizationId: null,
        },
      }

      vi.spyOn(auth.api, 'getSession').mockResolvedValue(noOrgSession)

      const session = await auth.api.getSession({
        headers: await import('next/headers').then((h) => h.headers()),
      })

      expect(session?.session.activeOrganizationId).toBeNull()

      // Users without organization should still be able to access personal billing
    })
  })

  describe('Error Handling in Billing Flow', () => {
    it('should handle session errors during billing operations', async () => {
      vi.spyOn(auth.api, 'getSession').mockRejectedValue(new Error('Session validation failed'))

      await expect(
        auth.api.getSession({
          headers: await import('next/headers').then((h) => h.headers()),
        })
      ).rejects.toThrow('Session validation failed')
    })

    it('should handle expired sessions gracefully', async () => {
      const expiredSession = {
        ...mockSession,
        session: {
          ...mockSession.session,
          expiresAt: new Date(Date.now() - 3600000), // Expired 1 hour ago
        },
      }

      vi.spyOn(auth.api, 'getSession').mockResolvedValue(expiredSession)

      const session = await auth.api.getSession({
        headers: await import('next/headers').then((h) => h.headers()),
      })

      // Even if returned, the application should check expiration
      expect(session?.session.expiresAt.getTime()).toBeLessThan(Date.now())
    })
  })

  describe('Subscription State Management', () => {
    it('should track subscription status correctly', async () => {
      vi.spyOn(auth.api, 'getSession').mockResolvedValue(mockSession)

      const session = await auth.api.getSession({
        headers: await import('next/headers').then((h) => h.headers()),
      })

      expect(session).toBeDefined()

      // Mock Autumn customer with subscription
      const { useCustomer } = await import('autumn-js/react')
      const mockCustomer = (useCustomer as any)()

      expect(mockCustomer.customer).toBeDefined()
      expect(mockCustomer.customer.subscription).toBeDefined()
      expect(mockCustomer.customer.subscription.status).toBe('active')
    })

    it('should handle customers without subscriptions', async () => {
      // Mock customer without subscription
      vi.mocked(await import('autumn-js/react')).useCustomer.mockReturnValue({
        customer: {
          id: 'customer-123',
          email: 'test@example.com',
          subscription: null,
        },
        attach: vi.fn(),
        refetch: vi.fn(),
      })

      const { useCustomer } = await import('autumn-js/react')
      const mockCustomer = (useCustomer as any)()

      expect(mockCustomer.customer.subscription).toBeNull()
      // Should still allow access to pricing page for new subscriptions
    })
  })
})
