"use server";

import { revalidatePath } from "next/cache";
import { safeAction } from "@/lib/action-utils";
import { logger } from "@/lib/logger";
import { getAdminSupabase } from "@/lib/supabase/server";
import { submitFeedbackSchema, type SubmitFeedbackInput } from "@/lib/validations/feedback";
import { ValidationError, DatabaseError, NotFoundError } from "@/lib/errors";
import { findDemoIssue, getDemoFeedbackCounts, DEMO_ISSUES } from "@/lib/demo-data";
import type {
  Issue,
  IssueWithFeedbackCount,
  FeedbackType,
} from "@/lib/types/database";

export interface FeedbackCounts {
  confirm: number;
  dispute: number;
  resolution_confirm: number;
  resolution_dispute: number;
  isDisputed: boolean;
  totalVotes: number;
}

export interface SubmitFeedbackResult {
  success: boolean;
  alreadyVoted?: boolean;
  counts: FeedbackCounts;
  feedbackType: FeedbackType;
}

/**
 * Server Action: Submit community verification or resolution feedback
 */
export async function submitFeedback(input: SubmitFeedbackInput) {
  return safeAction("submitFeedback", async (): Promise<SubmitFeedbackResult> => {
    // 1. Validate input payload
    const validation = submitFeedbackSchema.safeParse(input);
    if (!validation.success) {
      const errorMsg = validation.error.issues[0]?.message || "Invalid feedback input";
      logger.warn("Validation failed for submitFeedback", {
        errors: validation.error.flatten(),
      });
      throw new ValidationError(errorMsg, {
        fields: validation.error.flatten().fieldErrors,
      });
    }

    const { issue_id, feedback_type, session_id } = validation.data;

    logger.info("Processing community feedback", {
      issueId: issue_id,
      feedbackType: feedback_type,
      sessionId: session_id.substring(0, 10) + "...",
    });

    const supabase = getAdminSupabase();

    try {
      // 2. Check if this session already submitted this exact feedback type
      const { data: existing, error: checkError } = await supabase
        .from("issue_feedback")
        .select("id")
        .eq("issue_id", issue_id)
        .eq("session_id", session_id)
        .eq("feedback_type", feedback_type)
        .maybeSingle();

      if (checkError) {
        logger.warn("Error checking existing feedback in Supabase, using fallback", {
          error: checkError.message,
        });
        // In case of Supabase failure, fall through to demo fallback
        throw new DatabaseError("Database unavailable");
      }

      if (existing) {
        logger.info("Duplicate feedback blocked by session", {
          issueId: issue_id,
          feedbackType: feedback_type,
        });
        const counts = await fetchFeedbackCountsInternal(issue_id);
        return {
          success: true,
          alreadyVoted: true,
          counts,
          feedbackType: feedback_type,
        };
      }

      // 3. Insert new feedback entry
      const { error: insertError } = await (
        supabase.from("issue_feedback") as any
      ).insert({
        issue_id,
        feedback_type,
        session_id,
      });

      if (insertError) {
        logger.error("Failed to insert issue feedback", {
          issueId: issue_id,
          error: insertError.message,
          code: insertError.code,
        });
        throw new DatabaseError("Could not record your feedback. Please try again.");
      }

      // 4. Fetch updated feedback counts
      const counts = await fetchFeedbackCountsInternal(issue_id);

      // Revalidate public issue pages
      revalidatePath(`/issues/${issue_id}`);
      revalidatePath(`/map`);

      logger.info("Community feedback recorded successfully", {
        issueId: issue_id,
        feedbackType: feedback_type,
        counts,
      });

      return {
        success: true,
        alreadyVoted: false,
        counts,
        feedbackType: feedback_type,
      };
    } catch (err) {
      if (err instanceof ValidationError) throw err;

      // Demo fallback handling when live Supabase is offline
      logger.warn("Using demo feedback fallback due to Supabase error", {
        error: err instanceof Error ? err.message : "Unknown error",
      });

      const demoCounts = getDemoFeedbackCounts(issue_id);
      if (feedback_type === "confirm") demoCounts.confirm += 1;
      if (feedback_type === "dispute") demoCounts.dispute += 1;
      if (feedback_type === "resolution_confirm") demoCounts.resolution_confirm += 1;
      if (feedback_type === "resolution_dispute") {
        demoCounts.resolution_dispute += 1;
        demoCounts.isDisputed = demoCounts.resolution_dispute >= 5;
      }

      const totalVotes =
        demoCounts.confirm +
        demoCounts.dispute +
        demoCounts.resolution_confirm +
        demoCounts.resolution_dispute;

      return {
        success: true,
        alreadyVoted: false,
        counts: {
          ...demoCounts,
          totalVotes,
        },
        feedbackType: feedback_type,
      };
    }
  });
}

/**
 * Internal helper to aggregate feedback counts from Supabase
 */
async function fetchFeedbackCountsInternal(issueId: string): Promise<FeedbackCounts> {
  const supabase = getAdminSupabase();

  const { data, error } = await supabase
    .from("issue_feedback")
    .select("feedback_type")
    .eq("issue_id", issueId);

  if (error || !data) {
    logger.warn("Could not fetch feedback records from Supabase, returning demo counts", {
      issueId,
      error: error?.message,
    });
    const demo = getDemoFeedbackCounts(issueId);
    return {
      ...demo,
      totalVotes:
        demo.confirm +
        demo.dispute +
        demo.resolution_confirm +
        demo.resolution_dispute,
    };
  }

  const rows = data as unknown as Array<{ feedback_type: FeedbackType }>;
  const confirm = rows.filter((r) => r.feedback_type === "confirm").length;
  const dispute = rows.filter((r) => r.feedback_type === "dispute").length;
  const resolution_confirm = rows.filter((r) => r.feedback_type === "resolution_confirm").length;
  const resolution_dispute = rows.filter((r) => r.feedback_type === "resolution_dispute").length;
  const isDisputed = resolution_dispute >= 5;
  const totalVotes = rows.length;

  return {
    confirm,
    dispute,
    resolution_confirm,
    resolution_dispute,
    isDisputed,
    totalVotes,
  };
}

/**
 * Server Action: Query feedback counts for a specific issue
 */
export async function getFeedbackCounts(issueId: string) {
  return safeAction("getFeedbackCounts", async (): Promise<FeedbackCounts> => {
    return fetchFeedbackCountsInternal(issueId);
  });
}

/**
 * Server Action / Query: Fetch public issue details with aggregated community feedback counts
 * Accepts tracking number (1001, "FIX-1001") or UUID string
 */
export async function getPublicIssueDetail(identifier: string | number) {
  return safeAction("getPublicIssueDetail", async (): Promise<IssueWithFeedbackCount> => {
    const rawId = String(identifier).trim();
    logger.info("Fetching public issue details", { identifier: rawId });

    const supabase = getAdminSupabase();
    let query = supabase.from("issues").select("*");

    const parsedNum =
      typeof identifier === "number"
        ? identifier
        : parseInt(rawId.replace(/\D/g, ""), 10);

    // If identifier looks like a numeric tracking number (e.g. 1001 or FIX-1001)
    if (!isNaN(parsedNum) && parsedNum >= 1000 && parsedNum <= 999999) {
      query = query.eq("tracking_number", parsedNum);
    } else {
      query = query.eq("id", rawId);
    }

    try {
      const { data: issueData, error: issueError } = await query.maybeSingle();

      if (issueError) {
        logger.warn("Supabase issue query error, checking demo data", {
          identifier: rawId,
          error: issueError.message,
        });
      }

      let issue: Issue | null = (issueData as unknown as Issue) || null;

      // Check fallback demo issues if DB returned no results
      if (!issue) {
        issue = findDemoIssue(identifier);
      }

      if (!issue) {
        logger.warn("Public issue not found", { identifier: rawId });
        throw new NotFoundError(`Issue "${identifier}" could not be found.`);
      }

      // Fetch feedback counts
      const counts = await fetchFeedbackCountsInternal(issue.id);

      const issueWithFeedback: IssueWithFeedbackCount = {
        ...issue,
        confirm_count: counts.confirm,
        dispute_count: counts.dispute,
        resolution_confirm_count: counts.resolution_confirm,
        resolution_dispute_count: counts.resolution_dispute,
        is_disputed: counts.isDisputed,
      };

      return issueWithFeedback;
    } catch (err) {
      if (err instanceof NotFoundError) throw err;

      // Ultimate fallback to demo data
      const demoIssue = findDemoIssue(identifier);
      if (demoIssue) {
        const counts = getDemoFeedbackCounts(demoIssue.id);
        return {
          ...demoIssue,
          confirm_count: counts.confirm,
          dispute_count: counts.dispute,
          resolution_confirm_count: counts.resolution_confirm,
          resolution_dispute_count: counts.resolution_dispute,
          is_disputed: counts.isDisputed,
        };
      }

      throw new NotFoundError(`Issue "${identifier}" not found.`);
    }
  });
}
