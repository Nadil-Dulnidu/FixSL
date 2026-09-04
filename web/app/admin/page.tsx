import { getAdminStats, getAdminIssues } from "@/lib/actions/admin";
import { StatsCards } from "@/components/admin/stats-cards";
import { IssueStatusBadge } from "@/components/issues/issue-status-badge";
import { PriorityBadge } from "@/components/issues/priority-badge";
import { CategoryBadge } from "@/components/issues/category-badge";
import { formatTrackingId, formatRelativeTime } from "@/lib/utils";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const [statsResult, issuesResult] = await Promise.all([
    getAdminStats(),
    getAdminIssues(),
  ]);

  // Fallback stats if Supabase is not configured
  const stats = statsResult.success
    ? statsResult.data
    : {
        total: 25,
        reported: 9,
        verified: 5,
        in_progress: 6,
        resolved: 5,
        critical: 3,
        high: 5,
      };

  const recentIssues = issuesResult.success
    ? issuesResult.data.slice(0, 8)
    : [];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <LayoutDashboard className="h-5 w-5 text-amber-400" />
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        </div>
        <p className="text-slate-400 text-sm">
          Overview of civic infrastructure issues across Sri Lanka
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Recent Issues */}
      <div className="clay-card overflow-hidden">
        <div className="p-5 border-b border-slate-800/60 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Recent Issues
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Latest citizen reports
            </p>
          </div>
          <Link
            href="/admin/issues"
            className="text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors"
          >
            View all →
          </Link>
        </div>

        {recentIssues.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-slate-500 text-sm">
              No issues found. Issues will appear here once citizens start
              reporting.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/40">
            {recentIssues.map((issue) => (
              <Link
                key={issue.id}
                href={`/admin/issues/${issue.id}`}
                className="flex items-center gap-4 px-5 py-4 hover:bg-slate-800/30 transition-colors group"
              >
                {/* Tracking ID */}
                <span className="text-xs font-mono text-amber-400/80 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 shrink-0">
                  {formatTrackingId(issue.tracking_number)}
                </span>

                {/* Title + Category */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate group-hover:text-white transition-colors">
                    {issue.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <CategoryBadge
                      category={issue.category}
                      className="text-[10px] px-2 py-0"
                    />
                    {issue.location_name && (
                      <span className="text-[11px] text-slate-500 truncate">
                        {issue.location_name}
                      </span>
                    )}
                  </div>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2 shrink-0 hidden sm:flex">
                  <IssueStatusBadge status={issue.status} />
                  <PriorityBadge priority={issue.priority} />
                </div>

                {/* Time */}
                <span className="text-xs text-slate-500 shrink-0 hidden md:block">
                  {formatRelativeTime(issue.created_at)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
