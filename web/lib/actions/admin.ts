"use server";

import { getAdminAuth } from "@/lib/auth";
import { safeAction } from "@/lib/action-utils";
import { logger } from "@/lib/logger";
import { getAdminSupabase } from "@/lib/supabase/server";
import { updateStatusSchema, updatePrioritySchema } from "@/lib/validations/admin";
import { ForbiddenError, ValidationError, DatabaseError, NotFoundError } from "@/lib/errors";
import type { Issue, IssueStatus, IssuePriority } from "@/lib/types/database";

/**
 * Verify the current user has admin role via Clerk session claims or backend user API.
 * Throws ForbiddenError if not authorized.
 */
async function requireAdmin(): Promise<string> {
  const { userId, role, isAdmin } = await getAdminAuth();

  if (!userId) {
    logger.warn("Unauthorized admin action attempt — no userId");
    throw new ForbiddenError("You must be signed in to perform this action.");
  }

  if (!isAdmin) {
    logger.warn("Forbidden admin action attempt", { userId, role });
    throw new ForbiddenError("Admin access required.");
  }

  return userId;
}

// ──────────────────────────────────────────────
// Dashboard Statistics
// ──────────────────────────────────────────────

export interface AdminStats {
  total: number;
  reported: number;
  verified: number;
  in_progress: number;
  resolved: number;
  critical: number;
  high: number;
}

export async function getAdminStats() {
  return safeAction("getAdminStats", async (): Promise<AdminStats> => {
    const supabase = getAdminSupabase();

    const { data: issues, error } = await supabase
      .from("issues")
      .select("status, priority");

    if (error) {
      logger.error("Failed to fetch admin stats", { error: error.message });
      throw new DatabaseError("Could not load dashboard statistics.");
    }

    const rows = (issues as unknown as Array<{ status: string; priority: string }>) || [];

    return {
      total: rows.length,
      reported: rows.filter((r) => r.status === "reported").length,
      verified: rows.filter((r) => r.status === "verified").length,
      in_progress: rows.filter((r) => r.status === "in_progress").length,
      resolved: rows.filter((r) => r.status === "resolved").length,
      critical: rows.filter((r) => r.priority === "critical").length,
      high: rows.filter((r) => r.priority === "high").length,
    };
  });
}

// ──────────────────────────────────────────────
// Fetch Issues for Admin Table
// ──────────────────────────────────────────────

export interface AdminIssuesFilter {
  status?: string;
  category?: string;
  priority?: string;
}

export async function getAdminIssues(filters?: AdminIssuesFilter) {
  return safeAction("getAdminIssues", async (): Promise<Issue[]> => {
    const supabase = getAdminSupabase();

    let query = supabase
      .from("issues")
      .select("*")
      .order("created_at", { ascending: false });

    if (filters?.status && filters.status !== "all") {
      query = query.eq("status", filters.status);
    }
    if (filters?.category && filters.category !== "all") {
      query = query.eq("category", filters.category);
    }
    if (filters?.priority && filters.priority !== "all") {
      query = query.eq("priority", filters.priority);
    }

    const { data, error } = await query;

    if (error) {
      logger.error("Failed to fetch admin issues", { error: error.message });
      throw new DatabaseError("Could not load issues.");
    }

    return (data as unknown as Issue[]) || [];
  });
}

// ──────────────────────────────────────────────
// Fetch Single Issue by UUID (Admin Detail)
// ──────────────────────────────────────────────

export async function getAdminIssueById(issueId: string) {
  return safeAction("getAdminIssueById", async (): Promise<Issue> => {
    const supabase = getAdminSupabase();

    const { data, error } = await supabase
      .from("issues")
      .select("*")
      .eq("id", issueId)
      .maybeSingle();

    if (error) {
      logger.error("Failed to fetch admin issue detail", {
        issueId,
        error: error.message,
      });
      throw new DatabaseError("Could not load issue details.");
    }

    if (!data) {
      throw new NotFoundError("Issue not found.");
    }

    return data as unknown as Issue;
  });
}

// ──────────────────────────────────────────────
// Update Issue Status (Admin-Only)
// ──────────────────────────────────────────────

export async function updateIssueStatus(issueId: string, status: string) {
  return safeAction(
    "updateIssueStatus",
    async (): Promise<{ id: string; status: IssueStatus }> => {
      const userId = await requireAdmin();

      // Validate input
      const validation = updateStatusSchema.safeParse({
        issue_id: issueId,
        status,
      });

      if (!validation.success) {
        const msg = validation.error.issues[0]?.message || "Invalid status data";
        throw new ValidationError(msg, {
          fields: validation.error.flatten().fieldErrors,
        });
      }

      const supabase = getAdminSupabase();

      const { data, error } = await supabase
        .from("issues")
        // @ts-expect-error Supabase schema type inference
        .update({
          status: validation.data.status as IssueStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", validation.data.issue_id)
        .select("id, status")
        .single();

      if (error) {
        logger.error("Failed to update issue status", {
          issueId,
          status,
          userId,
          error: error.message,
        });
        throw new DatabaseError("Could not update issue status.");
      }

      if (!data) {
        throw new NotFoundError("Issue not found.");
      }

      const result = data as unknown as { id: string; status: IssueStatus };

      logger.info("Issue status updated", {
        issueId: result.id,
        newStatus: result.status,
        updatedBy: userId,
      });

      return result;
    },
    { issueId, status }
  );
}

// ──────────────────────────────────────────────
// Update Issue Priority (Admin-Only)
// ──────────────────────────────────────────────

export async function updateIssuePriority(issueId: string, priority: string) {
  return safeAction(
    "updateIssuePriority",
    async (): Promise<{ id: string; priority: IssuePriority }> => {
      const userId = await requireAdmin();

      // Validate input
      const validation = updatePrioritySchema.safeParse({
        issue_id: issueId,
        priority,
      });

      if (!validation.success) {
        const msg = validation.error.issues[0]?.message || "Invalid priority data";
        throw new ValidationError(msg, {
          fields: validation.error.flatten().fieldErrors,
        });
      }

      const supabase = getAdminSupabase();

      const { data, error } = await supabase
        .from("issues")
        // @ts-expect-error Supabase schema type inference
        .update({
          priority: validation.data.priority as IssuePriority,
          updated_at: new Date().toISOString(),
        })
        .eq("id", validation.data.issue_id)
        .select("id, priority")
        .single();

      if (error) {
        logger.error("Failed to update issue priority", {
          issueId,
          priority,
          userId,
          error: error.message,
        });
        throw new DatabaseError("Could not update issue priority.");
      }

      if (!data) {
        throw new NotFoundError("Issue not found.");
      }

      const result = data as unknown as { id: string; priority: IssuePriority };

      logger.info("Issue priority updated", {
        issueId: result.id,
        newPriority: result.priority,
        updatedBy: userId,
      });

      return result;
    },
    { issueId, priority }
  );
}
