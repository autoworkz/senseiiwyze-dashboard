# Environment Variable Configuration

This guide details the environment variable configuration for the Better Auth integration with the SenseiiWyze Dashboard.

## New Environment Variables

Add these entries to your `.env.example` and `.env` files:

```env
# =================================
# BETTER AUTH CONFIGURATION
# =================================
# Better Auth server URL
BETTER_AUTH_URL=https://auth.example.com

# Better Auth API key for server-to-server communication
BETTER_AUTH_API_KEY=sk-your-better-auth-api-key-here

# Enable organization plugin for multi-tenant support
ORGANIZATION_PLUGIN_ENABLED=true
```

## Updated Database Configuration

The database configuration has been simplified to use a single Supabase database:

```env
# =================================
# DATABASE CONFIGURATION
# =================================
# Supabase Database (Single database for both mobile app and dashboard)
# This database contains both Supabase auth schema and Better Auth tables
DATABASE_URL=postgresql://postgres.[YOUR-PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Loading Environment Variables with `process.env`

### 1. Install dotenv (if not already installed)

```bash
npm install dotenv
# or
pnpm add dotenv
# or
yarn add dotenv
```

### 2. Load Environment Variables

At the beginning of your main application entry point (e.g., `lib/auth.ts` or `lib/config.ts`):

```typescript
// Load environment variables from .env file
require('dotenv').config();
// or using ES modules:
import 'dotenv/config';
```

### 3. Access Variables via `process.env`

#### Basic Usage

```typescript
// Better Auth configuration
const betterAuthUrl = process.env.BETTER_AUTH_URL;
const betterAuthApiKey = process.env.BETTER_AUTH_API_KEY;
const organizationPluginEnabled = process.env.ORGANIZATION_PLUGIN_ENABLED === 'true';

console.log('Better Auth URL:', betterAuthUrl);
console.log('Organization Plugin Enabled:', organizationPluginEnabled);
```

#### With Type Safety and Validation

```typescript
// lib/config.ts
interface Config {
  betterAuth: {
    url: string;
    apiKey: string;
    organizationPluginEnabled: boolean;
  };
  database: {
    url: string;
  };
  supabase: {
    url: string;
    anonKey: string;
    serviceRoleKey: string;
  };
}

function getConfig(): Config {
  const requiredEnvVars = [
    'BETTER_AUTH_URL',
    'BETTER_AUTH_API_KEY',
    'DATABASE_URL',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];

  // Validate required environment variables
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }

  return {
    betterAuth: {
      url: process.env.BETTER_AUTH_URL!,
      apiKey: process.env.BETTER_AUTH_API_KEY!,
      organizationPluginEnabled: process.env.ORGANIZATION_PLUGIN_ENABLED === 'true'
    },
    database: {
      url: process.env.DATABASE_URL!
    },
    supabase: {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!
    }
  };
}

export const config = getConfig();
```

#### Usage in Better Auth Setup

```typescript
// lib/auth.ts
import { betterAuth } from 'better-auth';
import { organization } from 'better-auth/plugins/organization';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sql } from './db';
import { config } from './config';

export const auth = betterAuth({
  database: drizzleAdapter(sql, {
    // Schema configuration
    usePlural: false,
  }),
  
  // Use environment variables
  baseURL: config.betterAuth.url,
  secret: config.betterAuth.apiKey,
  
  // Enable organization plugin based on environment variable
  plugins: config.betterAuth.organizationPluginEnabled 
    ? [organization()] 
    : [],
    
  // Email provider configuration
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  
  // OAuth providers (optional)
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
  },
});
```

### 4. Next.js Specific Considerations

#### Public vs Private Variables

- **Public variables** (prefixed with `NEXT_PUBLIC_`): Available in both server and client code
- **Private variables**: Only available in server-side code

```typescript
// Available in both client and server
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Only available on server-side
const betterAuthApiKey = process.env.BETTER_AUTH_API_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
```

#### Environment-Specific Configuration

```typescript
// lib/config.ts
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

export const config = {
  betterAuth: {
    url: isDevelopment 
      ? 'http://localhost:3000' 
      : process.env.BETTER_AUTH_URL!,
    debug: isDevelopment,
  },
  // ... other config
};
```

### 5. Validation and Error Handling

```typescript
// lib/env-validation.ts
import { z } from 'zod';

const envSchema = z.object({
  BETTER_AUTH_URL: z.string().url(),
  BETTER_AUTH_API_KEY: z.string().min(1),
  ORGANIZATION_PLUGIN_ENABLED: z.string().transform(val => val === 'true'),
  DATABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

export const env = envSchema.parse(process.env);
```

## Database Architecture

The setup now uses a **single Supabase database** containing:

1. **Supabase auth schema** (`auth.users`, `auth.sessions`) - for mobile app
2. **Better Auth tables** (`"user"`, `organization`, `member`) - for dashboard
3. **Existing workplaces table** - synced with Better Auth organizations

## Migration Steps

1. **Add environment variables** to your `.env` file
2. **Run Better Auth migrations** to create the required tables
3. **Execute sync migration** to connect workplaces with organizations:
   ```sql
   SELECT migrate_existing_workplaces();
   ```

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use strong, unique values** for API keys and secrets
3. **Rotate secrets regularly** in production
4. **Use environment-specific configuration** for different deployment stages
5. **Validate environment variables** at application startup

## Example Usage in Components

```typescript
// components/AuthProvider.tsx
'use client';

import { createContext, useContext } from 'react';
import { auth } from '@/lib/auth';

// This will use the environment variables configured in auth.ts
const AuthContext = createContext(auth);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

This configuration ensures that your Better Auth integration is properly configured with environment variables while maintaining compatibility with your existing Supabase setup for the mobile application.
