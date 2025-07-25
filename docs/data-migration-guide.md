# Data Migration Scripts Guide

## Overview

This guide provides comprehensive instructions for safely migrating user data with built-in idempotency and transaction safety mechanisms.

## Key Safety Features

### 1. Idempotency

**Definition**: The migration can be run multiple times without causing duplicate data or side effects.

**Implementation**:
- **Tracking Table**: `migrated_users` table tracks all successfully migrated users
- **Pre-Check**: Before migrating each user, the script checks if they've already been migrated
- **Skip Logic**: Already migrated users are automatically skipped
- **Unique Constraints**: Database constraints prevent duplicate entries

```sql
-- Idempotency tracking table
CREATE TABLE migrated_users (
  original_id VARCHAR PRIMARY KEY,  -- Prevents duplicates
  new_auth_id UUID,
  email VARCHAR NOT NULL,
  migrated_at TIMESTAMP DEFAULT NOW(),
  migration_id VARCHAR REFERENCES migration_states(id)
);
```

### 2. Transaction Safety

**Definition**: Each user migration is atomic - either completely succeeds or completely fails.

**Implementation**:
- **Database Transactions**: Each user migration wrapped in a transaction
- **Rollback on Failure**: If any step fails, the entire user migration is rolled back
- **Atomic Operations**: Auth user creation and tracking record insertion happen together

```typescript
// Transaction example
await newDbClient.begin(async (tx) => {
  // Step 1: Create user in Supabase Auth
  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({...});
  
  if (authError) {
    throw new Error(`Auth creation failed: ${authError.message}`);
    // Transaction automatically rolls back
  }

  // Step 2: Record migration in tracking table
  await tx.execute(`
    INSERT INTO migrated_users (original_id, new_auth_id, email, migration_id)
    VALUES ($1, $2, $3, $4)
  `, [oldUser.id, authUser.user.id, oldUser.email, this.migrationId]);

  // Both steps succeed together or fail together
});
```

## Setup and Configuration

### Environment Variables

Create a `.env` file with the following variables:

```bash
# Database connections
OLD_DATABASE_URL=postgresql://user:pass@localhost:5432/old_db
NEW_DATABASE_URL=postgresql://user:pass@localhost:5432/new_db

# Supabase configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key

# Migration settings
DRY_RUN=false  # Set to true for testing
```

### Dependencies

Install required packages:

```bash
npm install pg postgres drizzle-orm @supabase/supabase-js
npm install -D @types/pg
```

### Package.json Scripts

Add migration scripts to your `package.json`:

```json
{
  "scripts": {
    "migrate": "ts-node scripts/migrateUsers.ts",
    "migrate:dry-run": "DRY_RUN=true ts-node scripts/migrateUsers.ts migrate",
    "migrate:resume": "ts-node scripts/migrateUsers.ts resume",
    "migrate:rollback": "ts-node scripts/migrateUsers.ts rollback"
  }
}
```

## Usage Instructions

### 1. Dry Run (Recommended First Step)

Test the migration without making any changes:

```bash
npm run migrate:dry-run
```

This will:
- Connect to databases
- Process users in batches
- Log what would be migrated
- Not create any actual users

### 2. Start Migration

Begin the actual migration:

```bash
npm run migrate -- migrate
```

### 3. Resume Failed Migration

If a migration fails partway through, resume from where it left off:

```bash
npm run migrate -- resume migration_1234567890
```

The migration ID is shown in the console output when starting a migration.

### 4. Rollback Migration

In case of emergency, rollback a completed migration:

```bash
npm run migrate -- rollback
```

**Warning**: This will delete all users created by the current migration.

## Safety Mechanisms in Detail

### 1. Batch Processing

- **Configurable Batch Size**: Process users in small batches (default: 100)
- **Memory Efficiency**: Prevents memory overload with large datasets
- **Progress Tracking**: Save progress after each batch
- **Resumable**: Can resume from last processed batch

### 2. Error Handling

- **Retry Logic**: Failed user migrations retry up to 3 times
- **Exponential Backoff**: Increasing delays between retries
- **Error Logging**: All errors logged to `migration_errors` table
- **Graceful Degradation**: Single user failures don't stop entire migration

### 3. State Persistence

- **Migration States**: Track overall migration progress
- **Checkpoint System**: Resume from last successful checkpoint
- **Audit Trail**: Complete history of migration attempts

### 4. Validation Checks

```typescript
// Example validation before migration
async getUsersToMigrate(lastProcessedId?: string, limit: number): Promise<OldUser[]> {
  let query = `
    SELECT id, email, username, first_name, last_name, avatar_url, created_at, updated_at
    FROM profiles
    WHERE email IS NOT NULL  -- Only migrate users with valid emails
      AND email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'  -- Email format validation
  `;
  // ... rest of implementation
}
```

## Monitoring and Troubleshooting

### Progress Monitoring

The script provides real-time progress updates:

```
🚀 Starting user migration (ID: migration_1234567890)
📦 Processing batch of 100 users...
Progress: 100 processed, 2 errors
📦 Processing batch of 98 users...
Progress: 198 processed, 3 errors
✅ Migration completed successfully!
📊 Final stats: 1000 processed, 5 errors
```

### Error Investigation

Query the error log for failed migrations:

```sql
SELECT 
  me.user_id,
  me.error_message,
  me.error_details,
  me.created_at
FROM migration_errors me
JOIN migration_states ms ON me.migration_id = ms.id
WHERE ms.id = 'migration_1234567890'
ORDER BY me.created_at;
```

### Migration Status

Check migration progress:

```sql
SELECT 
  id,
  status,
  processed_count,
  error_count,
  last_processed_id,
  created_at,
  updated_at
FROM migration_states
ORDER BY created_at DESC;
```

## Best Practices

### 1. Pre-Migration Checklist

- [ ] Run data quality checks on source data
- [ ] Verify database connections
- [ ] Test with dry run
- [ ] Backup target database
- [ ] Set appropriate batch size for your data volume
- [ ] Schedule during low-traffic periods

### 2. During Migration

- [ ] Monitor progress logs
- [ ] Watch for error patterns
- [ ] Keep terminal session active (consider using `screen` or `tmux`)
- [ ] Have rollback plan ready

### 3. Post-Migration

- [ ] Verify user counts match expectations
- [ ] Test user authentication
- [ ] Check for any missing data
- [ ] Clean up temporary migration tables (optional)

### 4. Data Validation

Add custom validation for your specific use case:

```typescript
// Example: Custom validation before migration
private async validateUser(user: OldUser): Promise<boolean> {
  // Check email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(user.email)) {
    console.warn(`Invalid email format: ${user.email}`);
    return false;
  }

  // Check for required fields
  if (!user.email || !user.id) {
    console.warn(`Missing required fields for user: ${user.id}`);
    return false;
  }

  // Custom business logic
  if (user.email.includes('test') && process.env.NODE_ENV === 'production') {
    console.warn(`Skipping test user in production: ${user.email}`);
    return false;
  }

  return true;
}
```

## Troubleshooting Common Issues

### Issue: Migration Stuck

**Symptoms**: No progress for extended period
**Solutions**:
1. Check database connections
2. Look for blocking queries
3. Restart with resume command
4. Reduce batch size

### Issue: High Error Rate

**Symptoms**: Many users failing to migrate
**Solutions**:
1. Check error logs for patterns
2. Validate source data quality
3. Verify Supabase service key permissions
4. Check rate limits

### Issue: Memory Issues

**Symptoms**: Process crashes with out-of-memory errors
**Solutions**:
1. Reduce batch size in configuration
2. Optimize user data transformation
3. Add garbage collection hints

### Issue: Duplicate Users

**Symptoms**: Users appear multiple times in target system
**Solutions**:
1. Check idempotency table integrity
2. Verify unique constraints
3. Run duplicate detection query
4. Use rollback if necessary

## Advanced Configuration

### Custom Batch Processing

```typescript
const config: MigrationConfig = {
  batchSize: 50,        // Smaller batches for large user objects
  maxRetries: 5,        // More retries for unreliable networks
  retryDelay: 2000,     // Longer delays between retries
  dryRun: false
};
```

### Custom Data Transformation

```typescript
transformUserData(oldUser: OldUser): NewUser {
  return {
    email: oldUser.email.toLowerCase(), // Normalize email
    email_confirm: true,
    user_metadata: {
      username: oldUser.username?.toLowerCase(),
      first_name: this.capitalizeFirst(oldUser.first_name),
      last_name: this.capitalizeFirst(oldUser.last_name),
      avatar_url: this.validateUrl(oldUser.avatar_url),
      migrated_from: 'legacy_system',
      original_id: oldUser.id,
      migration_batch: Math.floor(Date.now() / 1000) // Add batch identifier
    },
    app_metadata: {
      provider: 'migration',
      migrated: true,
      migration_date: new Date().toISOString(),
      original_created_at: oldUser.created_at.toISOString()
    }
  };
}
```

This comprehensive migration script provides enterprise-grade safety mechanisms while maintaining flexibility for different migration scenarios.

## Backward Compatibility Layer

During the migration period, we implement a dual-write strategy to ensure zero-downtime migration from Supabase Auth to Better-Auth. This approach allows us to maintain both systems simultaneously while gradually transitioning users.

### Dual-Write Strategy Overview

The dual-write strategy involves:

1. **Simultaneous Writes**: New user signups write to both Supabase and Better-Auth
2. **Feature Flag Control**: Toggle between systems using environment variables
3. **Fallback Logic**: Graceful degradation if one system fails
4. **Gradual Migration**: Existing users migrated in batches
5. **Validation**: Cross-system data consistency checks

### Environment Configuration

Add the following environment variables to control the dual-write behavior:

```bash
# .env
# Better-Auth Migration Control
USE_BETTER_AUTH=true
MIGRATION_MODE=dual_write  # Options: supabase_only, dual_write, better_auth_only
MIGRATION_VALIDATION=true  # Enable cross-system validation
MIGRATION_FALLBACK_TIMEOUT=5000  # Timeout for fallback logic (ms)

# Better-Auth Configuration
BETTER_AUTH_SECRET=your-better-auth-secret
BETTER_AUTH_DATABASE_URL=postgresql://user:pass@localhost:5432/better_auth_db

# Supabase Configuration (existing)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
```

### Dual-Write Implementation

#### 1. Enhanced AuthService with Dual-Write Logic

```typescript
// src/lib/auth/dual-write-auth-service.ts
import { supabase } from '@/lib/supabase'
import { betterAuth } from '@/lib/better-auth'
import { logger } from '@/lib/logger'

interface DualWriteConfig {
  useBetterAuth: boolean
  migrationMode: 'supabase_only' | 'dual_write' | 'better_auth_only'
  validationEnabled: boolean
  fallbackTimeout: number
}

class DualWriteAuthService {
  private config: DualWriteConfig
  
  constructor() {
    this.config = {
      useBetterAuth: process.env.USE_BETTER_AUTH === 'true',
      migrationMode: (process.env.MIGRATION_MODE as any) || 'dual_write',
      validationEnabled: process.env.MIGRATION_VALIDATION === 'true',
      fallbackTimeout: parseInt(process.env.MIGRATION_FALLBACK_TIMEOUT || '5000')
    }
  }

  async signup(userData: {
    email: string
    password: string
    metadata?: Record<string, any>
  }) {
    const { email, password, metadata } = userData
    const results = { supabase: null, betterAuth: null, errors: [] as Error[] }

    switch (this.config.migrationMode) {
      case 'supabase_only':
        return await this.signupSupabase(email, password, metadata)
        
      case 'better_auth_only':
        return await this.signupBetterAuth(email, password, metadata)
        
      case 'dual_write':
      default:
        return await this.signupDualWrite(email, password, metadata)
    }
  }

  private async signupDualWrite(
    email: string, 
    password: string, 
    metadata?: Record<string, any>
  ) {
    const promises = []
    const results = { supabase: null, betterAuth: null, errors: [] as Error[] }

    // Start both operations simultaneously
    if (this.shouldWriteToSupabase()) {
      promises.push(
        this.signupSupabase(email, password, metadata)
          .then(result => { results.supabase = result })
          .catch(error => {
            logger.error('Supabase signup failed during dual-write:', error)
            results.errors.push(error)
          })
      )
    }

    if (this.shouldWriteToBetterAuth()) {
      promises.push(
        this.signupBetterAuth(email, password, metadata)
          .then(result => { results.betterAuth = result })
          .catch(error => {
            logger.error('Better-Auth signup failed during dual-write:', error)
            results.errors.push(error)
          })
      )
    }

    // Wait for both operations with timeout
    await Promise.allSettled(promises)

    // Validate consistency if enabled
    if (this.config.validationEnabled && results.supabase && results.betterAuth) {
      await this.validateUserConsistency(results.supabase.user, results.betterAuth.user)
    }

    // Return primary result based on configuration
    const primaryResult = this.config.useBetterAuth 
      ? results.betterAuth || results.supabase
      : results.supabase || results.betterAuth

    if (!primaryResult && results.errors.length > 0) {
      throw new Error(`All signup attempts failed: ${results.errors.map(e => e.message).join(', ')}`)
    }

    return primaryResult
  }

  private async signupSupabase(email: string, password: string, metadata?: Record<string, any>) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            ...metadata,
            migration_source: 'dual_write',
            created_via: 'supabase'
          }
        }
      })

      if (error) throw error
      
      logger.info(`User created in Supabase: ${email}`)
      return data
    } catch (error) {
      logger.error('Supabase signup error:', error)
      throw error
    }
  }

  private async signupBetterAuth(email: string, password: string, metadata?: Record<string, any>) {
    try {
      const result = await betterAuth.signUp.email({
        email,
        password,
        ...metadata,
        migration_source: 'dual_write',
        created_via: 'better_auth'
      })

      logger.info(`User created in Better-Auth: ${email}`)
      return result
    } catch (error) {
      logger.error('Better-Auth signup error:', error)
      throw error
    }
  }

  async login(email: string, password: string) {
    const authMethods = this.getAuthMethodPriority()
    let lastError: Error | null = null

    for (const method of authMethods) {
      try {
        const result = await this.attemptLogin(method, email, password)
        if (result) {
          logger.info(`Login successful via ${method}: ${email}`)
          return result
        }
      } catch (error) {
        logger.warn(`Login failed via ${method}: ${error.message}`)
        lastError = error as Error
        continue // Try next method
      }
    }

    // If all methods fail, throw the last error
    throw lastError || new Error('All login methods failed')
  }

  private async attemptLogin(method: 'supabase' | 'better_auth', email: string, password: string) {
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error(`${method} login timeout`)), this.config.fallbackTimeout)
    )

    if (method === 'supabase') {
      const loginPromise = supabase.auth.signInWithPassword({ email, password })
      const { data, error } = await Promise.race([loginPromise, timeout]) as any
      
      if (error) throw error
      return data
    } else {
      const loginPromise = betterAuth.signIn.email({ email, password })
      return await Promise.race([loginPromise, timeout])
    }
  }

  private getAuthMethodPriority(): ('supabase' | 'better_auth')[] {
    switch (this.config.migrationMode) {
      case 'supabase_only':
        return ['supabase']
      case 'better_auth_only':
        return ['better_auth']
      case 'dual_write':
      default:
        // Primary system first, then fallback
        return this.config.useBetterAuth 
          ? ['better_auth', 'supabase']
          : ['supabase', 'better_auth']
    }
  }

  private shouldWriteToSupabase(): boolean {
    return ['supabase_only', 'dual_write'].includes(this.config.migrationMode)
  }

  private shouldWriteToBetterAuth(): boolean {
    return ['better_auth_only', 'dual_write'].includes(this.config.migrationMode)
  }

  private async validateUserConsistency(supabaseUser: any, betterAuthUser: any) {
    const discrepancies = []

    if (supabaseUser.email !== betterAuthUser.email) {
      discrepancies.push(`Email mismatch: ${supabaseUser.email} vs ${betterAuthUser.email}`)
    }

    if (discrepancies.length > 0) {
      logger.warn('User data consistency issues:', discrepancies)
      // Optionally send to monitoring system
      await this.reportConsistencyIssues(supabaseUser.id, discrepancies)
    }
  }

  private async reportConsistencyIssues(userId: string, issues: string[]) {
    // Report to monitoring system or database
    logger.error(`Consistency issues for user ${userId}:`, issues)
  }
}

export const dualWriteAuthService = new DualWriteAuthService()
```

#### 2. Migration Status Tracking

```typescript
// src/lib/auth/migration-tracker.ts
import { supabase } from '@/lib/supabase'

interface MigrationStatus {
  user_id: string
  email: string
  supabase_migrated: boolean
  better_auth_migrated: boolean
  migration_started_at: Date
  migration_completed_at?: Date
  migration_errors?: string[]
  data_validated: boolean
}

class MigrationTracker {
  async trackMigrationStart(userId: string, email: string) {
    const { error } = await supabase
      .from('user_migration_status')
      .insert({
        user_id: userId,
        email,
        migration_started_at: new Date().toISOString(),
        supabase_migrated: false,
        better_auth_migrated: false,
        data_validated: false
      })

    if (error) {
      console.error('Failed to track migration start:', error)
    }
  }

  async updateMigrationStatus(
    userId: string, 
    updates: Partial<MigrationStatus>
  ) {
    const { error } = await supabase
      .from('user_migration_status')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)

    if (error) {
      console.error('Failed to update migration status:', error)
    }
  }

  async getMigrationStatus(userId: string): Promise<MigrationStatus | null> {
    const { data, error } = await supabase
      .from('user_migration_status')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Failed to get migration status:', error)
      return null
    }

    return data
  }

  async getMigrationStats() {
    const { data, error } = await supabase
      .from('user_migration_status')
      .select('supabase_migrated, better_auth_migrated, data_validated')

    if (error) {
      console.error('Failed to get migration stats:', error)
      return null
    }

    const total = data.length
    const supabaseMigrated = data.filter(row => row.supabase_migrated).length
    const betterAuthMigrated = data.filter(row => row.better_auth_migrated).length
    const fullyMigrated = data.filter(row => 
      row.supabase_migrated && row.better_auth_migrated && row.data_validated
    ).length

    return {
      total,
      supabaseMigrated,
      betterAuthMigrated,
      fullyMigrated,
      completionRate: total > 0 ? (fullyMigrated / total) * 100 : 0
    }
  }
}

export const migrationTracker = new MigrationTracker()
```

#### 3. Feature Flag Hook for Components

```typescript
// src/hooks/use-migration-mode.ts
import { useState, useEffect } from 'react'

interface MigrationMode {
  useBetterAuth: boolean
  migrationMode: 'supabase_only' | 'dual_write' | 'better_auth_only'
  isTransitioning: boolean
}

export function useMigrationMode(): MigrationMode {
  const [mode, setMode] = useState<MigrationMode>({
    useBetterAuth: false,
    migrationMode: 'supabase_only',
    isTransitioning: false
  })

  useEffect(() => {
    // Read from environment or remote config
    const useBetterAuth = process.env.NEXT_PUBLIC_USE_BETTER_AUTH === 'true'
    const migrationMode = (process.env.NEXT_PUBLIC_MIGRATION_MODE as any) || 'supabase_only'
    
    setMode({
      useBetterAuth,
      migrationMode,
      isTransitioning: migrationMode === 'dual_write'
    })
  }, [])

  return mode
}
```

#### 4. Migration Dashboard Component

```typescript
// src/components/admin/migration-dashboard.tsx
import { useState, useEffect } from 'react'
import { migrationTracker } from '@/lib/auth/migration-tracker'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface MigrationStats {
  total: number
  supabaseMigrated: number
  betterAuthMigrated: number
  fullyMigrated: number
  completionRate: number
}

export function MigrationDashboard() {
  const [stats, setStats] = useState<MigrationStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchStats = async () => {
    try {
      const migrationStats = await migrationTracker.getMigrationStats()
      setStats(migrationStats)
    } catch (error) {
      console.error('Failed to fetch migration stats:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchStats()
  }

  useEffect(() => {
    fetchStats()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return <div>Loading migration stats...</div>
  }

  if (!stats) {
    return <div>Failed to load migration stats</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Migration Dashboard</h2>
        <Button 
          onClick={handleRefresh} 
          disabled={refreshing}
          variant="outline"
        >
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Supabase Migrated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.supabaseMigrated}
            </div>
            <Badge variant="secondary">
              {((stats.supabaseMigrated / stats.total) * 100).toFixed(1)}%
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Better-Auth Migrated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.betterAuthMigrated}
            </div>
            <Badge variant="secondary">
              {((stats.betterAuthMigrated / stats.total) * 100).toFixed(1)}%
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Fully Migrated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats.fullyMigrated}
            </div>
            <Badge variant="secondary">
              {stats.completionRate.toFixed(1)}%
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Migration Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Completion</span>
                <span>{stats.completionRate.toFixed(1)}%</span>
              </div>
              <Progress value={stats.completionRate} className="h-3" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Supabase Migration</span>
                  <span>{((stats.supabaseMigrated / stats.total) * 100).toFixed(1)}%</span>
                </div>
                <Progress 
                  value={(stats.supabaseMigrated / stats.total) * 100} 
                  className="h-2" 
                />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Better-Auth Migration</span>
                  <span>{((stats.betterAuthMigrated / stats.total) * 100).toFixed(1)}%</span>
                </div>
                <Progress 
                  value={(stats.betterAuthMigrated / stats.total) * 100} 
                  className="h-2" 
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

### Migration Phases with Feature Flags

#### Phase 1: Preparation
```bash
# .env - Start with Supabase only
USE_BETTER_AUTH=false
MIGRATION_MODE=supabase_only
MIGRATION_VALIDATION=false
```

#### Phase 2: Dual-Write Testing
```bash
# .env - Enable dual-write with validation
USE_BETTER_AUTH=false  # Still use Supabase as primary
MIGRATION_MODE=dual_write
MIGRATION_VALIDATION=true
```

#### Phase 3: Better-Auth Primary
```bash
# .env - Switch to Better-Auth as primary
USE_BETTER_AUTH=true  # Use Better-Auth as primary
MIGRATION_MODE=dual_write
MIGRATION_VALIDATION=true
```

#### Phase 4: Better-Auth Only
```bash
# .env - Complete migration
USE_BETTER_AUTH=true
MIGRATION_MODE=better_auth_only
MIGRATION_VALIDATION=false
```

### Monitoring and Rollback Procedures

#### Quick Rollback Script
```typescript
// scripts/emergency-rollback.ts
import { dualWriteAuthService } from '@/lib/auth/dual-write-auth-service'

async function emergencyRollback() {
  console.log('🚨 Initiating emergency rollback to Supabase...')
  
  // Update environment variables
  process.env.USE_BETTER_AUTH = 'false'
  process.env.MIGRATION_MODE = 'supabase_only'
  
  console.log('✅ Rollback complete - now using Supabase only')
  
  // Optionally notify monitoring systems
  await notifyRollback('Emergency rollback to Supabase completed')
}

async function notifyRollback(message: string) {
  // Send to Slack, email, or monitoring system
  console.log('📢 Notification:', message)
}

// Run if called directly
if (require.main === module) {
  emergencyRollback().catch(console.error)
}
```

### Best Practices for Dual-Write Strategy

1. **Always Test Fallback**: Regularly test that fallback mechanisms work
2. **Monitor Both Systems**: Set up alerts for both Supabase and Better-Auth
3. **Validate Data Consistency**: Run periodic checks to ensure data sync
4. **Gradual Rollout**: Use feature flags to control rollout pace
5. **Quick Rollback**: Keep rollback scripts ready and tested
6. **Performance Monitoring**: Watch for increased latency during dual-write
7. **Error Handling**: Ensure graceful degradation when one system fails
8. **Documentation**: Keep migration status and procedures documented

This dual-write strategy ensures zero downtime migration while maintaining data consistency and providing multiple fallback options throughout the migration process.

## Rollout Plan & Testing Strategy

This section outlines a comprehensive testing and deployment strategy for the Supabase to Better-Auth migration, ensuring minimal risk and maximum reliability through systematic testing phases and monitoring.

### 1. Unit Tests for New Client

#### Test Environment Setup

The new Better-Auth client requires comprehensive unit testing before integration. We use Jest with TypeScript support for testing the authentication flows.

```bash
# Install testing dependencies
npm install --save-dev jest @types/jest ts-jest jest-environment-node
npm install --save-dev @testing-library/jest-dom supertest
```

#### Running Unit Tests

```bash
# Run all unit tests
uv run jest

# Run tests in watch mode
uv run jest --watch

# Run tests with coverage
uv run jest --coverage

# Run specific test suite
uv run jest auth-service.test.ts
```

#### Core Test Suites

**1. Authentication Service Tests**

```typescript
// tests/unit/auth-service.test.ts
import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { dualWriteAuthService } from '@/lib/auth/dual-write-auth-service'
import { betterAuth } from '@/lib/better-auth'
import { supabase } from '@/lib/supabase'

// Mock external dependencies
jest.mock('@/lib/better-auth')
jest.mock('@/lib/supabase')
jest.mock('@/lib/logger')

describe('DualWriteAuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.MIGRATION_MODE = 'dual_write'
    process.env.USE_BETTER_AUTH = 'true'
  })

  describe('signup', () => {
    it('should create user in both systems during dual-write mode', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        metadata: { name: 'Test User' }
      }

      const mockSupabaseResult = {
        data: { user: { id: 'supabase-user-id', email: 'test@example.com' } },
        error: null
      }
      const mockBetterAuthResult = {
        user: { id: 'better-auth-user-id', email: 'test@example.com' },
        session: { token: 'session-token' }
      }

      ;(supabase.auth.signUp as jest.Mock).mockResolvedValue(mockSupabaseResult)
      ;(betterAuth.signUp.email as jest.Mock).mockResolvedValue(mockBetterAuthResult)

      const result = await dualWriteAuthService.signup(userData)

      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            ...userData.metadata,
            migration_source: 'dual_write',
            created_via: 'supabase'
          }
        }
      })

      expect(betterAuth.signUp.email).toHaveBeenCalledWith({
        email: userData.email,
        password: userData.password,
        ...userData.metadata,
        migration_source: 'dual_write',
        created_via: 'better_auth'
      })

      expect(result).toBe(mockBetterAuthResult) // Better-Auth is primary
    })

    it('should fallback to Supabase if Better-Auth fails', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123'
      }

      const mockSupabaseResult = {
        data: { user: { id: 'supabase-user-id', email: 'test@example.com' } },
        error: null
      }

      ;(supabase.auth.signUp as jest.Mock).mockResolvedValue(mockSupabaseResult)
      ;(betterAuth.signUp.email as jest.Mock).mockRejectedValue(new Error('Better-Auth error'))

      const result = await dualWriteAuthService.signup(userData)

      expect(result).toBe(mockSupabaseResult.data)
    })

    it('should throw error if both systems fail', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123'
      }

      ;(supabase.auth.signUp as jest.Mock).mockRejectedValue(new Error('Supabase error'))
      ;(betterAuth.signUp.email as jest.Mock).mockRejectedValue(new Error('Better-Auth error'))

      await expect(dualWriteAuthService.signup(userData))
        .rejects
        .toThrow('All signup attempts failed')
    })
  })

  describe('login', () => {
    it('should try Better-Auth first when configured as primary', async () => {
      process.env.USE_BETTER_AUTH = 'true'
      
      const mockBetterAuthResult = {
        user: { id: 'better-auth-user-id', email: 'test@example.com' },
        session: { token: 'session-token' }
      }

      ;(betterAuth.signIn.email as jest.Mock).mockResolvedValue(mockBetterAuthResult)

      const result = await dualWriteAuthService.login('test@example.com', 'password123')

      expect(betterAuth.signIn.email).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      })
      expect(supabase.auth.signInWithPassword).not.toHaveBeenCalled()
      expect(result).toBe(mockBetterAuthResult)
    })

    it('should fallback to Supabase if Better-Auth login fails', async () => {
      process.env.USE_BETTER_AUTH = 'true'
      
      const mockSupabaseResult = {
        data: { user: { id: 'supabase-user-id', email: 'test@example.com' } },
        error: null
      }

      ;(betterAuth.signIn.email as jest.Mock).mockRejectedValue(new Error('Better-Auth login failed'))
      ;(supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue(mockSupabaseResult)

      const result = await dualWriteAuthService.login('test@example.com', 'password123')

      expect(betterAuth.signIn.email).toHaveBeenCalled()
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      })
      expect(result).toBe(mockSupabaseResult.data)
    })
  })

  describe('configuration modes', () => {
    it('should only use Supabase in supabase_only mode', async () => {
      process.env.MIGRATION_MODE = 'supabase_only'
      
      const mockSupabaseResult = {
        data: { user: { id: 'supabase-user-id', email: 'test@example.com' } },
        error: null
      }

      ;(supabase.auth.signUp as jest.Mock).mockResolvedValue(mockSupabaseResult)

      const result = await dualWriteAuthService.signup({
        email: 'test@example.com',
        password: 'password123'
      })

      expect(supabase.auth.signUp).toHaveBeenCalled()
      expect(betterAuth.signUp.email).not.toHaveBeenCalled()
      expect(result).toBe(mockSupabaseResult.data)
    })

    it('should only use Better-Auth in better_auth_only mode', async () => {
      process.env.MIGRATION_MODE = 'better_auth_only'
      
      const mockBetterAuthResult = {
        user: { id: 'better-auth-user-id', email: 'test@example.com' },
        session: { token: 'session-token' }
      }

      ;(betterAuth.signUp.email as jest.Mock).mockResolvedValue(mockBetterAuthResult)

      const result = await dualWriteAuthService.signup({
        email: 'test@example.com',
        password: 'password123'
      })

      expect(betterAuth.signUp.email).toHaveBeenCalled()
      expect(supabase.auth.signUp).not.toHaveBeenCalled()
      expect(result).toBe(mockBetterAuthResult)
    })
  })
})
```

**2. Migration Tracker Tests**

```typescript
// tests/unit/migration-tracker.test.ts
import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { migrationTracker } from '@/lib/auth/migration-tracker'
import { supabase } from '@/lib/supabase'

jest.mock('@/lib/supabase')

describe('MigrationTracker', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('trackMigrationStart', () => {
    it('should insert migration start record', async () => {
      const mockInsert = jest.fn().mockResolvedValue({ error: null })
      ;(supabase.from as jest.Mock).mockReturnValue({
        insert: mockInsert
      })

      await migrationTracker.trackMigrationStart('user-123', 'test@example.com')

      expect(supabase.from).toHaveBeenCalledWith('user_migration_status')
      expect(mockInsert).toHaveBeenCalledWith({
        user_id: 'user-123',
        email: 'test@example.com',
        migration_started_at: expect.any(String),
        supabase_migrated: false,
        better_auth_migrated: false,
        data_validated: false
      })
    })

    it('should handle insert errors gracefully', async () => {
      const mockInsert = jest.fn().mockResolvedValue({ 
        error: new Error('Database error') 
      })
      ;(supabase.from as jest.Mock).mockReturnValue({
        insert: mockInsert
      })

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      await migrationTracker.trackMigrationStart('user-123', 'test@example.com')

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to track migration start:',
        expect.any(Error)
      )

      consoleSpy.mockRestore()
    })
  })

  describe('getMigrationStats', () => {
    it('should calculate correct migration statistics', async () => {
      const mockData = [
        { supabase_migrated: true, better_auth_migrated: true, data_validated: true },
        { supabase_migrated: true, better_auth_migrated: false, data_validated: false },
        { supabase_migrated: false, better_auth_migrated: true, data_validated: false },
        { supabase_migrated: false, better_auth_migrated: false, data_validated: false }
      ]

      ;(supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue({ data: mockData, error: null })
      })

      const stats = await migrationTracker.getMigrationStats()

      expect(stats).toEqual({
        total: 4,
        supabaseMigrated: 2,
        betterAuthMigrated: 2,
        fullyMigrated: 1,
        completionRate: 25
      })
    })
  })
})
```

#### Test Coverage Requirements

- **Minimum Coverage**: 85% for all authentication-related code
- **Critical Paths**: 100% coverage for dual-write logic, fallback mechanisms
- **Edge Cases**: Test all error scenarios, timeouts, and configuration modes

```bash
# Generate coverage report
uv run jest --coverage --coverageReporters=text-lcov --coverageReporters=html

# Coverage thresholds in jest.config.js
module.exports = {
  collectCoverageFrom: [
    'src/lib/auth/**/*.{ts,tsx}',
    'src/hooks/use-migration-mode.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85
    },
    './src/lib/auth/dual-write-auth-service.ts': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
}
```

### 2. Integration Tests Against Staging Database

#### Staging Environment Setup

Integration tests run against a dedicated staging environment that mirrors production data structures but uses test data.

```bash
# Environment configuration for staging tests
# .env.staging
NODE_ENV=staging
STAGING_DATABASE_URL=postgresql://staging_user:pass@staging-db:5432/staging_db
STAGING_SUPABASE_URL=https://staging-project.supabase.co
STAGING_SUPABASE_SERVICE_KEY=staging-service-key
STAGING_BETTER_AUTH_DATABASE_URL=postgresql://staging_user:pass@staging-db:5432/better_auth_staging
STAGING_BETTER_AUTH_SECRET=staging-secret
```

#### Integration Test Suites

**1. End-to-End Authentication Flow**

```typescript
// tests/integration/auth-flow.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals'
import { dualWriteAuthService } from '@/lib/auth/dual-write-auth-service'
import { migrationTracker } from '@/lib/auth/migration-tracker'
import { testDbClient } from '../helpers/test-db-client'
import { createTestUser, cleanupTestUser } from '../helpers/test-helpers'

describe('Authentication Integration Tests', () => {
  let testEmail: string
  let testPassword: string

  beforeAll(async () => {
    // Set up staging environment
    process.env.MIGRATION_MODE = 'dual_write'
    process.env.USE_BETTER_AUTH = 'true'
    process.env.MIGRATION_VALIDATION = 'true'
    
    await testDbClient.connect()
  })

  afterAll(async () => {
    await testDbClient.disconnect()
  })

  beforeEach(() => {
    testEmail = `test-${Date.now()}@example.com`
    testPassword = 'TestPassword123!'
  })

  describe('User Registration Flow', () => {
    it('should successfully register user in both systems', async () => {
      const userData = {
        email: testEmail,
        password: testPassword,
        metadata: {
          name: 'Integration Test User',
          source: 'integration_test'
        }
      }

      // Register user
      const result = await dualWriteAuthService.signup(userData)

      expect(result).toBeDefined()
      expect(result.user.email).toBe(testEmail)

      // Verify user exists in Supabase
      const supabaseUser = await testDbClient.query(
        'SELECT * FROM auth.users WHERE email = $1',
        [testEmail]
      )
      expect(supabaseUser.rows).toHaveLength(1)

      // Verify user exists in Better-Auth
      const betterAuthUser = await testDbClient.query(
        'SELECT * FROM user WHERE email = $1',
        [testEmail]
      )
      expect(betterAuthUser.rows).toHaveLength(1)

      // Verify migration tracking
      const migrationStatus = await migrationTracker.getMigrationStatus(
        result.user.id
      )
      expect(migrationStatus).toBeDefined()
      expect(migrationStatus?.supabase_migrated).toBe(true)
      expect(migrationStatus?.better_auth_migrated).toBe(true)

      // Cleanup
      await cleanupTestUser(testEmail)
    })

    it('should handle Supabase failure gracefully', async () => {
      // Mock Supabase failure by using invalid service key
      const originalKey = process.env.SUPABASE_SERVICE_KEY
      process.env.SUPABASE_SERVICE_KEY = 'invalid-key'

      try {
        const result = await dualWriteAuthService.signup({
          email: testEmail,
          password: testPassword
        })

        // Should still succeed with Better-Auth only
        expect(result).toBeDefined()
        expect(result.user.email).toBe(testEmail)

        // Verify only Better-Auth user exists
        const betterAuthUser = await testDbClient.query(
          'SELECT * FROM user WHERE email = $1',
          [testEmail]
        )
        expect(betterAuthUser.rows).toHaveLength(1)

      } finally {
        process.env.SUPABASE_SERVICE_KEY = originalKey
        await cleanupTestUser(testEmail)
      }
    })
  })

  describe('User Login Flow', () => {
    beforeEach(async () => {
      // Create test user in both systems
      await createTestUser(testEmail, testPassword)
    })

    afterEach(async () => {
      await cleanupTestUser(testEmail)
    })

    it('should login successfully with Better-Auth primary', async () => {
      const result = await dualWriteAuthService.login(testEmail, testPassword)

      expect(result).toBeDefined()
      expect(result.user.email).toBe(testEmail)
      expect(result.session).toBeDefined()
    })

    it('should fallback to Supabase when Better-Auth fails', async () => {
      // Temporarily break Better-Auth connection
      const originalDbUrl = process.env.BETTER_AUTH_DATABASE_URL
      process.env.BETTER_AUTH_DATABASE_URL = 'postgresql://invalid:connection@localhost:5432/nonexistent'

      try {
        const result = await dualWriteAuthService.login(testEmail, testPassword)

        expect(result).toBeDefined()
        expect(result.user.email).toBe(testEmail)
      } finally {
        process.env.BETTER_AUTH_DATABASE_URL = originalDbUrl
      }
    })
  })

  describe('Data Consistency Validation', () => {
    it('should detect and report data inconsistencies', async () => {
      // Create user with different metadata in each system
      await dualWriteAuthService.signup({
        email: testEmail,
        password: testPassword,
        metadata: { name: 'Test User' }
      })

      // Manually modify data in one system to create inconsistency
      await testDbClient.query(
        'UPDATE user SET name = $1 WHERE email = $2',
        ['Modified Name', testEmail]
      )

      // Trigger validation
      const validationResult = await migrationTracker.validateUserConsistency(testEmail)

      expect(validationResult.hasDiscrepancies).toBe(true)
      expect(validationResult.discrepancies).toContain('name')

      await cleanupTestUser(testEmail)
    })
  })
})
```

**2. Database Schema Validation**

```typescript
// tests/integration/schema-validation.test.ts
import { describe, it, expect } from '@jest/globals'
import { testDbClient } from '../helpers/test-db-client'

describe('Database Schema Integration', () => {
  it('should have all required Better-Auth tables', async () => {
    const requiredTables = ['user', 'account', 'session', 'verification']
    
    for (const table of requiredTables) {
      const result = await testDbClient.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        )
      `, [table])
      
      expect(result.rows[0].exists).toBe(true)
    }
  })

  it('should have migration tracking tables', async () => {
    const migrationTables = [
      'user_migration_status',
      'migration_states',
      'migration_errors',
      'migrated_users'
    ]
    
    for (const table of migrationTables) {
      const result = await testDbClient.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        )
      `, [table])
      
      expect(result.rows[0].exists).toBe(true)
    }
  })

  it('should have correct foreign key relationships', async () => {
    const foreignKeys = await testDbClient.query(`
      SELECT
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM
        information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
      WHERE constraint_type = 'FOREIGN KEY'
        AND tc.table_name IN ('account', 'session', 'user_migration_status')
    `)

    const expectedForeignKeys = [
      { table: 'account', column: 'userId', foreign_table: 'user', foreign_column: 'id' },
      { table: 'session', column: 'userId', foreign_table: 'user', foreign_column: 'id' },
      { table: 'user_migration_status', column: 'user_id', foreign_table: 'user', foreign_column: 'id' }
    ]

    for (const expectedFk of expectedForeignKeys) {
      const found = foreignKeys.rows.find(row =>
        row.table_name === expectedFk.table &&
        row.column_name === expectedFk.column &&
        row.foreign_table_name === expectedFk.foreign_table &&
        row.foreign_column_name === expectedFk.foreign_column
      )
      expect(found).toBeDefined()
    }
  })
})
```

#### Running Integration Tests

```bash
# Set up staging database
docker-compose -f docker-compose.staging.yml up -d

# Run migrations on staging
npx @better-auth/cli migrate --env=staging

# Run integration tests
uv run jest --config=jest.integration.config.js

# Run with specific environment
NODE_ENV=staging uv run jest --config=jest.integration.config.js

# Clean up staging environment
docker-compose -f docker-compose.staging.yml down

### 3. Canary Release Steps

Canary releases allow us to gradually roll out the Better-Auth migration to a small subset of users first, monitoring for issues before full deployment. This approach minimizes risk and provides early feedback.

#### Canary Release Architecture

```bash
# Environment variables for canary control
# .env.production
CANARY_ENABLED=true
CANARY_PERCENTAGE=5  # Start with 5% of users
CANARY_USER_SELECTION=random  # Options: random, whitelist, email_domain
CANARY_WHITELIST=admin@company.com,test@company.com  # For whitelist mode
CANARY_EMAIL_DOMAINS=company.com,trusted-partner.com  # For domain mode
```

#### Canary User Selection Strategy

```typescript
// src/lib/auth/canary-selector.ts
import { logger } from '@/lib/logger'
import { createHash } from 'crypto'

interface CanaryConfig {
  enabled: boolean
  percentage: number
  selectionMethod: 'random' | 'whitelist' | 'email_domain' | 'user_id_hash'
  whitelist: string[]
  emailDomains: string[]
}

class CanarySelector {
  private config: CanaryConfig

  constructor() {
    this.config = {
      enabled: process.env.CANARY_ENABLED === 'true',
      percentage: parseInt(process.env.CANARY_PERCENTAGE || '0'),
      selectionMethod: (process.env.CANARY_USER_SELECTION as any) || 'random',
      whitelist: (process.env.CANARY_WHITELIST || '').split(',').filter(Boolean),
      emailDomains: (process.env.CANARY_EMAIL_DOMAINS || '').split(',').filter(Boolean)
    }
  }

  /**
   * Determines if a user should be included in the canary release
   */
  shouldUseCanary(userIdentifier: string): boolean {
    if (!this.config.enabled) {
      return false
    }

    switch (this.config.selectionMethod) {
      case 'whitelist':
        return this.isWhitelisted(userIdentifier)
      
      case 'email_domain':
        return this.isFromAllowedDomain(userIdentifier)
      
      case 'user_id_hash':
        return this.isSelectedByHash(userIdentifier)
      
      case 'random':
      default:
        return this.isRandomlySelected(userIdentifier)
    }
  }

  private isWhitelisted(email: string): boolean {
    const isWhitelisted = this.config.whitelist.includes(email.toLowerCase())
    logger.info(`Canary whitelist check for ${email}: ${isWhitelisted}`)
    return isWhitelisted
  }

  private isFromAllowedDomain(email: string): boolean {
    const domain = email.split('@')[1]?.toLowerCase()
    if (!domain) return false
    
    const isAllowed = this.config.emailDomains.includes(domain)
    logger.info(`Canary domain check for ${email}: ${isAllowed}`)
    return isAllowed
  }

  private isSelectedByHash(userIdentifier: string): boolean {
    // Use consistent hash-based selection for deterministic results
    const hash = createHash('md5').update(userIdentifier).digest('hex')
    const hashNumber = parseInt(hash.substring(0, 8), 16)
    const isSelected = (hashNumber % 100) < this.config.percentage
    
    logger.info(`Canary hash selection for ${userIdentifier}: ${isSelected} (${hashNumber % 100}% < ${this.config.percentage}%)`)
    return isSelected
  }

  private isRandomlySelected(userIdentifier: string): boolean {
    // Use seeded random for consistent selection during a session
    const seed = this.createSeed(userIdentifier)
    const random = this.seededRandom(seed)
    const isSelected = random < (this.config.percentage / 100)
    
    logger.info(`Canary random selection for ${userIdentifier}: ${isSelected} (${random} < ${this.config.percentage / 100})`)
    return isSelected
  }

  private createSeed(userIdentifier: string): number {
    const hash = createHash('md5').update(userIdentifier + new Date().toDateString()).digest('hex')
    return parseInt(hash.substring(0, 8), 16)
  }

  private seededRandom(seed: number): number {
    const x = Math.sin(seed) * 10000
    return x - Math.floor(x)
  }

  /**
   * Get current canary configuration for monitoring
   */
  getConfig(): CanaryConfig {
    return { ...this.config }
  }

  /**
   * Update canary percentage (for gradual rollout)
   */
  updatePercentage(newPercentage: number): void {
    if (newPercentage < 0 || newPercentage > 100) {
      throw new Error('Canary percentage must be between 0 and 100')
    }
    
    this.config.percentage = newPercentage
    process.env.CANARY_PERCENTAGE = newPercentage.toString()
    
    logger.info(`Canary percentage updated to ${newPercentage}%`)
  }
}

export const canarySelector = new CanarySelector()
```

#### Enhanced Auth Service with Canary Logic

```typescript
// src/lib/auth/canary-auth-service.ts
import { dualWriteAuthService } from './dual-write-auth-service'
import { canarySelector } from './canary-selector'
import { logger } from '@/lib/logger'
import { trackCanaryEvent } from '@/lib/analytics'

class CanaryAuthService {
  async signup(userData: {
    email: string
    password: string
    metadata?: Record<string, any>
  }) {
    const isCanaryUser = canarySelector.shouldUseCanary(userData.email)
    
    // Track canary selection for analytics
    await trackCanaryEvent('user_signup_canary_selection', {
      email: userData.email,
      isCanaryUser,
      canaryConfig: canarySelector.getConfig()
    })

    if (isCanaryUser) {
      logger.info(`Canary signup for user: ${userData.email}`)
      
      // For canary users, use Better-Auth as primary
      const originalMode = process.env.MIGRATION_MODE
      const originalPrimary = process.env.USE_BETTER_AUTH
      
      try {
        process.env.MIGRATION_MODE = 'dual_write'
        process.env.USE_BETTER_AUTH = 'true'
        
        const result = await dualWriteAuthService.signup({
          ...userData,
          metadata: {
            ...userData.metadata,
            canary_user: true,
            canary_version: 'v1.0.0'
          }
        })
        
        await trackCanaryEvent('canary_signup_success', {
          email: userData.email,
          userId: result.user.id
        })
        
        return result
      } catch (error) {
        await trackCanaryEvent('canary_signup_error', {
          email: userData.email,
          error: error.message
        })
        throw error
      } finally {
        // Restore original configuration
        if (originalMode) process.env.MIGRATION_MODE = originalMode
        if (originalPrimary) process.env.USE_BETTER_AUTH = originalPrimary
      }
    } else {
      logger.info(`Standard signup for user: ${userData.email}`)
      
      // For non-canary users, use standard configuration
      return await dualWriteAuthService.signup({
        ...userData,
        metadata: {
          ...userData.metadata,
          canary_user: false
        }
      })
    }
  }

  async login(email: string, password: string) {
    const isCanaryUser = canarySelector.shouldUseCanary(email)
    
    await trackCanaryEvent('user_login_canary_check', {
      email,
      isCanaryUser
    })

    if (isCanaryUser) {
      logger.info(`Canary login for user: ${email}`)
      
      // For canary users, try Better-Auth first
      const originalMode = process.env.MIGRATION_MODE
      const originalPrimary = process.env.USE_BETTER_AUTH
      
      try {
        process.env.MIGRATION_MODE = 'dual_write'
        process.env.USE_BETTER_AUTH = 'true'
        
        const result = await dualWriteAuthService.login(email, password)
        
        await trackCanaryEvent('canary_login_success', {
          email,
          userId: result.user.id
        })
        
        return result
      } catch (error) {
        await trackCanaryEvent('canary_login_error', {
          email,
          error: error.message
        })
        throw error
      } finally {
        if (originalMode) process.env.MIGRATION_MODE = originalMode
        if (originalPrimary) process.env.USE_BETTER_AUTH = originalPrimary
      }
    } else {
      logger.info(`Standard login for user: ${email}`)
      return await dualWriteAuthService.login(email, password)
    }
  }
}

export const canaryAuthService = new CanaryAuthService()
```

#### Canary Release Phases

**Phase 1: Initial Canary (1-5% of users)**

```bash
# Deploy with minimal canary percentage
CANARY_ENABLED=true
CANARY_PERCENTAGE=1
CANARY_USER_SELECTION=random
```

**Phase 2: Expanded Canary (10-25% of users)**

```bash
# After 24-48 hours of successful Phase 1
CANARY_PERCENTAGE=10
# Monitor for 24 hours, then increase to 25
```

**Phase 3: Majority Rollout (50-75% of users)**

```bash
# After successful Phase 2
CANARY_PERCENTAGE=50
# Monitor for 12 hours, then increase to 75
```

**Phase 4: Full Rollout (100% of users)**

```bash
# Complete migration
CANARY_PERCENTAGE=100
# Or switch to better_auth_only mode
MIGRATION_MODE=better_auth_only
```

#### Canary Monitoring Dashboard

```typescript
// src/components/admin/canary-dashboard.tsx
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { canarySelector } from '@/lib/auth/canary-selector'
import { getCanaryMetrics } from '@/lib/analytics'

interface CanaryMetrics {
  totalUsers: number
  canaryUsers: number
  successRate: number
  errorRate: number
  avgResponseTime: number
  recentErrors: Array<{
    timestamp: string
    error: string
    userId: string
  }>
}

export function CanaryDashboard() {
  const [metrics, setMetrics] = useState<CanaryMetrics | null>(null)
  const [newPercentage, setNewPercentage] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchMetrics = async () => {
    try {
      const canaryMetrics = await getCanaryMetrics()
      setMetrics(canaryMetrics)
    } catch (error) {
      console.error('Failed to fetch canary metrics:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateCanaryPercentage = async () => {
    const percentage = parseInt(newPercentage)
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      alert('Please enter a valid percentage between 0 and 100')
      return
    }

    try {
      canarySelector.updatePercentage(percentage)
      setNewPercentage('')
      await fetchMetrics()
      alert(`Canary percentage updated to ${percentage}%`)
    } catch (error) {
      alert(`Failed to update canary percentage: ${error.message}`)
    }
  }

  useEffect(() => {
    fetchMetrics()
    const interval = setInterval(fetchMetrics, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return <div>Loading canary metrics...</div>
  }

  if (!metrics) {
    return <div>Failed to load canary metrics</div>
  }

  const config = canarySelector.getConfig()
  const canaryPercentage = config.enabled ? config.percentage : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Canary Release Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            placeholder="New %"
            value={newPercentage}
            onChange={(e) => setNewPercentage(e.target.value)}
            className="w-20"
          />
          <Button onClick={updateCanaryPercentage}>
            Update %
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Canary Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {config.enabled ? 'Active' : 'Disabled'}
            </div>
            <div className="text-sm text-muted-foreground">
              {canaryPercentage}% of users
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Canary Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {metrics.canaryUsers}
            </div>
            <div className="text-sm text-muted-foreground">
              of {metrics.totalUsers} total users
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              metrics.successRate >= 95 ? 'text-green-600' : 
              metrics.successRate >= 90 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {metrics.successRate.toFixed(1)}%
            </div>
            <div className="text-sm text-muted-foreground">
              Error rate: {metrics.errorRate.toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              metrics.avgResponseTime <= 500 ? 'text-green-600' :
              metrics.avgResponseTime <= 1000 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {metrics.avgResponseTime}ms
            </div>
          </CardContent>
        </Card>
      </div>

      {metrics.recentErrors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {metrics.recentErrors.slice(0, 5).map((error, index) => (
                <div key={index} className="border-l-4 border-red-400 pl-4 py-2">
                  <div className="text-sm font-medium">{error.error}</div>
                  <div className="text-xs text-muted-foreground">
                    User: {error.userId} | Time: {new Date(error.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Canary Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Selection Method:</strong> {config.selectionMethod}
            </div>
            <div>
              <strong>Percentage:</strong> {config.percentage}%
            </div>
            {config.whitelist.length > 0 && (
              <div className="col-span-2">
                <strong>Whitelist:</strong> {config.whitelist.join(', ')}
              </div>
            )}
            {config.emailDomains.length > 0 && (
              <div className="col-span-2">
                <strong>Email Domains:</strong> {config.emailDomains.join(', ')}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

#### Canary Rollback Procedures

```typescript
// scripts/canary-rollback.ts
import { canarySelector } from '@/lib/auth/canary-selector'
import { logger } from '@/lib/logger'

async function rollbackCanary() {
  console.log('🚨 Initiating canary rollback...')
  
  try {
    // Disable canary immediately
    process.env.CANARY_ENABLED = 'false'
    process.env.CANARY_PERCENTAGE = '0'
    
    // Switch all users back to Supabase
    process.env.USE_BETTER_AUTH = 'false'
    process.env.MIGRATION_MODE = 'supabase_only'
    
    logger.info('Canary rollback completed successfully')
    console.log('✅ Canary rollback complete - all users now using Supabase')
    
  } catch (error) {
    logger.error('Canary rollback failed:', error)
    console.error('❌ Canary rollback failed:', error.message)
    throw error
  }
}

// Auto-rollback triggers
function setupAutoRollback() {
  // Monitor error rate every 60 seconds
  setInterval(async () => {
    const metrics = await getCanaryMetrics()
    
    // Rollback if error rate exceeds 5% or success rate drops below 90%
    if (metrics.errorRate > 5 || metrics.successRate < 90) {
      logger.warn('Auto-rollback triggered due to high error rate', metrics)
      await rollbackCanary()
    }
  }, 60000)
}

if (require.main === module) {
  rollbackCanary().catch(console.error)
}

export { rollbackCanary, setupAutoRollback }
```

### 4. Monitoring Metrics in Sentry

Sentry integration provides comprehensive error tracking, performance monitoring, and alerting for the Better-Auth migration process.

#### Sentry Configuration

```bash
# Install Sentry dependencies
npm install @sentry/nextjs @sentry/tracing
```

```typescript
// sentry.client.config.js
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  
  // Performance monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Custom tags for migration tracking
  initialScope: {
    tags: {
      migration_version: '1.0.0',
      auth_system: process.env.USE_BETTER_AUTH === 'true' ? 'better-auth' : 'supabase',
      migration_mode: process.env.MIGRATION_MODE || 'unknown'
    }
  },
  
  // Release tracking
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
  
  beforeSend(event) {
    // Add migration context to all events
    event.contexts = {
      ...event.contexts,
      migration: {
        canary_enabled: process.env.CANARY_ENABLED === 'true',
        canary_percentage: process.env.CANARY_PERCENTAGE || '0',
        migration_mode: process.env.MIGRATION_MODE || 'unknown',
        better_auth_primary: process.env.USE_BETTER_AUTH === 'true'
      }
    }
    
    return event
  }
})
```

#### Custom Sentry Integration for Auth Events

```typescript
// src/lib/monitoring/sentry-auth-integration.ts
import * as Sentry from '@sentry/nextjs'
import { logger } from '@/lib/logger'

interface AuthEvent {
  type: 'signup' | 'login' | 'logout' | 'migration' | 'canary'
  userId?: string
  email?: string
  authSystem: 'supabase' | 'better-auth' | 'dual-write'
  success: boolean
  duration?: number
  error?: string
  metadata?: Record<string, any>
}

class SentryAuthIntegration {
  /**
   * Track authentication events with proper categorization
   */
  trackAuthEvent(event: AuthEvent) {
    const { type, userId, email, authSystem, success, duration, error, metadata } = event
    
    // Create transaction for performance tracking
    const transaction = Sentry.startTransaction({
      name: `auth.${type}`,
      op: 'auth',
      tags: {
        auth_system: authSystem,
        auth_event_type: type,
        success: success.toString(),
        ...(metadata?.canary_user && { canary_user: 'true' })
      }
    })

    // Set user context if available
    if (userId || email) {
      Sentry.setUser({
        id: userId,
        email: email
      })
    }

    // Add custom context
    Sentry.setContext('auth_event', {
      type,
      auth_system: authSystem,
      success,
      duration,
      canary_user: metadata?.canary_user || false,
      migration_mode: process.env.MIGRATION_MODE
    })

    if (success) {
      // Track successful auth events as breadcrumbs
      Sentry.addBreadcrumb({
        category: 'auth',
        message: `${type} successful for ${email || userId}`,
        level: 'info',
        data: {
          auth_system: authSystem,
          duration
        }
      })
      
      logger.info(`Auth event tracked: ${type} success`, { 
        userId, 
        email, 
        authSystem, 
        duration 
      })
    } else {
      // Track auth failures as errors
      const sentryError = new Error(`Auth ${type} failed: ${error}`)
      sentryError.name = `Auth${type.charAt(0).toUpperCase() + type.slice(1)}Error`
      
      Sentry.captureException(sentryError, {
        tags: {
          auth_system: authSystem,
          auth_event_type: type,
          canary_user: metadata?.canary_user ? 'true' : 'false'
        },
        extra: {
          user_id: userId,
          email,
          error_message: error,
          duration,
          metadata
        }
      })
      
      logger.error(`Auth event error: ${type} failed`, { 
        userId, 
        email, 
        authSystem, 
        error 
      })
    }

    // Record performance metrics
    if (duration) {
      Sentry.setMeasurement(`auth_${type}_duration`, duration, 'millisecond')
    }

    transaction.finish()
  }

  /**
   * Track migration-specific events
   */
  trackMigrationEvent(event: {
    type: 'migration_start' | 'migration_success' | 'migration_error' | 'dual_write_inconsistency'
    userId?: string
    email?: string
    migrationId?: string
    error?: string
    metadata?: Record<string, any>
  }) {
    const { type, userId, email, migrationId, error, metadata } = event
    
    Sentry.setContext('migration_event', {
      type,
      migration_id: migrationId,
      user_id: userId,
      email,
      migration_mode: process.env.MIGRATION_MODE,
      canary_enabled: process.env.CANARY_ENABLED === 'true'
    })

    if (error) {
      const migrationError = new Error(`Migration ${type}: ${error}`)
      migrationError.name = 'MigrationError'
      
      Sentry.captureException(migrationError, {
        tags: {
          migration_event: type,
          migration_id: migrationId
        },
        extra: {
          user_id: userId,
          email,
          metadata
        }
      })
    } else {
      Sentry.addBreadcrumb({
        category: 'migration',
        message: `Migration event: ${type}`,
        level: 'info',
        data: {
          migration_id: migrationId,
          user_id: userId,
          email
        }
      })
    }
  }

  /**
   * Track canary release metrics
   */
  trackCanaryMetrics(metrics: {
    canary_percentage: number
    total_users: number
    canary_users: number
    success_rate: number
    error_rate: number
    avg_response_time: number
  }) {
    // Set custom measurements for canary metrics
    Sentry.setMeasurement('canary_percentage', metrics.canary_percentage, 'percent')
    Sentry.setMeasurement('canary_success_rate', metrics.success_rate, 'percent')
    Sentry.setMeasurement('canary_error_rate', metrics.error_rate, 'percent')
    Sentry.setMeasurement('canary_response_time', metrics.avg_response_time, 'millisecond')
    Sentry.setMeasurement('canary_users', metrics.canary_users, 'count')
    
    // Add as context for other events
    Sentry.setContext('canary_metrics', metrics)
    
    logger.info('Canary metrics tracked', metrics)
  }
}

export const sentryAuth = new SentryAuthIntegration()
```

#### Enhanced Auth Service with Sentry Tracking

```typescript
// src/lib/auth/monitored-auth-service.ts
import { canaryAuthService } from './canary-auth-service'
import { sentryAuth } from '@/lib/monitoring/sentry-auth-integration'
import { performance } from 'perf_hooks'

class MonitoredAuthService {
  async signup(userData: {
    email: string
    password: string
    metadata?: Record<string, any>
  }) {
    const startTime = performance.now()
    const authSystem = this.determineAuthSystem(userData.email)
    
    try {
      const result = await canaryAuthService.signup(userData)
      const duration = performance.now() - startTime
      
      // Track successful signup
      sentryAuth.trackAuthEvent({
        type: 'signup',
        userId: result.user.id,
        email: userData.email,
        authSystem,
        success: true,
        duration,
        metadata: {
          canary_user: userData.metadata?.canary_user || false
        }
      })
      
      return result
    } catch (error) {
      const duration = performance.now() - startTime
      
      // Track failed signup
      sentryAuth.trackAuthEvent({
        type: 'signup',
        email: userData.email,
        authSystem,
        success: false,
        duration,
        error: error.message,
        metadata: userData.metadata
      })
      
      throw error
    }
  }

  async login(email: string, password: string) {
    const startTime = performance.now()
    const authSystem = this.determineAuthSystem(email)
    
    try {
      const result = await canaryAuthService.login(email, password)
      const duration = performance.now() - startTime
      
      // Track successful login
      sentryAuth.trackAuthEvent({
        type: 'login',
        userId: result.user.id,
        email,
        authSystem,
        success: true,
        duration
      })
      
      return result
    } catch (error) {
      const duration = performance.now() - startTime
      
      // Track failed login
      sentryAuth.trackAuthEvent({
        type: 'login',
        email,
        authSystem,
        success: false,
        duration,
        error: error.message
      })
      
      throw error
    }
  }

  private determineAuthSystem(email: string): 'supabase' | 'better-auth' | 'dual-write' {
    const mode = process.env.MIGRATION_MODE
    if (mode === 'dual_write') return 'dual-write'
    if (mode === 'better_auth_only') return 'better-auth'
    return 'supabase'
  }
}

export const monitoredAuthService = new MonitoredAuthService()
```

#### Sentry Alert Configuration

```javascript
// Sentry Alert Rules Configuration
const sentryAlerts = {
  // High error rate alert
  authErrorRate: {
    name: 'Auth Error Rate Too High',
    conditions: [
      {
        id: 'sentry.rules.conditions.event_frequency.EventFrequencyCondition',
        interval: '5m',
        value: 10
      }
    ],
    filters: [
      {
        id: 'sentry.rules.filters.tagged_event.TaggedEventFilter',
        key: 'auth_event_type',
        match: 'is',
        value: 'login'
      }
    ],
    actions: [
      {
        id: 'sentry.rules.actions.notify_email.NotifyEmailAction',
        targetType: 'team',
        targetIdentifier: 'auth-team'
      },
      {
        id: 'sentry.integrations.slack.notify_action.SlackNotifyServiceAction',
        workspace: 'your-workspace',
        channel: '#auth-alerts'
      }
    ]
  },
  
  // Canary performance degradation
  canaryPerformance: {
    name: 'Canary Performance Issues',
    conditions: [
      {
        id: 'sentry.rules.conditions.event_attribute.EventAttributeCondition',
        attribute: 'measurement.auth_login_duration',
        match: 'gte',
        value: 2000 // 2 seconds
      }
    ],
    filters: [
      {
        id: 'sentry.rules.filters.tagged_event.TaggedEventFilter',
        key: 'canary_user',
        match: 'is',
        value: 'true'
      }
    ]
  },
  
  // Migration consistency issues
  migrationConsistency: {
    name: 'Migration Data Consistency Issues',
    conditions: [
      {
        id: 'sentry.rules.conditions.tagged_event.TaggedEventCondition',
        key: 'migration_event',
        match: 'is',
        value: 'dual_write_inconsistency'
      }
    ]
  }
}
```

#### Sentry Custom Dashboards

```typescript
// src/lib/monitoring/sentry-dashboard-config.ts
export const sentryDashboardConfig = {
  authMigrationDashboard: {
    title: 'Auth Migration Monitoring',
    widgets: [
      {
        title: 'Auth Events by System',
        displayType: 'line',
        queries: [
          {
            name: 'Supabase Events',
            fields: ['count()'],
            conditions: 'auth_system:supabase',
            orderby: 'time'
          },
          {
            name: 'Better-Auth Events',
            fields: ['count()'],
            conditions: 'auth_system:better-auth',
            orderby: 'time'
          },
          {
            name: 'Dual-Write Events',
            fields: ['count()'],
            conditions: 'auth_system:dual-write',
            orderby: 'time'
          }
        ]
      },
      {
        title: 'Auth Success Rate',
        displayType: 'line',
        queries: [
          {
            name: 'Success Rate',
            fields: ['percentage(count_if(success,true), count()) as success_rate'],
            conditions: 'auth_event_type:[login,signup]',
            orderby: 'time'
          }
        ]
      },
      {
        title: 'Canary User Performance',
        displayType: 'line',
        queries: [
          {
            name: 'Canary Response Time',
            fields: ['avg(auth_login_duration)'],
            conditions: 'canary_user:true',
            orderby: 'time'
          },
          {
            name: 'Non-Canary Response Time',
            fields: ['avg(auth_login_duration)'],
            conditions: 'canary_user:false',
            orderby: 'time'
          }
        ]
      },
      {
        title: 'Migration Errors',
        displayType: 'table',
        queries: [
          {
            name: 'Recent Migration Errors',
            fields: ['timestamp', 'user.email', 'migration_event', 'message'],
            conditions: 'level:error AND migration_event:*',
            orderby: '-timestamp'
          }
        ]
      }
    ]
  }
}
```

#### Performance Monitoring Setup

```typescript
// src/lib/monitoring/performance-tracking.ts
import * as Sentry from '@sentry/nextjs'

/**
 * Custom performance monitoring for auth operations
 */
export function trackAuthPerformance<T>(
  operationName: string,
  operation: () => Promise<T>,
  metadata?: Record<string, any>
): Promise<T> {
  return Sentry.startSpan(
    {
      name: operationName,
      op: 'auth.operation',
      attributes: {
        'auth.migration_mode': process.env.MIGRATION_MODE,
        'auth.canary_enabled': process.env.CANARY_ENABLED === 'true',
        ...metadata
      }
    },
    async (span) => {
      try {
        const result = await operation()
        span.setStatus({ code: 1 }) // OK
        return result
      } catch (error) {
        span.setStatus({ code: 2, message: error.message }) // ERROR
        span.recordException(error)
        throw error
      }
    }
  )
}

/**
 * Monitor database query performance during migration
 */
export function trackDatabaseOperation<T>(
  queryType: 'select' | 'insert' | 'update' | 'delete',
  table: string,
  operation: () => Promise<T>
): Promise<T> {
  return trackAuthPerformance(
    `db.${queryType}.${table}`,
    operation,
    {
      'db.operation': queryType,
      'db.table': table
    }
  )
}
```
```
