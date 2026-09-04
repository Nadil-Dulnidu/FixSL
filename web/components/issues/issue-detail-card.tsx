"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  Clock,
  Copy,
  Check,
  Share2,
  PlusCircle,
  Map as MapIcon,
  FileText,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { IssueStatusBadge } from "@/components/issues/issue-status-badge";
import { PriorityBadge } from "@/components/issues/priority-badge";
import { CategoryBadge } from "@/components/issues/category-badge";
import { DisputeBadge } from "@/components/issues/dispute-badge";
import { IssueMiniMap } from "@/components/issues/issue-mini-map";
import { formatTrackingId, formatDate, formatRelativeTime } from "@/lib/utils";
import { toast } from "sonner";
import type { IssueWithFeedbackCount } from "@/lib/types/database";

interface IssueDetailCardProps {
  issue: IssueWithFeedbackCount;
}

export function IssueDetailCard({ issue }: IssueDetailCardProps) {
  const [copiedTracking, setCopiedTracking] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCoords, setCopiedCoords] = useState(false);

  const trackingId = formatTrackingId(issue.tracking_number);

  const handleCopyTrackingId = () => {
    navigator.clipboard.writeText(trackingId);
    setCopiedTracking(true);
    toast.success(`Copied tracking ID ${trackingId} to clipboard`);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  const handleCopyCoords = () => {
    const coordsStr = `${issue.latitude.toFixed(6)}, ${issue.longitude.toFixed(6)}`;
    navigator.clipboard.writeText(coordsStr);
    setCopiedCoords(true);
    toast.success("Coordinates copied to clipboard");
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  const handleShare = async () => {
    const shareData = {
      title: `${trackingId}: ${issue.title} | FixSL`,
      text: `Track this infrastructure issue in Sri Lanka on FixSL: ${issue.title}`,
      url: typeof window !== "undefined" ? window.location.href : "",
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // Fall back to copying link
      }
    }

    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Main Issue Card */}
      <div className="clay-card p-4.5 sm:p-6 md:p-8 space-y-5 sm:space-y-6 border-white/5 relative">
        {/* Top Badges Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pb-4 border-b border-white/5">
          <div className="flex flex-wrap items-center gap-2">
            {/* Tracking ID with quick copy */}
            <button
              type="button"
              onClick={handleCopyTrackingId}
              title="Click to copy tracking ID"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-400 font-mono text-xs sm:text-sm font-bold transition-all group clay-pill cursor-pointer active:scale-95 min-h-[36px]"
            >
              <span>{trackingId}</span>
              {copiedTracking ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
              )}
            </button>

            <CategoryBadge category={issue.category} />
            <IssueStatusBadge status={issue.status} />
            <PriorityBadge priority={issue.priority} />
          </div>

          {/* Dispute Badge if flagged */}
          {(issue.is_disputed || (issue.resolution_dispute_count ?? 0) >= 5) && (
            <DisputeBadge
              disputeCount={issue.resolution_dispute_count ?? 5}
              variant="badge"
            />
          )}
        </div>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-snug break-words">
          {issue.title}
        </h1>

        {/* Description Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Description</span>
          </div>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-wrap clay-inset p-3.5 sm:p-4.5 rounded-2xl">
            {issue.description}
          </p>
        </div>

        {/* Attached Photo */}
        {issue.image_url && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <ImageIcon className="w-4 h-4 text-amber-400" />
              <span>Evidence Photo</span>
            </div>
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-slate-950 shadow-xl">
              <Image
                src={issue.image_url}
                alt={issue.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 700px"
              />
            </div>
          </div>
        )}

        {/* Location Section */}
        <div className="space-y-3 pt-1 sm:pt-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Incident Location</span>
            </div>

            <button
              type="button"
              onClick={handleCopyCoords}
              className="text-[11px] font-mono text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1.5 rounded-full border border-white/10 clay-pill cursor-pointer active:scale-95 min-h-[32px]"
            >
              <span>
                {issue.latitude.toFixed(6)}°N, {issue.longitude.toFixed(6)}°E
              </span>
              {copiedCoords ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>

          {issue.location_name && (
            <p className="text-xs sm:text-sm font-medium text-slate-200 flex items-start gap-2">
              <span className="text-slate-400 shrink-0">Address:</span>
              <span className="break-words">{issue.location_name}</span>
            </p>
          )}

          {/* Mini map */}
          <div className="h-52 sm:h-64 md:h-72 w-full rounded-2xl overflow-hidden border border-white/10 shadow-lg">
            <IssueMiniMap
              latitude={issue.latitude}
              longitude={issue.longitude}
              locationName={issue.location_name}
              category={issue.category}
              title={issue.title}
            />
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 sm:pt-4 border-t border-white/5 text-xs">
          <div className="flex items-center gap-3 text-slate-400 clay-inset p-3 sm:p-3.5 rounded-2xl">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-400 shrink-0 clay-icon-well">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 font-medium">
                Reported On
              </span>
              <span className="text-slate-200 font-bold">
                {formatDate(issue.created_at)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-400 clay-inset p-3 sm:p-3.5 rounded-2xl">
            <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-400 shrink-0 clay-icon-well">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 font-medium">
                Last Activity
              </span>
              <span className="text-slate-200 font-bold">
                {formatRelativeTime(issue.updated_at)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-white/5">
          <Button
            type="button"
            onClick={handleShare}
            variant="secondary"
            size="sm"
            className="gap-2 text-xs rounded-xl h-11 sm:h-9 min-h-[44px] sm:min-h-0 w-full sm:w-auto font-semibold"
          >
            {copiedLink ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Share2 className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>{copiedLink ? "Link Copied!" : "Share Issue"}</span>
          </Button>

          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
            <Link
              href="/map"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 sm:py-2 rounded-xl border border-white/10 bg-slate-900/60 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all clay-pill min-h-[44px] sm:min-h-0 text-center"
            >
              <MapIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>View On Map</span>
            </Link>

            <Link
              href="/report"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 sm:py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-xs font-bold text-amber-400 transition-all clay-pill min-h-[44px] sm:min-h-0 text-center"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Report Another</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

