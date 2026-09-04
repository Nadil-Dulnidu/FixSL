-- ==============================================================================
-- FixSL — Database Schema DDL (Supabase / PostgreSQL)
-- Sri Lankan Civic Infrastructure Issue Reporting Platform
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Sequence for auto-incrementing public tracking numbers (e.g. FIX-1001)
CREATE SEQUENCE IF NOT EXISTS issue_tracking_seq START WITH 1001 INCREMENT BY 1;

-- 2. Create Issues Table
CREATE TABLE IF NOT EXISTS issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_number INTEGER NOT NULL UNIQUE DEFAULT nextval('issue_tracking_seq'),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (
    category IN ('pothole', 'road_damage', 'broken_streetlight', 'garbage', 'blocked_drain', 'other')
  ),
  status TEXT NOT NULL DEFAULT 'reported' CHECK (
    status IN ('reported', 'verified', 'in_progress', 'resolved')
  ),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (
    priority IN ('low', 'medium', 'high', 'critical')
  ),
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  location_name TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Create Issue Feedback Table (Verification & Dispute)
CREATE TABLE IF NOT EXISTS issue_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  feedback_type TEXT NOT NULL CHECK (
    feedback_type IN ('confirm', 'dispute', 'resolution_confirm', 'resolution_dispute')
  ),
  session_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Ensure a session can only submit one feedback per type for a given issue
  CONSTRAINT unique_issue_session_feedback UNIQUE (issue_id, session_id, feedback_type)
);

-- 4. Indexes for Performance & Search
CREATE INDEX IF NOT EXISTS idx_issues_status ON issues(status);
CREATE INDEX IF NOT EXISTS idx_issues_category ON issues(category);
CREATE INDEX IF NOT EXISTS idx_issues_priority ON issues(priority);
CREATE INDEX IF NOT EXISTS idx_issues_tracking_number ON issues(tracking_number);
CREATE INDEX IF NOT EXISTS idx_issues_created_at ON issues(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_issue_feedback_issue_id ON issue_feedback(issue_id);

-- 5. Updated_At Trigger Function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_issues_updated_at ON issues;
CREATE TRIGGER set_issues_updated_at
BEFORE UPDATE ON issues
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 6. Row Level Security (RLS) Configuration
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE issue_feedback ENABLE ROW LEVEL SECURITY;

-- Issues Policies
-- Anyone (public anonymous) can read issues
DROP POLICY IF EXISTS "Public can view issues" ON issues;
CREATE POLICY "Public can view issues" ON issues
  FOR SELECT USING (true);

-- Anyone can submit an issue
DROP POLICY IF EXISTS "Public can insert issues" ON issues;
CREATE POLICY "Public can insert issues" ON issues
  FOR INSERT WITH CHECK (true);

-- Service role can update issues (admin actions / server actions)
DROP POLICY IF EXISTS "Service role can update issues" ON issues;
CREATE POLICY "Service role can update issues" ON issues
  FOR UPDATE USING (true);

-- Issue Feedback Policies
-- Public can view feedback
DROP POLICY IF EXISTS "Public can view feedback" ON issue_feedback;
CREATE POLICY "Public can view feedback" ON issue_feedback
  FOR SELECT USING (true);

-- Public can insert feedback (deduplicated by unique constraint)
DROP POLICY IF EXISTS "Public can insert feedback" ON issue_feedback;
CREATE POLICY "Public can insert feedback" ON issue_feedback
  FOR INSERT WITH CHECK (true);
