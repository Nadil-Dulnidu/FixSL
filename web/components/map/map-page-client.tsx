"use client";

import React, { useState, useMemo, useEffect } from "react";
import { IssueMap } from "@/components/map/issue-map";
import { MapFilters } from "@/components/map/map-filters";
import { MapStatsPanel } from "@/components/map/map-stats";
import type { Issue } from "@/lib/types/database";
import type { MapStats } from "@/lib/actions/issues";
import { Map, SlidersHorizontal, ChevronLeft, X, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MapPageClientProps {
  initialIssues: Issue[];
  initialStats: MapStats;
}

export function MapPageClient({ initialIssues, initialStats }: MapPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Client-side filtering for instant responsiveness
  const filteredIssues = useMemo(() => {
    return initialIssues.filter((issue) => {
      if (selectedCategory !== "all" && issue.category !== selectedCategory) return false;
      if (selectedStatus !== "all" && issue.status !== selectedStatus) return false;
      return true;
    });
  }, [initialIssues, selectedCategory, selectedStatus]);

  const hasActiveFilters = selectedCategory !== "all" || selectedStatus !== "all";

  return (
    <div className="w-full h-[calc(100vh-5.5rem)] min-h-[550px] px-3 sm:px-6 lg:px-8 pb-4 pt-1 max-w-[1700px] mx-auto flex flex-col lg:flex-row gap-4 relative">
      {/* ──────────────────────────────────────────────
          1. DESKTOP SIDEBAR PANEL (>= lg)
          ────────────────────────────────────────────── */}
      <aside
        className={`
          hidden lg:flex flex-col h-full shrink-0 clay-card border border-white/10 shadow-2xl relative
          transition-all duration-300 ease-in-out overflow-hidden
          ${sidebarOpen ? "w-84 xl:w-96 p-5" : "w-0 p-0 border-0 shadow-none pointer-events-none"}
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md shadow-amber-500/20 text-slate-950 shrink-0">
              <Map className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-white tracking-tight truncate">
                Community Map
              </h2>
              <p className="text-[11px] text-slate-400 truncate">
                Live Sri Lanka Civic Registry
              </p>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="w-8 h-8 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 flex items-center justify-center text-slate-400 hover:text-amber-400 transition-colors cursor-pointer shrink-0"
            title="Collapse Sidebar"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Filters & Analytics */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 mt-4 scrollbar-thin">
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

      {/* ──────────────────────────────────────────────
          2. MAP VIEW AREA
          ────────────────────────────────────────────── */}
      <div className="flex-1 h-full min-h-[400px] relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 clay-card">
        {/* Desktop Expand Button (when sidebar is collapsed) */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="hidden lg:flex items-center gap-2.5 absolute top-4 left-4 z-[1000] px-4 py-2.5 rounded-2xl bg-slate-950/90 hover:bg-slate-900 border border-white/10 hover:border-amber-500/40 text-xs font-bold text-slate-200 hover:text-amber-300 backdrop-blur-xl shadow-2xl transition-all clay-card group cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>Filters & Analytics</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse ml-0.5" />
            )}
          </button>
        )}

        <IssueMap issues={filteredIssues} />
      </div>

      {/* ──────────────────────────────────────────────
          3. MOBILE FLOATING ACTION BUTTON (< lg)
          ────────────────────────────────────────────── */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[1001]">
        <Button
          onClick={() => setMobileDrawerOpen(true)}
          variant="default"
          size="default"
          className="shadow-2xl shadow-amber-500/35 font-bold gap-2.5 px-5 h-12 rounded-full touch-manipulation border border-amber-300/40"
        >
          <SlidersHorizontal className="w-4 h-4 stroke-[2.5]" />
          <span>Filters & Stats</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping ml-0.5" />
          )}
        </Button>
      </div>

      {/* ──────────────────────────────────────────────
          4. MOBILE SLIDE-OVER DRAWER (< lg)
          ────────────────────────────────────────────── */}
      {mobileDrawerOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setMobileDrawerOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[1002] lg:hidden animate-in fade-in duration-200"
            aria-hidden="true"
          />

          {/* Drawer Sheet */}
          <div className="fixed inset-y-3 left-3 z-[1003] w-[calc(100vw-1.5rem)] max-w-sm rounded-3xl clay-card border border-amber-500/20 p-5 shadow-2xl flex flex-col lg:hidden animate-in slide-in-from-left duration-250 bg-[#090d16]/98 backdrop-blur-2xl">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md shadow-amber-500/20 text-slate-950 shrink-0">
                  <Map className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight">
                    Community Map
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Filters & Live Analytics
                  </p>
                </div>
              </div>

              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="w-9 h-9 rounded-2xl bg-slate-900 border border-white/10 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
                aria-label="Close drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 mt-4">
              <MapFilters
                selectedCategory={selectedCategory}
                selectedStatus={selectedStatus}
                onCategoryChange={setSelectedCategory}
                onStatusChange={setSelectedStatus}
                issueCount={filteredIssues.length}
              />

              <MapStatsPanel stats={initialStats} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
