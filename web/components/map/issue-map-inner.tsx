"use client";

import React, { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM, ISSUE_CATEGORIES } from "@/lib/constants";
import { MapMarkerPopup } from "@/components/map/map-marker-popup";
import type { Issue } from "@/lib/types/database";

// ──────────────────────────────────────────────
// Custom Category-Colored Marker Icons
// ──────────────────────────────────────────────

function createCategoryIcon(color: string): L.DivIcon {
  return L.divIcon({
    className: "custom-map-marker",
    html: `
      <div style="
        position: relative;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: translate(-50%, -100%);
      ">
        <div style="
          width: 28px;
          height: 28px;
          background: ${color};
          border: 2.5px solid rgba(255,255,255,0.9);
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 3px 10px ${color}88, 0 1px 3px rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            width: 10px;
            height: 10px;
            background: rgba(255,255,255,0.85);
            border-radius: 50%;
            transform: rotate(45deg);
          "></div>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -34],
  });
}

// Pre-build icons for each category for performance
const categoryIcons: Record<string, L.DivIcon> = {};
for (const [key, config] of Object.entries(ISSUE_CATEGORIES)) {
  categoryIcons[key] = createCategoryIcon(config.markerColor);
}

// Fallback icon
const defaultIcon = createCategoryIcon("#71717a");

// ──────────────────────────────────────────────
// Fit Bounds Helper
// ──────────────────────────────────────────────

function FitBoundsToMarkers({ issues }: { issues: Issue[] }) {
  const map = useMap();

  React.useEffect(() => {
    if (issues.length === 0) return;

    const bounds = L.latLngBounds(
      issues.map((issue) => [issue.latitude, issue.longitude] as [number, number])
    );

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [issues, map]);

  return null;
}

// ──────────────────────────────────────────────
// Main Map Component
// ──────────────────────────────────────────────

interface IssueMapInnerProps {
  issues: Issue[];
}

export function IssueMapInner({ issues }: IssueMapInnerProps) {
  // Memoize markers to prevent re-renders
  const markers = useMemo(
    () =>
      issues.map((issue) => ({
        issue,
        icon: categoryIcons[issue.category] || defaultIcon,
        position: [issue.latitude, issue.longitude] as [number, number],
      })),
    [issues]
  );

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl clay-card">
      <MapContainer
        center={DEFAULT_MAP_CENTER}
        zoom={DEFAULT_MAP_ZOOM}
        scrollWheelZoom={true}
        className="w-full h-full"
        style={{ minHeight: "500px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBoundsToMarkers issues={issues} />

        {markers.map(({ issue, icon, position }) => (
          <Marker key={issue.id} position={position} icon={icon}>
            <Popup
              closeButton={true}
              minWidth={220}
              maxWidth={280}
              className="fixsl-popup"
            >
              <MapMarkerPopup issue={issue} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Top Right: Issue count overlay */}
      <div className="absolute top-4 right-4 z-[1000] px-3.5 py-1.5 rounded-full bg-slate-950/85 border border-white/10 backdrop-blur-xl text-xs font-bold text-slate-200 shadow-xl flex items-center gap-2 clay-pill">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <span>
          <strong className="text-amber-400 font-mono">{issues.length}</strong> issue{issues.length !== 1 ? "s" : ""} mapped
        </span>
      </div>

      {/* Bottom Right: Map legend overlay */}
      <div className="absolute bottom-8 right-6 z-[1000] clay-card p-3.5 shadow-2xl border-white/10 min-w-[260px]">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">
          Hazard Categories
        </p>
        <div className="grid grid-cols-2 gap-x-3.5 gap-y-1.5">
          {Object.entries(ISSUE_CATEGORIES).map(([key, config]) => (
            <div key={key} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                style={{ backgroundColor: config.markerColor }}
              />
              <span className="text-[10px] text-slate-300 font-medium whitespace-nowrap truncate">
                {config.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

