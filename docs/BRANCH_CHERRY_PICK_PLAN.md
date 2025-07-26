# 🎯 Cherry-Pick Plan: From `feature/users-page-bulk-actions` to `simple`

_Last updated: 2025-07-26_

---

## 1. Objective

We want to extract the “good parts” of the **feature/users-page-bulk-actions** branch into a brand-new, minimal branch named **simple**.  
Key goals:

1. Keep the useful code (users pages, charts, tests, etc.).  
2. Strip out experimental or half-finished work (old docs, abandoned migrations, etc.).  
3. Reboot authentication to its **simplest viable state** (generate schema only).  
4. Start with a clean, fully-pulled database so environment parity is guaranteed.  
5. Leave an audit trail (commits + this doc) so future devs understand what happened.

---

## 2. High-Level Steps

| # | Phase | Outcome |
|---|-------|---------|
| 1 | Branch prep | New branch `simple` based on `main` (or `develop`) |
| 2 | Commit map | List the “keeper” commits in current branch |
| 3 | Cherry-pick | Apply each keeper commit onto `simple` in order |
| 4 | Minimal auth | Re-add **only** `lib/db/better-auth-schema.ts` (DDL generation) + env |
| 5 | DB refresh | Pull production snapshot → local; run Drizzle code-gen only |
| 6 | Smoke tests | Lint, unit tests, simple app boot |
| 7 | Push & PR | Push `simple`, open PR, tag team for review |

---

## 3. Detailed Procedure

### 3.1  Branch Preparation

```bash
# Make sure main is up-to-date
git checkout main
git pull origin main

# Create the clean branch
git checkout -b simple
```

### 3.2  Build a “Keeper” Commit List

1. In **feature/users-page-bulk-actions**, run:  
   ```bash
   git log --oneline --reverse origin/main..HEAD
   ```
2. Mark commits that contain:
   - Working user-page code
   - Passing Jest tests
   - UI components already merged in design review
3. Ignore commits that:
   - Only contain document drafts
   - Experiment with unfinished auth migrations
   - Delete/rename files you’re about to remove anyway

> 💡 Tip: copy the selected SHAs into a scratch pad before continuing.

### 3.3  Cherry-pick Onto `simple`

```bash
git checkout simple

# Example if we keep three commits
git cherry-pick <SHA1>
git cherry-pick <SHA2>
git cherry-pick <SHA3>
```

Resolve conflicts _as you go_.  
If a commit only touches deleted docs, skip it with `git cherry-pick --skip`.

### 3.4  Reset Authentication (Bare-Bones)

1. **Delete** all auth migrations & superseded helpers:
   ```bash
   git rm -rf db/migrations/*
   git rm -f auth*.ts better-auth-*.md
   ```
2. **Keep** `lib/db/better-auth-schema.ts` (tables + enums).  
3. Ensure `drizzle.config.ts` still points at `lib/db/better-auth-schema.ts`.  
4. Environment:
   ```bash
   cp env.example .env            # if fresh
   # Set minimal DATABASE_URL and AUTH_SECRET only
   ```

_No migrations will run; Drizzle will only emit SQL for reference._

### 3.5  Database Refresh

```bash
# 1. Dump prod (or staging) – ensure you have credentials
pg_dump --clean --if-exists --no-owner --no-acl $PROD_DB > latest.sql

# 2. Spin up fresh local db
createdb fresh_local
psql fresh_local < latest.sql

# 3. Point .env DATABASE_URL to fresh_local
export DATABASE_URL="postgres://localhost/fresh_local"

# 4. Generate Drizzle types (no apply)
pnpm drizzle-kit generate:pg
```

### 3.6  Validation

```bash
pnpm lint
pnpm test           # Jest & RTL
pnpm dev            # local smoke run: http://localhost:3000
```

Checklist:

- [ ] App boots, navbar/users page loads  
- [ ] No auth flow errors (login page stub OK)  
- [ ] Unit tests ≥ previous branch coverage  
- [ ] `pnpm build` passes

### 3.7  Push & Pull Request

```bash
git push -u origin simple
```

Open a PR titled **“Refactor: cherry-picked clean base (`simple` branch)”** and:

1. Link this document.  
2. List the keeper commit SHAs.  
3. Tag reviewers: @eng-lead, @frontend-lead.  
4. Request quick smoke test review before merge.

---

## 4. Rollback / Safety Nets

| Action | Rollback |
|--------|----------|
| Failed cherry-pick | `git cherry-pick --abort` |
| Want to start over | `git branch -D simple && git checkout -b simple main` |
| Broken DB refresh  | Drop local DB, re-import `latest.sql` |

---

## 5. FAQ

**Q : Why not rebase?**  
A : Rebase would drag along stray commits we don’t want. Cherry-picking lets us curate.

**Q : What about migrations later?**  
A : Once minimal auth stabilizes, we’ll re-introduce a _single_ baseline migration generated from `better-auth-schema.ts`, then incremental ones.

**Q : Does this affect production data?**  
A : No. We only dump prod → local for validation. Prod stays untouched.

---

## 6. Next Steps After Merge

1. Tag the simple branch as `v0.1-clean`.  
2. Delete the old feature branches (after verifying nothing is missing).  
3. Kick off new features from `simple` to keep history clean.  
4. Incrementally re-add any advanced auth or analytics with proper TDD + migrations.

---

_Authored by “the older, wiser cousin” — providing clarity before the big reset._ 