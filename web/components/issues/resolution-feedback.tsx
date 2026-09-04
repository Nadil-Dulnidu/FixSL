"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitFeedback } from "@/lib/actions/feedback";
import { getOrCreateSessionId } from "@/lib/utils";
import { toast } from "sonner";
import type { FeedbackCounts } from "@/lib/actions/feedback";

interface ResolutionFeedbackProps {
  issueId: string;
  initialCounts: FeedbackCounts;
}

const STORAGE_PREFIX = "fixsl_feedback_";
const DISPUTE_THRESHOLD = 5;

function getFeedbackStorageKey(issueId: string, type: string): string {
  return `${STORAGE_PREFIX}${issueId}_${type}`;
}

export function ResolutionFeedback({
  issueId,
  initialCounts,
}: ResolutionFeedbackProps) {
  const [counts, setCounts] = useState<FeedbackCounts>(initialCounts);
  const [submittedTypes, setSubmittedTypes] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const isDisputed = counts.resolution_dispute >= DISPUTE_THRESHOLD;

  // Check localStorage for already-submitted feedback
  useEffect(() => {
    const submitted = new Set<string>();
    const types = ["resolution_confirm", "resolution_dispute"];
    for (const type of types) {
      const key = getFeedbackStorageKey(issueId, type);
      if (localStorage.getItem(key) === "true") {
        submitted.add(type);
      }
    }
    setSubmittedTypes(submitted);
  }, [issueId]);

  const handleFeedback = (
    feedbackType: "resolution_confirm" | "resolution_dispute"
  ) => {
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
        const key = getFeedbackStorageKey(issueId, feedbackType);
        localStorage.setItem(key, "true");

        setSubmittedTypes((prev) => new Set([...prev, feedbackType]));
        setCounts((prev) => ({
          ...prev,
          [feedbackType]: prev[feedbackType] + 1,
        }));

        toast.success(
          feedbackType === "resolution_confirm"
            ? "Thank you for confirming the resolution!"
            : "Thank you for your feedback. The resolution will be reviewed.",
          { duration: 3000 }
        );
      } else {
        if (result.code === "VALIDATION_ERROR") {
          const key = getFeedbackStorageKey(issueId, feedbackType);
          localStorage.setItem(key, "true");
          setSubmittedTypes((prev) => new Set([...prev, feedbackType]));
          toast.info("You've already submitted this feedback.");
        } else {
          toast.error(
            result.error || "Failed to submit feedback. Please try again."
          );
        }
      }
      setActiveAction(null);
    });
  };

  const confirmDisabled =
    submittedTypes.has("resolution_confirm") || isPending;
  const disputeDisabled =
    submittedTypes.has("resolution_dispute") || isPending;

  return (
    <div className="clay-card p-6 md:p-8">
      {/* Dispute warning banner */}
      {isDisputed && (
        <div className="mb-5 flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-400">
              ⚠️ Resolution Disputed
            </p>
            <p className="text-xs text-red-400/70 mt-0.5">
              {counts.resolution_dispute} citizens report the problem remains
              unresolved.
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 mb-1">
        <ShieldCheck className="w-4 h-4 text-amber-500/70" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          Resolution Verification
        </h2>
      </div>
      <p className="text-xs text-slate-500 mb-5">
        This issue has been marked as resolved. Has the problem actually been
        fixed?
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* "Yes, it's fixed" button */}
        <Button
          onClick={() => handleFeedback("resolution_confirm")}
          disabled={confirmDisabled}
          className={`relative h-auto py-4 px-5 rounded-xl border transition-all duration-200 ${
            submittedTypes.has("resolution_confirm")
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 cursor-default"
              : "bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400"
          }`}
          variant="ghost"
        >
          <div className="flex flex-col items-center gap-2 w-full">
            {isPending && activeAction === "resolution_confirm" ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : submittedTypes.has("resolution_confirm") ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <CheckCircle2 className="w-5 h-5" />
            )}
            <span className="text-sm font-semibold">
              {submittedTypes.has("resolution_confirm")
                ? "Confirmed ✓"
                : "Yes, It's Fixed"}
            </span>
            <span className="text-xs opacity-70">
              {counts.resolution_confirm} confirmation
              {counts.resolution_confirm !== 1 ? "s" : ""}
            </span>
          </div>
        </Button>

        {/* "No, problem remains" button */}
        <Button
          onClick={() => handleFeedback("resolution_dispute")}
          disabled={disputeDisabled}
          className={`relative h-auto py-4 px-5 rounded-xl border transition-all duration-200 ${
            submittedTypes.has("resolution_dispute")
              ? "bg-red-500/10 border-red-500/30 text-red-400 cursor-default"
              : "bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400"
          }`}
          variant="ghost"
        >
          <div className="flex flex-col items-center gap-2 w-full">
            {isPending && activeAction === "resolution_dispute" ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : submittedTypes.has("resolution_dispute") ? (
              <XCircle className="w-5 h-5 text-red-400" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            <span className="text-sm font-semibold">
              {submittedTypes.has("resolution_dispute")
                ? "Reported ✓"
                : "No, Problem Remains"}
            </span>
            <span className="text-xs opacity-70">
              {counts.resolution_dispute} dispute
              {counts.resolution_dispute !== 1 ? "s" : ""}
            </span>
          </div>
        </Button>
      </div>

      {/* Aggregated summary */}
      {(counts.resolution_confirm > 0 || counts.resolution_dispute > 0) && (
        <div className="mt-4 pt-3 border-t border-slate-800">
          <p className="text-xs text-slate-500 text-center">
            <span className="text-emerald-400 font-medium">
              {counts.resolution_confirm}
            </span>{" "}
            confirmed resolved ·{" "}
            <span className="text-red-400 font-medium">
              {counts.resolution_dispute}
            </span>{" "}
            dispute{counts.resolution_dispute !== 1 ? "s" : ""}
            {isDisputed && (
              <span className="text-red-400 font-semibold">
                {" "}
                — Resolution Disputed
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
