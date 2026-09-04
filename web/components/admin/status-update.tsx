"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateIssueStatus } from "@/lib/actions/admin";
import { ISSUE_STATUSES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ChevronDown, Loader2 } from "lucide-react";

interface StatusUpdateProps {
  issueId: string;
  currentStatus: string;
}

export function StatusUpdate({ issueId, currentStatus }: StatusUpdateProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const currentConfig = ISSUE_STATUSES[currentStatus];

  async function handleStatusChange(newStatus: string) {
    if (newStatus === currentStatus) {
      setIsOpen(false);
      return;
    }

    setIsOpen(false);

    startTransition(async () => {
      const result = await updateIssueStatus(issueId, newStatus);

      if (result.success) {
        toast.success(`Status updated to "${ISSUE_STATUSES[newStatus]?.label || newStatus}"`);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update status");
      }
    });
  }

  return (
    <div className="relative">
      <label className="block text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">
        Status
      </label>

      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className={cn(
          "w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl border transition-all text-sm font-medium",
          "bg-slate-800/60 border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-slate-600",
          isPending && "opacity-60 cursor-wait"
        )}
      >
        <div className="flex items-center gap-2">
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
          ) : (
            <div
              className={cn(
                "h-2.5 w-2.5 rounded-full",
                currentStatus === "reported" && "bg-blue-400",
                currentStatus === "verified" && "bg-amber-400",
                currentStatus === "in_progress" && "bg-purple-400",
                currentStatus === "resolved" && "bg-emerald-400"
              )}
            />
          )}
          {currentConfig?.label || currentStatus}
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-slate-500 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-1 z-50 py-1 rounded-xl bg-slate-800 border border-slate-700 shadow-2xl shadow-black/40 overflow-hidden">
            {Object.values(ISSUE_STATUSES).map((status) => (
              <button
                key={status.value}
                onClick={() => handleStatusChange(status.value)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left",
                  status.value === currentStatus
                    ? "bg-slate-700/60 text-white"
                    : "text-slate-300 hover:bg-slate-700/40 hover:text-white"
                )}
              >
                <div
                  className={cn(
                    "h-2.5 w-2.5 rounded-full shrink-0",
                    status.value === "reported" && "bg-blue-400",
                    status.value === "verified" && "bg-amber-400",
                    status.value === "in_progress" && "bg-purple-400",
                    status.value === "resolved" && "bg-emerald-400"
                  )}
                />
                <div>
                  <p className="font-medium">{status.label}</p>
                  <p className="text-[11px] text-slate-500">
                    {status.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
