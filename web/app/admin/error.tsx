"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="clay-card p-10 max-w-lg text-center space-y-5">
        <div className="mx-auto h-16 w-16 rounded-2xl bg-red-500/15 flex items-center justify-center border border-red-500/30">
          <AlertTriangle className="h-8 w-8 text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">
          Something went wrong
        </h2>
        <p className="text-slate-400 leading-relaxed">
          An error occurred while loading the admin panel. This has been logged
          for investigation.
        </p>
        {error.digest && (
          <p className="text-xs text-slate-600 font-mono">
            Error ID: {error.digest}
          </p>
        )}
        <Button onClick={reset} variant="secondary" className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    </div>
  );
}
