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
    <div className="clay-card p-4 sm:p-5 border-white/5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center justify-between sm:justify-start gap-2 text-xs text-slate-400 font-bold uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-400 clay-icon-well">
              <Filter className="h-3.5 w-3.5" />
            </div>
            <span>Filters:</span>
          </div>

          {/* Clear Filters on mobile right aligned */}
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="sm:hidden gap-1 text-amber-400 hover:text-amber-300 font-bold text-xs h-7 px-2"
            >
              <X className="h-3.5 w-3.5" />
              Reset
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-2.5 sm:gap-3 flex-1">
          {/* Status Filter */}
          <select
            value={currentStatus}
            onChange={(e) => updateFilter("status", e.target.value)}
            className="clay-inset h-10 px-3.5 text-xs sm:text-sm text-slate-200 outline-none cursor-pointer appearance-none font-medium pr-8 w-full sm:w-auto min-w-[140px]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23f59e0b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.65rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1.2em 1.2em',
            }}
          >
            <option value="all">All Statuses</option>
            {Object.values(ISSUE_STATUSES).map((s) => (
              <option key={s.value} value={s.value} className="bg-slate-900 text-white">
                {s.label}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={currentCategory}
            onChange={(e) => updateFilter("category", e.target.value)}
            className="clay-inset h-10 px-3.5 text-xs sm:text-sm text-slate-200 outline-none cursor-pointer appearance-none font-medium pr-8 w-full sm:w-auto min-w-[140px]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23f59e0b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.65rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1.2em 1.2em',
            }}
          >
            <option value="all">All Categories</option>
            {Object.values(ISSUE_CATEGORIES).map((c) => (
              <option key={c.value} value={c.value} className="bg-slate-900 text-white">
                {c.label}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={currentPriority}
            onChange={(e) => updateFilter("priority", e.target.value)}
            className="clay-inset h-10 px-3.5 text-xs sm:text-sm text-slate-200 outline-none cursor-pointer appearance-none font-medium pr-8 w-full sm:w-auto min-w-[140px]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23f59e0b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.65rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1.2em 1.2em',
            }}
          >
            <option value="all">All Priorities</option>
            {Object.values(ISSUE_PRIORITIES).map((p) => (
              <option key={p.value} value={p.value} className="bg-slate-900 text-white">
                {p.label}
              </option>
            ))}
          </select>

          {/* Clear Filters on Desktop */}
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="hidden sm:inline-flex gap-1.5 text-amber-400 hover:text-amber-300 font-bold text-xs"
            >
              <X className="h-3.5 w-3.5" />
              Reset
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

