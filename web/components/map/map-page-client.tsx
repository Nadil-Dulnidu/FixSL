"use client";

import React, { useState, useMemo, useTransition } from "react";
import { IssueMap } from "@/components/map/issue-map";
import { MapFilters } from "@/components/map/map-filters";
import { MapStatsPanel } from "@/components/map/map-stats";
import type { Issue } from "@/lib/types/database";
import type { MapStats } from "@/lib/actions/issues";
import { Map, SlidersHorizontal, BarChart3, ChevronLeft, ChevronRight } from "lucide-react";

interface MapPageClientProps {
  initialIssues: Issue[];
  initialStats: MapStats;
}

export function MapPageClient({ initialIssues, initialStats }: MapPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Client-side filtering for instant responsiveness
  const filteredIssues = useMemo(() => {
    return initialIssues.filter((issue) => {
      if (selectedCategory !== "all" && issue.category !== selectedCategory) return false;
      if (selectedStatus !== "all" && issue.status !== selectedStatus) return false;
      return true;
    });
  }, [initialIssues, selectedCategory, selectedStatus]);

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] relative">
      {/* Sidebar Toggle Button (mobile + collapsed) */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`
          absolute top-4 z-[1001] p-2 rounded-lg border border-slate-700 bg-slate-900/95 backdrop-blur-md text-slate-300 hover:text-amber-400 hover:border-amber-500/40 transition-all shadow-lg
          ${sidebarOpen ? "left-[calc(100%-3rem)] lg:left-[17rem]" : "left-4"}
        `}
        aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
      >
        {sidebarOpen ? (
          <ChevronLeft className="w-4 h-4" />
        ) : (
          <SlidersHorizontal className="w-4 h-4" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          absolute lg:relative z-[1000] top-0 left-0 h-full overflow-y-auto
          bg-[#090d16]/95 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none
          border-r border-slate-800 lg:border-r-0
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? "w-full sm:w-80 lg:w-80 p-4 lg:p-0 lg:pr-4" : "w-0 p-0 overflow-hidden"}
        `}
      >
        <div className={`space-y-4 ${sidebarOpen ? "opacity-100" : "opacity-0"} transition-opacity duration-200`}>
          {/* Page Title (sidebar version) */}
          <div className="pt-2 pb-1">
            <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Map className="w-5 h-5 text-amber-400" />
              Community Map
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Explore reported infrastructure issues across Colombo
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

      {/* Map Area */}
      <div className="flex-1 h-full p-4 lg:p-0 lg:pt-0">
        <div className="h-full w-full">
          <IssueMap issues={filteredIssues} />
        </div>
      </div>
    </div>
  );
}
