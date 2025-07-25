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

import { supabase, db } from './db';
import { sql } from 'drizzle-orm';
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
    const existingUser = await db.execute(sql`
      SELECT id FROM "user" WHERE email = ${supabaseUser.email || ''}
    `);

    if (existingUser.length > 0) {
      // Update existing user
      await db.execute(sql`
        UPDATE "user" 
        SET 
          name = ${supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User'},
          image = ${supabaseUser.user_metadata?.avatar_url || null},
          "updatedAt" = NOW()
        WHERE email = ${supabaseUser.email || ''}
      `);
      return existingUser[0].id as string;
    } else {
      // Create new user in Better Auth
      const newUser = await db.execute(sql`
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
          ${supabaseUser.email || ''},
          ${!!supabaseUser.email_confirmed_at},
          ${supabaseUser.user_metadata?.avatar_url || null},
          ${new Date(supabaseUser.created_at)},
          NOW()
        )
        RETURNING id
      `);
      return newUser[0].id as string;
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
    const existingOrg = await db.execute(sql`
      SELECT id FROM organization WHERE metadata->>'supabase_workplace_id' = ${workplace.id}
    `);

    if (existingOrg.length > 0) {
      // Update existing organization
      await db.execute(sql`
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
      `);
      return existingOrg[0].id as string;
    } else {
      // Create new organization in Better Auth
      const newOrg = await db.execute(sql`
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
          jsonb_build_object('supabase_workplace_id', ${workplace.id})
        )
        RETURNING id
      `);

      const orgId = newOrg[0].id as string;

      // Create owner membership
      await db.execute(sql`
        INSERT INTO member (
          id,
          "userId",
          "organizationId",
          role,
          "createdAt",
          "updatedAt"
        ) VALUES (
          gen_random_uuid()::text,
          ${betterAuthUserId},
          ${orgId},
          'owner',
          NOW(),
          NOW()
        )
      `);

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
  try {
    // Get all workplaces from the database
    const workplaces = await db.execute(sql`
      SELECT id, name, slug, logo_url, primary_owner_user_id, created_at, updated_at, metadata
      FROM workplaces
      ORDER BY created_at ASC
    `);

    let success = 0;
    let failed = 0;

    for (const workplace of workplaces) {
      try {
        const workplaceData: WorkplaceData = {
          id: workplace.id as string,
          name: workplace.name as string,
          slug: workplace.slug as string | undefined,
          logo_url: workplace.logo_url as string | undefined,
          primary_owner_user_id: workplace.primary_owner_user_id as string,
          created_at: workplace.created_at as string,
          updated_at: workplace.updated_at as string,
          metadata: workplace.metadata as any
        };

        const result = await syncWorkplaceToBetterAuth(workplaceData);
        if (result) {
          success++;
        } else {
          failed++;
        }
      } catch (error) {
        console.error('Error syncing workplace:', workplace.id, error);
        failed++;
      }
    }

    return { success, failed };
  } catch (error) {
    console.error('Error in syncAllWorkplaces:', error);
    return { success: 0, failed: 0 };
  }
}

/**
 * Get sync status
 */
export async function getSyncStatus() {
  try {
    const [workplaceCount, betterAuthOrgCount, syncedOrgCount] = await Promise.all([
      db.execute(sql`SELECT COUNT(*) as count FROM workplaces`),
      db.execute(sql`SELECT COUNT(*) as count FROM organization`),
      db.execute(sql`SELECT COUNT(*) as count FROM organization WHERE metadata->>'supabase_workplace_id' IS NOT NULL`)
    ]);

    return {
      totalWorkplaces: (workplaceCount[0] as any).count,
      totalBetterAuthOrgs: (betterAuthOrgCount[0] as any).count,
      syncedOrgs: (syncedOrgCount[0] as any).count,
      syncPercentage: (workplaceCount[0] as any).count > 0 
        ? Math.round(((syncedOrgCount[0] as any).count / (workplaceCount[0] as any).count) * 100)
        : 0
    };
  } catch (error) {
    console.error('Error getting sync status:', error);
    return {
      totalWorkplaces: 0,
      totalBetterAuthOrgs: 0,
      syncedOrgs: 0,
      syncPercentage: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
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
