# Mobile API Data Submission Guide
## Adding User Data from Mobile Application to Database

This document provides the **complete API specification** for mobile applications to submit user data to the database. It focuses on the tables used by the Executive Dashboard, Users Table, and Skills APIs.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Getting Profile ID](#getting-profile-id)
3. [Core Skills Data](#core-skills-data)
4. [Skills System (User Skills & Subskills)](#skills-system-user-skills--subskills)
5. [Program Readiness Data](#program-readiness-data)
6. [Gaming Activity Data](#gaming-activity-data)
7. [Vision Board & Goals](#vision-board--goals)
8. [Personality Exam Data](#personality-exam-data)
9. [Data Dependencies & Order](#data-dependencies--order)
10. [Complete User Onboarding](#complete-user-onboarding)
11. [Validation & Error Handling](#validation--error-handling)

---

## Prerequisites

### User Account Setup

The mobile user must have:
- ✅ Entry in `ba_users` table (Better Auth user record)
- ✅ Entry in `profiles` table (Created via `/api/mobile/accept-invite`)
- ✅ Valid `profile_id` (UUID from `profiles.id`)

### Authentication

- Mobile app connects to a **separate authentication database**
- No Better Auth SDK required on mobile
- Mobile users get their `profile_id` via email lookup endpoint
- Route protection mechanism is still under consideration

---

## Getting Profile ID

### Endpoint: `GET /api/mobile/profile-by-email`

**Purpose:** Fetch user's profile_id using their email address

**Query Parameters:**
```
email: string (required)
```

**Request Example:**
```http
GET /api/mobile/profile-by-email?email=user@example.com
```

**Response:**
```json
{
  "success": true,
  "profile_id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "John Doe",
  "user_role": "user",
  "created_at": "2024-01-01T00:00:00Z"
}
```

**Table Schema: `profiles`**
```
Columns:
- id: uuid (PRIMARY KEY, default: gen_random_uuid())
- email: text
- name: text (nullable)
- user_role: role_status (enum: 'admin', 'user', 'admin-executive')
- created_at: timestamp (default: now())
- updated_at: timestamp (default: now())
```

---

## Core Skills Data

### Table: `user_core_skills`

**Purpose:** Stores the 5 core skill categories displayed in dashboard radar charts and readiness calculations.

**Table Schema:**
```sql
user_core_skills
├── id: integer (PRIMARY KEY, auto-increment)
├── user_id: uuid (FOREIGN KEY → profiles.id)
├── category: text (one of: vision, grit, logic, algorithm, problemSolving)
└── value: integer (0-100)
```

### API Endpoint: `POST /api/mobile/core-skills`

**Request Body:**
```json
{
  "profile_id": "550e8400-e29b-41d4-a716-446655440000",
  "skills": {
    "vision": 85,
    "grit": 75,
    "logic": 90,
    "algorithm": 80,
    "problemSolving": 88
  }
}
```

**Validation Rules:**
- All 5 categories are **required**: `vision`, `grit`, `logic`, `algorithm`, `problemSolving`
- Each value must be between **0-100**
- `profile_id` must exist in `profiles` table

**Implementation Logic:**
```sql
-- For each skill category, upsert the record
INSERT INTO user_core_skills (user_id, category, value)
VALUES ('profile-uuid', 'vision', 85)
ON CONFLICT (user_id, category) 
DO UPDATE SET value = EXCLUDED.value, updated_at = now();

-- Repeat for all 5 categories
```

**Response:**
```json
{
  "success": true,
  "message": "Core skills updated successfully",
  "data": {
    "profile_id": "550e8400-e29b-41d4-a716-446655440000",
    "skills_updated": 5,
    "overall_readiness": 83
  }
}
```

**Dashboard Usage:**
- Used in: `/api/executive-dashboard` and `/api/users-table`
- Displayed in: Skill radar charts, overall readiness score
- Overall readiness = Average of all 5 core skill values

---

## Skills System (User Skills & Subskills)

### Tables: `skill_types`, `user_skills`, `user_skill_details`

**Purpose:** Advanced skills tracking system with main skills and detailed subskills. Used by `/api/skills`.

**Table Schemas:**

**`skill_types`** (Reference table - read-only)
```sql
skill_types
├── id: integer (PRIMARY KEY)
├── key: text (unique) - e.g., "problemSolving", "grit"
└── name: text - e.g., "Problem Solving", "Grit"

Current records:
1 | problemSolving | Problem Solving
2 | grit          | Grit
3 | logic         | Logic
4 | algorithm     | Algorithm
5 | vision        | Vision
6 | creativity    | Creativity (if exists)
```

**`user_skills`** (Main skill scores)
```sql
user_skills
├── id: integer (PRIMARY KEY, auto-increment)
├── user_id: uuid (FOREIGN KEY → profiles.id)
├── skill: integer (FOREIGN KEY → skill_types.id)
└── value: integer (0-100)
```

**`user_skill_details`** (Subskill scores)
```sql
user_skill_details
├── id: integer (PRIMARY KEY, auto-increment)
├── user_id: uuid (FOREIGN KEY → profiles.id)
├── skill_id: integer (FOREIGN KEY → skill_types.id)
├── subskill: text (name of subskill)
└── value: integer (0-100)
```

### API Endpoint: `POST /api/mobile/skills`

**Request Body:**
```json
{
  "profile_id": "550e8400-e29b-41d4-a716-446655440000",
  "skills": [
    {
      "skill_key": "problemSolving",
      "value": 85,
      "subskills": [
        { "name": "Pattern Recognition", "value": 90 },
        { "name": "Logical Thinking", "value": 80 },
        { "name": "Debugging", "value": 85 }
      ]
    },
    {
      "skill_key": "grit",
      "value": 75,
      "subskills": [
        { "name": "Perseverance", "value": 80 },
        { "name": "Resilience", "value": 70 }
      ]
    }
  ]
}
```

**Validation Rules:**
- `skill_key` must exist in `skill_types.key`
- Main skill `value` must be 0-100
- Each subskill `value` must be 0-100
- Subskill names are free-text (string, max 200 chars)

**Implementation Logic:**
```sql
-- Step 1: Get skill_type_id from key
SELECT id FROM skill_types WHERE key = 'problemSolving'; -- Returns 1

-- Step 2: Upsert main skill
INSERT INTO user_skills (user_id, skill, value)
VALUES ('profile-uuid', 1, 85)
ON CONFLICT (user_id, skill)
DO UPDATE SET value = EXCLUDED.value;

-- Step 3: Delete existing subskills for this user + skill
DELETE FROM user_skill_details
WHERE user_id = 'profile-uuid' AND skill_id = 1;

-- Step 4: Insert new subskills
INSERT INTO user_skill_details (user_id, skill_id, subskill, value)
VALUES 
  ('profile-uuid', 1, 'Pattern Recognition', 90),
  ('profile-uuid', 1, 'Logical Thinking', 80),
  ('profile-uuid', 1, 'Debugging', 85);
```

**Response:**
```json
{
  "success": true,
  "message": "Skills updated successfully",
  "data": {
    "profile_id": "550e8400-e29b-41d4-a716-446655440000",
    "skills_updated": 2,
    "total_subskills": 5
  }
}
```

**Dashboard Usage:**
- Used in: `/api/skills`
- Merged with users table data in `/api/app/page.tsx`
- Displayed in: Detailed skills breakdown, subskill analysis

---

## Program Readiness Data

### Tables: `assessments`, `user_programs`

**Purpose:** Track user readiness scores for specific career/training programs.

**Table Schemas:**

**`assessments`** (Reference table - programs/assessments available)
```sql
assessments
├── id: uuid (PRIMARY KEY, default: gen_random_uuid())
├── title: text - e.g., "AI/ML Fundamentals"
├── description: text
├── type: varchar (default: 'rating')
├── strategy: jsonb (grading strategy)
├── results_schema: jsonb
├── cover_url: text (nullable)
├── estimated_time: text (nullable)
├── created_at: timestamp (default: now())
└── updated_at: timestamp (default: now())
```

**`user_programs`**
```sql
user_programs
├── id: integer (PRIMARY KEY, auto-increment)
├── user_id: uuid (FOREIGN KEY → profiles.id)
├── assessment_id: uuid (FOREIGN KEY → assessments.id)
└── readiness: integer (0-100)
```

### API Endpoints

#### 1. Get Available Assessments

**GET** `/api/mobile/assessments`

**Query Parameters:**
```
exclude_big_five: boolean (default: true) - Exclude personality assessments
type: string (optional) - Filter by assessment type
```

**Response:**
```json
{
  "success": true,
  "assessments": [
    {
      "id": "3ac68f05-2ea9-4223-b139-d88373859379",
      "title": "AI/ML Fundamentals",
      "description": "Artificial Intelligence and Machine Learning program",
      "estimated_time": "45 minutes",
      "cover_url": "https://..."
    },
    {
      "id": "5b478df9-3fa1-4511-a256-c77e92b59abc",
      "title": "IoT Tech Support",
      "description": "Internet of Things technical support program",
      "estimated_time": "30 minutes",
      "cover_url": "https://..."
    }
  ]
}
```

#### 2. Submit Program Readiness

**POST** `/api/mobile/program-readiness`

**Request Body:**
```json
{
  "profile_id": "550e8400-e29b-41d4-a716-446655440000",
  "programs": [
    {
      "assessment_id": "3ac68f05-2ea9-4223-b139-d88373859379",
      "readiness": 85
    },
    {
      "assessment_id": "5b478df9-3fa1-4511-a256-c77e92b59abc",
      "readiness": 60
    }
  ]
}
```

**Validation Rules:**
- `assessment_id` must exist in `assessments` table
- `readiness` must be 0-100
- Filter out "Big Five" assessments (title contains "Big Five")

**Implementation Logic:**
```sql
-- Verify assessment exists
SELECT title FROM assessments WHERE id = 'assessment-uuid';

-- Upsert program readiness
INSERT INTO user_programs (user_id, assessment_id, readiness)
VALUES ('profile-uuid', 'assessment-uuid', 85)
ON CONFLICT (user_id, assessment_id)
DO UPDATE SET readiness = EXCLUDED.readiness;
```

**Response:**
```json
{
  "success": true,
  "message": "Program readiness updated successfully",
  "data": {
    "profile_id": "550e8400-e29b-41d4-a716-446655440000",
    "programs_updated": 2,
    "average_readiness": 72
  }
}
```

**Dashboard Usage:**
- Used in: `/api/executive-dashboard`, `/api/users-table`
- Displayed in: Program readiness charts, career path recommendations
- Compared against threshold values for each program

---

## Gaming Activity Data

### Tables: `game_info`, `game_tasks` (activities)

**Purpose:** Track user's game progress including levels completed, time spent, and performance.

**Table Schemas:**

**`game_info`** (User game progress)
```sql
game_info
├── id: uuid (PRIMARY KEY, default: gen_random_uuid())
├── profile_id: uuid (FOREIGN KEY → profiles.id)
├── game_id: text (identifier for the game, e.g., "maze-game-v1")
├── levels_completed: boolean[] (array indicating completion status per level)
├── durations: integer[] (array of milliseconds per level)
├── onboarding_completed: boolean (nullable)
└── created_at: timestamp (default: now())
```

**`game_tasks`** (Activities/Games available - Read-only reference)
```sql
game_tasks
├── id: uuid (PRIMARY KEY, default: uuid_generate_v4())
├── activity_id: uuid (FOREIGN KEY → activities.id)
├── name: varchar (task/level name)
├── description: text (nullable)
├── max_score: integer (default: 1)
├── order: integer (nullable, display order)
└── difficulty_level: difficulty enum ('easy', 'medium', 'hard')
```

### API Endpoints

#### 1. Get Game Definition

**GET** `/api/mobile/games/:gameId`

**Example:** `GET /api/mobile/games/maze-game-v1`

**Response:**
```json
{
  "success": true,
  "game": {
    "game_id": "maze-game-v1",
    "name": "Maze Navigation Game",
    "total_levels": 10,
    "tasks": [
      {
        "id": "task-uuid-1",
        "name": "Level 1 - Basic Maze",
        "description": "Navigate through a simple maze",
        "max_score": 100,
        "order": 1,
        "difficulty_level": "easy"
      },
      {
        "id": "task-uuid-2",
        "name": "Level 2 - Intermediate Maze",
        "description": "Navigate with obstacles",
        "max_score": 150,
        "order": 2,
        "difficulty_level": "medium"
      }
    ]
  }
}
```

#### 2. Submit Game Level Completion

**POST** `/api/mobile/game-level`

**Request Body:**
```json
{
  "profile_id": "550e8400-e29b-41d4-a716-446655440000",
  "game_id": "maze-game-v1",
  "level_index": 5,
  "completed": true,
  "duration_ms": 45000,
  "score": 850
}
```

**Validation Rules:**
- `level_index` must be >= 0
- `duration_ms` must be positive
- `completed` must be boolean
- `score` should be non-negative

**Implementation Logic:**
```sql
-- Step 1: Get or create game_info record
INSERT INTO game_info (profile_id, game_id, levels_completed, durations)
VALUES (
  'profile-uuid',
  'maze-game-v1',
  ARRAY[false, false, false, false, false, false, false, false, false, false],
  ARRAY[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
)
ON CONFLICT (profile_id, game_id) DO NOTHING;

-- Step 2: Update specific level
UPDATE game_info
SET 
  levels_completed[6] = true,  -- level_index 5 = array position 6 (1-indexed in PostgreSQL)
  durations[6] = 45000
WHERE profile_id = 'profile-uuid' AND game_id = 'maze-game-v1';
```

**Response:**
```json
{
  "success": true,
  "message": "Game level recorded successfully",
  "data": {
    "profile_id": "550e8400-e29b-41d4-a716-446655440000",
    "game_id": "maze-game-v1",
    "level_completed": 5,
    "total_levels_completed": 6,
    "total_levels": 10,
    "avg_time_per_level_ms": 42000,
    "total_time_spent_ms": 252000
  }
}
```

#### 3. Bulk Update Game Progress

**POST** `/api/mobile/game-progress`

**Request Body:**
```json
{
  "profile_id": "550e8400-e29b-41d4-a716-446655440000",
  "game_id": "maze-game-v1",
  "levels_completed": [true, true, true, false, false, false, false, false, false, false],
  "durations": [30000, 35000, 40000, 0, 0, 0, 0, 0, 0, 0],
  "onboarding_completed": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Game progress updated successfully",
  "data": {
    "profile_id": "550e8400-e29b-41d4-a716-446655440000",
    "game_id": "maze-game-v1",
    "levels_completed_count": 3,
    "total_levels": 10,
    "completion_percentage": 30
  }
}
```

**Dashboard Usage:**
- Used in: `/api/executive-dashboard`, `/api/users-table`
- Displayed in: Gaming activity charts, completion rates, time analytics
- Calculates: Levels completed, avg time per level, difficulty assessment

---

## Vision Board & Goals

### Tables: `vision_boards`, `goals`

**Purpose:** Store user's career vision, goals, and aspirations.

**Table Schemas:**

**`vision_boards`**
```sql
vision_boards
├── id: text (PRIMARY KEY, default: gen_random_uuid())
├── user_id: uuid (FOREIGN KEY → profiles.id)
├── name: text (title/name of vision board)
├── description: text (user's vision description)
├── img_url: text (nullable, background image URL)
├── created_at: timestamp (default: now())
└── updated_at: timestamp (default: now())
```

**`goals`**
```sql
goals
├── id: text (PRIMARY KEY, default: gen_random_uuid())
├── vision_id: text (FOREIGN KEY → vision_boards.id)
├── name: text (goal title)
├── description: text (goal description)
├── url: text (related resource URL)
├── cluster_class: text (nullable, AI-generated category like "Career", "Technical Skills")
├── top_pos: double precision (nullable, UI position)
├── bottom_pos: double precision (nullable)
├── left_pos: double precision (nullable)
├── right_pos: double precision (nullable)
├── size_id: text (nullable, FOREIGN KEY → sizes.id)
├── createdAt: timestamp (default: now())
└── updatedAt: timestamp (default: now())
```

### API Endpoint: `POST /api/mobile/vision-board`

**Request Body:**
```json
{
  "profile_id": "550e8400-e29b-41d4-a716-446655440000",
  "vision_board": {
    "name": "2024 Career Goals",
    "description": "Becoming a data scientist and building my tech career",
    "img_url": "https://storage.example.com/vision-boards/user-123.jpg"
  },
  "goals": [
    {
      "name": "Complete Data Analytics Certification",
      "description": "Finish online certification by Q2 2024",
      "url": "https://coursera.org/data-analytics",
      "cluster_class": "Career"
    },
    {
      "name": "Build 3 Portfolio Projects",
      "description": "Data analysis projects showcasing skills",
      "url": "",
      "cluster_class": "Technical Skills"
    },
    {
      "name": "Improve Public Speaking",
      "description": "Join Toastmasters and practice presentations",
      "url": "",
      "cluster_class": "Personal Growth"
    }
  ]
}
```

**Validation Rules:**
- Vision board `name`: 1-200 characters
- Vision board `description`: 1-2000 characters
- Goals: Minimum 1, maximum 20
- Goal `name`: 1-200 characters
- Goal `description`: 1-1000 characters
- `cluster_class`: Suggested values: "Career", "Technical Skills", "Personal Growth", "Education", "Leadership"

**Implementation Logic:**
```sql
-- Step 1: Create or update vision board
INSERT INTO vision_boards (user_id, name, description, img_url)
VALUES ('profile-uuid', '2024 Career Goals', 'Becoming a data scientist...', 'https://...')
ON CONFLICT (user_id)
DO UPDATE SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  img_url = EXCLUDED.img_url,
  updated_at = now()
RETURNING id;

-- Let's say vision_board_id = 'vision-uuid-123'

-- Step 2: Delete existing goals
DELETE FROM goals WHERE vision_id = 'vision-uuid-123';

-- Step 3: Insert new goals
INSERT INTO goals (vision_id, name, description, url, cluster_class)
VALUES 
  ('vision-uuid-123', 'Complete Data Analytics Certification', '...', 'https://...', 'Career'),
  ('vision-uuid-123', 'Build 3 Portfolio Projects', '...', '', 'Technical Skills'),
  ('vision-uuid-123', 'Improve Public Speaking', '...', '', 'Personal Growth');
```

**Response:**
```json
{
  "success": true,
  "message": "Vision board updated successfully",
  "data": {
    "vision_board_id": "vision-uuid-123",
    "profile_id": "550e8400-e29b-41d4-a716-446655440000",
    "goals_count": 3,
    "focus_areas": ["Career", "Technical Skills", "Personal Growth"]
  }
}
```

**Dashboard Usage:**
- Used in: `/api/executive-dashboard`, `/api/users-table`
- Displayed in: Vision board visualization, goal tracking, focus area analysis
- Shows: Goals list, focus areas, career aspirations

---

## Personality Exam Data

### Tables: `personality_exams`, `exam_traits`, `exam_strengths`, `exam_growth_areas`

**Purpose:** Store personality assessment results (MBTI, Big Five, etc.)

**Table Schemas:**

**`personality_exams`**
```sql
personality_exams
├── id: integer (PRIMARY KEY, auto-increment)
├── user_id: uuid (FOREIGN KEY → profiles.id)
└── type: text (exam type: "MBTI", "Big Five", "DISC", etc.)
```

**`exam_traits`**
```sql
exam_traits
├── id: integer (PRIMARY KEY, auto-increment)
├── exam_id: integer (FOREIGN KEY → personality_exams.id)
├── trait: text (trait name: "Introversion", "Openness", etc.)
└── value: integer (0-100, trait score)
```

**`exam_strengths`**
```sql
exam_strengths
├── id: integer (PRIMARY KEY, auto-increment)
├── exam_id: integer (FOREIGN KEY → personality_exams.id)
└── strength: text (identified strength)
```

**`exam_growth_areas`**
```sql
exam_growth_areas
├── id: integer (PRIMARY KEY, auto-increment)
├── exam_id: integer (FOREIGN KEY → personality_exams.id)
└── area: text (growth area/weakness to develop)
```

### API Endpoint: `POST /api/mobile/personality-exam`

**Request Body:**
```json
{
  "profile_id": "550e8400-e29b-41d4-a716-446655440000",
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
    "Problem Solving",
    "Independent Work"
  ],
  "growth_areas": [
    "Team Collaboration",
    "Emotional Expression",
    "Spontaneity"
  ],
  "completed_at": "2024-01-15T10:30:00Z"
}
```

**Validation Rules:**
- `exam_type`: Required, max 50 characters
- Trait values: Must be 0-100
- Minimum 3 traits required
- Strengths: Minimum 1, maximum 10
- Growth areas: Minimum 1, maximum 10

**Common Exam Types & Their Traits:**

**MBTI:**
- Traits: Introversion, Extroversion, Intuition, Sensing, Thinking, Feeling, Judging, Perceiving

**Big Five:**
- Traits: Openness, Conscientiousness, Extroversion, Agreeableness, Neuroticism

**DISC:**
- Traits: Dominance, Influence, Steadiness, Conscientiousness

**Implementation Logic:**
```sql
-- Step 1: Create or replace personality exam
INSERT INTO personality_exams (user_id, type)
VALUES ('profile-uuid', 'MBTI')
ON CONFLICT (user_id, type)
DO UPDATE SET type = EXCLUDED.type
RETURNING id;

-- Let's say exam_id = 123

-- Step 2: Delete existing traits
DELETE FROM exam_traits WHERE exam_id = 123;

-- Step 3: Insert new traits
INSERT INTO exam_traits (exam_id, trait, value)
VALUES 
  (123, 'Introversion', 65),
  (123, 'Extroversion', 35),
  (123, 'Intuition', 80),
  (123, 'Sensing', 20),
  (123, 'Thinking', 75),
  (123, 'Feeling', 25),
  (123, 'Judging', 60),
  (123, 'Perceiving', 40);

-- Step 4: Delete and insert strengths
DELETE FROM exam_strengths WHERE exam_id = 123;
INSERT INTO exam_strengths (exam_id, strength)
VALUES 
  (123, 'Analytical Thinking'),
  (123, 'Strategic Planning'),
  (123, 'Problem Solving'),
  (123, 'Independent Work');

-- Step 5: Delete and insert growth areas
DELETE FROM exam_growth_areas WHERE exam_id = 123;
INSERT INTO exam_growth_areas (exam_id, area)
VALUES 
  (123, 'Team Collaboration'),
  (123, 'Emotional Expression'),
  (123, 'Spontaneity');
```

**Response:**
```json
{
  "success": true,
  "message": "Personality exam recorded successfully",
  "data": {
    "exam_id": 123,
    "profile_id": "550e8400-e29b-41d4-a716-446655440000",
    "exam_type": "MBTI",
    "personality_type": "INTJ",
    "traits_count": 8,
    "strengths_count": 4,
    "growth_areas_count": 3
  }
}
```

**Dashboard Usage:**
- Used in: `/api/executive-dashboard`, `/api/users-table`
- Displayed in: Personality profile, strengths analysis, recommended roles
- Filters: Excludes Big Five from program readiness calculations

---

## Data Dependencies & Order

### Recommended Submission Order

When onboarding a new user, submit data in this order to maintain referential integrity:

```
1. ✅ User already exists in profiles table (via /api/mobile/accept-invite)
   └── Get profile_id

2. Core Skills Data (required for overall readiness)
   POST /api/mobile/core-skills

3. Skills System (optional but recommended)
   POST /api/mobile/skills

4. Program Readiness (depends on assessments existing)
   GET  /api/mobile/assessments (get available programs)
   POST /api/mobile/program-readiness

5. Gaming Activity (optional)
   GET  /api/mobile/games/:gameId (get game structure)
   POST /api/mobile/game-progress

6. Vision Board & Goals (optional)
   POST /api/mobile/vision-board

7. Personality Exam (optional)
   POST /api/mobile/personality-exam
```

### Table Dependencies Diagram

```
profiles (id)
├── user_core_skills (user_id → profiles.id) ✓ Required
├── user_skills (user_id → profiles.id)
│   └── skill_types (skill → skill_types.id) ← Reference table
├── user_skill_details (user_id → profiles.id)
│   └── skill_types (skill_id → skill_types.id) ← Reference table
├── user_programs (user_id → profiles.id)
│   └── assessments (assessment_id → assessments.id) ← Reference table
├── game_info (profile_id → profiles.id)
│   └── game_tasks (activity_id) ← Reference table
├── vision_boards (user_id → profiles.id)
│   └── goals (vision_id → vision_boards.id)
└── personality_exams (user_id → profiles.id)
    ├── exam_traits (exam_id → personality_exams.id)
    ├── exam_strengths (exam_id → personality_exams.id)
    └── exam_growth_areas (exam_id → personality_exams.id)
```

### Minimum Required Data

To appear in the dashboard, a user **must have**:
- ✅ Profile in `profiles` table
- ✅ Core skills in `user_core_skills` (all 5 categories)

Everything else is **optional** but enhances the user's profile:
- User skills & subskills (for detailed analysis)
- Program readiness (for career recommendations)
- Gaming data (for engagement metrics)
- Vision board (for goal tracking)
- Personality exam (for personality insights)

---

## Complete User Onboarding

### Endpoint: `POST /api/mobile/complete-onboarding`

**Purpose:** Submit all user data in a single API call (useful for completing onboarding flow)

**Request Body:**
```json
{
  "profile_id": "550e8400-e29b-41d4-a716-446655440000",
  "core_skills": {
    "vision": 85,
    "grit": 75,
    "logic": 90,
    "algorithm": 80,
    "problemSolving": 88
  },
  "skills": [
    {
      "skill_key": "problemSolving",
      "value": 85,
      "subskills": [
        { "name": "Pattern Recognition", "value": 90 }
      ]
    }
  ],
  "program_readiness": [
    {
      "assessment_id": "3ac68f05-2ea9-4223-b139-d88373859379",
      "readiness": 85
    }
  ],
  "gaming_activity": {
    "game_id": "maze-game-v1",
    "levels_completed": [true, true, false, false],
    "durations": [30000, 45000, 0, 0],
    "onboarding_completed": true
  },
  "vision_board": {
    "name": "2024 Goals",
    "description": "Career advancement",
    "img_url": "https://...",
    "goals": [
      {
        "name": "Get certified",
        "description": "Complete certification",
        "url": "",
        "cluster_class": "Career"
      }
    ]
  },
  "personality_exam": {
    "exam_type": "MBTI",
    "traits": {
      "Introversion": 65,
      "Extroversion": 35
    },
    "strengths": ["Analytical"],
    "growth_areas": ["Communication"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "User onboarding completed successfully",
  "data": {
    "profile_id": "550e8400-e29b-41d4-a716-446655440000",
    "overall_readiness": 83,
    "sections_completed": [
      "core_skills",
      "skills",
      "program_readiness",
      "gaming_activity",
      "vision_board",
      "personality_exam"
    ],
    "profile_completeness": 100
  }
}
```

---

## Validation & Error Handling

### Standard Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed for one or more fields",
    "details": [
      {
        "field": "core_skills.vision",
        "message": "Value must be between 0 and 100",
        "received": 150
      }
    ]
  }
}
```

### HTTP Status Codes

| Code | Meaning | When to Use |
|------|---------|-------------|
| 200 | Success | Data successfully created/updated |
| 400 | Bad Request | Validation error, missing required fields |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | User trying to update another user's data |
| 404 | Not Found | Profile ID or assessment ID doesn't exist |
| 409 | Conflict | Duplicate entry (if applicable) |
| 500 | Internal Server Error | Database or server error |

### Common Validation Rules

**All Numeric Score Fields:**
- Must be integers
- Must be between 0 and 100
- Cannot be null (unless specifically marked nullable)

**All UUID Fields:**
- Must be valid UUID v4 format
- Must exist in referenced table (e.g., profile_id in profiles)

**All Text Fields:**
- Must not be empty strings (unless nullable)
- Must respect max length constraints
- Must be properly escaped for SQL injection prevention

**Array Fields:**
- Must be valid arrays (not null)
- Must have correct length for fixed-size arrays (e.g., game levels)
- Elements must match expected data type

### Example Validation Errors

**Missing Required Field:**
```json
{
  "success": false,
  "error": {
    "code": "MISSING_REQUIRED_FIELD",
    "message": "Required field 'profile_id' is missing"
  }
}
```

**Invalid Profile ID:**
```json
{
  "success": false,
  "error": {
    "code": "PROFILE_NOT_FOUND",
    "message": "No profile found with ID: 550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Invalid Skill Value:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Skill value out of range",
    "details": {
      "field": "skills.vision",
      "constraint": "Value must be between 0 and 100",
      "received": -5
    }
  }
}
```

---

## Testing & Sample Data

### Sample Profile IDs for Testing

```
test_user_1: "550e8400-e29b-41d4-a716-446655440000"
test_user_2: "6ba7b810-9dad-11d1-80b4-00c04fd430c8"
test_user_3: "7c9e6679-7425-40de-944b-e07fc1f90ae7"
```

### Sample Assessment IDs

```json
{
  "AI/ML Fundamentals": "3ac68f05-2ea9-4223-b139-d88373859379",
  "IoT Tech Support": "5b478df9-3fa1-4511-a256-c77e92b59abc",
  "Data Analytics": "8f1a2c6e-4b3d-4a1f-9e7a-3d5c8b2f1e9d",
  "Computer Networking": "a2e5f8c3-9b7d-4f1a-8e6c-5d3b9f2a1c8e",
  "Cybersecurity": "b9f4e7d2-6c8a-4e3b-9f1d-7a5c8e2b4f9d"
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

## API Summary Table

| Endpoint | Method | Purpose | Required Data |
|----------|--------|---------|---------------|
| `/api/mobile/profile-by-email` | GET | Get profile ID by email | email |
| `/api/mobile/core-skills` | POST | Submit core 5 skills | profile_id, skills (5) |
| `/api/mobile/skills` | POST | Submit detailed skills & subskills | profile_id, skills array |
| `/api/mobile/assessments` | GET | Get available programs | - |
| `/api/mobile/program-readiness` | POST | Submit program readiness scores | profile_id, programs array |
| `/api/mobile/games/:gameId` | GET | Get game structure | gameId |
| `/api/mobile/game-level` | POST | Record single level completion | profile_id, game_id, level_index, completed, duration_ms |
| `/api/mobile/game-progress` | POST | Bulk update game progress | profile_id, game_id, levels_completed, durations |
| `/api/mobile/vision-board` | POST | Create/update vision board & goals | profile_id, vision_board, goals array |
| `/api/mobile/personality-exam` | POST | Submit personality test results | profile_id, exam_type, traits, strengths, growth_areas |
| `/api/mobile/complete-onboarding` | POST | Submit all data at once | profile_id, all sections |

---

## Next Steps for Implementation

### Phase 1: Authentication & Profile ✅
- [x] User signup via `/api/mobile/accept-invite`
- [ ] Implement `/api/mobile/profile-by-email` endpoint
- [ ] Design authentication/authorization strategy for mobile routes

### Phase 2: Core Data Endpoints
- [ ] Implement `/api/mobile/core-skills` (highest priority)
- [ ] Implement `/api/mobile/skills`
- [ ] Implement `/api/mobile/program-readiness`
- [ ] Implement `/api/mobile/assessments` (helper endpoint)

### Phase 3: Engagement Data
- [ ] Implement `/api/mobile/game-level`
- [ ] Implement `/api/mobile/game-progress`
- [ ] Implement `/api/mobile/games/:gameId` (helper endpoint)

### Phase 4: Profile Enhancement
- [ ] Implement `/api/mobile/vision-board`
- [ ] Implement `/api/mobile/personality-exam`

### Phase 5: Complete Onboarding
- [ ] Implement `/api/mobile/complete-onboarding`
- [ ] Add validation middleware for all endpoints
- [ ] Add rate limiting
- [ ] Add request logging

---

## References

- **Dashboard Data Source:** `src/app/api/executive-dashboard/route.ts`
- **Users Table Data:** `src/app/api/users-table/route.ts`
- **Skills Data:** `src/app/api/skills/route.ts`
- **Executive Dashboard UI:** `src/components/executive-dashboard/ExecutiveDashboard.tsx`
- **Database Schema:** Supabase MCP server

---

**Document Version:** 2.0  
**Last Updated:** 2024-01-15  
**Author:** Development Team  
**Status:** Ready for Implementation
