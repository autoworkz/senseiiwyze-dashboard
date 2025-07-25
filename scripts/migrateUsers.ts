// scripts/migrateUsers.ts
import { createClient } from '@supabase/supabase-js';
import postgres from 'postgres';

// Configuration
interface MigrationConfig {
  batchSize: number;
  maxRetries: number;
  retryDelay: number;
  dryRun: boolean;
}

const config: MigrationConfig = {
  batchSize: 100,
  maxRetries: 3,
  retryDelay: 1000,
  dryRun: process.env.DRY_RUN === 'true'
};

// Database connections
const oldDbClient = postgres(process.env.OLD_DATABASE_URL!);
const newDbClient = postgres(process.env.NEW_DATABASE_URL!);

// Supabase client for auth operations
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// Migration state tracking
interface MigrationState {
  id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  last_processed_id?: string;
  processed_count: number;
  error_count: number;
  created_at: Date;
  updated_at: Date;
}

// User data interface
interface OldUser {
  id: string;
  email: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  created_at: Date;
  updated_at: Date;
}

interface NewUser {
  email: string;
  email_confirm: boolean;
  user_metadata: {
    username?: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
    migrated_from?: string;
    original_id?: string;
  };
  app_metadata: {
    provider: string;
    migrated: boolean;
    migration_date: string;
  };
}

class UserMigration {
  private migrationId: string;
  private state: MigrationState;

  constructor() {
    this.migrationId = `migration_${Date.now()}`;
    this.state = {
      id: this.migrationId,
      status: 'pending',
      processed_count: 0,
      error_count: 0,
      created_at: new Date(),
      updated_at: new Date()
    };
  }

  /**
   * Initialize migration state tracking table
   */
  async initializeMigrationTracking(): Promise<void> {
    await newDbClient`
      CREATE TABLE IF NOT EXISTS migration_states (
        id VARCHAR PRIMARY KEY,
        status VARCHAR NOT NULL,
        last_processed_id VARCHAR,
        processed_count INTEGER DEFAULT 0,
        error_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await newDbClient`
      CREATE TABLE IF NOT EXISTS migration_errors (
        id SERIAL PRIMARY KEY,
        migration_id VARCHAR REFERENCES migration_states(id),
        user_id VARCHAR,
        error_message TEXT,
        error_details JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    // Create idempotency tracking table
    await newDbClient`
      CREATE TABLE IF NOT EXISTS migrated_users (
        original_id VARCHAR PRIMARY KEY,
        new_auth_id UUID,
        email VARCHAR NOT NULL,
        migrated_at TIMESTAMP DEFAULT NOW(),
        migration_id VARCHAR REFERENCES migration_states(id)
      );
    `;
  }

  /**
   * Save migration state to database
   */
  async saveMigrationState(): Promise<void> {
    this.state.updated_at = new Date();
    
    await newDbClient`
      INSERT INTO migration_states (id, status, last_processed_id, processed_count, error_count, created_at, updated_at)
      VALUES (${this.state.id}, ${this.state.status}, ${this.state.last_processed_id}, ${this.state.processed_count}, ${this.state.error_count}, ${this.state.created_at}, ${this.state.updated_at})
      ON CONFLICT (id) 
      DO UPDATE SET 
        status = EXCLUDED.status,
        last_processed_id = EXCLUDED.last_processed_id,
        processed_count = EXCLUDED.processed_count,
        error_count = EXCLUDED.error_count,
        updated_at = EXCLUDED.updated_at;
    `;
  }

  /**
   * Check if user has already been migrated (idempotency check)
   */
  async isUserMigrated(userId: string): Promise<boolean> {
    const result = await newDb.execute(`
      SELECT 1 FROM migrated_users WHERE original_id = $1
    `, [userId]);
    
    return result.length > 0;
  }

  /**
   * Get users to migrate with cursor-based pagination
   */
  async getUsersToMigrate(lastProcessedId?: string, limit: number = config.batchSize): Promise<OldUser[]> {
    let query = `
      SELECT id, email, username, first_name, last_name, avatar_url, created_at, updated_at
      FROM profiles
      WHERE email IS NOT NULL
    `;
    
    const params: any[] = [];
    
    if (lastProcessedId) {
      query += ` AND id > $1`;
      params.push(lastProcessedId);
    }
    
    query += ` ORDER BY id LIMIT $${params.length + 1}`;
    params.push(limit);

    const result = await oldDb.execute(query, params);
    return result.rows as OldUser[];
  }

  /**
   * Transform old user data to new format
   */
  transformUserData(oldUser: OldUser): NewUser {
    return {
      email: oldUser.email,
      email_confirm: true, // Auto-confirm migrated users
      user_metadata: {
        username: oldUser.username,
        first_name: oldUser.first_name,
        last_name: oldUser.last_name,
        avatar_url: oldUser.avatar_url,
        migrated_from: 'legacy_system',
        original_id: oldUser.id
      },
      app_metadata: {
        provider: 'migration',
        migrated: true,
        migration_date: new Date().toISOString()
      }
    };
  }

  /**
   * Migrate a single user with retry logic
   */
  async migrateUser(oldUser: OldUser, retryCount: number = 0): Promise<boolean> {
    try {
      // Check idempotency
      if (await this.isUserMigrated(oldUser.id)) {
        console.log(`User ${oldUser.email} already migrated, skipping...`);
        return true;
      }

      if (config.dryRun) {
        console.log(`[DRY RUN] Would migrate user: ${oldUser.email}`);
        return true;
      }

      // Transform data
      const newUserData = this.transformUserData(oldUser);

      // Begin transaction for atomic operation
      await newDbClient.begin(async (tx: any) => {
        // Create user in Supabase Auth
        const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
          email: newUserData.email,
          email_confirm: newUserData.email_confirm,
          user_metadata: newUserData.user_metadata,
          app_metadata: newUserData.app_metadata
        });

        if (authError) {
          throw new Error(`Auth creation failed: ${authError.message}`);
        }

        // Record successful migration for idempotency
        await tx.execute(`
          INSERT INTO migrated_users (original_id, new_auth_id, email, migration_id)
          VALUES ($1, $2, $3, $4)
        `, [oldUser.id, authUser.user.id, oldUser.email, this.migrationId]);

        console.log(`✅ Migrated user: ${oldUser.email} -> ${authUser.user.id}`);
      });

      return true;

    } catch (error) {
      console.error(`❌ Failed to migrate user ${oldUser.email}:`, error);

      // Log error to database
      await this.logError(oldUser.id, error);

      // Retry logic
      if (retryCount < config.maxRetries) {
        console.log(`Retrying migration for ${oldUser.email} (attempt ${retryCount + 1}/${config.maxRetries})`);
        await this.delay(config.retryDelay * Math.pow(2, retryCount)); // Exponential backoff
        return this.migrateUser(oldUser, retryCount + 1);
      }

      return false;
    }
  }

  /**
   * Log migration error
   */
  async logError(userId: string, error: any): Promise<void> {
    await newDb.execute(`
      INSERT INTO migration_errors (migration_id, user_id, error_message, error_details)
      VALUES ($1, $2, $3, $4)
    `, [
      this.migrationId,
      userId,
      error.message || 'Unknown error',
      JSON.stringify({ stack: error.stack, ...error })
    ]);
  }

  /**
   * Utility function for delays
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Main migration function
   */
  async migrate(): Promise<void> {
    console.log(`🚀 Starting user migration (ID: ${this.migrationId})`);
    console.log(`Configuration:`, config);

    try {
      // Initialize tracking
      await this.initializeMigrationTracking();
      
      this.state.status = 'in_progress';
      await this.saveMigrationState();

      let lastProcessedId = this.state.last_processed_id;
      let hasMoreUsers = true;

      while (hasMoreUsers) {
        // Get batch of users
        const users = await this.getUsersToMigrate(lastProcessedId, config.batchSize);
        
        if (users.length === 0) {
          hasMoreUsers = false;
          break;
        }

        console.log(`📦 Processing batch of ${users.length} users...`);

        // Process batch
        for (const user of users) {
          const success = await this.migrateUser(user);
          
          if (success) {
            this.state.processed_count++;
          } else {
            this.state.error_count++;
          }

          this.state.last_processed_id = user.id;
        }

        // Save progress
        await this.saveMigrationState();

        console.log(`Progress: ${this.state.processed_count} processed, ${this.state.error_count} errors`);

        // Update for next iteration
        lastProcessedId = users[users.length - 1].id;
      }

      this.state.status = 'completed';
      await this.saveMigrationState();

      console.log(`✅ Migration completed successfully!`);
      console.log(`📊 Final stats: ${this.state.processed_count} processed, ${this.state.error_count} errors`);

    } catch (error) {
      console.error('💥 Migration failed:', error);
      this.state.status = 'failed';
      await this.saveMigrationState();
      throw error;
    }
  }

  /**
   * Resume a failed migration
   */
  async resumeMigration(migrationId: string): Promise<void> {
    const result = await newDb.execute(`
      SELECT * FROM migration_states WHERE id = $1
    `, [migrationId]);

    if (result.rows.length === 0) {
      throw new Error(`Migration ${migrationId} not found`);
    }

    const savedState = result.rows[0] as any;
    this.migrationId = savedState.id;
    this.state = {
      id: savedState.id,
      status: savedState.status,
      last_processed_id: savedState.last_processed_id,
      processed_count: savedState.processed_count,
      error_count: savedState.error_count,
      created_at: savedState.created_at,
      updated_at: savedState.updated_at
    };

    console.log(`🔄 Resuming migration from user ID: ${this.state.last_processed_id}`);
    await this.migrate();
  }

  /**
   * Rollback migration (for testing/emergency)
   */
  async rollback(): Promise<void> {
    console.log(`🔄 Rolling back migration ${this.migrationId}...`);
    
    if (config.dryRun) {
      console.log('[DRY RUN] Would rollback migration');
      return;
    }

    // Get all migrated users for this migration
    const result = await newDb.execute(`
      SELECT new_auth_id, email FROM migrated_users WHERE migration_id = $1
    `, [this.migrationId]);

    for (const row of result.rows) {
      try {
        await supabase.auth.admin.deleteUser(row.new_auth_id as string);
        console.log(`Deleted user: ${row.email}`);
      } catch (error) {
        console.error(`Failed to delete user ${row.email}:`, error);
      }
    }

    // Clean up tracking data
    await newDb.execute(`DELETE FROM migrated_users WHERE migration_id = $1`, [this.migrationId]);
    await newDb.execute(`DELETE FROM migration_errors WHERE migration_id = $1`, [this.migrationId]);
    await newDb.execute(`DELETE FROM migration_states WHERE id = $1`, [this.migrationId]);

    console.log('✅ Rollback completed');
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  const migration = new UserMigration();

  try {
    switch (command) {
      case 'migrate':
        await migration.migrate();
        break;
      
      case 'resume':
        const migrationId = args[1];
        if (!migrationId) {
          throw new Error('Migration ID required for resume');
        }
        await migration.resumeMigration(migrationId);
        break;
      
      case 'rollback':
        await migration.rollback();
        break;
      
      default:
        console.log('Usage:');
        console.log('  npm run migrate -- migrate     # Start new migration');
        console.log('  npm run migrate -- resume <id> # Resume failed migration');
        console.log('  npm run migrate -- rollback    # Rollback current migration');
        process.exit(1);
    }
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    // Close database connections
    await oldDbClient.end();
    await newDbClient.end();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { UserMigration };
