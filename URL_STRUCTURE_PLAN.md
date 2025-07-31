# SenseiiWyze Dashboard - URL Structure Plan

## Current Issues with Existing Structure
- URLs like `/dashboard/team-management` and `/dashboard/learning-paths` are verbose and nested under dashboard
- Inconsistent nesting - some features are under `/dashboard/` others are not
- Not following the clean structure from the original page flow specification

## Proposed Clean URL Structure

### Authentication (Route Group - No URL Impact)
```
/login                  # Login page
/register              # Registration 
/reset-password        # Password reset
/logout               # Logout confirmation
```

### Core Application Pages
```
/dashboard            # Executive Dashboard (Primary Landing)
/analytics           # Skill Analytics Dashboard
/user/[id]           # Individual User Profile
/team               # Team Management (NOT /dashboard/team-management)
/learning           # Learning Paths (NOT /dashboard/learning-paths) 
/settings           # Settings hub
/notifications      # Notifications center
/help              # Help center
```

### Settings Nested Structure
```
/settings                    # Main settings
/settings/organization       # Organization config
/settings/billing           # Billing & subscription
/settings/integrations      # Integration settings
```

## File Structure Changes Needed

### Current Files to Move/Rename:
1. `src/app/dashboard/team-management/page.tsx` → `src/app/team/page.tsx`
2. `src/app/dashboard/learning-paths/page.tsx` → `src/app/learning/page.tsx`
3. `src/app/dashboard/ai-coach/page.tsx` → `src/app/coaching/page.tsx`
4. `src/app/dashboard/readiness-assessment/page.tsx` → `src/app/assessment/page.tsx`

### New Directory Structure:
```
src/app/
├── (auth)/                 # Route group - no URL impact
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── reset-password/page.tsx
│   └── logout/page.tsx
├── dashboard/page.tsx      # Executive dashboard only
├── analytics/page.tsx      # Deep analytics
├── user/[id]/page.tsx     # User profiles
├── team/page.tsx          # Team management (moved from dashboard/team-management)
├── learning/page.tsx      # Learning paths (moved from dashboard/learning-paths)
├── coaching/page.tsx      # AI coaching (moved from dashboard/ai-coach)
├── assessment/page.tsx    # Readiness assessment (moved from dashboard/readiness-assessment)
├── settings/              # Settings with proper nesting
│   ├── page.tsx
│   ├── organization/page.tsx
│   ├── billing/page.tsx
│   └── integrations/page.tsx
├── notifications/page.tsx
└── help/page.tsx
```

## Navigation Updates Required
- Update `GlobalNavigation` component to use new URLs
- Update all internal links throughout the application
- Update any redirect logic

## Benefits of This Structure
1. **Clean URLs**: `/team` instead of `/dashboard/team-management`
2. **Consistent**: All main features at root level
3. **Scalable**: Easy to add new features without deep nesting
4. **Intuitive**: URLs match the mental model of the application
5. **SEO Friendly**: Shorter, cleaner URLs

## Implementation Plan
1. Create new directory structure
2. Move existing page files to new locations
3. Update navigation components
4. Update all internal links
5. Test routing works correctly
6. Remove old empty directories