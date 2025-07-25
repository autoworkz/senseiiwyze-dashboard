# Authentication System Implementation Guide

## Overview & Goals

This implementation guide provides a comprehensive roadmap for refactoring the existing authentication system to support multiple authentication methods while maintaining backward compatibility.

### Primary Objectives
- Implement multi-provider OAuth authentication (Google, GitHub, Discord)
- Maintain existing email/password authentication
- Ensure backward compatibility with current user sessions
- Establish unified account management across auth methods
- Implement secure account linking capabilities
- Maintain data integrity throughout the migration process

### Success Criteria
- Zero downtime deployment
- All existing users can continue accessing their accounts
- New OAuth providers function correctly
- Account linking works seamlessly
- Performance remains optimal
- Security standards are maintained or improved

---

## Prerequisites

### Development Environment
- Node.js 18+ with npm/yarn
- Database access (development and staging environments)
- Environment variable management system
- Testing framework setup
- Version control with feature branch strategy

### Required Access & Permissions
- Database migration privileges
- Environment configuration access
- OAuth application registration capabilities:
  - Google Cloud Console access
  - GitHub Developer Settings access
  - Discord Developer Portal access
- Production deployment permissions

### Knowledge Requirements
- Understanding of OAuth 2.0 flow
- Database schema design and migrations
- Authentication security best practices
- Session management concepts
- API design principles

---

## Step 1: Dependency Installation

### Core Better Auth Dependencies
Install the required Better Auth packages for modern authentication:

```bash
uv add better-auth
uv add better-auth-org-plugin
uv add dotenv
```

### Installation Context

#### Primary Dependencies
- **better-auth**: Core authentication library providing OAuth, email/password, and session management
- **better-auth-org-plugin**: Organization-level authentication features and multi-tenant support
- **dotenv**: Environment variable management for secure configuration

#### Version Constraints & Compatibility

**Recommended Version Constraints:**
```toml
# pyproject.toml
[project]
dependencies = [
    "better-auth>=1.0.0,<2.0.0",  # Stable v1 API
    "better-auth-org-plugin>=1.0.0,<2.0.0",  # Compatible org plugin
    "python-dotenv>=1.0.0,<2.0.0",  # Environment management
]
```

**Installation Verification:**
```bash
# Verify installation
uv run python -c "import better_auth; print(better_auth.__version__)"
uv run python -c "import better_auth_org_plugin; print('Org plugin installed successfully')"
uv run python -c "import dotenv; print('Dotenv installed successfully')"

# Check for conflicts
uv tree
uv check
```

### Additional Production Dependencies

For enhanced security and functionality:

```bash
# Database adapters (choose based on your database)
uv add 'better-auth[postgresql]'  # For PostgreSQL
uv add 'better-auth[mysql]'       # For MySQL
uv add 'better-auth[sqlite]'      # For SQLite

# OAuth provider support
uv add 'better-auth[oauth]'       # OAuth providers (Google, GitHub, Discord)

# Security enhancements
uv add 'better-auth[security]'    # Enhanced security features
uv add pydantic                   # Data validation
uv add cryptography               # Cryptographic operations
```

### Development Dependencies

```bash
# Testing and development
uv add --dev pytest
uv add --dev pytest-asyncio
uv add --dev pytest-mock
uv add --dev httpx               # HTTP client for testing
uv add --dev faker               # Test data generation

# Code quality
uv add --dev black               # Code formatting
uv add --dev ruff                # Linting
uv add --dev mypy                # Type checking
```

### Environment Setup Validation

Create a validation script to ensure proper installation:

```python
# scripts/validate_installation.py
import sys
from importlib import import_module

required_packages = [
    'better_auth',
    'better_auth_org_plugin',
    'dotenv',
]

def validate_installation():
    """Validate that all required packages are properly installed."""
    missing_packages = []
    
    for package in required_packages:
        try:
            import_module(package)
            print(f"✓ {package} installed successfully")
        except ImportError:
            missing_packages.append(package)
            print(f"✗ {package} not found")
    
    if missing_packages:
        print(f"\nMissing packages: {', '.join(missing_packages)}")
        sys.exit(1)
    else:
        print("\n✓ All packages installed successfully!")

if __name__ == "__main__":
    validate_installation()
```

Run validation:
```bash
uv run python scripts/validate_installation.py
```

### Post-Installation Configuration

1. **Update .env file structure:**
```bash
# Create .env template
cp .env.example .env
```

2. **Verify Python version compatibility:**
```bash
# Better Auth requires Python 3.8+
python --version
uv python --version
```

3. **Lock dependencies:**
```bash
# Generate lock file for reproducible builds
uv lock
```

---

## Step 2: Env Variable Configuration

### OAuth Provider Configuration
Set up environment variables for each OAuth provider:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:3000/auth/github/callback

# Discord OAuth
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
DISCORD_CALLBACK_URL=http://localhost:3000/auth/discord/callback
```

### Security Configuration
```env
# JWT and session secrets
JWT_SECRET=your_super_secure_jwt_secret
SESSION_SECRET=your_session_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS settings
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

### Environment-Specific Settings
- Development: localhost callback URLs
- Staging: staging domain URLs
- Production: production domain URLs
- Implement environment validation startup checks

---

## Step 6: Database Schema Synchronization

Database schema synchronization is crucial when migrating from Supabase Auth to Better Auth. The table structures and naming conventions differ significantly, requiring careful migration planning.

### Schema Differences Overview

Better Auth uses different table names and structures compared to Supabase Auth:

```sql
-- Supabase Auth tables (original)
auth.users
auth.sessions
auth.refresh_tokens

-- Better Auth tables (target)
better_auth_user
better_auth_session
better_auth_account
better_auth_verification
better_auth_organization
better_auth_member
better_auth_invitation
```

### SQL Migration Script

Here's a comprehensive SQL migration script showing the schema transformation:

```sql
-- Step 1: Rename existing tables to preserve data during migration
ALTER TABLE auth.users RENAME TO supabase_users_backup;
ALTER TABLE auth.sessions RENAME TO supabase_sessions_backup;

-- Step 2: Create Better Auth tables
CREATE TABLE better_auth_user (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    emailVerified BOOLEAN DEFAULT FALSE,
    name TEXT,
    image TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE better_auth_session (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    expiresAt TIMESTAMP NOT NULL,
    token TEXT UNIQUE NOT NULL,
    ipAddress TEXT,
    userAgent TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES better_auth_user(id) ON DELETE CASCADE
);

CREATE TABLE better_auth_account (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    provider TEXT NOT NULL,
    providerAccountId TEXT NOT NULL,
    accessToken TEXT,
    refreshToken TEXT,
    expiresAt TIMESTAMP,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES better_auth_user(id) ON DELETE CASCADE,
    UNIQUE(provider, providerAccountId)
);

CREATE TABLE better_auth_verification (
    id TEXT PRIMARY KEY,
    identifier TEXT NOT NULL,
    value TEXT NOT NULL,
    expiresAt TIMESTAMP NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE better_auth_organization (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE better_auth_member (
    id TEXT PRIMARY KEY,
    organizationId TEXT NOT NULL,
    userId TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'member',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organizationId) REFERENCES better_auth_organization(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES better_auth_user(id) ON DELETE CASCADE,
    UNIQUE(organizationId, userId)
);

CREATE TABLE better_auth_invitation (
    id TEXT PRIMARY KEY,
    organizationId TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'member',
    status TEXT NOT NULL DEFAULT 'pending',
    expiresAt TIMESTAMP NOT NULL,
    inviterId TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organizationId) REFERENCES better_auth_organization(id) ON DELETE CASCADE,
    FOREIGN KEY (inviterId) REFERENCES better_auth_user(id) ON DELETE CASCADE
);

-- Step 3: Migrate existing user data
INSERT INTO better_auth_user (id, email, emailVerified, name, createdAt, updatedAt)
SELECT 
    id::TEXT,
    email,
    email_confirmed_at IS NOT NULL,
    COALESCE(raw_user_meta_data->>'name', email),
    created_at,
    updated_at
FROM supabase_users_backup
WHERE email IS NOT NULL;

-- Step 4: Create indexes for performance
CREATE INDEX idx_better_auth_session_user_id ON better_auth_session(userId);
CREATE INDEX idx_better_auth_session_expires_at ON better_auth_session(expiresAt);
CREATE INDEX idx_better_auth_account_user_id ON better_auth_account(userId);
CREATE INDEX idx_better_auth_account_provider ON better_auth_account(provider, providerAccountId);
CREATE INDEX idx_better_auth_member_org_id ON better_auth_member(organizationId);
CREATE INDEX idx_better_auth_member_user_id ON better_auth_member(userId);
CREATE INDEX idx_better_auth_invitation_org_id ON better_auth_invitation(organizationId);
CREATE INDEX idx_better_auth_verification_identifier ON better_auth_verification(identifier);
```

### Drizzle Schema Definition

Create your Drizzle schema file (`src/db/schema.ts`) to match the Better Auth tables:

```typescript
import { pgTable, text, boolean, timestamp, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const betterAuthUser = pgTable('better_auth_user', {
  id: text('id').primaryKey(),
  email: text('email').unique().notNull(),
  emailVerified: boolean('emailVerified').default(false),
  name: text('name'),
  image: text('image'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const betterAuthSession = pgTable('better_auth_session', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => betterAuthUser.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').unique().notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
}, (table) => ({
  userIdIdx: index('idx_better_auth_session_user_id').on(table.userId),
  expiresAtIdx: index('idx_better_auth_session_expires_at').on(table.expiresAt),
}));

export const betterAuthAccount = pgTable('better_auth_account', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => betterAuthUser.id, { onDelete: 'cascade' }),
  provider: text('provider').notNull(),
  providerAccountId: text('providerAccountId').notNull(),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  expiresAt: timestamp('expiresAt'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
}, (table) => ({
  userIdIdx: index('idx_better_auth_account_user_id').on(table.userId),
  providerIdx: index('idx_better_auth_account_provider').on(table.provider, table.providerAccountId),
}));

export const betterAuthOrganization = pgTable('better_auth_organization', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  logo: text('logo'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const betterAuthMember = pgTable('better_auth_member', {
  id: text('id').primaryKey(),
  organizationId: text('organizationId').notNull().references(() => betterAuthOrganization.id, { onDelete: 'cascade' }),
  userId: text('userId').notNull().references(() => betterAuthUser.id, { onDelete: 'cascade' }),
  role: text('role').notNull().default('member'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
}, (table) => ({
  orgIdIdx: index('idx_better_auth_member_org_id').on(table.organizationId),
  userIdIdx: index('idx_better_auth_member_user_id').on(table.userId),
}));

// Define relations
export const userRelations = relations(betterAuthUser, ({ many }) => ({
  sessions: many(betterAuthSession),
  accounts: many(betterAuthAccount),
  memberships: many(betterAuthMember),
}));

export const sessionRelations = relations(betterAuthSession, ({ one }) => ({
  user: one(betterAuthUser, {
    fields: [betterAuthSession.userId],
    references: [betterAuthUser.id],
  }),
}));

export const organizationRelations = relations(betterAuthOrganization, ({ many }) => ({
  members: many(betterAuthMember),
}));
```

### Running Migrations

#### Using Supabase CLI

1. **Create migration file:**
   ```bash
   supabase migration new better_auth_schema_migration
   ```

2. **Add the SQL migration script** to the generated file in `supabase/migrations/`

3. **Apply migrations to local development:**
   ```bash
   supabase db reset
   ```

4. **Apply migrations to production:**
   ```bash
   supabase db push
   ```

5. **Verify migration status:**
   ```bash
   supabase migration list
   ```

#### Using Drizzle ORM

1. **Install Drizzle dependencies:**
   ```bash
   npm install drizzle-orm pg
   npm install -D drizzle-kit @types/pg
   ```

2. **Configure Drizzle (`drizzle.config.ts`):**
   ```typescript
   import type { Config } from 'drizzle-kit';
   
   export default {
     schema: './src/db/schema.ts',
     out: './drizzle/migrations',
     driver: 'pg',
     dbCredentials: {
       connectionString: process.env.DATABASE_URL!,
     },
     verbose: true,
     strict: true,
   } satisfies Config;
   ```

3. **Generate migration files:**
   ```bash
   npx drizzle-kit generate:pg
   ```

4. **Run migrations:**
   ```bash
   npx drizzle-kit push:pg
   ```

5. **Create a migration runner script (`src/db/migrate.ts`):**
   ```typescript
   import { drizzle } from 'drizzle-orm/postgres-js';
   import { migrate } from 'drizzle-orm/postgres-js/migrator';
   import postgres from 'postgres';
   
   const connectionString = process.env.DATABASE_URL!;
   const sql = postgres(connectionString, { max: 1 });
   const db = drizzle(sql);
   
   async function main() {
     console.log('Running migrations...');
     await migrate(db, { migrationsFolder: 'drizzle/migrations' });
     console.log('Migrations completed!');
     process.exit(0);
   }
   
   main().catch((err) => {
     console.error('Migration failed:', err);
     process.exit(1);
   });
   ```

6. **Run the migration script:**
   ```bash
   npx tsx src/db/migrate.ts
   ```

### Data Migration Strategy

1. **Backup existing data** before starting the migration
2. **Run the schema migration** to create new tables
3. **Migrate user data** using the INSERT statements provided
4. **Test the migration** with a subset of data first
5. **Update application code** to use Better Auth
6. **Clean up old tables** after successful migration

### Post-Migration Verification

```sql
-- Verify data migration
SELECT COUNT(*) FROM better_auth_user;
SELECT COUNT(*) FROM supabase_users_backup;

-- Check for missing data
SELECT email FROM supabase_users_backup 
WHERE email NOT IN (SELECT email FROM better_auth_user);

-- Verify indexes
\d+ better_auth_session
```

This comprehensive migration approach ensures a smooth transition from Supabase Auth to Better Auth while preserving existing user data and maintaining database performance through proper indexing.

---

## Step 4: Data Migration Scripts

### Existing User Migration
Create migration script to update existing users:

```javascript
// Migration: 001_add_oauth_fields.js
async function migrateExistingUsers() {
    // Set auth_method to 'email' for existing users
    await db.query(`
        UPDATE users 
        SET auth_method = 'email', 
            created_via = 'email',
            is_email_verified = TRUE
        WHERE auth_method IS NULL
    `);
    
    // Create user_accounts entries for existing email users
    await db.query(`
        INSERT INTO user_accounts (user_id, provider, provider_id, provider_email, is_primary)
        SELECT id, 'email', email, email, TRUE
        FROM users 
        WHERE auth_method = 'email'
    `);
}
```

### Data Validation Script
```javascript
// Validate data integrity after migration
async function validateMigration() {
    const checks = [
        // Ensure all users have auth_method
        `SELECT COUNT(*) FROM users WHERE auth_method IS NULL`,
        
        // Verify account linking integrity
        `SELECT COUNT(*) FROM user_accounts ua 
         LEFT JOIN users u ON ua.user_id = u.id 
         WHERE u.id IS NULL`,
        
        // Check for duplicate provider IDs
        `SELECT provider, provider_id, COUNT(*) 
         FROM user_accounts 
         GROUP BY provider, provider_id 
         HAVING COUNT(*) > 1`
    ];
    
    // Execute validation checks and report results
}
```

### Rollback Procedures
Document rollback steps for each migration:
- Schema rollback scripts
- Data restoration procedures
- Dependency version rollback
- Configuration restoration

---

## Step 5: AuthService Refactor

### Overview

This step refactors the existing `AuthService` to integrate with Better Auth, replacing mock implementations with actual Better Auth client calls while maintaining backward compatibility and adding comprehensive error handling.

### Before/After Implementation

#### Current Implementation (`src/services/authService.ts`)

**Before:**
```typescript
// Current mock-based implementation
export class AuthService {
  private readonly apiDisabled = true;
  
  async login(email: string, password: string): Promise<LoginResponse> {
    if (this.apiDisabled) {
      return this.mockLogin(email, password); // Mock implementation
    }
    // ... existing fetch-based code
  }
  
  private async mockLogin(email: string, password: string): Promise<LoginResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    const token = 'mock-jwt-token-' + Date.now();
    this.setAuthCookie(token); // Manual cookie management
    
    return {
      token: token,
      user: {
        id: 1,
        email: email,
      }
    };
  }
  
  private setAuthCookie(token: string): void {
    document.cookie = `auth-token=${token}; path=/; max-age=86400`;
  }
}
```

**After:**
```typescript
// Better Auth integrated implementation
import { betterAuthClient } from '../lib/auth-client';
import type { Session, User } from 'better-auth/types';

export interface LoginResponse {
  token?: string; // Optional for backward compatibility
  user: User;
  session: Session;
}

export class AuthService {
  private readonly timeout = 5000;
  
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      // Input validation
      if (!email || !password) {
        throw new AuthError('Email and password are required', 'VALIDATION_ERROR');
      }
      
      // Better Auth login with automatic cookie management
      const result = await betterAuthClient.signIn.email({
        email,
        password,
        fetchOptions: {
          onError: (context) => {
            console.error('Login error:', context.error);
          },
          onRequest: () => {
            console.log('Login request initiated');
          },
          onSuccess: (context) => {
            console.log('Login successful:', context.data);
          }
        }
      });
      
      if (result.error) {
        throw new AuthError(
          this.mapBetterAuthError(result.error),
          'LOGIN_FAILED'
        );
      }
      
      // Better Auth automatically sets secure HTTP-only cookies
      // No manual cookie management needed
      
      return {
        user: result.data.user,
        session: result.data.session,
        // Keep token for backward compatibility
        token: result.data.session.token
      };
      
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      
      // Handle network and other errors
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new AuthError('Login request timed out', 'TIMEOUT');
        }
        throw new AuthError('Login failed due to network error', 'NETWORK_ERROR');
      }
      
      throw new AuthError('An unexpected error occurred', 'UNKNOWN_ERROR');
    }
  }
  
  async socialLogin(provider: SocialProvider): Promise<LoginResponse> {
    try {
      const supportedProviders: SocialProvider[] = ['google', 'facebook', 'github'];
      
      if (!supportedProviders.includes(provider)) {
        throw new AuthError(
          `Unsupported social login provider: ${provider}`,
          'UNSUPPORTED_PROVIDER'
        );
      }
      
      // Better Auth social login
      const result = await betterAuthClient.signIn.social({
        provider,
        callbackURL: `${window.location.origin}/auth/callback`,
        fetchOptions: {
          onError: (context) => {
            console.error('Social login error:', context.error);
          }
        }
      });
      
      if (result.error) {
        throw new AuthError(
          this.mapBetterAuthError(result.error),
          'SOCIAL_LOGIN_FAILED'
        );
      }
      
      return {
        user: result.data.user,
        session: result.data.session,
        token: result.data.session.token
      };
      
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      
      throw new AuthError('Social login failed', 'SOCIAL_LOGIN_ERROR');
    }
  }
  
  async logout(): Promise<void> {
    try {
      await betterAuthClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            console.log('Logout successful');
          },
          onError: (context) => {
            console.error('Logout error:', context.error);
          }
        }
      });
      
      // Better Auth automatically clears cookies
      // No manual cookie management needed
      
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with logout even if server request fails
      // Better Auth client will still clear local session
    }
  }
  
  isAuthenticated(): boolean {
    // Use Better Auth session check instead of cookie parsing
    const session = betterAuthClient.useSession();
    return session.data?.session !== null;
  }
  
  getCurrentUser(): User | null {
    const session = betterAuthClient.useSession();
    return session.data?.user || null;
  }
  
  getCurrentSession(): Session | null {
    const session = betterAuthClient.useSession();
    return session.data?.session || null;
  }
  
  // Error mapping for consistent error handling
  private mapBetterAuthError(error: any): string {
    const errorMap: Record<string, string> = {
      'INVALID_EMAIL_OR_PASSWORD': 'Invalid email or password',
      'EMAIL_NOT_VERIFIED': 'Please verify your email address before signing in',
      'ACCOUNT_NOT_FOUND': 'No account found with this email address',
      'TOO_MANY_REQUESTS': 'Too many login attempts. Please try again later',
      'PROVIDER_ERROR': 'Social login provider error. Please try again',
      'CALLBACK_URL_MISMATCH': 'Authentication callback URL mismatch',
      'SESSION_EXPIRED': 'Your session has expired. Please sign in again'
    };
    
    return errorMap[error.code] || error.message || 'Authentication failed';
  }
}

// Custom error class for better error handling
export class AuthError extends Error {
  constructor(
    message: string,
    public code: string,
    public cause?: Error
  ) {
    super(message);
    this.name = 'AuthError';
  }
}
```

### Error Handling Mapping

#### Comprehensive Error Code Mapping
```typescript
// src/services/authService.ts - Enhanced error mapping
private mapBetterAuthError(error: any): string {
  const errorMap: Record<string, string> = {
    // Authentication errors
    'INVALID_EMAIL_OR_PASSWORD': 'Invalid email or password',
    'EMAIL_NOT_VERIFIED': 'Please verify your email address before signing in',
    'ACCOUNT_NOT_FOUND': 'No account found with this email address',
    
    // Rate limiting errors
    'TOO_MANY_REQUESTS': 'Too many login attempts. Please try again later',
    'RATE_LIMIT_EXCEEDED': 'Rate limit exceeded. Please wait before trying again',
    
    // Social login errors
    'PROVIDER_ERROR': 'Social login provider error. Please try again',
    'OAUTH_ERROR': 'OAuth authentication failed',
    'CALLBACK_URL_MISMATCH': 'Authentication callback URL mismatch',
    
    // Session errors
    'SESSION_EXPIRED': 'Your session has expired. Please sign in again',
    'INVALID_SESSION': 'Invalid session. Please sign in again',
    
    // Network errors
    'NETWORK_ERROR': 'Network error. Please check your connection',
    'TIMEOUT': 'Request timed out. Please try again',
    
    // Validation errors
    'VALIDATION_ERROR': 'Invalid input provided',
    'MISSING_CREDENTIALS': 'Email and password are required',
    
    // Server errors
    'INTERNAL_SERVER_ERROR': 'Server error. Please try again later',
    'SERVICE_UNAVAILABLE': 'Authentication service is temporarily unavailable'
  };
  
  return errorMap[error.code] || error.message || 'Authentication failed';
}
```

#### Usage in Components
```typescript
// Example component usage with proper error handling
import { authService, AuthError } from '../services/authService';

const LoginComponent = () => {
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError('');
      
      const result = await authService.login(email, password);
      
      // Handle successful login
      router.push('/dashboard');
      
    } catch (error) {
      if (error instanceof AuthError) {
        // Display user-friendly error message
        setError(error.message);
        
        // Handle specific error codes
        switch (error.code) {
          case 'EMAIL_NOT_VERIFIED':
            // Redirect to email verification
            router.push('/verify-email');
            break;
          case 'TOO_MANY_REQUESTS':
            // Show rate limiting UI
            setShowRateLimitWarning(true);
            break;
          default:
            // Generic error handling
            break;
        }
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // ... component JSX
};
```

### Key Changes Summary

1. **Better Auth Integration**: Replaced `this.mockLogin(...)` with `betterAuthClient.signIn.email()`
2. **Automatic Cookie Management**: Better Auth handles secure HTTP-only cookies automatically
3. **Enhanced Error Handling**: Comprehensive error mapping with specific error codes
4. **Session Management**: Added proper session and user state management
5. **Backward Compatibility**: Maintained existing interface while adding new functionality
6. **Social Login Enhancement**: Improved social provider handling with better error management
7. **Type Safety**: Enhanced TypeScript types for better development experience

### Migration Checklist

- [ ] Install Better Auth dependencies
- [ ] Set up Better Auth client configuration
- [ ] Update AuthService implementation
- [ ] Test login/logout functionality
- [ ] Test social login providers
- [ ] Update error handling in components
- [ ] Verify session persistence
- [ ] Test authentication state management
- [ ] Update existing tests

---

## Step 6: OAuth & Email/Password Setup

### Passport.js Configuration
Set up Passport strategies for each OAuth provider:

```javascript
// config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const DiscordStrategy = require('passport-discord').Strategy;

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await authService.authenticate('google', profile);
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

// GitHub OAuth Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await authService.authenticate('github', profile);
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

// Discord OAuth Strategy
passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_CALLBACK_URL,
    scope: ['identify', 'email']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await authService.authenticate('discord', profile);
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));
```

### Email/Password Enhancement
Improve existing email/password authentication:

```javascript
// auth/strategies/EmailPasswordStrategy.js
class EmailPasswordStrategy {
    async authenticate(credentials) {
        const { email, password } = credentials;
        
        // Find user by email
        const user = await User.findByEmail(email);
        if (!user) {
            throw new AuthenticationError('Invalid credentials');
        }
        
        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            throw new AuthenticationError('Invalid credentials');
        }
        
        // Update last login
        await User.updateLastLogin(user.id, 'email');
        
        return user;
    }
    
    async register(userData) {
        const { email, password, name } = userData;
        
        // Check if user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            throw new ValidationError('User already exists');
        }
        
        // Hash password
        const passwordHash = await bcrypt.hash(password, 12);
        
        // Create user
        const user = await User.create({
            email,
            password_hash: passwordHash,
            name,
            auth_method: 'email',
            created_via: 'email',
            is_email_verified: false
        });
        
        // Send verification email
        await this.sendVerificationEmail(user);
        
        return user;
    }
}
```

### OAuth Provider Registration
Document OAuth application setup for each provider:

#### Google OAuth Setup
1. Go to Google Cloud Console
2. Create new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs
6. Copy client ID and secret

#### GitHub OAuth Setup
1. Go to GitHub Developer Settings
2. Create new OAuth App
3. Set application name and homepage URL
4. Set authorization callback URL
5. Copy client ID and generate client secret

#### Discord OAuth Setup
1. Go to Discord Developer Portal
2. Create new application
3. Go to OAuth2 section
4. Add redirect URLs
5. Copy client ID and secret

---

## Step 7: Account Context Store Integration

### Account Context Architecture
Implement centralized account context management:

```javascript
// context/AccountContextStore.js
class AccountContextStore {
    constructor() {
        this.contexts = new Map();
        this.subscribers = new Map();
    }
    
    // Set account context for user
    setContext(userId, context) {
        this.contexts.set(userId, {
            ...context,
            lastUpdated: new Date(),
            sessionId: context.sessionId
        });
        
        // Notify subscribers
        this.notifySubscribers(userId, context);
    }
    
    // Get account context
    getContext(userId) {
        return this.contexts.get(userId);
    }
    
    // Subscribe to context changes
    subscribe(userId, callback) {
        if (!this.subscribers.has(userId)) {
            this.subscribers.set(userId, new Set());
        }
        this.subscribers.get(userId).add(callback);
    }
    
    // Clean up expired contexts
    cleanup() {
        const now = new Date();
        for (const [userId, context] of this.contexts.entries()) {
            if (now - context.lastUpdated > 24 * 60 * 60 * 1000) { // 24 hours
                this.contexts.delete(userId);
                this.subscribers.delete(userId);
            }
        }
    }
}
```

### Context Data Structure
Define the account context schema:

```javascript
// types/AccountContext.js
const AccountContext = {
    userId: 'UUID',
    sessionId: 'string',
    authMethod: 'email|google|github|discord',
    primaryEmail: 'string',
    linkedAccounts: [
        {
            provider: 'string',
            providerId: 'string',
            email: 'string',
            linkedAt: 'timestamp',
            isPrimary: 'boolean'
        }
    ],
    permissions: ['string'],
    profile: {
        name: 'string',
        email: 'string',
        avatarUrl: 'string',
        emailVerified: 'boolean'
    },
    preferences: {
        language: 'string',
        timezone: 'string',
        notifications: 'object'
    },
    metadata: {
        lastLogin: 'timestamp',
        lastActivity: 'timestamp',
        loginCount: 'number',
        ipAddress: 'string',
        userAgent: 'string'
    }
};
```

### Context Middleware
Create middleware to populate account context:

```javascript
// middleware/accountContext.js
const accountContextMiddleware = async (req, res, next) => {
    try {
        if (req.user) {
            // Get comprehensive user data
            const userContext = await buildAccountContext(req.user);
            
            // Store in context store
            accountContextStore.setContext(req.user.id, userContext);
            
            // Attach to request
            req.accountContext = userContext;
        }
        
        next();
    } catch (error) {
        console.error('Account context middleware error:', error);
        next(); // Continue without context
    }
};

async function buildAccountContext(user) {
    // Fetch linked accounts
    const linkedAccounts = await UserAccount.findByUserId(user.id);
    
    // Fetch user permissions
    const permissions = await UserPermission.findByUserId(user.id);
    
    // Fetch user preferences
    const preferences = await UserPreference.findByUserId(user.id);
    
    return {
        userId: user.id,
        authMethod: user.auth_method,
        primaryEmail: user.email,
        linkedAccounts,
        permissions,
        profile: {
            name: user.name,
            email: user.email,
            avatarUrl: user.avatar_url,
            emailVerified: user.is_email_verified
        },
        preferences,
        metadata: {
            lastLogin: user.last_login,
            lastActivity: new Date(),
            loginCount: user.login_count,
            createdAt: user.created_at
        }
    };
}
```

---

## Step 8: API Routes Implementation

### Overview

For this Next.js 15 project using the App Router, we'll implement Better Auth API routes in the `src/pages/api/auth/` directory to handle authentication endpoints. Better Auth provides a streamlined API that automatically handles OAuth flows, session management, and security best practices.

### Directory Structure

Create the following API route structure:

```
src/pages/api/auth/
├── login.ts                 # Email/password login
├── register.ts              # User registration
├── logout.ts                # User logout
├── refresh.ts               # Token refresh
├── session.ts               # Session validation
├── google/
│   └── callback.ts          # Google OAuth callback
├── github/
│   └── callback.ts          # GitHub OAuth callback
└── discord/
    └── callback.ts          # Discord OAuth callback
```

### Core Authentication Routes

#### 1. Login Route (`src/pages/api/auth/login.ts`)

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '../../../lib/betterAuthClient';
import { rateLimit } from '../../../lib/rateLimit';
import { validateLoginInput } from '../../../lib/validation';

// Rate limiting middleware
const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many login attempts, please try again later'
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Apply rate limiting
    await loginRateLimit(req, res);

    const { email, password } = req.body;
    
    // Validate input
    const validation = validateLoginInput({ email, password });
    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validation.error.errors 
      });
    }

    // Authenticate with Better Auth
    const session = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      headers: req.headers,
    });

    if (!session) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Better Auth automatically sets secure HTTP-only cookies
    res.status(200).json({
      success: true,
      session: {
        id: session.session.id,
        userId: session.user.id,
        expiresAt: session.session.expiresAt
      },
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        emailVerified: session.user.emailVerified,
        image: session.user.image
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    
    // Handle specific Better Auth errors
    if (error instanceof Error) {
      if (error.message.includes('INVALID_EMAIL_OR_PASSWORD')) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      if (error.message.includes('EMAIL_NOT_VERIFIED')) {
        return res.status(401).json({ 
          error: 'Please verify your email address before signing in',
          code: 'EMAIL_NOT_VERIFIED'
        });
      }
      if (error.message.includes('TOO_MANY_REQUESTS')) {
        return res.status(429).json({ error: 'Too many requests' });
      }
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

#### 2. Register Route (`src/pages/api/auth/register.ts`)

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '../../../lib/betterAuthClient';
import { rateLimit } from '../../../lib/rateLimit';
import { validateRegisterInput } from '../../../lib/validation';

const registerRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 registration attempts per hour
  message: 'Too many registration attempts'
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await registerRateLimit(req, res);

    const { email, password, name } = req.body;
    
    // Validate input
    const validation = validateRegisterInput({ email, password, name });
    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validation.error.errors 
      });
    }

    // Register with Better Auth
    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
      headers: req.headers,
    });

    if (!result) {
      return res.status(400).json({ error: 'Registration failed' });
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email to verify your account.',
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        emailVerified: result.user.emailVerified
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('EMAIL_ALREADY_EXISTS')) {
        return res.status(409).json({ error: 'Email already exists' });
      }
      if (error.message.includes('WEAK_PASSWORD')) {
        return res.status(400).json({ error: 'Password does not meet requirements' });
      }
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

#### 3. Logout Route (`src/pages/api/auth/logout.ts`)

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '../../../lib/betterAuthClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Better Auth handles session termination and cookie cleanup
    await auth.api.signOut({
      headers: req.headers,
    });

    res.status(200).json({ 
      success: true, 
      message: 'Logged out successfully' 
    });
    
  } catch (error) {
    console.error('Logout error:', error);
    // Even if logout fails on server, consider it successful for client
    res.status(200).json({ 
      success: true, 
      message: 'Logged out' 
    });
  }
}
```

#### 4. Session Validation Route (`src/pages/api/auth/session.ts`)

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '../../../lib/betterAuthClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get current session from Better Auth
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return res.status(401).json({ 
        authenticated: false, 
        error: 'No active session' 
      });
    }

    res.status(200).json({
      authenticated: true,
      session: {
        id: session.session.id,
        userId: session.user.id,
        expiresAt: session.session.expiresAt
      },
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        emailVerified: session.user.emailVerified,
        image: session.user.image
      }
    });
    
  } catch (error) {
    console.error('Session validation error:', error);
    res.status(401).json({ 
      authenticated: false, 
      error: 'Session validation failed' 
    });
  }
}
```

### OAuth Callback Routes

#### Google OAuth Callback (`src/pages/api/auth/google/callback.ts`)

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '../../../../lib/betterAuthClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Better Auth handles OAuth callback automatically
    const result = await auth.api.callback({
      query: req.query,
      headers: req.headers,
    });

    if (!result) {
      return res.redirect('/login?error=oauth_failed');
    }

    // Redirect to dashboard on successful authentication
    res.redirect('/dashboard?auth=success');
    
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    res.redirect('/login?error=oauth_failed');
  }
}
```

#### GitHub OAuth Callback (`src/pages/api/auth/github/callback.ts`)

```typescript
// Similar structure to Google callback
import { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '../../../../lib/betterAuthClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await auth.api.callback({
      query: req.query,
      headers: req.headers,
    });

    if (!result) {
      return res.redirect('/login?error=github_oauth_failed');
    }

    res.redirect('/dashboard?auth=success&provider=github');
    
  } catch (error) {
    console.error('GitHub OAuth callback error:', error);
    res.redirect('/login?error=github_oauth_failed');
  }
}
```

#### Discord OAuth Callback (`src/pages/api/auth/discord/callback.ts`)

```typescript
// Similar structure to other OAuth callbacks
import { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '../../../../lib/betterAuthClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await auth.api.callback({
      query: req.query,
      headers: req.headers,
    });

    if (!result) {
      return res.redirect('/login?error=discord_oauth_failed');
    }

    res.redirect('/dashboard?auth=success&provider=discord');
    
  } catch (error) {
    console.error('Discord OAuth callback error:', error);
    res.redirect('/login?error=discord_oauth_failed');
  }
}
```

### Account Management Routes
```javascript
// routes/account.js
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const context = req.accountContext;
        res.json({
            success: true,
            profile: context.profile,
            linkedAccounts: context.linkedAccounts
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

router.post('/link/:provider', authenticateToken, async (req, res) => {
    try {
        const { provider } = req.params;
        const { code } = req.body;
        
        // Validate provider
        if (!['google', 'github', 'discord'].includes(provider)) {
            return res.status(400).json({ error: 'Invalid provider' });
        }
        
        // Link account
        const linkedAccount = await authService.linkAccount(
            req.user.id,
            provider,
            code
        );
        
        res.json({
            success: true,
            linkedAccount
        });
    } catch (error) {
        console.error('Account linking error:', error);
        res.status(400).json({ error: 'Failed to link account' });
    }
});

router.delete('/unlink/:provider', authenticateToken, async (req, res) => {
    try {
        const { provider } = req.params;
        
        await authService.unlinkAccount(req.user.id, provider);
        
        res.json({ success: true });
    } catch (error) {
        console.error('Account unlinking error:', error);
        res.status(400).json({ error: 'Failed to unlink account' });
    }
});
```

### Validation Schemas
```javascript
// validation/authSchemas.js
const Joi = require('joi');

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
        .min(8)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])'))
        .required()
        .messages({
            'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character'
        }),
    name: Joi.string().min(2).max(50).required()
});

module.exports = {
    loginSchema,
    registerSchema
};
```

---

## Step 9: Backward Compatibility Layer

### Legacy Session Support
Implement compatibility layer for existing sessions:

```javascript
// middleware/legacyCompatibility.js
const legacyCompatibilityMiddleware = async (req, res, next) => {
    try {
        // Check for legacy session format
        const legacyToken = req.cookies.legacySessionToken || 
                           req.headers['x-legacy-auth'];
        
        if (legacyToken && !req.user) {
            // Validate legacy token
            const user = await validateLegacyToken(legacyToken);
            
            if (user) {
                // Migrate to new session format
                const { sessionToken } = await sessionManager.createSession(
                    user,
                    user.auth_method || 'email',
                    { ip: req.ip, userAgent: req.get('User-Agent') }
                );
                
                // Set new session cookie
                res.cookie('sessionToken', sessionToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 24 * 60 * 60 * 1000
                });
                
                // Clear legacy cookie
                res.clearCookie('legacySessionToken');
                
                // Attach user to request
                req.user = user;
                req.sessionMigrated = true;
            }
        }
        
        next();
    } catch (error) {
        console.error('Legacy compatibility error:', error);
        next(); // Continue without migration
    }
};

async function validateLegacyToken(token) {
    try {
        // Validate legacy JWT or session token
        const decoded = jwt.verify(token, process.env.LEGACY_JWT_SECRET);
        const user = await User.findById(decoded.userId);
        
        return user;
    } catch (error) {
        return null;
    }
}
```

### API Version Support
Maintain backward compatibility for API responses:

```javascript
// middleware/apiVersioning.js
const apiVersioningMiddleware = (req, res, next) => {
    // Detect API version from header or URL
    const apiVersion = req.headers['api-version'] || 
                      req.query.version || 
                      extractVersionFromUrl(req.url) || 
                      'v1'; // default to v1 for legacy
    
    req.apiVersion = apiVersion;
    
    // Override res.json to format response based on version
    const originalJson = res.json;
    res.json = function(data) {
        const formattedData = formatResponseForVersion(data, apiVersion);
        return originalJson.call(this, formattedData);
    };
    
    next();
};

function formatResponseForVersion(data, version) {
    switch (version) {
        case 'v1':
            // Legacy format
            return {
                success: data.success !== false,
                data: data.user || data.profile || data,
                message: data.message
            };
        case 'v2':
            // New format with enhanced structure
            return {
                success: data.success !== false,
                result: data,
                meta: {
                    version: 'v2',
                    timestamp: new Date().toISOString()
                }
            };
        default:
            return data;
    }
}
```

### Database Compatibility
Ensure database queries work with both old and new schemas:

```javascript
// models/User.js (updated with compatibility)
class User {
    static async findById(id) {
        const query = `
            SELECT 
                u.*,
                -- Legacy compatibility: ensure auth_method defaults
                COALESCE(u.auth_method, 'email') as auth_method,
                COALESCE(u.is_email_verified, true) as is_email_verified
            FROM users u 
            WHERE u.id = $1
        `;
        
        const result = await db.query(query, [id]);
        return result.rows[0];
    }
    
    static async findByEmail(email) {
        // Support both primary email and linked account emails
        const query = `
            SELECT DISTINCT u.*,
                   COALESCE(u.auth_method, 'email') as auth_method
            FROM users u
            LEFT JOIN user_accounts ua ON u.id = ua.user_id
            WHERE u.email = $1 
               OR ua.provider_email = $1
            ORDER BY u.created_at ASC
            LIMIT 1
        `;
        
        const result = await db.query(query, [email]);
        return result.rows[0];
    }
}
```

### Frontend Compatibility
Provide JavaScript client library for both old and new auth:

```javascript
// public/js/auth-client.js
class AuthClient {
    constructor(options = {}) {
        this.apiVersion = options.apiVersion || 'v1';
        this.baseUrl = options.baseUrl || '/api/auth';
    }
    
    // Backward compatible login method
    async login(email, password) {
        const response = await fetch(`${this.baseUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'API-Version': this.apiVersion
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        // Handle different response formats
        if (this.apiVersion === 'v1') {
            return {
                success: data.success,
                user: data.data,
                token: data.token
            };
        } else {
            return data.result;
        }
    }
    
    // OAuth login methods
    loginWithGoogle() {
        window.location.href = `${this.baseUrl}/google`;
    }
    
    loginWithGitHub() {
        window.location.href = `${this.baseUrl}/github`;
    }
    
    loginWithDiscord() {
        window.location.href = `${this.baseUrl}/discord`;
    }
}
```

---

## Step 10: Rollout Plan & Testing Strategy

### Phase 1: Development & Testing (Week 1-2)
#### Development Environment Setup
- Set up isolated development environment
- Deploy database migrations
- Configure OAuth applications for development
- Implement core authentication features

#### Unit Testing Strategy
```javascript
// tests/auth.test.js
describe('Authentication Service', () => {
    describe('Email/Password Authentication', () => {
        test('should authenticate valid user', async () => {
            const user = await authService.authenticate('email', {
                email: 'test@example.com',
                password: 'validpassword'
            });
            expect(user).toBeDefined();
            expect(user.email).toBe('test@example.com');
        });
        
        test('should reject invalid credentials', async () => {
            await expect(
                authService.authenticate('email', {
                    email: 'test@example.com',
                    password: 'wrongpassword'
                })
            ).rejects.toThrow('Invalid credentials');
        });
    });
    
    describe('OAuth Authentication', () => {
        test('should create user from Google profile', async () => {
            const mockProfile = {
                id: 'google123',
                emails: [{ value: 'user@gmail.com' }],
                name: { givenName: 'John', familyName: 'Doe' }
            };
            
            const user = await authService.authenticate('google', mockProfile);
            expect(user.google_id).toBe('google123');
            expect(user.email).toBe('user@gmail.com');
        });
    });
    
    describe('Account Linking', () => {
        test('should link Google account to existing user', async () => {
            const existingUser = await User.create({
                email: 'user@example.com',
                password_hash: 'hashed',
                auth_method: 'email'
            });
            
            await authService.linkAccount(existingUser.id, 'google', {
                id: 'google123',
                email: 'user@example.com'
            });
            
            const linkedAccounts = await UserAccount.findByUserId(existingUser.id);
            expect(linkedAccounts).toHaveLength(2); // email + google
        });
    });
});
```

#### Integration Testing
```javascript
// tests/integration/auth-routes.test.js
describe('Authentication Routes', () => {
    test('POST /auth/login should return session token', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });
            
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.sessionToken).toBeDefined();
    });
    
    test('GET /auth/google should redirect to Google', async () => {
        const response = await request(app)
            .get('/api/auth/google');
            
        expect(response.status).toBe(302);
        expect(response.headers.location).toContain('accounts.google.com');
    });
});
```

### Phase 2: Staging Deployment (Week 3)
#### Staging Environment Setup
- Deploy to staging environment
- Run full database migrations
- Configure OAuth with staging URLs
- Load test data and scenarios

#### Load Testing
```javascript
// tests/load/auth-load.test.js
const loadtest = require('loadtest');

describe('Authentication Load Tests', () => {
    test('should handle 100 concurrent logins', (done) => {
        const options = {
            url: 'http://staging.example.com/api/auth/login',
            concurrency: 10,
            maxRequests: 100,
            method: 'POST',
            body: JSON.stringify({
                email: 'load-test@example.com',
                password: 'password123'
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        loadtest.loadTest(options, (error, results) => {
            expect(error).toBeNull();
            expect(results.errorCodes).toEqual({});
            expect(results.percentile50).toBeLessThan(500); // 500ms
            done();
        });
    });
});
```

#### User Acceptance Testing
- Test all authentication flows manually
- Verify OAuth provider integrations
- Test account linking/unlinking
- Validate backward compatibility
- Performance testing under load

### Phase 3: Production Rollout (Week 4)
#### Pre-deployment Checklist
- [ ] All tests passing (unit, integration, load)
- [ ] Database backup completed
- [ ] Rollback procedures documented and tested
- [ ] OAuth applications configured for production
- [ ] Environment variables secured
- [ ] Monitoring and alerting configured
- [ ] Documentation updated

#### Gradual Rollout Strategy
1. **Feature Flags**: Deploy with OAuth features disabled
2. **Staff Testing**: Enable for internal team members only
3. **Beta Users**: Enable for 10% of users
4. **Gradual Increase**: Increase to 25%, 50%, 75%
5. **Full Rollout**: Enable for all users

#### Monitoring & Alerting
```javascript
// monitoring/auth-metrics.js
const prometheus = require('prom-client');

// Define metrics
const authAttempts = new prometheus.Counter({
    name: 'auth_attempts_total',
    help: 'Total number of authentication attempts',
    labelNames: ['method', 'status']
});

const authDuration = new prometheus.Histogram({
    name: 'auth_duration_seconds',
    help: 'Authentication request duration',
    labelNames: ['method']
});

const activeUsers = new prometheus.Gauge({
    name: 'active_users_total',
    help: 'Number of currently active users'
});

// Middleware to collect metrics
const metricsMiddleware = (req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
        const duration = (Date.now() - start) / 1000;
        const method = req.path.includes('google') ? 'google' : 
                      req.path.includes('github') ? 'github' :
                      req.path.includes('discord') ? 'discord' : 'email';
        const status = res.statusCode < 400 ? 'success' : 'failure';
        
        authAttempts.inc({ method, status });
        authDuration.observe({ method }, duration);
    });
    
    next();
};
```

#### Rollback Procedures
1. **Immediate Rollback**: Feature flag to disable OAuth
2. **Database Rollback**: Revert schema changes if needed
3. **Code Rollback**: Deploy previous version
4. **Data Recovery**: Restore from backup if necessary

### Phase 4: Post-deployment (Week 5+)
#### Performance Monitoring
- Track authentication success rates
- Monitor response times
- Watch for error patterns
- User adoption metrics

#### Security Auditing
- Regular security scans
- OAuth token validation
- Session management audit
- Access pattern analysis

#### User Feedback & Iteration
- Collect user feedback on new authentication options
- Monitor support tickets for auth-related issues
- Identify areas for improvement
- Plan future enhancements

#### Documentation & Training
- Update user documentation
- Create admin guides for OAuth management
- Train support team on new features
- Document troubleshooting procedures

---

## Conclusion

This implementation guide provides a comprehensive roadmap for refactoring the authentication system to support multiple OAuth providers while maintaining backward compatibility. The structured approach ensures:

- **Zero Downtime**: Gradual rollout with feature flags
- **Data Integrity**: Careful migration with rollback procedures
- **User Experience**: Seamless authentication across providers
- **Security**: Enhanced security practices and monitoring
- **Maintainability**: Clean architecture with proper separation of concerns

Follow each step carefully, test thoroughly, and monitor closely during deployment to ensure a successful authentication system upgrade.
