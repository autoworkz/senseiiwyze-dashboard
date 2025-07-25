/**
 * Intra-Database Synchronization Service
 * 
 * Handles synchronization within the same Supabase database between:
 * - auth.users (Supabase auth schema) - Mobile app source of truth
 * - "user" table (Better Auth) - Dashboard authentication
 * - workplaces table → organization table (Better Auth)
 * 
 * This service ensures data consistency across both auth systems without 
 * deleting existing users, maintaining mobile app functionality.
 */

import { supabase, sql } from './db';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export interface WorkplaceData {
  id: string;
  name: string;
  slug?: string;
  logo_url?: string;
  primary_owner_user_id: string;
  created_at: string;
  updated_at: string;
  metadata?: any;
}

export interface BetterAuthUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BetterAuthOrganization {
  id: string;
  name: string;
  slug?: string;
  logo?: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: any;
}

/**
 * Sync user from Supabase to Better Auth
 */
export async function syncUserToBetterAuth(supabaseUser: SupabaseUser): Promise<string | null> {
  try {
    // Check if user already exists in Better Auth
    const existingUser = await sql`
      SELECT id FROM "user" WHERE email = ${supabaseUser.email}
    `;

    if (existingUser.length > 0) {
      // Update existing user
      await sql`
        UPDATE "user" 
        SET 
          name = ${supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User'},
          image = ${supabaseUser.user_metadata?.avatar_url || null},
          "updatedAt" = NOW()
        WHERE email = ${supabaseUser.email}
      `;
      return existingUser[0].id;
    } else {
      // Create new user in Better Auth
      const newUser = await sql`
        INSERT INTO "user" (
          id,
          name,
          email,
          "emailVerified",
          image,
          "createdAt",
          "updatedAt"
        ) VALUES (
          gen_random_uuid()::text,
          ${supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User'},
          ${supabaseUser.email},
          ${!!supabaseUser.email_confirmed_at},
          ${supabaseUser.user_metadata?.avatar_url || null},
          ${new Date(supabaseUser.created_at)},
          NOW()
        )
        RETURNING id
      `;
      return newUser[0].id;
    }
  } catch (error) {
    console.error('Error syncing user to Better Auth:', error);
    return null;
  }
}

/**
 * Sync workplace from Supabase to Better Auth organization
 */
export async function syncWorkplaceToBetterAuth(workplace: WorkplaceData): Promise<string | null> {
  try {
    // First, ensure the owner user exists in Better Auth
    const supabaseOwner = await supabase.auth.admin.getUserById(workplace.primary_owner_user_id);
    
    if (supabaseOwner.error || !supabaseOwner.data.user) {
      console.error('Owner user not found in Supabase:', workplace.primary_owner_user_id);
      return null;
    }

    const betterAuthUserId = await syncUserToBetterAuth(supabaseOwner.data.user);
    if (!betterAuthUserId) {
      console.error('Failed to sync owner user to Better Auth');
      return null;
    }

    // Check if organization already exists
    const existingOrg = await sql`
      SELECT id FROM organization WHERE metadata->>'supabase_workplace_id' = ${workplace.id}
    `;

    if (existingOrg.length > 0) {
      // Update existing organization
      await sql`
        UPDATE organization 
        SET 
          name = ${workplace.name},
          slug = ${workplace.slug || workplace.name.toLowerCase().replace(/\s+/g, '-')},
          logo = ${workplace.logo_url || null},
          "updatedAt" = NOW(),
          metadata = jsonb_set(
            COALESCE(metadata, '{}'),
            '{supabase_workplace_id}',
            ${JSON.stringify(workplace.id)}
          )
        WHERE id = ${existingOrg[0].id}
      `;
      return existingOrg[0].id;
    } else {
      // Create new organization in Better Auth
      const newOrg = await sql`
        INSERT INTO organization (
          id,
          name,
          slug,
          logo,
          "createdAt",
          "updatedAt",
          metadata
        ) VALUES (
          gen_random_uuid()::text,
          ${workplace.name},
          ${workplace.slug || workplace.name.toLowerCase().replace(/\s+/g, '-')},
          ${workplace.logo_url || null},
          ${new Date(workplace.created_at)},
          NOW(),
          ${JSON.stringify({
            supabase_workplace_id: workplace.id,
            sync_source: 'supabase',
            ...workplace.metadata
          })}
        )
        RETURNING id
      `;

      const orgId = newOrg[0].id;

      // Create owner membership
      await sql`
        INSERT INTO member (
          id,
          "organizationId",
          "userId",
          role,
          "createdAt"
        ) VALUES (
          gen_random_uuid()::text,
          ${orgId},
          ${betterAuthUserId},
          'owner',
          NOW()
        )
      `;

      return orgId;
    }
  } catch (error) {
    console.error('Error syncing workplace to Better Auth:', error);
    return null;
  }
}

/**
 * Sync all workplaces from Supabase to Better Auth
 */
export async function syncAllWorkplaces(): Promise<{ success: number; failed: number }> {
  const stats = { success: 0, failed: 0 };

  try {
    // Get all workplaces from the database
    const workplaces = await sql`
      SELECT id, name, slug, logo_url, primary_owner_user_id, created_at, updated_at, metadata
      FROM workplaces
      ORDER BY created_at ASC
    `;

    for (const workplace of workplaces) {
      const result = await syncWorkplaceToBetterAuth(workplace as WorkplaceData);
      if (result) {
        stats.success++;
      } else {
        stats.failed++;
      }
    }
  } catch (error) {
    console.error('Error syncing all workplaces:', error);
    throw error;
  }

  return stats;
}

/**
 * Get synchronization status
 */
export async function getSyncStatus() {
  try {
    const [workplaceCount, betterAuthOrgCount, syncedOrgCount] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM workplaces`,
      sql`SELECT COUNT(*) as count FROM organization`,
      sql`SELECT COUNT(*) as count FROM organization WHERE metadata->>'supabase_workplace_id' IS NOT NULL`
    ]);

    return {
      workplaces: parseInt(workplaceCount[0].count),
      betterAuthOrganizations: parseInt(betterAuthOrgCount[0].count),
      syncedOrganizations: parseInt(syncedOrgCount[0].count),
      syncPercentage: workplaceCount[0].count > 0 
        ? Math.round((syncedOrgCount[0].count / workplaceCount[0].count) * 100)
        : 0
    };
  } catch (error) {
    console.error('Error getting sync status:', error);
    throw error;
  }
}

/**
 * Real-time sync webhook handler for Supabase changes
 */
export async function handleSupabaseWebhook(payload: any) {
  try {
    const { table, record, old_record, type } = payload;

    switch (table) {
      case 'workplaces':
        if (type === 'INSERT' || type === 'UPDATE') {
          await syncWorkplaceToBetterAuth(record);
        }
        // Note: We don't delete from Better Auth when Supabase records are deleted
        // to maintain dashboard functionality
        break;

      case 'auth.users':
        if (type === 'INSERT' || type === 'UPDATE') {
          await syncUserToBetterAuth(record);
        }
        break;

      default:
        console.log(`Unhandled table in webhook: ${table}`);
    }
  } catch (error) {
    console.error('Error handling Supabase webhook:', error);
    throw error;
  }
}

/**
 * Manual sync function for initial setup or recovery
 */
export async function performFullSync() {
  console.log('Starting full synchronization...');
  
  try {
    const workplaceStats = await syncAllWorkplaces();
    const syncStatus = await getSyncStatus();

    console.log('Full synchronization completed:', {
      workplaceStats,
      syncStatus
    });

    return {
      success: true,
      workplaceStats,
      syncStatus
    };
  } catch (error) {
    console.error('Full synchronization failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
