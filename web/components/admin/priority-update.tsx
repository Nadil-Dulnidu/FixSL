"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateIssuePriority } from "@/lib/actions/admin";
import { ISSUE_PRIORITIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ChevronDown, Loader2 } from "lucide-react";

interface PriorityUpdateProps {
  issueId: string;
  currentPriority: string;
}

export function PriorityUpdate({ issueId, currentPriority }: PriorityUpdateProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const currentConfig = ISSUE_PRIORITIES[currentPriority];

  async function handlePriorityChange(newPriority: string) {
    if (newPriority === currentPriority) {
      setIsOpen(false);
      return;
    }

    setIsOpen(false);

    startTransition(async () => {
      const result = await updateIssuePriority(issueId, newPriority);

      if (result.success) {
        toast.success(`Priority updated to "${ISSUE_PRIORITIES[newPriority]?.label || newPriority}"`);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update priority");
      }
    });
  }

  return (
    <div className="relative">
      <label className="block text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">
        Priority
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
                currentPriority === "low" && "bg-zinc-400",
                currentPriority === "medium" && "bg-blue-400",
                currentPriority === "high" && "bg-amber-400",
                currentPriority === "critical" && "bg-red-400 animate-pulse"
              )}
            />
          )}
          {currentConfig?.label || currentPriority}
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
            {Object.values(ISSUE_PRIORITIES).map((priority) => (
              <button
                key={priority.value}
                onClick={() => handlePriorityChange(priority.value)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left",
                  priority.value === currentPriority
                    ? "bg-slate-700/60 text-white"
                    : "text-slate-300 hover:bg-slate-700/40 hover:text-white"
                )}
              >
                <div
                  className={cn(
                    "h-2.5 w-2.5 rounded-full shrink-0",
                    priority.value === "low" && "bg-zinc-400",
                    priority.value === "medium" && "bg-blue-400",
                    priority.value === "high" && "bg-amber-400",
                    priority.value === "critical" && "bg-red-400"
                  )}
                />
                <span className="font-medium">{priority.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
