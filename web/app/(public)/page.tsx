import React from "react";
import { HeroSection } from "@/components/landing/hero-section";
import { StatsSection } from "@/components/landing/stats-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { TrackIssue } from "@/components/landing/track-issue";

export const revalidate = 60; // ISR cache revalidation every minute

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <StatsSection />
      <HowItWorks />
      <TrackIssue />
    </div>
  );
}
