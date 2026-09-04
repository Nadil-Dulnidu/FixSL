import React from "react";
import { AlertTriangle, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface DisputeBadgeProps {
  disputeCount: number;
  className?: string;
  variant?: "badge" | "banner";
}

export function DisputeBadge({
  disputeCount,
  className,
  variant = "badge",
}: DisputeBadgeProps) {
  if (disputeCount < 5) return null;

  if (variant === "badge") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/15 text-red-400 border border-red-500/40 animate-pulse shadow-sm shadow-red-500/10",
          className
        )}
      >
        <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-400" />
        <span>Resolution Disputed ({disputeCount})</span>
      </span>
    );
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-red-500/40 bg-gradient-to-r from-red-950/40 via-red-900/20 to-slate-950/60 p-4 sm:p-5 backdrop-blur-md shadow-lg shadow-red-950/30",
        className
      )}
    >
      <div className="flex items-start gap-3.5">
        <div className="h-10 w-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center shrink-0 text-red-400 shadow-inner">
          <ShieldAlert className="w-5 h-5 animate-pulse" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-bold text-red-300">
              ⚠️ Resolution Disputed by Community
            </h4>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30 font-semibold">
              {disputeCount} Citizens Disputed
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Municipal authorities marked this infrastructure issue as resolved, but {disputeCount} local citizens have reported that the hazard remains unresolved. This report has been flagged for municipal re-inspection.
          </p>
        </div>
      </div>
    </div>
  );
}
