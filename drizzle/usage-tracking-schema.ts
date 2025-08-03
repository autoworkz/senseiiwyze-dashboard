import { pgTable, text, uuid, integer, jsonb, timestamp, index, foreignKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { users } from "../lib/db/schema.auth"

// Usage tracking for billing and analytics
export const ba_usageTracking = pgTable("ba_usage_tracking", {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  userId: text('user_id').notNull(),
  feature: text('feature').notNull(), // 'assessment', 'ai_chat', 'report', 'api_call'
  credits: integer('credits').default(1).notNull(),
  metadata: jsonb('metadata').default({}), // Additional data like assessment_id, chat_id, etc.
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
  index("ba_usage_tracking_user_id_idx").using("btree", table.userId.asc().nullsLast()),
  index("ba_usage_tracking_feature_idx").using("btree", table.feature.asc().nullsLast()),
  index("ba_usage_tracking_created_at_idx").using("btree", table.createdAt.desc().nullsLast()),
  foreignKey({
    columns: [table.userId],
    foreignColumns: [users.id],
    name: "ba_usage_tracking_user_id_fkey"
  }).onDelete("cascade"),
]);

// Monthly usage summary for quick lookups
export const ba_usageSummary = pgTable("ba_usage_summary", {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  userId: text('user_id').notNull(),
  month: text('month').notNull(), // Format: 'YYYY-MM'
  totalCredits: integer('total_credits').default(0).notNull(),
  assessmentsTaken: integer('assessments_taken').default(0).notNull(),
  reportsGenerated: integer('reports_generated').default(0).notNull(),
  aiInteractions: integer('ai_interactions').default(0).notNull(),
  apiCalls: integer('api_calls').default(0).notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
  index("ba_usage_summary_user_month_idx").using("btree", table.userId.asc().nullsLast(), table.month.asc().nullsLast()),
  foreignKey({
    columns: [table.userId],
    foreignColumns: [users.id],
    name: "ba_usage_summary_user_id_fkey"
  }).onDelete("cascade"),
]);

// Credit balance tracking
export const ba_creditBalance = pgTable("ba_credit_balance", {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  userId: text('user_id').notNull().unique(),
  totalCredits: integer('total_credits').default(0).notNull(), // Total credits purchased
  usedCredits: integer('used_credits').default(0).notNull(), // Credits consumed
  bonusCredits: integer('bonus_credits').default(0).notNull(), // Promotional credits
  monthlyAllocation: integer('monthly_allocation').default(0).notNull(), // Monthly credit allocation from subscription
  updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
  foreignKey({
    columns: [table.userId],
    foreignColumns: [users.id],
    name: "ba_credit_balance_user_id_fkey"
  }).onDelete("cascade"),
]);

// Credit transactions log
export const ba_creditTransactions = pgTable("ba_credit_transactions", {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  userId: text('user_id').notNull(),
  type: text('type').notNull(), // 'purchase', 'usage', 'refund', 'bonus', 'monthly_allocation'
  amount: integer('amount').notNull(), // Positive for additions, negative for usage
  balance: integer('balance').notNull(), // Balance after transaction
  description: text('description'),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
  index("ba_credit_transactions_user_id_idx").using("btree", table.userId.asc().nullsLast()),
  index("ba_credit_transactions_type_idx").using("btree", table.type.asc().nullsLast()),
  index("ba_credit_transactions_created_at_idx").using("btree", table.createdAt.desc().nullsLast()),
  foreignKey({
    columns: [table.userId],
    foreignColumns: [users.id],
    name: "ba_credit_transactions_user_id_fkey"
  }).onDelete("cascade"),
]);

// Type exports for use in application
export type UsageTracking = typeof ba_usageTracking.$inferSelect;
export type NewUsageTracking = typeof ba_usageTracking.$inferInsert;
export type UsageSummary = typeof ba_usageSummary.$inferSelect;
export type NewUsageSummary = typeof ba_usageSummary.$inferInsert;
export type CreditBalance = typeof ba_creditBalance.$inferSelect;
export type NewCreditBalance = typeof ba_creditBalance.$inferInsert;
export type CreditTransaction = typeof ba_creditTransactions.$inferSelect;
export type NewCreditTransaction = typeof ba_creditTransactions.$inferInsert;