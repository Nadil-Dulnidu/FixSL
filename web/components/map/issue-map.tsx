"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { Map } from "lucide-react";
import type { Issue } from "@/lib/types/database";

interface IssueMapProps {
  issues: Issue[];
}

const DynamicIssueMap = dynamic(
  () =>
    import("@/components/map/issue-map-inner").then(
      (mod) => mod.IssueMapInner
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[calc(100vh-16rem)] min-h-[500px] w-full rounded-2xl border border-slate-800 bg-slate-950/60 flex flex-col items-center justify-center p-6 text-slate-500 gap-3">
        <Map className="w-10 h-10 text-amber-500/50 animate-pulse" />
        <p className="text-sm font-medium text-slate-400">Loading Community Map...</p>
        <Skeleton className="w-56 h-3 rounded-full" />
        <Skeleton className="w-40 h-3 rounded-full" />
      </div>
    ),
  }
);

export function IssueMap(props: IssueMapProps) {
  return <DynamicIssueMap {...props} />;
}
