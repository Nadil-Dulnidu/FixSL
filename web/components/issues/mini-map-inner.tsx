"use client";

import React, { useMemo } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MiniMapInnerProps {
  latitude: number;
  longitude: number;
  category?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  pothole: "#f59e0b",
  road_damage: "#f97316",
  broken_streetlight: "#eab308",
  garbage: "#ef4444",
  blocked_drain: "#3b82f6",
  other: "#71717a",
};

function createPinIcon(color: string): L.DivIcon {
  return L.divIcon({
    className: "custom-map-marker",
    html: `
      <div style="
        position: relative;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: translate(-50%, -100%);
      ">
        <div style="
          width: 24px;
          height: 24px;
          background: ${color};
          border: 2px solid rgba(255,255,255,0.9);
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 3px 10px ${color}88, 0 1px 3px rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            width: 8px;
            height: 8px;
            background: rgba(255,255,255,0.85);
            border-radius: 50%;
            transform: rotate(45deg);
          "></div>
        </div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -30],
  });
}

export function MiniMapInner({ latitude, longitude, category }: MiniMapInnerProps) {
  const icon = useMemo(() => {
    const color = category ? CATEGORY_COLORS[category] || "#71717a" : "#f59e0b";
    return createPinIcon(color);
  }, [category]);

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={16}
      scrollWheelZoom={false}
      dragging={false}
      zoomControl={false}
      doubleClickZoom={false}
      touchZoom={false}
      className="w-full h-full"
      style={{ minHeight: "200px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[latitude, longitude]} icon={icon} />
    </MapContainer>
  );
}
