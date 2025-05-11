export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
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
      personnel: {
        Row: {
          active: boolean | null
          created_at: string | null
          id: string
          name: string
          position: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          name: string
          position?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          name?: string
          position?: string | null
        }
        Relationships: []
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
          team_id: string | null
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
          team_id?: string | null
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
          team_id?: string | null
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
      settings: {
        Row: {
          company_address: string | null
          company_email: string | null
          company_logo: string | null
          company_manager_name: string | null
          company_name: string | null
          company_phone: string | null
          created_at: string | null
          id: string
          login_background_image: string | null
          updated_at: string | null
        }
        Insert: {
          company_address?: string | null
          company_email?: string | null
          company_logo?: string | null
          company_manager_name?: string | null
          company_name?: string | null
          company_phone?: string | null
          created_at?: string | null
          id?: string
          login_background_image?: string | null
          updated_at?: string | null
        }
        Update: {
          company_address?: string | null
          company_email?: string | null
          company_logo?: string | null
          company_manager_name?: string | null
          company_name?: string | null
          company_phone?: string | null
          created_at?: string | null
          id?: string
          login_background_image?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      teams: {
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
      work_logs: {
        Row: {
          address: string | null
          arrival: string | null
          break_time: string | null
          client_name: string | null
          client_signature: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          date: string
          departure: string | null
          end_time: string | null
          hourly_rate: number | null
          id: string
          invoiced: boolean | null
          is_archived: boolean | null
          is_blank_worksheet: boolean | null
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
          break_time?: string | null
          client_name?: string | null
          client_signature?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          date: string
          departure?: string | null
          end_time?: string | null
          hourly_rate?: number | null
          id?: string
          invoiced?: boolean | null
          is_archived?: boolean | null
          is_blank_worksheet?: boolean | null
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
          break_time?: string | null
          client_name?: string | null
          client_signature?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          date?: string
          departure?: string | null
          end_time?: string | null
          hourly_rate?: number | null
          id?: string
          invoiced?: boolean | null
          is_archived?: boolean | null
          is_blank_worksheet?: boolean | null
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
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
