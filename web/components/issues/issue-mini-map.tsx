"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin } from "lucide-react";
import type { IssueCategory } from "@/lib/types/database";

interface IssueMiniMapProps {
  latitude: number;
  longitude: number;
  locationName?: string | null;
  category: IssueCategory;
  title: string;
}

const DynamicIssueMiniMap = dynamic(
  () =>
    import("@/components/issues/issue-mini-map-inner").then(
      (mod) => mod.IssueMiniMapInner
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-56 w-full rounded-xl border border-slate-800 bg-slate-950/60 flex flex-col items-center justify-center p-6 text-slate-500 gap-2">
        <MapPin className="w-6 h-6 text-amber-500/50 animate-bounce" />
        <p className="text-xs font-medium">Loading Location Map...</p>
        <Skeleton className="w-32 h-2.5 rounded-full" />
      </div>
    ),
  }
);

export function IssueMiniMap(props: IssueMiniMapProps) {
  return <DynamicIssueMiniMap {...props} />;
}
