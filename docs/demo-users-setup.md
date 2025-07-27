# Demo Users Setup

This document explains how to create demo/base users for the senseiiwyze-dashboard application using better-auth.

## Overview

The `setup-demo-users.ts` script automatically creates a set of demo users for development and testing purposes. It uses the better-auth client to create users if they don't already exist.

## Demo Users

The script creates the following demo users:

| Name | Email | Password | Role |
|------|-------|----------|------|
| Admin User | admin@senseiiwyze.com | Admin123! | admin |
| Manager User | manager@senseiiwyze.com | Manager123! | manager |
| Demo User | user@senseiiwyze.com | User123! | user |
| Test User | test@senseiiwyze.com | Test123! | user |
| Developer User | dev@senseiiwyze.com | Developer123! | developer |

## Usage

### Using npm script (Recommended)

```bash
pnpm run db:demo-users
```

### Using tsx directly

```bash
pnpm tsx scripts/setup-demo-users.ts
```

## Features

- ✅ **Idempotent**: Safe to run multiple times - skips existing users
- ✅ **Better-auth integration**: Uses the project's auth client
- ✅ **Colored output**: Clear visual feedback with chalk
- ✅ **Error handling**: Graceful error handling and reporting
- ✅ **Progress tracking**: Shows creation progress and summary

## Example Output

```
🚀 Setting up demo users for senseiiwyze-dashboard

📋 Environment Check:
  Node Environment: development
  Base URL: http://localhost:3000

👥 Processing Demo Users:
  ⏭️  Skipping admin@senseiiwyze.com (already exists)
  🔄 Creating user: manager@senseiiwyze.com
    ✅ Created: yTNE8ZKUE1O1FxGPOEwekebFkJSQPSta

📊 Summary:
  ✅ Created: 1 users
  ⏭️  Skipped: 4 users
  ❌ Failed: 0 users
  📝 Total: 5 users processed

🎉 Demo users setup completed!

📝 Login Credentials:
  Admin User (admin):
    Email: admin@senseiiwyze.com
    Password: Admin123!
  ...
```

## Requirements

- Better-auth server must be running
- Database must be initialized
- Environment variables must be configured
- Network access to the auth endpoints

## Environment

The script works with:
- Development environment (localhost:3000)
- Production environment (uses NEXT_PUBLIC_APP_URL)

## Customization

To add or modify demo users, edit the `demoUsers` array in `scripts/setup-demo-users.ts`:

```typescript
const demoUsers: DemoUser[] = [
  {
    email: 'newuser@example.com',
    password: 'SecurePassword123!',
    name: 'New User',
    role: 'custom_role'
  },
  // ... existing users
]
```

## Troubleshooting

### Common Issues

1. **Authentication failed**: Server not running or incorrect base URL
2. **Password too short**: Ensure passwords meet better-auth requirements
3. **Network errors**: Check server connectivity and firewall settings

### Password Requirements

Better-auth requires passwords to meet certain criteria:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter  
- At least one number
- At least one special character

## Security Notes

- Demo passwords are intentionally simple for development
- **Never use these credentials in production**
- Change passwords before deploying to production
- Consider using environment variables for production user creation

## Related Files

- `scripts/setup-demo-users.ts` - Main script
- `src/lib/auth-client.ts` - Auth client configuration
- `src/lib/auth.ts` - Auth server configuration
- `package.json` - Contains the `db:demo-users` script 