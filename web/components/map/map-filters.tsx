"use client";

import React from "react";
import { Filter } from "lucide-react";
import { ISSUE_CATEGORIES, ISSUE_STATUSES } from "@/lib/constants";

interface MapFiltersProps {
  selectedCategory: string;
  selectedStatus: string;
  onCategoryChange: (category: string) => void;
  onStatusChange: (status: string) => void;
  issueCount: number;
}

export function MapFilters({
  selectedCategory,
  selectedStatus,
  onCategoryChange,
  onStatusChange,
  issueCount,
}: MapFiltersProps) {
  const hasActiveFilters = selectedCategory !== "all" || selectedStatus !== "all";

  const clearFilters = () => {
    onCategoryChange("all");
    onStatusChange("all");
  };

  return (
    <div className="p-4 sm:p-4.5 space-y-3.5 rounded-2xl bg-slate-950/40 border border-white/5 shadow-inner">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/5">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-400 clay-icon-well">
            <Filter className="w-3.5 h-3.5" />
          </div>
          Filter Issues
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-[11px] text-amber-400 hover:text-amber-300 transition-colors font-bold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 clay-pill cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="space-y-1.5">
        <label className="text-xs text-slate-400 font-semibold">Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="clay-inset w-full h-11 min-h-[44px] px-3.5 text-xs sm:text-sm text-slate-200 outline-none cursor-pointer appearance-none font-medium touch-manipulation"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23f59e0b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.75rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.25em 1.25em',
          }}
        >
          <option value="all">All Categories</option>
          {Object.entries(ISSUE_CATEGORIES).map(([key, config]) => (
            <option key={key} value={key} className="bg-slate-900 text-white">
              {config.label}
            </option>
          ))}
        </select>
      </div>

      {/* Status Filter */}
      <div className="space-y-1.5">
        <label className="text-xs text-slate-400 font-semibold">Status</label>
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="clay-inset w-full h-11 min-h-[44px] px-3.5 text-xs sm:text-sm text-slate-200 outline-none cursor-pointer appearance-none font-medium touch-manipulation"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23f59e0b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.75rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.25em 1.25em',
          }}
        >
          <option value="all">All Statuses</option>
          {Object.entries(ISSUE_STATUSES).map(([key, config]) => (
            <option key={key} value={key} className="bg-slate-900 text-white">
              {config.label}
            </option>
          ))}
        </select>
      </div>

      {/* Issue count */}
      <div className="pt-2 border-t border-white/5 flex items-center justify-between">
        <p className="text-xs text-slate-400 font-medium">
          Showing <span className="text-amber-400 font-bold font-mono">{issueCount}</span> issue{issueCount !== 1 ? "s" : ""}
        </p>
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      </div>
    </div>
  );
}

