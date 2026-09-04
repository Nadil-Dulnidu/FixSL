"use client";

import React from "react";
import { ISSUE_CATEGORIES, ISSUE_STATUSES } from "@/lib/constants";
import type { MapStats } from "@/lib/actions/issues";
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Eye,
} from "lucide-react";

interface MapStatsProps {
  stats: MapStats;
}

export function MapStatsPanel({ stats }: MapStatsProps) {
  return (
    <div className="p-4 sm:p-4.5 space-y-4 rounded-2xl bg-slate-950/40 border border-white/5 shadow-inner">
      {/* Header */}
      <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 pb-2 border-b border-white/5">
        <div className="w-6 h-6 rounded-lg bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-400 clay-icon-well">
          <BarChart3 className="w-3.5 h-3.5" />
        </div>
        Map Analytics
      </h3>

      {/* Total Issues + Resolution Rate */}
      <div className="grid grid-cols-2 gap-3">
        <div className="clay-inset p-3.5 rounded-2xl">
          <div className="flex items-center gap-1.5 mb-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Total
            </span>
          </div>
          <p className="text-2xl font-black font-mono text-slate-100">{stats.total}</p>
        </div>
        <div className="clay-inset p-3.5 rounded-2xl">
          <div className="flex items-center gap-1.5 mb-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Resolved
            </span>
          </div>
          <p className="text-2xl font-black font-mono text-emerald-400">
            {stats.resolutionRate}%
          </p>
        </div>
      </div>

      {/* By Status */}
      <div className="space-y-2.5">
        <h4 className="text-xs text-slate-400 font-bold uppercase tracking-wider">
          By Status
        </h4>
        <div className="space-y-2">
          {Object.entries(ISSUE_STATUSES).map(([key, config]) => {
            const count = stats.byStatus[key] || 0;
            const percentage =
              stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
            const statusIcons: Record<string, React.ReactNode> = {
              reported: <Eye className="w-3 h-3 text-blue-400" />,
              verified: <CheckCircle2 className="w-3 h-3 text-amber-400" />,
              in_progress: <Clock className="w-3 h-3 text-purple-400" />,
              resolved: <CheckCircle2 className="w-3 h-3 text-emerald-400" />,
            };

            return (
              <div key={key} className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 w-24 shrink-0">
                  {statusIcons[key]}
                  <span className="text-[11px] text-slate-300 font-semibold truncate">
                    {config.label}
                  </span>
                </div>
                <div className="flex-1 h-2 bg-slate-950 rounded-full overflow-hidden border border-white/5 shadow-inner">
                  <div
                    className="h-full rounded-full transition-all duration-500 shadow-sm"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor:
                        key === "reported"
                          ? "#3b82f6"
                          : key === "verified"
                          ? "#f59e0b"
                          : key === "in_progress"
                          ? "#a855f7"
                          : "#10b981",
                    }}
                  />
                </div>
                <span className="text-[11px] text-slate-400 font-mono font-bold w-6 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* By Category */}
      <div className="space-y-2.5">
        <h4 className="text-xs text-slate-400 font-bold uppercase tracking-wider">
          By Category
        </h4>
        <div className="space-y-2">
          {Object.entries(ISSUE_CATEGORIES).map(([key, config]) => {
            const count = stats.byCategory[key] || 0;
            const percentage =
              stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;

            return (
              <div key={key} className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 w-24 shrink-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: config.markerColor }}
                  />
                  <span className="text-[11px] text-slate-300 font-semibold truncate">
                    {config.label}
                  </span>
                </div>
                <div className="flex-1 h-2 bg-slate-950 rounded-full overflow-hidden border border-white/5 shadow-inner">
                  <div
                    className="h-full rounded-full transition-all duration-500 shadow-sm"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: config.markerColor,
                    }}
                  />
                </div>
                <span className="text-[11px] text-slate-400 font-mono font-bold w-6 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

