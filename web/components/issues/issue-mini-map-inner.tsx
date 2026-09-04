"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { ExternalLink, MapPin } from "lucide-react";
import { ISSUE_CATEGORIES } from "@/lib/constants";
import type { IssueCategory } from "@/lib/types/database";

interface IssueMiniMapInnerProps {
  latitude: number;
  longitude: number;
  locationName?: string | null;
  category: IssueCategory;
  title: string;
}

// Function to create category-colored pin marker
function createPinIcon(color: string) {
  return L.divIcon({
    className: "custom-issue-pin",
    html: `
      <div style="
        position: relative;
        width: 34px;
        height: 34px;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: translate(-50%, -100%);
      ">
        <div style="
          width: 32px;
          height: 32px;
          background: ${color};
          border: 2px solid #ffffff;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 4px 14px ${color}80;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            width: 12px;
            height: 12px;
            background: #090d16;
            border-radius: 50%;
            transform: rotate(45deg);
          "></div>
        </div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -34],
  });
}

export function IssueMiniMapInner({
  latitude,
  longitude,
  locationName,
  category,
  title,
}: IssueMiniMapInnerProps) {
  const categoryConfig = ISSUE_CATEGORIES[category] || {
    markerColor: "#f59e0b",
    label: "Issue",
  };

  const markerIcon = createPinIcon(categoryConfig.markerColor);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

  return (
    <div className="relative w-full h-full min-h-[220px] rounded-xl overflow-hidden border border-slate-800 shadow-inner group">
      <MapContainer
        center={[latitude, longitude]}
        zoom={14}
        scrollWheelZoom={false}
        className="w-full h-full min-h-[220px]"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]} icon={markerIcon}>
          <Popup className="custom-leaflet-popup">
            <div className="text-xs p-1">
              <strong className="block text-slate-900 font-semibold mb-1">
                {title}
              </strong>
              {locationName && (
                <span className="text-slate-600 block mb-1.5">{locationName}</span>
              )}
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-amber-600 font-bold hover:underline"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* External Map Directions Button */}
      <a
        href={googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-2 right-2 z-[1000] inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-950/90 hover:bg-slate-900 border border-slate-700/80 text-amber-400 text-xs font-semibold backdrop-blur-md transition-all shadow-md"
      >
        <MapPin className="w-3.5 h-3.5" />
        <span>Directions</span>
        <ExternalLink className="w-3 h-3" />
      </a>

      {/* Lat/Long pill */}
      <div className="absolute bottom-2 left-2 z-[1000] px-2.5 py-1 rounded-md bg-slate-950/90 border border-slate-800 text-[11px] font-mono text-slate-300 backdrop-blur-md pointer-events-none">
        {latitude.toFixed(5)}°N, {longitude.toFixed(5)}°E
      </div>
    </div>
  );
}
