# Developer Onboarding Guide

> **🚀 Get up and running in 5 minutes with consistent environment setup**

## ✅ Prerequisites

- **Git**: Latest version
- **Docker**: Docker Desktop with Docker Compose v2.22+
- **VS Code**: (Optional) For DevContainer integration

## 🔧 Quick Setup (Recommended)

### Option 1: Docker Development (Universal)

```bash
# 1. Clone repository
git clone https://github.com/senseiwyze/dashboard.git
cd senseiiwyze-dashboard

# 2. Copy environment template
cp .env.example .env.local

# 3. Get secrets from team lead
# REQUEST: Slack @kevinhill for current BETTER_AUTH_SECRET and API keys

# 4. Start development environment
docker-compose up app

# 5. Verify setup
open http://localhost:3000
```

**✅ Success**: If you see the SenseiiWyze dashboard, you're ready to develop!

### Option 2: VS Code DevContainer

```bash
# 1. Clone repository (same as above)
git clone https://github.com/senseiwyze/dashboard.git
cd senseiiwyze-dashboard

# 2. Copy environment template (same as above)
cp .env.example .env.local

# 3. Get secrets from team lead (same as above)
# REQUEST: Slack @kevinhill for current secrets

# 4. Open in VS Code
code .

# 5. Reopen in DevContainer
# Command Palette (Cmd+Shift+P) → "Dev Containers: Reopen in Container"

# 6. Verify setup
# Visit http://localhost:3000 from your browser
```

## 🔐 Environment Variables Setup

### Required Variables (.env.local)
```bash
# 🚨 CRITICAL: Get these from team lead
BETTER_AUTH_SECRET="ask-team-lead-for-current-value"
RESEND_API_KEY="ask-team-lead-for-current-value"

# 🔗 OAuth (if testing auth)
GITHUB_CLIENT_ID="ask-team-lead-if-needed"
GITHUB_CLIENT_SECRET="ask-team-lead-if-needed"
GOOGLE_CLIENT_ID="ask-team-lead-if-needed"
GOOGLE_CLIENT_SECRET="ask-team-lead-if-needed"

# 📧 Email configuration
EMAIL_PROVIDER="CONSOLE"  # Local development
EMAIL_OTP_FROM="notifications@x.senseiiwyze.com"

# 🌐 URLs
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_AUTH_URL="http://localhost:3000"
```

### ⚠️ Secret Request Protocol

**DO NOT** share secrets via:
- ❌ Email
- ❌ Slack public channels  
- ❌ GitHub issues/comments
- ❌ Any public communication

**DO** request secrets via:
- ✅ Direct Slack DM to @kevinhill
- ✅ Secure team chat channels
- ✅ In-person handoff

## 🧪 Verification Checklist

### Development Server
- [ ] `docker-compose up app` starts without errors
- [ ] Visit http://localhost:3000 shows dashboard
- [ ] Hot reloading works (edit a file, see changes)

### Authentication Flow
- [ ] Visit http://localhost:3000/auth/login
- [ ] Email signup form displays
- [ ] OAuth buttons show (if configured)
- [ ] No console errors in browser dev tools

### Build Process
```bash
# Test production build (should complete without errors)
docker exec <container-name> pnpm build
```

## 🔄 Development Workflow

### Daily Development
```bash
# Start development
docker-compose up app

# Make changes to code
# Files sync automatically via volume mount
# Browser refreshes automatically via HMR

# Stop when done
docker-compose down
```

### Testing Changes
```bash
# Run tests
docker exec <container-name> pnpm test

# Run linting
docker exec <container-name> pnpm lint

# Test build
docker exec <container-name> pnpm build
```

### Deployment
```bash
# Deploy to Vercel (requires access)
vercel --prod

# Or via GitHub (automatic on main branch push)
git push origin main
```

## 🚨 Common Issues & Solutions

### "Port 3000 already in use"
```bash
# Stop existing processes
docker-compose down
pkill -f "next"
lsof -ti:3000 | xargs kill -9
```

### "Authentication not working"
```bash
# Check environment variables
docker exec <container-name> printenv | grep BETTER_AUTH
# Should show BETTER_AUTH_SECRET=<value>

# If missing, update .env.local and restart
docker-compose restart app
```

### "Hot reloading not working"
```bash
# Restart development server
docker-compose restart app

# Check file permissions (Linux/WSL)
chmod -R 755 src/
```

### "Build failing"
```bash
# Check for TypeScript errors
docker exec <container-name> pnpm lint

# Clear Next.js cache
docker exec <container-name> rm -rf .next

# Rebuild container
docker-compose up app --build
```

## 📚 Development Resources

### Project Structure
```
src/
├── app/           # Next.js routes (App Router)
├── components/    # React components
│   └── ui/       # shadcn/ui components (DO NOT EDIT)
├── hooks/        # Custom React hooks  
├── lib/          # Core utilities (auth, store)
├── services/     # API service layer
└── utils/        # Utility functions
```

### Key Technologies
- **Framework**: Next.js 15 (App Router)
- **UI Library**: shadcn/ui + Tailwind CSS
- **Authentication**: Better Auth
- **State**: Zustand
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel

### Documentation
- [Secrets Management Protocol](./secrets-management-protocol.md)
- [Better Auth Integration Rules](../CLAUDE.md#better-auth-integration-rules)
- [shadcn/ui Component Rules](../CLAUDE.md#shadcnui-component-modification-rules)

## 🤝 Getting Help

### Code Review
- All PRs require approval from @kevinhill (see CODEOWNERS)
- Environment changes require extra review
- Secret changes require formal approval process

### Support Channels
- **Slack**: General development questions
- **GitHub Issues**: Bug reports and feature requests  
- **Team Meetings**: Architecture discussions

## ✅ Success Criteria

You're successfully onboarded when:
- [ ] Development environment starts with `docker-compose up app`
- [ ] You can make code changes and see them reflected immediately
- [ ] Authentication flows work correctly
- [ ] You understand the secrets management protocol
- [ ] You can build and deploy changes
- [ ] You know where to get help when needed

**🎉 Welcome to the SenseiiWyze team!**