-- ==============================================================================
-- FixSL — Seed Data (~25 Realistic Issues in Colombo & Suburbs)
-- Sri Lankan Civic Infrastructure Issue Reporting Platform
-- ==============================================================================

-- Clear existing data if necessary
TRUNCATE TABLE issue_feedback CASCADE;
TRUNCATE TABLE issues RESTART IDENTITY CASCADE;

-- Insert 25 realistic issues across Colombo Metro Area
INSERT INTO issues (id, tracking_number, title, description, category, status, priority, latitude, longitude, location_name, created_at)
VALUES
  -- 1. Fort / Galle Face
  (
    'a0000001-0000-0000-0000-000000000001',
    1001,
    'Deep crater pothole near Fort Railway Station entrance',
    'Severe 40cm pothole on Olcott Mawatha right before the bus station turnoff. Multiple three-wheelers and motorcycles swerving into oncoming traffic.',
    'pothole',
    'reported',
    'critical',
    6.9344,
    79.8502,
    'Olcott Mawatha, Colombo Fort (Near Station Exit)',
    now() - interval '2 hours'
  ),
  (
    'a0000001-0000-0000-0000-000000000002',
    1002,
    'Faulty streetlights along Galle Face Marine Drive',
    'A cluster of 4 lamp posts have been unlit for 3 nights opposite the promenade, creating a hazardous dark stretch for night commuters and pedestrians.',
    'broken_streetlight',
    'verified',
    'medium',
    6.9248,
    79.8458,
    'Galle Face Centre Road, Colombo 03',
    now() - interval '6 hours'
  ),

  -- 2. Kollupitiya & Bambalapitiya
  (
    'a0000001-0000-0000-0000-000000000003',
    1003,
    'Collapsed roadside drain cover near Majestic City',
    'Broken concrete slab on the sidewalk pavement. Pedestrians could easily fall in at night. Exposed rebar poses severe laceration hazard.',
    'blocked_drain',
    'in_progress',
    'high',
    6.8938,
    79.8550,
    'Galle Road (Opposite Majestic City), Bambalapitiya',
    now() - interval '1 day'
  ),
  (
    'a0000001-0000-0000-0000-000000000004',
    1004,
    'Garbage dump accumulating near Bambalapitiya flats canal',
    'Uncollected polythene bags and commercial food waste spilling into the water canal. Strong foul odor and mosquito breeding hotspot.',
    'garbage',
    'reported',
    'high',
    6.8912,
    79.8601,
    'Bambalapitiya Flats Canal Road, Colombo 04',
    now() - interval '8 hours'
  ),
  (
    'a0000001-0000-0000-0000-000000000005',
    1005,
    'Damaged road surface after water pipe repair on Duplication Road',
    'Water board finished pipe replacement but left the trench backfilled with loose gravel. Tarmac has sunk by 3 inches.',
    'road_damage',
    'resolved',
    'medium',
    6.9015,
    79.8562,
    'R.A. De Mel Mawatha (Duplication Rd), Kollupitiya',
    now() - interval '3 days'
  ),

  -- 3. Wellawatte & Dehiwala
  (
    'a0000001-0000-0000-0000-000000000006',
    1006,
    'Blocked canal culvert causing flash flooding on Manning Place',
    'Heavy rain caused sea-outlet culvert to back up with plastic bottles and coconut husks. Road is submerged under 6 inches of water.',
    'blocked_drain',
    'verified',
    'high',
    6.8724,
    79.8615,
    'Manning Place, Wellawatte, Colombo 06',
    now() - interval '14 hours'
  ),
  (
    'a0000001-0000-0000-0000-000000000007',
    1007,
    'Multiple potholes on Marine Drive Dehiwala stretch',
    'Rough patch with 5 interconnected potholes near the railway crossing. Causes severe traffic snarls during evening rush hour.',
    'pothole',
    'in_progress',
    'high',
    6.8520,
    79.8642,
    'Marine Drive, Dehiwala (Near Railway Crossing)',
    now() - interval '2 days'
  ),
  (
    'a0000001-0000-0000-0000-000000000008',
    1008,
    'Overflowing municipal bin at Dehiwala Junction',
    'Public waste container overflowed over 48 hours ago. Waste has spread onto the bus halt pavement.',
    'garbage',
    'resolved',
    'medium',
    6.8480,
    79.8690,
    'Galle Road Junction, Dehiwala',
    now() - interval '4 days'
  ),

  -- 4. Maradana & Borella
  (
    'a0000001-0000-0000-0000-000000000009',
    1009,
    'Open manhole missing cover near Maradana Technical Junction',
    'Extremely dangerous open sewer manhole with no warning barrier or cones. Directly in the path of heavy pedestrian traffic.',
    'other',
    'reported',
    'critical',
    6.9272,
    79.8674,
    'Technical Junction, Maradana, Colombo 10',
    now() - interval '3 hours'
  ),
  (
    'a0000001-0000-0000-0000-000000000010',
    1010,
    'Flickering high-mast light at Borella Kanatte Junction',
    'Large junction lighting is strobing and cutting out intermittently, creating blind spots for nighttime vehicular turns.',
    'broken_streetlight',
    'reported',
    'low',
    6.9088,
    79.8785,
    'Kanatte Roundabout, Borella, Colombo 08',
    now() - interval '1 day'
  ),
  (
    'a0000001-0000-0000-0000-000000000011',
    1011,
    'Sunken asphalt ridge outside Lady Ridgeway Hospital',
    'Heavy bus traffic has deformed the asphalt into a sharp ridge. Ambulances are being forced to brake suddenly.',
    'road_damage',
    'in_progress',
    'critical',
    6.9189,
    79.8732,
    'Dr. Danister De Silva Mawatha, Borella',
    now() - interval '18 hours'
  ),

  -- 5. Rajagiriya & Battaramulla
  (
    'a0000001-0000-0000-0000-000000000012',
    1012,
    'Clogged stormwater grate before Rajagiriya Flyover',
    'Debris blocking rainwater intake. Slight showers cause puddling across the center dual lanes.',
    'blocked_drain',
    'verified',
    'medium',
    6.9095,
    79.8920,
    'Sri Jayawardenepura Mawatha, Rajagiriya',
    now() - interval '12 hours'
  ),
  (
    'a0000001-0000-0000-0000-000000000013',
    1013,
    'Fallen tree branch hanging over electrical lines on Buthgamuwa Rd',
    'Large branch from roadside tree cracked in strong winds and rests on power lines.',
    'other',
    'in_progress',
    'high',
    6.9180,
    79.9025,
    'Buthgamuwa Road, Rajagiriya',
    now() - interval '7 hours'
  ),
  (
    'a0000001-0000-0000-0000-000000000014',
    1014,
    'Broken streetlight outside Diyatha Uyana walking path',
    'Two poles along the park perimeter road have damaged fixtures.',
    'broken_streetlight',
    'resolved',
    'low',
    6.9012,
    79.9140,
    'Diyatha Uyana Perimeter, Battaramulla',
    now() - interval '5 days'
  ),
  (
    'a0000001-0000-0000-0000-000000000015',
    1015,
    'Deep potholes along Pelawatte - Akuregoda Road',
    'Several wheel-bending potholes near the Defence Headquarters junction.',
    'pothole',
    'verified',
    'medium',
    6.8890,
    79.9280,
    'Akuregoda Road, Pelawatte, Battaramulla',
    now() - interval '1 day'
  ),

  -- 6. Nugegoda & Kotte
  (
    'a0000001-0000-0000-0000-000000000016',
    1016,
    'Garbage dumping under Nugegoda Supermarket Overpass',
    'Frequent illegal dumping of carton boxes and plastic waste under the pedestrian staircase.',
    'garbage',
    'reported',
    'medium',
    6.8715,
    79.8925,
    'Stanley Thilakarathne Mawatha, Nugegoda',
    now() - interval '16 hours'
  ),
  (
    'a0000001-0000-0000-0000-000000000017',
    1017,
    'Eroded road shoulder on High Level Road near Delkanda',
    'The left lane edge has crumbled into the ditch by approximately 1 foot. Dangerous for cyclists.',
    'road_damage',
    'in_progress',
    'high',
    6.8640,
    79.9015,
    'High Level Road (Delkanda Junction), Nugegoda',
    now() - interval '2 days'
  ),
  (
    'a0000001-0000-0000-0000-000000000018',
    1018,
    'Clogged main drain opposite Jubilee Post',
    'Heavy silt and sand buildup preventing drainage outflow towards Kotte marsh.',
    'blocked_drain',
    'resolved',
    'medium',
    6.8795,
    79.9050,
    'Jubilee Post Junction, Nugegoda / Kotte',
    now() - interval '4 days'
  ),

  -- 7. Pettah & Central Colombo
  (
    'a0000001-0000-0000-0000-000000000019',
    1019,
    'Severe vegetable waste accumulation at Pettah Manning Market zone',
    'Rotting organic produce discarded along side lane. Significant hygiene and pest hazard.',
    'garbage',
    'verified',
    'high',
    6.9385,
    79.8552,
    '5th Cross Street, Pettah, Colombo 11',
    now() - interval '9 hours'
  ),
  (
    'a0000001-0000-0000-0000-000000000020',
    1020,
    'Damaged cobblestones and broken paving around Old Dutch Hospital',
    'Loose granite stones tripping tourists and visitors in pedestrian precinct.',
    'road_damage',
    'reported',
    'low',
    6.9328,
    79.8432,
    'Hospital Street, Colombo Fort',
    now() - interval '2 days'
  ),

  -- 8. Mount Lavinia & Moratuwa
  (
    'a0000001-0000-0000-0000-000000000021',
    1021,
    'Pothole cluster at Mount Lavinia Hotel turnoff',
    'Three deep potholes on Hotel Road causing traffic congestion near the tourist strip.',
    'pothole',
    'reported',
    'medium',
    6.8360,
    79.8645,
    'Hotel Road, Mount Lavinia',
    now() - interval '1 day'
  ),
  (
    'a0000001-0000-0000-0000-000000000022',
    1022,
    'Unlit dark patch on Galle Road near Katubedda Junction',
    'Series of streetlights non-operational for over a week outside University of Moratuwa entrance.',
    'broken_streetlight',
    'in_progress',
    'high',
    6.7972,
    79.8885,
    'Galle Road (Katubedda Junction), Moratuwa',
    now() - interval '3 days'
  ),

  -- 9. Kolonnawa & Kelaniya
  (
    'a0000001-0000-0000-0000-000000000023',
    1023,
    'Potholes on Kelaniya Raja Maha Vihara access road',
    'Surface breakup ahead of upcoming temple festival week.',
    'pothole',
    'resolved',
    'medium',
    6.9530,
    79.9190,
    'Biyagama Road, Kelaniya',
    now() - interval '6 days'
  ),
  (
    'a0000001-0000-0000-0000-000000000024',
    1024,
    'Blocked canal culvert at Wellampitiya junction',
    'Trash buildup blocking canal flow under the main bridge.',
    'blocked_drain',
    'reported',
    'critical',
    6.9410,
    79.8920,
    'Avissawella Road, Wellampitiya',
    now() - interval '5 hours'
  ),
  (
    'a0000001-0000-0000-0000-000000000025',
    1025,
    'Garbage heap near Orugodawatta interchange',
    'Construction debris and general waste dumped on highway slip road shoulder.',
    'garbage',
    'in_progress',
    'medium',
    6.9460,
    79.8780,
    'Baseline Road / Orugodawatta Flyover, Colombo 09',
    now() - interval '1 day'
  );

-- Insert Sample Community Feedback Records (for realistic verification count demos)
INSERT INTO issue_feedback (issue_id, feedback_type, session_id, created_at)
VALUES
  -- Confirmations on Issue 1001 (Fort Pothole)
  ('a0000001-0000-0000-0000-000000000001', 'confirm', 'demo_sess_1', now() - interval '1 hour'),
  ('a0000001-0000-0000-0000-000000000001', 'confirm', 'demo_sess_2', now() - interval '45 mins'),
  ('a0000001-0000-0000-0000-000000000001', 'confirm', 'demo_sess_3', now() - interval '30 mins'),
  ('a0000001-0000-0000-0000-000000000001', 'confirm', 'demo_sess_4', now() - interval '15 mins'),

  -- Confirmations on Issue 1003 (Majestic City Drain)
  ('a0000001-0000-0000-0000-000000000003', 'confirm', 'demo_sess_1', now() - interval '20 hours'),
  ('a0000001-0000-0000-0000-000000000003', 'confirm', 'demo_sess_5', now() - interval '18 hours'),
  ('a0000001-0000-0000-0000-000000000003', 'confirm', 'demo_sess_6', now() - interval '10 hours'),

  -- Resolution Feedback on Issue 1005 (Duplication Road)
  ('a0000001-0000-0000-0000-000000000005', 'resolution_confirm', 'demo_sess_7', now() - interval '2 days'),
  ('a0000001-0000-0000-0000-000000000005', 'resolution_confirm', 'demo_sess_8', now() - interval '1 day'),

  -- Confirmations on Issue 1009 (Maradana Open Manhole)
  ('a0000001-0000-0000-0000-000000000009', 'confirm', 'demo_sess_1', now() - interval '2 hours'),
  ('a0000001-0000-0000-0000-000000000009', 'confirm', 'demo_sess_2', now() - interval '2 hours'),
  ('a0000001-0000-0000-0000-000000000009', 'confirm', 'demo_sess_3', now() - interval '1 hour'),
  ('a0000001-0000-0000-0000-000000000009', 'confirm', 'demo_sess_4', now() - interval '1 hour'),
  ('a0000001-0000-0000-0000-000000000009', 'confirm', 'demo_sess_5', now() - interval '30 mins'),
  ('a0000001-0000-0000-0000-000000000009', 'confirm', 'demo_sess_6', now() - interval '20 mins'),
  ('a0000001-0000-0000-0000-000000000009', 'confirm', 'demo_sess_9', now() - interval '10 mins');
