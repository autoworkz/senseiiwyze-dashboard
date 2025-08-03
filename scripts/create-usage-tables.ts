import { db } from '../lib/db';
import { sql } from 'drizzle-orm';

async function createUsageTables() {
  try {
    console.log('Creating usage tracking tables...');
    
    // Create usage tracking tables
    await db.execute(sql`
      -- Usage tracking for individual feature usage
      CREATE TABLE IF NOT EXISTS "ba_usage_tracking" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" text NOT NULL,
        "feature" text NOT NULL,
        "credits" integer DEFAULT 1 NOT NULL,
        "metadata" jsonb DEFAULT '{}'::jsonb,
        "created_at" timestamp DEFAULT now() NOT NULL
      );
    `);
    
    await db.execute(sql`
      -- Monthly usage summary for quick lookups
      CREATE TABLE IF NOT EXISTS "ba_usage_summary" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" text NOT NULL,
        "month" text NOT NULL,
        "total_credits" integer DEFAULT 0 NOT NULL,
        "assessments_taken" integer DEFAULT 0 NOT NULL,
        "reports_generated" integer DEFAULT 0 NOT NULL,
        "ai_interactions" integer DEFAULT 0 NOT NULL,
        "api_calls" integer DEFAULT 0 NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );
    `);
    
    await db.execute(sql`
      -- Credit balance tracking
      CREATE TABLE IF NOT EXISTS "ba_credit_balance" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" text NOT NULL UNIQUE,
        "total_credits" integer DEFAULT 0 NOT NULL,
        "used_credits" integer DEFAULT 0 NOT NULL,
        "bonus_credits" integer DEFAULT 0 NOT NULL,
        "monthly_allocation" integer DEFAULT 0 NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );
    `);
    
    await db.execute(sql`
      -- Credit transactions log
      CREATE TABLE IF NOT EXISTS "ba_credit_transactions" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" text NOT NULL,
        "type" text NOT NULL,
        "amount" integer NOT NULL,
        "balance" integer NOT NULL,
        "description" text,
        "metadata" jsonb DEFAULT '{}'::jsonb,
        "created_at" timestamp DEFAULT now() NOT NULL
      );
    `);
    
    // Create indexes
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "ba_usage_tracking_user_id_idx" ON "ba_usage_tracking" USING btree ("user_id");
    `);
    
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "ba_usage_tracking_feature_idx" ON "ba_usage_tracking" USING btree ("feature");
    `);
    
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "ba_usage_tracking_created_at_idx" ON "ba_usage_tracking" USING btree ("created_at" DESC);
    `);
    
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "ba_usage_summary_user_month_idx" ON "ba_usage_summary" USING btree ("user_id", "month");
    `);
    
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "ba_credit_transactions_user_id_idx" ON "ba_credit_transactions" USING btree ("user_id");
    `);
    
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "ba_credit_transactions_type_idx" ON "ba_credit_transactions" USING btree ("type");
    `);
    
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "ba_credit_transactions_created_at_idx" ON "ba_credit_transactions" USING btree ("created_at" DESC);
    `);
    
    // Add foreign key constraints
    await db.execute(sql`
      ALTER TABLE "ba_usage_tracking" ADD CONSTRAINT "ba_usage_tracking_user_id_fkey" 
      FOREIGN KEY ("user_id") REFERENCES "ba_users"("id") ON DELETE cascade ON UPDATE no action;
    `);
    
    await db.execute(sql`
      ALTER TABLE "ba_usage_summary" ADD CONSTRAINT "ba_usage_summary_user_id_fkey" 
      FOREIGN KEY ("user_id") REFERENCES "ba_users"("id") ON DELETE cascade ON UPDATE no action;
    `);
    
    await db.execute(sql`
      ALTER TABLE "ba_credit_balance" ADD CONSTRAINT "ba_credit_balance_user_id_fkey" 
      FOREIGN KEY ("user_id") REFERENCES "ba_users"("id") ON DELETE cascade ON UPDATE no action;
    `);
    
    await db.execute(sql`
      ALTER TABLE "ba_credit_transactions" ADD CONSTRAINT "ba_credit_transactions_user_id_fkey" 
      FOREIGN KEY ("user_id") REFERENCES "ba_users"("id") ON DELETE cascade ON UPDATE no action;
    `);
    
    console.log('✅ Usage tracking tables created successfully!');
    
    // Verify tables were created
    const tables = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name IN ('ba_usage_tracking', 'ba_usage_summary', 'ba_credit_balance', 'ba_credit_transactions')
      ORDER BY table_name;
    `);
    
    console.log('\nCreated tables:');
    console.log(tables.rows);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    process.exit(1);
  }
}

createUsageTables();