# Account Context Store Integration with Better-Auth

## Overview

This guide provides a comprehensive implementation plan for integrating Better-Auth's organization and multi-tenancy features into the existing `useAccountContextStore`. The integration will replace mock account data with live data fetched from Better-Auth, enabling dynamic multi-tenant authentication with real organization management.

## Table of Contents

1. [Understanding Better-Auth Organizations](#understanding-better-auth-organizations)
2. [Current State Analysis](#current-state-analysis)
3. [Integration Architecture](#integration-architecture)
4. [Step-by-Step Implementation](#step-by-step-implementation)
5. [Error Handling & Edge Cases](#error-handling--edge-cases)
6. [Testing Strategy](#testing-strategy)
7. [Migration Plan](#migration-plan)

## Understanding Better-Auth Organizations

### Better-Auth Organization Structure

Better-Auth provides comprehensive organization management through the organization plugin. Here's what you get:

```typescript
// Better-Auth Organization Object
interface BetterAuthOrganization {
  id: string;           // Unique organization identifier
  name: string;         // Organization display name
  slug: string;         // URL-friendly identifier
  logo?: string;        // Organization logo URL
  metadata?: Record<string, any>; // Custom metadata
  createdAt: Date;      // Creation timestamp
  
  // Member relationship data (when fetched with member context)
  member?: {
    id: string;
    userId: string;
    organizationId: string;
    role: string | string[];  // User's role(s) in this organization
    createdAt: Date;
  };
}
```

### Better-Auth Client API Methods

The Better-Auth client provides several methods for organization management:

```typescript
// List all organizations the user is a member of
authClient.organization.list()

// Get the currently active organization
authClient.useActiveOrganization()

// Set an organization as active
authClient.organization.setActive({ organizationId: "org-id" })

// Get full organization details including members
authClient.organization.getFullOrganization({ organizationId: "org-id" })
```

## Current State Analysis

### Existing Account Interface

```typescript
interface Account {
  id: string;
  name: string;
  type: "personal" | "team";
  email?: string;
  avatar?: string;
  role?: string;
}
```

### Current Store Structure

```typescript
interface AccountContextStore {
  accounts: Account[];
  currentAccount: Account | null;
  
  setCurrentAccount: (account: Account) => void;
  addAccount: (account: Account) => void;
  removeAccount: (accountId: string) => void;
  updateAccount: (accountId: string, updates: Partial<Account>) => void;
  initializeWithDefaults: () => void;
}
```

### Gaps and Requirements

1. **Data Source**: Currently uses mock `defaultAccounts`, needs to fetch from Better-Auth
2. **User Context**: Missing user's personal account representation
3. **Role Management**: Static roles vs dynamic Better-Auth roles
4. **Real-time Updates**: No sync with Better-Auth state changes
5. **Error Handling**: No network error handling for API calls

## Integration Architecture

### Enhanced Account Interface

```typescript
interface Account {
  id: string;
  name: string;
  type: "personal" | "team";
  email?: string;
  avatar?: string;
  role?: string | string[];
  
  // Better-Auth specific fields
  slug?: string;
  metadata?: Record<string, any>;
  isActive?: boolean;
  membershipId?: string;
  createdAt?: Date;
}

// Additional interfaces for Better-Auth integration
interface AccountContextStore {
  // Existing fields
  accounts: Account[];
  currentAccount: Account | null;
  
  // New fields for Better-Auth
  user: BetterAuthUser | null;
  isLoading: boolean;
  error: string | null;
  lastFetch: Date | null;
  
  // Enhanced actions
  setCurrentAccount: (account: Account) => void;
  addAccount: (account: Account) => void;
  removeAccount: (accountId: string) => void;
  updateAccount: (accountId: string, updates: Partial<Account>) => void;
  
  // New Better-Auth actions
  initializeFromBetterAuth: () => Promise<void>;
  refreshAccounts: () => Promise<void>;
  setActiveOrganization: (organizationId: string) => Promise<void>;
  createPersonalAccount: (user: BetterAuthUser) => Account;
  
  // Utility actions
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}
```

### Data Mapping Strategy

```typescript
// Transform Better-Auth organization to local Account
function mapOrganizationToAccount(
  org: BetterAuthOrganization, 
  user: BetterAuthUser
): Account {
  return {
    id: org.id,
    name: org.name,
    type: "team",
    avatar: org.logo,
    role: org.member?.role || "member",
    slug: org.slug,
    metadata: org.metadata,
    isActive: false, // Will be set based on active organization
    membershipId: org.member?.id,
    createdAt: org.createdAt,
  };
}

// Create personal account from user data
function createPersonalAccount(user: BetterAuthUser): Account {
  return {
    id: `personal-${user.id}`,
    name: user.name || user.email,
    type: "personal",
    email: user.email,
    avatar: user.image,
    role: "owner",
    isActive: false,
    createdAt: user.createdAt,
  };
}
```

## Step-by-Step Implementation

### Step 1: Install and Configure Better-Auth

First, ensure Better-Auth is properly configured with the organization plugin:

```bash
# Install Better-Auth if not already installed
npm install better-auth

# Add organization plugin
npm install @better-auth/plugins
```

```typescript
// lib/auth.ts
import { betterAuth } from "better-auth";
import { organization } from "better-auth/plugins";

export const auth = betterAuth({
  // your existing config
  plugins: [
    organization({
      // Enable teams if needed
      teams: {
        enabled: true,
        maximumTeams: 10,
      },
      // Configure organization creation
      allowUserToCreateOrganization: true,
    })
  ]
});
```

```typescript
// lib/auth-client.ts
import { createAuthClient } from "better-auth/client";
import { organizationClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3000",
  plugins: [
    organizationClient()
  ]
});
```

### Step 2: Create Better-Auth Integration Service

Create a service layer to handle Better-Auth API calls:

```typescript
// services/accountService.ts
import { authClient } from "@/lib/auth-client";
import type { Account } from "@/stores/account-context-store";

export class AccountService {
  /**
   * Fetch all organizations for the current user
   */
  static async fetchOrganizations(): Promise<Account[]> {
    try {
      const { data: organizations } = await authClient.organization.list();
      const { data: user } = await authClient.getSession();
      
      if (!organizations || !user) {
        return [];
      }

      // Get active organization
      const { data: activeOrg } = await authClient.useActiveOrganization();
      const activeOrgId = activeOrg?.id;

      // Map organizations to accounts
      const orgAccounts: Account[] = organizations.map(org => ({
        id: org.id,
        name: org.name,
        type: "team" as const,
        avatar: org.logo,
        role: org.member?.role || "member",
        slug: org.slug,
        metadata: org.metadata,
        isActive: org.id === activeOrgId,
        membershipId: org.member?.id,
        createdAt: org.createdAt,
      }));

      return orgAccounts;
    } catch (error) {
      console.error("Failed to fetch organizations:", error);
      throw new Error("Failed to fetch organizations");
    }
  }

  /**
   * Create personal account from user session
   */
  static async createPersonalAccount(): Promise<Account | null> {
    try {
      const { data: user } = await authClient.getSession();
      
      if (!user) {
        return null;
      }

      return {
        id: `personal-${user.id}`,
        name: user.name || user.email,
        type: "personal",
        email: user.email,
        avatar: user.image,
        role: "owner",
        isActive: false,
        createdAt: user.createdAt,
      };
    } catch (error) {
      console.error("Failed to create personal account:", error);
      return null;
    }
  }

  /**
   * Set active organization in Better-Auth
   */
  static async setActiveOrganization(organizationId: string): Promise<void> {
    try {
      await authClient.organization.setActive({ organizationId });
    } catch (error) {
      console.error("Failed to set active organization:", error);
      throw new Error("Failed to set active organization");
    }
  }

  /**
   * Get current user session
   */
  static async getCurrentUser() {
    try {
      const { data: user } = await authClient.getSession();
      return user;
    } catch (error) {
      console.error("Failed to get current user:", error);
      return null;
    }
  }
}
```

### Step 3: Update Account Context Store

Now update the Zustand store to integrate with Better-Auth:

```typescript
// stores/account-context-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AccountService } from "@/services/accountService";

interface Account {
  id: string;
  name: string;
  type: "personal" | "team";
  email?: string;
  avatar?: string;
  role?: string | string[];
  slug?: string;
  metadata?: Record<string, any>;
  isActive?: boolean;
  membershipId?: string;
  createdAt?: Date;
}

interface BetterAuthUser {
  id: string;
  email: string;
  name?: string;
  image?: string;
  createdAt: Date;
}

interface AccountContextStore {
  // State
  accounts: Account[];
  currentAccount: Account | null;
  user: BetterAuthUser | null;
  isLoading: boolean;
  error: string | null;
  lastFetch: Date | null;
  isInitialized: boolean;

  // Actions
  setCurrentAccount: (account: Account) => void;
  addAccount: (account: Account) => void;
  removeAccount: (accountId: string) => void;
  updateAccount: (accountId: string, updates: Partial<Account>) => void;
  
  // Better-Auth actions
  initializeFromBetterAuth: () => Promise<void>;
  refreshAccounts: () => Promise<void>;
  setActiveOrganization: (organizationId: string) => Promise<void>;
  
  // Utility actions
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useAccountContextStore = create<AccountContextStore>()(
  persist(
    (set, get) => ({
      // Initial state
      accounts: [],
      currentAccount: null,
      user: null,
      isLoading: false,
      error: null,
      lastFetch: null,
      isInitialized: false,

      // Basic actions
      setCurrentAccount: (account) => {
        set({ currentAccount: account });
      },

      addAccount: (account) => {
        set((state) => ({
          accounts: [...state.accounts, account],
        }));
      },

      removeAccount: (accountId) => {
        set((state) => ({
          accounts: state.accounts.filter((account) => account.id !== accountId),
          currentAccount: 
            state.currentAccount?.id === accountId 
              ? state.accounts.find((acc) => acc.id !== accountId) || null
              : state.currentAccount,
        }));
      },

      updateAccount: (accountId, updates) => {
        set((state) => ({
          accounts: state.accounts.map((account) =>
            account.id === accountId ? { ...account, ...updates } : account
          ),
          currentAccount:
            state.currentAccount?.id === accountId
              ? { ...state.currentAccount, ...updates }
              : state.currentAccount,
        }));
      },

      // Better-Auth integration actions
      initializeFromBetterAuth: async () => {
        const state = get();
        
        // Skip if already initialized and recently fetched
        if (state.isInitialized && state.lastFetch && 
            Date.now() - state.lastFetch.getTime() < 5 * 60 * 1000) { // 5 minutes
          return;
        }

        set({ isLoading: true, error: null });

        try {
          // Get current user
          const user = await AccountService.getCurrentUser();
          
          if (!user) {
            set({ 
              isLoading: false, 
              error: "No authenticated user found",
              isInitialized: true 
            });
            return;
          }

          // Fetch organizations and create personal account
          const [orgAccounts, personalAccount] = await Promise.all([
            AccountService.fetchOrganizations(),
            AccountService.createPersonalAccount(),
          ]);

          // Combine accounts
          const allAccounts: Account[] = [];
          
          // Add personal account first
          if (personalAccount) {
            allAccounts.push(personalAccount);
          }
          
          // Add organization accounts
          allAccounts.push(...orgAccounts);

          // Determine current account (active org or personal)
          const activeAccount = allAccounts.find(acc => acc.isActive) || 
                              personalAccount || 
                              allAccounts[0] || 
                              null;

          set({
            accounts: allAccounts,
            currentAccount: activeAccount,
            user,
            isLoading: false,
            error: null,
            lastFetch: new Date(),
            isInitialized: true,
          });

        } catch (error) {
          console.error("Failed to initialize from Better-Auth:", error);
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "Failed to initialize accounts",
            isInitialized: true,
          });
        }
      },

      refreshAccounts: async () => {
        const state = get();
        
        if (!state.user) {
          console.warn("Cannot refresh accounts: no user session");
          return;
        }

        set({ isLoading: true, error: null });

        try {
          // Fetch fresh data
          const [orgAccounts, personalAccount] = await Promise.all([
            AccountService.fetchOrganizations(),
            AccountService.createPersonalAccount(),
          ]);

          // Combine accounts
          const allAccounts: Account[] = [];
          
          if (personalAccount) {
            allAccounts.push(personalAccount);
          }
          
          allAccounts.push(...orgAccounts);

          // Preserve current account if it still exists
          const currentAccountStillExists = allAccounts.find(
            acc => acc.id === state.currentAccount?.id
          );
          
          const newCurrentAccount = currentAccountStillExists || 
                                  allAccounts.find(acc => acc.isActive) ||
                                  allAccounts[0] || 
                                  null;

          set({
            accounts: allAccounts,
            currentAccount: newCurrentAccount,
            isLoading: false,
            error: null,
            lastFetch: new Date(),
          });

        } catch (error) {
          console.error("Failed to refresh accounts:", error);
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "Failed to refresh accounts",
          });
        }
      },

      setActiveOrganization: async (organizationId: string) => {
        const state = get();
        set({ isLoading: true, error: null });

        try {
          // Set active in Better-Auth
          await AccountService.setActiveOrganization(organizationId);

          // Update local state
          const updatedAccounts = state.accounts.map(account => ({
            ...account,
            isActive: account.id === organizationId && account.type === "team"
          }));

          const newCurrentAccount = updatedAccounts.find(acc => acc.id === organizationId);

          set({
            accounts: updatedAccounts,
            currentAccount: newCurrentAccount || state.currentAccount,
            isLoading: false,
            error: null,
          });

        } catch (error) {
          console.error("Failed to set active organization:", error);
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "Failed to set active organization",
          });
        }
      },

      // Utility actions
      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      reset: () => {
        set({
          accounts: [],
          currentAccount: null,
          user: null,
          isLoading: false,
          error: null,
          lastFetch: null,
          isInitialized: false,
        });
      },
    }),
    {
      name: "account-context-storage",
      partialize: (state) => ({
        accounts: state.accounts,
        currentAccount: state.currentAccount,
        user: state.user,
        lastFetch: state.lastFetch,
        isInitialized: state.isInitialized,
      }),
      // Don't persist loading and error states
    }
  )
);
```

### Step 4: Create Initialization Hook

Create a React hook to handle initialization:

```typescript
// hooks/useAccountInitialization.ts
import { useEffect } from "react";
import { useAccountContextStore } from "@/stores/account-context-store";
import { authClient } from "@/lib/auth-client";

export function useAccountInitialization() {
  const { 
    initializeFromBetterAuth, 
    reset, 
    isInitialized, 
    isLoading, 
    error 
  } = useAccountContextStore();

  useEffect(() => {
    let mounted = true;

    // Initialize when component mounts
    const initialize = async () => {
      try {
        // Check if user is authenticated
        const { data: session } = await authClient.getSession();
        
        if (session && mounted) {
          await initializeFromBetterAuth();
        } else if (mounted) {
          // No session, reset the store
          reset();
        }
      } catch (error) {
        console.error("Failed to check session:", error);
        if (mounted) {
          reset();
        }
      }
    };

    initialize();

    // Listen for authentication changes
    const unsubscribe = authClient.onSessionChange((session) => {
      if (mounted) {
        if (session) {
          initializeFromBetterAuth();
        } else {
          reset();
        }
      }
    });

    return () => {
      mounted = false;
      unsubscribe?.();
    };
  }, [initializeFromBetterAuth, reset]);

  return {
    isInitialized,
    isLoading,
    error,
  };
}
```

### Step 5: Update Components

Update your components to use the new initialization:

```typescript
// components/layouts/RootLayout.tsx
import { useAccountInitialization } from "@/hooks/useAccountInitialization";
import { useAccountContextStore } from "@/stores/account-context-store";

export function RootLayout({ children }: { children: React.ReactNode }) {
  const { isLoading, error } = useAccountInitialization();
  const { clearError } = useAccountContextStore();

  if (isLoading) {
    return <div>Loading accounts...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error loading accounts: {error}</p>
        <button onClick={clearError}>Retry</button>
      </div>
    );
  }

  return <>{children}</>;
}
```

```typescript
// components/account-switcher.tsx
import { useAccountContextStore } from "@/stores/account-context-store";

export function AccountSwitcher() {
  const { 
    accounts, 
    currentAccount, 
    setCurrentAccount, 
    setActiveOrganization,
    isLoading,
    error 
  } = useAccountContextStore();

  const handleAccountSwitch = async (account: Account) => {
    if (account.type === "team") {
      // For organization accounts, set as active in Better-Auth
      await setActiveOrganization(account.id);
    } else {
      // For personal accounts, just update local state
      setCurrentAccount(account);
    }
  };

  return (
    <div className="account-switcher">
      {accounts.map((account) => (
        <button
          key={account.id}
          onClick={() => handleAccountSwitch(account)}
          disabled={isLoading}
          className={currentAccount?.id === account.id ? "active" : ""}
        >
          {account.avatar && <img src={account.avatar} alt={account.name} />}
          <span>{account.name}</span>
          <span className="role">{account.role}</span>
          {account.isActive && <span className="active-indicator">Active</span>}
        </button>
      ))}
      
      {error && (
        <div className="error">
          {error}
        </div>
      )}
    </div>
  );
}
```

## Error Handling & Edge Cases

### Network Error Handling

```typescript
// utils/errorHandling.ts
export class BetterAuthError extends Error {
  constructor(
    message: string, 
    public code?: string, 
    public status?: number
  ) {
    super(message);
    this.name = "BetterAuthError";
  }
}

export function handleBetterAuthError(error: unknown): BetterAuthError {
  if (error instanceof BetterAuthError) {
    return error;
  }
  
  if (error instanceof Error) {
    return new BetterAuthError(error.message);
  }
  
  return new BetterAuthError("An unknown error occurred");
}
```

### Retry Logic

```typescript
// utils/retryLogic.ts
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown error");
      
      if (i === maxRetries) {
        break;
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
  
  throw lastError!;
}
```

### Edge Cases to Handle

1. **No Organizations**: User has no organization memberships
2. **Network Offline**: Handle offline scenarios gracefully
3. **Session Expiry**: Detect and handle expired sessions
4. **Concurrent Updates**: Handle multiple components updating simultaneously
5. **Stale Data**: Implement cache invalidation strategies

## Testing Strategy

### Unit Tests

```typescript
// __tests__/accountService.test.ts
import { AccountService } from "@/services/accountService";
import { authClient } from "@/lib/auth-client";

// Mock authClient
jest.mock("@/lib/auth-client");

describe("AccountService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchOrganizations", () => {
    it("should fetch and map organizations correctly", async () => {
      // Mock Better-Auth response
      (authClient.organization.list as jest.Mock).mockResolvedValue({
        data: [
          {
            id: "org-1",
            name: "Test Org",
            slug: "test-org",
            member: { role: "admin" }
          }
        ]
      });

      (authClient.getSession as jest.Mock).mockResolvedValue({
        data: { id: "user-1", email: "test@example.com" }
      });

      (authClient.useActiveOrganization as jest.Mock).mockResolvedValue({
        data: { id: "org-1" }
      });

      const accounts = await AccountService.fetchOrganizations();

      expect(accounts).toHaveLength(1);
      expect(accounts[0]).toMatchObject({
        id: "org-1",
        name: "Test Org",
        type: "team",
        role: "admin",
        isActive: true,
      });
    });

    it("should handle errors gracefully", async () => {
      (authClient.organization.list as jest.Mock).mockRejectedValue(
        new Error("Network error")
      );

      await expect(AccountService.fetchOrganizations()).rejects.toThrow(
        "Failed to fetch organizations"
      );
    });
  });
});
```

### Integration Tests

```typescript
// __tests__/useAccountContextStore.test.ts
import { renderHook, act } from "@testing-library/react";
import { useAccountContextStore } from "@/stores/account-context-store";

describe("useAccountContextStore", () => {
  beforeEach(() => {
    // Reset store state
    useAccountContextStore.getState().reset();
  });

  it("should initialize from Better-Auth", async () => {
    const { result } = renderHook(() => useAccountContextStore());

    await act(async () => {
      await result.current.initializeFromBetterAuth();
    });

    expect(result.current.isInitialized).toBe(true);
    expect(result.current.accounts.length).toBeGreaterThan(0);
  });
});
```

## Migration Plan

### Phase 1: Preparation (Week 1)
- [ ] Install and configure Better-Auth with organization plugin
- [ ] Set up database migrations for organization tables
- [ ] Create basic auth client configuration
- [ ] Add TypeScript interfaces and types

### Phase 2: Core Integration (Week 2)
- [ ] Implement AccountService with Better-Auth API calls
- [ ] Update useAccountContextStore with Better-Auth integration
- [ ] Create initialization hook
- [ ] Add error handling and retry logic

### Phase 3: Component Updates (Week 3)
- [ ] Update account switcher component
- [ ] Modify layout components to use new initialization
- [ ] Update navigation and user interface components
- [ ] Add loading states and error handling to UI

### Phase 4: Testing & Validation (Week 4)
- [ ] Write comprehensive unit tests
- [ ] Create integration tests
- [ ] Perform user acceptance testing
- [ ] Load testing with multiple organizations

### Phase 5: Deployment & Monitoring (Week 5)
- [ ] Deploy to staging environment
- [ ] Monitor for errors and performance issues
- [ ] Gradual rollout to production
- [ ] Set up monitoring and alerting

### Rollback Plan

1. **Feature Flag**: Implement feature flag to switch between mock and Better-Auth
2. **Data Backup**: Ensure existing account data is preserved
3. **Graceful Degradation**: Fall back to mock data if Better-Auth fails
4. **Quick Rollback**: Ability to disable Better-Auth integration quickly

### Migration Checklist

- [ ] Better-Auth server setup complete
- [ ] Database migrations applied
- [ ] Client configuration tested
- [ ] AccountService implemented and tested
- [ ] Store integration complete
- [ ] Component updates finished
- [ ] Error handling implemented
- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] Monitoring configured

## Conclusion

This integration plan provides a comprehensive approach to replacing the mock account system with Better-Auth's robust organization management. The implementation maintains backward compatibility while adding powerful multi-tenant capabilities.

Key benefits of this integration:

1. **Real Multi-Tenancy**: Actual organization management with roles and permissions
2. **Scalability**: Better-Auth handles complex organization hierarchies
3. **Security**: Built-in authentication and authorization
4. **Flexibility**: Support for teams, custom roles, and metadata
5. **Maintenance**: Reduced custom code for account management

The phased approach ensures minimal disruption to existing functionality while progressively enhancing the system with Better-Auth's capabilities.
