"use client";

import React from "react";
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
    <div className="clay-card p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <svg
            className="w-4 h-4 text-amber-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filter Issues
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-[11px] text-amber-400 hover:text-amber-300 transition-colors font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="space-y-1.5">
        <label className="text-xs text-slate-400 font-medium">Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full h-9 px-3 rounded-lg border border-slate-700 bg-slate-900/80 text-sm text-slate-200 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 outline-none transition-all cursor-pointer appearance-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.5rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.5em 1.5em',
          }}
        >
          <option value="all">All Categories</option>
          {Object.entries(ISSUE_CATEGORIES).map(([key, config]) => (
            <option key={key} value={key}>
              {config.label}
            </option>
          ))}
        </select>
      </div>

      {/* Status Filter */}
      <div className="space-y-1.5">
        <label className="text-xs text-slate-400 font-medium">Status</label>
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full h-9 px-3 rounded-lg border border-slate-700 bg-slate-900/80 text-sm text-slate-200 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 outline-none transition-all cursor-pointer appearance-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.5rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.5em 1.5em',
          }}
        >
          <option value="all">All Statuses</option>
          {Object.entries(ISSUE_STATUSES).map(([key, config]) => (
            <option key={key} value={key}>
              {config.label}
            </option>
          ))}
        </select>
      </div>

      {/* Issue count */}
      <div className="pt-2 border-t border-slate-800">
        <p className="text-xs text-slate-400">
          Showing{" "}
          <span className="text-amber-400 font-semibold">{issueCount}</span>{" "}
          issue{issueCount !== 1 ? "s" : ""} on map
        </p>
      </div>
    </div>
  );
}
