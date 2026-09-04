"use client";

import { useEffect } from "react";
import { AlertOctagon, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { logger } from "@/lib/logger";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("Unhandled global app error", {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    });
  }, [error]);

  return (
    <div className="min-h-screen bg-[#090d16] flex items-center justify-center p-6">
      <div className="clay-card max-w-lg w-full p-8 text-center border border-red-500/30">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-6 text-red-400">
          <AlertOctagon className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-white mb-2 tracking-tight">
          Application Error
        </h1>
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
          We encountered an issue while loading this page. Our civic support system has been notified.
        </p>

        {error.digest && (
          <p className="text-xs font-mono text-slate-500 mb-6 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => reset()} variant="default" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Try again
          </Button>
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto gap-2">
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
