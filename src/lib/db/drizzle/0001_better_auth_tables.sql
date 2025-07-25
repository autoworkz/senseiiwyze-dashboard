-- Better Auth Tables Migration
-- This migration adds Better Auth tables to the existing database
-- Based on the generated auth-schema.ts

-- Create better_auth schema
CREATE SCHEMA IF NOT EXISTS better_auth;

-- Create user table (Better Auth)
CREATE TABLE IF NOT EXISTS better_auth."user" (
    "id" text PRIMARY KEY,
    "name" text NOT NULL,
    "email" text NOT NULL UNIQUE,
    "email_verified" boolean NOT NULL DEFAULT false,
    "image" text,
    "created_at" timestamp NOT NULL DEFAULT now(),
    "updated_at" timestamp NOT NULL DEFAULT now()
);

-- Create session table (Better Auth)
CREATE TABLE IF NOT EXISTS better_auth."session" (
    "id" text PRIMARY KEY,
    "expires_at" timestamp NOT NULL,
    "token" text NOT NULL UNIQUE,
    "created_at" timestamp NOT NULL,
    "updated_at" timestamp NOT NULL,
    "ip_address" text,
    "user_agent" text,
    "user_id" text NOT NULL REFERENCES better_auth."user" ("id") ON DELETE CASCADE,
    "active_organization_id" text
);

-- Create account table (Better Auth)
CREATE TABLE IF NOT EXISTS better_auth."account" (
    "id" text PRIMARY KEY,
    "account_id" text NOT NULL,
    "provider_id" text NOT NULL,
    "user_id" text NOT NULL REFERENCES better_auth."user" ("id") ON DELETE CASCADE,
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
CREATE TABLE IF NOT EXISTS better_auth."verification" (
    "id" text PRIMARY KEY,
    "identifier" text NOT NULL,
    "value" text NOT NULL,
    "expires_at" timestamp NOT NULL,
    "created_at" timestamp DEFAULT now(),
    "updated_at" timestamp DEFAULT now()
);

-- Create organization table (Organization plugin)
CREATE TABLE IF NOT EXISTS better_auth."organization" (
    "id" text PRIMARY KEY,
    "name" text NOT NULL,
    "slug" text UNIQUE,
    "logo" text,
    "created_at" timestamp NOT NULL,
    "metadata" text
);

-- Create member table (Organization plugin)
CREATE TABLE IF NOT EXISTS better_auth."member" (
    "id" text PRIMARY KEY,
    "organization_id" text NOT NULL REFERENCES better_auth."organization" ("id") ON DELETE CASCADE,
    "user_id" text NOT NULL REFERENCES better_auth."user" ("id") ON DELETE CASCADE,
    "role" text NOT NULL DEFAULT 'member',
    "created_at" timestamp NOT NULL
);

-- Create invitation table (Organization plugin)
CREATE TABLE IF NOT EXISTS better_auth."invitation" (
    "id" text PRIMARY KEY,
    "organization_id" text NOT NULL REFERENCES better_auth."organization" ("id") ON DELETE CASCADE,
    "email" text NOT NULL,
    "role" text,
    "status" text NOT NULL DEFAULT 'pending',
    "expires_at" timestamp NOT NULL,
    "inviter_id" text NOT NULL REFERENCES better_auth."user" ("id") ON DELETE CASCADE
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS "better_auth_session_user_id_idx" ON better_auth."session" ("user_id");

CREATE INDEX IF NOT EXISTS "better_auth_session_token_idx" ON better_auth."session" ("token");

CREATE INDEX IF NOT EXISTS "better_auth_account_user_id_idx" ON better_auth."account" ("user_id");

CREATE INDEX IF NOT EXISTS "better_auth_account_provider_id_account_id_idx" ON better_auth."account" ("provider_id", "account_id");

CREATE INDEX IF NOT EXISTS "better_auth_verification_identifier_value_idx" ON better_auth."verification" ("identifier", "value");

CREATE INDEX IF NOT EXISTS "better_auth_member_organization_id_idx" ON better_auth."member" ("organization_id");

CREATE INDEX IF NOT EXISTS "better_auth_member_user_id_idx" ON better_auth."member" ("user_id");

CREATE INDEX IF NOT EXISTS "better_auth_invitation_organization_id_idx" ON better_auth."invitation" ("organization_id");

CREATE INDEX IF NOT EXISTS "better_auth_invitation_email_idx" ON better_auth."invitation" ("email");

-- Add comments for documentation
COMMENT ON TABLE better_auth."user" IS 'Better Auth user table';

COMMENT ON TABLE better_auth."session" IS 'Better Auth session table';

COMMENT ON TABLE better_auth."account" IS 'Better Auth account table for OAuth providers';

COMMENT ON TABLE better_auth."verification" IS 'Better Auth verification table for email/password verification';

COMMENT ON TABLE better_auth."organization" IS 'Better Auth organization plugin table';

COMMENT ON TABLE better_auth."member" IS 'Better Auth organization member table';

COMMENT ON TABLE better_auth."invitation" IS 'Better Auth organization invitation table';