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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      active_sessions: {
        Row: {
          device_fingerprint: string | null
          expires_at: string
          geolocation: Json | null
          id: string
          ip_address: unknown
          is_suspicious: boolean | null
          last_activity: string
          login_time: string
          mfa_verified: boolean | null
          session_token_hash: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          device_fingerprint?: string | null
          expires_at: string
          geolocation?: Json | null
          id?: string
          ip_address: unknown
          is_suspicious?: boolean | null
          last_activity?: string
          login_time?: string
          mfa_verified?: boolean | null
          session_token_hash: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          device_fingerprint?: string | null
          expires_at?: string
          geolocation?: Json | null
          id?: string
          ip_address?: unknown
          is_suspicious?: boolean | null
          last_activity?: string
          login_time?: string
          mfa_verified?: boolean | null
          session_token_hash?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      blank_worksheet_consumables: {
        Row: {
          blank_worksheet_id: string | null
          id: string
          product: string
          quantity: number
          saved_for_reuse: boolean | null
          supplier: string
          total_price: number
          unit: string
          unit_price: number
        }
        Insert: {
          blank_worksheet_id?: string | null
          id?: string
          product: string
          quantity: number
          saved_for_reuse?: boolean | null
          supplier: string
          total_price: number
          unit: string
          unit_price: number
        }
        Update: {
          blank_worksheet_id?: string | null
          id?: string
          product?: string
          quantity?: number
          saved_for_reuse?: boolean | null
          supplier?: string
          total_price?: number
          unit?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "blank_worksheet_consumables_blank_worksheet_id_fkey"
            columns: ["blank_worksheet_id"]
            isOneToOne: false
            referencedRelation: "blank_worksheets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_blank_worksheet_consumables_worksheet_id"
            columns: ["blank_worksheet_id"]
            isOneToOne: false
            referencedRelation: "blank_worksheets"
            referencedColumns: ["id"]
          },
        ]
      }
      blank_worksheets: {
        Row: {
          address: string | null
          arrival: string | null
          break_time: string | null
          client_name: string | null
          client_signature: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          created_by: string | null
          date: string
          departure: string | null
          end_time: string | null
          hourly_rate: number | null
          id: string
          invoiced: boolean | null
          is_archived: boolean | null
          is_quote_signed: boolean | null
          linked_project_id: string | null
          notes: string | null
          personnel: string[]
          signed_quote_amount: number | null
          tasks: string | null
          total_hours: number
          waste_management: string | null
          water_consumption: number | null
        }
        Insert: {
          address?: string | null
          arrival?: string | null
          break_time?: string | null
          client_name?: string | null
          client_signature?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          created_by?: string | null
          date: string
          departure?: string | null
          end_time?: string | null
          hourly_rate?: number | null
          id?: string
          invoiced?: boolean | null
          is_archived?: boolean | null
          is_quote_signed?: boolean | null
          linked_project_id?: string | null
          notes?: string | null
          personnel?: string[]
          signed_quote_amount?: number | null
          tasks?: string | null
          total_hours?: number
          waste_management?: string | null
          water_consumption?: number | null
        }
        Update: {
          address?: string | null
          arrival?: string | null
          break_time?: string | null
          client_name?: string | null
          client_signature?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          created_by?: string | null
          date?: string
          departure?: string | null
          end_time?: string | null
          hourly_rate?: number | null
          id?: string
          invoiced?: boolean | null
          is_archived?: boolean | null
          is_quote_signed?: boolean | null
          linked_project_id?: string | null
          notes?: string | null
          personnel?: string[]
          signed_quote_amount?: number | null
          tasks?: string | null
          total_hours?: number
          waste_management?: string | null
          water_consumption?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_blank_worksheets_linked_project_id"
            columns: ["linked_project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      client_connections: {
        Row: {
          assigned_projects: string[] | null
          client_name: string
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          last_login: string | null
          password: string
          visibility_permissions: Json | null
        }
        Insert: {
          assigned_projects?: string[] | null
          client_name: string
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          password: string
          visibility_permissions?: Json | null
        }
        Update: {
          assigned_projects?: string[] | null
          client_name?: string
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          password?: string
          visibility_permissions?: Json | null
        }
        Relationships: []
      }
      consumables: {
        Row: {
          id: string
          product: string
          quantity: number
          saved_for_reuse: boolean | null
          supplier: string
          total_price: number
          unit: string
          unit_price: number
          work_log_id: string | null
        }
        Insert: {
          id?: string
          product: string
          quantity: number
          saved_for_reuse?: boolean | null
          supplier: string
          total_price: number
          unit: string
          unit_price: number
          work_log_id?: string | null
        }
        Update: {
          id?: string
          product?: string
          quantity?: number
          saved_for_reuse?: boolean | null
          supplier?: string
          total_price?: number
          unit?: string
          unit_price?: number
          work_log_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consumables_work_log_id_fkey"
            columns: ["work_log_id"]
            isOneToOne: false
            referencedRelation: "work_logs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_consumables_work_log_id"
            columns: ["work_log_id"]
            isOneToOne: false
            referencedRelation: "work_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_tasks: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      data_access_log: {
        Row: {
          created_at: string
          error_message: string | null
          execution_time_ms: number | null
          id: string
          ip_address: unknown | null
          operation: string
          query_hash: string | null
          record_ids: string[] | null
          row_count: number | null
          success: boolean
          table_name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          ip_address?: unknown | null
          operation: string
          query_hash?: string | null
          record_ids?: string[] | null
          row_count?: number | null
          success: boolean
          table_name: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          ip_address?: unknown | null
          operation?: string
          query_hash?: string | null
          record_ids?: string[] | null
          row_count?: number | null
          success?: boolean
          table_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      login_history: {
        Row: {
          created_at: string
          id: string
          ip_address: string | null
          login_time: string
          user_agent: string | null
          user_email: string
          user_id: string
          user_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address?: string | null
          login_time?: string
          user_agent?: string | null
          user_email: string
          user_id: string
          user_name: string
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: string | null
          login_time?: string
          user_agent?: string | null
          user_email?: string
          user_id?: string
          user_name?: string
        }
        Relationships: []
      }
      monthly_passage_distributions: {
        Row: {
          created_at: string
          id: string
          monthly_visits: Json
          project_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          monthly_visits?: Json
          project_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          monthly_visits?: Json
          project_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_monthly_passage_distributions_project_id"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      personnel: {
        Row: {
          active: boolean | null
          created_at: string | null
          driving_license: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          employee_id: string | null
          hire_date: string | null
          hourly_rate: number | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          position: string | null
          skills: string[] | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          driving_license?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employee_id?: string | null
          hire_date?: string | null
          hourly_rate?: number | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          position?: string | null
          skills?: string[] | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          driving_license?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employee_id?: string | null
          hire_date?: string | null
          hourly_rate?: number | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          position?: string | null
          skills?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          permissions: Json | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          permissions?: Json | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          permissions?: Json | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      project_day_locks: {
        Row: {
          created_at: string
          day_of_week: number
          description: string | null
          id: string
          is_active: boolean
          min_days_between_visits: number | null
          project_id: string
          reason: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          description?: string | null
          id?: string
          is_active?: boolean
          min_days_between_visits?: number | null
          project_id: string
          reason: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          description?: string | null
          id?: string
          is_active?: boolean
          min_days_between_visits?: number | null
          project_id?: string
          reason?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_project_day_locks_project_id"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_documents: {
        Row: {
          created_at: string | null
          file_path: string
          file_size: number | null
          file_type: string
          id: string
          name: string
          project_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          file_path: string
          file_size?: number | null
          file_type: string
          id?: string
          name: string
          project_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          file_path?: string
          file_size?: number | null
          file_type?: string
          id?: string
          name?: string
          project_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_teams: {
        Row: {
          created_at: string | null
          id: string
          is_primary: boolean | null
          project_id: string
          team_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          project_id: string
          team_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          project_id?: string
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_project_teams_project_id"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_project_teams_team_id"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_teams_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_teams_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          additional_info: string | null
          address: string
          annual_total_hours: number | null
          annual_visits: number | null
          client_name: string | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          contract_details: string | null
          contract_document_url: string | null
          created_at: string | null
          end_date: string | null
          id: string
          irrigation: string | null
          is_archived: boolean | null
          mower_type: string | null
          name: string
          project_type: string | null
          start_date: string | null
          visit_duration: number | null
        }
        Insert: {
          additional_info?: string | null
          address: string
          annual_total_hours?: number | null
          annual_visits?: number | null
          client_name?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contract_details?: string | null
          contract_document_url?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          irrigation?: string | null
          is_archived?: boolean | null
          mower_type?: string | null
          name: string
          project_type?: string | null
          start_date?: string | null
          visit_duration?: number | null
        }
        Update: {
          additional_info?: string | null
          address?: string
          annual_total_hours?: number | null
          annual_visits?: number | null
          client_name?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contract_details?: string | null
          contract_document_url?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          irrigation?: string | null
          is_archived?: boolean | null
          mower_type?: string | null
          name?: string
          project_type?: string | null
          start_date?: string | null
          visit_duration?: number | null
        }
        Relationships: []
      }
      saved_consumables: {
        Row: {
          created_at: string | null
          id: string
          product: string
          quantity: number
          saved_for_reuse: boolean | null
          supplier: string
          total_price: number
          unit: string
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          product: string
          quantity: number
          saved_for_reuse?: boolean | null
          supplier: string
          total_price: number
          unit: string
          unit_price: number
        }
        Update: {
          created_at?: string | null
          id?: string
          product?: string
          quantity?: number
          saved_for_reuse?: boolean | null
          supplier?: string
          total_price?: number
          unit?: string
          unit_price?: number
        }
        Relationships: []
      }
      security_events: {
        Row: {
          created_at: string
          event_details: Json
          event_type: string
          geolocation: Json | null
          id: string
          ip_address: unknown | null
          resolution_notes: string | null
          resolved_at: string | null
          resource_accessed: string | null
          risk_score: number | null
          session_id: string | null
          severity: string
          user_agent: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_details?: Json
          event_type: string
          geolocation?: Json | null
          id?: string
          ip_address?: unknown | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resource_accessed?: string | null
          risk_score?: number | null
          session_id?: string | null
          severity?: string
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_details?: Json
          event_type?: string
          geolocation?: Json | null
          id?: string
          ip_address?: unknown | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resource_accessed?: string | null
          risk_score?: number | null
          session_id?: string | null
          severity?: string
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          app_configuration: Json | null
          auto_save_enabled: boolean | null
          company_address: string | null
          company_email: string | null
          company_logo: string | null
          company_manager_name: string | null
          company_name: string | null
          company_phone: string | null
          created_at: string | null
          default_break_time: string | null
          default_work_end_time: string | null
          default_work_start_time: string | null
          hourly_rate: number | null
          id: string
          login_background_image: string | null
          notification_preferences: Json | null
          theme_preference: string | null
          updated_at: string | null
          user_preferences: Json | null
          vat_rate: string | null
        }
        Insert: {
          app_configuration?: Json | null
          auto_save_enabled?: boolean | null
          company_address?: string | null
          company_email?: string | null
          company_logo?: string | null
          company_manager_name?: string | null
          company_name?: string | null
          company_phone?: string | null
          created_at?: string | null
          default_break_time?: string | null
          default_work_end_time?: string | null
          default_work_start_time?: string | null
          hourly_rate?: number | null
          id?: string
          login_background_image?: string | null
          notification_preferences?: Json | null
          theme_preference?: string | null
          updated_at?: string | null
          user_preferences?: Json | null
          vat_rate?: string | null
        }
        Update: {
          app_configuration?: Json | null
          auto_save_enabled?: boolean | null
          company_address?: string | null
          company_email?: string | null
          company_logo?: string | null
          company_manager_name?: string | null
          company_name?: string | null
          company_phone?: string | null
          created_at?: string | null
          default_break_time?: string | null
          default_work_end_time?: string | null
          default_work_start_time?: string | null
          hourly_rate?: number | null
          id?: string
          login_background_image?: string | null
          notification_preferences?: Json | null
          theme_preference?: string | null
          updated_at?: string | null
          user_preferences?: Json | null
          vat_rate?: string | null
        }
        Relationships: []
      }
      teams: {
        Row: {
          color: string | null
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      work_logs: {
        Row: {
          address: string | null
          arrival: string | null
          attached_documents: Json | null
          break_time: string | null
          client_name: string | null
          client_signature: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          created_by: string | null
          date: string
          departure: string | null
          end_time: string | null
          hourly_rate: number | null
          id: string
          invoiced: boolean | null
          is_archived: boolean | null
          is_quote_signed: boolean | null
          linked_project_id: string | null
          notes: string | null
          personnel: string[]
          project_id: string
          signed_quote_amount: number | null
          tasks: string | null
          total_hours: number
          waste_management: string | null
          water_consumption: number | null
        }
        Insert: {
          address?: string | null
          arrival?: string | null
          attached_documents?: Json | null
          break_time?: string | null
          client_name?: string | null
          client_signature?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          created_by?: string | null
          date: string
          departure?: string | null
          end_time?: string | null
          hourly_rate?: number | null
          id?: string
          invoiced?: boolean | null
          is_archived?: boolean | null
          is_quote_signed?: boolean | null
          linked_project_id?: string | null
          notes?: string | null
          personnel: string[]
          project_id: string
          signed_quote_amount?: number | null
          tasks?: string | null
          total_hours?: number
          waste_management?: string | null
          water_consumption?: number | null
        }
        Update: {
          address?: string | null
          arrival?: string | null
          attached_documents?: Json | null
          break_time?: string | null
          client_name?: string | null
          client_signature?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          created_by?: string | null
          date?: string
          departure?: string | null
          end_time?: string | null
          hourly_rate?: number | null
          id?: string
          invoiced?: boolean | null
          is_archived?: boolean | null
          is_quote_signed?: boolean | null
          linked_project_id?: string | null
          notes?: string | null
          personnel?: string[]
          project_id?: string
          signed_quote_amount?: number | null
          tasks?: string | null
          total_hours?: number
          waste_management?: string | null
          water_consumption?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_work_logs_linked_project_id"
            columns: ["linked_project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_work_logs_project_id"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_audit_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_security_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: string
      }
      has_permission_level: {
        Args: { required_level: string; user_id: string }
        Returns: boolean
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_manager_or_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
