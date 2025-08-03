import { db } from '../../lib/db'
import { 
  ba_usageTracking, 
  ba_usageSummary, 
  ba_creditBalance, 
  ba_creditTransactions
} from '../../drizzle/usage-tracking-schema'
import { eq, and, desc } from 'drizzle-orm'

interface TrackUsageParams {
  userId: string
  feature: 'assessment' | 'ai_chat' | 'report' | 'api_call'
  credits?: number
  metadata?: Record<string, any>
}

interface TrackUsageResult {
  success: boolean
  remainingCredits: number
  error?: string
}

interface AddCreditsParams {
  userId: string
  amount: number
  type: 'purchase' | 'usage' | 'refund' | 'bonus' | 'monthly_allocation'
  description?: string
  metadata?: Record<string, any>
}

interface AddCreditsResult {
  success: boolean
  newBalance: number
  error?: string
}

interface UsageSummaryResult {
  currentMonth: {
    totalCredits: number
    assessmentsTaken: number
    reportsGenerated: number
    aiInteractions: number
    apiCalls: number
  }
  availableCredits: number
}

export class UsageTrackingService {
  async trackUsage(params: TrackUsageParams): Promise<TrackUsageResult> {
    const { userId, feature, credits = 1, metadata = {} } = params

    try {
      // Start transaction
      return await db.transaction(async (tx) => {
        // Get current balance
        const [balance] = await tx
          .select()
          .from(ba_creditBalance)
          .where(eq(ba_creditBalance.userId, userId))
          .limit(1)

        if (!balance) {
          return {
            success: false,
            remainingCredits: 0,
            error: 'User not found'
          }
        }

        const availableCredits = balance.totalCredits + balance.bonusCredits - balance.usedCredits
        
        if (availableCredits < credits) {
          return {
            success: false,
            remainingCredits: availableCredits,
            error: 'Insufficient credits'
          }
        }

        // Track usage
        await tx.insert(ba_usageTracking).values({
          userId,
          feature,
          credits,
          metadata
        })

        // Update balance
        await tx
          .update(ba_creditBalance)
          .set({
            usedCredits: balance.usedCredits + credits,
            updatedAt: new Date().toISOString()
          })
          .where(eq(ba_creditBalance.userId, userId))

        // Update or create monthly summary
        const currentMonth = new Date().toISOString().slice(0, 7)
        const [existingSummary] = await tx
          .select()
          .from(ba_usageSummary)
          .where(
            and(
              eq(ba_usageSummary.userId, userId),
              eq(ba_usageSummary.month, currentMonth)
            )
          )
          .limit(1)

        const summaryUpdate = {
          totalCredits: (existingSummary?.totalCredits || 0) + credits,
          assessmentsTaken: (existingSummary?.assessmentsTaken || 0) + (feature === 'assessment' ? 1 : 0),
          reportsGenerated: (existingSummary?.reportsGenerated || 0) + (feature === 'report' ? 1 : 0),
          aiInteractions: (existingSummary?.aiInteractions || 0) + (feature === 'ai_chat' ? 1 : 0),
          apiCalls: (existingSummary?.apiCalls || 0) + (feature === 'api_call' ? 1 : 0),
          updatedAt: new Date().toISOString()
        }

        if (existingSummary) {
          await tx
            .update(ba_usageSummary)
            .set(summaryUpdate)
            .where(eq(ba_usageSummary.id, existingSummary.id))
        } else {
          await tx.insert(ba_usageSummary).values({
            userId,
            month: currentMonth,
            ...summaryUpdate
          })
        }

        // Create transaction record
        const newBalance = availableCredits - credits
        await tx.insert(ba_creditTransactions).values({
          userId,
          type: 'usage',
          amount: -credits,
          balance: newBalance,
          description: `Used ${credits} credits for ${feature}`,
          metadata: { feature, ...metadata }
        })

        return {
          success: true,
          remainingCredits: newBalance
        }
      })
    } catch (error) {
      console.error('Error tracking usage:', error)
      return {
        success: false,
        remainingCredits: 0,
        error: 'Failed to track usage'
      }
    }
  }

  async getAvailableCredits(userId: string): Promise<number> {
    try {
      const [balance] = await db
        .select()
        .from(ba_creditBalance)
        .where(eq(ba_creditBalance.userId, userId))
        .limit(1)

      if (!balance) return 0

      return balance.totalCredits + balance.bonusCredits - balance.usedCredits
    } catch (error) {
      console.error('Error getting available credits:', error)
      return 0
    }
  }

  async addCredits(params: AddCreditsParams): Promise<AddCreditsResult> {
    const { userId, amount, type, description, metadata = {} } = params

    try {
      return await db.transaction(async (tx) => {
        // Get or create balance
        let [balance] = await tx
          .select()
          .from(ba_creditBalance)
          .where(eq(ba_creditBalance.userId, userId))
          .limit(1)

        if (!balance) {
          // Create initial balance
          await tx.insert(ba_creditBalance).values({
            userId,
            totalCredits: 0,
            usedCredits: 0,
            bonusCredits: 0,
            monthlyAllocation: 0
          })
          
          const result = await tx
            .select()
            .from(ba_creditBalance)
            .where(eq(ba_creditBalance.userId, userId))
            .limit(1)
          balance = result[0]
        }

        // Update balance based on type
        const updates: any = { updatedAt: new Date().toISOString() }
        
        if (type === 'purchase') {
          updates.totalCredits = balance.totalCredits + amount
        } else if (type === 'bonus') {
          updates.bonusCredits = balance.bonusCredits + amount
        } else if (type === 'monthly_allocation') {
          updates.totalCredits = balance.totalCredits + amount
          updates.monthlyAllocation = balance.monthlyAllocation + amount
        } else if (type === 'refund') {
          updates.usedCredits = Math.max(0, balance.usedCredits - amount)
        }

        await tx
          .update(ba_creditBalance)
          .set(updates)
          .where(eq(ba_creditBalance.userId, userId))

        // Calculate new balance based on updated values
        const updatedBalance = await tx
          .select()
          .from(ba_creditBalance)
          .where(eq(ba_creditBalance.userId, userId))
          .limit(1)
        
        const newBalance = updatedBalance[0]
        const newAvailableCredits = newBalance.totalCredits + newBalance.bonusCredits - newBalance.usedCredits

        // Create transaction record
        await tx.insert(ba_creditTransactions).values({
          userId,
          type,
          amount: type === 'usage' ? -amount : amount,
          balance: newAvailableCredits,
          description,
          metadata
        })

        return {
          success: true,
          newBalance: newAvailableCredits
        }
      })
    } catch (error) {
      console.error('Error adding credits:', error)
      return {
        success: false,
        newBalance: 0,
        error: 'Failed to add credits'
      }
    }
  }

  async getUsageSummary(userId: string): Promise<UsageSummaryResult> {
    try {
      const currentMonth = new Date().toISOString().slice(0, 7)
      
      const [summary] = await db
        .select()
        .from(ba_usageSummary)
        .where(
          and(
            eq(ba_usageSummary.userId, userId),
            eq(ba_usageSummary.month, currentMonth)
          )
        )
        .limit(1)

      const availableCredits = await this.getAvailableCredits(userId)

      return {
        currentMonth: {
          totalCredits: summary?.totalCredits || 0,
          assessmentsTaken: summary?.assessmentsTaken || 0,
          reportsGenerated: summary?.reportsGenerated || 0,
          aiInteractions: summary?.aiInteractions || 0,
          apiCalls: summary?.apiCalls || 0
        },
        availableCredits
      }
    } catch (error) {
      console.error('Error getting usage summary:', error)
      return {
        currentMonth: {
          totalCredits: 0,
          assessmentsTaken: 0,
          reportsGenerated: 0,
          aiInteractions: 0,
          apiCalls: 0
        },
        availableCredits: 0
      }
    }
  }

  async getCreditHistory(userId: string, limit: number = 10): Promise<any[]> {
    try {
      const transactions = await db
        .select()
        .from(ba_creditTransactions)
        .where(eq(ba_creditTransactions.userId, userId))
        .orderBy(desc(ba_creditTransactions.createdAt))
        .limit(limit)

      return transactions
    } catch (error) {
      console.error('Error getting credit history:', error)
      return []
    }
  }
}