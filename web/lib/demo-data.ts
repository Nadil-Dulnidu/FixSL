import type { Issue, IssueWithFeedbackCount, IssueFeedback } from "@/lib/types/database";

export const DEMO_ISSUES: Issue[] = [
  // 1. Fort / Galle Face
  {
    id: "a0000001-0000-0000-0000-000000000001",
    tracking_number: 1001,
    title: "Deep crater pothole near Fort Railway Station entrance",
    description:
      "Severe 40cm pothole on Olcott Mawatha right before the bus station turnoff. Multiple three-wheelers and motorcycles swerving into oncoming traffic to avoid rim damage.",
    category: "pothole",
    status: "reported",
    priority: "critical",
    latitude: 6.9344,
    longitude: 79.8502,
    location_name: "Olcott Mawatha, Colombo Fort (Near Station Exit)",
    image_url: null,
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: "a0000001-0000-0000-0000-000000000002",
    tracking_number: 1002,
    title: "Faulty streetlights along Galle Face Marine Drive",
    description:
      "A cluster of 4 lamp posts have been unlit for 3 nights opposite the promenade, creating a hazardous dark stretch for night commuters and pedestrians.",
    category: "broken_streetlight",
    status: "verified",
    priority: "medium",
    latitude: 6.9248,
    longitude: 79.8458,
    location_name: "Galle Face Centre Road, Colombo 03",
    image_url: null,
    created_at: new Date(Date.now() - 6 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 3600000).toISOString(),
  },

  // 2. Kollupitiya & Bambalapitiya
  {
    id: "a0000001-0000-0000-0000-000000000003",
    tracking_number: 1003,
    title: "Collapsed roadside drain cover near Majestic City",
    description:
      "Broken concrete slab on the sidewalk pavement. Pedestrians could easily fall in at night. Exposed rebar poses severe laceration hazard.",
    category: "blocked_drain",
    status: "in_progress",
    priority: "high",
    latitude: 6.8938,
    longitude: 79.855,
    location_name: "Galle Road (Opposite Majestic City), Bambalapitiya",
    image_url: null,
    created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 3600000).toISOString(),
  },
  {
    id: "a0000001-0000-0000-0000-000000000004",
    tracking_number: 1004,
    title: "Garbage dump accumulating near Bambalapitiya flats canal",
    description:
      "Uncollected polythene bags and commercial food waste spilling into the water canal. Strong foul odor and mosquito breeding hotspot.",
    category: "garbage",
    status: "reported",
    priority: "high",
    latitude: 6.8912,
    longitude: 79.8601,
    location_name: "Bambalapitiya Flats Canal Road, Colombo 04",
    image_url: null,
    created_at: new Date(Date.now() - 8 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 8 * 3600000).toISOString(),
  },
  {
    id: "a0000001-0000-0000-0000-000000000005",
    tracking_number: 1005,
    title: "Damaged road surface after water pipe repair on Duplication Road",
    description:
      "Water board finished pipe replacement but left the trench backfilled with loose gravel. Tarmac has sunk by 3 inches across both lanes.",
    category: "road_damage",
    status: "resolved",
    priority: "medium",
    latitude: 6.9015,
    longitude: 79.8562,
    location_name: "R.A. De Mel Mawatha (Duplication Rd), Kollupitiya",
    image_url: null,
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },

  // 3. Wellawatte & Dehiwala
  {
    id: "a0000001-0000-0000-0000-000000000006",
    tracking_number: 1006,
    title: "Blocked canal culvert causing flash flooding on Manning Place",
    description:
      "Heavy rain caused sea-outlet culvert to back up with plastic bottles and debris. Road is submerged under 6 inches of stormwater.",
    category: "blocked_drain",
    status: "verified",
    priority: "high",
    latitude: 6.8724,
    longitude: 79.8615,
    location_name: "Manning Place, Wellawatte, Colombo 06",
    image_url: null,
    created_at: new Date(Date.now() - 14 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 3600000).toISOString(),
  },
  {
    id: "a0000001-0000-0000-0000-000000000007",
    tracking_number: 1007,
    title: "Multiple potholes on Marine Drive Dehiwala stretch",
    description:
      "Rough patch with 5 interconnected potholes near the railway crossing. Causes severe traffic snarls during evening rush hour.",
    category: "pothole",
    status: "in_progress",
    priority: "high",
    latitude: 6.852,
    longitude: 79.8642,
    location_name: "Marine Drive, Dehiwala (Near Railway Crossing)",
    image_url: null,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: "a0000001-0000-0000-0000-000000000008",
    tracking_number: 1008,
    title: "Overflowing municipal bin at Dehiwala Junction",
    description:
      "Public waste container overflowed over 48 hours ago. Waste has spread onto the bus halt pavement.",
    category: "garbage",
    status: "resolved",
    priority: "medium",
    latitude: 6.848,
    longitude: 79.869,
    location_name: "Galle Road Junction, Dehiwala",
    image_url: null,
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },

  // 4. Maradana & Borella
  {
    id: "a0000001-0000-0000-0000-000000000009",
    tracking_number: 1009,
    title: "Open manhole missing cover near Maradana Technical Junction",
    description:
      "Extremely dangerous open sewer manhole with no warning barrier or cones. Directly in the path of heavy pedestrian and student foot traffic.",
    category: "other",
    status: "reported",
    priority: "critical",
    latitude: 6.9272,
    longitude: 79.8674,
    location_name: "Technical Junction, Maradana, Colombo 10",
    image_url: null,
    created_at: new Date(Date.now() - 3 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 3600000).toISOString(),
  },
  {
    id: "a0000001-0000-0000-0000-000000000010",
    tracking_number: 1010,
    title: "Flickering high-mast light at Borella Kanatte Junction",
    description:
      "Large junction lighting is strobing and cutting out intermittently, creating blind spots for nighttime vehicular turns.",
    category: "broken_streetlight",
    status: "reported",
    priority: "low",
    latitude: 6.9088,
    longitude: 79.8785,
    location_name: "Kanatte Roundabout, Borella, Colombo 08",
    image_url: null,
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: "a0000001-0000-0000-0000-000000000011",
    tracking_number: 1011,
    title: "Sunken asphalt ridge outside Lady Ridgeway Hospital",
    description:
      "Heavy bus traffic has deformed the asphalt into a sharp 4-inch ridge. Emergency ambulances are being forced to brake suddenly.",
    category: "road_damage",
    status: "in_progress",
    priority: "critical",
    latitude: 6.9189,
    longitude: 79.8732,
    location_name: "Dr. Danister De Silva Mawatha, Borella",
    image_url: null,
    created_at: new Date(Date.now() - 18 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 3600000).toISOString(),
  },

  // 5. Rajagiriya & Battaramulla
  {
    id: "a0000001-0000-0000-0000-000000000012",
    tracking_number: 1012,
    title: "Clogged stormwater grate before Rajagiriya Flyover",
    description:
      "Leaves and construction sand blocking rainwater intake. Slight showers cause puddling across the center dual lanes.",
    category: "blocked_drain",
    status: "verified",
    priority: "medium",
    latitude: 6.9095,
    longitude: 79.892,
    location_name: "Sri Jayawardenepura Mawatha, Rajagiriya",
    image_url: null,
    created_at: new Date(Date.now() - 12 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: "a0000001-0000-0000-0000-000000000013",
    tracking_number: 1013,
    title: "Fallen tree branch hanging over electrical lines on Buthgamuwa Rd",
    description:
      "Large branch from roadside banyan tree cracked during strong gusty winds and rests directly on overhead 230V power lines.",
    category: "other",
    status: "in_progress",
    priority: "high",
    latitude: 6.918,
    longitude: 79.9025,
    location_name: "Buthgamuwa Road, Rajagiriya",
    image_url: null,
    created_at: new Date(Date.now() - 7 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 3600000).toISOString(),
  },
  {
    id: "a0000001-0000-0000-0000-000000000014",
    tracking_number: 1014,
    title: "Broken streetlight outside Diyatha Uyana walking path",
    description:
      "Two poles along the park perimeter road have damaged fixtures. Walkers cannot see the pavement path clearly after 7 PM.",
    category: "broken_streetlight",
    status: "resolved",
    priority: "low",
    latitude: 6.9012,
    longitude: 79.914,
    location_name: "Diyatha Uyana Perimeter, Battaramulla",
    image_url: null,
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "a0000001-0000-0000-0000-000000000015",
    tracking_number: 1015,
    title: "Deep potholes along Pelawatte - Akuregoda Road",
    description:
      "Several wheel-bending potholes near the Defence Headquarters junction causing heavy slowdowns.",
    category: "pothole",
    status: "verified",
    priority: "medium",
    latitude: 6.889,
    longitude: 79.928,
    location_name: "Akuregoda Road, Pelawatte, Battaramulla",
    image_url: null,
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 3600000).toISOString(),
  },

  // 6. Nugegoda & Kotte
  {
    id: "a0000001-0000-0000-0000-000000000016",
    tracking_number: 1016,
    title: "Garbage dumping under Nugegoda Supermarket Overpass",
    description:
      "Frequent illegal dumping of carton boxes and rotting vegetable waste under the pedestrian staircase.",
    category: "garbage",
    status: "reported",
    priority: "medium",
    latitude: 6.8715,
    longitude: 79.8925,
    location_name: "Stanley Thilakarathne Mawatha, Nugegoda",
    image_url: null,
    created_at: new Date(Date.now() - 16 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 16 * 3600000).toISOString(),
  },
  {
    id: "a0000001-0000-0000-0000-000000000017",
    tracking_number: 1017,
    title: "Eroded road shoulder on High Level Road near Delkanda",
    description:
      "The left lane edge has crumbled into the ditch by approximately 1 foot. Dangerous for motorcyclists and cyclists.",
    category: "road_damage",
    status: "in_progress",
    priority: "high",
    latitude: 6.864,
    longitude: 79.9015,
    location_name: "High Level Road (Delkanda Junction), Nugegoda",
    image_url: null,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: "a0000001-0000-0000-0000-000000000018",
    tracking_number: 1018,
    title: "Clogged main drain opposite Jubilee Post",
    description:
      "Heavy silt and sand buildup preventing drainage outflow towards Kotte marsh. Authorities marked resolved but sand remains.",
    category: "blocked_drain",
    status: "resolved",
    priority: "medium",
    latitude: 6.8795,
    longitude: 79.905,
    location_name: "Jubilee Post Junction, Nugegoda / Kotte",
    image_url: null,
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

// Initial Demo Feedback Counts map for rich demo testing
export const INITIAL_DEMO_FEEDBACK: Record<
  string,
  {
    confirm: number;
    dispute: number;
    resolution_confirm: number;
    resolution_dispute: number;
  }
> = {
  // Fort Pothole: 14 confirmations, 1 duplicate report
  "a0000001-0000-0000-0000-000000000001": {
    confirm: 14,
    dispute: 1,
    resolution_confirm: 0,
    resolution_dispute: 0,
  },
  // Majestic City Drain: 8 confirmations
  "a0000001-0000-0000-0000-000000000003": {
    confirm: 8,
    dispute: 0,
    resolution_confirm: 0,
    resolution_dispute: 0,
  },
  // Duplication Road: Resolved with 12 confirmed fixes, 1 dispute
  "a0000001-0000-0000-0000-000000000005": {
    confirm: 5,
    dispute: 0,
    resolution_confirm: 12,
    resolution_dispute: 1,
  },
  // Manning Place Flooding: 9 confirmations
  "a0000001-0000-0000-0000-000000000006": {
    confirm: 9,
    dispute: 0,
    resolution_confirm: 0,
    resolution_dispute: 0,
  },
  // Maradana Open Manhole: 21 confirmations, 2 duplicate reports
  "a0000001-0000-0000-0000-000000000009": {
    confirm: 21,
    dispute: 2,
    resolution_confirm: 0,
    resolution_dispute: 0,
  },
  // Jubilee Post Drain: Resolved with 6 disputes (TRIGGERS DISPUTE BADGE!)
  "a0000001-0000-0000-0000-000000000018": {
    confirm: 3,
    dispute: 0,
    resolution_confirm: 2,
    resolution_dispute: 6, // >= 5 triggers "⚠️ Resolution Disputed"
  },
};

/**
 * Helper to find a demo issue by tracking number, string number, or UUID
 */
export function findDemoIssue(identifier: string | number): Issue | null {
  const parsedNum =
    typeof identifier === "number"
      ? identifier
      : parseInt(String(identifier).replace(/\D/g, ""), 10);

  if (!isNaN(parsedNum) && parsedNum > 0) {
    const found = DEMO_ISSUES.find((i) => i.tracking_number === parsedNum);
    if (found) return found;
  }

  const idStr = String(identifier).toLowerCase();
  const byId = DEMO_ISSUES.find((i) => i.id.toLowerCase() === idStr);
  return byId || null;
}

/**
 * Helper to get demo feedback counts for an issue
 */
export function getDemoFeedbackCounts(issueId: string) {
  const counts = INITIAL_DEMO_FEEDBACK[issueId] || {
    confirm: 4,
    dispute: 0,
    resolution_confirm: 0,
    resolution_dispute: 0,
  };

  return {
    confirm: counts.confirm,
    dispute: counts.dispute,
    resolution_confirm: counts.resolution_confirm,
    resolution_dispute: counts.resolution_dispute,
    isDisputed: counts.resolution_dispute >= 5,
  };
}
