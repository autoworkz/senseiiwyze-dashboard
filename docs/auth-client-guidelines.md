# Authentication Client Rules

## ⚠️ CRITICAL: Use authClient First

**ALWAYS use `authClient` on the client/front-end before using any other authentication method.**

### Default Approach

1. **Client-Side (Primary)**
   ```typescript
   import { useSignIn, useSignUp, useSession, useSignOut } from '@/auth-client';
   
   const signIn = useSignIn();
   const signUp = useSignUp();
   const { data: session } = useSession();
   ```

2. **Server-Side Auth API (Secondary)**
   - Token validation on server
   - Protected route handling
   - Backend operations with user context

3. **Direct API Calls (Tertiary - Rare)**
   - Only for performance-critical paths
   - Custom workflows not supported by authClient
   - **Must be documented with justification**

### Examples

```typescript
// ✅ CORRECT - Use authClient hooks
const handleLogin = async () => {
  await signIn.email({ email, password });
};

const { data: session, isLoading } = useSession();
if (!session) return <LoginPage />;
```

### Available Methods

- `useSession()` - Current session state
- `useSignIn()` - Email/password or social sign-in
- `useSignUp()` - Create new accounts
- `useSignOut()` - Sign out current user

### Enforcement

- **ALWAYS** use `authClient` for front-end auth
- **NEVER** bypass without documentation
- **ALWAYS** handle auth errors properly