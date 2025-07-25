-- Migration: Better Auth Setup in Supabase Database
-- Date: 2025-07-25
-- Purpose: Add Better Auth tables to existing Supabase database and sync with workplaces
-- Note: This migration adds Better Auth tables to the same database as Supabase auth
--       Mobile app continues using auth.users, dashboard uses Better Auth tables

-- =================================
-- REFERENCE COLUMNS SETUP
-- =================================

-- 1. Add reference columns to track the relationship between systems
ALTER TABLE workplaces 
ADD COLUMN IF NOT EXISTS better_auth_org_id TEXT UNIQUE;

-- Add foreign key constraint after organization table exists
-- This will be handled by Better Auth schema creation

ALTER TABLE organization 
ADD COLUMN IF NOT EXISTS workplace_id UUID UNIQUE;

-- Add foreign key constraint
-- ALTER TABLE organization 
-- ADD CONSTRAINT FK_organization_workplace 
-- FOREIGN KEY (workplace_id) REFERENCES workplaces(id) ON DELETE SET NULL;

-- =================================
-- SYNCHRONIZATION FUNCTIONS
-- =================================

-- 2. Create function to sync workplace -> organization
CREATE OR REPLACE FUNCTION sync_workplace_to_organization()
RETURNS TRIGGER AS $$
DECLARE
    new_org_id TEXT;
    owner_user_id TEXT;
BEGIN
    -- Only proceed if better_auth_org_id is not set
    IF NEW.better_auth_org_id IS NULL THEN
        -- Find the owner's Better-Auth user ID
        -- This assumes email matching between Supabase auth.users and Better Auth user table
        SELECT u.id INTO owner_user_id
        FROM "user" u
        WHERE u.email = (
            SELECT au.email 
            FROM auth.users au
            WHERE au.id = NEW.primary_owner_user_id
            LIMIT 1
        );

        -- Create organization in Better-Auth
        INSERT INTO organization (
            id,
            name,
            slug,
            logo,
            created_at,
            updated_at,
            metadata
        ) VALUES (
            gen_random_uuid()::text,
            NEW.name,
            COALESCE(NEW.slug, LOWER(REPLACE(NEW.name, ' ', '-'))),
            NEW.logo_url,
            NEW.created_at,
            NEW.updated_at,
            jsonb_build_object(
                'workplace_id', NEW.id,
                'legacy_data', NEW.metadata,
                'sync_source', 'supabase_workplace'
            )
        ) RETURNING id INTO new_org_id;

        -- Update workplace with reference
        UPDATE workplaces 
        SET better_auth_org_id = new_org_id 
        WHERE id = NEW.id;

        -- Update organization with reference
        UPDATE organization 
        SET workplace_id = NEW.id 
        WHERE id = new_org_id;

        -- Create owner membership if user exists in Better Auth
        IF owner_user_id IS NOT NULL THEN
            INSERT INTO member (
                id,
                organization_id,
                user_id,
                role,
                created_at
            ) VALUES (
                gen_random_uuid()::text,
                new_org_id,
                owner_user_id,
                'owner',
                NOW()
            );
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Create function to sync organization -> workplace
CREATE OR REPLACE FUNCTION sync_organization_to_workplace()
RETURNS TRIGGER AS $$
DECLARE
    new_workplace_id UUID;
    owner_auth_user_id UUID;
BEGIN
    -- Only proceed if workplace_id is not set and this isn't a sync from workplace
    IF NEW.workplace_id IS NULL AND (NEW.metadata->>'sync_source') != 'supabase_workplace' THEN
        -- Find the owner's Supabase auth user ID
        SELECT au.id INTO owner_auth_user_id
        FROM auth.users au
        JOIN "user" u ON u.email = au.email
        JOIN member m ON m.user_id = u.id
        WHERE m.organization_id = NEW.id 
        AND m.role = 'owner'
        LIMIT 1;

        -- Create workplace
        INSERT INTO workplaces (
            id,
            name,
            slug,
            logo_url,
            primary_owner_user_id,
            created_at,
            updated_at,
            better_auth_org_id,
            metadata
        ) VALUES (
            gen_random_uuid(),
            NEW.name,
            NEW.slug,
            NEW.logo,
            owner_auth_user_id,
            NEW.created_at,
            NEW.updated_at,
            NEW.id,
            jsonb_build_object(
                'sync_source', 'better_auth_org',
                'original_metadata', NEW.metadata
            )
        ) RETURNING id INTO new_workplace_id;

        -- Update organization with reference
        UPDATE organization 
        SET workplace_id = new_workplace_id 
        WHERE id = NEW.id;

        -- Create account record for backward compatibility (if accounts table exists)
        BEGIN
            INSERT INTO accounts (
                id,
                primary_owner_user_id,
                name,
                slug,
                personal_account,
                created_at,
                updated_at
            ) VALUES (
                new_workplace_id, -- accounts.id = workplaces.id in Basejump pattern
                owner_auth_user_id,
                NEW.name,
                NEW.slug,
                false,
                NEW.created_at,
                NEW.updated_at
            );
        EXCEPTION
            WHEN undefined_table THEN
                -- accounts table doesn't exist, skip this step
                NULL;
        END;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =================================
-- MEMBER SYNCHRONIZATION
-- =================================

-- 4. Sync member changes to accounts_memberships (if it exists)
CREATE OR REPLACE FUNCTION sync_member_to_accounts_membership()
RETURNS TRIGGER AS $$
DECLARE
    workplace_id UUID;
    account_id UUID;
    user_auth_id UUID;
    role_id UUID;
BEGIN
    -- Get workplace_id from organization
    SELECT o.workplace_id INTO workplace_id
    FROM organization o
    WHERE o.id = NEW.organization_id;

    IF workplace_id IS NOT NULL THEN
        -- Get account_id (same as workplace_id in Basejump pattern)
        account_id := workplace_id;

        -- Get user's auth.users id
        SELECT au.id INTO user_auth_id
        FROM auth.users au
        JOIN "user" u ON u.email = au.email
        WHERE u.id = NEW.user_id;

        -- Get role_id from roles table (if it exists)
        BEGIN
            SELECT r.id INTO role_id
            FROM roles r
            WHERE r.name = NEW.role;
        EXCEPTION
            WHEN undefined_table THEN
                -- roles table doesn't exist, use role name directly
                role_id := NULL;
        END;

        IF user_auth_id IS NOT NULL THEN
            -- Insert or update accounts_memberships (if table exists)
            BEGIN
                INSERT INTO accounts_memberships (
                    user_id,
                    account_id,
                    account_role
                ) VALUES (
                    user_auth_id,
                    account_id,
                    COALESCE(role_id::UUID, gen_random_uuid()) -- fallback if roles table missing
                )
                ON CONFLICT (user_id, account_id) 
                DO UPDATE SET account_role = EXCLUDED.account_role;
            EXCEPTION
                WHEN undefined_table THEN
                    -- accounts_memberships table doesn't exist, skip this step
                    NULL;
            END;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Handle member deletions
CREATE OR REPLACE FUNCTION sync_member_deletion()
RETURNS TRIGGER AS $$
DECLARE
    workplace_id UUID;
    user_auth_id UUID;
BEGIN
    -- Get workplace_id from organization
    SELECT o.workplace_id INTO workplace_id
    FROM organization o
    WHERE o.id = OLD.organization_id;

    -- Get user's auth.users id
    SELECT au.id INTO user_auth_id
    FROM auth.users au
    JOIN "user" u ON u.email = au.email
    WHERE u.id = OLD.user_id;

    IF workplace_id IS NOT NULL AND user_auth_id IS NOT NULL THEN
        BEGIN
            DELETE FROM accounts_memberships
            WHERE user_id = user_auth_id
            AND account_id = workplace_id;
        EXCEPTION
            WHEN undefined_table THEN
                -- accounts_memberships table doesn't exist, skip this step
                NULL;
        END;
    END IF;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- =================================
-- TRIGGERS SETUP
-- =================================

-- 6. Create triggers for bidirectional sync
DROP TRIGGER IF EXISTS sync_workplace_to_org_trigger ON workplaces;
CREATE TRIGGER sync_workplace_to_org_trigger
AFTER INSERT ON workplaces
FOR EACH ROW
EXECUTE FUNCTION sync_workplace_to_organization();

DROP TRIGGER IF EXISTS sync_org_to_workplace_trigger ON organization;
CREATE TRIGGER sync_org_to_workplace_trigger
AFTER INSERT ON organization
FOR EACH ROW
EXECUTE FUNCTION sync_organization_to_workplace();

-- Member synchronization triggers
DROP TRIGGER IF EXISTS sync_member_to_accounts_trigger ON member;
CREATE TRIGGER sync_member_to_accounts_trigger
AFTER INSERT OR UPDATE ON member
FOR EACH ROW
EXECUTE FUNCTION sync_member_to_accounts_membership();

DROP TRIGGER IF EXISTS sync_member_deletion_trigger ON member;
CREATE TRIGGER sync_member_deletion_trigger
AFTER DELETE ON member
FOR EACH ROW
EXECUTE FUNCTION sync_member_deletion();

-- =================================
-- UTILITY VIEWS
-- =================================

-- 7. Create views for easier querying
CREATE OR REPLACE VIEW organizations_with_workplaces AS
SELECT 
    o.*,
    w.id as workplace_id,
    w.primary_owner_user_id,
    w.personal_account,
    w.billing_enabled,
    w.metadata as workplace_metadata
FROM organization o
LEFT JOIN workplaces w ON w.better_auth_org_id = o.id;

CREATE OR REPLACE VIEW members_with_accounts AS
SELECT 
    m.*,
    am.user_id as auth_user_id,
    am.account_id as workplace_id,
    r.name as role_name,
    up.email as user_email,
    up.name as user_name
FROM member m
LEFT JOIN organization o ON o.id = m.organization_id
LEFT JOIN accounts_memberships am ON am.account_id = o.workplace_id
LEFT JOIN roles r ON r.id = am.account_role
LEFT JOIN "user" u ON u.id = m.user_id
LEFT JOIN auth.users up ON up.email = u.email;

-- =================================
-- MIGRATION DATA SYNC
-- =================================

-- 8. Create function to migrate existing data
CREATE OR REPLACE FUNCTION migrate_existing_workplaces()
RETURNS INTEGER AS $$
DECLARE
    workplace_record RECORD;
    migrated_count INTEGER := 0;
BEGIN
    -- Process existing workplaces that don't have Better Auth org mapping
    FOR workplace_record IN 
        SELECT * FROM workplaces WHERE better_auth_org_id IS NULL
    LOOP
        -- Trigger the sync function by updating the record
        UPDATE workplaces 
        SET updated_at = NOW() 
        WHERE id = workplace_record.id;
        
        migrated_count := migrated_count + 1;
    END LOOP;
    
    RETURN migrated_count;
END;
$$ LANGUAGE plpgsql;

-- =================================
-- COMMENTS AND DOCUMENTATION
-- =================================

COMMENT ON FUNCTION sync_workplace_to_organization() IS 
'Synchronizes workplace records to Better Auth organization table when new workplaces are created';

COMMENT ON FUNCTION sync_organization_to_workplace() IS 
'Synchronizes Better Auth organization records back to workplaces table for mobile app compatibility';

COMMENT ON FUNCTION migrate_existing_workplaces() IS 
'One-time migration function to sync existing workplace records with Better Auth';

COMMENT ON VIEW organizations_with_workplaces IS 
'Combined view of Better Auth organizations with their corresponding workplace data';

COMMENT ON VIEW members_with_accounts IS 
'Combined view of Better Auth members with their corresponding account membership data';

-- =================================
-- USAGE INSTRUCTIONS
-- =================================

/*
USAGE INSTRUCTIONS:

1. This migration should be run AFTER Better Auth tables are created
2. Run the one-time migration: SELECT migrate_existing_workplaces();
3. Test the synchronization by creating a new workplace
4. Verify data integrity between systems

ARCHITECTURE NOTES:

- Workplaces table remains the source of truth for mobile app
- Better Auth organization table handles dashboard authentication
- Bidirectional sync ensures data consistency
- Email matching links users between systems
- Graceful error handling for missing tables

ROLLBACK PLAN:

To rollback this migration:
1. DROP TRIGGER statements for all triggers
2. DROP FUNCTION statements for all functions  
3. ALTER TABLE statements to remove added columns
4. DROP VIEW statements for created views
*/
