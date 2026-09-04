"use client";

import React, { useState, useMemo, useEffect } from "react";
import { IssueMap } from "@/components/map/issue-map";
import { MapFilters } from "@/components/map/map-filters";
import { MapStatsPanel } from "@/components/map/map-stats";
import type { Issue } from "@/lib/types/database";
import type { MapStats } from "@/lib/actions/issues";
import {
  Map,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MapPageClientProps {
  initialIssues: Issue[];
  initialStats: MapStats;
}

export function MapPageClient({ initialIssues, initialStats }: MapPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  
  // On desktop sidebar is open, on mobile it starts closed
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const hasActiveFilters = selectedCategory !== "all" || selectedStatus !== "all";

  // Client-side filtering for instant responsiveness
  const filteredIssues = useMemo(() => {
    return initialIssues.filter((issue) => {
      if (selectedCategory !== "all" && issue.category !== selectedCategory) return false;
      if (selectedStatus !== "all" && issue.status !== selectedStatus) return false;
      return true;
    });
  }, [initialIssues, selectedCategory, selectedStatus]);

  // Lock body scroll on mobile drawer
  useEffect(() => {
    if (mobileDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileDrawerOpen]);

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100dvh-5rem)] sm:h-[calc(100vh-5.5rem)] relative overflow-hidden">
      {/* Mobile Backdrop Overlay */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[1001] lg:hidden animate-in fade-in duration-200"
          onClick={() => setMobileDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Desktop Sidebar Toggle Button */}
      <button
        onClick={() => setDesktopSidebarOpen(!desktopSidebarOpen)}
        className={cn(
          "hidden lg:flex absolute top-3 z-[1001] p-2.5 rounded-xl border border-white/10 bg-slate-900/95 backdrop-blur-md text-slate-300 hover:text-amber-400 hover:border-amber-500/40 transition-all shadow-xl cursor-pointer active:scale-95",
          desktopSidebarOpen ? "left-[21rem]" : "left-3"
        )}
        aria-label={desktopSidebarOpen ? "Collapse filters sidebar" : "Expand filters sidebar"}
      >
        {desktopSidebarOpen ? (
          <ChevronLeft className="w-4 h-4" />
        ) : (
          <SlidersHorizontal className="w-4 h-4" />
        )}
      </button>

      {/* Desktop Sidebar (lg: and above) */}
      <aside
        className={cn(
          "hidden lg:block h-full overflow-y-auto bg-transparent transition-all duration-300 ease-in-out shrink-0",
          desktopSidebarOpen ? "w-80 pr-4 opacity-100" : "w-0 p-0 overflow-hidden opacity-0"
        )}
      >
        <div className="space-y-4 pb-4">
          <div className="pt-1 pb-1">
            <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Map className="w-5 h-5 text-amber-400" />
              Community Map
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Explore reported infrastructure issues across Sri Lanka
            </p>
          </div>

          <MapFilters
            selectedCategory={selectedCategory}
            selectedStatus={selectedStatus}
            onCategoryChange={setSelectedCategory}
            onStatusChange={setSelectedStatus}
            issueCount={filteredIssues.length}
          />

          <MapStatsPanel stats={initialStats} />
        </div>
      </aside>

      {/* Mobile Slide-Over Drawer (bottom sheet / side sheet on < lg) */}
      <aside
        className={cn(
          "lg:hidden fixed inset-y-0 right-0 z-[1002] w-full max-w-sm sm:max-w-md bg-[#090d16] border-l border-white/10 shadow-2xl p-5 overflow-y-auto transition-transform duration-300 ease-in-out",
          mobileDrawerOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-400">
              <Filter className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Map Filters & Stats</h2>
              <p className="text-[11px] text-slate-400">Refine {initialIssues.length} total mapped hazards</p>
            </div>
          </div>

          <button
            onClick={() => setMobileDrawerOpen(false)}
            className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-400 hover:text-white active:scale-95 transition-transform"
            aria-label="Close filters"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 pb-8">
          <MapFilters
            selectedCategory={selectedCategory}
            selectedStatus={selectedStatus}
            onCategoryChange={setSelectedCategory}
            onStatusChange={setSelectedStatus}
            issueCount={filteredIssues.length}
          />

          <MapStatsPanel stats={initialStats} />

          <button
            onClick={() => setMobileDrawerOpen(false)}
            className="w-full clay-btn-primary py-3 px-4 rounded-xl text-sm font-bold shadow-lg text-slate-950"
          >
            Show {filteredIssues.length} Mapped Hazards
          </button>
        </div>
      </aside>

      {/* Map Area */}
      <div className="flex-1 h-full w-full relative">
        <IssueMap issues={filteredIssues} />

        {/* Mobile Floating Action Trigger Pill (< lg) */}
        <div className="lg:hidden absolute bottom-5 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-2">
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="clay-card clay-card-hover px-4 py-2.5 flex items-center gap-2.5 border-amber-500/30 text-xs font-bold text-white shadow-2xl backdrop-blur-xl rounded-full cursor-pointer active:scale-95"
            aria-label="Open Map Filters & Statistics"
          >
            <SlidersHorizontal className="w-4 h-4 text-amber-400" />
            <span>Filters & Stats</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-mono text-[11px] border border-amber-500/30">
              {filteredIssues.length}
            </span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
