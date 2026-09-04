"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { parseTrackingId, formatTrackingId } from "@/lib/utils";
import { toast } from "sonner";

export function TrackIssue() {
  const [trackingInput, setTrackingInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = parseTrackingId(trackingInput);
    if (!cleanNum) {
      toast.error("Please enter a valid tracking number (e.g. FIX-1001 or 1001)");
      return;
    }

    setIsSearching(true);
    // In our routing structure, issue details are at /issues/[id] or lookup by tracking ID
    router.push(`/issues/${cleanNum}`);
  };

  return (
    <section id="track" className="py-16 md:py-24 bg-[#090d16] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="clay-card p-8 sm:p-12 border-amber-500/20 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold uppercase tracking-wider mb-4">
            <Search className="w-3.5 h-3.5" />
            Public Tracker
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
            Track a Reported Issue
          </h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto mb-8 leading-relaxed">
            Enter your FixSL reference code (e.g., <strong className="text-amber-400">FIX-1001</strong>) to check municipal repair status, community votes, and photo history.
          </p>

          <form onSubmit={handleSearch} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Input
                type="text"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                placeholder="e.g. FIX-1001 or 1001"
                className="h-13 pl-4 pr-10 text-base font-mono bg-slate-950/80 border-slate-700 text-white placeholder:text-slate-500 rounded-xl"
              />
            </div>
            <Button
              type="submit"
              disabled={isSearching || !trackingInput.trim()}
              variant="default"
              size="lg"
              className="h-13 px-6 gap-2 rounded-xl font-bold whitespace-nowrap"
            >
              <span>Track Status</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-3 text-xs text-slate-400">
            <span>Demo Reference IDs:</span>
            <button
              type="button"
              onClick={() => setTrackingInput("FIX-1001")}
              className="underline hover:text-amber-400 font-mono"
            >
              FIX-1001
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setTrackingInput("FIX-1003")}
              className="underline hover:text-amber-400 font-mono"
            >
              FIX-1003
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setTrackingInput("FIX-1005")}
              className="underline hover:text-amber-400 font-mono"
            >
              FIX-1005
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
