"use client";

import React from "react";
import Image from "next/image";
import {
  Calendar,
  MapPin,
  Clock,
  Hash,
  FileText,
  ImageIcon,
} from "lucide-react";
import { IssueStatusBadge } from "@/components/issues/issue-status-badge";
import { CategoryBadge } from "@/components/issues/category-badge";
import { PriorityBadge } from "@/components/issues/priority-badge";
import { MiniMap } from "@/components/issues/mini-map";
import { formatTrackingId, formatDate, formatRelativeTime } from "@/lib/utils";
import { ISSUE_STATUSES } from "@/lib/constants";
import type { Issue } from "@/lib/types/database";

interface IssueDetailCardProps {
  issue: Issue;
}

export function IssueDetailCard({ issue }: IssueDetailCardProps) {
  const trackingId = formatTrackingId(issue.tracking_number);
  const statusConfig = ISSUE_STATUSES[issue.status];
  const statusStep = statusConfig?.step || 1;

  return (
    <div className="space-y-6">
      {/* Header: Tracking ID + Status + Priority */}
      <div className="clay-card p-6 md:p-8">
        {/* Top row: tracking ID + badges */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <Hash className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-bold text-amber-400 tracking-wider">
                {trackingId}
              </span>
            </div>
            <PriorityBadge priority={issue.priority} />
          </div>
          <div className="flex items-center gap-2">
            <IssueStatusBadge status={issue.status} />
            <CategoryBadge category={issue.category} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-slate-50 mb-3 leading-tight">
          {issue.title}
        </h1>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-400">
          {issue.location_name && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-500/70" />
              <span>{issue.location_name}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>{formatDate(issue.created_at)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{formatRelativeTime(issue.created_at)}</span>
          </div>
        </div>

        {/* Status Progress Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
            Issue Lifecycle
          </p>
          <div className="flex items-center gap-1.5">
            {Object.entries(ISSUE_STATUSES).map(([key, config], index) => (
              <React.Fragment key={key}>
                <div
                  className={`flex-1 h-2 rounded-full transition-colors duration-500 ${
                    index < statusStep
                      ? "bg-amber-500"
                      : "bg-slate-800"
                  }`}
                />
                {index < Object.keys(ISSUE_STATUSES).length - 1 && (
                  <div className="w-0.5" />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-between mt-1.5">
            {Object.entries(ISSUE_STATUSES).map(([key, config], index) => (
              <span
                key={key}
                className={`text-[10px] font-medium ${
                  index < statusStep
                    ? "text-amber-400"
                    : "text-slate-600"
                }`}
              >
                {config.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="clay-card p-6 md:p-8">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-4 h-4 text-amber-500/70" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            Description
          </h2>
        </div>
        <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
          {issue.description}
        </p>
      </div>

      {/* Image (if present) */}
      {issue.image_url && (
        <div className="clay-card p-6 md:p-8">
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon className="w-4 h-4 text-amber-500/70" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Photo Evidence
            </h2>
          </div>
          <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-800">
            <Image
              src={issue.image_url}
              alt={`Photo of ${issue.title}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 640px"
            />
          </div>
        </div>
      )}

      {/* Location Mini-Map */}
      <div className="clay-card p-6 md:p-8">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-4 h-4 text-amber-500/70" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            Location
          </h2>
        </div>
        {issue.location_name && (
          <p className="text-sm text-slate-400 mb-3">{issue.location_name}</p>
        )}
        <MiniMap
          latitude={issue.latitude}
          longitude={issue.longitude}
          category={issue.category}
        />
        <p className="mt-2 text-xs text-slate-600">
          {issue.latitude.toFixed(5)}°N, {issue.longitude.toFixed(5)}°E
        </p>
      </div>
    </div>
  );
}
