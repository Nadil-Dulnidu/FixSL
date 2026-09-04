"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin } from "lucide-react";

interface MiniMapProps {
  latitude: number;
  longitude: number;
  category?: string;
}

const DynamicMiniMap = dynamic(
  () =>
    import("@/components/issues/mini-map-inner").then(
      (mod) => mod.MiniMapInner
    ),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[200px] rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col items-center justify-center gap-2">
        <MapPin className="w-6 h-6 text-amber-500/50 animate-pulse" />
        <Skeleton className="w-24 h-2.5 rounded-full" />
      </div>
    ),
  }
);

export function MiniMap(props: MiniMapProps) {
  return (
    <div className="w-full h-[220px] md:h-[260px] rounded-xl overflow-hidden border border-slate-800 shadow-lg">
      <DynamicMiniMap {...props} />
    </div>
  );
}
