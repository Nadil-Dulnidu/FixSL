"use client";

import Link from "next/link";
import { IssueStatusBadge } from "@/components/issues/issue-status-badge";
import { PriorityBadge } from "@/components/issues/priority-badge";
import { CategoryBadge } from "@/components/issues/category-badge";
import { formatTrackingId, formatRelativeTime } from "@/lib/utils";
import { ExternalLink, MapPin, ChevronRight } from "lucide-react";
import type { Issue } from "@/lib/types/database";

interface IssuesTableProps {
  issues: Issue[];
}

export function IssuesTable({ issues }: IssuesTableProps) {
  if (issues.length === 0) {
    return (
      <div className="clay-card p-8 sm:p-12 text-center border-white/5">
        <p className="text-slate-400 text-sm font-medium">
          No issues match the current filters.
        </p>
      </div>
    );
  }

  return (
    <div className="clay-card overflow-hidden border-white/5 shadow-xl">
      {/* Mobile Card List View (< md) */}
      <div className="block md:hidden divide-y divide-white/5">
        {issues.map((issue) => (
          <Link
            key={issue.id}
            href={`/admin/issues/${issue.id}`}
            className="p-4 flex flex-col gap-2.5 hover:bg-slate-800/30 transition-colors active:bg-slate-800/50 block"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/15 px-2.5 py-1 rounded-full border border-amber-500/30 clay-pill">
                {formatTrackingId(issue.tracking_number)}
              </span>
              <div className="flex items-center gap-1.5">
                <IssueStatusBadge status={issue.status} />
                <PriorityBadge priority={issue.priority} />
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-white line-clamp-2">
                {issue.title}
              </p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <CategoryBadge category={issue.category} className="text-[10px]" />
                {issue.location_name && (
                  <span className="text-xs text-slate-400 flex items-center gap-1 truncate max-w-[200px]">
                    <MapPin className="h-3 w-3 text-amber-400 shrink-0" />
                    {issue.location_name}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 border-t border-white/5">
              <span>Reported {formatRelativeTime(issue.created_at)}</span>
              <span className="text-amber-400 font-semibold flex items-center gap-0.5">
                Manage <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Desktop Table View (md: and above) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5 bg-slate-950/30">
              <th className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider px-5 py-3.5">
                Tracking ID
              </th>
              <th className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider px-5 py-3.5">
                Issue
              </th>
              <th className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider px-5 py-3.5">
                Category
              </th>
              <th className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider px-5 py-3.5">
                Status
              </th>
              <th className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider px-5 py-3.5">
                Priority
              </th>
              <th className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider px-5 py-3.5 hidden xl:table-cell">
                Location
              </th>
              <th className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider px-5 py-3.5">
                Reported
              </th>
              <th className="px-5 py-3.5 w-10" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {issues.map((issue) => (
              <tr
                key={issue.id}
                className="hover:bg-slate-800/30 transition-colors group"
              >
                {/* Tracking ID */}
                <td className="px-5 py-4">
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/15 px-2.5 py-1 rounded-full border border-amber-500/30 clay-pill">
                    {formatTrackingId(issue.tracking_number)}
                  </span>
                </td>

                {/* Title */}
                <td className="px-5 py-4">
                  <p className="text-sm font-semibold text-slate-200 truncate max-w-[240px] group-hover:text-white transition-colors">
                    {issue.title}
                  </p>
                </td>

                {/* Category */}
                <td className="px-5 py-4">
                  <CategoryBadge
                    category={issue.category}
                    className="text-[10px]"
                  />
                </td>

                {/* Status */}
                <td className="px-5 py-4">
                  <IssueStatusBadge status={issue.status} />
                </td>

                {/* Priority */}
                <td className="px-5 py-4">
                  <PriorityBadge priority={issue.priority} />
                </td>

                {/* Location */}
                <td className="px-5 py-4 hidden xl:table-cell">
                  {issue.location_name ? (
                    <span className="text-xs text-slate-300 flex items-center gap-1.5 truncate max-w-[180px]">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                      {issue.location_name}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-600">—</span>
                  )}
                </td>

                {/* Date */}
                <td className="px-5 py-4">
                  <span className="text-xs text-slate-400 font-medium">
                    {formatRelativeTime(issue.created_at)}
                  </span>
                </td>

                {/* Action */}
                <td className="px-5 py-4">
                  <Link
                    href={`/admin/issues/${issue.id}`}
                    className="p-2 rounded-xl bg-slate-900 border border-white/5 text-slate-400 hover:text-amber-400 clay-icon-well inline-flex min-h-[36px] min-w-[36px] items-center justify-center"
                    aria-label={`View issue ${formatTrackingId(issue.tracking_number)}`}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Row count */}
      <div className="px-5 py-3 border-t border-white/5 text-xs text-slate-400 font-medium bg-slate-950/20 flex items-center justify-between">
        <span>
          Showing <span className="font-mono font-bold text-amber-400">{issues.length}</span> issue{issues.length !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}

