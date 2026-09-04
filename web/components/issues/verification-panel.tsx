"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  ThumbsUp,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  Users,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOrCreateSessionId, cn } from "@/lib/utils";
import { submitFeedback } from "@/lib/actions/feedback";
import { toast } from "sonner";
import type { FeedbackType } from "@/lib/types/database";

interface VerificationPanelProps {
  issueId: string;
  initialConfirmCount?: number;
  initialDisputeCount?: number;
}

export function VerificationPanel({
  issueId,
  initialConfirmCount = 0,
  initialDisputeCount = 0,
}: VerificationPanelProps) {
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
      const confirmKey = `fixsl_vote_${issueId}_confirm`;
      const disputeKey = `fixsl_vote_${issueId}_dispute`;

      if (localStorage.getItem(confirmKey)) {
        setUserVotedType("confirm");
      } else if (localStorage.getItem(disputeKey)) {
        setUserVotedType("dispute");
      }
    }
  }, [issueId]);

  const handleVote = (feedbackType: FeedbackType) => {
    if (userVotedType) {
      toast.info("You have already submitted community verification for this issue.");
      return;
    }

    const currentSession = sessionId || getOrCreateSessionId();

    // Optimistic UI updates
    setUserVotedType(feedbackType);
    if (feedbackType === "confirm") {
      setConfirmCount((prev) => prev + 1);
    } else if (feedbackType === "dispute") {
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
          setConfirmCount(result.data.counts.confirm);
          setDisputeCount(result.data.counts.dispute);

          if (feedbackType === "confirm") {
            toast.success("Thank you for verifying this issue! Community votes help authorities prioritize repairs.");
          } else {
            toast.info("Duplicate/dispute report recorded. Municipal scouts will cross-reference this location.");
          }
        } else {
          toast.error(result.error || "Could not save your verification.");
        }
      } catch {
        toast.error("Network error while submitting verification.");
      }
    });
  };

  const totalVotes = confirmCount + disputeCount;
  const confirmPercentage =
    totalVotes > 0 ? Math.round((confirmCount / totalVotes) * 100) : 100;

  return (
    <div className="clay-card p-5 sm:p-6 space-y-5 border-amber-500/20 relative overflow-hidden">
      {/* Background subtle glow */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span>Community Verification</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Are you near this location? Verify whether this hazard still exists or has already been reported.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400 shrink-0">
          <Users className="w-3.5 h-3.5 text-amber-400" />
          <span>{totalVotes} Votes</span>
        </div>
      </div>

      {/* Voting Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Still Exists / Confirm */}
        <Button
          type="button"
          onClick={() => handleVote("confirm")}
          disabled={isPending || Boolean(userVotedType)}
          className={cn(
            "relative h-auto py-3 px-4 flex items-center justify-between gap-3 rounded-xl font-semibold transition-all text-sm",
            userVotedType === "confirm"
              ? "bg-amber-500/20 border-2 border-amber-400 text-amber-300 shadow-md shadow-amber-500/10"
              : "bg-slate-900/90 border border-slate-700/80 hover:border-amber-500/50 text-slate-200 hover:text-white hover:bg-slate-800/80"
          )}
        >
          <div className="flex items-center gap-2.5 text-left min-w-0">
            {userVotedType === "confirm" ? (
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            ) : isPending ? (
              <Loader2 className="w-4 h-4 text-amber-400 animate-spin shrink-0" />
            ) : (
              <ThumbsUp className="w-4 h-4 text-amber-400 shrink-0" />
            )}
            <div className="truncate">
              <span className="block text-xs sm:text-sm font-bold truncate">
                {userVotedType === "confirm" ? "You Verified This" : "Still Exists"}
              </span>
              <span className="text-[10px] text-slate-400 font-normal">
                Confirm open hazard
              </span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-xs font-mono font-bold text-amber-400 shrink-0">
            {confirmCount}
          </span>
        </Button>

        {/* Report Duplicate / Dispute */}
        <Button
          type="button"
          onClick={() => handleVote("dispute")}
          disabled={isPending || Boolean(userVotedType)}
          className={cn(
            "relative h-auto py-3 px-4 flex items-center justify-between gap-3 rounded-xl font-semibold transition-all text-sm",
            userVotedType === "dispute"
              ? "bg-rose-500/20 border-2 border-rose-400 text-rose-300 shadow-md shadow-rose-500/10"
              : "bg-slate-900/90 border border-slate-700/80 hover:border-slate-500 text-slate-300 hover:text-white hover:bg-slate-800/80"
          )}
        >
          <div className="flex items-center gap-2.5 text-left min-w-0">
            {userVotedType === "dispute" ? (
              <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-slate-400 shrink-0" />
            )}
            <div className="truncate">
              <span className="block text-xs sm:text-sm font-bold truncate">
                {userVotedType === "dispute" ? "You Flagged This" : "Report Duplicate"}
              </span>
              <span className="text-[10px] text-slate-400 font-normal">
                Dispute or duplicate
              </span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-slate-300 shrink-0">
            {disputeCount}
          </span>
        </Button>
      </div>

      {/* Verification Stats & Progress Bar */}
      {totalVotes > 0 && (
        <div className="pt-2 border-t border-slate-800/60 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Community Agreement
            </span>
            <span className="font-mono font-bold text-amber-400">
              {confirmPercentage}% ({confirmCount} of {totalVotes} citizens)
            </span>
          </div>
          {/* Bar */}
          <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800 flex">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500 rounded-full"
              style={{ width: `${confirmPercentage}%` }}
            />
          </div>
        </div>
      )}

      {userVotedType && (
        <div className="text-[11px] text-center text-slate-400 bg-slate-950/60 py-1.5 px-3 rounded-lg border border-slate-800/80">
          ✓ Your anonymous vote has been recorded for this browser session.
        </div>
      )}
    </div>
  );
}
