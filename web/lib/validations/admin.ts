import { z } from "zod";
import { issueStatusEnum, issuePriorityEnum } from "./issue";

export const updateStatusSchema = z.object({
  issue_id: z.string().uuid("Invalid issue ID format"),
  status: issueStatusEnum,
});

export const updatePrioritySchema = z.object({
  issue_id: z.string().uuid("Invalid issue ID format"),
  priority: issuePriorityEnum,
});

export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
export type UpdatePriorityInput = z.infer<typeof updatePrioritySchema>;
