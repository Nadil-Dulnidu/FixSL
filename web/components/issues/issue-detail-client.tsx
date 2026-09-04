"use client";

import React from "react";
import { VerificationPanel } from "@/components/issues/verification-panel";
import { ResolutionFeedback } from "@/components/issues/resolution-feedback";
import type { FeedbackCounts } from "@/lib/actions/feedback";

interface IssueDetailClientProps {
  issueId: string;
  issueStatus: string;
  initialCounts: FeedbackCounts;
}

/**
 * Client wrapper that conditionally renders either:
 * - VerificationPanel (for non-resolved issues: reported, verified, in_progress)
 * - ResolutionFeedback (for resolved issues)
 */
export function IssueDetailClient({
  issueId,
  issueStatus,
  initialCounts,
}: IssueDetailClientProps) {
  if (issueStatus === "resolved") {
    return (
      <ResolutionFeedback issueId={issueId} initialCounts={initialCounts} />
    );
  }

  return (
    <VerificationPanel issueId={issueId} initialCounts={initialCounts} />
  );
}
