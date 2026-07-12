export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type LinkTag = "social" | "email" | "marketing" | "personal" | "other";

export interface Database {
  public: {
    Tables: {
      links: {
        Row: {
          id: string;
          user_id: string | null;
          original_url: string;
          short_code: string;
          is_custom_alias: boolean;
          title: string | null;
          tag: LinkTag | null;
          is_archived: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          original_url: string;
          short_code: string;
          is_custom_alias?: boolean;
          title?: string | null;
          tag?: LinkTag | null;
          is_archived?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          original_url?: string;
          short_code?: string;
          is_custom_alias?: boolean;
          title?: string | null;
          tag?: LinkTag | null;
          is_archived?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      clicks: {
        Row: {
          id: string;
          link_id: string;
          clicked_at: string;
          referrer: string | null;
          user_agent: string | null;
          country: string | null;
        };
        Insert: {
          id?: string;
          link_id: string;
          clicked_at?: string;
          referrer?: string | null;
          user_agent?: string | null;
          country?: string | null;
        };
        Update: {
          id?: string;
          link_id?: string;
          clicked_at?: string;
          referrer?: string | null;
          user_agent?: string | null;
          country?: string | null;
        };
        Relationships: [];
      };
      rate_limits: {
        Row: {
          ip_address: string;
          request_date: string;
          request_count: number;
        };
        Insert: {
          ip_address: string;
          request_date?: string;
          request_count?: number;
        };
        Update: {
          ip_address?: string;
          request_date?: string;
          request_count?: number;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
