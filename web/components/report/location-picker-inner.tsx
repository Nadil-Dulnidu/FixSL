"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import { MapPin, Navigation, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM, QUICK_LOCATIONS } from "@/lib/constants";
import { toast } from "sonner";

// Custom Amber FixSL Pin Marker Icon
const fixslPinIcon = L.divIcon({
  className: "custom-pin-marker",
  html: `
    <div style="
      position: relative;
      width: 38px;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      transform: translate(-50%, -100%);
    ">
      <div style="
        width: 36px;
        height: 36px;
        background: linear-gradient(135deg, #fbbf24 0%, #d97706 100%);
        border: 2px solid #ffffff;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 4px 14px rgba(245, 158, 11, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 14px;
          height: 14px;
          background: #090d16;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>
    </div>
  `,
  iconSize: [38, 38],
  iconAnchor: [19, 38],
});

interface LocationPickerProps {
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number, locationName?: string) => void;
}

// Sub-component to handle map click events
function MapClickHandler({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Sub-component to pan the map programmatically
function MapRecenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
}

export function LocationPickerInner({
  latitude,
  longitude,
  onLocationChange,
}: LocationPickerProps) {
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  // Reverse geocode lat/lng to readable Sri Lankan street address
  const reverseGeocode = async (lat: number, lng: number) => {
    setIsGeocoding(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en`,
        {
          headers: {
            "User-Agent": "FixSL-Civic-App/1.0",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        const address = data.display_name || "";
        const parts = address.split(", ");
        // Pick most relevant 2-3 segments for a clean location name
        const cleanName = parts.slice(0, 3).join(", ");
        onLocationChange(lat, lng, cleanName);
      } else {
        onLocationChange(lat, lng);
      }
    } catch {
      onLocationChange(lat, lng);
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleMarkerDragEnd = (e: L.DragEndEvent) => {
    const marker = e.target;
    const position = marker.getLatLng();
    reverseGeocode(position.lat, position.lng);
  };

  const handleMapClick = (lat: number, lng: number) => {
    reverseGeocode(lat, lng);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        reverseGeocode(lat, lng);
        setIsLocating(false);
        toast.success("Location detected from GPS");
      },
      (error) => {
        setIsLocating(false);
        toast.error("Could not retrieve GPS location. Please click on the map.");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="space-y-3">
      {/* Quick location chips & GPS Button */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-400 font-medium mr-1">Quick Pin:</span>
          {QUICK_LOCATIONS.map((loc) => (
            <button
              key={loc.name}
              type="button"
              onClick={() => {
                reverseGeocode(loc.lat, loc.lng);
              }}
              className="text-xs px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-900/90 text-slate-300 hover:text-amber-400 hover:border-amber-500/40 transition-colors"
            >
              {loc.name}
            </button>
          ))}
        </div>

        <Button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs border-amber-500/30 text-amber-400 hover:bg-amber-500/10 h-8 shrink-0"
        >
          {isLocating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Navigation className="w-3.5 h-3.5" />
          )}
          <span>Locate Me</span>
        </Button>
      </div>

      {/* Map Container */}
      <div className="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
        <MapContainer
          center={[latitude || DEFAULT_MAP_CENTER[0], longitude || DEFAULT_MAP_CENTER[1]]}
          zoom={DEFAULT_MAP_ZOOM}
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onLocationSelect={handleMapClick} />
          <MapRecenter lat={latitude} lng={longitude} />

          <Marker
            position={[latitude, longitude]}
            icon={fixslPinIcon}
            draggable={true}
            eventHandlers={{
              dragend: handleMarkerDragEnd,
            }}
          />
        </MapContainer>

        {/* Location coordinates overlay badge */}
        <div className="absolute bottom-3 left-3 z-[1000] px-3 py-1.5 rounded-xl bg-slate-950/90 border border-slate-800 backdrop-blur-md text-[11px] font-mono text-slate-300 flex items-center gap-2 shadow-lg">
          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>
            {latitude.toFixed(4)}°N, {longitude.toFixed(4)}°E
          </span>
          {isGeocoding && (
            <span className="text-amber-400 flex items-center gap-1 font-sans text-[10px]">
              <Loader2 className="w-3 h-3 animate-spin" />
              Resolving...
            </span>
          )}
        </div>

        {/* Instruction pill */}
        <div className="absolute top-3 right-3 z-[1000] px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700 text-[11px] text-slate-300 backdrop-blur-md shadow-md pointer-events-none">
          Click or drag pin to position
        </div>
      </div>
    </div>
  );
}
