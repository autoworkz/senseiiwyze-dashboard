import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { db } from '../../../lib/db'
import { 
  ba_usageTracking, 
  ba_usageSummary, 
  ba_creditBalance, 
  ba_creditTransactions 
} from '../../../drizzle/usage-tracking-schema'
import { users } from '../../../lib/db/schema.auth'
import { eq, and } from 'drizzle-orm'
import { UsageTrackingService } from '../usage-tracking.service'

describe('UsageTrackingService', () => {
  const testUserId = 'test-user-123'
  let service: UsageTrackingService

  beforeEach(async () => {
    service = new UsageTrackingService()
    
    // Clean up test data
    await db.delete(ba_usageTracking).where(eq(ba_usageTracking.userId, testUserId))
    await db.delete(ba_usageSummary).where(eq(ba_usageSummary.userId, testUserId))
    await db.delete(ba_creditBalance).where(eq(ba_creditBalance.userId, testUserId))
    await db.delete(ba_creditTransactions).where(eq(ba_creditTransactions.userId, testUserId))
    
    // Create test user
    await db.insert(users).values({
      id: testUserId,
      email: 'test@example.com',
      name: 'Test User',
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }).onConflictDoNothing()
    
    // Initialize test user with credits
    await db.insert(ba_creditBalance).values({
      userId: testUserId,
      totalCredits: 100,
      usedCredits: 0,
      bonusCredits: 10,
      monthlyAllocation: 50
    })
  })
  
  afterEach(async () => {
    // Clean up test user
    await db.delete(users).where(eq(users.id, testUserId))
  })

  describe('trackUsage', () => {
    it('should track feature usage and deduct credits', async () => {
      const result = await service.trackUsage({
        userId: testUserId,
        feature: 'assessment',
        credits: 5,
        metadata: { assessmentId: 'test-assessment-1' }
      })

      expect(result.success).toBe(true)
      expect(result.remainingCredits).toBe(105) // 100 + 10 bonus - 5 used

      // Verify usage tracking record
      const [tracking] = await db
        .select()
        .from(ba_usageTracking)
        .where(eq(ba_usageTracking.userId, testUserId))
        .limit(1)

      expect(tracking).toBeDefined()
      expect(tracking.feature).toBe('assessment')
      expect(tracking.credits).toBe(5)
      expect(tracking.metadata).toEqual({ assessmentId: 'test-assessment-1' })
    })

    it('should update usage summary for the month', async () => {
      await service.trackUsage({
        userId: testUserId,
        feature: 'assessment',
        credits: 5
      })

      await service.trackUsage({
        userId: testUserId,
        feature: 'ai_chat',
        credits: 2
      })

      const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM format
      const [summary] = await db
        .select()
        .from(ba_usageSummary)
        .where(
          and(
            eq(ba_usageSummary.userId, testUserId),
            eq(ba_usageSummary.month, currentMonth)
          )
        )
        .limit(1)

      expect(summary).toBeDefined()
      expect(summary.totalCredits).toBe(7)
      expect(summary.assessmentsTaken).toBe(1)
      expect(summary.aiInteractions).toBe(1)
    })

    it('should fail when insufficient credits', async () => {
      // Use up all credits
      await service.trackUsage({
        userId: testUserId,
        feature: 'assessment',
        credits: 110
      })

      // Try to use more
      const result = await service.trackUsage({
        userId: testUserId,
        feature: 'ai_chat',
        credits: 5
      })

      expect(result.success).toBe(false)
      expect(result.error).toBe('Insufficient credits')
      expect(result.remainingCredits).toBe(0)
    })

    it('should create credit transaction records', async () => {
      await service.trackUsage({
        userId: testUserId,
        feature: 'report',
        credits: 10
      })

      const [transaction] = await db
        .select()
        .from(ba_creditTransactions)
        .where(
          and(
            eq(ba_creditTransactions.userId, testUserId),
            eq(ba_creditTransactions.type, 'usage')
          )
        )
        .limit(1)

      expect(transaction).toBeDefined()
      expect(transaction.amount).toBe(-10) // Negative for usage
      expect(transaction.balance).toBe(100) // 110 - 10
    })
  })

  describe('getAvailableCredits', () => {
    it('should calculate available credits correctly', async () => {
      const credits = await service.getAvailableCredits(testUserId)
      expect(credits).toBe(110) // 100 total + 10 bonus

      // Use some credits
      await service.trackUsage({
        userId: testUserId,
        feature: 'assessment',
        credits: 30
      })

      const remainingCredits = await service.getAvailableCredits(testUserId)
      expect(remainingCredits).toBe(80) // 110 - 30
    })

    it('should return 0 for non-existent user', async () => {
      const credits = await service.getAvailableCredits('non-existent-user')
      expect(credits).toBe(0)
    })
  })

  describe('addCredits', () => {
    it('should add purchased credits', async () => {
      const result = await service.addCredits({
        userId: testUserId,
        amount: 50,
        type: 'purchase',
        description: 'Purchased 50 credits'
      })

      expect(result.success).toBe(true)
      expect(result.newBalance).toBe(160) // 110 + 50

      const [balance] = await db
        .select()
        .from(ba_creditBalance)
        .where(eq(ba_creditBalance.userId, testUserId))
        .limit(1)

      expect(balance.totalCredits).toBe(150) // 100 + 50
    })

    it('should add bonus credits', async () => {
      const result = await service.addCredits({
        userId: testUserId,
        amount: 20,
        type: 'bonus',
        description: 'Welcome bonus'
      })

      expect(result.success).toBe(true)
      expect(result.newBalance).toBe(130) // 110 + 20

      const [balance] = await db
        .select()
        .from(ba_creditBalance)
        .where(eq(ba_creditBalance.userId, testUserId))
        .limit(1)

      expect(balance.bonusCredits).toBe(30) // 10 + 20
    })

    it('should add monthly allocation', async () => {
      const result = await service.addCredits({
        userId: testUserId,
        amount: 50,
        type: 'monthly_allocation',
        description: 'Monthly credit allocation'
      })

      expect(result.success).toBe(true)
      expect(result.newBalance).toBe(160) // 110 + 50
    })
  })

  describe('getUsageSummary', () => {
    it('should return monthly usage summary', async () => {
      // Track various usage
      await service.trackUsage({ userId: testUserId, feature: 'assessment', credits: 5 })
      await service.trackUsage({ userId: testUserId, feature: 'ai_chat', credits: 2 })
      await service.trackUsage({ userId: testUserId, feature: 'report', credits: 8 })
      await service.trackUsage({ userId: testUserId, feature: 'api_call', credits: 1 })

      const summary = await service.getUsageSummary(testUserId)

      expect(summary.currentMonth.totalCredits).toBe(16)
      expect(summary.currentMonth.assessmentsTaken).toBe(1)
      expect(summary.currentMonth.aiInteractions).toBe(1)
      expect(summary.currentMonth.reportsGenerated).toBe(1)
      expect(summary.currentMonth.apiCalls).toBe(1)
      expect(summary.availableCredits).toBe(94) // 110 - 16
    })

    it('should handle user with no usage', async () => {
      const summary = await service.getUsageSummary(testUserId)

      expect(summary.currentMonth.totalCredits).toBe(0)
      expect(summary.availableCredits).toBe(110)
    })
  })

  describe('getCreditHistory', () => {
    it('should return credit transaction history', async () => {
      // Add some transactions
      await service.addCredits({
        userId: testUserId,
        amount: 50,
        type: 'purchase',
        description: 'Initial purchase'
      })

      await service.trackUsage({
        userId: testUserId,
        feature: 'assessment',
        credits: 10
      })

      await service.addCredits({
        userId: testUserId,
        amount: 20,
        type: 'bonus',
        description: 'Referral bonus'
      })

      const history = await service.getCreditHistory(testUserId, 10)

      expect(history).toHaveLength(3)
      expect(history[0].type).toBe('bonus') // Most recent first
      expect(history[1].type).toBe('usage')
      expect(history[2].type).toBe('purchase')
    })

    it('should limit results', async () => {
      // Add many transactions directly to the database for speed
      const transactions = []
      for (let i = 0; i < 15; i++) {
        transactions.push({
          userId: testUserId,
          type: 'usage' as const,
          amount: -1,
          balance: 110 - i,
          description: `Test transaction ${i}`,
          metadata: {}
        })
      }
      
      await db.insert(ba_creditTransactions).values(transactions)

      const history = await service.getCreditHistory(testUserId, 10)
      expect(history).toHaveLength(10)
    })
  })
})