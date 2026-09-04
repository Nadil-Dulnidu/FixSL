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
    const rawBody = await req.json();
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

    const isApiKeyMissing =
      error instanceof Error && error.message.includes("GEMINI_API_KEY");

    return NextResponse.json(
      {
        success: false,
        error: isApiKeyMissing
          ? "AI analysis requires a configured GEMINI_API_KEY. You can continue submitting the report manually."
          : "AI analysis is temporarily unavailable. You can continue submitting the report manually.",
      },
      { status: 500 }
    );
  }
}
