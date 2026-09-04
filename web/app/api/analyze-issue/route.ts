import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { analyzeIssueWithAI } from "@/lib/ai/gemini";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

const requestSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters for AI analysis"),
  description: z
    .string()
    .trim()
    .min(10, "Please provide at least 10 characters in the description"),
  imageUrl: z.string().url().nullish(),
  imageBase64: z.string().nullish(),
  imageMimeType: z.string().nullish(),
});

export async function POST(req: NextRequest) {
  try {
    const hasServiceAccount =
      Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS) ||
      Boolean(process.env.GCP_SERVICE_ACCOUNT_KEY) ||
      Boolean(process.env.GOOGLE_CREDENTIALS) ||
      (Boolean(process.env.GOOGLE_CLIENT_EMAIL) &&
        Boolean(process.env.GOOGLE_PRIVATE_KEY)) ||
      Boolean(process.env.GOOGLE_VERTEX_PROJECT) ||
      Boolean(process.env.GCP_PROJECT_ID);

    const hasApiKey =
      Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim()) ||
      Boolean(
        process.env.GOOGLE_GENERATIVE_AI_API_KEY &&
          process.env.GOOGLE_GENERATIVE_AI_API_KEY.trim()
      );

    if (!hasServiceAccount && !hasApiKey) {
      return NextResponse.json(
        {
          success: false,
          error:
            "AI analysis requires GCP Service Account credentials (GOOGLE_APPLICATION_CREDENTIALS or GCP_SERVICE_ACCOUNT_KEY) or GEMINI_API_KEY in your web/.env file. You can continue submitting your report manually.",
        },
        { status: 503 }
      );
    }

    let rawBody;
    try {
      rawBody = await req.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON request body",
        },
        { status: 400 }
      );
    }

    const parseResult = requestSchema.safeParse(rawBody);

    if (!parseResult.success) {
      const errorMsg =
        parseResult.error.issues[0]?.message || "Invalid request payload";
      return NextResponse.json(
        {
          success: false,
          error: errorMsg,
        },
        { status: 400 }
      );
    }

    const { title, description, imageUrl, imageBase64, imageMimeType } =
      parseResult.data;

    const result = await analyzeIssueWithAI({
      title,
      description,
      imageUrl,
      imageBase64,
      imageMimeType,
    });

    return NextResponse.json({
      success: true,
      data: {
        category: result.analysis.category,
        severity: result.analysis.severity,
        priority: result.analysis.priority,
        confidence: result.analysis.confidence,
        reason: result.analysis.reason,
        suggestedCategory: result.suggestedCategory,
        suggestedPriority: result.suggestedPriority,
      },
    });
  } catch (error) {
    logger.error("Error in /api/analyze-issue route", {
      error: error instanceof Error ? error.message : String(error),
    });

    const detailedMessage =
      error instanceof Error ? error.message : String(error);

    let friendlyError =
      "AI analysis is temporarily unavailable. You can continue submitting your report manually.";

    if (
      detailedMessage.includes("API_KEY_SERVICE_BLOCKED") ||
      detailedMessage.includes("generativelanguage.googleapis.com") ||
      detailedMessage.includes("blocked")
    ) {
      friendlyError =
        "Your GEMINI_API_KEY is restricted or Generative Language API is not enabled on this key. Please allow 'Generative Language API' in GCP Credentials or create an API key from Google AI Studio (https://aistudio.google.com/app/apikey).";
    } else if (process.env.NODE_ENV !== "production") {
      friendlyError = `AI analysis error: ${detailedMessage}`;
    }

    return NextResponse.json(
      {
        success: false,
        error: friendlyError,
      },
      { status: 500 }
    );
  }
}
