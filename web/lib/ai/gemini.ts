import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { logger } from "@/lib/logger";

/**
 * Structured Output Schema required for FixSL AI Issue Analysis
 */
export const aiIssueAnalysisSchema = z.object({
  category: z.enum([
    "Pothole",
    "Road Damage",
    "Broken Streetlight",
    "Garbage",
    "Blocked Drain",
    "Water Supply",
    "Traffic Signal",
    "Other",
  ]),
  severity: z.enum(["Low", "Medium", "High", "Critical"]),
  priority: z.enum(["Low", "Medium", "High", "Urgent"]),
  confidence: z.number().min(0).max(1),
  reason: z.string().describe("Short 1-2 sentence explanation based on the citizen's report"),
});

export type AIIssueAnalysis = z.infer<typeof aiIssueAnalysisSchema>;

export interface AnalyzeIssueParams {
  title: string;
  description: string;
  imageUrl?: string | null;
  imageBase64?: string | null;
  imageMimeType?: string | null;
}

export interface AnalyzeIssueResult {
  analysis: AIIssueAnalysis;
  suggestedCategory: string; // FixSL internal category slug: pothole | road_damage | etc.
  suggestedPriority: "low" | "medium" | "high" | "critical"; // FixSL priority
}

/**
 * System prompt tailored for Sri Lankan infrastructure and municipal reporting
 */
const SYSTEM_PROMPT = `You are an AI assistant helping classify public infrastructure hazards and municipal issues reported by citizens across Sri Lanka (roads, streetlights, garbage, water drainage, utility hazards).

Analyze the provided issue title, description, and optional photographic proof.

Classify the issue into one of the allowed categories:
- Pothole
- Road Damage
- Broken Streetlight
- Garbage
- Blocked Drain
- Water Supply
- Traffic Signal
- Other

Estimate severity (Low, Medium, High, Critical) based on:
- Immediate safety risk to pedestrians, motorists, or commuters
- Potential bodily injury or property damage
- Size or seriousness of the defect
- Location context (e.g., near schools, hospitals, junctions, main highways like Galle Road or Kandy Road, crowded bus stands)

Recommend an action priority (Low, Medium, High, Urgent) based on urgency and public impact.
Estimate a confidence score between 0.0 and 1.0.
Provide a concise 1-2 sentence reasoning explaining the classification.

The recommendation is strictly advisory. Do not invent facts that are not present. Return structured output strictly matching the required schema.`;

/**
 * Map AI categories to internal FixSL category slugs
 */
export function mapAIToFixSLCategory(aiCategory: string): string {
  const norm = aiCategory.toLowerCase().trim();
  if (norm.includes("pothole")) return "pothole";
  if (norm.includes("road")) return "road_damage";
  if (norm.includes("street") || norm.includes("traffic")) return "broken_streetlight";
  if (norm.includes("garbage") || norm.includes("waste")) return "garbage";
  if (norm.includes("drain") || norm.includes("water")) return "blocked_drain";
  return "other";
}

/**
 * Map AI priority to internal FixSL priority levels
 */
export function mapAIToFixSLPriority(aiPriority: string): "low" | "medium" | "high" | "critical" {
  const norm = aiPriority.toLowerCase().trim();
  if (norm === "urgent" || norm === "critical") return "critical";
  if (norm === "high") return "high";
  if (norm === "medium") return "medium";
  return "low";
}

/**
 * Main service to analyze issue reports using Vercel AI SDK and Gemini Flash
 */
export async function analyzeIssueWithAI(params: AnalyzeIssueParams): Promise<AnalyzeIssueResult> {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  if (!apiKey) {
    logger.warn("GEMINI_API_KEY not found in environment variables");
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const google = createGoogleGenerativeAI({
    apiKey,
  });

  // Prepare multimodal content
  type UserContentPart =
    | { type: "text"; text: string }
    | { type: "image"; image: string | URL };

  const contentParts: UserContentPart[] = [
    {
      type: "text",
      text: `Issue Title: ${params.title}\nDetailed Description: ${params.description}`,
    },
  ];

  // If client provided Base64 image
  if (params.imageBase64) {
    const formattedDataUrl = params.imageBase64.startsWith("data:")
      ? params.imageBase64
      : `data:${params.imageMimeType || "image/jpeg"};base64,${params.imageBase64}`;

    contentParts.push({
      type: "image",
      image: formattedDataUrl,
    });
  } else if (params.imageUrl && params.imageUrl.startsWith("http")) {
    // If public imageUrl provided (e.g. Cloudinary)
    contentParts.push({
      type: "image",
      image: new URL(params.imageUrl),
    });
  }

  logger.info("Executing Gemini issue analysis", {
    title: params.title,
    hasImage: Boolean(params.imageBase64 || params.imageUrl),
  });

  // Try gemini-2.0-flash with fallback to gemini-1.5-flash
  const modelsToTry = ["gemini-2.0-flash", "gemini-1.5-flash"];
  let lastError: unknown = null;

  for (const modelName of modelsToTry) {
    try {
      const { object } = await generateObject({
        model: google(modelName),
        schema: aiIssueAnalysisSchema,
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: contentParts,
          },
        ],
      });

      return {
        analysis: object,
        suggestedCategory: mapAIToFixSLCategory(object.category),
        suggestedPriority: mapAIToFixSLPriority(object.priority),
      };
    } catch (err) {
      lastError = err;
      logger.warn(`Gemini analysis attempt failed with ${modelName}, trying fallback`, {
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  throw lastError instanceof Error ? lastError : new Error("AI analysis service failed.");
}
