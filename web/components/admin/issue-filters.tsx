"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ISSUE_CATEGORIES, ISSUE_STATUSES, ISSUE_PRIORITIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";

export function IssueFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentStatus = searchParams.get("status") || "all";
  const currentCategory = searchParams.get("category") || "all";
  const currentPriority = searchParams.get("priority") || "all";

  const hasFilters =
    currentStatus !== "all" ||
    currentCategory !== "all" ||
    currentPriority !== "all";

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/admin/issues?${params.toString()}`);
  }

  function clearFilters() {
    router.push("/admin/issues");
  }

  return (
    <div className="clay-card p-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Filter className="h-3.5 w-3.5" />
          Filters
        </div>

        {/* Status Filter */}
        <select
          value={currentStatus}
          onChange={(e) => updateFilter("status", e.target.value)}
          className="h-9 px-3 rounded-lg bg-slate-800 border border-slate-700 text-sm text-slate-200 focus:ring-amber-500 focus:border-amber-500 outline-none cursor-pointer"
        >
          <option value="all">All Statuses</option>
          {Object.values(ISSUE_STATUSES).map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        {/* Category Filter */}
        <select
          value={currentCategory}
          onChange={(e) => updateFilter("category", e.target.value)}
          className="h-9 px-3 rounded-lg bg-slate-800 border border-slate-700 text-sm text-slate-200 focus:ring-amber-500 focus:border-amber-500 outline-none cursor-pointer"
        >
          <option value="all">All Categories</option>
          {Object.values(ISSUE_CATEGORIES).map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

        {/* Priority Filter */}
        <select
          value={currentPriority}
          onChange={(e) => updateFilter("priority", e.target.value)}
          className="h-9 px-3 rounded-lg bg-slate-800 border border-slate-700 text-sm text-slate-200 focus:ring-amber-500 focus:border-amber-500 outline-none cursor-pointer"
        >
          <option value="all">All Priorities</option>
          {Object.values(ISSUE_PRIORITIES).map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>

        {/* Clear Filters */}
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="gap-1.5 text-slate-400 hover:text-slate-200"
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
