export interface CategoryConfig {
  value: string;
  label: string;
  description: string;
  icon: string; // Lucide icon name
  badgeClass: string;
  markerColor: string;
}

export const ISSUE_CATEGORIES: Record<string, CategoryConfig> = {
  pothole: {
    value: "pothole",
    label: "Pothole",
    description: "Dangerous road crater or surface depression",
    icon: "AlertOctagon",
    badgeClass: "bg-amber-500/10 text-amber-500 border-amber-500/30",
    markerColor: "#f59e0b",
  },
  road_damage: {
    value: "road_damage",
    label: "Road Damage",
    description: "Cracked tarmac, erosion, or broken pavement",
    icon: "Construction",
    badgeClass: "bg-orange-500/10 text-orange-500 border-orange-500/30",
    markerColor: "#f97316",
  },
  broken_streetlight: {
    value: "broken_streetlight",
    label: "Broken Streetlight",
    description: "Unlit lamp post, flickering light, or exposed wiring",
    icon: "LightbulbOff",
    badgeClass: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
    markerColor: "#eab308",
  },
  garbage: {
    value: "garbage",
    label: "Garbage Pileup",
    description: "Illegal dumping or overflowing public waste bin",
    icon: "Trash2",
    badgeClass: "bg-red-500/10 text-red-500 border-red-500/30",
    markerColor: "#ef4444",
  },
  blocked_drain: {
    value: "blocked_drain",
    label: "Blocked Drain",
    description: "Clogged stormwater canal or flooded gutter",
    icon: "Waves",
    badgeClass: "bg-blue-500/10 text-blue-500 border-blue-500/30",
    markerColor: "#3b82f6",
  },
  other: {
    value: "other",
    label: "Other Public Hazard",
    description: "Fallen tree, open manhole, or other public issue",
    icon: "HelpCircle",
    badgeClass: "bg-zinc-500/10 text-zinc-400 border-zinc-500/30",
    markerColor: "#71717a",
  },
};

export interface StatusConfig {
  value: string;
  label: string;
  description: string;
  badgeClass: string;
  step: number;
}

export const ISSUE_STATUSES: Record<string, StatusConfig> = {
  reported: {
    value: "reported",
    label: "Reported",
    description: "Submitted by citizen, awaiting community verification",
    badgeClass: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    step: 1,
  },
  verified: {
    value: "verified",
    label: "Verified",
    description: "Confirmed by citizens or municipal scouts",
    badgeClass: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    step: 2,
  },
  in_progress: {
    value: "in_progress",
    label: "In Progress",
    description: "Work crew assigned by municipal authority",
    badgeClass: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    step: 3,
  },
  resolved: {
    value: "resolved",
    label: "Resolved",
    description: "Repair finished; community confirmation pending",
    badgeClass: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    step: 4,
  },
};

export interface PriorityConfig {
  value: string;
  label: string;
  badgeClass: string;
}

export const ISSUE_PRIORITIES: Record<string, PriorityConfig> = {
  low: {
    value: "low",
    label: "Low",
    badgeClass: "bg-zinc-500/15 text-zinc-300 border-zinc-500/30",
  },
  medium: {
    value: "medium",
    label: "Medium",
    badgeClass: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  },
  high: {
    value: "high",
    label: "High",
    badgeClass: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  },
  critical: {
    value: "critical",
    label: "Critical",
    badgeClass: "bg-red-500/15 text-red-400 border-red-500/30 animate-pulse",
  },
};

/**
 * Default geographic center: Colombo Town Hall / Galle Face Area, Sri Lanka
 */
export const DEFAULT_MAP_CENTER: [number, number] = [6.9271, 79.8612];
export const DEFAULT_MAP_ZOOM = 13;

/**
 * Sri Lanka bounds for map viewport constraints
 */
export const SRI_LANKA_BOUNDS: [[number, number], [number, number]] = [
  [5.9166, 79.5166], // South-West
  [9.8355, 81.8804], // North-East
];

/**
 * Popular Colombo locations for quick selection
 */
export const QUICK_LOCATIONS = [
  { name: "Fort / Pettah", lat: 6.9344, lng: 79.8428 },
  { name: "Galle Face / Kollupitiya", lat: 6.9147, lng: 79.8517 },
  { name: "Bambalapitiya / Wellawatte", lat: 6.8791, lng: 79.8597 },
  { name: "Borella / Maradana", lat: 6.9149, lng: 79.8778 },
  { name: "Nugegoda / Kotte", lat: 6.8732, lng: 79.8973 },
  { name: "Rajagiriya / Battaramulla", lat: 6.9079, lng: 79.9149 },
];
