import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function MapLoading() {
  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
      {/* Sidebar skeleton */}
      <aside className="w-full sm:w-80 lg:w-80 p-4 lg:pr-4 space-y-4 shrink-0">
        {/* Title */}
        <div className="pt-2 pb-1 space-y-2">
          <Skeleton className="h-6 w-40 rounded-lg" />
          <Skeleton className="h-3 w-56 rounded-full" />
        </div>

        {/* Filter card skeleton */}
        <div className="clay-card p-4 space-y-4">
          <Skeleton className="h-4 w-24 rounded-md" />
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-16 rounded-md" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-12 rounded-md" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
          <div className="pt-2 border-t border-slate-800">
            <Skeleton className="h-3 w-32 rounded-md" />
          </div>
        </div>

        {/* Stats card skeleton */}
        <div className="clay-card p-4 space-y-4">
          <Skeleton className="h-4 w-28 rounded-md" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-16 rounded-md" />
            <Skeleton className="h-4 w-full rounded-full" />
            <Skeleton className="h-4 w-full rounded-full" />
            <Skeleton className="h-4 w-full rounded-full" />
            <Skeleton className="h-4 w-full rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-20 rounded-md" />
            <Skeleton className="h-4 w-full rounded-full" />
            <Skeleton className="h-4 w-full rounded-full" />
            <Skeleton className="h-4 w-full rounded-full" />
            <Skeleton className="h-4 w-full rounded-full" />
            <Skeleton className="h-4 w-full rounded-full" />
            <Skeleton className="h-4 w-full rounded-full" />
          </div>
        </div>
      </aside>

      {/* Map area skeleton */}
      <div className="flex-1 h-full p-4 lg:p-0">
        <Skeleton className="h-full w-full rounded-2xl" />
      </div>
    </div>
  );
}
