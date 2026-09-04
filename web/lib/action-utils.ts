import { logger } from "@/lib/logger";
import { AppError } from "@/lib/errors";

export type ActionResult<T> =
  | { success: true; data: T; error?: never; code?: never }
  | { success: false; error: string; code?: string; data?: never };

/**
 * Higher-order utility function for safe Server Action execution
 */
export async function safeAction<T>(
  actionName: string,
  fn: () => Promise<T>,
  context?: Record<string, unknown>
): Promise<ActionResult<T>> {
  logger.info(`[Action Start] ${actionName}`, context);

  try {
    const data = await fn();
    logger.info(`[Action Success] ${actionName}`, { ...context, status: "ok" });
    return { success: true, data };
  } catch (error) {
    if (error instanceof AppError) {
      logger.warn(`[Action Warning] ${actionName} failed with ${error.code}`, {
        message: error.message,
        statusCode: error.statusCode,
        context: error.context,
      });
      return { success: false, error: error.message, code: error.code };
    }

    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    const stack = error instanceof Error ? error.stack : undefined;

    logger.error(`[Action Error] ${actionName} crashed`, {
      errorMessage: message,
      stack,
      context,
    });

    return {
      success: false,
      error: "An unexpected system error occurred. Please try again.",
      code: "INTERNAL_ERROR",
    };
  }
}
