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
  ExternalLink,
  PlusCircle,
  Map as MapIcon,
  ShieldCheck,
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
    <div className="space-y-6">
      {/* Main Issue Card */}
      <div className="clay-card p-6 sm:p-8 space-y-6 border-slate-800 relative">
        {/* Top Badges Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
          <div className="flex flex-wrap items-center gap-2">
            {/* Tracking ID with quick copy */}
            <button
              type="button"
              onClick={handleCopyTrackingId}
              title="Click to copy tracking ID"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-mono text-xs sm:text-sm font-bold transition-all group"
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
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
          {issue.title}
        </h1>

        {/* Description Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Description</span>
          </div>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-wrap bg-slate-950/40 p-4 rounded-xl border border-slate-850">
            {issue.description}
          </p>
        </div>

        {/* Attached Photo */}
        {issue.image_url && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <ImageIcon className="w-4 h-4 text-amber-400" />
              <span>Evidence Photo</span>
            </div>
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
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
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Incident Location</span>
            </div>

            <button
              type="button"
              onClick={handleCopyCoords}
              className="text-[11px] font-mono text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded border border-slate-800"
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
            <p className="text-sm font-medium text-slate-200 flex items-start gap-2">
              <span className="text-slate-400 shrink-0">Address:</span>
              <span>{issue.location_name}</span>
            </p>
          )}

          {/* Mini map */}
          <div className="h-60 sm:h-72 w-full rounded-xl overflow-hidden border border-slate-800">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-2.5 text-slate-400 bg-slate-950/50 p-3 rounded-xl border border-slate-850">
            <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="block text-[10px] text-slate-400 font-medium">
                Reported On
              </span>
              <span className="text-slate-200 font-semibold">
                {formatDate(issue.created_at)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-slate-400 bg-slate-950/50 p-3 rounded-xl border border-slate-850">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="block text-[10px] text-slate-400 font-medium">
                Last Activity
              </span>
              <span className="text-slate-200 font-semibold">
                {formatRelativeTime(issue.updated_at)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800/80">
          <Button
            type="button"
            onClick={handleShare}
            variant="outline"
            size="sm"
            className="gap-2 text-xs border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 rounded-xl"
          >
            {copiedLink ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Share2 className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>{copiedLink ? "Link Copied!" : "Share Issue"}</span>
          </Button>

          <div className="flex items-center gap-2">
            <Link
              href="/map"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-colors"
            >
              <MapIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>View On Map</span>
            </Link>

            <Link
              href="/report"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-xs font-bold text-amber-400 transition-colors"
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
