export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      coach_weekly_ratings: {
        Row: {
          category_id: Database["public"]["Enums"]["rating_category"]
          coach_id: string
          created_at: string
          goalie_id: string
          id: string
          score: number
          updated_at: string
          week_start: string
        }
        Insert: {
          category_id: Database["public"]["Enums"]["rating_category"]
          coach_id: string
          created_at?: string
          goalie_id: string
          id?: string
          score: number
          updated_at?: string
          week_start: string
        }
        Update: {
          category_id?: Database["public"]["Enums"]["rating_category"]
          coach_id?: string
          created_at?: string
          goalie_id?: string
          id?: string
          score?: number
          updated_at?: string
          week_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "coach_weekly_ratings_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coach_weekly_ratings_goalie_id_fkey"
            columns: ["goalie_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      practice_sessions: {
        Row: {
          created_at: string
          goalie_id: string
          id: string
          post_compete: number | null
          post_confidence: number | null
          post_decision_making: number | null
          post_focus: number | null
          post_focus_hit: boolean | null
          post_hands: number | null
          post_movement_control: number | null
          post_note: string | null
          post_positioning: number | null
          post_reads: number | null
          post_rebound_control: number | null
          post_skating_edges: number | null
          post_stick: number | null
          post_submitted_at: string | null
          post_tracking: number | null
          practice_date: string
          pre_body: number | null
          pre_confidence: number | null
          pre_energy: number | null
          pre_focus: number | null
          pre_focus_area: Database["public"]["Enums"]["focus_area"] | null
          pre_mental_readiness: number | null
          pre_one_thing: string
          pre_submitted_at: string | null
          season_id: string
          status: Database["public"]["Enums"]["checkin_status"]
        }
        Insert: {
          created_at?: string
          goalie_id: string
          id?: string
          post_compete?: number | null
          post_confidence?: number | null
          post_decision_making?: number | null
          post_focus?: number | null
          post_focus_hit?: boolean | null
          post_hands?: number | null
          post_movement_control?: number | null
          post_note?: string | null
          post_positioning?: number | null
          post_reads?: number | null
          post_rebound_control?: number | null
          post_skating_edges?: number | null
          post_stick?: number | null
          post_submitted_at?: string | null
          post_tracking?: number | null
          practice_date?: string
          pre_body?: number | null
          pre_confidence?: number | null
          pre_energy?: number | null
          pre_focus?: number | null
          pre_focus_area?: Database["public"]["Enums"]["focus_area"] | null
          pre_mental_readiness?: number | null
          pre_one_thing: string
          pre_submitted_at?: string | null
          season_id: string
          status?: Database["public"]["Enums"]["checkin_status"]
        }
        Update: {
          created_at?: string
          goalie_id?: string
          id?: string
          post_compete?: number | null
          post_confidence?: number | null
          post_decision_making?: number | null
          post_focus?: number | null
          post_focus_hit?: boolean | null
          post_hands?: number | null
          post_movement_control?: number | null
          post_note?: string | null
          post_positioning?: number | null
          post_reads?: number | null
          post_rebound_control?: number | null
          post_skating_edges?: number | null
          post_stick?: number | null
          post_submitted_at?: string | null
          post_tracking?: number | null
          practice_date?: string
          pre_body?: number | null
          pre_confidence?: number | null
          pre_energy?: number | null
          pre_focus?: number | null
          pre_focus_area?: Database["public"]["Enums"]["focus_area"] | null
          pre_mental_readiness?: number | null
          pre_one_thing?: string
          pre_submitted_at?: string | null
          season_id?: string
          status?: Database["public"]["Enums"]["checkin_status"]
        }
        Relationships: [
          {
            foreignKeyName: "practice_sessions_goalie_id_fkey"
            columns: ["goalie_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "practice_sessions_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          created_at?: string
          full_name: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      season_goals: {
        Row: {
          become_statement: string
          biggest_goal: string
          compete_score: number
          confidence_score: number
          created_at: string
          edge_control_score: number
          goalie_id: string
          hands_score: number
          hockey_iq_score: number
          holding_back: string[]
          id: string
          movement_control_score: number
          positioning_score: number
          priorities_reason: string | null
          reads_score: number
          rebound_control_score: number
          recovery_score: number
          season_id: string
          season_target: string
          skating_score: number
          stick_score: number
          strengths: string[]
          top_priorities: string[]
          tracking_score: number
          updated_at: string
        }
        Insert: {
          become_statement: string
          biggest_goal: string
          compete_score: number
          confidence_score: number
          created_at?: string
          edge_control_score: number
          goalie_id: string
          hands_score: number
          hockey_iq_score: number
          holding_back?: string[]
          id?: string
          movement_control_score: number
          positioning_score: number
          priorities_reason?: string | null
          reads_score: number
          rebound_control_score: number
          recovery_score: number
          season_id: string
          season_target: string
          skating_score: number
          stick_score: number
          strengths?: string[]
          top_priorities?: string[]
          tracking_score: number
          updated_at?: string
        }
        Update: {
          become_statement?: string
          biggest_goal?: string
          compete_score?: number
          confidence_score?: number
          created_at?: string
          edge_control_score?: number
          goalie_id?: string
          hands_score?: number
          hockey_iq_score?: number
          holding_back?: string[]
          id?: string
          movement_control_score?: number
          positioning_score?: number
          priorities_reason?: string | null
          reads_score?: number
          rebound_control_score?: number
          recovery_score?: number
          season_id?: string
          season_target?: string
          skating_score?: number
          stick_score?: number
          strengths?: string[]
          top_priorities?: string[]
          tracking_score?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "season_goals_goalie_id_fkey"
            columns: ["goalie_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "season_goals_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      seasons: {
        Row: {
          created_at: string
          ends_on: string | null
          id: string
          is_active: boolean
          name: string
          starts_on: string
          team_id: string
        }
        Insert: {
          created_at?: string
          ends_on?: string | null
          id?: string
          is_active?: boolean
          name: string
          starts_on: string
          team_id: string
        }
        Update: {
          created_at?: string
          ends_on?: string | null
          id?: string
          is_active?: boolean
          name?: string
          starts_on?: string
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "seasons_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_memberships: {
        Row: {
          id: string
          joined_at: string
          profile_id: string
          role: Database["public"]["Enums"]["user_role"]
          team_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          profile_id: string
          role: Database["public"]["Enums"]["user_role"]
          team_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          profile_id?: string
          role?: Database["public"]["Enums"]["user_role"]
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_memberships_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_memberships_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string
          created_by: string
          id: string
          invite_code: string
          name: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          invite_code: string
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          invite_code?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_team_with_coach: {
        Args: { team_name: string }
        Returns: {
          created_at: string
          created_by: string
          id: string
          invite_code: string
          name: string
        }
        SetofOptions: {
          from: "*"
          to: "teams"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      generate_invite_code: { Args: never; Returns: string }
      is_team_coach: { Args: { p_team_id: string }; Returns: boolean }
      is_team_member: { Args: { p_team_id: string }; Returns: boolean }
      is_teammate_coach: { Args: { p_goalie_id: string }; Returns: boolean }
      join_team_by_invite_code: {
        Args: { code: string }
        Returns: {
          created_at: string
          created_by: string
          id: string
          invite_code: string
          name: string
        }
        SetofOptions: {
          from: "*"
          to: "teams"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      team_id_for_season: { Args: { p_season_id: string }; Returns: string }
    }
    Enums: {
      checkin_status: "pre_only" | "completed"
      focus_area:
        | "tracking"
        | "skating"
        | "movement"
        | "positioning"
        | "rebound_control"
        | "hands"
        | "stick"
        | "reads"
        | "recovery"
        | "compete"
        | "mental_game"
        | "other"
      rating_category:
        | "tracking"
        | "skating_edges"
        | "movement_control"
        | "positioning"
        | "rebound_control"
        | "hands"
        | "stick"
        | "focus"
        | "confidence"
        | "compete"
        | "reads"
        | "decision_making"
      user_role: "goalie" | "coach"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      checkin_status: ["pre_only", "completed"],
      focus_area: [
        "tracking",
        "skating",
        "movement",
        "positioning",
        "rebound_control",
        "hands",
        "stick",
        "reads",
        "recovery",
        "compete",
        "mental_game",
        "other",
      ],
      rating_category: [
        "tracking",
        "skating_edges",
        "movement_control",
        "positioning",
        "rebound_control",
        "hands",
        "stick",
        "focus",
        "confidence",
        "compete",
        "reads",
        "decision_making",
      ],
      user_role: ["goalie", "coach"],
    },
  },
} as const

