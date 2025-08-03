-- Create usage tracking tables for billing and analytics

-- Usage tracking for individual feature usage
CREATE TABLE IF NOT EXISTS "ba_usage_tracking" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"feature" text NOT NULL,
	"credits" integer DEFAULT 1 NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);

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

-- Create indexes
CREATE INDEX IF NOT EXISTS "ba_usage_tracking_user_id_idx" ON "ba_usage_tracking" USING btree ("user_id");
CREATE INDEX IF NOT EXISTS "ba_usage_tracking_feature_idx" ON "ba_usage_tracking" USING btree ("feature");
CREATE INDEX IF NOT EXISTS "ba_usage_tracking_created_at_idx" ON "ba_usage_tracking" USING btree ("created_at" DESC);

CREATE INDEX IF NOT EXISTS "ba_usage_summary_user_month_idx" ON "ba_usage_summary" USING btree ("user_id", "month");

CREATE INDEX IF NOT EXISTS "ba_credit_transactions_user_id_idx" ON "ba_credit_transactions" USING btree ("user_id");
CREATE INDEX IF NOT EXISTS "ba_credit_transactions_type_idx" ON "ba_credit_transactions" USING btree ("type");
CREATE INDEX IF NOT EXISTS "ba_credit_transactions_created_at_idx" ON "ba_credit_transactions" USING btree ("created_at" DESC);

-- Add foreign key constraints
DO $$ BEGIN
 ALTER TABLE "ba_usage_tracking" ADD CONSTRAINT "ba_usage_tracking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "ba_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "ba_usage_summary" ADD CONSTRAINT "ba_usage_summary_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "ba_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "ba_credit_balance" ADD CONSTRAINT "ba_credit_balance_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "ba_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "ba_credit_transactions" ADD CONSTRAINT "ba_credit_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "ba_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;