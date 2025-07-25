-- Create the better_auth schema
CREATE SCHEMA IF NOT EXISTS better_auth;

-- Grant permissions (adjust username as needed)
-- GRANT ALL ON SCHEMA better_auth TO postgres;
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA better_auth TO postgres;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA better_auth TO postgres;

-- Set search path to include better_auth schema
-- This allows queries to find tables in better_auth schema without prefixing
-- SET search_path TO better_auth, extensions, public;

-- Note: The actual tables will be created by Better Auth
-- This migration just sets up the schema structure