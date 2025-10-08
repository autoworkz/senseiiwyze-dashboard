# Mobile API Design Specification
## ⚠️ DEPRECATED - See New Document

**This document has been superseded by a more comprehensive guide.**

**👉 Please use: [`mobile-api-data-submission-guide.md`](./mobile-api-data-submission-guide.md)**

The new document includes:
- ✅ Actual database table schemas from Supabase
- ✅ No Better Auth requirements (mobile uses separate auth)
- ✅ Profile ID lookup via email endpoint
- ✅ Complete data dependencies and submission order
- ✅ Detailed validation rules
- ✅ Real table structures and foreign key relationships

---

## Old Documentation Below (For Reference Only)

### Adding User Data from Mobile Application

This document outlines the API endpoints needed to add user data from the mobile application to the database. Each endpoint corresponds to a specific table and data type shown in the Executive Dashboard.

---

## Prerequisites

- User must be authenticated (logged in via Better Auth)
- User must exist in `ba_users` table (authentication table)
- User must have a profile in `profiles` table

### Getting User Profile ID

The mobile app will need the user's `profile_id` from the `profiles` table to make most API calls.

**Endpoint:** `GET /api/mobile/profile`

**Response:**
```json
{
  "success": true,
  "profile_id": "uuid-string",
  "name": "User Name",
  "user_role": "user",
  "created_at": "2024-01-01T00:00:00Z"
}
```

---

## 1. User Core Skills

**Table:** `user_core_skills`

**Purpose:** Stores the user's core skill assessments that are displayed in the dashboard's skill radar chart.

### Required Data
- `user_id` (string, UUID) - References `profiles.id`
- `category` (string) - One of: `vision`, `grit`, `logic`, `algorithm`, `problemSolving`
- `value` (number, 0-100) - The skill score

### API Endpoint Design

**POST** `/api/mobile/user-skills`

**Request Body:**
```json
{
  "user_id": "profile-uuid-string",
  "skills": {
    "vision": 85,
    "grit": 75,
    "logic": 90,
    "algorithm": 80,
    "problemSolving": 88
  }
}
```

**Implementation Notes:**
- The endpoint should create 5 separate rows in `user_core_skills` (one for each category)
- If entries already exist for the user, update them instead of creating duplicates
- Use upsert pattern: `INSERT ... ON CONFLICT UPDATE`

**Response:**
```json
{
  "success": true,
  "message": "Skills updated successfully",
  "data": {
    "user_id": "profile-uuid-string",
    "skills": {
      "vision": 85,
      "grit": 75,
      "logic": 90,
      "algorithm": 80,
      "problemSolving": 88
    }
  }
}
```

---

## 2. User Program Readiness

**Table:** `user_programs`

**Purpose:** Tracks user readiness scores for specific career/training programs.

### Required Data
- `user_id` (string, UUID) - References `profiles.id`
- `assessment_id` (string, UUID) - References `assessments.id`
- `readiness` (number, 0-100) - The readiness score for that program

### API Endpoint Design

**POST** `/api/mobile/program-readiness`

**Request Body:**
```json
{
  "user_id": "profile-uuid-string",
  "programs": [
    {
      "assessment_id": "ai-ml-fundamentals-uuid",
      "readiness": 85
    },
    {
      "assessment_id": "iot-tech-support-uuid",
      "readiness": 60
    },
    {
      "assessment_id": "data-analytics-uuid",
      "readiness": 75
    }
  ]
}
```

**Implementation Notes:**
- First, query `assessments` table to get valid `assessment_id` values
- Filter out "Big Five" assessments (personality tests) as they're tracked separately
- Use upsert pattern to update existing records

**Response:**
```json
{
  "success": true,
  "message": "Program readiness updated successfully",
  "data": {
    "user_id": "profile-uuid-string",
    "programs_updated": 3
  }
}
```

### Helper Endpoint: Get Available Assessments

**GET** `/api/mobile/assessments`

**Query Parameters:**
- `exclude_personality` (boolean, default: true) - Exclude Big Five assessments

**Response:**
```json
{
  "success": true,
  "assessments": [
    {
      "id": "uuid-1",
      "title": "AI/ML Fundamentals",
      "description": "Artificial Intelligence and Machine Learning program"
    },
    {
      "id": "uuid-2",
      "title": "IoT Tech Support",
      "description": "Internet of Things technical support program"
    }
  ]
}
```

---

## 3. Gaming Data

**Tables:** `game_info`, `game_tasks`

**Purpose:** Tracks user's gaming activity including levels completed, time spent, and performance.

### Required Data for `game_info`
- `profile_id` (string, UUID) - References `profiles.id`
- `game_id` (string) - Identifier for the game
- `levels_completed` (boolean[]) - Array of boolean values indicating level completion
- `durations` (number[]) - Array of duration in milliseconds for each level

### API Endpoint Design

**POST** `/api/mobile/game-activity`

**Request Body:**
```json
{
  "user_id": "profile-uuid-string",
  "game_id": "maze-game-v1",
  "level_index": 5,
  "completed": true,
  "duration_ms": 45000,
  "score": 850
}
```

**Implementation Notes:**
- This endpoint records completion of a single level
- Fetch existing `game_info` record for the user and game
- Update the `levels_completed` array at the specified index
- Update the `durations` array at the specified index
- If no record exists, create one with arrays initialized to the game's total level count

**Response:**
```json
{
  "success": true,
  "message": "Game level recorded successfully",
  "data": {
    "user_id": "profile-uuid-string",
    "game_id": "maze-game-v1",
    "total_levels_completed": 6,
    "total_levels": 10,
    "avg_time_per_level": 42000
  }
}
```

### Helper Endpoint: Get Game Definition

**GET** `/api/mobile/games/:gameId`

**Response:**
```json
{
  "success": true,
  "game": {
    "id": "maze-game-v1",
    "name": "Maze Game",
    "total_levels": 10,
    "tasks": [
      {
        "id": "task-uuid-1",
        "name": "Level 1",
        "description": "Navigate the basic maze",
        "max_score": 100,
        "order": 1,
        "difficulty_level": "easy"
      }
    ]
  }
}
```

---

## 4. Vision Board & Goals

**Tables:** `vision_boards`, `goals`

**Purpose:** Stores user's vision board including goals, focus areas, and aspirations.

### Required Data for `vision_boards`
- `user_id` (string, UUID) - References `profiles.id`
- `name` (string) - Title of the vision board
- `description` (string) - Description or journal entry
- `img_url` (string, optional) - URL to vision board image

### Required Data for `goals`
- `vision_id` (string, UUID) - References `vision_boards.id`
- `name` (string) - Goal title
- `description` (string) - Goal description
- `cluster_class` (string) - Category/focus area (e.g., "Career", "Personal Growth")

### API Endpoint Design

**POST** `/api/mobile/vision-board`

**Request Body:**
```json
{
  "user_id": "profile-uuid-string",
  "vision_board": {
    "name": "2024 Career Goals",
    "description": "Working towards becoming a data scientist",
    "img_url": "https://storage.example.com/vision-boards/user-123.jpg"
  },
  "goals": [
    {
      "name": "Complete Data Analytics Certification",
      "description": "Finish online certification by Q2",
      "cluster_class": "Career"
    },
    {
      "name": "Build Portfolio Projects",
      "description": "Create 3 data analysis projects",
      "cluster_class": "Technical Skills"
    },
    {
      "name": "Improve Communication",
      "description": "Practice public speaking",
      "cluster_class": "Personal Growth"
    }
  ]
}
```

**Implementation Notes:**
- First, create or update the `vision_boards` entry
- Then, delete existing goals for that vision board
- Insert new goals with the vision board ID
- This is a full replace operation for goals

**Response:**
```json
{
  "success": true,
  "message": "Vision board updated successfully",
  "data": {
    "vision_board_id": "vision-uuid-string",
    "goals_count": 3
  }
}
```

### Alternative: Add Individual Goal

**POST** `/api/mobile/vision-board/:visionBoardId/goals`

**Request Body:**
```json
{
  "name": "Learn Python",
  "description": "Complete Python fundamentals course",
  "cluster_class": "Technical Skills"
}
```

---

## 5. Personality Exam Results

**Tables:** `personality_exams`, `exam_traits`, `exam_strengths`

**Purpose:** Stores results from personality assessments (Big Five, MBTI, etc.)

### Required Data for `personality_exams`
- `user_id` (string, UUID) - References `profiles.id`
- `type` (string) - Exam type (e.g., "MBTI", "Big Five")

### Required Data for `exam_traits`
- `exam_id` (string, UUID) - References `personality_exams.id`
- `trait` (string) - Trait name (e.g., "Introversion", "Openness")
- `value` (number, 0-100) - Trait score

### Required Data for `exam_strengths`
- `exam_id` (string, UUID) - References `personality_exams.id`
- `strength` (string) - Identified strength (e.g., "Analytical Thinking")

### API Endpoint Design

**POST** `/api/mobile/personality-exam`

**Request Body:**
```json
{
  "user_id": "profile-uuid-string",
  "exam_type": "MBTI",
  "traits": {
    "Introversion": 65,
    "Extroversion": 35,
    "Intuition": 80,
    "Sensing": 20,
    "Thinking": 75,
    "Feeling": 25,
    "Judging": 60,
    "Perceiving": 40
  },
  "strengths": [
    "Analytical Thinking",
    "Strategic Planning",
    "Problem Solving"
  ],
  "completed_at": "2024-01-15T10:30:00Z"
}
```

**Implementation Notes:**
- Create a single entry in `personality_exams`
- Create multiple entries in `exam_traits` (one per trait)
- Create multiple entries in `exam_strengths` (one per strength)
- If an exam of the same type already exists for the user, update it

**Response:**
```json
{
  "success": true,
  "message": "Personality exam recorded successfully",
  "data": {
    "exam_id": "exam-uuid-string",
    "user_id": "profile-uuid-string",
    "exam_type": "MBTI",
    "traits_count": 8,
    "strengths_count": 3,
    "growth_areas": ["Feeling", "Extroversion"]
  }
}
```

---

## 6. Complete User Profile Update

**Purpose:** Update all user data in a single API call (useful for onboarding)

### API Endpoint Design

**POST** `/api/mobile/complete-profile`

**Request Body:**
```json
{
  "user_id": "profile-uuid-string",
  "skills": {
    "vision": 85,
    "grit": 75,
    "logic": 90,
    "algorithm": 80,
    "problemSolving": 88
  },
  "program_readiness": [
    {
      "assessment_id": "ai-ml-fundamentals-uuid",
      "readiness": 85
    }
  ],
  "gaming_activity": {
    "game_id": "maze-game-v1",
    "levels_completed": [true, true, false, false],
    "durations": [30000, 45000, 0, 0]
  },
  "vision_board": {
    "name": "2024 Goals",
    "description": "Career advancement",
    "goals": [
      {
        "name": "Get certified",
        "description": "Complete certification",
        "cluster_class": "Career"
      }
    ]
  },
  "personality_exam": {
    "exam_type": "MBTI",
    "traits": {
      "Introversion": 65
    },
    "strengths": ["Analytical"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user_id": "profile-uuid-string",
    "updated_sections": [
      "skills",
      "program_readiness",
      "gaming_activity",
      "vision_board",
      "personality_exam"
    ]
  }
}
```

---

## 7. Data Validation Rules

### Core Skills
- All skill values must be between 0-100
- All 5 categories must be provided: vision, grit, logic, algorithm, problemSolving

### Program Readiness
- Readiness values must be between 0-100
- Assessment ID must exist in `assessments` table
- Exclude Big Five personality assessments

### Gaming Data
- Duration must be positive number (milliseconds)
- Level index must be valid for the game
- Score should be non-negative

### Vision Board
- Name: 1-200 characters
- Description: 1-2000 characters
- Goals: minimum 1, maximum 20
- Cluster class: one of predefined categories

### Personality Exam
- Trait values: 0-100
- Exam type must be valid (MBTI, Big Five, etc.)
- Minimum 3 traits required
- Strengths: minimum 1, maximum 10

---

## 8. Error Responses

All endpoints should return consistent error responses:

```json
{
  "success": false,
  "error": "Validation error",
  "details": {
    "field": "skills.vision",
    "message": "Value must be between 0 and 100"
  }
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (accessing another user's data)
- `404` - Not Found (user or resource doesn't exist)
- `500` - Internal Server Error

---

## 9. Authentication & Authorization

### Required Headers
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

### Authorization Rules
- Users can only update their own data
- Admin users can update any user's data
- Mobile app must verify `user_id` matches authenticated user

---

## 10. Database Schema Reference

### Relationships Diagram

```
profiles (id)
├── user_core_skills (user_id → profiles.id)
├── user_programs (user_id → profiles.id)
│   └── assessments (assessment_id)
├── game_info (profile_id → profiles.id)
│   └── game_tasks (activity_id → game_id)
├── vision_boards (user_id → profiles.id)
│   └── goals (vision_id → vision_boards.id)
└── personality_exams (user_id → profiles.id)
    ├── exam_traits (exam_id → personality_exams.id)
    └── exam_strengths (exam_id → personality_exams.id)
```

---

## 11. Implementation Checklist

For each endpoint, ensure:
- [ ] Authentication check (user is logged in)
- [ ] Authorization check (user can access the resource)
- [ ] Input validation (all required fields present and valid)
- [ ] Database transaction (use transactions for multi-table updates)
- [ ] Error handling (catch and return meaningful errors)
- [ ] Logging (log important actions and errors)
- [ ] Rate limiting (prevent abuse)
- [ ] Response formatting (consistent JSON structure)

---

## 12. Testing Data

### Sample User Profile ID
```
user_id: "550e8400-e29b-41d4-a716-446655440000"
```

### Sample Assessment IDs
```json
{
  "AI/ML Fundamentals": "550e8400-e29b-41d4-a716-446655440001",
  "IoT Tech Support": "550e8400-e29b-41d4-a716-446655440002",
  "Data Analytics": "550e8400-e29b-41d4-a716-446655440003",
  "Computer Networking": "550e8400-e29b-41d4-a716-446655440004",
  "Cybersecurity": "550e8400-e29b-41d4-a716-446655440005"
}
```

### Sample Game IDs
```json
[
  "maze-game-v1",
  "puzzle-quest-v1",
  "logic-challenge-v1"
]
```

---

## 13. Next Steps

1. **Implement Profile Endpoint** - Start with `GET /api/mobile/profile` to fetch user profile
2. **Implement Skills Endpoint** - `POST /api/mobile/user-skills`
3. **Implement Gaming Endpoint** - `POST /api/mobile/game-activity`
4. **Implement Vision Board** - `POST /api/mobile/vision-board`
5. **Implement Personality Exam** - `POST /api/mobile/personality-exam`
6. **Implement Program Readiness** - `POST /api/mobile/program-readiness`
7. **Test Integration** - Test all endpoints with mobile app
8. **Add Analytics** - Track API usage and errors

---

## 14. References

- Executive Dashboard Data Structure: `src/app/api/executive-dashboard/route.ts`
- Executive Dashboard UI: `src/components/executive-dashboard/ExecutiveDashboard.tsx`
- User Dashboard Data: `src/app/api/user-dashboard/route.ts`
- Better Auth SDK Rules: `cursor-rules/08-better-auth-sdk.md`

---

**Document Version:** 1.0  
**Last Updated:** 2024-01-15  
**Maintained By:** Development Team
