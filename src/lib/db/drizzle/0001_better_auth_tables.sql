-- Better Auth Tables Migration
-- This migration adds Better Auth tables to the existing database
-- Based on the generated auth-schema.ts

-- Create user table (Better Auth)
CREATE TABLE IF NOT EXISTS "user" (
    "id" text PRIMARY KEY,
    "name" text NOT NULL,
    "email" text NOT NULL UNIQUE,
    "email_verified" boolean NOT NULL DEFAULT false,
    "image" text,
    "created_at" timestamp NOT NULL DEFAULT now(),
    "updated_at" timestamp NOT NULL DEFAULT now()
);

-- Create session table (Better Auth)
CREATE TABLE IF NOT EXISTS "session" (
    "id" text PRIMARY KEY,
    "expires_at" timestamp NOT NULL,
    "token" text NOT NULL UNIQUE,
    "created_at" timestamp NOT NULL,
    "updated_at" timestamp NOT NULL,
    "ip_address" text,
    "user_agent" text,
    "user_id" text NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
    "active_organization_id" text
);

-- Create account table (Better Auth)
CREATE TABLE IF NOT EXISTS "account" (
    "id" text PRIMARY KEY,
    "account_id" text NOT NULL,
    "provider_id" text NOT NULL,
    "user_id" text NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
    "access_token" text,
    "refresh_token" text,
    "id_token" text,
    "access_token_expires_at" timestamp,
    "refresh_token_expires_at" timestamp,
    "scope" text,
    "password" text,
    "created_at" timestamp NOT NULL,
    "updated_at" timestamp NOT NULL
);

-- Create verification table (Better Auth)
CREATE TABLE IF NOT EXISTS "verification" (
    "id" text PRIMARY KEY,
    "identifier" text NOT NULL,
    "value" text NOT NULL,
    "expires_at" timestamp NOT NULL,
    "created_at" timestamp DEFAULT now(),
    "updated_at" timestamp DEFAULT now()
);

-- Create organization table (Organization plugin)
CREATE TABLE IF NOT EXISTS "organization" (
    "id" text PRIMARY KEY,
    "name" text NOT NULL,
    "slug" text UNIQUE,
    "logo" text,
    "created_at" timestamp NOT NULL,
    "metadata" text
);

-- Create member table (Organization plugin)
CREATE TABLE IF NOT EXISTS "member" (
    "id" text PRIMARY KEY,
    "organization_id" text NOT NULL REFERENCES "organization" ("id") ON DELETE CASCADE,
    "user_id" text NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
    "role" text NOT NULL DEFAULT 'member',
    "created_at" timestamp NOT NULL
);

-- Create invitation table (Organization plugin)
CREATE TABLE IF NOT EXISTS "invitation" (
    "id" text PRIMARY KEY,
    "organization_id" text NOT NULL REFERENCES "organization" ("id") ON DELETE CASCADE,
    "email" text NOT NULL,
    "role" text,
    "status" text NOT NULL DEFAULT 'pending',
    "expires_at" timestamp NOT NULL,
    "inviter_id" text NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS "session_user_id_idx" ON "session" ("user_id");

CREATE INDEX IF NOT EXISTS "session_token_idx" ON "session" ("token");

CREATE INDEX IF NOT EXISTS "account_user_id_idx" ON "account" ("user_id");

CREATE INDEX IF NOT EXISTS "account_provider_id_account_id_idx" ON "account" ("provider_id", "account_id");

CREATE INDEX IF NOT EXISTS "verification_identifier_value_idx" ON "verification" ("identifier", "value");

CREATE INDEX IF NOT EXISTS "member_organization_id_idx" ON "member" ("organization_id");

CREATE INDEX IF NOT EXISTS "member_user_id_idx" ON "member" ("user_id");

CREATE INDEX IF NOT EXISTS "invitation_organization_id_idx" ON "invitation" ("organization_id");

CREATE INDEX IF NOT EXISTS "invitation_email_idx" ON "invitation" ("email");

-- Add comments for documentation
COMMENT ON TABLE "user" IS 'Better Auth user table';

COMMENT ON TABLE "session" IS 'Better Auth session table';

COMMENT ON TABLE "account" IS 'Better Auth account table for OAuth providers';

COMMENT ON TABLE "verification" IS 'Better Auth verification table for email/password verification';

COMMENT ON TABLE "organization" IS 'Better Auth organization plugin table';

COMMENT ON TABLE "member" IS 'Better Auth organization member table';

COMMENT ON TABLE "invitation" IS 'Better Auth organization invitation table';