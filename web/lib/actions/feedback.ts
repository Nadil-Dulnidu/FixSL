"use server";

import { safeAction } from "@/lib/action-utils";
import { logger } from "@/lib/logger";
import { getAdminSupabase } from "@/lib/supabase/server";
import { submitFeedbackSchema } from "@/lib/validations/feedback";
import { ValidationError, DatabaseError } from "@/lib/errors";

export interface FeedbackCounts {
  confirm: number;
  dispute: number;
  resolution_confirm: number;
  resolution_dispute: number;
}

/**
 * Server Action: Submit community verification feedback for an issue.
 * Deduplication is enforced via a UNIQUE constraint on (issue_id, session_id, feedback_type).
 */
export async function submitFeedback(input: {
  issue_id: string;
  feedback_type: string;
  session_id: string;
}) {
  return safeAction("submitFeedback", async () => {
    // 1. Validate input
    const validationResult = submitFeedbackSchema.safeParse(input);

    if (!validationResult.success) {
      const errorMsg =
        validationResult.error.issues[0]?.message || "Invalid feedback data";
      logger.warn("Feedback validation failed", {
        errors: validationResult.error.flatten(),
        input,
      });
      throw new ValidationError(errorMsg, {
        fields: validationResult.error.flatten().fieldErrors,
      });
    }

    const validated = validationResult.data;

    logger.info("Submitting feedback", {
      issueId: validated.issue_id,
      type: validated.feedback_type,
      sessionId: validated.session_id.substring(0, 8) + "...",
    });

    // 2. Insert feedback into Supabase
    const supabase = getAdminSupabase();

    const { error: insertError } = await supabase
      .from("issue_feedback")
      // @ts-expect-error Supabase schema type inference
      .insert({
        issue_id: validated.issue_id,
        feedback_type: validated.feedback_type,
        session_id: validated.session_id,
      });

    if (insertError) {
      // Check for duplicate constraint violation
      if (
        insertError.code === "23505" ||
        insertError.message?.includes("duplicate") ||
        insertError.message?.includes("unique")
      ) {
        logger.info("Duplicate feedback blocked", {
          issueId: validated.issue_id,
          sessionId: validated.session_id.substring(0, 8) + "...",
          type: validated.feedback_type,
        });
        throw new ValidationError(
          "You have already submitted this type of feedback for this issue."
        );
      }

      logger.error("Failed to insert feedback", {
        error: insertError.message,
        code: insertError.code,
      });
      throw new DatabaseError("Could not save your feedback. Please try again.");
    }

    logger.info("Feedback submitted successfully", {
      issueId: validated.issue_id,
      type: validated.feedback_type,
    });

    return { submitted: true, feedbackType: validated.feedback_type };
  });
}

/**
 * Server Action: Fetch aggregated feedback counts for a specific issue.
 */
export async function getFeedbackCounts(issueId: string) {
  return safeAction("getFeedbackCounts", async (): Promise<FeedbackCounts> => {
    const supabase = getAdminSupabase();

    const { data, error } = await supabase
      .from("issue_feedback")
      .select("feedback_type")
      .eq("issue_id", issueId);

    if (error) {
      logger.error("Failed to fetch feedback counts", {
        issueId,
        error: error.message,
      });
      throw new DatabaseError("Could not load feedback data.");
    }

    const rows = (data as unknown as Array<{ feedback_type: string }>) || [];

    const counts: FeedbackCounts = {
      confirm: 0,
      dispute: 0,
      resolution_confirm: 0,
      resolution_dispute: 0,
    };

    for (const row of rows) {
      if (row.feedback_type in counts) {
        counts[row.feedback_type as keyof FeedbackCounts]++;
      }
    }

    return counts;
  });
}

/**
 * Server Action: Check if a specific session has already submitted a feedback type for an issue.
 */
export async function hasUserSubmittedFeedback(
  issueId: string,
  sessionId: string,
  feedbackType: string
) {
  return safeAction("hasUserSubmittedFeedback", async (): Promise<boolean> => {
    const supabase = getAdminSupabase();

    const { data, error } = await supabase
      .from("issue_feedback")
      .select("id")
      .eq("issue_id", issueId)
      .eq("session_id", sessionId)
      .eq("feedback_type", feedbackType)
      .maybeSingle();

    if (error) {
      logger.warn("Error checking submitted feedback", {
        issueId,
        error: error.message,
      });
      return false;
    }

    return data !== null;
  });
}
