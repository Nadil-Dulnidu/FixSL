import fs from "fs";
import path from "path";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createVertex } from "@ai-sdk/google-vertex";
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
 * Returns a configured LanguageModel instance supporting either GCP Service Account
 * (via Google Vertex AI) or Gemini API Key (via Google AI Studio).
 */
function getLanguageModel(modelName: string) {
  const saKeyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim();
  const saRawJson = (process.env.GCP_SERVICE_ACCOUNT_KEY || process.env.GOOGLE_CREDENTIALS)?.trim();
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL?.trim();
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.trim();
  const vertexProject = (
    process.env.GOOGLE_VERTEX_PROJECT ||
    process.env.GCP_PROJECT_ID ||
    process.env.GOOGLE_CLOUD_PROJECT
  )?.trim();
  const vertexLocation = (
    process.env.GOOGLE_VERTEX_LOCATION ||
    process.env.GCP_LOCATION ||
    "us-central1"
  ).trim();

  const isServiceAccountConfigured =
    Boolean(saKeyFile) ||
    Boolean(saRawJson) ||
    (Boolean(clientEmail) && Boolean(privateKey)) ||
    Boolean(vertexProject);

  if (isServiceAccountConfigured) {
    logger.info("Initializing Google Vertex AI provider with GCP Service Account", {
      modelName,
      location: vertexLocation,
      hasKeyFile: Boolean(saKeyFile),
      hasRawJson: Boolean(saRawJson),
      hasEmailKey: Boolean(clientEmail && privateKey),
    });

    let credentials: Record<string, unknown> | undefined;

    if (saRawJson) {
      try {
        credentials = JSON.parse(saRawJson);
      } catch {
        try {
          const decoded = Buffer.from(saRawJson, "base64").toString("utf8");
          credentials = JSON.parse(decoded);
        } catch (e) {
          logger.warn("Failed to parse GCP_SERVICE_ACCOUNT_KEY as JSON", {
            error: e instanceof Error ? e.message : String(e),
          });
        }
      }
    } else if (clientEmail && privateKey) {
      credentials = {
        client_email: clientEmail,
        private_key: privateKey.replace(/\\n/g, "\n"),
      };
    }

    if (credentials && typeof credentials.private_key === "string") {
      credentials.private_key = credentials.private_key.replace(/\\n/g, "\n").trim();
    }

    let keyFilename = saKeyFile ? path.resolve(process.cwd(), saKeyFile) : undefined;
    if (!keyFilename && (!credentials || !credentials.private_key)) {
      const localFile = path.resolve(process.cwd(), "gcp-service-account.json");
      if (fs.existsSync(localFile)) {
        keyFilename = localFile;
        logger.info("Using local gcp-service-account.json file as fallback keyFilename");
      }
    }

    const projectId =
      (credentials?.project_id as string) ||
      vertexProject ||
      undefined;

    const vertex = createVertex({
      project: projectId,
      location: vertexLocation,
      googleAuthOptions: {
        ...(credentials?.private_key ? { credentials } : {}),
        ...(keyFilename ? { keyFilename } : {}),
        ...(projectId ? { projectId } : {}),
      },
    });

    return vertex(modelName);
  }

  // Fallback to Google AI Studio API key
  const apiKey =
    (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim()) ||
    (process.env.GOOGLE_GENERATIVE_AI_API_KEY && process.env.GOOGLE_GENERATIVE_AI_API_KEY.trim());

  if (apiKey) {
    logger.info("Initializing Google AI Studio provider with GEMINI_API_KEY", {
      modelName,
    });
    const google = createGoogleGenerativeAI({ apiKey });
    return google(modelName);
  }

  throw new Error(
    "No Google AI credentials configured. Please set GCP Service Account credentials (GOOGLE_APPLICATION_CREDENTIALS or GCP_SERVICE_ACCOUNT_KEY) or GEMINI_API_KEY."
  );
}

/**
 * Main service to analyze issue reports using Vercel AI SDK and Gemini Flash
 */
export async function analyzeIssueWithAI(params: AnalyzeIssueParams): Promise<AnalyzeIssueResult> {
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

  // Primary model: gemini-3.6-flash, with fallback to gemini-2.0-flash and gemini-1.5-flash
  const configuredModel = process.env.GEMINI_MODEL?.trim();
  const modelsToTry = Array.from(
    new Set([
      ...(configuredModel ? [configuredModel] : []),
      "gemini-3.6-flash",
      "gemini-3.5-flash",
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-1.5-flash",
    ])
  );
  let lastError: unknown = null;

  for (const modelName of modelsToTry) {
    try {
      const model = getLanguageModel(modelName);

      const { object } = await generateObject({
        model,
        schema: aiIssueAnalysisSchema,
        system: SYSTEM_PROMPT,
        messages: [
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
