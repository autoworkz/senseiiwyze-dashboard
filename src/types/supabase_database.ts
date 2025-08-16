export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.0.1 (cd38da5)"
  }
  public: {
    Tables: {
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Relationships: []
      }
      abilities: {
        Row: {
          data_value: number
          date_updated: string
          domain_source: string
          element_id: string
          lower_ci_bound: number | null
          n: number | null
          not_relevant: string | null
          onetsoc_code: string
          recommend_suppress: string | null
          scale_id: string
          standard_error: number | null
          upper_ci_bound: number | null
        }
        Insert: {
          data_value: number
          date_updated: string
          domain_source: string
          element_id: string
          lower_ci_bound?: number | null
          n?: number | null
          not_relevant?: string | null
          onetsoc_code: string
          recommend_suppress?: string | null
          scale_id: string
          standard_error?: number | null
          upper_ci_bound?: number | null
        }
        Update: {
          data_value?: number
          date_updated?: string
          domain_source?: string
          element_id?: string
          lower_ci_bound?: number | null
          n?: number | null
          not_relevant?: string | null
          onetsoc_code?: string
          recommend_suppress?: string | null
          scale_id?: string
          standard_error?: number | null
          upper_ci_bound?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "abilities_element_id_fkey"
            columns: ["element_id"]
            isOneToOne: false
            referencedRelation: "content_model_reference"
            referencedColumns: ["element_id"]
          },
          {
            foreignKeyName: "abilities_scale_id_fkey"
            columns: ["scale_id"]
            isOneToOne: false
            referencedRelation: "scales_reference"
            referencedColumns: ["scale_id"]
          },
        ]
      }
      abilities_to_work_activities: {
        Row: {
          abilities_element_id: string
          work_activities_element_id: string
        }
        Insert: {
          abilities_element_id: string
          work_activities_element_id: string
        }
        Update: {
          abilities_element_id?: string
          work_activities_element_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "abilities_to_work_activities_abilities_element_id_fkey"
            columns: ["abilities_element_id"]
            isOneToOne: false
            referencedRelation: "content_model_reference"
            referencedColumns: ["element_id"]
          },
          {
            foreignKeyName: "abilities_to_work_activities_work_activities_element_id_fkey"
            columns: ["work_activities_element_id"]
            isOneToOne: false
            referencedRelation: "content_model_reference"
            referencedColumns: ["element_id"]
          },
        ]
      }
      abilities_to_work_context: {
        Row: {
          abilities_element_id: string
          work_context_element_id: string
        }
        Insert: {
          abilities_element_id: string
          work_context_element_id: string
        }
        Update: {
          abilities_element_id?: string
          work_context_element_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "abilities_to_work_context_abilities_element_id_fkey"
            columns: ["abilities_element_id"]
            isOneToOne: false
            referencedRelation: "content_model_reference"
            referencedColumns: ["element_id"]
          },
          {
            foreignKeyName: "abilities_to_work_context_work_context_element_id_fkey"
            columns: ["work_context_element_id"]
            isOneToOne: false
            referencedRelation: "content_model_reference"
            referencedColumns: ["element_id"]
          },
        ]
      }
      account: {
        Row: {
          access_token: string | null
          access_token_expires_at: string | null
          account_id: string
          created_at: string
          id: string
          id_token: string | null
          password: string | null
          provider_id: string
          refresh_token: string | null
          refresh_token_expires_at: string | null
          scope: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          access_token_expires_at?: string | null
          account_id: string
          created_at: string
          id: string
          id_token?: string | null
          password?: string | null
          provider_id: string
          refresh_token?: string | null
          refresh_token_expires_at?: string | null
          scope?: string | null
          updated_at: string
          user_id: string
        }
        Update: {
          access_token?: string | null
          access_token_expires_at?: string | null
          account_id?: string
          created_at?: string
          id?: string
          id_token?: string | null
          password?: string | null
          provider_id?: string
          refresh_token?: string | null
          refresh_token_expires_at?: string | null
          scope?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      account_user: {
        Row: {
          account_id: string
          account_role: Database["public"]["Enums"]["account_role"]
          id: string
          user_id: string
        }
        Insert: {
          account_id: string
          account_role: Database["public"]["Enums"]["account_role"]
          id?: string
          user_id: string
        }
        Update: {
          account_id?: string
          account_role?: Database["public"]["Enums"]["account_role"]
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_user_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "workplaces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "account_user_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      accounts: {
        Row: {
          created_at: string | null
          created_by: string | null
          email: string | null
          id: string
          is_personal_account: boolean
          name: string
          picture_url: string | null
          primary_owner_user_id: string
          public_data: Json
          slug: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          is_personal_account?: boolean
          name: string
          picture_url?: string | null
          primary_owner_user_id?: string
          public_data?: Json
          slug?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          is_personal_account?: boolean
          name?: string
          picture_url?: string | null
          primary_owner_user_id?: string
          public_data?: Json
          slug?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      accounts_memberships: {
        Row: {
          account_id: string
          account_role: string
          created_at: string
          created_by: string | null
          updated_at: string
          updated_by: string | null
          user_id: string
        }
        Insert: {
          account_id: string
          account_role: string
          created_at?: string
          created_by?: string | null
          updated_at?: string
          updated_by?: string | null
          user_id: string
        }
        Update: {
          account_id?: string
          account_role?: string
          created_at?: string
          created_by?: string | null
          updated_at?: string
          updated_by?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_memberships_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_memberships_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_account_workspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_memberships_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_memberships_account_role_fkey"
            columns: ["account_role"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["name"]
          },
        ]
      }
      activities: {
        Row: {
          category_id: number | null
          created_at: string | null
          description: string | null
          enabled: boolean
          featured: boolean
          id: string
          image_url: string | null
          meta_data: Json | null
          name: string
          subcategory: string | null
          thumbnail_url: string | null
        }
        Insert: {
          category_id?: number | null
          created_at?: string | null
          description?: string | null
          enabled: boolean
          featured?: boolean
          id?: string
          image_url?: string | null
          meta_data?: Json | null
          name: string
          subcategory?: string | null
          thumbnail_url?: string | null
        }
        Update: {
          category_id?: number | null
          created_at?: string | null
          description?: string | null
          enabled?: boolean
          featured?: boolean
          id?: string
          image_url?: string | null
          meta_data?: Json | null
          name?: string
          subcategory?: string | null
          thumbnail_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activities_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_progress: {
        Row: {
          activity_id: string
          current_task_order: number
          id: string
          onboarding_completed: boolean | null
          profile_id: string
          score: number | null
          total_score: number | null
        }
        Insert: {
          activity_id: string
          current_task_order?: number
          id?: string
          onboarding_completed?: boolean | null
          profile_id: string
          score?: number | null
          total_score?: number | null
        }
        Update: {
          activity_id?: string
          current_task_order?: number
          id?: string
          onboarding_completed?: boolean | null
          profile_id?: string
          score?: number | null
          total_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_progress_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_progress_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      answers: {
        Row: {
          answered_at: string
          assessment_id: string | null
          evaluation_id: string | null
          id: number
          question_id: number
          rating: number
          response: Json | null
          user_id: string
        }
        Insert: {
          answered_at?: string
          assessment_id?: string | null
          evaluation_id?: string | null
          id?: number
          question_id: number
          rating: number
          response?: Json | null
          user_id: string
        }
        Update: {
          answered_at?: string
          assessment_id?: string | null
          evaluation_id?: string | null
          id?: number
          question_id?: number
          rating?: number
          response?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "answers_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answers_evaluation_id_fkey"
            columns: ["evaluation_id"]
            isOneToOne: false
            referencedRelation: "evaluations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      assessments: {
        Row: {
          cover_url: string | null
          created_at: string | null
          description: string
          estimated_time: string | null
          id: string
          metadata: Json
          results_schema: Json | null
          strategy: Json | null
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          cover_url?: string | null
          created_at?: string | null
          description: string
          estimated_time?: string | null
          id?: string
          metadata?: Json
          results_schema?: Json | null
          strategy?: Json | null
          title: string
          type?: string
          updated_at?: string | null
        }
        Update: {
          cover_url?: string | null
          created_at?: string | null
          description?: string
          estimated_time?: string | null
          id?: string
          metadata?: Json
          results_schema?: Json | null
          strategy?: Json | null
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      ba_accounts: {
        Row: {
          access_token: string | null
          access_token_expires_at: string | null
          account_id: string
          created_at: string
          id: string
          id_token: string | null
          password: string | null
          provider_id: string
          refresh_token: string | null
          refresh_token_expires_at: string | null
          scope: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          access_token_expires_at?: string | null
          account_id: string
          created_at: string
          id: string
          id_token?: string | null
          password?: string | null
          provider_id: string
          refresh_token?: string | null
          refresh_token_expires_at?: string | null
          scope?: string | null
          updated_at: string
          user_id: string
        }
        Update: {
          access_token?: string | null
          access_token_expires_at?: string | null
          account_id?: string
          created_at?: string
          id?: string
          id_token?: string | null
          password?: string | null
          provider_id?: string
          refresh_token?: string | null
          refresh_token_expires_at?: string | null
          scope?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ba_accounts_user_id_ba_users_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "ba_users"
            referencedColumns: ["id"]
          },
        ]
      }
      ba_apikeys: {
        Row: {
          created_at: string
          enabled: boolean | null
          expires_at: string | null
          id: string
          key: string
          last_refill_at: string | null
          last_request: string | null
          metadata: string | null
          name: string | null
          permissions: string | null
          prefix: string | null
          rate_limit_enabled: boolean | null
          rate_limit_max: number | null
          rate_limit_time_window: number | null
          refill_amount: number | null
          refill_interval: number | null
          remaining: number | null
          request_count: number | null
          start: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at: string
          enabled?: boolean | null
          expires_at?: string | null
          id: string
          key: string
          last_refill_at?: string | null
          last_request?: string | null
          metadata?: string | null
          name?: string | null
          permissions?: string | null
          prefix?: string | null
          rate_limit_enabled?: boolean | null
          rate_limit_max?: number | null
          rate_limit_time_window?: number | null
          refill_amount?: number | null
          refill_interval?: number | null
          remaining?: number | null
          request_count?: number | null
          start?: string | null
          updated_at: string
          user_id: string
        }
        Update: {
          created_at?: string
          enabled?: boolean | null
          expires_at?: string | null
          id?: string
          key?: string
          last_refill_at?: string | null
          last_request?: string | null
          metadata?: string | null
          name?: string | null
          permissions?: string | null
          prefix?: string | null
          rate_limit_enabled?: boolean | null
          rate_limit_max?: number | null
          rate_limit_time_window?: number | null
          refill_amount?: number | null
          refill_interval?: number | null
          remaining?: number | null
          request_count?: number | null
          start?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ba_apikeys_user_id_ba_users_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "ba_users"
            referencedColumns: ["id"]
          },
        ]
      }
      ba_credit_balance: {
        Row: {
          bonus_credits: number
          id: string
          monthly_allocation: number
          total_credits: number
          updated_at: string
          used_credits: number
          user_id: string
        }
        Insert: {
          bonus_credits?: number
          id?: string
          monthly_allocation?: number
          total_credits?: number
          updated_at?: string
          used_credits?: number
          user_id: string
        }
        Update: {
          bonus_credits?: number
          id?: string
          monthly_allocation?: number
          total_credits?: number
          updated_at?: string
          used_credits?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ba_credit_balance_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "ba_users"
            referencedColumns: ["id"]
          },
        ]
      }
      ba_credit_transactions: {
        Row: {
          amount: number
          balance: number
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          balance: number
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          balance?: number
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ba_credit_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "ba_users"
            referencedColumns: ["id"]
          },
        ]
      }
      ba_invitations: {
        Row: {
          email: string
          expires_at: string
          id: string
          inviter_id: string
          organization_id: string
          role: string | null
          status: string
        }
        Insert: {
          email: string
          expires_at: string
          id: string
          inviter_id: string
          organization_id: string
          role?: string | null
          status?: string
        }
        Update: {
          email?: string
          expires_at?: string
          id?: string
          inviter_id?: string
          organization_id?: string
          role?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "ba_invitations_inviter_id_ba_users_id_fk"
            columns: ["inviter_id"]
            isOneToOne: false
            referencedRelation: "ba_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ba_invitations_organization_id_ba_organizations_id_fk"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "ba_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      ba_jwkss: {
        Row: {
          created_at: string
          id: string
          private_key: string
          public_key: string
        }
        Insert: {
          created_at: string
          id: string
          private_key: string
          public_key: string
        }
        Update: {
          created_at?: string
          id?: string
          private_key?: string
          public_key?: string
        }
        Relationships: []
      }
      ba_members: {
        Row: {
          created_at: string
          id: string
          organization_id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at: string
          id: string
          organization_id: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ba_members_organization_id_ba_organizations_id_fk"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "ba_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ba_members_user_id_ba_users_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "ba_users"
            referencedColumns: ["id"]
          },
        ]
      }
      ba_organizations: {
        Row: {
          created_at: string
          id: string
          logo: string | null
          metadata: string | null
          name: string
          slug: string | null
        }
        Insert: {
          created_at: string
          id: string
          logo?: string | null
          metadata?: string | null
          name: string
          slug?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          logo?: string | null
          metadata?: string | null
          name?: string
          slug?: string | null
        }
        Relationships: []
      }
      ba_sessions: {
        Row: {
          active_organization_id: string | null
          created_at: string
          expires_at: string
          id: string
          impersonated_by: string | null
          ip_address: string | null
          token: string
          updated_at: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          active_organization_id?: string | null
          created_at: string
          expires_at: string
          id: string
          impersonated_by?: string | null
          ip_address?: string | null
          token: string
          updated_at: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          active_organization_id?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          impersonated_by?: string | null
          ip_address?: string | null
          token?: string
          updated_at?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ba_sessions_user_id_ba_users_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "ba_users"
            referencedColumns: ["id"]
          },
        ]
      }
      ba_sso_providers: {
        Row: {
          domain: string
          id: string
          issuer: string
          oidc_config: string | null
          organization_id: string | null
          provider_id: string
          saml_config: string | null
          user_id: string | null
        }
        Insert: {
          domain: string
          id: string
          issuer: string
          oidc_config?: string | null
          organization_id?: string | null
          provider_id: string
          saml_config?: string | null
          user_id?: string | null
        }
        Update: {
          domain?: string
          id?: string
          issuer?: string
          oidc_config?: string | null
          organization_id?: string | null
          provider_id?: string
          saml_config?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ba_sso_providers_user_id_ba_users_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "ba_users"
            referencedColumns: ["id"]
          },
        ]
      }
      ba_two_factors: {
        Row: {
          backup_codes: string
          id: string
          secret: string
          user_id: string
        }
        Insert: {
          backup_codes: string
          id: string
          secret: string
          user_id: string
        }
        Update: {
          backup_codes?: string
          id?: string
          secret?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ba_two_factors_user_id_ba_users_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "ba_users"
            referencedColumns: ["id"]
          },
        ]
      }
      ba_usage_summary: {
        Row: {
          ai_interactions: number
          api_calls: number
          assessments_taken: number
          id: string
          month: string
          reports_generated: number
          total_credits: number
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_interactions?: number
          api_calls?: number
          assessments_taken?: number
          id?: string
          month: string
          reports_generated?: number
          total_credits?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_interactions?: number
          api_calls?: number
          assessments_taken?: number
          id?: string
          month?: string
          reports_generated?: number
          total_credits?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ba_usage_summary_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "ba_users"
            referencedColumns: ["id"]
          },
        ]
      }
      ba_usage_tracking: {
        Row: {
          created_at: string
          credits: number
          feature: string
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          created_at?: string
          credits?: number
          feature: string
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          created_at?: string
          credits?: number
          feature?: string
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ba_usage_tracking_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "ba_users"
            referencedColumns: ["id"]
          },
        ]
      }
      ba_users: {
        Row: {
          ban_expires: string | null
          ban_reason: string | null
          banned: boolean | null
          created_at: string
          display_username: string | null
          email: string
          email_verified: boolean
          id: string
          image: string | null
          is_anonymous: boolean | null
          name: string
          profile_id: string | null
          role: string | null
          two_factor_enabled: boolean | null
          updated_at: string
          username: string | null
        }
        Insert: {
          ban_expires?: string | null
          ban_reason?: string | null
          banned?: boolean | null
          created_at: string
          display_username?: string | null
          email: string
          email_verified?: boolean
          id: string
          image?: string | null
          is_anonymous?: boolean | null
          name: string
          profile_id?: string | null
          role?: string | null
          two_factor_enabled?: boolean | null
          updated_at: string
          username?: string | null
        }
        Update: {
          ban_expires?: string | null
          ban_reason?: string | null
          banned?: boolean | null
          created_at?: string
          display_username?: string | null
          email?: string
          email_verified?: boolean
          id?: string
          image?: string | null
          is_anonymous?: boolean | null
          name?: string
          profile_id?: string | null
          role?: string | null
          two_factor_enabled?: boolean | null
          updated_at?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ba_users_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ba_verifications: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          identifier: string
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id: string
          identifier: string
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          identifier?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      basic_interests_to_riasec: {
        Row: {
          basic_interests_element_id: string
          riasec_element_id: string
        }
        Insert: {
          basic_interests_element_id: string
          riasec_element_id: string
        }
        Update: {
          basic_interests_element_id?: string
          riasec_element_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "basic_interests_to_riasec_basic_interests_element_id_fkey"
            columns: ["basic_interests_element_id"]
            isOneToOne: false
            referencedRelation: "content_model_reference"
            referencedColumns: ["element_id"]
          },
          {
            foreignKeyName: "basic_interests_to_riasec_riasec_element_id_fkey"
            columns: ["riasec_element_id"]
            isOneToOne: false
            referencedRelation: "content_model_reference"
            referencedColumns: ["element_id"]
          },
        ]
      }
      billing_customers: {
        Row: {
          account_id: string
          customer_id: string
          email: string | null
          id: number
          provider: Database["public"]["Enums"]["billing_provider"]
        }
        Insert: {
          account_id: string
          customer_id: string
          email?: string | null
          id?: number
          provider: Database["public"]["Enums"]["billing_provider"]
        }
        Update: {
          account_id?: string
          customer_id?: string
          email?: string | null
          id?: number
          provider?: Database["public"]["Enums"]["billing_provider"]
        }
        Relationships: [
          {
            foreignKeyName: "billing_customers_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billing_customers_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_account_workspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billing_customers_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          id: number
          name: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          account_id: string
          chat_id: number
          content: string
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["chat_role"]
        }
        Insert: {
          account_id: string
          chat_id?: number
          content: string
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["chat_role"]
        }
        Update: {
          account_id?: string
          chat_id?: number
          content?: string
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["chat_role"]
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_account_workspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
        ]
      }
      chats: {
        Row: {
          account_id: string
          created_at: string | null
          id: number
          name: string
          reference_id: string
          settings: Json
        }
        Insert: {
          account_id: string
          created_at?: string | null
          id?: number
          name: string
          reference_id: string
          settings?: Json
        }
        Update: {
          account_id?: string
          created_at?: string | null
          id?: number
          name?: string
          reference_id?: string
          settings?: Json
        }
        Relationships: [
          {
            foreignKeyName: "chats_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chats_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_account_workspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chats_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      config: {
        Row: {
          billing_provider: Database["public"]["Enums"]["billing_provider"]
          enable_account_billing: boolean
          enable_team_account_billing: boolean
          enable_team_accounts: boolean
        }
        Insert: {
          billing_provider?: Database["public"]["Enums"]["billing_provider"]
          enable_account_billing?: boolean
          enable_team_account_billing?: boolean
          enable_team_accounts?: boolean
        }
        Update: {
          billing_provider?: Database["public"]["Enums"]["billing_provider"]
          enable_account_billing?: boolean
          enable_team_account_billing?: boolean
          enable_team_accounts?: boolean
        }
        Relationships: []
      }
      constants: {
        Row: {
          created_at: string
          id: string
          key: string
          value: Json | null
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          value?: Json | null
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          value?: Json | null
        }
        Relationships: []
      }
      content_model_reference: {
        Row: {
          description: string
          element_id: string
          element_name: string
        }
        Insert: {
          description: string
          element_id: string
          element_name: string
        }
        Update: {
          description?: string
          element_id?: string
          element_name?: string
        }
        Relationships: []
      }
      credits_usage: {
        Row: {
          account_id: string
          id: number
          remaining_credits: number
        }
        Insert: {
          account_id: string
          id?: number
          remaining_credits?: number
        }
        Update: {
          account_id?: string
          id?: number
          remaining_credits?: number
        }
        Relationships: [
          {
            foreignKeyName: "credits_usage_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credits_usage_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_account_workspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credits_usage_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      dwa_reference: {
        Row: {
          dwa_id: string
          dwa_title: string
          element_id: string
          iwa_id: string
        }
        Insert: {
          dwa_id: string
          dwa_title: string
          element_id: string
          iwa_id: string
        }
        Update: {
          dwa_id?: string
          dwa_title?: string
          element_id?: string
          iwa_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dwa_reference_element_id_fkey"
            columns: ["element_id"]
            isOneToOne: false
            referencedRelation: "content_model_reference"
            referencedColumns: ["element_id"]
          },
          {
            foreignKeyName: "dwa_reference_iwa_id_fkey"
            columns: ["iwa_id"]
            isOneToOne: false
            referencedRelation: "iwa_reference"
            referencedColumns: ["iwa_id"]
          },
        ]
      }
      education_training_experience: {
        Row: {
          category: number | null
          data_value: number
          date_updated: string
          domain_source: string
          element_id: string
          lower_ci_bound: number | null
          n: number | null
          onetsoc_code: string
          recommend_suppress: string | null
          scale_id: string
          standard_error: number | null
          upper_ci_bound: number | null
        }
        Insert: {
          category?: number | null
          data_value: number
          date_updated: string
          domain_source: string
          element_id: string
          lower_ci_bound?: number | null
          n?: number | null
          onetsoc_code: string
          recommend_suppress?: string | null
          scale_id: string
          standard_error?: number | null
          upper_ci_bound?: number | null
        }
        Update: {
          category?: number | null
          data_value?: number
          date_updated?: string
          domain_source?: string
          element_id?: string
          lower_ci_bound?: number | null
          n?: number | null
          onetsoc_code?: string
          recommend_suppress?: string | null
          scale_id?: string
          standard_error?: number | null
          upper_ci_bound?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "education_training_experience_element_id_fkey"
            columns: ["element_id"]
            isOneToOne: false
            referencedRelation: "content_model_reference"
            referencedColumns: ["element_id"]
          },
          {
            foreignKeyName: "education_training_experience_element_id_scale_id_category_fkey"
            columns: ["element_id", "scale_id", "category"]
            isOneToOne: false
            referencedRelation: "ete_categories"
            referencedColumns: ["element_id", "scale_id", "category"]
          },
          {
            foreignKeyName: "education_training_experience_scale_id_fkey"
            columns: ["scale_id"]
            isOneToOne: false
            referencedRelation: "scales_reference"
            referencedColumns: ["scale_id"]
          },
        ]
      }
      ete_categories: {
        Row: {
          category: number
          category_description: string
          element_id: string
          scale_id: string
        }
        Insert: {
          category: number
          category_description: string
          element_id: string
          scale_id: string
        }
        Update: {
          category?: number
          category_description?: string
          element_id?: string
          scale_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ete_categories_element_id_fkey"
            columns: ["element_id"]
            isOneToOne: false
            referencedRelation: "content_model_reference"
            referencedColumns: ["element_id"]
          },
          {
            foreignKeyName: "ete_categories_scale_id_fkey"
            columns: ["scale_id"]
            isOneToOne: false
            referencedRelation: "scales_reference"
            referencedColumns: ["scale_id"]
          },
        ]
      }
      evaluations: {
        Row: {
          assessment_id: string | null
          created_at: string
          id: string
          is_completed: boolean
          results: Json | null
          user_id: string
          workplace_id: string
        }
        Insert: {
          assessment_id?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean
          results?: Json | null
          user_id: string
          workplace_id: string
        }
        Update: {
          assessment_id?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean
          results?: Json | null
          user_id?: string
          workplace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "evaluations_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evaluations_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evaluations_workplace_id_fkey"
            columns: ["workplace_id"]
            isOneToOne: false
            referencedRelation: "workplaces"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_growth_areas: {
        Row: {
          area: string
          exam_id: number | null
          id: number
        }
        Insert: {
          area: string
          exam_id?: number | null
          id?: number
        }
        Update: {
          area?: string
          exam_id?: number | null
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "exam_growth_areas_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "personality_exams"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_strengths: {
        Row: {
          exam_id: number | null
          id: number
          strength: string
        }
        Insert: {
          exam_id?: number | null
          id?: number
          strength: string
        }
        Update: {
          exam_id?: number | null
          id?: number
          strength?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_strengths_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "personality_exams"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_traits: {
        Row: {
          exam_id: number | null
          id: number
          trait: string
          value: number
        }
        Insert: {
          exam_id?: number | null
          id?: number
          trait: string
          value: number
        }
        Update: {
          exam_id?: number | null
          id?: number
          trait?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "exam_traits_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "personality_exams"
            referencedColumns: ["id"]
          },
        ]
      }
      game_info: {
        Row: {
          created_at: string | null
          durations: number[] | null
          game_id: string
          id: string
          levels_completed: boolean[] | null
          onboarding_completed: boolean | null
          profile_id: string
        }
        Insert: {
          created_at?: string | null
          durations?: number[] | null
          game_id: string
          id?: string
          levels_completed?: boolean[] | null
          onboarding_completed?: boolean | null
          profile_id: string
        }
        Update: {
          created_at?: string | null
          durations?: number[] | null
          game_id?: string
          id?: string
          levels_completed?: boolean[] | null
          onboarding_completed?: boolean | null
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_info_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      game_tasks: {
        Row: {
          activity_id: string
          description: string | null
          difficulty_level: Database["public"]["Enums"]["difficulty"] | null
          id: string
          max_score: number
          name: string
          order: number | null
        }
        Insert: {
          activity_id: string
          description?: string | null
          difficulty_level?: Database["public"]["Enums"]["difficulty"] | null
          id?: string
          max_score?: number
          name: string
          order?: number | null
        }
        Update: {
          activity_id?: string
          description?: string | null
          difficulty_level?: Database["public"]["Enums"]["difficulty"] | null
          id?: string
          max_score?: number
          name?: string
          order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          bottom_pos: number | null
          cluster_class: string | null
          createdAt: string
          description: string
          id: string
          left_pos: number | null
          name: string
          right_pos: number | null
          size_id: string | null
          top_pos: number | null
          updatedAt: string
          url: string
          vision_id: string
        }
        Insert: {
          bottom_pos?: number | null
          cluster_class?: string | null
          createdAt?: string
          description: string
          id?: string
          left_pos?: number | null
          name: string
          right_pos?: number | null
          size_id?: string | null
          top_pos?: number | null
          updatedAt?: string
          url: string
          vision_id: string
        }
        Update: {
          bottom_pos?: number | null
          cluster_class?: string | null
          createdAt?: string
          description?: string
          id?: string
          left_pos?: number | null
          name?: string
          right_pos?: number | null
          size_id?: string | null
          top_pos?: number | null
          updatedAt?: string
          url?: string
          vision_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "goals_size_id_fkey"
            columns: ["size_id"]
            isOneToOne: false
            referencedRelation: "sizes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goals_vision_id_fkey"
            columns: ["vision_id"]
            isOneToOne: false
            referencedRelation: "vision_boards"
            referencedColumns: ["id"]
          },
        ]
      }
      image_search: {
        Row: {
          id: string
          search_term: string
          url: string
        }
        Insert: {
          id: string
          search_term: string
          url: string
        }
        Update: {
          id?: string
          search_term?: string
          url?: string
        }
        Relationships: []
      }
      interests: {
        Row: {
          data_value: number
          date_updated: string
          domain_source: string
          element_id: string
          onetsoc_code: string
          scale_id: string
        }
        Insert: {
          data_value: number
          date_updated: string
          domain_source: string
          element_id: string
          onetsoc_code: string
          scale_id: string
        }
        Update: {
          data_value?: number
          date_updated?: string
          domain_source?: string
          element_id?: string
          onetsoc_code?: string
          scale_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "interests_element_id_fkey"
            columns: ["element_id"]
            isOneToOne: false
            referencedRelation: "content_model_reference"
            referencedColumns: ["element_id"]
          },
          {
            foreignKeyName: "interests_scale_id_fkey"
            columns: ["scale_id"]
            isOneToOne: false
            referencedRelation: "scales_reference"
            referencedColumns: ["scale_id"]
          },
        ]
      }
      interests_illus_activities: {
        Row: {
          activity: string
          element_id: string
          interest_type: string
        }
        Insert: {
          activity: string
          element_id: string
          interest_type: string
        }
        Update: {
          activity?: string
          element_id?: string
          interest_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "interests_illus_activities_element_id_fkey"
            columns: ["element_id"]
            isOneToOne: false
            referencedRelation: "content_model_reference"
            referencedColumns: ["element_id"]
          },
        ]
      }
      interests_illus_occupations: {
        Row: {
          element_id: string
          interest_type: string
          onetsoc_code: string
        }
        Insert: {
          element_id: string
          interest_type: string
          onetsoc_code: string
        }
        Update: {
          element_id?: string
          interest_type?: string
          onetsoc_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "interests_illus_occupations_element_id_fkey"
            columns: ["element_id"]
            isOneToOne: false
            referencedRelation: "content_model_reference"
            referencedColumns: ["element_id"]
          },
        ]
      }
      invitations: {
        Row: {
          account_id: string
          created_at: string
          email: string
          expires_at: string
          id: number
          invite_token: string
          invited_by: string
          role: string
          updated_at: string
        }
        Insert: {
          account_id: string
          created_at?: string
          email: string
          expires_at?: string
          id?: number
          invite_token: string
          invited_by: string
          role: string
          updated_at?: string
        }
        Update: {
          account_id?: string
          created_at?: string
          email?: string
          expires_at?: string
          id?: number
          invite_token?: string
          invited_by?: string
          role?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invitations_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "workplaces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_account_id_fkey1"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_account_id_fkey1"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_account_workspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_account_id_fkey1"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_role_fkey"
            columns: ["role"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["name"]
          },
        ]
      }
      iwa_reference: {
        Row: {
          element_id: string
          iwa_id: string
          iwa_title: string
        }
        Insert: {
          element_id: string
          iwa_id: string
          iwa_title: string
        }
        Update: {
          element_id?: string
          iwa_id?: string
          iwa_title?: string
        }
        Relationships: [
          {
            foreignKeyName: "iwa_reference_element_id_fkey"
            columns: ["element_id"]
            isOneToOne: false
            referencedRelation: "content_model_reference"
            referencedColumns: ["element_id"]
          },
        ]
      }
      job_zone_reference: {
        Row: {
          education: string
          examples: string
          experience: string
          job_training: string
          job_zone: number
          name: string
          svp_range: string
        }
        Insert: {
          education: string
          examples: string
          experience: string
          job_training: string
          job_zone: number
          name: string
          svp_range: string
        }
        Update: {
          education?: string
          examples?: string
          experience?: string
          job_training?: string
          job_zone?: number
          name?: string
          svp_range?: string
        }
        Relationships: []
      }
      job_zones: {
        Row: {
          date_updated: string
          domain_source: string
          job_zone: number
          onetsoc_code: string
        }
        Insert: {
          date_updated: string
          domain_source: string
          job_zone: number
          onetsoc_code: string
        }
        Update: {
          date_updated?: string
          domain_source?: string
          job_zone?: number
          onetsoc_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_zones_job_zone_fkey"
            columns: ["job_zone"]
            isOneToOne: false
            referencedRelation: "job_zone_reference"
            referencedColumns: ["job_zone"]
          },
        ]
      }
      knowledge: {
        Row: {
          data_value: number
          date_updated: string
          domain_source: string
          element_id: string
          lower_ci_bound: number | null
          n: number | null
          not_relevant: string | null
          onetsoc_code: string
          recommend_suppress: string | null
          scale_id: string
          standard_error: number | null
          upper_ci_bound: number | null
        }
        Insert: {
          data_value: number
          date_updated: string
          domain_source: string
          element_id: string
          lower_ci_bound?: number | null
          n?: number | null
          not_relevant?: string | null
          onetsoc_code: string
          recommend_suppress?: string | null
          scale_id: string
          standard_error?: number | null
          upper_ci_bound?: number | null
        }
        Update: {
          data_value?: number
          date_updated?: string
          domain_source?: string
          element_id?: string
          lower_ci_bound?: number | null
          n?: number | null
          not_relevant?: string | null
          onetsoc_code?: string
          recommend_suppress?: string | null
          scale_id?: string
          standard_error?: number | null
          upper_ci_bound?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_element_id_fkey"
            columns: ["element_id"]
            isOneToOne: false
            referencedRelation: "content_model_reference"
            referencedColumns: ["element_id"]
          },
          {
            foreignKeyName: "knowledge_scale_id_fkey"
            columns: ["scale_id"]
            isOneToOne: false
            referencedRelation: "scales_reference"
            referencedColumns: ["scale_id"]
          },
        ]
      }
      lca_invitations: {
        Row: {
          account_id: string
          account_role: Database["public"]["Enums"]["account_role"]
          account_team_name: string | null
          created_at: string | null
          id: string
          invitation_type: Database["public"]["Enums"]["invitation_type"]
          invited_by_user_id: string
          invitee_email: string
          message: string | null
          token: string
          updated_at: string | null
        }
        Insert: {
          account_id: string
          account_role: Database["public"]["Enums"]["account_role"]
          account_team_name?: string | null
          created_at?: string | null
          id?: string
          invitation_type: Database["public"]["Enums"]["invitation_type"]
          invited_by_user_id: string
          invitee_email: string
          message?: string | null
          token?: string
          updated_at?: string | null
        }
        Update: {
          account_id?: string
          account_role?: Database["public"]["Enums"]["account_role"]
          account_team_name?: string | null
          created_at?: string | null
          id?: string
          invitation_type?: Database["public"]["Enums"]["invitation_type"]
          invited_by_user_id?: string
          invitee_email?: string
          message?: string | null
          token?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invitations_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "workplaces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_invited_by_user_id_fkey"
            columns: ["invited_by_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      level_onboarding: {
        Row: {
          created_at: string
          game_id: string
          id: string
          level_no: number
          onboarding_gif: string | null
          onboarding_text: string | null
        }
        Insert: {
          created_at?: string
          game_id: string
          id?: string
          level_no: number
          onboarding_gif?: string | null
          onboarding_text?: string | null
        }
        Update: {
          created_at?: string
          game_id?: string
          id?: string
          level_no?: number
          onboarding_gif?: string | null
          onboarding_text?: string | null
        }
        Relationships: []
      }
      level_scale_anchors: {
        Row: {
          anchor_description: string
          anchor_value: number
          element_id: string
          scale_id: string
        }
        Insert: {
          anchor_description: string
          anchor_value: number
          element_id: string
          scale_id: string
        }
        Update: {
          anchor_description?: string
          anchor_value?: number
          element_id?: string
          scale_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "level_scale_anchors_element_id_fkey"
            columns: ["element_id"]
            isOneToOne: false
            referencedRelation: "content_model_reference"
            referencedColumns: ["element_id"]
          },
          {
            foreignKeyName: "level_scale_anchors_scale_id_fkey"
            columns: ["scale_id"]
            isOneToOne: false
            referencedRelation: "scales_reference"
            referencedColumns: ["scale_id"]
          },
        ]
      }
      nonces: {
        Row: {
          client_token: string
          created_at: string
          expires_at: string
          id: string
          last_verification_at: string | null
          last_verification_ip: unknown | null
          last_verification_user_agent: string | null
          metadata: Json | null
          nonce: string
          purpose: string
          revoked: boolean
          revoked_reason: string | null
          scopes: string[] | null
          used_at: string | null
          user_id: string | null
          verification_attempts: number
        }
        Insert: {
          client_token: string
          created_at?: string
          expires_at: string
          id?: string
          last_verification_at?: string | null
          last_verification_ip?: unknown | null
          last_verification_user_agent?: string | null
          metadata?: Json | null
          nonce: string
          purpose: string
          revoked?: boolean
          revoked_reason?: string | null
          scopes?: string[] | null
          used_at?: string | null
          user_id?: string | null
          verification_attempts?: number
        }
        Update: {
          client_token?: string
          created_at?: string
          expires_at?: string
          id?: string
          last_verification_at?: string | null
          last_verification_ip?: unknown | null
          last_verification_user_agent?: string | null
          metadata?: Json | null
          nonce?: string
          purpose?: string
          revoked?: boolean
          revoked_reason?: string | null
          scopes?: string[] | null
          used_at?: string | null
          user_id?: string | null
          verification_attempts?: number
        }
        Relationships: []
      }
      notifications: {
        Row: {
          account_id: string
          body: string
          channel: Database["public"]["Enums"]["notification_channel"]
          created_at: string
          dismissed: boolean
          expires_at: string | null
          id: number
          link: string | null
          type: Database["public"]["Enums"]["notification_type"]
        }
        Insert: {
          account_id: string
          body: string
          channel?: Database["public"]["Enums"]["notification_channel"]
          created_at?: string
          dismissed?: boolean
          expires_at?: string | null
          id?: never
          link?: string | null
          type?: Database["public"]["Enums"]["notification_type"]
        }
        Update: {
          account_id?: string
          body?: string
          channel?: Database["public"]["Enums"]["notification_channel"]
          created_at?: string
          dismissed?: boolean
          expires_at?: string | null
          id?: never
          link?: string | null
          type?: Database["public"]["Enums"]["notification_type"]
        }
        Relationships: [
          {
            foreignKeyName: "notifications_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_account_workspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      obstacles: {
        Row: {
          createdAt: string | null
          goal_id: string | null
          id: string
          is_completed: boolean | null
          name: string | null
          updatedAt: string | null
          vision_id: string | null
        }
        Insert: {
          createdAt?: string | null
          goal_id?: string | null
          id?: string
          is_completed?: boolean | null
          name?: string | null
          updatedAt?: string | null
          vision_id?: string | null
        }
        Update: {
          createdAt?: string | null
          goal_id?: string | null
          id?: string
          is_completed?: boolean | null
          name?: string | null
          updatedAt?: string | null
          vision_id?: string | null
        }
        Relationships: []
      }
      onboarding_history: {
        Row: {
          created_at: string
          id: string
          level_onboarding_id: string
          profile_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          level_onboarding_id: string
          profile_id: string
        }
        Update: {
          created_at?: string
          id?: string
          level_onboarding_id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_history_level_onboarding_id_fkey"
            columns: ["level_onboarding_id"]
            isOneToOne: false
            referencedRelation: "level_onboarding"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "onboarding_history_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          price_amount: number | null
          product_id: string
          quantity: number
          updated_at: string
          variant_id: string
        }
        Insert: {
          created_at?: string
          id: string
          order_id: string
          price_amount?: number | null
          product_id: string
          quantity?: number
          updated_at?: string
          variant_id: string
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          price_amount?: number | null
          product_id?: string
          quantity?: number
          updated_at?: string
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          account_id: string
          billing_customer_id: number
          billing_provider: Database["public"]["Enums"]["billing_provider"]
          created_at: string
          currency: string
          id: string
          status: Database["public"]["Enums"]["payment_status"]
          total_amount: number
          updated_at: string
        }
        Insert: {
          account_id: string
          billing_customer_id: number
          billing_provider: Database["public"]["Enums"]["billing_provider"]
          created_at?: string
          currency: string
          id: string
          status: Database["public"]["Enums"]["payment_status"]
          total_amount: number
          updated_at?: string
        }
        Update: {
          account_id?: string
          billing_customer_id?: number
          billing_provider?: Database["public"]["Enums"]["billing_provider"]
          created_at?: string
          currency?: string
          id?: string
          status?: Database["public"]["Enums"]["payment_status"]
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_account_workspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_billing_customer_id_fkey"
            columns: ["billing_customer_id"]
            isOneToOne: false
            referencedRelation: "billing_customers"
            referencedColumns: ["id"]
          },
        ]
      }
      personality_exams: {
        Row: {
          id: number
          type: string
          user_id: string | null
        }
        Insert: {
          id?: number
          type: string
          user_id?: string | null
        }
        Update: {
          id?: number
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "personality_exams_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          name: string
          tokens_quota: number
          variant_id: string
        }
        Insert: {
          name: string
          tokens_quota: number
          variant_id: string
        }
        Update: {
          name?: string
          tokens_quota?: number
          variant_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          bio: string | null
          bottomPos: number | null
          created_at: string | null
          email: string
          employment_status: string | null
          fdb_ref: string | null
          id: string
          institution_ref: string | null
          is_deleted: boolean | null
          job_title: string | null
          leftPos: number | null
          name: string | null
          profile_photo: string | null
          rightPos: number | null
          topPos: number | null
          updated_at: string | null
          user_role: Database["public"]["Enums"]["role_status"]
          workplace: string | null
          workplace_ref: string | null
        }
        Insert: {
          bio?: string | null
          bottomPos?: number | null
          created_at?: string | null
          email: string
          employment_status?: string | null
          fdb_ref?: string | null
          id?: string
          institution_ref?: string | null
          is_deleted?: boolean | null
          job_title?: string | null
          leftPos?: number | null
          name?: string | null
          profile_photo?: string | null
          rightPos?: number | null
          topPos?: number | null
          updated_at?: string | null
          user_role?: Database["public"]["Enums"]["role_status"]
          workplace?: string | null
          workplace_ref?: string | null
        }
        Update: {
          bio?: string | null
          bottomPos?: number | null
          created_at?: string | null
          email?: string
          employment_status?: string | null
          fdb_ref?: string | null
          id?: string
          institution_ref?: string | null
          is_deleted?: boolean | null
          job_title?: string | null
          leftPos?: number | null
          name?: string | null
          profile_photo?: string | null
          rightPos?: number | null
          topPos?: number | null
          updated_at?: string | null
          user_role?: Database["public"]["Enums"]["role_status"]
          workplace?: string | null
          workplace_ref?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_institution_ref_fkey"
            columns: ["institution_ref"]
            isOneToOne: false
            referencedRelation: "workplaces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_workplace_ref_fkey"
            columns: ["workplace_ref"]
            isOneToOne: false
            referencedRelation: "workplaces"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles_copy: {
        Row: {
          bottomPos: number | null
          created_at: string | null
          email: string
          employment_status: string | null
          fdb_ref: string | null
          id: string
          institution_ref: string | null
          leftPos: number | null
          name: string | null
          profile_photo: string | null
          rightPos: number | null
          topPos: number | null
          updated_at: string | null
          user_role: Database["public"]["Enums"]["role_status"]
          workplace: string | null
          workplace_ref: string | null
        }
        Insert: {
          bottomPos?: number | null
          created_at?: string | null
          email: string
          employment_status?: string | null
          fdb_ref?: string | null
          id?: string
          institution_ref?: string | null
          leftPos?: number | null
          name?: string | null
          profile_photo?: string | null
          rightPos?: number | null
          topPos?: number | null
          updated_at?: string | null
          user_role?: Database["public"]["Enums"]["role_status"]
          workplace?: string | null
          workplace_ref?: string | null
        }
        Update: {
          bottomPos?: number | null
          created_at?: string | null
          email?: string
          employment_status?: string | null
          fdb_ref?: string | null
          id?: string
          institution_ref?: string | null
          leftPos?: number | null
          name?: string | null
          profile_photo?: string | null
          rightPos?: number | null
          topPos?: number | null
          updated_at?: string | null
          user_role?: Database["public"]["Enums"]["role_status"]
          workplace?: string | null
          workplace_ref?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_copy_institution_ref_fkey"
            columns: ["institution_ref"]
            isOneToOne: false
            referencedRelation: "workplaces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_copy_workplace_ref_fkey"
            columns: ["workplace_ref"]
            isOneToOne: false
            referencedRelation: "workplaces"
            referencedColumns: ["id"]
          },
        ]
      }
      program_skill_requirements: {
        Row: {
          assessment_id: string | null
          id: number
          required_score: number
          skill_key: string
        }
        Insert: {
          assessment_id?: string | null
          id?: number
          required_score: number
          skill_key: string
        }
        Update: {
          assessment_id?: string | null
          id?: number
          required_score?: number
          skill_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "program_skill_requirements_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          assessment_id: string | null
          category: string
          feat_label: string
          id: number
          metadata: Json | null
          question: string
        }
        Insert: {
          assessment_id?: string | null
          category: string
          feat_label: string
          id?: number
          metadata?: Json | null
          question: string
        }
        Update: {
          assessment_id?: string | null
          category?: string
          feat_label?: string
          id?: number
          metadata?: Json | null
          question?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_questions_assessment"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      riasec_keywords: {
        Row: {
          element_id: string
          keyword: string
          keyword_type: string
        }
        Insert: {
          element_id: string
          keyword: string
          keyword_type: string
        }
        Update: {
          element_id?: string
          keyword?: string
          keyword_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "riasec_keywords_element_id_fkey"
            columns: ["element_id"]
            isOneToOne: false
            referencedRelation: "content_model_reference"
            referencedColumns: ["element_id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          id: number
          permission: Database["public"]["Enums"]["app_permissions"]
          role: string
        }
        Insert: {
          id?: number
          permission: Database["public"]["Enums"]["app_permissions"]
          role: string
        }
        Update: {
          id?: number
          permission?: Database["public"]["Enums"]["app_permissions"]
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_role_fkey"
            columns: ["role"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["name"]
          },
        ]
      }
      roles: {
        Row: {
          hierarchy_level: number
          name: string
        }
        Insert: {
          hierarchy_level: number
          name: string
        }
        Update: {
          hierarchy_level?: number
          name?: string
        }
        Relationships: []
      }
      scales_reference: {
        Row: {
          maximum: number
          minimum: number
          scale_id: string
          scale_name: string
        }
        Insert: {
          maximum: number
          minimum: number
          scale_id: string
          scale_name: string
        }
        Update: {
          maximum?: number
          minimum?: number
          scale_id?: string
          scale_name?: string
        }
        Relationships: []
      }
      scores: {
        Row: {
          id: string
          score: number | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          score?: number | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          score?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      session: {
        Row: {
          active_organization_id: string | null
          created_at: string
          expires_at: string
          id: string
          ip_address: string | null
          token: string
          updated_at: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          active_organization_id?: string | null
          created_at: string
          expires_at: string
          id: string
          ip_address?: string | null
          token: string
          updated_at: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          active_organization_id?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          ip_address?: string | null
          token?: string
          updated_at?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      sizes: {
        Row: {
          height: number
          id: string
          width: number
        }
        Insert: {
          height?: number
          id?: string
          width?: number
        }
        Update: {
          height?: number
          id?: string
          width?: number
        }
        Relationships: []
      }
      skills: {
        Row: {
          data_value: number
          date_updated: string
          domain_source: string
          element_id: string
          lower_ci_bound: number | null
          n: number | null
          not_relevant: string | null
          onetsoc_code: string
          recommend_suppress: string | null
          scale_id: string
          standard_error: number | null
          upper_ci_bound: number | null
        }
        Insert: {
          data_value: number
          date_updated: string
          domain_source: string
          element_id: string
          lower_ci_bound?: number | null
          n?: number | null
          not_relevant?: string | null
          onetsoc_code: string
          recommend_suppress?: string | null
          scale_id: string
          standard_error?: number | null
          upper_ci_bound?: number | null
        }
        Update: {
          data_value?: number
          date_updated?: string
          domain_source?: string
          element_id?: string
          lower_ci_bound?: number | null
          n?: number | null
          not_relevant?: string | null
          onetsoc_code?: string
          recommend_suppress?: string | null
          scale_id?: string
          standard_error?: number | null
          upper_ci_bound?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "skills_element_id_fkey"
            columns: ["element_id"]
            isOneToOne: false
            referencedRelation: "content_model_reference"
            referencedColumns: ["element_id"]
          },
          {
            foreignKeyName: "skills_scale_id_fkey"
            columns: ["scale_id"]
            isOneToOne: false
            referencedRelation: "scales_reference"
            referencedColumns: ["scale_id"]
          },
        ]
      }
      skills_to_work_activities: {
        Row: {
          skills_element_id: string
          work_activities_element_id: string
        }
        Insert: {
          skills_element_id: string
          work_activities_element_id: string
        }
        Update: {
          skills_element_id?: string
          work_activities_element_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "skills_to_work_activities_skills_element_id_fkey"
            columns: ["skills_element_id"]
            isOneToOne: false
            referencedRelation: "content_model_reference"
            referencedColumns: ["element_id"]
          },
          {
            foreignKeyName: "skills_to_work_activities_work_activities_element_id_fkey"
            columns: ["work_activities_element_id"]
            isOneToOne: false
            referencedRelation: "content_model_reference"
            referencedColumns: ["element_id"]
          },
        ]
      }
      skills_to_work_context: {
        Row: {
          skills_element_id: string
          work_context_element_id: string
        }
        Insert: {
          skills_element_id: string
          work_context_element_id: string
        }
        Update: {
          skills_element_id?: string
          work_context_element_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "skills_to_work_context_skills_element_id_fkey"
            columns: ["skills_element_id"]
            isOneToOne: false
            referencedRelation: "content_model_reference"
            referencedColumns: ["element_id"]
          },
          {
            foreignKeyName: "skills_to_work_context_work_context_element_id_fkey"
            columns: ["work_context_element_id"]
            isOneToOne: false
            referencedRelation: "content_model_reference"
            referencedColumns: ["element_id"]
          },
        ]
      }
      status: {
        Row: {
          complete: boolean | null
          completed_at: string | null
          id: string
          locked: boolean | null
          progress: number | null
          started_at: string | null
          state: Database["public"]["Enums"]["taskstate"] | null
        }
        Insert: {
          complete?: boolean | null
          completed_at?: string | null
          id?: string
          locked?: boolean | null
          progress?: number | null
          started_at?: string | null
          state?: Database["public"]["Enums"]["taskstate"] | null
        }
        Update: {
          complete?: boolean | null
          completed_at?: string | null
          id?: string
          locked?: boolean | null
          progress?: number | null
          started_at?: string | null
          state?: Database["public"]["Enums"]["taskstate"] | null
        }
        Relationships: []
      }
      subscription_items: {
        Row: {
          created_at: string
          id: string
          interval: string
          interval_count: number
          price_amount: number | null
          product_id: string
          quantity: number
          subscription_id: string
          type: Database["public"]["Enums"]["subscription_item_type"]
          updated_at: string
          variant_id: string
        }
        Insert: {
          created_at?: string
          id: string
          interval: string
          interval_count: number
          price_amount?: number | null
          product_id: string
          quantity?: number
          subscription_id: string
          type: Database["public"]["Enums"]["subscription_item_type"]
          updated_at?: string
          variant_id: string
        }
        Update: {
          created_at?: string
          id?: string
          interval?: string
          interval_count?: number
          price_amount?: number | null
          product_id?: string
          quantity?: number
          subscription_id?: string
          type?: Database["public"]["Enums"]["subscription_item_type"]
          updated_at?: string
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_items_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          account_id: string
          active: boolean
          billing_customer_id: number
          billing_provider: Database["public"]["Enums"]["billing_provider"]
          cancel_at_period_end: boolean
          created_at: string
          currency: string
          id: string
          period_ends_at: string
          period_starts_at: string
          status: Database["public"]["Enums"]["subscription_status"]
          trial_ends_at: string | null
          trial_starts_at: string | null
          updated_at: string
        }
        Insert: {
          account_id: string
          active: boolean
          billing_customer_id: number
          billing_provider: Database["public"]["Enums"]["billing_provider"]
          cancel_at_period_end: boolean
          created_at?: string
          currency: string
          id: string
          period_ends_at: string
          period_starts_at: string
          status: Database["public"]["Enums"]["subscription_status"]
          trial_ends_at?: string | null
          trial_starts_at?: string | null
          updated_at?: string
        }
        Update: {
          account_id?: string
          active?: boolean
          billing_customer_id?: number
          billing_provider?: Database["public"]["Enums"]["billing_provider"]
          cancel_at_period_end?: boolean
          created_at?: string
          currency?: string
          id?: string
          period_ends_at?: string
          period_starts_at?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          trial_ends_at?: string | null
          trial_starts_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_account_workspace"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_billing_customer_id_fkey"
            columns: ["billing_customer_id"]
            isOneToOne: false
            referencedRelation: "billing_customers"
            referencedColumns: ["id"]
          },
        ]
      }
      survey_booklet_locations: {
        Row: {
          element_id: string
          scale_id: string
          survey_item_number: string
        }
        Insert: {
          element_id: string
          scale_id: string
          survey_item_number: string
        }
        Update: {
          element_id?: string
          scale_id?: string
          survey_item_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "survey_booklet_locations_element_id_fkey"
            columns: ["element_id"]
            isOneToOne: false
            referencedRelation: "content_model_reference"
            referencedColumns: ["element_id"]
          },
          {
            foreignKeyName: "survey_booklet_locations_scale_id_fkey"
            columns: ["scale_id"]
            isOneToOne: false
            referencedRelation: "scales_reference"
            referencedColumns: ["scale_id"]
          },
        ]
      }
      task_categories: {
        Row: {
          category: number
          category_description: string
          scale_id: string
        }
        Insert: {
          category: number
          category_description: string
          scale_id: string
        }
        Update: {
          category?: number
          category_description?: string
          scale_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_categories_scale_id_fkey"
            columns: ["scale_id"]
            isOneToOne: false
            referencedRelation: "scales_reference"
            referencedColumns: ["scale_id"]
          },
        ]
      }
      task_completion: {
        Row: {
          completion_timestamp: string | null
          id: string
          profile_id: string
          score: number | null
          task_id: string
        }
        Insert: {
          completion_timestamp?: string | null
          id?: string
          profile_id: string
          score?: number | null
          task_id: string
        }
        Update: {
          completion_timestamp?: string | null
          id?: string
          profile_id?: string
          score?: number | null
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_completion_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      task_ratings: {
        Row: {
          category: number | null
          data_value: number
          date_updated: string
          domain_source: string
          lower_ci_bound: number | null
          n: number | null
          onetsoc_code: string
          recommend_suppress: string | null
          scale_id: string
          standard_error: number | null
          task_id: number
          upper_ci_bound: number | null
        }
        Insert: {
          category?: number | null
          data_value: number
          date_updated: string
          domain_source: string
          lower_ci_bound?: number | null
          n?: number | null
          onetsoc_code: string
          recommend_suppress?: string | null
          scale_id: string
          standard_error?: number | null
          task_id: number
          upper_ci_bound?: number | null
        }
        Update: {
          category?: number | null
          data_value?: number
          date_updated?: string
          domain_source?: string
          lower_ci_bound?: number | null
          n?: number | null
          onetsoc_code?: string
          recommend_suppress?: string | null
          scale_id?: string
          standard_error?: number | null
          task_id?: number
          upper_ci_bound?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "task_ratings_scale_id_category_fkey"
            columns: ["scale_id", "category"]
            isOneToOne: false
            referencedRelation: "task_categories"
            referencedColumns: ["scale_id", "category"]
          },
          {
            foreignKeyName: "task_ratings_scale_id_fkey"
            columns: ["scale_id"]
            isOneToOne: false
            referencedRelation: "scales_reference"
            referencedColumns: ["scale_id"]
          },
          {
            foreignKeyName: "task_ratings_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "task_statements"
            referencedColumns: ["task_id"]
          },
        ]
      }
      task_statements: {
        Row: {
          date_updated: string
          domain_source: string
          incumbents_responding: number | null
          onetsoc_code: string
          task: string
          task_id: number
          task_type: string | null
        }
        Insert: {
          date_updated: string
          domain_source: string
          incumbents_responding?: number | null
          onetsoc_code: string
          task: string
          task_id: number
          task_type?: string | null
        }
        Update: {
          date_updated?: string
          domain_source?: string
          incumbents_responding?: number | null
          onetsoc_code?: string
          task?: string
          task_id?: number
          task_type?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          activity_id: string
          description: string | null
          difficulty_level: Database["public"]["Enums"]["difficulty"] | null
          id: string
          max_score: number
          name: string
          order: number | null
        }
        Insert: {
          activity_id: string
          description?: string | null
          difficulty_level?: Database["public"]["Enums"]["difficulty"] | null
          id?: string
          max_score?: number
          name: string
          order?: number | null
        }
        Update: {
          activity_id?: string
          description?: string | null
          difficulty_level?: Database["public"]["Enums"]["difficulty"] | null
          id?: string
          max_score?: number
          name?: string
          order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks_to_dwas: {
        Row: {
          date_updated: string
          domain_source: string
          dwa_id: string
          onetsoc_code: string
          task_id: number
        }
        Insert: {
          date_updated: string
          domain_source: string
          dwa_id: string
          onetsoc_code: string
          task_id: number
        }
        Update: {
          date_updated?: string
          domain_source?: string
          dwa_id?: string
          onetsoc_code?: string
          task_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "tasks_to_dwas_dwa_id_fkey"
            columns: ["dwa_id"]
            isOneToOne: false
            referencedRelation: "dwa_reference"
            referencedColumns: ["dwa_id"]
          },
          {
            foreignKeyName: "tasks_to_dwas_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "task_statements"
            referencedColumns: ["task_id"]
          },
        ]
      }
      technology_skills: {
        Row: {
          commodity_code: number
          example: string
          hot_technology: string
          in_demand: string
          onetsoc_code: string
        }
        Insert: {
          commodity_code: number
          example: string
          hot_technology: string
          in_demand: string
          onetsoc_code: string
        }
        Update: {
          commodity_code?: number
          example?: string
          hot_technology?: string
          in_demand?: string
          onetsoc_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "technology_skills_commodity_code_fkey"
            columns: ["commodity_code"]
            isOneToOne: false
            referencedRelation: "unspsc_reference"
            referencedColumns: ["commodity_code"]
          },
        ]
      }
      tools_used: {
        Row: {
          commodity_code: number
          example: string
          onetsoc_code: string
        }
        Insert: {
          commodity_code: number
          example: string
          onetsoc_code: string
        }
        Update: {
          commodity_code?: number
          example?: string
          onetsoc_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "tools_used_commodity_code_fkey"
            columns: ["commodity_code"]
            isOneToOne: false
            referencedRelation: "unspsc_reference"
            referencedColumns: ["commodity_code"]
          },
        ]
      }
      unspsc_reference: {
        Row: {
          class_code: number
          class_title: string
          commodity_code: number
          commodity_title: string
          family_code: number
          family_title: string
          segment_code: number
          segment_title: string
        }
        Insert: {
          class_code: number
          class_title: string
          commodity_code: number
          commodity_title: string
          family_code: number
          family_title: string
          segment_code: number
          segment_title: string
        }
        Update: {
          class_code?: number
          class_title?: string
          commodity_code?: number
          commodity_title?: string
          family_code?: number
          family_title?: string
          segment_code?: number
          segment_title?: string
        }
        Relationships: []
      }
      user: {
        Row: {
          created_at: string
          email: string
          email_verified: boolean
          id: string
          image: string | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          email_verified?: boolean
          id: string
          image?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          email_verified?: boolean
          id?: string
          image?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_core_skills: {
        Row: {
          category: string
          id: number
          user_id: string | null
          value: number
        }
        Insert: {
          category: string
          id?: number
          user_id?: string | null
          value: number
        }
        Update: {
          category?: string
          id?: number
          user_id?: string | null
          value?: number
        }
        Relationships: []
      }
      user_emloyement_status: {
        Row: {
          employment_status: string | null
        }
        Insert: {
          employment_status?: string | null
        }
        Update: {
          employment_status?: string | null
        }
        Relationships: []
      }
      user_emloyement_statuss: {
        Row: {
          employment_status: string | null
        }
        Insert: {
          employment_status?: string | null
        }
        Update: {
          employment_status?: string | null
        }
        Relationships: []
      }
      user_programs: {
        Row: {
          assessment_id: string | null
          id: number
          readiness: number
          user_id: string | null
        }
        Insert: {
          assessment_id?: string | null
          id?: number
          readiness: number
          user_id?: string | null
        }
        Update: {
          assessment_id?: string | null
          id?: number
          readiness?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_programs_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_programs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_skill_details: {
        Row: {
          id: number
          skill_id: number | null
          subskill: string
          user_id: string | null
          value: number
        }
        Insert: {
          id?: number
          skill_id?: number | null
          subskill: string
          user_id?: string | null
          value: number
        }
        Update: {
          id?: number
          skill_id?: number | null
          subskill?: string
          user_id?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_skill_details_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "user_skills"
            referencedColumns: ["id"]
          },
        ]
      }
      user_skills: {
        Row: {
          category: string
          id: number
          skill_type: number | null
          user_id: string | null
          value: number
        }
        Insert: {
          category: string
          id?: number
          skill_type?: number | null
          user_id?: string | null
          value: number
        }
        Update: {
          category?: string
          id?: number
          skill_type?: number | null
          user_id?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_skills_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_tasks: {
        Row: {
          created_at: string | null
          id: string
          score_id: string | null
          status_id: string | null
          task_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          score_id?: string | null
          status_id?: string | null
          task_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          score_id?: string | null
          status_id?: string | null
          task_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_tasks_profile_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_tasks_score_id_fkey"
            columns: ["score_id"]
            isOneToOne: false
            referencedRelation: "scores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_tasks_status_id_fkey"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "status"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_ratings: {
        Row: {
          created_at: string | null
          id: number
          rating: number | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          rating?: number | null
        }
        Update: {
          created_at?: string | null
          id?: number
          rating?: number | null
        }
        Relationships: []
      }
      verification: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          identifier: string
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id: string
          identifier: string
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          identifier?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      vision_boards: {
        Row: {
          created_at: string | null
          description: string
          id: string
          img_url: string | null
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          img_url?: string | null
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          img_url?: string | null
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vision_boards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vision_focus_areas: {
        Row: {
          board_id: string | null
          focus_area: string
          id: number
        }
        Insert: {
          board_id?: string | null
          focus_area: string
          id?: number
        }
        Update: {
          board_id?: string | null
          focus_area?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "vision_focus_areas_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "vision_boards"
            referencedColumns: ["id"]
          },
        ]
      }
      vision_goals: {
        Row: {
          board_id: string | null
          goal_text: string
          id: number
        }
        Insert: {
          board_id?: string | null
          goal_text: string
          id?: number
        }
        Update: {
          board_id?: string | null
          goal_text?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "vision_goals_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "vision_boards"
            referencedColumns: ["id"]
          },
        ]
      }
      vision_journal_entries: {
        Row: {
          board_id: string | null
          content: string
          entry_date: string
          id: number
        }
        Insert: {
          board_id?: string | null
          content: string
          entry_date: string
          id?: number
        }
        Update: {
          board_id?: string | null
          content?: string
          entry_date?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "vision_journal_entries_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "vision_boards"
            referencedColumns: ["id"]
          },
        ]
      }
      vision_keywords: {
        Row: {
          board_id: string | null
          id: number
          keyword: string
        }
        Insert: {
          board_id?: string | null
          id?: number
          keyword: string
        }
        Update: {
          board_id?: string | null
          id?: number
          keyword?: string
        }
        Relationships: [
          {
            foreignKeyName: "vision_keywords_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "vision_boards"
            referencedColumns: ["id"]
          },
        ]
      }
      vision_log: {
        Row: {
          device_id: string
          edited_at: string
          id: string
          updated_at: string
          vision_id: string
        }
        Insert: {
          device_id: string
          edited_at?: string
          id: string
          updated_at?: string
          vision_id: string
        }
        Update: {
          device_id?: string
          edited_at?: string
          id?: string
          updated_at?: string
          vision_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vision_log_vision_id_fkey"
            columns: ["vision_id"]
            isOneToOne: false
            referencedRelation: "vision_boards"
            referencedColumns: ["id"]
          },
        ]
      }
      work_activities: {
        Row: {
          data_value: number
          date_updated: string
          domain_source: string
          element_id: string
          lower_ci_bound: number | null
          n: number | null
          not_relevant: string | null
          onetsoc_code: string
          recommend_suppress: string | null
          scale_id: string
          standard_error: number | null
          upper_ci_bound: number | null
        }
        Insert: {
          data_value: number
          date_updated: string
          domain_source: string
          element_id: string
          lower_ci_bound?: number | null
          n?: number | null
          not_relevant?: string | null
          onetsoc_code: string
          recommend_suppress?: string | null
          scale_id: string
          standard_error?: number | null
          upper_ci_bound?: number | null
        }
        Update: {
          data_value?: number
          date_updated?: string
          domain_source?: string
          element_id?: string
          lower_ci_bound?: number | null
          n?: number | null
          not_relevant?: string | null
          onetsoc_code?: string
          recommend_suppress?: string | null
          scale_id?: string
          standard_error?: number | null
          upper_ci_bound?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "work_activities_element_id_fkey"
            columns: ["element_id"]
            isOneToOne: false
            referencedRelation: "content_model_reference"
            referencedColumns: ["element_id"]
          },
          {
            foreignKeyName: "work_activities_scale_id_fkey"
            columns: ["scale_id"]
            isOneToOne: false
            referencedRelation: "scales_reference"
            referencedColumns: ["scale_id"]
          },
        ]
      }
      work_context: {
        Row: {
          category: number | null
          data_value: number
          date_updated: string
          domain_source: string
          element_id: string
          lower_ci_bound: number | null
          n: number | null
          not_relevant: string | null
          onetsoc_code: string
          recommend_suppress: string | null
          scale_id: string
          standard_error: number | null
          upper_ci_bound: number | null
        }
        Insert: {
          category?: number | null
          data_value: number
          date_updated: string
          domain_source: string
          element_id: string
          lower_ci_bound?: number | null
          n?: number | null
          not_relevant?: string | null
          onetsoc_code: string
          recommend_suppress?: string | null
          scale_id: string
          standard_error?: number | null
          upper_ci_bound?: number | null
        }
        Update: {
          category?: number | null
          data_value?: number
          date_updated?: string
          domain_source?: string
          element_id?: string
          lower_ci_bound?: number | null
          n?: number | null
          not_relevant?: string | null
          onetsoc_code?: string
          recommend_suppress?: string | null
          scale_id?: string
          standard_error?: number | null
          upper_ci_bound?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "work_context_element_id_fkey"
            columns: ["element_id"]
            isOneToOne: false
            referencedRelation: "content_model_reference"
            referencedColumns: ["element_id"]
          },
          {
            foreignKeyName: "work_context_element_id_scale_id_category_fkey"
            columns: ["element_id", "scale_id", "category"]
            isOneToOne: false
            referencedRelation: "work_context_categories"
            referencedColumns: ["element_id", "scale_id", "category"]
          },
          {
            foreignKeyName: "work_context_scale_id_fkey"
            columns: ["scale_id"]
            isOneToOne: false
            referencedRelation: "scales_reference"
            referencedColumns: ["scale_id"]
          },
        ]
      }
      work_context_categories: {
        Row: {
          category: number
          category_description: string
          element_id: string
          scale_id: string
        }
        Insert: {
          category: number
          category_description: string
          element_id: string
          scale_id: string
        }
        Update: {
          category?: number
          category_description?: string
          element_id?: string
          scale_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_context_categories_element_id_fkey"
            columns: ["element_id"]
            isOneToOne: false
            referencedRelation: "content_model_reference"
            referencedColumns: ["element_id"]
          },
          {
            foreignKeyName: "work_context_categories_scale_id_fkey"
            columns: ["scale_id"]
            isOneToOne: false
            referencedRelation: "scales_reference"
            referencedColumns: ["scale_id"]
          },
        ]
      }
      work_styles: {
        Row: {
          data_value: number
          date_updated: string
          domain_source: string
          element_id: string
          lower_ci_bound: number | null
          n: number | null
          onetsoc_code: string
          recommend_suppress: string | null
          scale_id: string
          standard_error: number | null
          upper_ci_bound: number | null
        }
        Insert: {
          data_value: number
          date_updated: string
          domain_source: string
          element_id: string
          lower_ci_bound?: number | null
          n?: number | null
          onetsoc_code: string
          recommend_suppress?: string | null
          scale_id: string
          standard_error?: number | null
          upper_ci_bound?: number | null
        }
        Update: {
          data_value?: number
          date_updated?: string
          domain_source?: string
          element_id?: string
          lower_ci_bound?: number | null
          n?: number | null
          onetsoc_code?: string
          recommend_suppress?: string | null
          scale_id?: string
          standard_error?: number | null
          upper_ci_bound?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "work_styles_element_id_fkey"
            columns: ["element_id"]
            isOneToOne: false
            referencedRelation: "content_model_reference"
            referencedColumns: ["element_id"]
          },
          {
            foreignKeyName: "work_styles_scale_id_fkey"
            columns: ["scale_id"]
            isOneToOne: false
            referencedRelation: "scales_reference"
            referencedColumns: ["scale_id"]
          },
        ]
      }
      work_values: {
        Row: {
          data_value: number
          date_updated: string
          domain_source: string
          element_id: string
          onetsoc_code: string
          scale_id: string
        }
        Insert: {
          data_value: number
          date_updated: string
          domain_source: string
          element_id: string
          onetsoc_code: string
          scale_id: string
        }
        Update: {
          data_value?: number
          date_updated?: string
          domain_source?: string
          element_id?: string
          onetsoc_code?: string
          scale_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_values_element_id_fkey"
            columns: ["element_id"]
            isOneToOne: false
            referencedRelation: "content_model_reference"
            referencedColumns: ["element_id"]
          },
          {
            foreignKeyName: "work_values_scale_id_fkey"
            columns: ["scale_id"]
            isOneToOne: false
            referencedRelation: "scales_reference"
            referencedColumns: ["scale_id"]
          },
        ]
      }
      workplace_type: {
        Row: {
          type: string | null
        }
        Insert: {
          type?: string | null
        }
        Update: {
          type?: string | null
        }
        Relationships: []
      }
      workplaces: {
        Row: {
          enabled_assessments: string[]
          id: string
          type: string | null
          workplace_address: Json | null
          workplace_description: string | null
          workplace_domain: string | null
          workplace_email: string | null
          workplace_logo: string | null
          workplace_name: string | null
        }
        Insert: {
          enabled_assessments?: string[]
          id?: string
          type?: string | null
          workplace_address?: Json | null
          workplace_description?: string | null
          workplace_domain?: string | null
          workplace_email?: string | null
          workplace_logo?: string | null
          workplace_name?: string | null
        }
        Update: {
          enabled_assessments?: string[]
          id?: string
          type?: string | null
          workplace_address?: Json | null
          workplace_description?: string | null
          workplace_domain?: string | null
          workplace_email?: string | null
          workplace_logo?: string | null
          workplace_name?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      user_account_workspace: {
        Row: {
          id: string | null
          name: string | null
          picture_url: string | null
          subscription_status:
            | Database["public"]["Enums"]["subscription_status"]
            | null
        }
        Relationships: []
      }
      user_accounts: {
        Row: {
          id: string | null
          name: string | null
          picture_url: string | null
          role: string | null
          slug: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accounts_memberships_account_role_fkey"
            columns: ["role"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["name"]
          },
        ]
      }
    }
    Functions: {
      accept_invitation: {
        Args:
          | { lookup_invitation_token: string }
          | { token: string; user_id: string }
        Returns: string
      }
      add_invitations_to_account: {
        Args: {
          account_slug: string
          invitations: Database["public"]["CompositeTypes"]["invitation"][]
        }
        Returns: Database["public"]["Tables"]["invitations"]["Row"][]
      }
      ban_user_function: {
        Args: { user_id: string }
        Returns: undefined
      }
      can_action_account_member: {
        Args: { target_team_account_id: string; target_user_id: string }
        Returns: boolean
      }
      create_invitation: {
        Args: { account_id: string; email: string; role: string }
        Returns: {
          account_id: string
          created_at: string
          email: string
          expires_at: string
          id: number
          invite_token: string
          invited_by: string
          role: string
          updated_at: string
        }
      }
      create_nonce: {
        Args: {
          p_user_id?: string
          p_purpose?: string
          p_expires_in_seconds?: number
          p_metadata?: Json
          p_scopes?: string[]
          p_revoke_previous?: boolean
        }
        Returns: Json
      }
      create_team_account: {
        Args: { account_name: string }
        Returns: {
          created_at: string | null
          created_by: string | null
          email: string | null
          id: string
          is_personal_account: boolean
          name: string
          picture_url: string | null
          primary_owner_user_id: string
          public_data: Json
          slug: string | null
          updated_at: string | null
          updated_by: string | null
        }
      }
      deduct_credits: {
        Args: { account_id: string; amount: number }
        Returns: undefined
      }
      generate_token: {
        Args: { length: number }
        Returns: string
      }
      get_account_invitations: {
        Args: { account_slug: string }
        Returns: {
          id: number
          email: string
          account_id: string
          invited_by: string
          role: string
          created_at: string
          updated_at: string
          expires_at: string
          inviter_name: string
          inviter_email: string
        }[]
      }
      get_account_members: {
        Args: { account_slug: string }
        Returns: {
          id: string
          user_id: string
          account_id: string
          role: string
          role_hierarchy_level: number
          primary_owner_user_id: string
          name: string
          email: string
          picture_url: string
          created_at: string
          updated_at: string
        }[]
      }
      get_accounts_for_current_user: {
        Args: { passed_in_role?: Database["public"]["Enums"]["account_role"] }
        Returns: string[]
      }
      get_config: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_creation_date_record_count: {
        Args: { start_date: string; end_date: string }
        Returns: {
          creation_date: string
          record_count: number
        }[]
      }
      get_evaluations: {
        Args: {
          workplace_id_param: string
          assessment_id_param: string
          latest: boolean
        }
        Returns: {
          id: string
          user_id: string
          assessment_id: string
          is_completed: boolean
          results: Json
          created_at: string
          profile_id: string
          email: string
          name: string
        }[]
      }
      get_game_info_by_workplace_id: {
        Args: { workplaceid?: string }
        Returns: {
          game_info: Database["public"]["Tables"]["game_info"]["Row"]
        }[]
      }
      get_nonce_status: {
        Args: { p_id: string }
        Returns: Json
      }
      get_top_cluster_class_counts: {
        Args: { workplaceid?: string }
        Returns: {
          cluster_class: string
          goals_count: number
          user_count: number
        }[]
      }
      get_unanswered_questions: {
        Args: { iuser_id: string }
        Returns: {
          id: number
          question: string
          category: string
          feat_label: string
        }[]
      }
      get_unanswered_questions_count: {
        Args: { iuser_id: string }
        Returns: number
      }
      get_upper_system_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_with_respect_date: {
        Args: { start_date: string; end_date: string; workplaceid?: string }
        Returns: {
          creation_date: string
          record_count: number
        }[]
      }
      get_users_with_goals_and_visions: {
        Args: Record<PropertyKey, never>
        Returns: {
          result_row: Record<string, unknown>
        }[]
      }
      has_active_subscription: {
        Args: { target_account_id: string }
        Returns: boolean
      }
      has_credits: {
        Args: { account_id: string }
        Returns: boolean
      }
      has_more_elevated_role: {
        Args: {
          target_user_id: string
          target_account_id: string
          role_name: string
        }
        Returns: boolean
      }
      has_permission: {
        Args: {
          user_id: string
          account_id: string
          permission_name: Database["public"]["Enums"]["app_permissions"]
        }
        Returns: boolean
      }
      has_role_on_account: {
        Args: { account_id: string; account_role?: string }
        Returns: boolean
      }
      has_same_role_hierarchy_level: {
        Args: {
          target_user_id: string
          target_account_id: string
          role_name: string
        }
        Returns: boolean
      }
      is_aal2: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_account_owner: {
        Args: { account_id: string }
        Returns: boolean
      }
      is_account_team_member: {
        Args: { target_account_id: string }
        Returns: boolean
      }
      is_mfa_compliant: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_set: {
        Args: { field_name: string }
        Returns: boolean
      }
      is_super_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_team_member: {
        Args: { account_id: string; user_id: string }
        Returns: boolean
      }
      lookup_invitation: {
        Args: { lookup_invitation_token: string }
        Returns: Json
      }
      revoke_nonce: {
        Args: { p_id: string; p_reason?: string }
        Returns: boolean
      }
      search_posts: {
        Args: { keyword: string }
        Returns: {
          bio: string | null
          bottomPos: number | null
          created_at: string | null
          email: string
          employment_status: string | null
          fdb_ref: string | null
          id: string
          institution_ref: string | null
          is_deleted: boolean | null
          job_title: string | null
          leftPos: number | null
          name: string | null
          profile_photo: string | null
          rightPos: number | null
          topPos: number | null
          updated_at: string | null
          user_role: Database["public"]["Enums"]["role_status"]
          workplace: string | null
          workplace_ref: string | null
        }[]
      }
      search_user: {
        Args: Record<PropertyKey, never> | { keyword: string }
        Returns: {
          bio: string | null
          bottomPos: number | null
          created_at: string | null
          email: string
          employment_status: string | null
          fdb_ref: string | null
          id: string
          institution_ref: string | null
          is_deleted: boolean | null
          job_title: string | null
          leftPos: number | null
          name: string | null
          profile_photo: string | null
          rightPos: number | null
          topPos: number | null
          updated_at: string | null
          user_role: Database["public"]["Enums"]["role_status"]
          workplace: string | null
          workplace_ref: string | null
        }[]
      }
      team_account_workspace: {
        Args: { account_slug: string }
        Returns: {
          id: string
          name: string
          picture_url: string
          slug: string
          role: string
          role_hierarchy_level: number
          primary_owner_user_id: string
          subscription_status: Database["public"]["Enums"]["subscription_status"]
          permissions: Database["public"]["Enums"]["app_permissions"][]
        }[]
      }
      transfer_team_account_ownership: {
        Args: { target_account_id: string; new_owner_id: string }
        Returns: undefined
      }
      update_account_user_role: {
        Args: {
          account_id: string
          user_id: string
          new_account_role: Database["public"]["Enums"]["account_role"]
        }
        Returns: string
      }
      upsert_order: {
        Args: {
          target_account_id: string
          target_customer_id: string
          target_order_id: string
          status: Database["public"]["Enums"]["payment_status"]
          billing_provider: Database["public"]["Enums"]["billing_provider"]
          total_amount: number
          currency: string
          line_items: Json
        }
        Returns: {
          account_id: string
          billing_customer_id: number
          billing_provider: Database["public"]["Enums"]["billing_provider"]
          created_at: string
          currency: string
          id: string
          status: Database["public"]["Enums"]["payment_status"]
          total_amount: number
          updated_at: string
        }
      }
      upsert_subscription: {
        Args: {
          target_account_id: string
          target_customer_id: string
          target_subscription_id: string
          active: boolean
          status: Database["public"]["Enums"]["subscription_status"]
          billing_provider: Database["public"]["Enums"]["billing_provider"]
          cancel_at_period_end: boolean
          currency: string
          period_starts_at: string
          period_ends_at: string
          line_items: Json
          trial_starts_at?: string
          trial_ends_at?: string
        }
        Returns: {
          account_id: string
          active: boolean
          billing_customer_id: number
          billing_provider: Database["public"]["Enums"]["billing_provider"]
          cancel_at_period_end: boolean
          created_at: string
          currency: string
          id: string
          period_ends_at: string
          period_starts_at: string
          status: Database["public"]["Enums"]["subscription_status"]
          trial_ends_at: string | null
          trial_starts_at: string | null
          updated_at: string
        }
      }
      verify_nonce: {
        Args: {
          p_token: string
          p_purpose: string
          p_user_id?: string
          p_required_scopes?: string[]
          p_max_verification_attempts?: number
          p_ip?: unknown
          p_user_agent?: string
        }
        Returns: Json
      }
    }
    Enums: {
      account_role: "owner" | "member" | "super-owner"
      app_permissions:
        | "roles.manage"
        | "billing.manage"
        | "settings.manage"
        | "members.manage"
        | "invites.manage"
        | "tasks.write"
        | "tasks.delete"
      billing_provider: "stripe" | "lemon-squeezy" | "paddle"
      billing_providers: "stripe"
      chat_role: "user" | "assistant"
      difficulty: "easy" | "medium" | "hard"
      invitation_status: "pending" | "accepted" | "expired" | "deleted"
      invitation_type: "one-time" | "24-hour"
      notification_channel: "in_app" | "email"
      notification_type: "info" | "warning" | "error"
      payment_status: "pending" | "succeeded" | "failed"
      pricing_plan_interval: "day" | "week" | "month" | "year"
      pricing_type: "one_time" | "recurring"
      role_status: "admin" | "user"
      subscription_item_type: "flat" | "per_seat" | "metered"
      subscription_status:
        | "active"
        | "trialing"
        | "past_due"
        | "canceled"
        | "unpaid"
        | "incomplete"
        | "incomplete_expired"
        | "paused"
      taskstate: "UNTOUCHED" | "ONGOING" | "COMPLETED"
      tasktype: "GAME" | "QUIZ" | "FLASHCARD"
    }
    CompositeTypes: {
      invitation: {
        email: string | null
        role: string | null
      }
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      account_role: ["owner", "member", "super-owner"],
      app_permissions: [
        "roles.manage",
        "billing.manage",
        "settings.manage",
        "members.manage",
        "invites.manage",
        "tasks.write",
        "tasks.delete",
      ],
      billing_provider: ["stripe", "lemon-squeezy", "paddle"],
      billing_providers: ["stripe"],
      chat_role: ["user", "assistant"],
      difficulty: ["easy", "medium", "hard"],
      invitation_status: ["pending", "accepted", "expired", "deleted"],
      invitation_type: ["one-time", "24-hour"],
      notification_channel: ["in_app", "email"],
      notification_type: ["info", "warning", "error"],
      payment_status: ["pending", "succeeded", "failed"],
      pricing_plan_interval: ["day", "week", "month", "year"],
      pricing_type: ["one_time", "recurring"],
      role_status: ["admin", "user"],
      subscription_item_type: ["flat", "per_seat", "metered"],
      subscription_status: [
        "active",
        "trialing",
        "past_due",
        "canceled",
        "unpaid",
        "incomplete",
        "incomplete_expired",
        "paused",
      ],
      taskstate: ["UNTOUCHED", "ONGOING", "COMPLETED"],
      tasktype: ["GAME", "QUIZ", "FLASHCARD"],
    },
  },
} as const
