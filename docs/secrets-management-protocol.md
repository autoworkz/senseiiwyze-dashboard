# Secrets Management Protocol

> **CRITICAL**: This protocol prevents authentication failures and ensures secure secret handling across all environments.

## 🔐 Core Principles

1. **Never Commit Secrets**: Secrets NEVER go in git history
2. **Immutable After Production**: Production secrets require formal approval process to change
3. **Environment Parity**: All environments use the same secret structure
4. **Audit Trail**: All secret changes are logged and approved

## 🚨 Protected Secrets

### BETTER_AUTH_SECRET
- **Purpose**: Better Auth JWT signing and encryption
- **Format**: Base64 encoded, 32+ characters
- **Current**: `6HB4w1JjEtHWnkSiH3iD2yqz1DsvXr/w4AKXhF0TEkw=` 
- **⚠️ CRITICAL**: Changing this invalidates ALL existing user sessions

### OAuth Secrets
- `GITHUB_CLIENT_SECRET`
- `GOOGLE_CLIENT_SECRET`
- `DISCORD_CLIENT_SECRET`

### API Keys
- `RESEND_API_KEY` - Email service
- `SENTRY_AUTH_TOKEN` - Error tracking

## 🔄 Secret Rotation Process

### Emergency Rotation (Security Incident)
1. **Generate New Secret**: `openssl rand -base64 32`
2. **Update All Environments**: Local, Docker, Vercel production
3. **Deploy Immediately**: `vercel --prod`
4. **Notify Team**: All existing sessions will be invalidated

### Planned Rotation (Quarterly)
1. **Create PR**: Include reason and impact assessment
2. **Code Review**: Must be approved by `@kevinhill` (see CODEOWNERS)
3. **Staging Test**: Verify in development environment
4. **Production Deploy**: During maintenance window
5. **Post-Deploy**: Verify all authentication flows work

## 📋 Environment File Hierarchy

```
.env.example      ← Template with placeholder values (COMMITTED)
.env.local        ← Local development overrides (NEVER COMMITTED)
.env              ← Base environment variables (NEVER COMMITTED)  
.env.development  ← Development-specific (NEVER COMMITTED)
```

### ✅ Safe to Commit
- `.env.example` - Templates only, no real values

### ❌ Never Commit
- All other `.env*` files
- Any file containing actual secret values

## 🛠️ Developer Onboarding Checklist

### New Developer Setup
1. **Clone Repository**
   ```bash
   git clone <repo-url>
   cd senseiiwyze-dashboard
   ```

2. **Copy Environment Template**
   ```bash
   cp .env.example .env.local
   ```

3. **Get Secrets from Team Lead**
   - Request access to shared secrets (Slack/secure channel)
   - Never share secrets via email or public channels

4. **Verify Setup**
   ```bash
   docker-compose up app
   # Visit http://localhost:3000 and test login
   ```

### Existing Developer Updates
1. **Pull Latest Changes**
   ```bash
   git pull origin main
   ```

2. **Check for New Environment Variables**
   ```bash
   # Compare your .env.local with .env.example
   diff .env.local .env.example
   ```

3. **Update Missing Variables**
   - Add any new required variables from team lead

## 🔍 Secret Validation

### Pre-Deployment Checks
```bash
# Verify BETTER_AUTH_SECRET is set and correct length
echo $BETTER_AUTH_SECRET | base64 -d | wc -c
# Should output: 32 or higher

# Test authentication in development
curl -X POST http://localhost:3000/api/auth/session
```

### Production Health Checks
- Monitor authentication success rates in Sentry
- Set up alerts for auth failures > 5%
- Weekly secret rotation schedule

## 🔐 Vercel Environment Management

### Setting Production Secrets
```bash
# Via Vercel CLI (one-time setup)
vercel env add BETTER_AUTH_SECRET production

# Via Vercel Dashboard (preferred for team access)
# Visit: https://vercel.com/automation-workz/senseiiwyze-dashboard-v2/settings/environment-variables
```

### Environment Sync Validation
```bash
# Check all environments have matching variables
vercel env ls
```

## 🚨 Incident Response

### Authentication Failure Response
1. **Check Secret Consistency**: All environments have same `BETTER_AUTH_SECRET`
2. **Regenerate if Corrupted**: `openssl rand -base64 32`
3. **Update All Environments**: Local → Vercel → Deploy
4. **Monitor Recovery**: Check authentication success rates

### Secret Leak Response
1. **Immediate Rotation**: Generate new secret immediately
2. **Revoke Access**: Update all environments within 1 hour
3. **Audit Impact**: Check what data may have been compromised
4. **Post-Mortem**: Document how leak occurred and prevention

## 📚 Tools and Resources

### Secret Generation
```bash
# BETTER_AUTH_SECRET (32 bytes base64)
openssl rand -base64 32

# API keys and tokens (64 bytes hex)
openssl rand -hex 32
```

### Environment Management
- **Local**: `.env.local`
- **Docker**: docker-compose.yml env_file configuration
- **Production**: Vercel Dashboard or CLI

### Security Scanning
```bash
# Check for committed secrets (run regularly)
git log --all -S "BETTER_AUTH_SECRET" --source --all

# Scan current files for potential secrets
grep -r "secret" . --exclude-dir=.git --exclude-dir=node_modules
```

## ✅ Success Criteria

- [ ] All team members can start development with `docker-compose up app`
- [ ] New secrets require PR approval via CODEOWNERS
- [ ] Production secret changes have audit trail
- [ ] Authentication works consistently across all environments
- [ ] No secrets ever committed to git history
- [ ] Quarterly secret rotation process followed
- [ ] Incident response procedures tested and documented