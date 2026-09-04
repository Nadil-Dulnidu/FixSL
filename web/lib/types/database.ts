export type IssueCategory =
  | "pothole"
  | "road_damage"
  | "broken_streetlight"
  | "garbage"
  | "blocked_drain"
  | "other";

export type IssueStatus = "reported" | "verified" | "in_progress" | "resolved";

export type IssuePriority = "low" | "medium" | "high" | "critical";

export type FeedbackType =
  | "confirm"
  | "dispute"
  | "resolution_confirm"
  | "resolution_dispute";

export interface Issue {
  id: string;
  tracking_number: number;
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  priority: IssuePriority;
  latitude: number;
  longitude: number;
  location_name: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface IssueWithFeedbackCount extends Issue {
  confirm_count?: number;
  dispute_count?: number;
  resolution_confirm_count?: number;
  resolution_dispute_count?: number;
  is_disputed?: boolean;
}

export interface IssueFeedback {
  id: string;
  issue_id: string;
  feedback_type: FeedbackType;
  session_id: string;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      issues: {
        Row: Issue;
        Insert: {
          id?: string;
          tracking_number?: number;
          title: string;
          description: string;
          category: IssueCategory;
          status?: IssueStatus;
          priority?: IssuePriority;
          latitude: number;
          longitude: number;
          location_name?: string | null;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tracking_number?: number;
          title?: string;
          description?: string;
          category?: IssueCategory;
          status?: IssueStatus;
          priority?: IssuePriority;
          latitude?: number;
          longitude?: number;
          location_name?: string | null;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      issue_feedback: {
        Row: IssueFeedback;
        Insert: {
          id?: string;
          issue_id: string;
          feedback_type: FeedbackType;
          session_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          issue_id?: string;
          feedback_type?: FeedbackType;
          session_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      issue_category: IssueCategory;
      issue_status: IssueStatus;
      issue_priority: IssuePriority;
      feedback_type: FeedbackType;
    };
    CompositeTypes: Record<string, never>;
  };
}
