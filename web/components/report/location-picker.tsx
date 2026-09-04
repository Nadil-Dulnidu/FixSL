"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin } from "lucide-react";

interface LocationPickerProps {
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number, locationName?: string) => void;
}

const DynamicLocationPicker = dynamic(
  () =>
    import("@/components/report/location-picker-inner").then(
      (mod) => mod.LocationPickerInner
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-72 sm:h-80 w-full rounded-2xl border border-slate-800 bg-slate-950/60 flex flex-col items-center justify-center p-6 text-slate-500 gap-3">
        <MapPin className="w-8 h-8 text-amber-500/50 animate-bounce" />
        <p className="text-xs font-medium">Initializing Sri Lanka Map...</p>
        <Skeleton className="w-48 h-3 rounded-full" />
      </div>
    ),
  }
);

export function LocationPicker(props: LocationPickerProps) {
  return <DynamicLocationPicker {...props} />;
}
