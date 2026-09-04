"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Users,
  Loader2,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOrCreateSessionId, cn } from "@/lib/utils";
import { submitFeedback } from "@/lib/actions/feedback";
import { DisputeBadge } from "@/components/issues/dispute-badge";
import { toast } from "sonner";
import type { FeedbackType } from "@/lib/types/database";

interface ResolutionFeedbackProps {
  issueId: string;
  initialConfirmCount?: number;
  initialDisputeCount?: number;
}

export function ResolutionFeedback({
  issueId,
  initialConfirmCount = 0,
  initialDisputeCount = 0,
}: ResolutionFeedbackProps) {
  const [confirmCount, setConfirmCount] = useState(initialConfirmCount);
  const [disputeCount, setDisputeCount] = useState(initialDisputeCount);
  const [userVotedType, setUserVotedType] = useState<FeedbackType | null>(null);
  const [sessionId, setSessionId] = useState("");
  const [isPending, startTransition] = useTransition();

  // Load session ID and check existing votes from localStorage
  useEffect(() => {
    const session = getOrCreateSessionId();
    setSessionId(session);

    if (typeof window !== "undefined") {
      const confirmKey = `fixsl_vote_${issueId}_resolution_confirm`;
      const disputeKey = `fixsl_vote_${issueId}_resolution_dispute`;

      if (localStorage.getItem(confirmKey)) {
        setUserVotedType("resolution_confirm");
      } else if (localStorage.getItem(disputeKey)) {
        setUserVotedType("resolution_dispute");
      }
    }
  }, [issueId]);

  const handleVote = (feedbackType: FeedbackType) => {
    if (userVotedType) {
      toast.info("You have already submitted resolution feedback for this issue.");
      return;
    }

    const currentSession = sessionId || getOrCreateSessionId();

    // Optimistic UI updates
    setUserVotedType(feedbackType);
    if (feedbackType === "resolution_confirm") {
      setConfirmCount((prev) => prev + 1);
    } else if (feedbackType === "resolution_dispute") {
      setDisputeCount((prev) => prev + 1);
    }

    // Persist to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(`fixsl_vote_${issueId}_${feedbackType}`, "true");
    }

    startTransition(async () => {
      try {
        const result = await submitFeedback({
          issue_id: issueId,
          feedback_type: feedbackType,
          session_id: currentSession,
        });

        if (result.success && result.data) {
          setConfirmCount(result.data.counts.resolution_confirm);
          setDisputeCount(result.data.counts.resolution_dispute);

          if (feedbackType === "resolution_confirm") {
            toast.success("Thank you for confirming that this repair was completed properly!");
          } else {
            toast.warning("Resolution dispute recorded. If multiple citizens report issues, authorities will re-inspect.");
          }
        } else {
          toast.error(result.error || "Could not record your resolution feedback.");
        }
      } catch {
        toast.error("Network error while submitting feedback.");
      }
    });
  };

  const totalVotes = confirmCount + disputeCount;
  const isDisputed = disputeCount >= 5;
  const resolutionPercentage =
    totalVotes > 0 ? Math.round((confirmCount / totalVotes) * 100) : 100;

  return (
    <div className="space-y-4">
      {/* If disputed by >= 5 citizens, show prominent dispute alert banner */}
      {isDisputed && <DisputeBadge disputeCount={disputeCount} variant="banner" />}

      <div className="clay-card p-5 sm:p-6 space-y-5 border-white/5 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/8 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <div className="w-7 h-7 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400 clay-icon-well">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span>Resolution Confirmation</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Municipal authorities marked this issue as resolved. Has the repair or cleanup been completed in reality?
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-white/5 text-[11px] font-mono text-slate-400 shrink-0 clay-pill">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>{totalVotes} Verifications</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 sm:gap-3">
          {/* Yes, it's fixed */}
          <button
            type="button"
            onClick={() => handleVote("resolution_confirm")}
            disabled={isPending || Boolean(userVotedType)}
            className={cn(
              "w-full min-h-[54px] py-3 px-3.5 sm:px-4 flex items-center justify-between gap-3 rounded-2xl font-semibold transition-all text-sm cursor-pointer touch-manipulation active:scale-[0.98]",
              userVotedType === "resolution_confirm"
                ? "clay-card bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-md shadow-emerald-500/15 ring-2 ring-emerald-400/40"
                : "clay-btn-secondary hover:border-emerald-500/40 text-slate-200 hover:text-white"
            )}
          >
            <div className="flex items-center gap-3 text-left min-w-0">
              <div
                className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border",
                  userVotedType === "resolution_confirm"
                    ? "bg-emerald-400/20 border-emerald-400/40 text-emerald-400"
                    : "bg-slate-900 border-white/5 text-emerald-400 clay-icon-well"
                )}
              >
                {userVotedType === "resolution_confirm" ? (
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
                ) : isPending ? (
                  <Loader2 className="w-4.5 h-4.5 text-emerald-400 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
                )}
              </div>
              <div className="min-w-0">
                <span className="block text-xs sm:text-sm font-bold text-white leading-tight">
                  {userVotedType === "resolution_confirm" ? "You Confirmed Fixed" : "Yes, It's Fixed"}
                </span>
                <span className="text-[11px] text-slate-400 font-normal leading-snug">
                  Repair verified complete in person
                </span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-xs font-mono font-bold text-emerald-400 shrink-0 clay-pill">
              {confirmCount}
            </span>
          </button>

          {/* No, problem remains */}
          <button
            type="button"
            onClick={() => handleVote("resolution_dispute")}
            disabled={isPending || Boolean(userVotedType)}
            className={cn(
              "w-full min-h-[54px] py-3 px-3.5 sm:px-4 flex items-center justify-between gap-3 rounded-2xl font-semibold transition-all text-sm cursor-pointer touch-manipulation active:scale-[0.98]",
              userVotedType === "resolution_dispute"
                ? "clay-card bg-rose-500/20 border-rose-400 text-rose-300 shadow-md shadow-rose-500/15 ring-2 ring-rose-400/40"
                : "clay-btn-secondary hover:border-red-500/40 text-slate-300 hover:text-white"
            )}
          >
            <div className="flex items-center gap-3 text-left min-w-0">
              <div
                className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border",
                  userVotedType === "resolution_dispute"
                    ? "bg-rose-400/20 border-rose-400/40 text-rose-400"
                    : "bg-slate-900 border-white/5 text-rose-400 clay-icon-well"
                )}
              >
                {userVotedType === "resolution_dispute" ? (
                  <AlertTriangle className="w-4.5 h-4.5 text-rose-400" />
                ) : (
                  <AlertTriangle className="w-4.5 h-4.5 text-slate-400" />
                )}
              </div>
              <div className="min-w-0">
                <span className="block text-xs sm:text-sm font-bold text-slate-200 leading-tight">
                  {userVotedType === "resolution_dispute" ? "You Disputed" : "No, Problem Remains"}
                </span>
                <span className="text-[11px] text-slate-400 font-normal leading-snug">
                  Dispute resolution or incomplete work
                </span>
              </div>
            </div>
            <span
              className={cn(
                "px-3 py-1 rounded-full text-xs font-mono font-bold shrink-0 clay-pill",
                disputeCount >= 5
                  ? "bg-red-500/20 border border-red-500/40 text-red-400 animate-pulse"
                  : "bg-slate-800 border border-white/5 text-slate-300"
              )}
            >
              {disputeCount}
            </span>
          </button>
        </div>

        {/* Resolution Quality Breakdown */}
        {totalVotes > 0 && (
          <div className="pt-3 border-t border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Citizen Resolution Satisfaction
              </span>
              <span className="font-mono font-bold text-emerald-400">
                {resolutionPercentage}% Confirmed Fixed ({confirmCount} of {totalVotes})
              </span>
            </div>
            <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5 flex shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500 rounded-full shadow-md"
                style={{ width: `${resolutionPercentage}%` }}
              />
            </div>
          </div>
        )}

        {userVotedType && (
          <div className="text-[11px] text-center text-slate-400 clay-inset py-2 px-3 rounded-xl">
            ✓ Your anonymous resolution feedback has been recorded.
          </div>
        )}
      </div>
    </div>
  );
}

