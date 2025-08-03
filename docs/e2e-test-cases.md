# E2E Test Cases for SenseiiWyze Dashboard

## Overview
This document outlines 20 comprehensive end-to-end test cases for the SenseiiWyze dashboard application. Each test case includes the location, steps in pseudo-code format, and expected outcomes.

## Test Cases

### Authentication & Access Control Tests

#### 1. Successful Login Flow
**Location**: `/auth/login`
**Purpose**: Verify users can successfully authenticate with valid credentials
```pseudo
1. Navigate to login page
2. Enter valid email "learner@example.com"
3. Enter valid password "Learner123!Pass"
4. Click "Sign in" button
5. Assert redirect to dashboard "/app"
6. Assert user name displayed in header
7. Assert correct role-based content visible
```

#### 2. Failed Login with Invalid Credentials
**Location**: `/auth/login`
**Purpose**: Verify proper error handling for invalid login attempts
```pseudo
1. Navigate to login page
2. Enter invalid email "wrong@example.com"
3. Enter invalid password "wrongpass"
4. Click "Sign in" button
5. Assert error message appears
6. Assert still on login page
7. Assert form fields retain entered values
```

#### 3. Protected Route Redirection
**Location**: `/app/*` routes
**Purpose**: Verify unauthenticated users are redirected to login
```pseudo
1. Clear all cookies/session
2. Navigate directly to "/app/users"
3. Assert redirect to "/auth/login"
4. Login with valid credentials
5. Assert redirect back to "/app/users"
6. Assert user management page loads
```

### Navigation & Layout Tests

#### 4. Global Navigation Consistency
**Location**: All `/app/*` pages
**Purpose**: Verify navigation works correctly across all pages
```pseudo
1. Login as admin user
2. Navigate to dashboard
3. Assert navigation sidebar visible
4. Click through each nav item:
   - Dashboard → /app
   - Users → /app/users
   - AI Insights → /app/ai-insights
   - Team → /app/team
   - Settings → /app/settings
5. Assert active state updates correctly
6. Assert page content changes appropriately
```

#### 5. Responsive Layout Behavior
**Location**: All pages
**Purpose**: Verify layout adapts correctly to different screen sizes
```pseudo
1. Set viewport to desktop (1920x1080)
2. Navigate to dashboard
3. Assert sidebar visible, full layout
4. Resize to tablet (768x1024)
5. Assert sidebar collapses to hamburger
6. Resize to mobile (375x667)
7. Assert mobile-optimized layout
8. Test navigation menu on mobile
```

### Dashboard Functionality Tests

#### 6. Dashboard Quick Actions
**Location**: `/app`
**Purpose**: Verify quick action cards function correctly
```pseudo
1. Navigate to dashboard
2. Assert 3 quick action cards visible
3. Click "View Analytics" button
4. Assert navigation to /app/analytics
5. Navigate back
6. Click "Manage Users" button
7. Assert navigation to /app/users
```

#### 7. Dashboard Loading States
**Location**: `/app`
**Purpose**: Verify skeleton loaders display correctly during loading
```pseudo
1. Slow down network to "Slow 3G"
2. Navigate to dashboard
3. Assert skeleton loaders appear
4. Assert skeleton sizes match content
5. Wait for content to load
6. Assert skeletons replaced by real content
7. Assert no layout shift occurs
```

### User Management Tests

#### 8. User Search Functionality
**Location**: `/app/users`
**Purpose**: Verify user search filters results correctly
```pseudo
1. Navigate to user management
2. Assert user table displays all users
3. Type "sarah" in search box
4. Assert filtered results show only Sarah Chen
5. Clear search
6. Type "admin" in search
7. Assert results filtered by role
8. Assert result count updates
```

#### 9. User Status Badges Display
**Location**: `/app/users`
**Purpose**: Verify badges display with consistent styling
```pseudo
1. Navigate to user management
2. For each user row:
   - Assert status badge displayed
   - Assert correct color for status type
   - Assert consistent badge widths
3. Assert role badges have proper styling
4. Assert readiness score badges formatted correctly
```

### AI Insights Tests

#### 10. AI Insights Data Loading
**Location**: `/app/ai-insights`
**Purpose**: Verify AI insights page loads and displays data correctly
```pseudo
1. Navigate to AI insights page
2. Assert loading animation appears
3. Wait for data to load
4. Assert health score displayed
5. Assert KPI cards show correct metrics
6. Assert all tabs are clickable
7. Click through each tab
8. Assert content loads for each tab
```

#### 11. AI Chat Interaction
**Location**: `/app/ai-insights` → Chat tab
**Purpose**: Verify AI chat assistant functions correctly
```pseudo
1. Navigate to AI insights
2. Click "AI Assistant" tab
3. Type "How can I improve retention?"
4. Press Enter or click Send
5. Assert user message appears
6. Assert loading indicator shows
7. Assert AI response appears
8. Assert messages are properly formatted
9. Test shift+enter for multiline input
```

### Settings & Profile Tests

#### 12. Profile Update Flow
**Location**: `/app/settings`
**Purpose**: Verify profile updates save correctly
```pseudo
1. Navigate to settings page
2. Click "Profile" tab
3. Update display name field
4. Update bio field
5. Click "Save Changes"
6. Assert success notification
7. Refresh page
8. Assert changes persisted
9. Navigate to dashboard
10. Assert updated name displayed
```

#### 13. Theme Switching
**Location**: `/app/settings` → Appearance
**Purpose**: Verify theme switching works across the app
```pseudo
1. Navigate to settings
2. Click "Appearance" tab
3. Assert current theme indicator
4. Click "Dark" theme option
5. Assert theme changes immediately
6. Assert all pages use dark theme
7. Switch back to "Light"
8. Assert theme reverts correctly
```

### Form Validation Tests

#### 14. Login Form Validation
**Location**: `/auth/login`
**Purpose**: Verify form validation provides helpful feedback
```pseudo
1. Navigate to login
2. Click submit with empty fields
3. Assert "Email is required" error
4. Enter invalid email format
5. Assert "Invalid email" error
6. Enter valid email, short password
7. Assert password requirements shown
8. Enter valid credentials
9. Assert successful login
```

#### 15. Signup Form Validation
**Location**: `/auth/signup`
**Purpose**: Verify signup form validates all fields correctly
```pseudo
1. Navigate to signup
2. Test each field validation:
   - Name: min 2 chars
   - Email: valid format
   - Password: 8+ chars, mixed case, number, special
3. Test password confirmation match
4. Test terms acceptance required
5. Assert inline error messages
6. Fix all errors
7. Assert successful signup
```

### Performance & Loading Tests

#### 16. Page Load Performance
**Location**: All main pages
**Purpose**: Verify pages load within acceptable time limits
```pseudo
1. Clear cache and cookies
2. For each main route:
   - Start performance recording
   - Navigate to page
   - Assert page loads < 3 seconds
   - Assert no console errors
   - Assert all images load
   - Stop recording
3. Compare load times across pages
```

#### 17. Concurrent User Actions
**Location**: `/app/users`
**Purpose**: Verify app handles multiple simultaneous actions
```pseudo
1. Open page in two tabs
2. In tab 1: Start searching users
3. In tab 2: Click filter options
4. Assert both tabs remain responsive
5. In tab 1: Click user details
6. Assert navigation works
7. Return to tab 2
8. Assert filter state maintained
```

### Error Handling Tests

#### 18. Network Error Recovery
**Location**: Various pages
**Purpose**: Verify graceful error handling and recovery
```pseudo
1. Navigate to AI insights
2. Disconnect network
3. Click "Refresh Insights"
4. Assert error message appears
5. Assert retry button visible
6. Reconnect network
7. Click retry
8. Assert data loads successfully
```

#### 19. 404 Page Handling
**Location**: Invalid routes
**Purpose**: Verify proper 404 page display and navigation
```pseudo
1. Navigate to "/app/nonexistent"
2. Assert 404 page displays
3. Assert "Return to Dashboard" link
4. Click link
5. Assert redirect to dashboard
6. Try invalid auth route
7. Assert appropriate redirect
```

### Accessibility Tests

#### 20. Keyboard Navigation
**Location**: All pages
**Purpose**: Verify full keyboard accessibility
```pseudo
1. Navigate to dashboard using only keyboard
2. Press Tab to cycle through elements
3. Assert focus indicators visible
4. Press Enter on buttons
5. Assert actions trigger correctly
6. Test Escape key on modals
7. Test arrow keys in dropdowns
8. Assert skip links work
9. Test screen reader announcements
```

## Test Implementation Notes

- All tests should be automated using Playwright or similar E2E testing framework
- Tests should run in isolation with fresh browser state
- Use test data fixtures for consistent results
- Implement retry logic for flaky tests
- Generate test reports with screenshots on failure
- Run tests in CI/CD pipeline on pull requests

## Coverage Goals

- **Authentication**: 100% coverage of auth flows
- **Navigation**: All routes and navigation patterns
- **Forms**: All form validation scenarios
- **UI Consistency**: Visual regression testing
- **Performance**: Core Web Vitals monitoring
- **Accessibility**: WCAG 2.1 AA compliance