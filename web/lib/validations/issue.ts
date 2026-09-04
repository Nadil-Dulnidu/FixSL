import { z } from "zod";

export const issueCategoryEnum = z.enum([
  "pothole",
  "road_damage",
  "broken_streetlight",
  "garbage",
  "blocked_drain",
  "other",
]);

export const issuePriorityEnum = z.enum(["low", "medium", "high", "critical"]);
export const issueStatusEnum = z.enum(["reported", "verified", "in_progress", "resolved"]);

export const createIssueSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters long")
    .max(100, "Title cannot exceed 100 characters")
    .trim(),
  description: z
    .string()
    .min(20, "Please describe the issue in at least 20 characters")
    .max(1000, "Description cannot exceed 1000 characters")
    .trim(),
  category: issueCategoryEnum,
  latitude: z
    .number({ message: "Please select a valid location on the map" })
    .min(-90)
    .max(90),
  longitude: z
    .number({ message: "Please select a valid location on the map" })
    .min(-180)
    .max(180),
  location_name: z
    .string()
    .max(200, "Location description cannot exceed 200 characters")
    .optional()
    .nullable(),
});

export type CreateIssueInput = z.infer<typeof createIssueSchema>;
