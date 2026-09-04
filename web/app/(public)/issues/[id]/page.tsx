import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  ShieldAlert,
  Info,
  CheckCircle2,
  Clock,
  Wrench,
  AlertOctagon,
  Share2,
} from "lucide-react";
import { getPublicIssueDetail } from "@/lib/actions/feedback";
import { IssueDetailCard } from "@/components/issues/issue-detail-card";
import { VerificationPanel } from "@/components/issues/verification-panel";
import { ResolutionFeedback } from "@/components/issues/resolution-feedback";
import { formatTrackingId, cn } from "@/lib/utils";
import { ISSUE_STATUSES } from "@/lib/constants";

interface PublicIssuePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PublicIssuePageProps): Promise<Metadata> {
  const { id } = await params;
  const result = await getPublicIssueDetail(id);

  if (!result.success || !result.data) {
    return {
      title: "Issue Not Found | FixSL",
      description: "The requested infrastructure issue report could not be found.",
    };
  }

  const trackingId = formatTrackingId(result.data.tracking_number);
  return {
    title: `${trackingId}: ${result.data.title} | FixSL`,
    description: result.data.description.substring(0, 160),
  };
}

const LIFECYCLE_STEPS = [
  { key: "reported", label: "1. Reported", icon: Clock, desc: "Submitted by citizen" },
  { key: "verified", label: "2. Verified", icon: CheckCircle2, desc: "Community confirmed" },
  { key: "in_progress", label: "3. In Progress", icon: Wrench, desc: "Work crew assigned" },
  { key: "resolved", label: "4. Resolved", icon: CheckCircle2, desc: "Repair completed" },
];

export default async function PublicIssueDetailPage({
  params,
}: PublicIssuePageProps) {
  const { id } = await params;

  const result = await getPublicIssueDetail(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const issue = result.data;
  const trackingId = formatTrackingId(issue.tracking_number);
  const currentStep = ISSUE_STATUSES[issue.status]?.step || 1;

  return (
    <div className="min-h-screen py-5 sm:py-8 md:py-12 bg-[#090d16] text-white">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-5 sm:space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-slate-400 overflow-x-auto pb-1">
          <Link
            href="/"
            className="hover:text-amber-400 transition-colors flex items-center gap-1 shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
          <Link href="/map" className="hover:text-amber-400 transition-colors shrink-0">
            Map
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
          <span className="text-amber-400 font-mono font-semibold truncate">
            {trackingId}
          </span>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Main Left Column (8 cols): Issue Card */}
          <div className="lg:col-span-8 space-y-6">
            <IssueDetailCard issue={issue} />
          </div>

          {/* Right Column (4 cols): Community Verification + Lifecycle */}
          <div className="lg:col-span-4 space-y-6">
            {/* Interactive Verification / Resolution Feedback Component */}
            {issue.status === "resolved" ? (
              <ResolutionFeedback
                issueId={issue.id}
                initialConfirmCount={issue.resolution_confirm_count || 0}
                initialDisputeCount={issue.resolution_dispute_count || 0}
              />
            ) : (
              <VerificationPanel
                issueId={issue.id}
                initialConfirmCount={issue.confirm_count || 0}
                initialDisputeCount={issue.dispute_count || 0}
              />
            )}

            {/* Lifecycle Progress Card */}
            <div className="clay-card p-5 space-y-4 border-slate-800">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-400" />
                <span>FixSL Resolution Lifecycle</span>
              </h3>

              <div className="space-y-3 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
                {LIFECYCLE_STEPS.map((step, idx) => {
                  const stepNum = idx + 1;
                  const isDone = currentStep >= stepNum;
                  const isCurrent = currentStep === stepNum;
                  const StepIcon = step.icon;

                  return (
                    <div
                      key={step.key}
                      className={cn(
                        "relative flex items-start gap-3 pl-1 transition-colors",
                        isCurrent ? "text-white" : isDone ? "text-slate-300" : "text-slate-500"
                      )}
                    >
                      <div
                        className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center shrink-0 border z-10 text-[11px] font-bold font-mono transition-all",
                          isCurrent
                            ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20 animate-pulse"
                            : isDone
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                            : "bg-slate-900 text-slate-600 border-slate-800"
                        )}
                      >
                        {isDone && !isCurrent ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          stepNum
                        )}
                      </div>

                      <div className="min-w-0">
                        <p
                          className={cn(
                            "text-xs font-bold leading-tight",
                            isCurrent && "text-amber-400"
                          )}
                        >
                          {step.label}
                        </p>
                        <p className="text-[11px] text-slate-400 leading-snug">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* How It Works Explainer Card */}
            <div className="clay-card p-5 space-y-3 border-slate-800/80 bg-slate-950/40 text-xs text-slate-400">
              <h4 className="font-bold text-slate-300 text-xs uppercase tracking-wider">
                About Community Verification
              </h4>
              <p className="leading-relaxed">
                FixSL allows citizen reporting without mandatory registration. Community votes act as decentralized proof to prevent spam and prioritize urgent municipal intervention.
              </p>
              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Anonymous & Encrypted</span>
                <Link
                  href="/report"
                  className="text-amber-400 hover:underline font-semibold"
                >
                  Report a new hazard →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
