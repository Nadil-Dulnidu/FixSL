import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind class names with clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a tracking number into the canonical FIX-XXXX format
 */
export function formatTrackingId(num: number | string): string {
  const cleanNum = typeof num === "string" ? num.replace(/\D/g, "") : num;
  return `FIX-${String(cleanNum).padStart(4, "0")}`;
}

/**
 * Parse a tracking ID string like "FIX-1001" or "1001" into an integer
 */
export function parseTrackingId(trackingId: string): number | null {
  const match = trackingId.match(/(\d+)/);
  if (!match) return null;
  const parsed = parseInt(match[1], 10);
  return isNaN(parsed) ? null : parsed;
}

/**
 * Format date for Sri Lankan locale display
 */
export function formatDate(dateString: string | Date): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/**
 * Format relative time (e.g., "2 hours ago", "yesterday")
 */
export function formatRelativeTime(dateString: string | Date): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return formatDate(dateString);
}

/**
 * Generate or get anonymous session UUID from localStorage for deduplicating verification
 */
export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  const STORAGE_KEY = "fixsl_session_id";
  let sessionId = localStorage.getItem(STORAGE_KEY);
  if (!sessionId) {
    sessionId = "sess_" + Math.random().toString(36).substring(2, 15) + "_" + Date.now().toString(36);
    localStorage.setItem(STORAGE_KEY, sessionId);
  }
  return sessionId;
}
