"use client";

import React from "react";
import Link from "next/link";
import { ISSUE_CATEGORIES, ISSUE_STATUSES } from "@/lib/constants";
import { formatTrackingId, formatRelativeTime } from "@/lib/utils";
import { MapPin, Clock, ExternalLink } from "lucide-react";
import type { Issue } from "@/lib/types/database";

interface MapMarkerPopupProps {
  issue: Issue;
}

export function MapMarkerPopup({ issue }: MapMarkerPopupProps) {
  const categoryConfig = ISSUE_CATEGORIES[issue.category];
  const statusConfig = ISSUE_STATUSES[issue.status];

  return (
    <div className="min-w-[220px] max-w-[280px] p-1">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-semibold text-slate-100 leading-snug line-clamp-2">
          {issue.title}
        </h3>
        <span className="text-[10px] font-mono text-amber-400 shrink-0 bg-amber-500/10 px-1.5 py-0.5 rounded">
          {formatTrackingId(issue.tracking_number)}
        </span>
      </div>

      {/* Badges row */}
      <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
        {categoryConfig && (
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-md border"
            style={{
              backgroundColor: `${categoryConfig.markerColor}15`,
              color: categoryConfig.markerColor,
              borderColor: `${categoryConfig.markerColor}40`,
            }}
          >
            {categoryConfig.label}
          </span>
        )}
        {statusConfig && (
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${statusConfig.badgeClass}`}
          >
            {statusConfig.label}
          </span>
        )}
      </div>

      {/* Meta row */}
      <div className="flex flex-col gap-1 text-[11px] text-slate-400 mb-3">
        {issue.location_name && (
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3 h-3 shrink-0 text-slate-500" />
            <span className="truncate">{issue.location_name}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <Clock className="w-3 h-3 shrink-0 text-slate-500" />
          <span>{formatRelativeTime(issue.created_at)}</span>
        </div>
      </div>

      {/* View link */}
      <Link
        href={`/issues/${issue.tracking_number}`}
        className="flex items-center justify-center gap-1.5 w-full px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25 transition-colors"
      >
        <ExternalLink className="w-3 h-3" />
        View Details
      </Link>
    </div>
  );
}
