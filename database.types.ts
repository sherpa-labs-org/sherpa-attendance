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
      absences: {
        Row: {
          completed: boolean
          created_at: string
          guardian_id: string
          id: string
          reason: string | null
          recommended_action: string | null
          school_id: string
          specialist_in_charge: string | null
          student_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          guardian_id: string
          id?: string
          reason?: string | null
          recommended_action?: string | null
          school_id: string
          specialist_in_charge?: string | null
          student_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          guardian_id?: string
          id?: string
          reason?: string | null
          recommended_action?: string | null
          school_id?: string
          specialist_in_charge?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "absences_guardian_id_fkey"
            columns: ["guardian_id"]
            isOneToOne: false
            referencedRelation: "guardians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "absences_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "absences_specialist_in_charge_fkey"
            columns: ["specialist_in_charge"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          guardian_id: string
          id: string
          label: Database["public"]["Enums"]["conversation_label"] | null
          language: string | null
          school_id: string
          students: string[] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          guardian_id: string
          id?: string
          label?: Database["public"]["Enums"]["conversation_label"] | null
          language?: string | null
          school_id: string
          students?: string[] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          guardian_id?: string
          id?: string
          label?: Database["public"]["Enums"]["conversation_label"] | null
          language?: string | null
          school_id?: string
          students?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_guardian_id_fkey"
            columns: ["guardian_id"]
            isOneToOne: false
            referencedRelation: "guardians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      districts: {
        Row: {
          address: string | null
          created_at: string | null
          data_provider: string | null
          district_contact_email: string | null
          district_contact_first_name: string | null
          district_contact_last_name: string | null
          district_contact_role: string | null
          id: string
          id_in_data_provider: string | null
          launch_date: string
          logo_url: string | null
          name: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          data_provider?: string | null
          district_contact_email?: string | null
          district_contact_first_name?: string | null
          district_contact_last_name?: string | null
          district_contact_role?: string | null
          id?: string
          id_in_data_provider?: string | null
          launch_date: string
          logo_url?: string | null
          name: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          data_provider?: string | null
          district_contact_email?: string | null
          district_contact_first_name?: string | null
          district_contact_last_name?: string | null
          district_contact_role?: string | null
          id?: string
          id_in_data_provider?: string | null
          launch_date?: string
          logo_url?: string | null
          name?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      external_system_mappings: {
        Row: {
          created_at: string | null
          district_id: string | null
          entity_type: string | null
          external_id: string | null
          external_system: string | null
          id: string
          local_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          district_id?: string | null
          entity_type?: string | null
          external_id?: string | null
          external_system?: string | null
          id?: string
          local_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          district_id?: string | null
          entity_type?: string | null
          external_id?: string | null
          external_system?: string | null
          id?: string
          local_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "external_system_mappings_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
        ]
      }
      guardians: {
        Row: {
          created_at: string
          email: string | null
          first_name: string
          id: string
          last_name: string | null
          phone: string
          relationship: string | null
          school_id: string
          students: string[] | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name: string
          id?: string
          last_name?: string | null
          phone: string
          relationship?: string | null
          school_id: string
          students?: string[] | null
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string | null
          phone?: string
          relationship?: string | null
          school_id?: string
          students?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "guardians_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          absence_id: string | null
          content: string
          conversation_id: string
          created_at: string
          id: string
          inquiry: boolean
          sendblue_message_handle: string | null
          sender_type: Database["public"]["Enums"]["type"]
          status: string
          was_downgraded: boolean | null
        }
        Insert: {
          absence_id?: string | null
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          inquiry?: boolean
          sendblue_message_handle?: string | null
          sender_type: Database["public"]["Enums"]["type"]
          status: string
          was_downgraded?: boolean | null
        }
        Update: {
          absence_id?: string | null
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          inquiry?: boolean
          sendblue_message_handle?: string | null
          sender_type?: Database["public"]["Enums"]["type"]
          status?: string
          was_downgraded?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_absence_id_fkey"
            columns: ["absence_id"]
            isOneToOne: false
            referencedRelation: "absences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      schools: {
        Row: {
          address: string | null
          auto_approve: boolean | null
          created_at: string | null
          district_id: string | null
          id: string
          id_in_data_provider: string | null
          logo_url: string | null
          name: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          auto_approve?: boolean | null
          created_at?: string | null
          district_id?: string | null
          id?: string
          id_in_data_provider?: string | null
          logo_url?: string | null
          name: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          auto_approve?: boolean | null
          created_at?: string | null
          district_id?: string | null
          id?: string
          id_in_data_provider?: string | null
          logo_url?: string | null
          name?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schools_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          district_id: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          phone_number: string | null
          role: Database["public"]["Enums"]["user_role"]
          school_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          district_id?: string | null
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone_number?: string | null
          role: Database["public"]["Enums"]["user_role"]
          school_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          district_id?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone_number?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          school_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      conversation_label: "action_needed" | "awaiting_approval"
      recommended_actions: "mark_as_completed" | "attendance_officer_take_over"
      type: "guardian" | "admin"
      user_role:
        | "district_super_admin"
        | "district_admin"
        | "school_super_admin"
        | "school_admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
