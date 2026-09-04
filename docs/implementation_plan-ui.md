# Mobile Responsiveness Implementation Plan

FixSL is a civic reporting platform for Sri Lankan road and utility hazards. This plan establishes complete mobile responsiveness, touch optimization (min 44×44px hit areas, iOS input zoom prevention, gesture-safe areas), and responsive UI layouts across all public and admin pages.

## User Review Required

> [!NOTE]
> All changes preserve the existing dark claymorphic aesthetic, interactive Leaflet maps, and real-time Supabase/Clerk functionality while drastically improving mobile ergonomics, viewport scaling, and touch experience.

## Proposed Changes

### Global Layout & Viewport Configuration

#### [MODIFY] [app/layout.tsx](file:///c:/Users/LOQ/OneDrive/Desktop/FixSL/web/app/layout.tsx)
- Export Next.js `Viewport` metadata with `width: 'device-width'`, `initialScale: 1`, `maximumScale: 5`, and `themeColor: '#090d16'`.
- Ensure base font scaling and prevent iOS Safari auto-zoom on text inputs (base 16px inputs).

#### [MODIFY] [app/globals.css](file:///c:/Users/LOQ/OneDrive/Desktop/FixSL/web/app/globals.css)
- Add utility classes for mobile safe areas, touch manipulation (`touch-action: manipulation`), and mobile card views for tables.
- Adjust Leaflet zoom controls on mobile to be easily tap-friendly without blocking screen content.

---

### Navigation & Footer

#### [MODIFY] [components/layout/navbar.tsx](file:///c:/Users/LOQ/OneDrive/Desktop/FixSL/web/components/layout/navbar.tsx)
- Enhance mobile menu drawer with a backdrop overlay, smooth open/close animation, touch-friendly navigation links, and backdrop click-to-dismiss.
- Lock background body scroll when mobile navigation drawer is open.
- Ensure minimum 44×44px touch targets on mobile for hamburger button and menu links.

#### [MODIFY] [components/layout/footer.tsx](file:///c:/Users/LOQ/OneDrive/Desktop/FixSL/web/components/layout/footer.tsx)
- Transform emergency hotlines (`119`, `1990`, `011-2684290`, `1968`) into direct one-tap clickable `tel:` links with phone icons.
- Enhance responsive grid layout and spacing for mobile screens.

---

### Landing Page

#### [MODIFY] [components/landing/hero-section.tsx](file:///c:/Users/LOQ/OneDrive/Desktop/FixSL/web/components/landing/hero-section.tsx)
- Refine typography scaling (`text-3xl sm:text-5xl md:text-6xl lg:text-7xl`) so headline never overflows or clips on 320px–375px screens.
- Enhance CTA buttons to full width with 48px+ touch height on mobile.
- Refine trust badges grid to stack cleanly on mobile.

#### [MODIFY] [components/landing/stats-section.tsx](file:///c:/Users/LOQ/OneDrive/Desktop/FixSL/web/components/landing/stats-section.tsx)
- Optimize grid padding and metric font sizes for mobile viewports.

#### [MODIFY] [components/landing/how-it-works.tsx](file:///c:/Users/LOQ/OneDrive/Desktop/FixSL/web/components/landing/how-it-works.tsx)
- Improve stage card spacing and responsive layout on small screens.

#### [MODIFY] [components/landing/track-issue.tsx](file:///c:/Users/LOQ/OneDrive/Desktop/FixSL/web/components/landing/track-issue.tsx)
- Make tracking form input and submit button full width on mobile, and enlarge demo chip touch targets.

---

### Community Live Map

#### [MODIFY] [components/map/map-page-client.tsx](file:///c:/Users/LOQ/OneDrive/Desktop/FixSL/web/components/map/map-page-client.tsx)
- On mobile devices (`< lg`), default the sidebar to collapsed so the interactive map is immediately visible and usable.
- Add a floating mobile action button ("Filters & Stats" with active filter badge) that opens a dedicated slide-over drawer / bottom sheet with backdrop overlay and close button.
- On desktop, maintain the sleek side panel.

#### [MODIFY] [components/map/issue-map-inner.tsx](file:///c:/Users/LOQ/OneDrive/Desktop/FixSL/web/components/map/issue-map-inner.tsx)
- Optimize category legend on mobile screens (make it compact / collapsible so it never overlaps Leaflet controls or obscures map pins).
- Responsive position for issue count pill and Leaflet attribution.

#### [MODIFY] [components/map/map-filters.tsx](file:///c:/Users/LOQ/OneDrive/Desktop/FixSL/web/components/map/map-filters.tsx)
- Ensure filter selects and buttons have touch-friendly height (min 44px) and proper mobile padding.

---

### Public Issue Detail & Civic Verification

#### [MODIFY] [components/issues/issue-detail-card.tsx](file:///c:/Users/LOQ/OneDrive/Desktop/FixSL/web/components/issues/issue-detail-card.tsx)
- Make badge headers flex-wrap cleanly on narrow devices (320px–375px).
- Stack action buttons ("Share Issue", "View On Map", "Report Another") gracefully on mobile screens.
- Adjust mini-map height for mobile screens (`h-56 sm:h-72`).

#### [MODIFY] [components/issues/verification-panel.tsx](file:///c:/Users/LOQ/OneDrive/Desktop/FixSL/web/components/issues/verification-panel.tsx)
- Enhance voting buttons for touch devices with 48px+ height and clear confirmation state.

#### [MODIFY] [components/issues/resolution-feedback.tsx](file:///c:/Users/LOQ/OneDrive/Desktop/FixSL/web/components/issues/resolution-feedback.tsx)
- Ensure resolution confirm / dispute buttons stack cleanly and display counts clearly on mobile.

---

### Hazard Reporting Form

#### [MODIFY] [components/report/report-form.tsx](file:///c:/Users/LOQ/OneDrive/Desktop/FixSL/web/components/report/report-form.tsx)
- Optimize category grid for mobile screens with touch-friendly selection cards.
- Ensure form inputs prevent iOS auto-zoom (min 16px font size on inputs).

#### [MODIFY] [components/report/location-picker-inner.tsx](file:///c:/Users/LOQ/OneDrive/Desktop/FixSL/web/components/report/location-picker-inner.tsx)
- Make quick pin chips wrap cleanly with comfortable tap targets.
- Ensure "Locate Me" button is easily reachable on mobile.

#### [MODIFY] [components/report/image-upload.tsx](file:///c:/Users/LOQ/OneDrive/Desktop/FixSL/web/components/report/image-upload.tsx)
- Enable mobile camera capture and photo library access seamlessly.
- Provide large remove button tap target (44×44px).

#### [MODIFY] [components/report/report-success.tsx](file:///c:/Users/LOQ/OneDrive/Desktop/FixSL/web/components/report/report-success.tsx)
- Stack action buttons vertically on mobile for thumb reachability.
- Large copy button for tracking reference code.

---

### Admin Portal

#### [MODIFY] [app/admin/layout.tsx](file:///c:/Users/LOQ/OneDrive/Desktop/FixSL/web/app/admin/layout.tsx)
- Add top padding for mobile viewports to prevent overlap with the mobile sidebar toggle button (`pt-16 lg:pt-0`).

#### [MODIFY] [components/admin/admin-sidebar.tsx](file:///c:/Users/LOQ/OneDrive/Desktop/FixSL/web/components/admin/admin-sidebar.tsx)
- Enhance mobile sidebar drawer with backdrop overlay, swipe/click to dismiss, and smooth animation.

#### [MODIFY] [components/admin/issues-table.tsx](file:///c:/Users/LOQ/OneDrive/Desktop/FixSL/web/components/admin/issues-table.tsx)
- Add responsive card view on mobile screens (`< md`) so administrators can manage issues on phones without awkward horizontal scrolling.
- Keep table view on tablets and desktops (`md:` and above).

#### [MODIFY] [components/admin/issue-filters.tsx](file:///c:/Users/LOQ/OneDrive/Desktop/FixSL/web/components/admin/issue-filters.tsx)
- Make filter dropdowns full width or flexible wrap on mobile screens.

#### [MODIFY] [components/admin/stats-cards.tsx](file:///c:/Users/LOQ/OneDrive/Desktop/FixSL/web/components/admin/stats-cards.tsx)
- Optimize card padding and typography for compact mobile screens.

---

## Verification Plan

### Automated Verification
- Run Next.js build: `npm run build` in `web/` to ensure zero TypeScript errors or syntax issues.
- Run Next.js linter: `npm run lint` in `web/`.

### Manual / Browser Verification
- Use `browser_subagent` to test the website at multiple mobile viewports:
  - Mobile Small (375 × 667 — iPhone SE)
  - Mobile Standard (390 × 844 — iPhone 12/13/14)
  - Mobile Large (414 × 896 — iPhone XR/Plus)
  - Tablet (768 × 1024 — iPad)
  - Desktop (1280 × 800)
- Verify that:
  - Navbar mobile drawer opens, shows all links, and closes on backdrop tap.
  - Emergency hotline numbers on footer trigger phone calls.
  - Hero section and landing page text scales without overflowing horizontally.
  - Interactive map opens full-screen on mobile with floating "Filter & Stats" button.
  - Report form category grid, map picker, and photo upload work smoothly on mobile.
  - Issue detail page badges, coordinates, and verification buttons are touch-friendly.
  - Admin dashboard and issues table display clean mobile cards on small screens.
