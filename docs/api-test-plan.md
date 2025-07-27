# API Test Plan - senseiiwyze-dashboard

This document outlines the comprehensive test strategy for the senseiiwyze-dashboard API and authentication system using better-auth.

## Testing Philosophy

We follow a **Test-Driven Development (TDD)** approach:
1. Write tests first to define expected behavior
2. Run tests to confirm they fail (Red)
3. Implement minimum code to pass tests (Green)  
4. Refactor while keeping tests passing (Refactor)

## Test Categories

### 🔐 Authentication Tests
| Test Case | Priority | Status | Script | Description |
|-----------|----------|--------|--------|-------------|
| Email/Password Sign Up | Critical | ✅ | `test-auth-flows.ts` | User registration with email/password |
| Email/Password Sign In | Critical | ✅ | `test-auth-flows.ts` | User login with email/password |
| Sign Out | Critical | ✅ | `test-auth-flows.ts` | User logout and session cleanup |
| Session Management | Critical | ✅ | `test-better-auth-api.ts` | Session creation, validation, expiry |
| Password Validation | High | ✅ | `test-auth-flows.ts` | Password strength requirements |
| Email Verification | Medium | ⚠️ | `test-magic-link.ts` | Email verification flow |
| Password Reset | High | ❌ | TBD | Password reset functionality |
| Account Lockout | Medium | ❌ | TBD | Account lockout after failed attempts |

### 🌐 Social Authentication Tests  
| Test Case | Priority | Status | Script | Description |
|-----------|----------|--------|--------|-------------|
| GitHub OAuth | High | ⚠️ | `test-github-oauth.ts` | GitHub OAuth integration (pending configuration) |
| Google OAuth | High | ⚠️ | `test-oauth-providers.ts` | Google OAuth integration (pending configuration) |
| OAuth Error Handling | High | ⚠️ | `test-oauth-providers.ts` | OAuth failure scenarios |
| OAuth Account Linking | Medium | ❌ | TBD | Link OAuth accounts to existing users |

### 🔒 Two-Factor Authentication Tests
| Test Case | Priority | Status | Script | Description |
|-----------|----------|--------|--------|-------------|
| 2FA Setup | High | ✅ | `test-2fa-plugin.ts` | Enable 2FA for user account |
| 2FA Login | High | ✅ | `test-2fa-plugin.ts` | Login with 2FA enabled |
| 2FA Backup Codes | Medium | ✅ | `test-2fa-plugin.ts` | Generate and use backup codes |
| 2FA Disable | Medium | ⚠️ | `test-2fa-plugin.ts` | Disable 2FA functionality |
| 2FA Recovery | High | ❌ | TBD | Account recovery with 2FA |

### 👥 User Management Tests
| Test Case | Priority | Status | Script | Description |
|-----------|----------|--------|--------|-------------|
| User Profile Update | High | ❌ | TBD | Update user profile information |
| User List (Admin) | High | ❌ | TBD | Admin endpoint to list users |
| User Details (Admin) | High | ❌ | TBD | Admin endpoint to get user details |
| User Deletion | Medium | ❌ | TBD | Delete user account |
| User Role Management | High | ❌ | TBD | Assign and manage user roles |
| User Search | Medium | ❌ | TBD | Search users by criteria |

### 🏢 Organization Tests
| Test Case | Priority | Status | Script | Description |
|-----------|----------|--------|--------|-------------|
| Create Organization | High | ❌ | TBD | Create new organization |
| Join Organization | High | ❌ | TBD | User joins existing organization |
| Organization Roles | High | ❌ | TBD | Assign roles within organization |
| Leave Organization | Medium | ❌ | TBD | User leaves organization |
| Organization Settings | Medium | ❌ | TBD | Manage organization settings |
| Organization Deletion | Low | ❌ | TBD | Delete organization |

### 🔑 API Security Tests
| Test Case | Priority | Status | Script | Description |
|-----------|----------|--------|--------|-------------|
| Protected Route Access | Critical | ⚠️ | `test-better-auth-api.ts` | Verify auth required endpoints |
| Admin Route Protection | Critical | ❌ | TBD | Verify admin-only endpoints |
| Rate Limiting | High | ❌ | TBD | API rate limiting functionality |
| CORS Configuration | High | ❌ | TBD | Cross-origin request handling |
| Input Validation | High | ❌ | TBD | Sanitize and validate inputs |
| SQL Injection Protection | Critical | ❌ | TBD | Prevent SQL injection attacks |
| XSS Protection | High | ❌ | TBD | Prevent cross-site scripting |

### 📧 Email Integration Tests
| Test Case | Priority | Status | Script | Description |
|-----------|----------|--------|--------|-------------|
| Welcome Email | Medium | ⚠️ | `test-resend-email.ts` | Send welcome email to new users |
| Verification Email | High | ⚠️ | `test-resend-email.ts` | Email verification flow |
| Magic Link Email | Medium | ✅ | `test-magic-link.ts` | Passwordless login via email |
| Password Reset Email | High | ❌ | TBD | Password reset email flow |
| Email Templates | Medium | ❌ | TBD | Email template rendering |

### 🗄️ Database Tests
| Test Case | Priority | Status | Script | Description |
|-----------|----------|--------|--------|-------------|
| Database Connection | Critical | ✅ | `verify-db-connection.ts` | Database connectivity |
| Schema Validation | Critical | ✅ | `introspect-schema.ts` | Database schema integrity |
| Data Persistence | High | ✅ | `test-better-auth-api.ts` | Data saving and retrieval |
| Migration Tests | High | ❌ | TBD | Database migration testing |
| Backup/Restore | Medium | ❌ | TBD | Database backup functionality |

### ⚡ Performance Tests
| Test Case | Priority | Status | Script | Description |
|-----------|----------|--------|--------|-------------|
| Response Time | Medium | ❌ | TBD | API response time benchmarks |
| Concurrent Users | Medium | ❌ | TBD | Multiple simultaneous users |
| Database Query Performance | Medium | ❌ | TBD | Query execution time |
| Memory Usage | Low | ❌ | TBD | Memory consumption monitoring |

### 🔧 Integration Tests
| Test Case | Priority | Status | Script | Description |
|-----------|----------|--------|--------|-------------|
| Frontend-Backend Integration | High | ❌ | TBD | Full stack integration |
| Third-party Service Integration | Medium | ⚠️ | Multiple scripts | External service connectivity |
| Environment Configuration | High | ✅ | `test-auth-config.ts` | Environment variable validation |
| Production Readiness | Critical | ⚠️ | `test-implementation-gaps.ts` | Production deployment checks |

## Test Status Legend

- ✅ **Implemented & Passing**: Test exists and passes
- ⚠️ **Partial**: Test exists but may have gaps or issues  
- ❌ **Missing**: Test needs to be implemented
- 🚧 **In Progress**: Currently being developed

## Test Execution Strategy

### Local Development
```bash
# Run all auth tests
pnpm run test:auth-complete

# Run specific test categories  
pnpm run test:auth-basic
pnpm run test:oauth
pnpm run test:api-security
pnpm run test:database

# Run comprehensive test suite
pnpm run test:api-complete
```

### Continuous Integration
```bash
# Pre-commit tests (fast)
pnpm run test:critical

# Full test suite (CI/CD)
pnpm run test:all

# Performance tests (nightly)
pnpm run test:performance
```

## Test Data Management

### Demo Users
Use the demo users created by `setup-demo-users.ts`:
- `admin@senseiiwyze.com` - Admin testing
- `manager@senseiiwyze.com` - Manager role testing  
- `user@senseiiwyze.com` - Standard user testing
- `test@senseiiwyze.com` - Disposable test account
- `dev@senseiiwyze.com` - Development testing

### Test User Creation
```typescript
// Create test users for each test run
const testUser = {
  email: `test-${Date.now()}@example.com`,
  password: "TestPassword123!",
  name: "Test User"
};
```

## Test Environment Requirements

### Development Environment
- ✅ Local database (SQLite)
- ✅ Local development server
- ✅ Environment variables configured
- ⚠️ Email service (Resend) configured

### CI/CD Environment  
- ❌ Test database provisioning
- ❌ Environment variable injection
- ❌ Test result reporting
- ❌ Coverage reporting

## Critical Test Paths

### User Journey Tests
1. **New User Registration**
   - Sign up → Email verification → Complete profile → First login
   
2. **Returning User Login**
   - Sign in → 2FA (if enabled) → Dashboard access
   
3. **Admin User Workflow**
   - Admin login → User management → Organization setup

4. **OAuth User Flow**
   - OAuth login → Account linking → Profile completion

### Security Test Scenarios
1. **Authentication Bypass Attempts**
2. **Privilege Escalation Tests**
3. **Session Hijacking Prevention**
4. **Input Validation Edge Cases**

## Next Steps

### Phase 1: Complete Missing Critical Tests
- [ ] Password reset functionality
- [ ] Admin route protection
- [ ] User management endpoints
- [ ] Input validation

### Phase 2: Organization & Team Features
- [ ] Organization CRUD operations
- [ ] Team member management
- [ ] Role-based access control

### Phase 3: Performance & Security
- [ ] Rate limiting implementation
- [ ] Performance benchmarking
- [ ] Security penetration testing

### Phase 4: Production Readiness
- [ ] CI/CD pipeline integration
- [ ] Monitoring and alerting
- [ ] Error tracking
- [ ] Performance monitoring

## Related Documentation
- [Demo Users Setup Guide](./demo-users-setup.md)
- [Better Auth Implementation Guide](./better-auth-supabase-guide.md)
- [Environment Configuration](../README.md) 