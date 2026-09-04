import React from "react";
import Link from "next/link";
import { PlusCircle, MapPin, ShieldCheck, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-24 md:pt-20 md:pb-28">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[550px] lg:w-[650px] h-[250px] sm:h-[350px] bg-amber-500/12 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-48 sm:w-80 h-48 sm:h-80 bg-blue-500/8 rounded-full blur-[70px] sm:blur-[90px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.15] sm:leading-[1.1] max-w-4xl mx-auto break-words">
          Report Hazards.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500">
            Fix Sri Lanka&apos;s
          </span>{" "}
          Infrastructure.
        </h1>

        {/* Subtitle */}
        <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal px-2 sm:px-0">
          From dangerous potholes and broken streetlights to flooded drains and overflowing waste. Drop a pin, snap a photo, and join thousands of citizens holding municipal authorities accountable.
        </p>

        {/* Call to Actions */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 max-w-md mx-auto w-full px-2 sm:px-0">
          <Link href="/report" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="default"
              className="w-full sm:w-auto gap-2.5 text-base font-bold shadow-amber-500/30 h-13 sm:h-14 px-7 min-h-[48px]"
            >
              <PlusCircle className="w-5 h-5 stroke-[2.5]" />
              <span>Report an Issue</span>
            </Button>
          </Link>

          <Link href="/map" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="secondary"
              className="w-full sm:w-auto gap-2.5 text-base font-semibold h-13 sm:h-14 px-7 min-h-[48px]"
            >
              <MapPin className="w-5 h-5 text-amber-400" />
              <span>Explore Live Map</span>
            </Button>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 sm:mt-16 max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 text-left">
          <div className="clay-card p-4 sm:p-4.5 flex items-center gap-3.5 border-white/5">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-400 shrink-0 clay-icon-well">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">100% Anonymous</p>
              <p className="text-xs text-slate-400 mt-0.5">No account required to report</p>
            </div>
          </div>

          <div className="clay-card p-4 sm:p-4.5 flex items-center gap-3.5 border-white/5">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center text-blue-400 shrink-0 clay-icon-well">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">Precise GPS</p>
              <p className="text-xs text-slate-400 mt-0.5">Exact coordinates & landmarks</p>
            </div>
          </div>

          <div className="clay-card p-4 sm:p-4.5 flex items-center gap-3.5 border-white/5">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0 clay-icon-well">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">Public Tracking</p>
              <p className="text-xs text-slate-400 mt-0.5">Real-time status updates</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

