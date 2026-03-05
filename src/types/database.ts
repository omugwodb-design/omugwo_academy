export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      app_settings: {
        Row: {
          created_at: string | null
          default_currency: string
          id: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          default_currency?: string
          id?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          default_currency?: string
          id?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      assignment_submissions: {
        Row: {
          assignment_id: string | null
          feedback: string | null
          file_url: string | null
          graded_at: string | null
          graded_by: string | null
          id: string
          score: number | null
          status: string | null
          submitted_at: string | null
          text_content: string | null
          user_id: string | null
        }
        Insert: {
          assignment_id?: string | null
          feedback?: string | null
          file_url?: string | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          score?: number | null
          status?: string | null
          submitted_at?: string | null
          text_content?: string | null
          user_id?: string | null
        }
        Update: {
          assignment_id?: string | null
          feedback?: string | null
          file_url?: string | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          score?: number | null
          status?: string | null
          submitted_at?: string | null
          text_content?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assignment_submissions_graded_by_fkey"
            columns: ["graded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignment_submissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      assignments: {
        Row: {
          allow_file_upload: boolean | null
          allow_text_submission: boolean | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          instructions: string | null
          lesson_id: string | null
          max_score: number | null
          peer_review: boolean | null
          rubric: Json | null
          title: string
        }
        Insert: {
          allow_file_upload?: boolean | null
          allow_text_submission?: boolean | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          instructions?: string | null
          lesson_id?: string | null
          max_score?: number | null
          peer_review?: boolean | null
          rubric?: Json | null
          title: string
        }
        Update: {
          allow_file_upload?: boolean | null
          allow_text_submission?: boolean | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          instructions?: string | null
          lesson_id?: string | null
          max_score?: number | null
          peer_review?: boolean | null
          rubric?: Json | null
          title?: string
        }
        Relationships: []
      }
      badges: {
        Row: {
          created_at: string | null
          criteria: Json
          description: string
          icon_url: string
          id: string
          is_active: boolean | null
          name: string
          points: number | null
        }
        Insert: {
          created_at?: string | null
          criteria: Json
          description: string
          icon_url: string
          id?: string
          is_active?: boolean | null
          name: string
          points?: number | null
        }
        Update: {
          created_at?: string | null
          criteria?: Json
          description?: string
          icon_url?: string
          id?: string
          is_active?: boolean | null
          name?: string
          points?: number | null
        }
        Relationships: []
      }
      budgets: {
        Row: {
          category_id: string
          created_at: string | null
          id: string
          month: string
          monthly_limit: number
          updated_at: string | null
        }
        Insert: {
          category_id: string
          created_at?: string | null
          id?: string
          month: string
          monthly_limit: number
          updated_at?: string | null
        }
        Update: {
          category_id?: string
          created_at?: string | null
          id?: string
          month?: string
          monthly_limit?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "budgets_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budgets_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "category_spending"
            referencedColumns: ["category_id"]
          },
        ]
      }
      categories: {
        Row: {
          color: string
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string | null
        }
        Insert: {
          color?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
        }
        Update: {
          color?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
      certificates: {
        Row: {
          certificate_number: string
          course_id: string
          id: string
          issued_at: string | null
          pdf_url: string | null
          user_id: string
          verification_url: string | null
        }
        Insert: {
          certificate_number: string
          course_id: string
          id?: string
          issued_at?: string | null
          pdf_url?: string | null
          user_id: string
          verification_url?: string | null
        }
        Update: {
          certificate_number?: string
          course_id?: string
          id?: string
          issued_at?: string | null
          pdf_url?: string | null
          user_id?: string
          verification_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      cohort_enrollments: {
        Row: {
          cohort_id: string | null
          enrolled_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          cohort_id?: string | null
          enrolled_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          cohort_id?: string | null
          enrolled_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cohort_enrollments_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "cohorts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cohort_enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      cohort_live_sessions: {
        Row: {
          cohort_id: string | null
          created_at: string | null
          duration_minutes: number | null
          id: string
          is_completed: boolean | null
          meeting_url: string | null
          recording_url: string | null
          scheduled_at: string
          title: string
        }
        Insert: {
          cohort_id?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          is_completed?: boolean | null
          meeting_url?: string | null
          recording_url?: string | null
          scheduled_at: string
          title: string
        }
        Update: {
          cohort_id?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          is_completed?: boolean | null
          meeting_url?: string | null
          recording_url?: string | null
          scheduled_at?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "cohort_live_sessions_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "cohorts"
            referencedColumns: ["id"]
          },
        ]
      }
      cohort_schedule: {
        Row: {
          assignment_due_date: string | null
          cohort_id: string | null
          end_date: string
          id: string
          module_id: string | null
          start_date: string
        }
        Insert: {
          assignment_due_date?: string | null
          cohort_id?: string | null
          end_date: string
          id?: string
          module_id?: string | null
          start_date: string
        }
        Update: {
          assignment_due_date?: string | null
          cohort_id?: string | null
          end_date?: string
          id?: string
          module_id?: string | null
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "cohort_schedule_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "cohorts"
            referencedColumns: ["id"]
          },
        ]
      }
      cohorts: {
        Row: {
          course_id: string | null
          created_at: string | null
          description: string | null
          end_date: string
          id: string
          instructor_id: string | null
          max_students: number | null
          name: string
          start_date: string
          status: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          end_date: string
          id?: string
          instructor_id?: string | null
          max_students?: number | null
          name: string
          start_date: string
          status?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string
          id?: string
          instructor_id?: string | null
          max_students?: number | null
          name?: string
          start_date?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cohorts_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      community_comments: {
        Row: {
          author_id: string | null
          content: string
          created_at: string | null
          id: string
          is_best_answer: boolean | null
          like_count: number | null
          parent_id: string | null
          post_id: string | null
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_best_answer?: boolean | null
          like_count?: number | null
          parent_id?: string | null
          post_id?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_best_answer?: boolean | null
          like_count?: number | null
          parent_id?: string | null
          post_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "community_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_event_rsvps: {
        Row: {
          created_at: string | null
          event_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_event_rsvps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "community_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_event_rsvps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      community_events: {
        Row: {
          created_at: string | null
          created_by: string | null
          date: string
          description: string | null
          duration_minutes: number | null
          id: string
          location: string | null
          max_attendees: number | null
          meeting_url: string | null
          space_id: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          date: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          location?: string | null
          max_attendees?: number | null
          meeting_url?: string | null
          space_id?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          date?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          location?: string | null
          max_attendees?: number | null
          meeting_url?: string | null
          space_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_events_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "community_spaces"
            referencedColumns: ["id"]
          },
        ]
      }
      community_likes: {
        Row: {
          comment_id: string | null
          created_at: string | null
          id: string
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          comment_id?: string | null
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          comment_id?: string | null
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "community_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          author_id: string | null
          comment_count: number | null
          content: string
          created_at: string | null
          id: string
          images: string[] | null
          is_anonymous: boolean | null
          is_approved: boolean | null
          is_locked: boolean | null
          is_pinned: boolean | null
          like_count: number | null
          space_id: string | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          comment_count?: number | null
          content: string
          created_at?: string | null
          id?: string
          images?: string[] | null
          is_anonymous?: boolean | null
          is_approved?: boolean | null
          is_locked?: boolean | null
          is_pinned?: boolean | null
          like_count?: number | null
          space_id?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          comment_count?: number | null
          content?: string
          created_at?: string | null
          id?: string
          images?: string[] | null
          is_anonymous?: boolean | null
          is_approved?: boolean | null
          is_locked?: boolean | null
          is_pinned?: boolean | null
          like_count?: number | null
          space_id?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_posts_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "community_spaces"
            referencedColumns: ["id"]
          },
        ]
      }
      community_reports: {
        Row: {
          comment_id: string | null
          created_at: string | null
          id: string
          post_id: string | null
          reason: string
          reporter_id: string | null
          reviewed_by: string | null
          status: string | null
        }
        Insert: {
          comment_id?: string | null
          created_at?: string | null
          id?: string
          post_id?: string | null
          reason: string
          reporter_id?: string | null
          reviewed_by?: string | null
          status?: string | null
        }
        Update: {
          comment_id?: string | null
          created_at?: string | null
          id?: string
          post_id?: string | null
          reason?: string
          reporter_id?: string | null
          reviewed_by?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_reports_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "community_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_reports_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_reports_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      community_space_members: {
        Row: {
          id: string
          joined_at: string | null
          role: string | null
          space_id: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          joined_at?: string | null
          role?: string | null
          space_id?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          joined_at?: string | null
          role?: string | null
          space_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_space_members_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "community_spaces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_space_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      community_spaces: {
        Row: {
          color: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          moderation_level: string | null
          name: string
          sort_order: number | null
          updated_at: string | null
          visibility: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          moderation_level?: string | null
          name: string
          sort_order?: number | null
          updated_at?: string | null
          visibility?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          moderation_level?: string | null
          name?: string
          sort_order?: number | null
          updated_at?: string | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_spaces_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category: string | null
          created_at: string | null
          currency: string | null
          description: string
          difficulty_level: string | null
          drip_config: Json | null
          drip_type: string | null
          duration_hours: number | null
          id: string
          instructor_id: string | null
          is_featured: boolean | null
          is_published: boolean | null
          original_price: number | null
          preview_video_url: string | null
          price: number
          short_description: string | null
          slug: string
          tags: string[] | null
          target_audience: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          currency?: string | null
          description: string
          difficulty_level?: string | null
          drip_config?: Json | null
          drip_type?: string | null
          duration_hours?: number | null
          id?: string
          instructor_id?: string | null
          is_featured?: boolean | null
          is_published?: boolean | null
          original_price?: number | null
          preview_video_url?: string | null
          price?: number
          short_description?: string | null
          slug: string
          tags?: string[] | null
          target_audience?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string
          difficulty_level?: string | null
          drip_config?: Json | null
          drip_type?: string | null
          duration_hours?: number | null
          id?: string
          instructor_id?: string | null
          is_featured?: boolean | null
          is_published?: boolean | null
          original_price?: number | null
          preview_video_url?: string | null
          price?: number
          short_description?: string | null
          slug?: string
          tags?: string[] | null
          target_audience?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      email_sequence_steps: {
        Row: {
          content: string
          delay_days: number | null
          delay_hours: number | null
          id: string
          order_index: number
          sequence_id: string
          subject: string
        }
        Insert: {
          content: string
          delay_days?: number | null
          delay_hours?: number | null
          id?: string
          order_index: number
          sequence_id: string
          subject: string
        }
        Update: {
          content?: string
          delay_days?: number | null
          delay_hours?: number | null
          id?: string
          order_index?: number
          sequence_id?: string
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_sequence_steps_sequence_id_fkey"
            columns: ["sequence_id"]
            isOneToOne: false
            referencedRelation: "email_sequences"
            referencedColumns: ["id"]
          },
        ]
      }
      email_sequences: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          trigger_event: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          trigger_event: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          trigger_event?: string
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          completed_at: string | null
          course_id: string
          enrolled_at: string | null
          expires_at: string | null
          id: string
          progress: number | null
          status: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          enrolled_at?: string | null
          expires_at?: string | null
          id?: string
          progress?: number | null
          status?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          enrolled_at?: string | null
          expires_at?: string | null
          id?: string
          progress?: number | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      expert_profiles: {
        Row: {
          created_at: string | null
          credentials: string[] | null
          id: string
          specialty: string | null
          title: string
          user_id: string | null
          verification_status: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string | null
          credentials?: string[] | null
          id?: string
          specialty?: string | null
          title: string
          user_id?: string | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string | null
          credentials?: string[] | null
          id?: string
          specialty?: string | null
          title?: string
          user_id?: string | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expert_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expert_profiles_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      invites: {
        Row: {
          accepted_at: string | null
          created_at: string | null
          email: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          sent_at: string | null
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string | null
          email: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          sent_at?: string | null
        }
        Update: {
          accepted_at?: string | null
          created_at?: string | null
          email?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          sent_at?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          converted_user_id: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          lead_magnet: string | null
          phone: string | null
          source: string | null
          status: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          converted_user_id?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id?: string
          lead_magnet?: string | null
          phone?: string | null
          source?: string | null
          status?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          converted_user_id?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          lead_magnet?: string | null
          phone?: string | null
          source?: string | null
          status?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_converted_user_id_fkey"
            columns: ["converted_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_progress: {
        Row: {
          completed_at: string | null
          id: string
          is_completed: boolean | null
          last_position_seconds: number | null
          lesson_id: string
          updated_at: string | null
          user_id: string
          watch_time_seconds: number | null
        }
        Insert: {
          completed_at?: string | null
          id?: string
          is_completed?: boolean | null
          last_position_seconds?: number | null
          lesson_id: string
          updated_at?: string | null
          user_id: string
          watch_time_seconds?: number | null
        }
        Update: {
          completed_at?: string | null
          id?: string
          is_completed?: boolean | null
          last_position_seconds?: number | null
          lesson_id?: string
          updated_at?: string | null
          user_id?: string
          watch_time_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          content: string | null
          created_at: string | null
          duration_minutes: number | null
          id: string
          is_free: boolean | null
          is_published: boolean | null
          module_id: string
          order_index: number
          resources: Json | null
          title: string
          video_duration_seconds: number | null
          video_url: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          is_free?: boolean | null
          is_published?: boolean | null
          module_id: string
          order_index: number
          resources?: Json | null
          title: string
          video_duration_seconds?: number | null
          video_url?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          is_free?: boolean | null
          is_published?: boolean | null
          module_id?: string
          order_index?: number
          resources?: Json | null
          title?: string
          video_duration_seconds?: number | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          course_id: string
          created_at: string | null
          description: string | null
          drip_after_progress: number | null
          drip_date: string | null
          id: string
          is_published: boolean | null
          order_index: number
          title: string
        }
        Insert: {
          course_id: string
          created_at?: string | null
          description?: string | null
          drip_after_progress?: number | null
          drip_date?: string | null
          id?: string
          is_published?: boolean | null
          order_index: number
          title: string
        }
        Update: {
          course_id?: string
          created_at?: string | null
          description?: string | null
          drip_after_progress?: number | null
          drip_date?: string | null
          id?: string
          is_published?: boolean | null
          order_index?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string | null
          data: Json | null
          id: string
          is_read: boolean | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          type: Database["public"]["Enums"]["partner_type"]
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          type?: Database["public"]["Enums"]["partner_type"]
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          type?: Database["public"]["Enums"]["partner_type"]
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          completed_at: string | null
          course_id: string | null
          created_at: string | null
          currency: string | null
          id: string
          provider: string
          provider_reference: string | null
          provider_response: Json | null
          status: string | null
          user_id: string
          webinar_id: string | null
        }
        Insert: {
          amount: number
          completed_at?: string | null
          course_id?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          provider: string
          provider_reference?: string | null
          provider_response?: Json | null
          status?: string | null
          user_id: string
          webinar_id?: string | null
        }
        Update: {
          amount?: number
          completed_at?: string | null
          course_id?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          provider?: string
          provider_reference?: string | null
          provider_response?: Json | null
          status?: string | null
          user_id?: string
          webinar_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          correct_answer: number | null
          correct_text: string | null
          explanation: string | null
          id: string
          options: Json
          order_index: number
          points: number | null
          question: string
          question_type: string | null
          quiz_id: string
          scenario_context: string | null
        }
        Insert: {
          correct_answer?: number | null
          correct_text?: string | null
          explanation?: string | null
          id?: string
          options?: Json
          order_index: number
          points?: number | null
          question: string
          question_type?: string | null
          quiz_id: string
          scenario_context?: string | null
        }
        Update: {
          correct_answer?: number | null
          correct_text?: string | null
          explanation?: string | null
          id?: string
          options?: Json
          order_index?: number
          points?: number | null
          question?: string
          question_type?: string | null
          quiz_id?: string
          scenario_context?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_responses: {
        Row: {
          answers: Json
          completed_at: string | null
          id: string
          passed: boolean
          quiz_id: string
          score: number
          time_taken_seconds: number | null
          user_id: string
        }
        Insert: {
          answers: Json
          completed_at?: string | null
          id?: string
          passed: boolean
          quiz_id: string
          score: number
          time_taken_seconds?: number | null
          user_id: string
        }
        Update: {
          answers?: Json
          completed_at?: string | null
          id?: string
          passed?: boolean
          quiz_id?: string
          score?: number
          time_taken_seconds?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_responses_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          course_id: string | null
          created_at: string | null
          description: string | null
          id: string
          is_required: boolean | null
          lesson_id: string | null
          max_attempts: number | null
          passing_score: number | null
          show_correct_answers: boolean | null
          shuffle_options: boolean | null
          shuffle_questions: boolean | null
          time_limit_minutes: number | null
          title: string
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_required?: boolean | null
          lesson_id?: string | null
          max_attempts?: number | null
          passing_score?: number | null
          show_correct_answers?: boolean | null
          shuffle_options?: boolean | null
          shuffle_questions?: boolean | null
          time_limit_minutes?: number | null
          title: string
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_required?: boolean | null
          lesson_id?: string | null
          max_attempts?: number | null
          passing_score?: number | null
          show_correct_answers?: boolean | null
          shuffle_options?: boolean | null
          shuffle_questions?: boolean | null
          time_limit_minutes?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizzes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      recurring_schedules: {
        Row: {
          created_at: string | null
          frequency: Database["public"]["Enums"]["recurring_frequency"]
          id: string
          is_active: boolean | null
          next_occurrence: string
          start_date: string
          template_transaction_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          frequency: Database["public"]["Enums"]["recurring_frequency"]
          id?: string
          is_active?: boolean | null
          next_occurrence: string
          start_date: string
          template_transaction_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          frequency?: Database["public"]["Enums"]["recurring_frequency"]
          id?: string
          is_active?: boolean | null
          next_occurrence?: string
          start_date?: string
          template_transaction_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recurring_schedules_template_transaction_id_fkey"
            columns: ["template_transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      site_config: {
        Row: {
          created_at: string | null
          global_styles: Json
          id: string
          name: string
          published_at: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          global_styles?: Json
          id?: string
          name?: string
          published_at?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          global_styles?: Json
          id?: string
          name?: string
          published_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      site_page_versions: {
        Row: {
          blocks: Json
          created_at: string | null
          created_by: string | null
          id: string
          label: string | null
          page_id: string | null
        }
        Insert: {
          blocks?: Json
          created_at?: string | null
          created_by?: string | null
          id?: string
          label?: string | null
          page_id?: string | null
        }
        Update: {
          blocks?: Json
          created_at?: string | null
          created_by?: string | null
          id?: string
          label?: string | null
          page_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "site_page_versions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "site_page_versions_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "site_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      site_pages: {
        Row: {
          created_at: string | null
          draft_blocks: Json
          id: string
          is_home_page: boolean | null
          page_type: string
          published_blocks: Json
          seo_description: string | null
          seo_image: string | null
          seo_title: string | null
          site_id: string | null
          slug: string
          sort_order: number | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          draft_blocks?: Json
          id?: string
          is_home_page?: boolean | null
          page_type?: string
          published_blocks?: Json
          seo_description?: string | null
          seo_image?: string | null
          seo_title?: string | null
          site_id?: string | null
          slug: string
          sort_order?: number | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          draft_blocks?: Json
          id?: string
          is_home_page?: boolean | null
          page_type?: string
          published_blocks?: Json
          seo_description?: string | null
          seo_image?: string | null
          seo_title?: string | null
          site_id?: string | null
          slug?: string
          sort_order?: number | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "site_pages_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "site_config"
            referencedColumns: ["id"]
          },
        ]
      }
      site_templates: {
        Row: {
          blocks: Json
          category: string
          created_at: string | null
          description: string | null
          id: string
          is_system: boolean | null
          name: string
          page_type: string
          tags: string[] | null
          thumbnail: string | null
        }
        Insert: {
          blocks?: Json
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_system?: boolean | null
          name: string
          page_type?: string
          tags?: string[] | null
          thumbnail?: string | null
        }
        Update: {
          blocks?: Json
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_system?: boolean | null
          name?: string
          page_type?: string
          tags?: string[] | null
          thumbnail?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          attachment: string | null
          category_id: string
          created_at: string | null
          currency_code: string
          date: string
          description: string | null
          exchange_rate: number | null
          id: string
          original_amount: number | null
          partner_id: string | null
          payment_method: string
          recurring_id: string | null
          source: string | null
          tags: string[] | null
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string | null
        }
        Insert: {
          amount: number
          attachment?: string | null
          category_id: string
          created_at?: string | null
          currency_code?: string
          date: string
          description?: string | null
          exchange_rate?: number | null
          id?: string
          original_amount?: number | null
          partner_id?: string | null
          payment_method: string
          recurring_id?: string | null
          source?: string | null
          tags?: string[] | null
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
        }
        Update: {
          amount?: number
          attachment?: string | null
          category_id?: string
          created_at?: string | null
          currency_code?: string
          date?: string
          description?: string | null
          exchange_rate?: number | null
          id?: string
          original_amount?: number | null
          partner_id?: string | null
          payment_method?: string
          recurring_id?: string | null
          source?: string | null
          tags?: string[] | null
          type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "category_spending"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "transactions_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          badge_icon: string | null
          badge_id: string
          badge_name: string
          earned_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          badge_icon?: string | null
          badge_id: string
          badge_name: string
          earned_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          badge_icon?: string | null
          badge_id?: string
          badge_name?: string
          earned_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_notes: {
        Row: {
          content: string
          created_at: string | null
          id: string
          lesson_id: string
          timestamp_seconds: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          lesson_id: string
          timestamp_seconds?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          lesson_id?: string
          timestamp_seconds?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_notes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_points: {
        Row: {
          action: string
          created_at: string | null
          id: string
          points: number | null
          source_id: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          points?: number | null
          source_id?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          points?: number | null
          source_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_points_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_streaks: {
        Row: {
          current_streak: number | null
          id: string
          last_activity_date: string | null
          longest_streak: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          current_streak?: number | null
          id?: string
          last_activity_date?: string | null
          longest_streak?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          current_streak?: number | null
          id?: string
          last_activity_date?: string | null
          longest_streak?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_streaks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          auth_id: string | null
          created_at: string | null
          email: string
          id: string
          joined_at: string | null
          name: string
          role: Database["public"]["Enums"]["user_role"]
          status: Database["public"]["Enums"]["user_status"]
          updated_at: string | null
        }
        Insert: {
          auth_id?: string | null
          created_at?: string | null
          email: string
          id?: string
          joined_at?: string | null
          name: string
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string | null
        }
        Update: {
          auth_id?: string | null
          created_at?: string | null
          email?: string
          id?: string
          joined_at?: string | null
          name?: string
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string | null
        }
        Relationships: []
      }
      webinar_agenda: {
        Row: {
          description: string | null
          id: string
          sort_order: number | null
          time_offset: string
          title: string
          webinar_id: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          sort_order?: number | null
          time_offset: string
          title: string
          webinar_id?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          sort_order?: number | null
          time_offset?: string
          title?: string
          webinar_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "webinar_agenda_webinar_id_fkey"
            columns: ["webinar_id"]
            isOneToOne: false
            referencedRelation: "webinars"
            referencedColumns: ["id"]
          },
        ]
      }
      webinar_chat: {
        Row: {
          created_at: string | null
          id: string
          is_host: boolean | null
          message: string
          user_id: string | null
          webinar_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_host?: boolean | null
          message: string
          user_id?: string | null
          webinar_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_host?: boolean | null
          message?: string
          user_id?: string | null
          webinar_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "webinar_chat_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "webinar_chat_webinar_id_fkey"
            columns: ["webinar_id"]
            isOneToOne: false
            referencedRelation: "webinars"
            referencedColumns: ["id"]
          },
        ]
      }
      webinar_email_reminders: {
        Row: {
          body: string
          id: string
          send_before_minutes: number
          sent: boolean | null
          sent_at: string | null
          subject: string
          webinar_id: string | null
        }
        Insert: {
          body: string
          id?: string
          send_before_minutes: number
          sent?: boolean | null
          sent_at?: string | null
          subject: string
          webinar_id?: string | null
        }
        Update: {
          body?: string
          id?: string
          send_before_minutes?: number
          sent?: boolean | null
          sent_at?: string | null
          subject?: string
          webinar_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "webinar_email_reminders_webinar_id_fkey"
            columns: ["webinar_id"]
            isOneToOne: false
            referencedRelation: "webinars"
            referencedColumns: ["id"]
          },
        ]
      }
      webinar_poll_votes: {
        Row: {
          created_at: string | null
          id: string
          option_index: number
          poll_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          option_index: number
          poll_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          option_index?: number
          poll_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "webinar_poll_votes_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "webinar_polls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "webinar_poll_votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      webinar_polls: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          options: Json
          question: string
          trigger_at_minutes: number | null
          webinar_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          options?: Json
          question: string
          trigger_at_minutes?: number | null
          webinar_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          options?: Json
          question?: string
          trigger_at_minutes?: number | null
          webinar_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "webinar_polls_webinar_id_fkey"
            columns: ["webinar_id"]
            isOneToOne: false
            referencedRelation: "webinars"
            referencedColumns: ["id"]
          },
        ]
      }
      webinar_registrations: {
        Row: {
          attended: boolean | null
          attended_duration_minutes: number | null
          email: string | null
          id: string
          name: string | null
          phone: string | null
          registered_at: string | null
          user_id: string | null
          webinar_id: string | null
        }
        Insert: {
          attended?: boolean | null
          attended_duration_minutes?: number | null
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          registered_at?: string | null
          user_id?: string | null
          webinar_id?: string | null
        }
        Update: {
          attended?: boolean | null
          attended_duration_minutes?: number | null
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          registered_at?: string | null
          user_id?: string | null
          webinar_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "webinar_registrations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "webinar_registrations_webinar_id_fkey"
            columns: ["webinar_id"]
            isOneToOne: false
            referencedRelation: "webinars"
            referencedColumns: ["id"]
          },
        ]
      }
      webinar_speakers: {
        Row: {
          avatar_url: string | null
          bio: string | null
          id: string
          name: string
          sort_order: number | null
          title: string | null
          webinar_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          id?: string
          name: string
          sort_order?: number | null
          title?: string | null
          webinar_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          id?: string
          name?: string
          sort_order?: number | null
          title?: string | null
          webinar_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "webinar_speakers_webinar_id_fkey"
            columns: ["webinar_id"]
            isOneToOne: false
            referencedRelation: "webinars"
            referencedColumns: ["id"]
          },
        ]
      }
      webinars: {
        Row: {
          banner_url: string | null
          capacity: number | null
          course_upsell_id: string | null
          created_at: string | null
          created_by: string | null
          currency: string | null
          description: string | null
          duration_minutes: number | null
          host_id: string | null
          id: string
          is_free: boolean | null
          max_attendees: number | null
          meeting_url: string | null
          price: number | null
          replay_expires_at: string | null
          replay_url: string | null
          scheduled_at: string
          slug: string | null
          status: string | null
          title: string
          topics: Json | null
          type: string | null
          updated_at: string | null
          upsell_discount_pct: number | null
        }
        Insert: {
          banner_url?: string | null
          capacity?: number | null
          course_upsell_id?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          description?: string | null
          duration_minutes?: number | null
          host_id?: string | null
          id?: string
          is_free?: boolean | null
          max_attendees?: number | null
          meeting_url?: string | null
          price?: number | null
          replay_expires_at?: string | null
          replay_url?: string | null
          scheduled_at: string
          slug?: string | null
          status?: string | null
          title: string
          topics?: Json | null
          type?: string | null
          updated_at?: string | null
          upsell_discount_pct?: number | null
        }
        Update: {
          banner_url?: string | null
          capacity?: number | null
          course_upsell_id?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          description?: string | null
          duration_minutes?: number | null
          host_id?: string | null
          id?: string
          is_free?: boolean | null
          max_attendees?: number | null
          meeting_url?: string | null
          price?: number | null
          replay_expires_at?: string | null
          replay_url?: string | null
          scheduled_at?: string
          slug?: string | null
          status?: string | null
          title?: string
          topics?: Json | null
          type?: string | null
          updated_at?: string | null
          upsell_discount_pct?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "webinars_course_fk"
            columns: ["course_upsell_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "webinars_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "webinars_host_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      category_spending: {
        Row: {
          category_id: string | null
          category_name: string | null
          category_type: Database["public"]["Enums"]["transaction_type"] | null
          color: string | null
          month: string | null
          total_amount: number | null
          transaction_count: number | null
        }
        Relationships: []
      }
      financial_summary: {
        Row: {
          month: string | null
          net_profit: number | null
          total_expense: number | null
          total_income: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      partner_type: "CUSTOMER" | "VENDOR" | "SPONSOR" | "OTHER"
      recurring_frequency: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY"
      transaction_type: "INCOME" | "EXPENSE"
      user_role: "ADMIN" | "FINANCE" | "VIEWER"
      user_status: "ACTIVE" | "PENDING" | "INACTIVE"
    }
    CompositeTypes: {
      [_ in never]: never
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
      partner_type: ["CUSTOMER", "VENDOR", "SPONSOR", "OTHER"],
      recurring_frequency: ["DAILY", "WEEKLY", "MONTHLY", "YEARLY"],
      transaction_type: ["INCOME", "EXPENSE"],
      user_role: ["ADMIN", "FINANCE", "VIEWER"],
      user_status: ["ACTIVE", "PENDING", "INACTIVE"],
    },
  },
} as const
