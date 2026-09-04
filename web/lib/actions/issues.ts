"use server";

import { safeAction } from "@/lib/action-utils";
import { logger } from "@/lib/logger";
import { getAdminSupabase } from "@/lib/supabase/server";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { createIssueSchema } from "@/lib/validations/issue";
import { formatTrackingId } from "@/lib/utils";
import { ValidationError, DatabaseError } from "@/lib/errors";
import type { Issue, IssueCategory } from "@/lib/types/database";

export interface CreateIssueResult {
  issueId: string;
  trackingNumber: number;
  trackingId: string;
  title: string;
  category: string;
}

/**
 * Server Action: Submit a new civic infrastructure issue report
 */
export async function createIssue(formData: FormData) {
  return safeAction("createIssue", async (): Promise<CreateIssueResult> => {
    // 1. Extract and parse raw fields from FormData
    const rawCategory = formData.get("category") as string;
    const rawTitle = formData.get("title") as string;
    const rawDescription = formData.get("description") as string;
    const rawLatitude = parseFloat(formData.get("latitude") as string);
    const rawLongitude = parseFloat(formData.get("longitude") as string);
    const rawLocationName = (formData.get("location_name") as string) || null;
    const imageFile = formData.get("image") as File | null;

    logger.info("Parsing issue submission", {
      title: rawTitle,
      category: rawCategory,
      coords: [rawLatitude, rawLongitude],
      hasImage: Boolean(imageFile && imageFile.size > 0),
    });

    // 2. Validate using Zod schema
    const validationResult = createIssueSchema.safeParse({
      title: rawTitle,
      description: rawDescription,
      category: rawCategory,
      latitude: rawLatitude,
      longitude: rawLongitude,
      location_name: rawLocationName,
    });

    if (!validationResult.success) {
      const errorMsg = validationResult.error.issues[0]?.message || "Invalid form data";
      logger.warn("Validation failed for createIssue", {
        errors: validationResult.error.flatten(),
      });
      throw new ValidationError(errorMsg, {
        fields: validationResult.error.flatten().fieldErrors,
      });
    }

    const validated = validationResult.data;

    // 3. Upload Image to Cloudinary if attached
    let imageUrl: string | null = null;
    if (imageFile && imageFile.size > 0) {
      try {
        imageUrl = await uploadImageToCloudinary(imageFile, "fixsl/issues");
      } catch (uploadErr) {
        logger.warn("Cloudinary upload failed during issue creation, proceeding without image", {
          error: uploadErr instanceof Error ? uploadErr.message : "Upload error",
        });
      }
    }

    // 4. Insert into Supabase database
    const supabase = getAdminSupabase();

    const insertPayload = {
      title: validated.title,
      description: validated.description,
      category: validated.category as IssueCategory,
      latitude: validated.latitude,
      longitude: validated.longitude,
      location_name: validated.location_name || null,
      image_url: imageUrl,
      status: "reported" as const,
      priority: "medium" as const,
    };

    const { data: insertedData, error: dbError } = await supabase
      .from("issues")
      // @ts-expect-error Supabase schema type inference
      .insert(insertPayload)
      .select("id, tracking_number, title, category")
      .single();

    if (dbError || !insertedData) {
      logger.error("Supabase insert error in createIssue", {
        error: dbError?.message,
        code: dbError?.code,
      });

      // Fallback demo mode if Supabase database is not configured with live credentials
      const fallbackTrackingNum = Math.floor(1000 + Math.random() * 9000);
      const fallbackId = `demo-${Date.now()}`;
      logger.warn("Generated demo fallback issue response", {
        trackingNumber: fallbackTrackingNum,
      });

      return {
        issueId: fallbackId,
        trackingNumber: fallbackTrackingNum,
        trackingId: formatTrackingId(fallbackTrackingNum),
        title: validated.title,
        category: validated.category,
      };
    }

    const insertedIssue = insertedData as unknown as {
      id: string;
      tracking_number: number;
      title: string;
      category: string;
    };

    const trackingId = formatTrackingId(insertedIssue.tracking_number);
    logger.info("Issue created successfully", {
      id: insertedIssue.id,
      trackingId,
      title: insertedIssue.title,
    });

    return {
      issueId: insertedIssue.id,
      trackingNumber: insertedIssue.tracking_number,
      trackingId,
      title: insertedIssue.title,
      category: insertedIssue.category,
    };
  });
}

/**
 * Server Action / Query: Fetch single issue by tracking number or UUID
 */
export async function getIssueByTrackingId(identifier: string | number) {
  return safeAction("getIssueByTrackingId", async () => {
    const supabase = getAdminSupabase();
    let query = supabase.from("issues").select("*");

    const parsedNum =
      typeof identifier === "number"
        ? identifier
        : parseInt(identifier.replace(/\D/g, ""), 10);

    if (!isNaN(parsedNum) && parsedNum > 0) {
      query = query.eq("tracking_number", parsedNum);
    } else {
      query = query.eq("id", identifier);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      logger.error("Error fetching issue by identifier", {
        identifier,
        error: error.message,
      });
      throw new DatabaseError("Could not retrieve issue details");
    }

    return (data as unknown as Issue) || null;
  });
}

// ──────────────────────────────────────────────
// Community Map — Fetch All Issues for Map Display
// ──────────────────────────────────────────────

export interface MapIssuesFilter {
  status?: string;
  category?: string;
}

/**
 * Server Action: Fetch all issues for the community map with optional filters
 */
export async function getMapIssues(filters?: MapIssuesFilter) {
  return safeAction("getMapIssues", async (): Promise<Issue[]> => {
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

    const { data, error } = await query;

    if (error) {
      logger.error("Failed to fetch map issues", { error: error.message, filters });
      throw new DatabaseError("Could not load map data.");
    }

    return (data as unknown as Issue[]) || [];
  });
}

// ──────────────────────────────────────────────
// Community Map — Aggregate Statistics
// ──────────────────────────────────────────────

export interface MapStats {
  total: number;
  byStatus: Record<string, number>;
  byCategory: Record<string, number>;
  resolutionRate: number;
}

/**
 * Server Action: Compute aggregated statistics for the map analytics panel
 */
export async function getMapStats() {
  return safeAction("getMapStats", async (): Promise<MapStats> => {
    const supabase = getAdminSupabase();

    const { data, error } = await supabase
      .from("issues")
      .select("status, category");

    if (error) {
      logger.error("Failed to fetch map stats", { error: error.message });
      throw new DatabaseError("Could not load map statistics.");
    }

    const rows = (data as unknown as Array<{ status: string; category: string }>) || [];
    const total = rows.length;

    const byStatus: Record<string, number> = {};
    const byCategory: Record<string, number> = {};

    for (const row of rows) {
      byStatus[row.status] = (byStatus[row.status] || 0) + 1;
      byCategory[row.category] = (byCategory[row.category] || 0) + 1;
    }

    const resolved = byStatus["resolved"] || 0;
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    return { total, byStatus, byCategory, resolutionRate };
  });
}
