"use client";

import React, { useState, useEffect, useTransition } from "react";
import { CheckCircle, AlertTriangle, Loader2, ThumbsUp, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitFeedback } from "@/lib/actions/feedback";
import { getOrCreateSessionId } from "@/lib/utils";
import { toast } from "sonner";
import type { FeedbackCounts } from "@/lib/actions/feedback";

interface VerificationPanelProps {
  issueId: string;
  initialCounts: FeedbackCounts;
}

const STORAGE_PREFIX = "fixsl_feedback_";

function getFeedbackStorageKey(issueId: string, type: string): string {
  return `${STORAGE_PREFIX}${issueId}_${type}`;
}

export function VerificationPanel({
  issueId,
  initialCounts,
}: VerificationPanelProps) {
  const [counts, setCounts] = useState<FeedbackCounts>(initialCounts);
  const [submittedTypes, setSubmittedTypes] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();
  const [activeAction, setActiveAction] = useState<string | null>(null);

  // Check localStorage for already-submitted feedback
  useEffect(() => {
    const submitted = new Set<string>();
    const types = ["confirm", "dispute"];
    for (const type of types) {
      const key = getFeedbackStorageKey(issueId, type);
      if (localStorage.getItem(key) === "true") {
        submitted.add(type);
      }
    }
    setSubmittedTypes(submitted);
  }, [issueId]);

  const handleFeedback = (feedbackType: "confirm" | "dispute") => {
    if (submittedTypes.has(feedbackType)) return;

    setActiveAction(feedbackType);
    startTransition(async () => {
      const sessionId = getOrCreateSessionId();
      const result = await submitFeedback({
        issue_id: issueId,
        feedback_type: feedbackType,
        session_id: sessionId,
      });

      if (result.success) {
        // Persist to localStorage
        const key = getFeedbackStorageKey(issueId, feedbackType);
        localStorage.setItem(key, "true");

        setSubmittedTypes((prev) => new Set([...prev, feedbackType]));
        setCounts((prev) => ({
          ...prev,
          [feedbackType]: prev[feedbackType] + 1,
        }));

        toast.success(
          feedbackType === "confirm"
            ? "Thank you for confirming this issue still exists."
            : "Thank you for reporting this as a duplicate.",
          { duration: 3000 }
        );
      } else {
        // If it's a duplicate error, mark as already submitted
        if (result.code === "VALIDATION_ERROR") {
          const key = getFeedbackStorageKey(issueId, feedbackType);
          localStorage.setItem(key, "true");
          setSubmittedTypes((prev) => new Set([...prev, feedbackType]));
          toast.info("You've already submitted this feedback.");
        } else {
          toast.error(result.error || "Failed to submit feedback. Please try again.");
        }
      }
      setActiveAction(null);
    });
  };

  const confirmDisabled = submittedTypes.has("confirm") || isPending;
  const disputeDisabled = submittedTypes.has("dispute") || isPending;

  return (
    <div className="clay-card p-6 md:p-8">
      <div className="flex items-center gap-2 mb-1">
        <ThumbsUp className="w-4 h-4 text-amber-500/70" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          Community Verification
        </h2>
      </div>
      <p className="text-xs text-slate-500 mb-5">
        Help verify this issue. Your feedback is anonymous and helps prioritize repairs.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* "Still exists" button */}
        <Button
          onClick={() => handleFeedback("confirm")}
          disabled={confirmDisabled}
          className={`relative h-auto py-4 px-5 rounded-xl border transition-all duration-200 ${
            submittedTypes.has("confirm")
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 cursor-default"
              : "bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400"
          }`}
          variant="ghost"
        >
          <div className="flex flex-col items-center gap-2 w-full">
            {isPending && activeAction === "confirm" ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : submittedTypes.has("confirm") ? (
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            ) : (
              <CheckCircle className="w-5 h-5" />
            )}
            <span className="text-sm font-semibold">
              {submittedTypes.has("confirm") ? "Confirmed ✓" : "Still Exists"}
            </span>
            <span className="text-xs opacity-70">
              {counts.confirm} citizen{counts.confirm !== 1 ? "s" : ""} confirmed
            </span>
          </div>
        </Button>

        {/* "Report duplicate" button */}
        <Button
          onClick={() => handleFeedback("dispute")}
          disabled={disputeDisabled}
          className={`relative h-auto py-4 px-5 rounded-xl border transition-all duration-200 ${
            submittedTypes.has("dispute")
              ? "bg-orange-500/10 border-orange-500/30 text-orange-400 cursor-default"
              : "bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-orange-500/10 hover:border-orange-500/30 hover:text-orange-400"
          }`}
          variant="ghost"
        >
          <div className="flex flex-col items-center gap-2 w-full">
            {isPending && activeAction === "dispute" ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : submittedTypes.has("dispute") ? (
              <Flag className="w-5 h-5 text-orange-400" />
            ) : (
              <Flag className="w-5 h-5" />
            )}
            <span className="text-sm font-semibold">
              {submittedTypes.has("dispute") ? "Reported ✓" : "Report Duplicate"}
            </span>
            <span className="text-xs opacity-70">
              {counts.dispute} report{counts.dispute !== 1 ? "s" : ""}
            </span>
          </div>
        </Button>
      </div>

      {/* Aggregated summary */}
      {(counts.confirm > 0 || counts.dispute > 0) && (
        <div className="mt-4 pt-3 border-t border-slate-800">
          <p className="text-xs text-slate-500 text-center">
            <span className="text-emerald-400 font-medium">{counts.confirm}</span>{" "}
            citizen{counts.confirm !== 1 ? "s" : ""} confirmed ·{" "}
            <span className="text-orange-400 font-medium">{counts.dispute}</span>{" "}
            duplicate report{counts.dispute !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
}
