import { z } from "zod";

export const feedbackTypeEnum = z.enum([
  "confirm",
  "dispute",
  "resolution_confirm",
  "resolution_dispute",
]);

export const submitFeedbackSchema = z.object({
  issue_id: z.string().uuid("Invalid issue ID format"),
  feedback_type: feedbackTypeEnum,
  session_id: z.string().min(1, "Session ID is required"),
});

export type SubmitFeedbackInput = z.infer<typeof submitFeedbackSchema>;
