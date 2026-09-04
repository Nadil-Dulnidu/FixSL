import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function PublicIssueDetailLoading() {
  return (
    <div className="min-h-screen py-8 md:py-12 bg-[#090d16] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16 bg-slate-800 rounded" />
          <Skeleton className="h-4 w-4 bg-slate-800 rounded" />
          <Skeleton className="h-4 w-12 bg-slate-800 rounded" />
          <Skeleton className="h-4 w-4 bg-slate-800 rounded" />
          <Skeleton className="h-4 w-20 bg-slate-800 rounded" />
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Left Column */}
          <div className="lg:col-span-8 space-y-6">
            <div className="clay-card p-6 sm:p-8 space-y-6 border-slate-800">
              {/* Badges */}
              <div className="flex items-center gap-3">
                <Skeleton className="h-7 w-24 bg-slate-800 rounded-lg" />
                <Skeleton className="h-7 w-20 bg-slate-800 rounded-lg" />
                <Skeleton className="h-7 w-20 bg-slate-800 rounded-lg" />
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Skeleton className="h-9 w-3/4 bg-slate-800 rounded-xl" />
                <Skeleton className="h-9 w-1/2 bg-slate-800 rounded-xl" />
              </div>

              {/* Description */}
              <div className="space-y-3 pt-2">
                <Skeleton className="h-4 w-24 bg-slate-800 rounded" />
                <Skeleton className="h-24 w-full bg-slate-800 rounded-xl" />
              </div>

              {/* Map skeleton */}
              <div className="space-y-3 pt-2">
                <Skeleton className="h-4 w-32 bg-slate-800 rounded" />
                <Skeleton className="h-60 w-full bg-slate-800 rounded-xl" />
              </div>

              {/* Meta */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                <Skeleton className="h-12 w-full bg-slate-800 rounded-xl" />
                <Skeleton className="h-12 w-full bg-slate-800 rounded-xl" />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Verification Panel Skeleton */}
            <div className="clay-card p-6 space-y-4 border-slate-800">
              <Skeleton className="h-5 w-40 bg-slate-800 rounded" />
              <Skeleton className="h-4 w-full bg-slate-800 rounded" />
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Skeleton className="h-14 w-full bg-slate-800 rounded-xl" />
                <Skeleton className="h-14 w-full bg-slate-800 rounded-xl" />
              </div>
            </div>

            {/* Lifecycle Card Skeleton */}
            <div className="clay-card p-6 space-y-4 border-slate-800">
              <Skeleton className="h-5 w-36 bg-slate-800 rounded" />
              <div className="space-y-4 pt-2">
                <Skeleton className="h-10 w-full bg-slate-800 rounded-xl" />
                <Skeleton className="h-10 w-full bg-slate-800 rounded-xl" />
                <Skeleton className="h-10 w-full bg-slate-800 rounded-xl" />
                <Skeleton className="h-10 w-full bg-slate-800 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
