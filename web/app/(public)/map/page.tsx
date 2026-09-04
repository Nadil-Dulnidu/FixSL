import React from "react";
import { MapPageClient } from "@/components/map/map-page-client";
import { getMapIssues, getMapStats } from "@/lib/actions/issues";
import { logger } from "@/lib/logger";
import type { Issue } from "@/lib/types/database";
import type { MapStats } from "@/lib/actions/issues";
import { AlertTriangle } from "lucide-react";

export const revalidate = 30; // ISR — refresh map data every 30 seconds

// Demo fallback data when Supabase is not configured
const DEMO_ISSUES: Issue[] = [
  {
    id: "demo-1",
    tracking_number: 1001,
    title: "Large pothole near Town Hall junction",
    description: "Deep pothole causing traffic hazards at the main junction near Colombo Town Hall.",
    category: "pothole",
    status: "reported",
    priority: "high",
    latitude: 6.9165,
    longitude: 79.8627,
    location_name: "Town Hall, Colombo 07",
    image_url: null,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "demo-2",
    tracking_number: 1002,
    title: "Broken streetlight on Galle Road",
    description: "Streetlight not working for weeks near Bambalapitiya junction.",
    category: "broken_streetlight",
    status: "verified",
    priority: "medium",
    latitude: 6.8891,
    longitude: 79.8561,
    location_name: "Galle Road, Bambalapitiya",
    image_url: null,
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "demo-3",
    tracking_number: 1003,
    title: "Garbage pileup at Pettah market",
    description: "Large pile of garbage left unattended near the Pettah bus stand entrance.",
    category: "garbage",
    status: "in_progress",
    priority: "high",
    latitude: 6.9361,
    longitude: 79.8501,
    location_name: "Pettah, Colombo 11",
    image_url: null,
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: "demo-4",
    tracking_number: 1004,
    title: "Blocked drain causing flooding in Wellawatte",
    description: "Stormwater drain blocked with debris near the Wellawatte canal bridge.",
    category: "blocked_drain",
    status: "reported",
    priority: "critical",
    latitude: 6.8636,
    longitude: 79.8602,
    location_name: "Canal Road, Wellawatte",
    image_url: null,
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: "demo-5",
    tracking_number: 1005,
    title: "Road damage on Duplication Road",
    description: "Cracked tarmac and exposed gravel on Duplication Road near the Kollupitiya junction.",
    category: "road_damage",
    status: "resolved",
    priority: "medium",
    latitude: 6.9066,
    longitude: 79.8553,
    location_name: "Duplication Road, Kollupitiya",
    image_url: null,
    created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "demo-6",
    tracking_number: 1006,
    title: "Open manhole cover on Baseline Road",
    description: "Dangerous open manhole cover near the Borella intersection. Risk of injuries.",
    category: "other",
    status: "verified",
    priority: "critical",
    latitude: 6.9218,
    longitude: 79.8741,
    location_name: "Baseline Road, Borella",
    image_url: null,
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "demo-7",
    tracking_number: 1007,
    title: "Multiple potholes on Kotte Road",
    description: "Series of deep potholes on the main road from Rajagiriya to Kotte.",
    category: "pothole",
    status: "in_progress",
    priority: "high",
    latitude: 6.9006,
    longitude: 79.9045,
    location_name: "Kotte Road, Rajagiriya",
    image_url: null,
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: "demo-8",
    tracking_number: 1008,
    title: "Overflowing garbage bins at Nugegoda junction",
    description: "Public waste bins at the Nugegoda main junction overflowing for days.",
    category: "garbage",
    status: "reported",
    priority: "medium",
    latitude: 6.8723,
    longitude: 79.8913,
    location_name: "Nugegoda Junction",
    image_url: null,
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
];

function computeDemoStats(): MapStats {
  const byStatus: Record<string, number> = {};
  const byCategory: Record<string, number> = {};
  for (const issue of DEMO_ISSUES) {
    byStatus[issue.status] = (byStatus[issue.status] || 0) + 1;
    byCategory[issue.category] = (byCategory[issue.category] || 0) + 1;
  }
  const resolved = byStatus["resolved"] || 0;
  return {
    total: DEMO_ISSUES.length,
    byStatus,
    byCategory,
    resolutionRate: Math.round((resolved / DEMO_ISSUES.length) * 100),
  };
}

export default async function MapPage() {
  let issues: Issue[] = DEMO_ISSUES;
  let stats: MapStats = computeDemoStats();

  try {
    const [issuesResult, statsResult] = await Promise.all([
      getMapIssues(),
      getMapStats(),
    ]);

    if (issuesResult.success && issuesResult.data && issuesResult.data.length > 0) {
      issues = issuesResult.data;
    }
    if (statsResult.success && statsResult.data) {
      stats = statsResult.data;
    }
  } catch (err) {
    logger.warn("Map page: Supabase fetch failed, using demo data", {
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }

  return (
    <div className="h-[calc(100vh-4rem)]">
      <MapPageClient initialIssues={issues} initialStats={stats} />
    </div>
  );
}
