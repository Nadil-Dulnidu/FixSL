import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function IssueDetailLoading() {
  return (
    <div className="min-h-screen py-6 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Back link skeleton */}
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="w-28 h-4 rounded-full" />
          <Skeleton className="w-20 h-3 rounded-full" />
        </div>

        {/* Header card skeleton */}
        <div className="clay-card p-6 md:p-8 mb-6">
          {/* Badges row */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <Skeleton className="w-24 h-8 rounded-lg" />
              <Skeleton className="w-16 h-6 rounded-full" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="w-20 h-6 rounded-full" />
              <Skeleton className="w-24 h-6 rounded-full" />
            </div>
          </div>

          {/* Title */}
          <Skeleton className="w-3/4 h-8 rounded-lg mb-3" />

          {/* Meta */}
          <div className="flex items-center gap-5">
            <Skeleton className="w-40 h-4 rounded-full" />
            <Skeleton className="w-32 h-4 rounded-full" />
            <Skeleton className="w-20 h-4 rounded-full" />
          </div>

          {/* Progress bar */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <Skeleton className="w-24 h-3 rounded-full mb-3" />
            <div className="flex gap-1.5">
              <Skeleton className="flex-1 h-2 rounded-full" />
              <Skeleton className="flex-1 h-2 rounded-full" />
              <Skeleton className="flex-1 h-2 rounded-full" />
              <Skeleton className="flex-1 h-2 rounded-full" />
            </div>
          </div>
        </div>

        {/* Description card skeleton */}
        <div className="clay-card p-6 md:p-8 mb-6">
          <Skeleton className="w-28 h-4 rounded-full mb-4" />
          <div className="space-y-2.5">
            <Skeleton className="w-full h-4 rounded-full" />
            <Skeleton className="w-full h-4 rounded-full" />
            <Skeleton className="w-5/6 h-4 rounded-full" />
            <Skeleton className="w-3/4 h-4 rounded-full" />
          </div>
        </div>

        {/* Map card skeleton */}
        <div className="clay-card p-6 md:p-8 mb-6">
          <Skeleton className="w-20 h-4 rounded-full mb-4" />
          <Skeleton className="w-full h-[220px] rounded-xl" />
        </div>

        {/* Verification card skeleton */}
        <div className="clay-card p-6 md:p-8">
          <Skeleton className="w-44 h-4 rounded-full mb-5" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
