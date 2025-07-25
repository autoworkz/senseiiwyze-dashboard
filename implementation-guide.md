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

## Step 3: Database Schema Synchronization

### User Table Enhancement
Extend existing user table to support multiple auth methods:

```sql
-- Add OAuth provider columns
ALTER TABLE users ADD COLUMN google_id VARCHAR(255) UNIQUE;
ALTER TABLE users ADD COLUMN github_id VARCHAR(255) UNIQUE;
ALTER TABLE users ADD COLUMN discord_id VARCHAR(255) UNIQUE;
ALTER TABLE users ADD COLUMN auth_method VARCHAR(50) DEFAULT 'email';
ALTER TABLE users ADD COLUMN is_email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN avatar_url VARCHAR(500);
ALTER TABLE users ADD COLUMN last_login_method VARCHAR(50);
ALTER TABLE users ADD COLUMN created_via VARCHAR(50) DEFAULT 'email';

-- Add indexes for performance
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_users_github_id ON users(github_id);
CREATE INDEX idx_users_discord_id ON users(discord_id);
CREATE INDEX idx_users_auth_method ON users(auth_method);
```

### Account Linking Table
Create table to manage linked accounts:

```sql
CREATE TABLE user_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    provider_id VARCHAR(255) NOT NULL,
    provider_email VARCHAR(255),
    provider_data JSONB,
    linked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_primary BOOLEAN DEFAULT FALSE,
    UNIQUE(provider, provider_id)
);

CREATE INDEX idx_user_accounts_user_id ON user_accounts(user_id);
CREATE INDEX idx_user_accounts_provider ON user_accounts(provider, provider_id);
```

### Session Management Enhancement
```sql
-- Extend sessions table if exists, or create new
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    refresh_token VARCHAR(255),
    auth_method VARCHAR(50),
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

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

### Core AuthService Architecture
Refactor authentication service to support multiple providers:

```javascript
// auth/AuthService.js
class AuthService {
    constructor() {
        this.strategies = new Map();
        this.initializeStrategies();
    }
    
    // Initialize all authentication strategies
    initializeStrategies() {
        this.strategies.set('email', new EmailPasswordStrategy());
        this.strategies.set('google', new GoogleOAuthStrategy());
        this.strategies.set('github', new GitHubOAuthStrategy());
        this.strategies.set('discord', new DiscordOAuthStrategy());
    }
    
    // Authenticate user with specified strategy
    async authenticate(strategy, credentials) {
        const authStrategy = this.strategies.get(strategy);
        if (!authStrategy) {
            throw new Error(`Unsupported auth strategy: ${strategy}`);
        }
        return await authStrategy.authenticate(credentials);
    }
    
    // Link account to existing user
    async linkAccount(userId, provider, providerData) {
        // Implementation for account linking
    }
    
    // Unlink account from user
    async unlinkAccount(userId, provider) {
        // Implementation for account unlinking
    }
}
```

### Strategy Pattern Implementation
Create individual strategy classes:

```javascript
// auth/strategies/GoogleOAuthStrategy.js
class GoogleOAuthStrategy {
    async authenticate(profile) {
        // Find existing user by Google ID
        let user = await User.findByGoogleId(profile.id);
        
        if (!user) {
            // Check if user exists with same email
            user = await User.findByEmail(profile.emails[0].value);
            if (user) {
                // Link Google account to existing user
                await this.linkGoogleAccount(user.id, profile);
            } else {
                // Create new user
                user = await this.createUserFromGoogle(profile);
            }
        }
        
        return user;
    }
    
    async linkGoogleAccount(userId, profile) {
        // Implementation for linking Google account
    }
    
    async createUserFromGoogle(profile) {
        // Implementation for creating user from Google profile
    }
}
```

### Session Management
Enhanced session handling:

```javascript
// auth/SessionManager.js
class SessionManager {
    async createSession(user, authMethod, metadata = {}) {
        const sessionToken = this.generateSecureToken();
        const refreshToken = this.generateSecureToken();
        
        const session = {
            user_id: user.id,
            session_token: sessionToken,
            refresh_token: refreshToken,
            auth_method: authMethod,
            ip_address: metadata.ip,
            user_agent: metadata.userAgent,
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        };
        
        await db.query('INSERT INTO user_sessions ...', session);
        return { sessionToken, refreshToken };
    }
    
    async validateSession(sessionToken) {
        // Implementation for session validation
    }
    
    async refreshSession(refreshToken) {
        // Implementation for session refresh
    }
}
```

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

### Authentication Routes
Implement comprehensive authentication API routes:

```javascript
// routes/auth.js
const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

// Rate limiting
const authRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: 'Too many authentication attempts'
});

// Email/Password Routes
router.post('/login', authRateLimit, async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validate input
        const { error } = loginSchema.validate({ email, password });
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        
        // Authenticate user
        const user = await authService.authenticate('email', { email, password });
        
        // Create session
        const { sessionToken, refreshToken } = await sessionManager.createSession(
            user, 
            'email', 
            { ip: req.ip, userAgent: req.get('User-Agent') }
        );
        
        // Set secure cookies
        res.cookie('sessionToken', sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });
        
        res.json({
            success: true,
            user: sanitizeUser(user),
            sessionToken // Also return in response for SPA
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(401).json({ error: 'Authentication failed' });
    }
});

router.post('/register', authRateLimit, async (req, res) => {
    try {
        const { email, password, name } = req.body;
        
        // Validate input
        const { error } = registerSchema.validate({ email, password, name });
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        
        // Register user
        const user = await authService.register({ email, password, name });
        
        res.status(201).json({
            success: true,
            message: 'Registration successful. Please verify your email.',
            user: sanitizeUser(user)
        });
        
    } catch (error) {
        if (error instanceof ValidationError) {
            return res.status(400).json({ error: error.message });
        }
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// OAuth Routes
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/google/callback', 
    passport.authenticate('google', { session: false }),
    async (req, res) => {
        try {
            // Create session for OAuth user
            const { sessionToken } = await sessionManager.createSession(
                req.user,
                'google',
                { ip: req.ip, userAgent: req.get('User-Agent') }
            );
            
            // Set cookie and redirect
            res.cookie('sessionToken', sessionToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000
            });
            
            res.redirect('/dashboard?auth=success');
        } catch (error) {
            console.error('OAuth callback error:', error);
            res.redirect('/login?error=oauth_failed');
        }
    }
);

// Similar routes for GitHub and Discord...

// Session Management Routes
router.post('/refresh', async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const newSession = await sessionManager.refreshSession(refreshToken);
        
        res.json({
            success: true,
            sessionToken: newSession.sessionToken
        });
    } catch (error) {
        res.status(401).json({ error: 'Invalid refresh token' });
    }
});

router.post('/logout', authenticateToken, async (req, res) => {
    try {
        await sessionManager.destroySession(req.sessionToken);
        res.clearCookie('sessionToken');
        res.json({ success: true });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Logout failed' });
    }
});
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
