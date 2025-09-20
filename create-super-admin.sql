-- Create Super Admin User Script for SenseiiWyze
-- Run this in Supabase SQL Editor

-- Step 1: Create the primary super admin user
INSERT INTO public.ba_users (
  id,
  name,
  email,
  email_verified,
  created_at,
  updated_at,
  role
) VALUES (
  'super-admin-001',                    -- Unique ID for the super admin
  'Platform Administrator',             -- Display name
  'admin@senseiwyze.com',              -- Email (CHANGE THIS TO YOUR EMAIL)
  true,                                -- Email verified (true for super admin)
  NOW(),                               -- Created timestamp
  NOW(),                               -- Updated timestamp
  'super-admin'                        -- Role
);

-- Step 2: Create the password account for login
-- Password: "SuperAdmin123!" (CHANGE THIS PASSWORD)
INSERT INTO public.ba_accounts (
  id,
  account_id,
  provider_id,
  user_id,
  password,
  created_at,
  updated_at
) VALUES (
  'super-admin-account-001',           -- Unique account ID
  'super-admin-001',                   -- Same as user ID for email/password accounts
  'credential',                        -- Provider type for email/password
  'super-admin-001',                   -- Links to the user record above
  '$2a$10$N9qo8uLOickgx2ZMRZoMye6p294mkldOXdw6LjTmQjwDp4Y0jOmIW',  -- "SuperAdmin123!"
  NOW(),                               -- Created timestamp
  NOW()                                -- Updated timestamp
);

-- Optional: Create a second super admin for development
INSERT INTO public.ba_users (
  id,
  name,
  email,
  email_verified,
  created_at,
  updated_at,
  role
) VALUES (
  'super-admin-002',
  'Developer Admin',
  'dev@senseiwyze.com',               -- CHANGE THIS TO YOUR DEV EMAIL
  true,
  NOW(),
  NOW(),
  'super-admin'
);

INSERT INTO public.ba_accounts (
  id,
  account_id,
  provider_id,
  user_id,
  password,
  created_at,
  updated_at
) VALUES (
  'super-admin-account-002',
  'super-admin-002',
  'credential',
  'super-admin-002',
  '$2a$10$N9qo8uLOickgx2ZMRZoMye6p294mkldOXdw6LjTmQjwDp4Y0jOmIW',  -- Same password
  NOW(),
  NOW()
);

-- Verify the creation
SELECT 
  u.id,
  u.name,
  u.email,
  u.role,
  u.email_verified,
  a.provider_id
FROM public.ba_users u
JOIN public.ba_accounts a ON u.id = a.user_id
WHERE u.role = 'super-admin';

-- IMPORTANT NOTES:
-- 1. Change the email to your actual email address
-- 2. The password hash above is for "password" - you should change this
-- 3. To generate a new password hash, use: https://bcrypt-generator.com/
-- 4. Use bcrypt rounds = 10 for the hash
-- 5. Remove this script after running it for security
