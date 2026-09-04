import React from "react";
import Link from "next/link";
import { PlusCircle, MapPin, ShieldCheck, ArrowRight, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-2xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Civic Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 backdrop-blur-md mb-8">
          <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping" />
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            🇱🇰 Citizen-Powered Civic Action Platform
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
          Report Hazards.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500">
            Fix Sri Lanka&apos;s
          </span>{" "}
          Infrastructure.
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          From dangerous potholes and broken streetlights to flooded drains and overflowing waste. Drop a pin, snap a photo, and join thousands of citizens holding municipal authorities accountable.
        </p>

        {/* Call to Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <Link href="/report" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="default"
              className="w-full sm:w-auto gap-2.5 text-base font-bold shadow-amber-500/30 h-14 px-8"
            >
              <PlusCircle className="w-5 h-5 stroke-[2.5]" />
              Report an Issue
            </Button>
          </Link>

          <Link href="/map" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto gap-2.5 text-base font-semibold border-slate-700 hover:bg-slate-800/80 h-14 px-8"
            >
              <MapPin className="w-5 h-5 text-amber-400" />
              Explore Live Map
            </Button>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="mt-14 pt-8 border-t border-slate-800/60 max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-6 text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase">100% Anonymous</p>
              <p className="text-xs text-slate-400">No account required to report</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase">Precise GPS</p>
              <p className="text-xs text-slate-400">Exact coordinates & landmarks</p>
            </div>
          </div>

          <div className="flex items-center gap-3 col-span-2 sm:col-span-1 justify-center sm:justify-start">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase">Public Tracking</p>
              <p className="text-xs text-slate-400">Real-time status updates</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
