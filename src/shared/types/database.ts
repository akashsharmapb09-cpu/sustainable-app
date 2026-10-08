/**
 * GreenSwap PostgreSQL Database Schema & Domain Interfaces
 */

export type ActivityCategory =
  | 'transport'
  | 'food'
  | 'energy'
  | 'shopping'
  | 'waste'
  | 'travel';

export type EffortLevel = 'easy' | 'moderate' | 'committed';

export type UserActionStatus = 'adopted' | 'maybe_later' | 'not_for_me';

export type UserRoleType = 'user' | 'admin';

export type ConfidenceRating = 'high' | 'medium' | 'moderate';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          region: string;
          household_size: number;
          diet: string;
          commute_mode: string;
          budget_sensitivity: 'low' | 'medium' | 'high';
          effort_level: EffortLevel;
          interests: string[];
          preferred_currency: 'INR' | 'USD' | 'EUR';
          preferred_units: 'metric' | 'imperial';
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['profiles']['Row']> & { id: string; email: string };
        Update: Partial<Database['public']['Tables']['profiles']['Row']>;
        Relationships: [];
      };
      user_preferences: {
        Row: {
          user_id: string;
          notifications_email: boolean;
          notifications_weekly_digest: boolean;
          share_anonymous_stats: boolean;
          dark_mode: boolean;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['user_preferences']['Row']> & { user_id: string };
        Update: Partial<Database['public']['Tables']['user_preferences']['Row']>;
        Relationships: [];
      };
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role: UserRoleType;
          created_at: string;
        };
        Insert: { id?: string; user_id: string; role?: UserRoleType; created_at?: string };
        Update: Partial<Database['public']['Tables']['user_roles']['Row']>;
        Relationships: [];
      };
      emission_factors: {
        Row: {
          id: string;
          category: ActivityCategory;
          name: string;
          co2e_per_unit: number;
          unit: string;
          region: string;
          year: number;
          source: string;
          source_url: string;
          confidence_interval: number;
          notes: string | null;
          created_at: string;
        };
        Insert: Database['public']['Tables']['emission_factors']['Row'];
        Update: Partial<Database['public']['Tables']['emission_factors']['Row']>;
        Relationships: [];
      };
      activities: {
        Row: {
          id: string;
          category: ActivityCategory;
          name: string;
          description: string | null;
          default_unit: string;
          emission_factor_id: string;
          default_frequency_per_week: number;
          default_quantity: number;
          created_at: string;
        };
        Insert: Database['public']['Tables']['activities']['Row'];
        Update: Partial<Database['public']['Tables']['activities']['Row']>;
        Relationships: [];
      };
      activity_logs: {
        Row: {
          id: string;
          user_id: string;
          activity_id: string | null;
          category: ActivityCategory;
          activity_name: string;
          quantity: number;
          unit: string;
          frequency_per_week: number;
          calculated_co2e_monthly: number;
          notes: string | null;
          logged_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['activity_logs']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['activity_logs']['Row']>;
        Relationships: [{
          foreignKeyName: 'activity_logs_activity_id_fkey';
          columns: ['activity_id'];
          isOneToOne: false;
          referencedRelation: 'activities';
          referencedColumns: ['id'];
        }];
      };
      alternatives: {
        Row: {
          id: string;
          category: ActivityCategory;
          title: string;
          description: string;
          why_better: string;
          baseline_activity_id: string | null;
          co2e_saved_ratio: number;
          cost_delta_monthly_inr: number;
          difficulty: EffortLevel;
          feasibility_score: number;
          prerequisites: string[];
          caveats: string | null;
          region_availability: string[];
          tags: string[];
          source_citation: string;
          source_url: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: Database['public']['Tables']['alternatives']['Row'];
        Update: Partial<Database['public']['Tables']['alternatives']['Row']>;
        Relationships: [];
      };
      recommendations: {
        Row: {
          id: string;
          user_id: string;
          activity_log_id: string | null;
          alternative_id: string;
          score: number;
          rank: number;
          co2e_saved_monthly_low: number;
          co2e_saved_monthly_expected: number;
          co2e_saved_monthly_high: number;
          cost_delta_monthly_low: number;
          cost_delta_monthly_expected: number;
          cost_delta_monthly_high: number;
          confidence: ConfidenceRating;
          explanation_factors: string[];
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['recommendations']['Row'], 'id' | 'created_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['recommendations']['Row']>;
        Relationships: [];
      };
      user_actions: {
        Row: {
          id: string;
          user_id: string;
          alternative_id: string;
          status: UserActionStatus;
          adopted_at: string | null;
          feedback_reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['user_actions']['Row'], 'id' | 'created_at' | 'updated_at' | 'adopted_at' | 'feedback_reason'> & {
          id?: string;
          adopted_at?: string | null;
          feedback_reason?: string | null;
        };
        Update: Partial<Database['public']['Tables']['user_actions']['Row']>;
        Relationships: [];
      };
      goals: {
        Row: {
          id: string;
          user_id: string;
          category: ActivityCategory | 'all';
          target_co2e_reduction_pct: number;
          target_date: string;
          achieved: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['goals']['Row'], 'id' | 'created_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['goals']['Row']>;
        Relationships: [];
      };
      challenges: {
        Row: {
          id: string;
          title: string;
          description: string;
          category: ActivityCategory | 'general';
          duration_days: number;
          co2e_impact_potential_kg: number;
          badge_key: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: Database['public']['Tables']['challenges']['Row'];
        Update: Partial<Database['public']['Tables']['challenges']['Row']>;
        Relationships: [];
      };
      user_challenges: {
        Row: {
          id: string;
          user_id: string;
          challenge_id: string;
          status: 'active' | 'completed' | 'abandoned';
          started_at: string;
          completed_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['user_challenges']['Row'], 'id' | 'started_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['user_challenges']['Row']>;
        Relationships: [];
      };
      badges: {
        Row: {
          key: string;
          name: string;
          description: string;
          icon_name: string;
          requirement_description: string;
          created_at: string;
        };
        Insert: Database['public']['Tables']['badges']['Row'];
        Update: Partial<Database['public']['Tables']['badges']['Row']>;
        Relationships: [];
      };
      user_badges: {
        Row: {
          id: string;
          user_id: string;
          badge_key: string;
          awarded_at: string;
        };
        Insert: { id?: string; user_id: string; badge_key: string; awarded_at?: string };
        Update: Partial<Database['public']['Tables']['user_badges']['Row']>;
        Relationships: [{
          foreignKeyName: 'user_badges_badge_key_fkey';
          columns: ['badge_key'];
          isOneToOne: false;
          referencedRelation: 'badges';
          referencedColumns: ['key'];
        }];
      };
      audit_log: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          ip_address: string | null;
          user_agent: string | null;
          metadata: Record<string, unknown>;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['audit_log']['Row'], 'id' | 'created_at'> & { id?: string };
        Update: never; // Immutable
        Relationships: [];
      };
      feedback: {
        Row: {
          id: string;
          user_id: string | null;
          feedback_type: 'suggestion' | 'alternative_request' | 'bug' | 'methodology';
          message: string;
          email: string | null;
          resolved: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['feedback']['Row'], 'id' | 'created_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['feedback']['Row']>;
        Relationships: [];
      };
      data_export_requests: {
        Row: {
          id: string;
          user_id: string;
          status: 'pending' | 'processing' | 'completed' | 'expired';
          export_format: 'json' | 'csv';
          download_url: string | null;
          expires_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['data_export_requests']['Row'], 'id' | 'created_at'> & { id?: string };
        Update: Partial<Database['public']['Tables']['data_export_requests']['Row']>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

// Convenient Type Aliases
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type EmissionFactor = Database['public']['Tables']['emission_factors']['Row'];
export type Activity = Database['public']['Tables']['activities']['Row'];
export type ActivityLog = Database['public']['Tables']['activity_logs']['Row'];
export type Alternative = Database['public']['Tables']['alternatives']['Row'];
export type Recommendation = Database['public']['Tables']['recommendations']['Row'];
export type UserAction = Database['public']['Tables']['user_actions']['Row'];
export type Goal = Database['public']['Tables']['goals']['Row'];
export type Challenge = Database['public']['Tables']['challenges']['Row'];
export type Badge = Database['public']['Tables']['badges']['Row'];
