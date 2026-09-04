"use client";

import Link from "next/link";
import { IssueStatusBadge } from "@/components/issues/issue-status-badge";
import { PriorityBadge } from "@/components/issues/priority-badge";
import { CategoryBadge } from "@/components/issues/category-badge";
import { formatTrackingId, formatRelativeTime } from "@/lib/utils";
import { ExternalLink, MapPin } from "lucide-react";
import type { Issue } from "@/lib/types/database";

interface IssuesTableProps {
  issues: Issue[];
}

export function IssuesTable({ issues }: IssuesTableProps) {
  if (issues.length === 0) {
    return (
      <div className="clay-card p-12 text-center border-white/5">
        <p className="text-slate-400 text-sm font-medium">
          No issues match the current filters.
        </p>
      </div>
    );
  }

  return (
    <div className="clay-card overflow-hidden border-white/5 shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5 bg-slate-950/30">
              <th className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider px-5 py-3.5">
                Tracking ID
              </th>
              <th className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider px-5 py-3.5">
                Issue
              </th>
              <th className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider px-5 py-3.5 hidden md:table-cell">
                Category
              </th>
              <th className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider px-5 py-3.5">
                Status
              </th>
              <th className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider px-5 py-3.5 hidden lg:table-cell">
                Priority
              </th>
              <th className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider px-5 py-3.5 hidden xl:table-cell">
                Location
              </th>
              <th className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider px-5 py-3.5 hidden sm:table-cell">
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
                  <p className="text-sm font-semibold text-slate-200 truncate max-w-[250px] group-hover:text-white transition-colors">
                    {issue.title}
                  </p>
                </td>

                {/* Category */}
                <td className="px-5 py-4 hidden md:table-cell">
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
                <td className="px-5 py-4 hidden lg:table-cell">
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
                <td className="px-5 py-4 hidden sm:table-cell">
                  <span className="text-xs text-slate-400 font-medium">
                    {formatRelativeTime(issue.created_at)}
                  </span>
                </td>

                {/* Action */}
                <td className="px-5 py-4">
                  <Link
                    href={`/admin/issues/${issue.id}`}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-xl bg-slate-900 border border-white/5 text-slate-400 hover:text-amber-400 clay-icon-well inline-flex"
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
      <div className="px-5 py-3 border-t border-white/5 text-xs text-slate-400 font-medium bg-slate-950/20">
        Showing <span className="font-mono font-bold text-amber-400">{issues.length}</span> issue{issues.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
}

