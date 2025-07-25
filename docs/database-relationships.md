# Database Relationships Documentation

**Project ID:** `yotjidzyzqmgnkxekisf`  
**Schema:** `public`  
**Generated:** $(date)

This document provides a comprehensive overview of all relationships between tables in the public database schema.

## Relationship Overview

The database contains **47 tables** with **complex interconnections** supporting a comprehensive application ecosystem.

---

## Relationship Types

- **One-to-One (1:1)**: A single record in one table relates to exactly one record in another table
- **One-to-Many (1:N)**: A single record in one table relates to multiple records in another table
- **Many-to-One (N:1)**: Multiple records in one table relate to a single record in another table
- **Many-to-Many (N:N)**: Multiple records in one table relate to multiple records in another table (through junction tables)

---

## Core Entity Relationships

### 1. Account-Centric Relationships

| Table | Related Table | Relationship Type | Foreign Key | Description |
|-------|---------------|-------------------|-------------|-------------|
| **accounts** | invitations | 1:N | `invitations.account_id` | Account can have multiple invitations |
| **accounts** | orders | 1:N | `orders.account_id` | Account can have multiple orders |
| **accounts** | subscriptions | 1:N | `subscriptions.account_id` | Account can have multiple subscriptions |
| **accounts** | billing_customers | 1:N | `billing_customers.account_id` | Account can have multiple billing customers |
| **accounts** | credits_usage | 1:N | `credits_usage.account_id` | Account tracks credit usage |
| **accounts** | chats | 1:N | `chats.account_id` | Account can have multiple chat sessions |
| **accounts** | chat_messages | 1:N | `chat_messages.account_id` | Account can have multiple chat messages |
| **accounts** | tasks | 1:N | `tasks.account_id` | Account can have multiple tasks |
| **accounts** | notifications | 1:N | `notifications.account_id` | Account can have multiple notifications |
| **accounts** | accounts_memberships | 1:N | `accounts_memberships.account_id` | Account can have multiple memberships |

### 2. User/Profile Relationships

| Table | Related Table | Relationship Type | Foreign Key | Description |
|-------|---------------|-------------------|-------------|-------------|
| **profiles** | users | 1:1 | `profiles.id` | Profile is linked to auth user |
| **profiles** | workplaces (institution) | N:1 | `profiles.institution_ref` | Profile belongs to an institution |
| **profiles** | workplaces (workplace) | N:1 | `profiles.workplace_ref` | Profile belongs to a workplace |
| **profiles** | answers | 1:N | `answers.user_id` | Profile can have multiple answers |
| **profiles** | account_user | 1:N | `account_user.user_id` | Profile can belong to multiple accounts |
| **profiles** | evaluations | 1:N | `evaluations.user_id` | Profile can have multiple evaluations |
| **profiles** | lca_invitations | 1:N | `lca_invitations.invited_by_user_id` | Profile can send multiple invitations |
| **profiles** | user_tasks | 1:N | `user_tasks.user_id` | Profile can have multiple task assignments |
| **profiles** | vision_boards | 1:N | `vision_boards.user_id` | Profile can have multiple vision boards |
| **profiles** | game_info | 1:N | `game_info.profile_id` | Profile can have multiple game sessions |
| **profiles** | activity_progress | 1:N | `activity_progress.profile_id` | Profile tracks progress in activities |
| **profiles** | task_completion | 1:N | `task_completion.profile_id` | Profile can complete multiple tasks |

### 3. Workplace Relationships

| Table | Related Table | Relationship Type | Foreign Key | Description |
|-------|---------------|-------------------|-------------|-------------|
| **workplaces** | profiles (institution) | 1:N | `profiles.institution_ref` | Workplace can have multiple profiles as institution |
| **workplaces** | profiles (workplace) | 1:N | `profiles.workplace_ref` | Workplace can have multiple profiles as workplace |
| **workplaces** | account_user | 1:N | `account_user.account_id` | Workplace can have multiple account users |
| **workplaces** | evaluations | 1:N | `evaluations.workplace_id` | Workplace can have multiple evaluations |
| **workplaces** | profiles_copy (institution) | 1:N | `profiles_copy.institution_ref` | Workplace can have multiple profile copies as institution |
| **workplaces** | profiles_copy (workplace) | 1:N | `profiles_copy.workplace_ref` | Workplace can have multiple profile copies as workplace |
| **workplaces** | lca_invitations | 1:N | `lca_invitations.account_id` | Workplace can have multiple invitations |

---

## Assessment System Relationships

### 4. Assessment Core Relationships

| Table | Related Table | Relationship Type | Foreign Key | Description |
|-------|---------------|-------------------|-------------|-------------|
| **assessments** | questions | 1:N | `questions.assessment_id` | Assessment can have multiple questions |
| **assessments** | answers | 1:N | `answers.assessment_id` | Assessment can have multiple answers |
| **assessments** | evaluations | 1:N | `evaluations.assessment_id` | Assessment can have multiple evaluations |

### 5. Question and Answer Relationships

| Table | Related Table | Relationship Type | Foreign Key | Description |
|-------|---------------|-------------------|-------------|-------------|
| **questions** | answers | 1:N | `answers.question_id` | Question can have multiple answers |
| **answers** | evaluations | N:1 | `answers.evaluation_id` | Answer belongs to an evaluation |

### 6. Evaluation Relationships

| Table | Related Table | Relationship Type | Foreign Key | Description |
|-------|---------------|-------------------|-------------|-------------|
| **evaluations** | workplaces | N:1 | `evaluations.workplace_id` | Evaluation belongs to a workplace |

---

## Activity and Game System Relationships

### 7. Activity Core Relationships

| Table | Related Table | Relationship Type | Foreign Key | Description |
|-------|---------------|-------------------|-------------|-------------|
| **activities** | categories | N:1 | `activities.category_id` | Activity belongs to a category |
| **activities** | game_tasks | 1:N | `game_tasks.activity_id` | Activity can have multiple tasks |
| **activities** | activity_progress | 1:N | `activity_progress.activity_id` | Activity can have multiple progress records |

### 8. Task and Completion Relationships

| Table | Related Table | Relationship Type | Foreign Key | Description |
|-------|---------------|-------------------|-------------|-------------|
| **game_tasks** | task_completion | 1:N | `task_completion.task_id` | Game task can have multiple completions |
| **user_tasks** | tasks | N:1 | `user_tasks.task_id` | User task assignment belongs to a task |
| **user_tasks** | scores | N:1 | `user_tasks.score_id` | User task has a score |
| **user_tasks** | status | N:1 | `user_tasks.status_id` | User task has a status |

---

## Vision Board System Relationships

### 9. Vision Board Core Relationships

| Table | Related Table | Relationship Type | Foreign Key | Description |
|-------|---------------|-------------------|-------------|-------------|
| **vision_boards** | goals | 1:N | `goals.vision_id` | Vision board can have multiple goals |
| **vision_boards** | vision_log | 1:N | `vision_log.vision_id` | Vision board can have multiple log entries |

### 10. Goal Relationships

| Table | Related Table | Relationship Type | Foreign Key | Description |
|-------|---------------|-------------------|-------------|-------------|
| **goals** | sizes | N:1 | `goals.size_id` | Goal has a size definition |
| **obstacles** | vision_boards | N:1 | `obstacles.vision_id` | Obstacle belongs to a vision board |
| **obstacles** | goals | N:1 | `obstacles.goal_id` | Obstacle can be related to a specific goal |

---

## Billing and Subscription Relationships

### 11. Billing Customer Relationships

| Table | Related Table | Relationship Type | Foreign Key | Description |
|-------|---------------|-------------------|-------------|-------------|
| **billing_customers** | orders | 1:N | `orders.billing_customer_id` | Billing customer can have multiple orders |
| **billing_customers** | subscriptions | 1:N | `subscriptions.billing_customer_id` | Billing customer can have multiple subscriptions |

### 12. Order Relationships

| Table | Related Table | Relationship Type | Foreign Key | Description |
|-------|---------------|-------------------|-------------|-------------|
| **orders** | order_items | 1:N | `order_items.order_id` | Order can have multiple items |

### 13. Subscription Relationships

| Table | Related Table | Relationship Type | Foreign Key | Description |
|-------|---------------|-------------------|-------------|-------------|
| **subscriptions** | subscription_items | 1:N | `subscription_items.subscription_id` | Subscription can have multiple items |

---

## Chat System Relationships

### 14. Chat Relationships

| Table | Related Table | Relationship Type | Foreign Key | Description |
|-------|---------------|-------------------|-------------|-------------|
| **chats** | chat_messages | 1:N | `chat_messages.chat_id` | Chat can have multiple messages |

---

## Role and Permission Relationships

### 15. Role System Relationships

| Table | Related Table | Relationship Type | Foreign Key | Description |
|-------|---------------|-------------------|-------------|-------------|
| **roles** | invitations | 1:N | `invitations.role` | Role can be assigned in multiple invitations |
| **roles** | role_permissions | 1:N | `role_permissions.role` | Role can have multiple permissions |
| **roles** | accounts_memberships | 1:N | `accounts_memberships.account_role` | Role can be assigned to multiple memberships |

---

## Authentication and Security Relationships

### 16. User Authentication Relationships

| Table | Related Table | Relationship Type | Foreign Key | Description |
|-------|---------------|-------------------|-------------|-------------|
| **users** | invitations (invited_by) | 1:N | `invitations.invited_by` | User can send multiple invitations |
| **users** | accounts (created_by) | 1:N | `accounts.created_by` | User can create multiple accounts |
| **users** | accounts (primary_owner) | 1:N | `accounts.primary_owner_user_id` | User can own multiple accounts |
| **users** | accounts (updated_by) | 1:N | `accounts.updated_by` | User can update multiple accounts |
| **users** | nonces | 1:N | `nonces.user_id` | User can have multiple nonces |
| **users** | accounts_memberships (created_by) | 1:N | `accounts_memberships.created_by` | User can create multiple memberships |
| **users** | accounts_memberships (updated_by) | 1:N | `accounts_memberships.updated_by` | User can update multiple memberships |
| **users** | accounts_memberships (user) | 1:N | `accounts_memberships.user_id` | User can have multiple memberships |

---

## Junction Table Relationships

### 17. Many-to-Many Relationships

| Junction Table | Table A | Table B | Relationship Type | Description |
|----------------|---------|---------|-------------------|-------------|
| **account_user** | profiles | workplaces | N:N | Links users to workplaces through accounts |
| **accounts_memberships** | users | accounts | N:N | Links users to accounts with roles |

---

## Data Integrity Relationships

### 18. Cascade and Constraint Relationships

| Table | Constraint Type | Related Table | Action | Description |
|-------|----------------|---------------|--------|-------------|
| **invitations** | Foreign Key | accounts | CASCADE DELETE | Invitations deleted when account is deleted |
| **invitations** | Foreign Key | users | CASCADE DELETE | Invitations deleted when user is deleted |
| **profiles** | Foreign Key | users | CASCADE DELETE | Profile deleted when user is deleted |
| **profiles** | Foreign Key | workplaces (institution) | SET NULL | Institution reference set to null when workplace deleted |
| **profiles** | Foreign Key | workplaces (workplace) | SET NULL | Workplace reference set to null when workplace deleted |

---

## Summary of Relationship Patterns

### Primary Relationship Patterns

1. **Account-Centric Architecture**: Most business entities relate back to accounts
2. **User-Profile Separation**: Authentication users are separate from business profiles
3. **Workplace Organization**: Users can belong to multiple workplaces/institutions
4. **Assessment Flow**: Questions → Answers → Evaluations → Assessments
5. **Activity Progression**: Activities → Tasks → Completions → Progress
6. **Vision Board Hierarchy**: Vision Boards → Goals → Obstacles
7. **Billing Chain**: Accounts → Billing Customers → Orders/Subscriptions → Items

### Key Design Principles

- **Multi-tenancy**: Account-based isolation
- **Flexible User Management**: Support for personal and team accounts
- **Audit Trail**: Comprehensive tracking of creation and updates
- **Soft Deletes**: Deletion flags for data preservation
- **Role-Based Access**: Granular permission system
- **Scalable Billing**: Support for multiple billing providers

This relationship structure supports a comprehensive application with user management, assessment systems, activity tracking, vision planning, billing, and communication features. 