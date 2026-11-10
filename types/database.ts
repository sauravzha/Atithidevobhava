export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRoleType =
  | "traveller"
  | "local_member"
  | "experience_provider"
  | "accommodation_host";

export type AdminRoleType =
  | "super_admin"
  | "moderator"
  | "verification_reviewer"
  | "finance"
  | "content";

export type ConnectionStatusType =
  | "PENDING"
  | "ACCEPTED"
  | "DECLINED"
  | "EXPIRED"
  | "WITHDRAWN"
  | "SCHEDULED"
  | "COMPLETED"
  | "CANCELLED";

export type ExperienceStatusType =
  | "draft"
  | "pending_review"
  | "published"
  | "changes_requested"
  | "rejected"
  | "suspended";

export type ExperienceBookingStatusType =
  | "draft"
  | "pending"
  | "accepted"
  | "payment_pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "refunded"
  | "disputed";

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          mobile_number_encrypted: string | null;
          birth_year: number;
          is_suspended: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          mobile_number_encrypted?: string | null;
          birth_year: number;
          is_suspended?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          mobile_number_encrypted?: string | null;
          birth_year?: number;
          is_suspended?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role: UserRoleType;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: UserRoleType;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: UserRoleType;
          created_at?: string;
        };
      };
      admin_permissions: {
        Row: {
          id: string;
          user_id: string;
          admin_role: AdminRoleType;
          granted_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          admin_role: AdminRoleType;
          granted_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          admin_role?: AdminRoleType;
          granted_by?: string | null;
          created_at?: string;
        };
      };
      admin_audit_logs: {
        Row: {
          id: string;
          action: string;
          target_entity: string;
          target_id: string | null;
          performed_by: string;
          reason: string;
          ip_address: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          action: string;
          target_entity: string;
          target_id?: string | null;
          performed_by: string;
          reason: string;
          ip_address?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: never; // Append-only by trigger
      };
      platform_settings: {
        Row: {
          key: string;
          value: Json;
          description: string;
          updated_by: string | null;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: Json;
          description: string;
          updated_by?: string | null;
          updated_at?: string;
        };
        Update: {
          key?: string;
          value?: Json;
          description?: string;
          updated_by?: string | null;
          updated_at?: string;
        };
      };
      connections: {
        Row: {
          id: string;
          traveller_id: string;
          local_member_id: string;
          purpose: string;
          suggested_public_place: string;
          proposed_dates: string;
          initial_message: string;
          status: ConnectionStatusType;
          decline_reason: string | null;
          idempotency_key: string;
          scheduled_at: string | null;
          completed_at: string | null;
          cancelled_at: string | null;
          cancelled_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          traveller_id: string;
          local_member_id: string;
          purpose: string;
          suggested_public_place: string;
          proposed_dates: string;
          initial_message: string;
          status?: ConnectionStatusType;
          decline_reason?: string | null;
          idempotency_key: string;
          scheduled_at?: string | null;
          completed_at?: string | null;
          cancelled_at?: string | null;
          cancelled_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          traveller_id?: string;
          local_member_id?: string;
          purpose?: string;
          suggested_public_place?: string;
          proposed_dates?: string;
          initial_message?: string;
          status?: ConnectionStatusType;
          decline_reason?: string | null;
          idempotency_key?: string;
          scheduled_at?: string | null;
          completed_at?: string | null;
          cancelled_at?: string | null;
          cancelled_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      v_public_people: {
        Row: {
          user_id: string;
          display_name: string;
          bio_intro: string;
          photo_url: string | null;
          visibility: string;
          state_name: string;
          state_name_hi: string;
          district_name: string;
          district_name_hi: string;
          city_name: string | null;
          preferred_public_meeting_area: string;
          availability_summary: string | null;
          is_email_verified: boolean;
          is_mobile_verified: boolean;
          is_identity_verified: boolean;
          languages: string[];
          interests: string[];
          created_at: string;
        };
      };
      v_public_experiences: {
        Row: {
          id: string;
          title_en: string;
          title_hi: string;
          slug: string;
          category: string;
          description_en: string;
          description_hi: string;
          state_name: string;
          district_name: string;
          city_name: string;
          general_meeting_area: string;
          duration_minutes: number;
          price_per_person_paise: number | null;
          min_participants: number;
          max_participants: number;
          included: string[] | null;
          excluded: string[] | null;
          cancellation_policy: string;
          safety_information: string;
          host_display_name: string;
          host_photo_url: string | null;
          created_at: string;
        };
      };
      v_public_locations: {
        Row: {
          district_id: string;
          district_name: string;
          district_name_hi: string;
          state_id: string;
          state_name: string;
          state_name_hi: string;
          centroid_lat: number | null;
          centroid_lng: number | null;
          permits_notice: string | null;
          public_hosts_count: number;
          published_experiences_count: number;
        };
      };
    };
    Functions: {
      can_reveal: {
        Args: {
          p_connection_or_booking_id: string;
          p_viewer_id: string;
          p_field: string;
        };
        Returns: boolean;
      };
      book_experience: {
        Args: {
          p_schedule_id: string;
          p_traveller_id: string;
          p_participants: number;
          p_idempotency_key: string;
        };
        Returns: string;
      };
      cancel_booking: {
        Args: {
          p_booking_id: string;
          p_cancelled_by: string;
          p_reason: string;
        };
        Returns: boolean;
      };
      record_payment_capture: {
        Args: {
          p_booking_id: string;
          p_payment_order_id: string;
          p_payment_id: string;
          p_amount_paise: number;
          p_provider?: string;
        };
        Returns: string;
      };
      record_payment_refund: {
        Args: {
          p_payment_id: string;
          p_reason: string;
        };
        Returns: string;
      };
      record_payment_webhook: {
        Args: {
          p_provider: string;
          p_event_id: string;
          p_event_type: string;
          p_payload: Json;
        };
        Returns: boolean;
      };
      submit_stay_booking_request: {
        Args: {
          p_listing_id: string;
          p_traveller_id: string;
          p_check_in: string;
          p_check_out: string;
          p_adult_count: number;
          p_child_count: number;
          p_idempotency_key: string;
          p_special_requirements?: string;
        };
        Returns: string;
      };
      confirm_stay_booking: {
        Args: {
          p_request_id: string;
          p_host_id: string;
        };
        Returns: boolean;
      };
      record_guest_compliance: {
        Args: {
          p_guest_record_id: string;
          p_host_id: string;
          p_form_submitted: boolean;
          p_submission_date?: string;
          p_submission_reference?: string;
        };
        Returns: boolean;
      };
    };
  };
}

