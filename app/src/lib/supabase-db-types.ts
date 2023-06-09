export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
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
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
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
      customers: {
        Row: {
          address_line_1: string | null
          address_line_2: string | null
          city: string | null
          country: string | null
          email: string
          family_name: string | null
          given_name: string | null
          id: string
          inserted_at: string
          postcode: string | null
          updated_at: string
        }
        Insert: {
          address_line_1?: string | null
          address_line_2?: string | null
          city?: string | null
          country?: string | null
          email: string
          family_name?: string | null
          given_name?: string | null
          id?: string
          inserted_at?: string
          postcode?: string | null
          updated_at?: string
        }
        Update: {
          address_line_1?: string | null
          address_line_2?: string | null
          city?: string | null
          country?: string | null
          email?: string
          family_name?: string | null
          given_name?: string | null
          id?: string
          inserted_at?: string
          postcode?: string | null
          updated_at?: string
        }
      }
      employees: {
        Row: {
          email: string
          family_name: string
          given_name: string
          id: string
          inserted_at: string
          role: Database["public"]["Enums"]["employee_role"]
          updated_at: string
        }
        Insert: {
          email: string
          family_name: string
          given_name: string
          id?: string
          inserted_at?: string
          role?: Database["public"]["Enums"]["employee_role"]
          updated_at?: string
        }
        Update: {
          email?: string
          family_name?: string
          given_name?: string
          id?: string
          inserted_at?: string
          role?: Database["public"]["Enums"]["employee_role"]
          updated_at?: string
        }
      }
      equipment: {
        Row: {
          equipment_type_id: string
          id: string
          inserted_at: string
          is_available: boolean
          notes: string | null
          updated_at: string
        }
        Insert: {
          equipment_type_id: string
          id?: string
          inserted_at?: string
          is_available?: boolean
          notes?: string | null
          updated_at?: string
        }
        Update: {
          equipment_type_id?: string
          id?: string
          inserted_at?: string
          is_available?: boolean
          notes?: string | null
          updated_at?: string
        }
      }
      equipment_types: {
        Row: {
          daily_price: number
          deposit_price: number
          description: string
          hourly_price: number
          id: string
          image_url: string | null
          inserted_at: string
          name: string
          updated_at: string
          weekly_price: number
        }
        Insert: {
          daily_price: number
          deposit_price: number
          description: string
          hourly_price: number
          id?: string
          image_url?: string | null
          inserted_at?: string
          name: string
          updated_at?: string
          weekly_price: number
        }
        Update: {
          daily_price?: number
          deposit_price?: number
          description?: string
          hourly_price?: number
          id?: string
          image_url?: string | null
          inserted_at?: string
          name?: string
          updated_at?: string
          weekly_price?: number
        }
      }
      hires: {
        Row: {
          end_at: string
          equipment_id: string
          id: string
          inserted_at: string
          is_collected: boolean
          is_deposit_paid: boolean
          is_deposit_returned: boolean
          is_paid: boolean
          is_returned: boolean
          order_id: string
          start_at: string
          updated_at: string
        }
        Insert: {
          end_at: string
          equipment_id: string
          id?: string
          inserted_at?: string
          is_collected?: boolean
          is_deposit_paid?: boolean
          is_deposit_returned?: boolean
          is_paid?: boolean
          is_returned?: boolean
          order_id: string
          start_at: string
          updated_at?: string
        }
        Update: {
          end_at?: string
          equipment_id?: string
          id?: string
          inserted_at?: string
          is_collected?: boolean
          is_deposit_paid?: boolean
          is_deposit_returned?: boolean
          is_paid?: boolean
          is_returned?: boolean
          order_id?: string
          start_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          customer_id: string
          id: string
          inserted_at: string
          is_online: boolean
          updated_at: string
        }
        Insert: {
          customer_id: string
          id?: string
          inserted_at?: string
          is_online: boolean
          updated_at?: string
        }
        Update: {
          customer_id?: string
          id?: string
          inserted_at?: string
          is_online?: boolean
          updated_at?: string
        }
      }
      products: {
        Row: {
          description: string
          id: string
          image_url: string | null
          inserted_at: string
          name: string
          price: number
          stock: number
          updated_at: string
        }
        Insert: {
          description: string
          id?: string
          image_url?: string | null
          inserted_at?: string
          name: string
          price: number
          stock: number
          updated_at?: string
        }
        Update: {
          description?: string
          id?: string
          image_url?: string | null
          inserted_at?: string
          name?: string
          price?: number
          stock?: number
          updated_at?: string
        }
      }
      purchases: {
        Row: {
          id: string
          inserted_at: string
          is_cancelled: boolean
          is_collected: boolean
          is_delivered: boolean
          is_paid: boolean
          is_refunded: boolean
          is_returned: boolean
          order_id: string
          product_id: string
          quantity: number
          updated_at: string
        }
        Insert: {
          id?: string
          inserted_at?: string
          is_cancelled?: boolean
          is_collected?: boolean
          is_delivered?: boolean
          is_paid?: boolean
          is_refunded?: boolean
          is_returned?: boolean
          order_id: string
          product_id: string
          quantity: number
          updated_at?: string
        }
        Update: {
          id?: string
          inserted_at?: string
          is_cancelled?: boolean
          is_collected?: boolean
          is_delivered?: boolean
          is_paid?: boolean
          is_refunded?: boolean
          is_returned?: boolean
          order_id?: string
          product_id?: string
          quantity?: number
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      employee_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
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

