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
    <div className="min-w-[220px] max-w-[280px] p-1.5 space-y-2.5">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">
          {issue.title}
        </h3>
        <span className="text-[10px] font-mono font-bold text-amber-400 shrink-0 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full clay-pill">
          {formatTrackingId(issue.tracking_number)}
        </span>
      </div>

      {/* Badges row */}
      <div className="flex flex-wrap items-center gap-1.5">
        {categoryConfig && (
          <span
            className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border clay-pill"
            style={{
              backgroundColor: `${categoryConfig.markerColor}20`,
              color: categoryConfig.markerColor,
              borderColor: `${categoryConfig.markerColor}40`,
            }}
          >
            {categoryConfig.label}
          </span>
        )}
        {statusConfig && (
          <span
            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border clay-pill ${statusConfig.badgeClass}`}
          >
            {statusConfig.label}
          </span>
        )}
      </div>

      {/* Meta row */}
      <div className="flex flex-col gap-1 text-[11px] text-slate-300">
        {issue.location_name && (
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-amber-400" />
            <span className="truncate">{issue.location_name}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 shrink-0 text-slate-400" />
          <span>{formatRelativeTime(issue.created_at)}</span>
        </div>
      </div>

      {/* View link */}
      <Link
        href={`/issues/${issue.tracking_number}`}
        className="clay-btn-primary flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-bold text-slate-950 shadow-md shadow-amber-500/20"
      >
        <span>View Full Details</span>
        <ExternalLink className="w-3 h-3 stroke-[2.5]" />
      </Link>
    </div>
  );
}

