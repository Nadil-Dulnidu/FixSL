"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { parseTrackingId } from "@/lib/utils";
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
    router.push(`/issues/${cleanNum}`);
  };

  return (
    <section id="track" className="py-16 md:py-24 bg-[#090d16] relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="clay-card p-8 sm:p-12 border-amber-500/20 relative shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold uppercase tracking-wider mb-4 clay-pill">
            <Search className="w-3.5 h-3.5" />
            Public Tracker
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
            Track a Reported Issue
          </h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto mb-8 leading-relaxed">
            Enter your FixSL reference code (e.g., <strong className="text-amber-400 font-mono">FIX-1001</strong>) to check municipal repair status, community votes, and photo history.
          </p>

          <form onSubmit={handleSearch} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 w-full">
            <div className="relative flex-1 w-full">
              <Input
                type="text"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                placeholder="e.g. FIX-1001 or 1001"
                className="h-12 sm:h-13 pl-4 pr-10 text-sm sm:text-base font-mono rounded-2xl font-medium w-full"
              />
            </div>
            <Button
              type="submit"
              disabled={isSearching || !trackingInput.trim()}
              variant="default"
              size="lg"
              className="h-12 sm:h-13 px-6 gap-2 rounded-2xl font-bold whitespace-nowrap shadow-amber-500/25 w-full sm:w-auto touch-manipulation min-h-[48px]"
            >
              <span>Track Status</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Button>
          </form>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <span className="text-slate-500 w-full sm:w-auto mb-1 sm:mb-0">Demo Reference IDs:</span>
            {["FIX-1001", "FIX-1003", "FIX-1005"].map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setTrackingInput(id)}
                className="px-3 py-1.5 min-h-[36px] rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 hover:border-amber-500/30 text-amber-400 font-mono text-xs clay-pill transition-colors cursor-pointer touch-manipulation active:scale-95 flex items-center justify-center"
              >
                {id}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

