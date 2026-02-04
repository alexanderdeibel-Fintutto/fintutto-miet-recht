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
      ai_cross_sell_triggers: {
        Row: {
          created_at: string | null
          cta_text: string | null
          headline: string
          id: string
          is_active: boolean | null
          message: string
          priority: number | null
          source_app_id: string
          target_app_id: string
          trigger_context: string | null
          trigger_type: string
        }
        Insert: {
          created_at?: string | null
          cta_text?: string | null
          headline: string
          id?: string
          is_active?: boolean | null
          message: string
          priority?: number | null
          source_app_id: string
          target_app_id: string
          trigger_context?: string | null
          trigger_type?: string
        }
        Update: {
          created_at?: string | null
          cta_text?: string | null
          headline?: string
          id?: string
          is_active?: boolean | null
          message?: string
          priority?: number | null
          source_app_id?: string
          target_app_id?: string
          trigger_context?: string | null
          trigger_type?: string
        }
        Relationships: []
      }
      ai_usage_log: {
        Row: {
          action: string
          app_id: string | null
          cost_cents: number | null
          created_at: string | null
          form_slug: string | null
          id: string
          input_tokens: number | null
          model: string | null
          output_tokens: number | null
          user_id: string
        }
        Insert: {
          action: string
          app_id?: string | null
          cost_cents?: number | null
          created_at?: string | null
          form_slug?: string | null
          id?: string
          input_tokens?: number | null
          model?: string | null
          output_tokens?: number | null
          user_id: string
        }
        Update: {
          action?: string
          app_id?: string | null
          cost_cents?: number | null
          created_at?: string | null
          form_slug?: string | null
          id?: string
          input_tokens?: number | null
          model?: string | null
          output_tokens?: number | null
          user_id?: string
        }
        Relationships: []
      }
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
      bundle_form_templates: {
        Row: {
          bundle_id: string
          form_template_id: string
        }
        Insert: {
          bundle_id: string
          form_template_id: string
        }
        Update: {
          bundle_id?: string
          form_template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bundle_form_templates_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "bundles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bundle_form_templates_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "v_bundles_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bundle_form_templates_form_template_id_fkey"
            columns: ["form_template_id"]
            isOneToOne: false
            referencedRelation: "form_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bundle_form_templates_form_template_id_fkey"
            columns: ["form_template_id"]
            isOneToOne: false
            referencedRelation: "v_form_templates_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bundle_form_templates_form_template_id_fkey"
            columns: ["form_template_id"]
            isOneToOne: false
            referencedRelation: "v_user_available_forms"
            referencedColumns: ["form_template_id"]
          },
        ]
      }
      bundles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          price_cents: number
          slug: string
          stripe_price_id: string | null
          thumbnail_url: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          price_cents?: number
          slug: string
          stripe_price_id?: string | null
          thumbnail_url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          price_cents?: number
          slug?: string
          stripe_price_id?: string | null
          thumbnail_url?: string | null
        }
        Relationships: []
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
      form_purchases: {
        Row: {
          amount_cents: number
          bundle_id: string | null
          form_template_id: string | null
          id: string
          purchased_at: string | null
          status: string | null
          stripe_payment_intent: string | null
          user_id: string
        }
        Insert: {
          amount_cents?: number
          bundle_id?: string | null
          form_template_id?: string | null
          id?: string
          purchased_at?: string | null
          status?: string | null
          stripe_payment_intent?: string | null
          user_id: string
        }
        Update: {
          amount_cents?: number
          bundle_id?: string | null
          form_template_id?: string | null
          id?: string
          purchased_at?: string | null
          status?: string | null
          stripe_payment_intent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "form_purchases_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "bundles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_purchases_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "v_bundles_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_purchases_form_template_id_fkey"
            columns: ["form_template_id"]
            isOneToOne: false
            referencedRelation: "form_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_purchases_form_template_id_fkey"
            columns: ["form_template_id"]
            isOneToOne: false
            referencedRelation: "v_form_templates_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_purchases_form_template_id_fkey"
            columns: ["form_template_id"]
            isOneToOne: false
            referencedRelation: "v_user_available_forms"
            referencedColumns: ["form_template_id"]
          },
        ]
      }
      form_templates: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          fields: Json
          id: string
          is_active: boolean | null
          name: string
          persona: string
          price_cents: number
          seo_description: string | null
          seo_keywords: string[] | null
          seo_title: string | null
          slug: string
          sort_order: number | null
          stripe_price_id: string | null
          template_content: string | null
          thumbnail_url: string | null
          tier: string
        }
        Insert: {
          category?: string
          created_at?: string | null
          description?: string | null
          fields?: Json
          id?: string
          is_active?: boolean | null
          name: string
          persona?: string
          price_cents?: number
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          slug: string
          sort_order?: number | null
          stripe_price_id?: string | null
          template_content?: string | null
          thumbnail_url?: string | null
          tier?: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          fields?: Json
          id?: string
          is_active?: boolean | null
          name?: string
          persona?: string
          price_cents?: number
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          slug?: string
          sort_order?: number | null
          stripe_price_id?: string | null
          template_content?: string | null
          thumbnail_url?: string | null
          tier?: string
        }
        Relationships: []
      }
      generated_documents: {
        Row: {
          created_at: string | null
          form_slug: string
          form_template_id: string | null
          id: string
          input_data: Json
          pdf_url: string | null
          status: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          form_slug: string
          form_template_id?: string | null
          id?: string
          input_data?: Json
          pdf_url?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          form_slug?: string
          form_template_id?: string | null
          id?: string
          input_data?: Json
          pdf_url?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "generated_documents_form_template_id_fkey"
            columns: ["form_template_id"]
            isOneToOne: false
            referencedRelation: "form_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generated_documents_form_template_id_fkey"
            columns: ["form_template_id"]
            isOneToOne: false
            referencedRelation: "v_form_templates_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generated_documents_form_template_id_fkey"
            columns: ["form_template_id"]
            isOneToOne: false
            referencedRelation: "v_user_available_forms"
            referencedColumns: ["form_template_id"]
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
      products: {
        Row: {
          app_id: string
          app_url: string | null
          created_at: string | null
          description: string | null
          features: Json | null
          icon_url: string | null
          id: string
          is_active: boolean | null
          name: string
          price_cents: number
          sort_order: number | null
          stripe_price_id: string | null
          updated_at: string | null
        }
        Insert: {
          app_id: string
          app_url?: string | null
          created_at?: string | null
          description?: string | null
          features?: Json | null
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          price_cents?: number
          sort_order?: number | null
          stripe_price_id?: string | null
          updated_at?: string | null
        }
        Update: {
          app_id?: string
          app_url?: string | null
          created_at?: string | null
          description?: string | null
          features?: Json | null
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          price_cents?: number
          sort_order?: number | null
          stripe_price_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          organization_id: string | null
          persona: string | null
          subscription_tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          organization_id?: string | null
          persona?: string | null
          subscription_tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          organization_id?: string | null
          persona?: string | null
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
      user_form_designs: {
        Row: {
          created_at: string | null
          design_config: Json
          id: string
          is_default: boolean | null
          name: string
          org_id: string | null
          shared_with_org: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          design_config?: Json
          id?: string
          is_default?: boolean | null
          name?: string
          org_id?: string | null
          shared_with_org?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          design_config?: Json
          id?: string
          is_default?: boolean | null
          name?: string
          org_id?: string | null
          shared_with_org?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_form_designs_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_form_drafts: {
        Row: {
          current_step: number | null
          draft_data: Json
          form_template_id: string
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          current_step?: number | null
          draft_data?: Json
          form_template_id: string
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          current_step?: number | null
          draft_data?: Json
          form_template_id?: string
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_form_drafts_form_template_id_fkey"
            columns: ["form_template_id"]
            isOneToOne: false
            referencedRelation: "form_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_form_drafts_form_template_id_fkey"
            columns: ["form_template_id"]
            isOneToOne: false
            referencedRelation: "v_form_templates_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_form_drafts_form_template_id_fkey"
            columns: ["form_template_id"]
            isOneToOne: false
            referencedRelation: "v_user_available_forms"
            referencedColumns: ["form_template_id"]
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
      user_subscriptions: {
        Row: {
          app_id: string
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_id: string
          status: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          app_id?: string
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id?: string
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          app_id?: string
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id?: string
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      v_ai_usage_user: {
        Row: {
          action: string | null
          app_id: string | null
          created_at: string | null
          form_slug: string | null
          id: string | null
          input_tokens: number | null
          model: string | null
          output_tokens: number | null
          user_id: string | null
        }
        Insert: {
          action?: string | null
          app_id?: string | null
          created_at?: string | null
          form_slug?: string | null
          id?: string | null
          input_tokens?: number | null
          model?: string | null
          output_tokens?: number | null
          user_id?: string | null
        }
        Update: {
          action?: string | null
          app_id?: string | null
          created_at?: string | null
          form_slug?: string | null
          id?: string | null
          input_tokens?: number | null
          model?: string | null
          output_tokens?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      v_bundles_public: {
        Row: {
          created_at: string | null
          description: string | null
          id: string | null
          is_active: boolean | null
          name: string | null
          price_cents: number | null
          slug: string | null
          thumbnail_url: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string | null
          is_active?: boolean | null
          name?: string | null
          price_cents?: number | null
          slug?: string | null
          thumbnail_url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string | null
          is_active?: boolean | null
          name?: string | null
          price_cents?: number | null
          slug?: string | null
          thumbnail_url?: string | null
        }
        Relationships: []
      }
      v_form_templates_public: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string | null
          is_active: boolean | null
          name: string | null
          persona: string | null
          price_cents: number | null
          seo_description: string | null
          seo_keywords: string[] | null
          seo_title: string | null
          slug: string | null
          sort_order: number | null
          thumbnail_url: string | null
          tier: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          is_active?: boolean | null
          name?: string | null
          persona?: string | null
          price_cents?: number | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          slug?: string | null
          sort_order?: number | null
          thumbnail_url?: string | null
          tier?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          is_active?: boolean | null
          name?: string | null
          persona?: string | null
          price_cents?: number | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          slug?: string | null
          sort_order?: number | null
          thumbnail_url?: string | null
          tier?: string | null
        }
        Relationships: []
      }
      v_user_available_forms: {
        Row: {
          form_template_id: string | null
          has_access: boolean | null
          name: string | null
          price_cents: number | null
          slug: string | null
          tier: string | null
          user_id: string | null
        }
        Insert: {
          form_template_id?: string | null
          has_access?: never
          name?: string | null
          price_cents?: number | null
          slug?: string | null
          tier?: string | null
          user_id?: never
        }
        Update: {
          form_template_id?: string | null
          has_access?: never
          name?: string | null
          price_cents?: number | null
          slug?: string | null
          tier?: string | null
          user_id?: never
        }
        Relationships: []
      }
    }
    Functions: {
      count_user_documents: { Args: { _user_id: string }; Returns: number }
      get_form_template_with_access: {
        Args: { template_slug: string }
        Returns: {
          category: string
          created_at: string
          description: string
          fields: Json
          has_access: boolean
          id: string
          is_active: boolean
          name: string
          persona: string
          price_cents: number
          seo_description: string
          seo_keywords: string[]
          seo_title: string
          slug: string
          sort_order: number
          template_content: string
          thumbnail_url: string
          tier: string
        }[]
      }
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
      user_has_form_access: {
        Args: { _form_template_id: string; _user_id: string }
        Returns: boolean
      }
      user_has_organization: { Args: { _user_id: string }; Returns: boolean }
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
