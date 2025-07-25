# Supabase Database Schema Documentation

**Project ID:** `yotjidzyzqmgnkxekisf`  
**Schema:** `public`  
**Generated:** $(date)

This document provides a comprehensive overview of all tables in the public database schema.

## Table Overview

The database contains **47 tables** in the public schema.

---

## 1. accounts

**Description:** Accounts are the top level entity in the Supabase MakerKit. They can be team or personal accounts.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | NO | uuid_generate_v4() | Primary key |
| primary_owner_user_id | uuid | NO | auth.uid() | The primary owner of the account |
| name | varchar | NO | null | The name of the account |
| slug | text | YES | null | The slug of the account |
| email | varchar | YES | null | The email of the account |
| is_personal_account | boolean | NO | false | Whether the account is a personal account or not |
| updated_at | timestamptz | YES | null | Last update timestamp |
| created_at | timestamptz | YES | null | Creation timestamp |
| created_by | uuid | YES | null | User who created the account |
| updated_by | uuid | YES | null | User who last updated the account |
| picture_url | varchar | YES | null | Profile picture URL |
| public_data | jsonb | NO | '{}'::jsonb | Public data for the account |

**Primary Key:** `id`

---

## 2. profiles

**Description:** User profiles table

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| email | text | NO | null | User email |
| name | text | YES | null | User name |
| workplace | text | YES | null | User workplace |
| created_at | timestamp | YES | now() | Creation timestamp |
| updated_at | timestamp | YES | now() | Last update timestamp |
| fdb_ref | uuid | YES | null | Firebase reference |
| id | uuid | NO | gen_random_uuid() | Primary key |
| topPos | smallint | YES | null | Top position |
| bottomPos | smallint | YES | null | Bottom position |
| leftPos | smallint | YES | null | Left position |
| rightPos | smallint | YES | null | Right position |
| profile_photo | text | YES | null | Profile photo URL |
| user_role | role_status | NO | 'user'::role_status | User role (admin/user) |
| workplace_ref | uuid | YES | null | Workplace reference |
| institution_ref | uuid | YES | null | Institution reference |
| employment_status | text | YES | null | Employment status |
| is_deleted | boolean | YES | false | Deletion flag |

**Primary Key:** `id`

---

## 3. workplaces

**Description:** Workplace/organization information

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| workplace_logo | text | YES | null | Workplace logo URL |
| workplace_address | jsonb | YES | null | Workplace address |
| workplace_description | text | YES | null | Workplace description |
| workplace_domain | text | YES | null | Workplace domain |
| workplace_email | varchar | YES | null | Workplace email |
| workplace_name | text | YES | null | Workplace name |
| id | uuid | NO | gen_random_uuid() | Primary key |
| type | text | YES | null | Workplace type |
| enabled_assessments | uuid[] | NO | '{3ac68f05-2ea9-4223-b139-d88373859379}'::uuid[] | Enabled assessments |

**Primary Key:** `id`

---

## 4. activities

**Description:** Activity definitions

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | NO | uuid_generate_v4() | Primary key |
| name | varchar | NO | null | Activity name |
| category_id | bigint | YES | null | Category ID |
| subcategory | varchar | YES | null | Subcategory |
| description | text | YES | null | Activity description |
| image_url | varchar | YES | null | Image URL |
| thumbnail_url | varchar | YES | null | Thumbnail URL |
| enabled | boolean | NO | null | Whether activity is enabled |
| meta_data | jsonb | YES | null | Metadata |
| featured | boolean | NO | false | Whether activity is featured |
| created_at | timestamp | YES | now() | Creation timestamp |

**Primary Key:** `id`

---

## 5. game_tasks

**Description:** Tasks within activities

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | NO | uuid_generate_v4() | Primary key |
| activity_id | uuid | NO | null | Activity ID |
| name | varchar | NO | null | Task name |
| description | text | YES | null | Task description |
| max_score | integer | NO | 1 | Maximum score |
| order | integer | YES | null | Task order |
| difficulty_level | difficulty | YES | null | Difficulty level (easy/medium/hard) |

**Primary Key:** `id`

---

## 6. assessments

**Description:** Assessment definitions

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | NO | gen_random_uuid() | Primary key |
| type | varchar | NO | 'rating'::character varying | Assessment type |
| strategy | jsonb | YES | '{}'::jsonb | Assessment strategy |
| results_schema | jsonb | YES | '{}'::jsonb | Results schema |
| created_at | timestamp | YES | now() | Creation timestamp |
| updated_at | timestamp | YES | now() | Last update timestamp |
| title | text | NO | null | Assessment title |
| description | text | NO | null | Assessment description |
| cover_url | text | YES | null | Cover image URL |
| estimated_time | text | YES | null | Estimated completion time |
| metadata | jsonb | NO | '{}'::jsonb | Metadata |

**Primary Key:** `id`

---

## 7. questions

**Description:** Questions within assessments

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | integer | NO | nextval('questions_id_seq'::regclass) | Primary key |
| question | text | NO | null | Question text |
| category | text | NO | null | Question category |
| feat_label | text | NO | null | Feature label |
| assessment_id | uuid | YES | null | Assessment ID |
| metadata | jsonb | YES | '{}'::jsonb | Metadata |

**Primary Key:** `id`

---

## 8. evaluations

**Description:** User evaluation sessions

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | NO | gen_random_uuid() | Primary key |
| user_id | uuid | NO | null | User ID |
| assessment_id | uuid | YES | null | Assessment ID |
| results | jsonb | YES | '{}'::jsonb | Evaluation results |
| is_completed | boolean | NO | false | Completion status |
| created_at | timestamp | NO | now() | Creation timestamp |
| workplace_id | uuid | NO | null | Workplace ID |

**Primary Key:** `id`

---

## 9. answers

**Description:** User answers to questions

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | integer | NO | null | Primary key (auto-increment) |
| answered_at | timestamp | NO | now() | Answer timestamp |
| rating | integer | NO | null | Rating value |
| question_id | integer | NO | null | Question ID |
| user_id | uuid | NO | null | User ID |
| assessment_id | uuid | YES | null | Assessment ID |
| response | jsonb | YES | '{}'::jsonb | Response data |
| evaluation_id | uuid | NO | null | Evaluation ID |

**Primary Key:** `id`

---

## 10. game_info

**Description:** Game progress information

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | NO | gen_random_uuid() | Primary key |
| created_at | timestamptz | YES | now() | Creation timestamp |
| levels_completed | boolean[] | YES | null | Levels completion status |
| onboarding_completed | boolean | YES | null | Onboarding completion |
| game_id | text | NO | null | Game ID |
| profile_id | uuid | NO | null | Profile ID |
| durations | integer[] | YES | null | Level durations |

**Primary Key:** `id`

---

## 11. activity_progress

**Description:** User progress in activities

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | NO | uuid_generate_v4() | Primary key |
| profile_id | uuid | NO | null | Profile ID |
| activity_id | uuid | NO | null | Activity ID |
| score | integer | YES | null | Current score |
| total_score | integer | YES | null | Total possible score |
| onboarding_completed | boolean | YES | null | Onboarding completion |
| current_task_order | integer | NO | 1 | Current task order |

**Primary Key:** `id`

---

## 12. task_completion

**Description:** Task completion records

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| profile_id | uuid | NO | null | Profile ID |
| task_id | uuid | NO | null | Task ID |
| completion_timestamp | timestamptz | YES | now() | Completion timestamp |
| score | integer | YES | null | Completion score |
| id | uuid | NO | gen_random_uuid() | Primary key |

**Primary Key:** `id`

---

## 13. vision_boards

**Description:** User vision boards

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | text | NO | gen_random_uuid() | Primary key |
| name | text | NO | null | Vision board name |
| description | text | NO | null | Vision board description |
| img_url | text | YES | null | Image URL |
| created_at | timestamp | YES | now() | Creation timestamp |
| updated_at | timestamp | YES | now() | Last update timestamp |
| user_id | uuid | NO | null | User ID |

**Primary Key:** `id`

---

## 14. goals

**Description:** Goals within vision boards

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | text | NO | gen_random_uuid() | Primary key |
| name | text | NO | null | Goal name |
| description | text | NO | null | Goal description |
| url | text | NO | null | Goal URL |
| vision_id | text | NO | null | Vision board ID |
| top_pos | double precision | YES | null | Top position |
| bottom_pos | double precision | YES | null | Bottom position |
| left_pos | double precision | YES | null | Left position |
| right_pos | double precision | YES | null | Right position |
| size_id | text | YES | null | Size ID |
| createdAt | timestamp | NO | now() | Creation timestamp |
| updatedAt | timestamp | NO | now() | Last update timestamp |
| cluster_class | text | YES | null | Cluster classification |

**Primary Key:** `id`

---

## 15. obstacles

**Description:** Obstacles related to goals

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | text | NO | gen_random_uuid() | Primary key |
| name | text | YES | null | Obstacle name |
| vision_id | text | YES | null | Vision board ID |
| goal_id | text | YES | null | Goal ID |
| createdAt | timestamp | YES | now() | Creation timestamp |
| updatedAt | timestamp | YES | now() | Last update timestamp |
| is_completed | boolean | YES | false | Completion status |

**Primary Key:** `id`

---

## 16. sizes

**Description:** Size definitions for goals

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | text | NO | gen_random_uuid() | Primary key |
| height | double precision | NO | 200.0 | Height value |
| width | double precision | NO | 200.0 | Width value |

**Primary Key:** `id`

---

## 17. categories

**Description:** Activity categories

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | bigint | NO | null | Primary key (auto-increment) |
| created_at | timestamptz | NO | now() | Creation timestamp |
| name | varchar | YES | null | Category name |

**Primary Key:** `id`

---

## 18. accounts_memberships

**Description:** The memberships for an account

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| user_id | uuid | NO | null | User ID |
| account_id | uuid | NO | null | Account ID |
| account_role | varchar | NO | null | The role for the membership |
| created_at | timestamptz | NO | CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | timestamptz | NO | CURRENT_TIMESTAMP | Last update timestamp |
| created_by | uuid | YES | null | User who created membership |
| updated_by | uuid | YES | null | User who last updated membership |

**Primary Key:** `user_id, account_id`

---

## 19. invitations

**Description:** The invitations for an account

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | integer | NO | nextval('invitations_id_seq'::regclass) | Primary key |
| email | varchar | NO | null | The email of the user being invited |
| account_id | uuid | NO | null | The account the invitation is for |
| invited_by | uuid | NO | null | The user who invited the user |
| role | varchar | NO | null | The role for the invitation |
| invite_token | varchar | NO | null | The token for the invitation |
| created_at | timestamptz | NO | CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | timestamptz | NO | CURRENT_TIMESTAMP | Last update timestamp |
| expires_at | timestamptz | NO | (CURRENT_TIMESTAMP + '7 days'::interval) | The expiry date for the invitation |

**Primary Key:** `id`

---

## 20. lca_invitations

**Description:** LCA invitation system

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | NO | uuid_generate_v4() | Primary key |
| account_role | account_role | NO | null | Account role |
| account_id | uuid | NO | null | Account ID |
| token | text | NO | generate_token(30) | Invitation token |
| invited_by_user_id | uuid | NO | null | Inviting user ID |
| account_team_name | text | YES | null | Account team name |
| updated_at | timestamptz | YES | now() | Last update timestamp |
| created_at | timestamptz | YES | now() | Creation timestamp |
| invitation_type | invitation_type | NO | null | Invitation type |
| invitee_email | text | NO | null | Invitee email |
| message | text | YES | null | Invitation message |

**Primary Key:** `id`

---

## 21. roles

**Description:** Role definitions

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| name | varchar | NO | null | Role name |
| hierarchy_level | integer | NO | null | Hierarchy level |

**Primary Key:** `name`

---

## 22. role_permissions

**Description:** The permissions for a role

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | bigint | NO | null | Primary key (auto-increment) |
| role | varchar | NO | null | The role the permission is for |
| permission | app_permissions | NO | null | The permission for the role |

**Primary Key:** `id`

---

## 23. billing_customers

**Description:** The billing customers for an account

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| account_id | uuid | NO | null | The account the billing customer is for |
| id | integer | NO | nextval('billing_customers_id_seq'::regclass) | Primary key |
| email | text | YES | null | The email of the billing customer |
| provider | billing_provider | NO | null | The provider of the billing customer |
| customer_id | text | NO | null | The customer ID for the billing customer |

**Primary Key:** `id`

---

## 24. subscriptions

**Description:** The subscriptions for an account

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | text | NO | null | Primary key |
| account_id | uuid | NO | null | The account the subscription is for |
| billing_customer_id | integer | NO | null | The billing customer ID for the subscription |
| status | subscription_status | NO | null | The status of the subscription |
| active | boolean | NO | null | Whether the subscription is active |
| billing_provider | billing_provider | NO | null | The provider of the subscription |
| cancel_at_period_end | boolean | NO | null | Whether the subscription will be canceled at the end of the period |
| currency | varchar | NO | null | The currency for the subscription |
| created_at | timestamptz | NO | CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | timestamptz | NO | CURRENT_TIMESTAMP | Last update timestamp |
| period_starts_at | timestamptz | NO | null | The start of the current period for the subscription |
| period_ends_at | timestamptz | NO | null | The end of the current period for the subscription |
| trial_starts_at | timestamptz | YES | null | The start of the trial period for the subscription |
| trial_ends_at | timestamptz | YES | null | The end of the trial period for the subscription |

**Primary Key:** `id`

---

## 25. subscription_items

**Description:** The items in a subscription

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | varchar | NO | null | Primary key |
| subscription_id | text | NO | null | The subscription the item is for |
| product_id | varchar | NO | null | The product ID for the item |
| variant_id | varchar | NO | null | The variant ID for the item |
| type | subscription_item_type | NO | null | Item type |
| price_amount | numeric | YES | null | The price amount for the item |
| quantity | integer | NO | 1 | The quantity of the item |
| interval | varchar | NO | null | The interval for the item |
| interval_count | integer | NO | null | The interval count for the item |
| created_at | timestamptz | NO | CURRENT_TIMESTAMP | The creation date of the item |
| updated_at | timestamptz | NO | CURRENT_TIMESTAMP | The last update date of the item |

**Primary Key:** `id`

---

## 26. orders

**Description:** The one-time orders for an account

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | text | NO | null | Primary key |
| account_id | uuid | NO | null | The account the order is for |
| billing_customer_id | integer | NO | null | The billing customer ID for the order |
| status | payment_status | NO | null | The status of the order |
| billing_provider | billing_provider | NO | null | The provider of the order |
| total_amount | numeric | NO | null | The total amount for the order |
| currency | varchar | NO | null | The currency for the order |
| created_at | timestamptz | NO | CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | timestamptz | NO | CURRENT_TIMESTAMP | Last update timestamp |

**Primary Key:** `id`

---

## 27. order_items

**Description:** The items in an order

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | text | NO | null | Primary key |
| order_id | text | NO | null | The order the item is for |
| product_id | text | NO | null | The product ID for the item |
| variant_id | text | NO | null | The variant ID for the item |
| price_amount | numeric | YES | null | The price amount for the item |
| quantity | integer | NO | 1 | The quantity of the item |
| created_at | timestamptz | NO | CURRENT_TIMESTAMP | The creation date of the item |
| updated_at | timestamptz | NO | CURRENT_TIMESTAMP | The last update date of the item |

**Primary Key:** `id`

---

## 28. plans

**Description:** Subscription plans

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| variant_id | varchar | NO | null | Primary key |
| name | varchar | NO | null | Plan name |
| tokens_quota | integer | NO | null | Token quota |

**Primary Key:** `variant_id`

---

## 29. credits_usage

**Description:** Credit usage tracking

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | integer | NO | nextval('credits_usage_id_seq'::regclass) | Primary key |
| account_id | uuid | NO | null | Account ID |
| remaining_credits | integer | NO | 0 | Remaining credits |

**Primary Key:** `id`

---

## 30. notifications

**Description:** The notifications for an account

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | bigint | NO | null | Primary key (auto-increment) |
| account_id | uuid | NO | null | The account the notification is for |
| type | notification_type | NO | 'info'::notification_type | The type of the notification |
| body | varchar | NO | null | The body of the notification |
| link | varchar | YES | null | The link for the notification |
| channel | notification_channel | NO | 'in_app'::notification_channel | The channel for the notification |
| dismissed | boolean | NO | false | Whether the notification has been dismissed |
| expires_at | timestamptz | YES | (now() + '1 mon'::interval) | The expiry date for the notification |
| created_at | timestamptz | NO | now() | The creation date for the notification |

**Primary Key:** `id`

---

## 31. chats

**Description:** Chat sessions

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | integer | NO | nextval('chats_id_seq'::regclass) | Primary key |
| reference_id | varchar | NO | null | Reference ID |
| name | varchar | NO | null | Chat name |
| account_id | uuid | NO | null | Account ID |
| settings | jsonb | NO | '{}'::jsonb | Chat settings |
| created_at | timestamptz | YES | now() | Creation timestamp |

**Primary Key:** `id`

---

## 32. chat_messages

**Description:** Chat messages

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | NO | gen_random_uuid() | Primary key |
| chat_id | integer | NO | nextval('chat_messages_chat_id_seq'::regclass) | Chat ID |
| account_id | uuid | NO | null | Account ID |
| content | text | NO | null | Message content |
| role | chat_role | NO | null | Message role (user/assistant) |
| created_at | timestamptz | YES | now() | Creation timestamp |

**Primary Key:** `id`

---

## 33. tasks

**Description:** General tasks

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | NO | gen_random_uuid() | Primary key |
| title | varchar | NO | null | Task title |
| description | varchar | YES | null | Task description |
| done | boolean | NO | false | Completion status |
| account_id | uuid | NO | null | Account ID |
| created_at | timestamptz | NO | now() | Creation timestamp |
| updated_at | timestamptz | NO | now() | Last update timestamp |

**Primary Key:** `id`

---

## 34. user_tasks

**Description:** User task assignments

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | NO | gen_random_uuid() | Primary key |
| user_id | uuid | YES | null | User ID |
| task_id | uuid | YES | null | Task ID |
| created_at | timestamp | YES | null | Creation timestamp |
| status_id | uuid | YES | null | Status ID |
| score_id | uuid | YES | null | Score ID |

**Primary Key:** `id`

---

## 35. status

**Description:** Task status tracking

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | NO | gen_random_uuid() | Primary key |
| state | taskstate | YES | 'UNTOUCHED'::taskstate | Task state |
| locked | boolean | YES | true | Lock status |
| progress | integer | YES | 0 | Progress percentage |
| complete | boolean | YES | false | Completion status |
| started_at | timestamp | YES | now() | Start timestamp |
| completed_at | timestamp | YES | null | Completion timestamp |

**Primary Key:** `id`

---

## 36. scores

**Description:** Score tracking

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | NO | gen_random_uuid() | Primary key |
| score | double precision | YES | null | Score value |
| updated_at | timestamp | YES | now() | Last update timestamp |

**Primary Key:** `id`

---

## 37. vision_log

**Description:** Vision board activity log

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | text | NO | null | Primary key |
| vision_id | text | NO | null | Vision board ID |
| device_id | text | NO | null | Device ID |
| edited_at | timestamp | NO | now() | Edit timestamp |
| updated_at | timestamp | NO | now() | Update timestamp |

**Primary Key:** `id`

---

## 38. image_search

**Description:** Image search results

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | text | NO | null | Primary key |
| search_term | text | NO | null | Search term |
| url | text | NO | null | Image URL |

**Primary Key:** `id`

---

## 39. constants

**Description:** Application constants

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | NO | gen_random_uuid() | Primary key |
| created_at | timestamptz | NO | now() | Creation timestamp |
| key | text | NO | null | Constant key |
| value | json | YES | null | Constant value |

**Primary Key:** `id`

---

## 40. config

**Description:** Configuration for the Supabase MakerKit

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| enable_team_accounts | boolean | NO | true | Enable team accounts |
| enable_account_billing | boolean | NO | true | Enable billing for individual accounts |
| enable_team_account_billing | boolean | NO | true | Enable billing for team accounts |
| billing_provider | billing_provider | NO | 'stripe'::billing_provider | The billing provider to use |

---

## 41. nonces

**Description:** Table for storing one-time tokens with enhanced security and audit features

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | NO | gen_random_uuid() | Primary key |
| client_token | text | NO | null | Client token |
| nonce | text | NO | null | Nonce value |
| user_id | uuid | YES | null | User ID |
| purpose | text | NO | null | Token purpose |
| expires_at | timestamptz | NO | null | Expiration timestamp |
| created_at | timestamptz | NO | now() | Creation timestamp |
| used_at | timestamptz | YES | null | Usage timestamp |
| revoked | boolean | NO | false | Revocation status |
| revoked_reason | text | YES | null | Revocation reason |
| verification_attempts | integer | NO | 0 | Verification attempts |
| last_verification_at | timestamptz | YES | null | Last verification timestamp |
| last_verification_ip | inet | YES | null | Last verification IP |
| last_verification_user_agent | text | YES | null | Last verification user agent |
| metadata | jsonb | YES | '{}'::jsonb | Metadata |
| scopes | text[] | YES | '{}'::text[] | Token scopes |

**Primary Key:** `id`

---

## 42. account_user

**Description:** Account-user relationships

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| user_id | uuid | NO | null | User ID |
| account_id | uuid | NO | null | Account ID |
| account_role | account_role | NO | null | Account role |
| id | uuid | NO | uuid_generate_v4() | Primary key |

**Primary Key:** `id`

---

## 43. profiles_copy

**Description:** Copy of profiles table

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| email | text | NO | null | User email |
| name | text | YES | null | User name |
| workplace | text | YES | null | User workplace |
| created_at | timestamp | YES | now() | Creation timestamp |
| updated_at | timestamp | YES | now() | Last update timestamp |
| fdb_ref | uuid | YES | null | Firebase reference |
| id | uuid | NO | gen_random_uuid() | Primary key |
| topPos | smallint | YES | null | Top position |
| bottomPos | smallint | YES | null | Bottom position |
| leftPos | smallint | YES | null | Left position |
| rightPos | smallint | YES | null | Right position |
| profile_photo | text | YES | null | Profile photo URL |
| user_role | role_status | NO | 'user'::role_status | User role |
| workplace_ref | uuid | YES | null | Workplace reference |
| institution_ref | uuid | YES | null | Institution reference |
| employment_status | text | YES | null | Employment status |

**Primary Key:** `id`

---

## 44. user_emloyement_status

**Description:** User employment status (typo in table name)

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| employment_status | text | YES | null | Employment status |

---

## 45. user_emloyement_statuss

**Description:** User employment status (duplicate with typo)

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| employment_status | text | YES | null | Employment status |

---

## 46. workplace_type

**Description:** Workplace types

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| type | text | YES | null | Workplace type |

---

## 47. vendor_ratings

**Description:** Vendor rating system

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | bigint | NO | null | Primary key (auto-increment) |
| created_at | timestamptz | YES | now() | Creation timestamp |
| rating | double precision | YES | '0'::double precision | Rating value |

**Primary Key:** `id`

---

## 48. _prisma_migrations

**Description:** Prisma migration tracking

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | varchar | NO | null | Migration ID |
| checksum | varchar | NO | null | Migration checksum |
| finished_at | timestamptz | YES | null | Completion timestamp |
| migration_name | varchar | NO | null | Migration name |
| logs | text | YES | null | Migration logs |
| rolled_back_at | timestamptz | YES | null | Rollback timestamp |
| started_at | timestamptz | NO | now() | Start timestamp |
| applied_steps_count | integer | NO | 0 | Applied steps count |

**Primary Key:** `id`

---

## Summary

This database schema supports a comprehensive application with:

- **User Management**: Profiles, accounts, workplaces, and role-based access control
- **Assessment System**: Evaluations, questions, answers, and progress tracking
- **Activity System**: Activities, tasks, and completion tracking
- **Vision Board System**: Vision boards, goals, obstacles, and positioning
- **Billing System**: Subscriptions, orders, billing customers, and credit usage
- **Communication**: Chat system and notifications
- **Security**: Nonces, invitations, and authentication integration

The schema demonstrates a well-structured application with proper relationships, constraints, and data integrity measures. 