import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Share2 } from "lucide-react";
import { getIssueByTrackingId } from "@/lib/actions/issues";
import { getFeedbackCounts } from "@/lib/actions/feedback";
import { IssueDetailCard } from "@/components/issues/issue-detail-card";
import { IssueDetailClient } from "@/components/issues/issue-detail-client";
import { formatTrackingId } from "@/lib/utils";
import type { FeedbackCounts } from "@/lib/actions/feedback";

// Demo fallback issue for when Supabase is not configured
function getDemoIssue(id: string) {
  const trackingNum = parseInt(id, 10);
  if (isNaN(trackingNum)) return null;

  return {
    id: `demo-${trackingNum}`,
    tracking_number: trackingNum,
    title: "Large Pothole Near Town Hall Junction",
    description:
      "There is a significant pothole approximately 2 feet wide and 8 inches deep at the junction near Colombo Town Hall. The pothole has been causing damage to vehicles and poses a safety hazard, especially for two-wheelers and three-wheelers. The issue has been present for over two weeks and worsens after each rain. Multiple residents have reported near-accidents at this location.",
    category: "pothole" as const,
    status: "verified" as const,
    priority: "high" as const,
    latitude: 6.9147,
    longitude: 79.8634,
    location_name: "Town Hall Junction, Colombo 07",
    image_url: null,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  };
}

const DEFAULT_COUNTS: FeedbackCounts = {
  confirm: 0,
  dispute: 0,
  resolution_confirm: 0,
  resolution_dispute: 0,
};

export const revalidate = 30; // ISR: revalidate every 30 seconds

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return {
    title: `Issue FIX-${id} | FixSL`,
    description: `View details and community verification for issue FIX-${id} on FixSL — Sri Lanka's citizen-powered infrastructure tracking platform.`,
  };
}

export default async function IssueDetailPage({ params }: PageProps) {
  const { id } = await params;

  // Fetch issue and feedback counts in parallel
  let issue = null;
  let feedbackCounts: FeedbackCounts = DEFAULT_COUNTS;

  const issueResult = await getIssueByTrackingId(id);

  if (issueResult.success && issueResult.data) {
    issue = issueResult.data;

    // Fetch feedback counts for the issue
    const countsResult = await getFeedbackCounts(issue.id);
    if (countsResult.success && countsResult.data) {
      feedbackCounts = countsResult.data;
    }
  } else {
    // Fallback to demo data
    issue = getDemoIssue(id);
    if (!issue) {
      notFound();
    }
    // Demo feedback counts
    feedbackCounts = {
      confirm: 7,
      dispute: 1,
      resolution_confirm: 0,
      resolution_dispute: 0,
    };
  }

  const trackingId = formatTrackingId(issue.tracking_number);

  return (
    <div className="min-h-screen py-6 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Back navigation */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-amber-400 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            Back to Home
          </Link>
          <span className="text-xs text-slate-600">{trackingId}</span>
        </div>

        {/* Issue Detail Card */}
        <IssueDetailCard issue={issue} />

        {/* Verification / Resolution Feedback - Client Component */}
        <div className="mt-6">
          <IssueDetailClient
            issueId={issue.id}
            issueStatus={issue.status}
            initialCounts={feedbackCounts}
          />
        </div>
      </div>
    </div>
  );
}
