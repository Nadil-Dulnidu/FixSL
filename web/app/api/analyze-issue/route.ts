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
    const apiKey =
      (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim()) ||
      (process.env.GOOGLE_GENERATIVE_AI_API_KEY &&
        process.env.GOOGLE_GENERATIVE_AI_API_KEY.trim());

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error:
            "AI analysis requires a configured GEMINI_API_KEY in your web/.env file. You can continue submitting your report manually.",
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

    return NextResponse.json(
      {
        success: false,
        error:
          "AI analysis is temporarily unavailable. You can continue submitting your report manually.",
      },
      { status: 500 }
    );
  }
}
