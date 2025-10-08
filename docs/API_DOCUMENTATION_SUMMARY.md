# API Documentation Summary

## Mobile Data Submission Guide

**Primary Document:** [`mobile-api-data-submission-guide.md`](./mobile-api-data-submission-guide.md)

This comprehensive guide explains how to submit user data from your mobile application to the dashboard database.

---

## What's Inside

### 📊 Based on Real Data Analysis

The guide is built by analyzing **three actual dashboard APIs**:
- `/api/executive-dashboard` - Main dashboard data
- `/api/users-table` - User table data  
- `/api/skills` - Detailed skills tracking

### 🗄️ Real Database Schemas

All table schemas are pulled directly from your Supabase database using MCP server, including:
- Column names and data types
- Primary and foreign keys
- Constraints and defaults
- Nullable fields

### 📋 Complete API Specifications

For each data type, you'll find:

1. **Table Schema** - Exact database structure
2. **API Endpoint** - Request/response format
3. **Validation Rules** - What data is valid
4. **Implementation Logic** - SQL examples
5. **Dashboard Usage** - How data is displayed

---

## Data Categories Covered

### 1️⃣ Core Skills (Required)
The 5 essential skills: `vision`, `grit`, `logic`, `algorithm`, `problemSolving`
- **Endpoint:** `POST /api/mobile/core-skills`
- **Table:** `user_core_skills`
- ⭐ **Required for dashboard display**

### 2️⃣ Skills System (Recommended)
Advanced skills with subskills for detailed analysis
- **Endpoint:** `POST /api/mobile/skills`
- **Tables:** `skill_types`, `user_skills`, `user_skill_details`

### 3️⃣ Program Readiness (Recommended)
Readiness scores for career programs (AI/ML, IoT, Data Analytics, etc.)
- **Endpoint:** `POST /api/mobile/program-readiness`
- **Tables:** `assessments`, `user_programs`

### 4️⃣ Gaming Activity (Optional)
Game progress tracking and engagement metrics
- **Endpoint:** `POST /api/mobile/game-progress`
- **Tables:** `game_info`, `game_tasks`

### 5️⃣ Vision Board & Goals (Optional)
Career goals and aspirations
- **Endpoint:** `POST /api/mobile/vision-board`
- **Tables:** `vision_boards`, `goals`

### 6️⃣ Personality Exam (Optional)
MBTI, Big Five, and other personality assessments
- **Endpoint:** `POST /api/mobile/personality-exam`
- **Tables:** `personality_exams`, `exam_traits`, `exam_strengths`, `exam_growth_areas`

---

## Key Differences from Previous Version

### ✅ What's New

1. **No Better Auth Requirement**
   - Mobile users don't need Better Auth SDK
   - Get `profile_id` via email lookup endpoint
   
2. **Actual Table Schemas**
   - Real column names from Supabase
   - Actual data types and constraints
   - Foreign key relationships documented
   
3. **Data Dependencies**
   - Clear submission order
   - Minimum required data explained
   - Optional vs required data specified
   
4. **Implementation Logic**
   - SQL examples for upsert operations
   - Array handling for PostgreSQL
   - Transaction recommendations

### ❌ What Was Removed

- Fake authentication requirements
- Hypothetical table structures
- Generic API designs

---

## Quick Start Guide

### Step 1: Get User's Profile ID
```http
GET /api/mobile/profile-by-email?email=user@example.com

Response:
{
  "profile_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Step 2: Submit Core Skills (Required)
```http
POST /api/mobile/core-skills

{
  "profile_id": "550e8400-...",
  "skills": {
    "vision": 85,
    "grit": 75,
    "logic": 90,
    "algorithm": 80,
    "problemSolving": 88
  }
}
```

### Step 3: Submit Additional Data (Optional)
- Skills & Subskills
- Program Readiness
- Gaming Activity
- Vision Board
- Personality Exam

---

## Database Tables Reference

### Tables Used by Dashboard APIs

| Table | Purpose | Used By API |
|-------|---------|-------------|
| `profiles` | User profiles | All APIs |
| `user_core_skills` | 5 core skills (required) | executive-dashboard, users-table |
| `user_skills` | Main skill scores | skills |
| `user_skill_details` | Subskill scores | skills |
| `skill_types` | Skill definitions (read-only) | skills |
| `user_programs` | Program readiness | executive-dashboard, users-table |
| `assessments` | Available programs (read-only) | executive-dashboard, users-table |
| `game_info` | Game progress | executive-dashboard, users-table |
| `game_tasks` | Game levels (read-only) | executive-dashboard |
| `vision_boards` | Vision board data | executive-dashboard, users-table |
| `goals` | Individual goals | executive-dashboard, users-table |
| `personality_exams` | Exam records | executive-dashboard, users-table |
| `exam_traits` | Trait scores | executive-dashboard, users-table |
| `exam_strengths` | Identified strengths | executive-dashboard, users-table |
| `exam_growth_areas` | Growth areas | users-table |

---

## Implementation Checklist

### Phase 1: Core Functionality
- [ ] Implement profile lookup by email
- [ ] Implement core skills submission
- [ ] Test with dashboard display

### Phase 2: Enhanced Profile
- [ ] Implement skills & subskills
- [ ] Implement program readiness
- [ ] Implement assessments list endpoint

### Phase 3: Engagement Tracking
- [ ] Implement game progress tracking
- [ ] Implement vision board submission
- [ ] Implement personality exam submission

### Phase 4: Polish
- [ ] Add validation middleware
- [ ] Add rate limiting
- [ ] Add error logging
- [ ] Add API documentation (Swagger/OpenAPI)

---

## Testing

### Sample Profile IDs
```
test_user_1: "550e8400-e29b-41d4-a716-446655440000"
test_user_2: "6ba7b810-9dad-11d1-80b4-00c04fd430c8"
```

### Sample Assessment IDs
```json
{
  "AI/ML Fundamentals": "3ac68f05-2ea9-4223-b139-d88373859379",
  "IoT Tech Support": "5b478df9-3fa1-4511-a256-c77e92b59abc"
}
```

---

## API Summary

### GET Endpoints (Helper/Reference Data)
| Endpoint | Purpose |
|----------|---------|
| `GET /api/mobile/profile-by-email` | Get profile ID |
| `GET /api/mobile/assessments` | List available programs |
| `GET /api/mobile/games/:gameId` | Get game structure |

### POST Endpoints (Data Submission)
| Endpoint | Purpose | Priority |
|----------|---------|----------|
| `POST /api/mobile/core-skills` | Submit 5 core skills | ⭐ Required |
| `POST /api/mobile/skills` | Submit detailed skills | Recommended |
| `POST /api/mobile/program-readiness` | Submit program scores | Recommended |
| `POST /api/mobile/game-progress` | Update game progress | Optional |
| `POST /api/mobile/vision-board` | Create vision board | Optional |
| `POST /api/mobile/personality-exam` | Submit personality test | Optional |
| `POST /api/mobile/complete-onboarding` | Submit all at once | Convenience |

---

## Common Questions

### Q: What's the minimum data needed?
**A:** Just a profile (already exists) and core skills (5 values). Everything else is optional.

### Q: Can I submit data in any order?
**A:** Core skills should be submitted first. Other data can be added in any order, but some have dependencies (e.g., goals require a vision board).

### Q: How do I authenticate mobile users?
**A:** This is still being designed. Current approach is email-based lookup of profile_id.

### Q: Can I update data after initial submission?
**A:** Yes, all endpoints use upsert logic (INSERT ... ON CONFLICT UPDATE).

### Q: What happens if I send invalid data?
**A:** The API will return a 400 error with validation details showing which field failed and why.

---

## Support & Troubleshooting

### Common Errors

**Profile Not Found**
```json
{
  "success": false,
  "error": {
    "code": "PROFILE_NOT_FOUND",
    "message": "No profile found with ID: xxx"
  }
}
```
→ Ensure user completed signup via `/api/mobile/accept-invite`

**Validation Error**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Value must be between 0 and 100"
  }
}
```
→ Check all numeric values are 0-100

**Foreign Key Violation**
```json
{
  "success": false,
  "error": {
    "code": "FOREIGN_KEY_ERROR",
    "message": "Assessment ID does not exist"
  }
}
```
→ Use `/api/mobile/assessments` to get valid IDs

---

## Next Steps

1. **Read the Full Guide:** [`mobile-api-data-submission-guide.md`](./mobile-api-data-submission-guide.md)
2. **Implement Profile Lookup:** Start with the email → profile_id endpoint
3. **Implement Core Skills:** This unlocks dashboard display
4. **Add Optional Data:** Enhance user profiles with additional information
5. **Test Integration:** Use sample data to verify dashboard display

---

**Document Version:** 1.0  
**Last Updated:** 2024-01-15  
**Maintained By:** Development Team
