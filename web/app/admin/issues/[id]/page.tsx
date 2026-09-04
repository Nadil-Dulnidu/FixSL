import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getAdminIssueById } from "@/lib/actions/admin";
import { StatusUpdate } from "@/components/admin/status-update";
import { PriorityUpdate } from "@/components/admin/priority-update";
import { IssueStatusBadge } from "@/components/issues/issue-status-badge";
import { PriorityBadge } from "@/components/issues/priority-badge";
import { CategoryBadge } from "@/components/issues/category-badge";
import { formatTrackingId, formatDate, formatRelativeTime } from "@/lib/utils";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  FileText,
  ImageIcon,
  Settings,
} from "lucide-react";

interface AdminIssueDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminIssueDetailPage({
  params,
}: AdminIssueDetailPageProps) {
  const { id } = await params;

  const result = await getAdminIssueById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const issue = result.data;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Breadcrumb / Back */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/issues"
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Issues
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono text-amber-400/80 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20">
              {formatTrackingId(issue.tracking_number)}
            </span>
            <IssueStatusBadge status={issue.status} />
            <PriorityBadge priority={issue.priority} />
          </div>
          <h1 className="text-2xl font-bold text-white">{issue.title}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content — Left 2 Cols */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="clay-card p-6 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
              <FileText className="h-4 w-4 text-amber-400" />
              Description
            </div>
            <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">
              {issue.description}
            </p>
          </div>

          {/* Image */}
          {issue.image_url && (
            <div className="clay-card p-6 space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                <ImageIcon className="h-4 w-4 text-amber-400" />
                Attached Photo
              </div>
              <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-800">
                <Image
                  src={issue.image_url}
                  alt={issue.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
              </div>
            </div>
          )}

          {/* Location Info */}
          <div className="clay-card p-6 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
              <MapPin className="h-4 w-4 text-amber-400" />
              Location
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {issue.location_name && (
                <div>
                  <p className="text-xs text-slate-500 mb-1">Address</p>
                  <p className="text-sm text-slate-300">{issue.location_name}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-slate-500 mb-1">Coordinates</p>
                <p className="text-sm text-slate-300 font-mono">
                  {issue.latitude.toFixed(6)}, {issue.longitude.toFixed(6)}
                </p>
              </div>
            </div>
            {/* Mini Map Preview */}
            <div className="rounded-xl overflow-hidden border border-slate-800 h-48">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://tile.openstreetmap.org/14/${Math.floor(
                  ((issue.longitude + 180) / 360) * Math.pow(2, 14)
                )}/${Math.floor(
                  ((1 -
                    Math.log(
                      Math.tan((issue.latitude * Math.PI) / 180) +
                        1 / Math.cos((issue.latitude * Math.PI) / 180)
                    ) /
                      Math.PI) /
                    2) *
                  Math.pow(2, 14)
                )}.png`}
                alt="Map location"
                className="w-full h-full object-cover opacity-70"
              />
            </div>
          </div>
        </div>

        {/* Sidebar — Right Col */}
        <div className="space-y-6">
          {/* Admin Controls */}
          <div className="clay-card p-6 space-y-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
              <Settings className="h-4 w-4 text-amber-400" />
              Admin Controls
            </div>

            <StatusUpdate issueId={issue.id} currentStatus={issue.status} />
            <PriorityUpdate
              issueId={issue.id}
              currentPriority={issue.priority}
            />
          </div>

          {/* Issue Metadata */}
          <div className="clay-card p-6 space-y-4">
            <h3 className="text-sm font-semibold text-slate-300">Details</h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5" />
                  Reported
                </span>
                <span className="text-slate-300">
                  {formatDate(issue.created_at)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" />
                  Last Updated
                </span>
                <span className="text-slate-300">
                  {formatRelativeTime(issue.updated_at)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Category</span>
                <CategoryBadge
                  category={issue.category}
                  className="text-[10px]"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Issue ID</span>
                <span className="text-xs text-slate-500 font-mono truncate max-w-[160px]">
                  {issue.id}
                </span>
              </div>
            </div>
          </div>

          {/* Public Page Link */}
          <Link
            href={`/issues/${issue.id}`}
            className="clay-card p-4 flex items-center gap-3 text-sm text-slate-400 hover:text-amber-400 hover:border-amber-500/30 transition-all block"
          >
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <MapPin className="h-4 w-4 text-amber-400" />
            </div>
            <span>View Public Issue Page →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
