import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function PublicLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-4 text-center max-w-2xl mx-auto">
        <Skeleton className="h-6 w-36 mx-auto rounded-full" />
        <Skeleton className="h-12 w-full max-w-lg mx-auto rounded-2xl" />
        <Skeleton className="h-5 w-3/4 mx-auto rounded-xl" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
        <Skeleton className="h-36 rounded-2xl" />
        <Skeleton className="h-36 rounded-2xl" />
        <Skeleton className="h-36 rounded-2xl" />
        <Skeleton className="h-36 rounded-2xl" />
      </div>

      <div className="max-w-4xl mx-auto pt-6 space-y-6">
        <Skeleton className="h-72 rounded-3xl" />
        <Skeleton className="h-48 rounded-3xl" />
      </div>
    </div>
  );
}
