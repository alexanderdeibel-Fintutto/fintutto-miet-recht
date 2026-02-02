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
      buildings: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string | null
          id: string
          name: string
          organization_id: string
          postal_code: string | null
          total_area: number | null
          total_units: number | null
          year_built: number | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          id?: string
          name: string
          organization_id: string
          postal_code?: string | null
          total_area?: number | null
          total_units?: number | null
          year_built?: number | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          id?: string
          name?: string
          organization_id?: string
          postal_code?: string | null
          total_area?: number | null
          total_units?: number | null
          year_built?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "buildings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      calculations: {
        Row: {
          created_at: string
          id: string
          input_json: Json
          result_json: Json
          title: string
          type: Database["public"]["Enums"]["calculation_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          input_json?: Json
          result_json?: Json
          title: string
          type: Database["public"]["Enums"]["calculation_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          input_json?: Json
          result_json?: Json
          title?: string
          type?: Database["public"]["Enums"]["calculation_type"]
          user_id?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          content_json: Json
          created_at: string
          file_size: number | null
          file_url: string | null
          id: string
          is_draft: boolean
          organization_id: string | null
          title: string
          type: Database["public"]["Enums"]["document_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          content_json?: Json
          created_at?: string
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_draft?: boolean
          organization_id?: string | null
          title: string
          type: Database["public"]["Enums"]["document_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          content_json?: Json
          created_at?: string
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_draft?: boolean
          organization_id?: string | null
          title?: string
          type?: Database["public"]["Enums"]["document_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      leases: {
        Row: {
          created_at: string | null
          deposit_amount: number | null
          end_date: string | null
          id: string
          payment_day: number | null
          rent_amount: number
          start_date: string
          status: string | null
          tenant_id: string
          unit_id: string
          utilities_advance: number | null
        }
        Insert: {
          created_at?: string | null
          deposit_amount?: number | null
          end_date?: string | null
          id?: string
          payment_day?: number | null
          rent_amount: number
          start_date: string
          status?: string | null
          tenant_id: string
          unit_id: string
          utilities_advance?: number | null
        }
        Update: {
          created_at?: string | null
          deposit_amount?: number | null
          end_date?: string | null
          id?: string
          payment_day?: number | null
          rent_amount?: number
          start_date?: string
          status?: string | null
          tenant_id?: string
          unit_id?: string
          utilities_advance?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "leases_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          recipient_id: string
          sender_id: string
          subject: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          recipient_id: string
          sender_id: string
          subject?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          recipient_id?: string
          sender_id?: string
          subject?: string | null
        }
        Relationships: []
      }
      meter_readings: {
        Row: {
          confidence: number | null
          created_at: string | null
          id: string
          image_url: string | null
          is_verified: boolean | null
          meter_id: string
          reading_date: string
          reading_value: number
          source: string | null
          submitted_by: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_verified?: boolean | null
          meter_id: string
          reading_date: string
          reading_value: number
          source?: string | null
          submitted_by: string
        }
        Update: {
          confidence?: number | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_verified?: boolean | null
          meter_id?: string
          reading_date?: string
          reading_value?: number
          source?: string | null
          submitted_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "meter_readings_meter_id_fkey"
            columns: ["meter_id"]
            isOneToOne: false
            referencedRelation: "meters"
            referencedColumns: ["id"]
          },
        ]
      }
      meters: {
        Row: {
          created_at: string | null
          id: string
          installation_date: string | null
          meter_number: string
          meter_type: string
          unit_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          installation_date?: string | null
          meter_number: string
          meter_type: string
          unit_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          installation_date?: string | null
          meter_number?: string
          meter_type?: string
          unit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meters_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      operating_cost_items: {
        Row: {
          allocation_key: string | null
          amount: number
          cost_type: string
          created_at: string | null
          id: string
          operating_cost_id: string
        }
        Insert: {
          allocation_key?: string | null
          amount: number
          cost_type: string
          created_at?: string | null
          id?: string
          operating_cost_id: string
        }
        Update: {
          allocation_key?: string | null
          amount?: number
          cost_type?: string
          created_at?: string | null
          id?: string
          operating_cost_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "operating_cost_items_operating_cost_id_fkey"
            columns: ["operating_cost_id"]
            isOneToOne: false
            referencedRelation: "operating_costs"
            referencedColumns: ["id"]
          },
        ]
      }
      operating_costs: {
        Row: {
          building_id: string
          created_at: string | null
          id: string
          period_end: string
          period_start: string
          status: string | null
        }
        Insert: {
          building_id: string
          created_at?: string | null
          id?: string
          period_end: string
          period_start: string
          status?: string | null
        }
        Update: {
          building_id?: string
          created_at?: string | null
          id?: string
          period_end?: string
          period_start?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "operating_costs_building_id_fkey"
            columns: ["building_id"]
            isOneToOne: false
            referencedRelation: "buildings"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string | null
          id: string
          name: string
          stripe_customer_id: string | null
          subscription_plan: string | null
          type: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          stripe_customer_id?: string | null
          subscription_plan?: string | null
          type?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          stripe_customer_id?: string | null
          subscription_plan?: string | null
          type?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          organization_id: string | null
          subscription_tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          organization_id?: string | null
          subscription_tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          organization_id?: string | null
          subscription_tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to: string | null
          building_id: string | null
          category: string | null
          completed_at: string | null
          created_at: string | null
          created_by: string
          description: string | null
          due_date: string | null
          id: string
          priority: string | null
          status: string | null
          title: string
          unit_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          building_id?: string | null
          category?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          title: string
          unit_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          building_id?: string | null
          category?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          title?: string
          unit_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_building_id_fkey"
            columns: ["building_id"]
            isOneToOne: false
            referencedRelation: "buildings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      units: {
        Row: {
          area: number | null
          building_id: string
          created_at: string | null
          floor: number | null
          id: string
          rooms: number | null
          status: string | null
          type: string | null
          unit_number: string
        }
        Insert: {
          area?: number | null
          building_id: string
          created_at?: string | null
          floor?: number | null
          id?: string
          rooms?: number | null
          status?: string | null
          type?: string | null
          unit_number: string
        }
        Update: {
          area?: number | null
          building_id?: string
          created_at?: string | null
          floor?: number | null
          id?: string
          rooms?: number | null
          status?: string | null
          type?: string | null
          unit_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "units_building_id_fkey"
            columns: ["building_id"]
            isOneToOne: false
            referencedRelation: "buildings"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      count_user_documents: { Args: { _user_id: string }; Returns: number }
      get_user_tier: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["subscription_tier"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      user_has_building_access: {
        Args: { _building_id: string; _user_id: string }
        Returns: boolean
      }
      user_has_unit_access: {
        Args: { _unit_id: string; _user_id: string }
        Returns: boolean
      }
      user_is_tenant_of_unit: {
        Args: { _unit_id: string; _user_id: string }
        Returns: boolean
      }
      user_organization_id: { Args: { _user_id: string }; Returns: string }
    }
    Enums: {
      app_role:
        | "admin"
        | "moderator"
        | "user"
        | "vermieter"
        | "mieter"
        | "hausmeister"
      calculation_type:
        | "rendite"
        | "finanzierung"
        | "nebenkosten"
        | "kaufnebenkosten"
      document_type:
        | "standard_mietvertrag"
        | "moebliert_mietvertrag"
        | "wg_mietvertrag"
        | "gewerbe_mietvertrag"
        | "kuendigung_mieter"
        | "kuendigung_vermieter"
        | "sonderkuendigung"
        | "nebenkostenabrechnung"
        | "heizkostenabrechnung"
        | "uebergabeprotokoll"
        | "maengelprotokoll"
        | "mieterhoehung"
        | "mietminderung"
        | "kaution"
        | "mahnung"
      subscription_tier: "free" | "premium"
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
      app_role: [
        "admin",
        "moderator",
        "user",
        "vermieter",
        "mieter",
        "hausmeister",
      ],
      calculation_type: [
        "rendite",
        "finanzierung",
        "nebenkosten",
        "kaufnebenkosten",
      ],
      document_type: [
        "standard_mietvertrag",
        "moebliert_mietvertrag",
        "wg_mietvertrag",
        "gewerbe_mietvertrag",
        "kuendigung_mieter",
        "kuendigung_vermieter",
        "sonderkuendigung",
        "nebenkostenabrechnung",
        "heizkostenabrechnung",
        "uebergabeprotokoll",
        "maengelprotokoll",
        "mieterhoehung",
        "mietminderung",
        "kaution",
        "mahnung",
      ],
      subscription_tier: ["free", "premium"],
    },
  },
} as const
