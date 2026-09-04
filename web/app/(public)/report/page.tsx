import React from "react";
import { ReportForm } from "@/components/report/report-form";
import { PlusCircle, ShieldAlert, CheckCircle } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Report an Infrastructure Issue | FixSL",
  description:
    "Report road craters, broken streetlights, water pipeline bursts, or garbage pileups in Sri Lanka.",
};

export default function ReportPage() {
  return (
    <div className="py-6 sm:py-10 md:py-16">
      <div className="max-w-4xl mx-auto px-3.5 sm:px-6 lg:px-8">
        {/* Header Breadcrumb / Title */}
        <div className="mb-6 sm:mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold uppercase tracking-wider mb-2.5 sm:mb-3">
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Citizen Civic Action</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight break-words">
            Report a Public Road or Utility Hazard
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm md:text-base mt-2 max-w-2xl leading-relaxed">
            Fill in the details below. Once published, your report will be given a public tracking reference and pinned to the Sri Lankan community map.
          </p>
        </div>

        {/* Guidance Alert Card */}
        <div className="mb-6 sm:mb-8 p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="text-amber-300 font-bold block text-sm">
              Civic Reporting Guidelines:
            </strong>
            <p className="leading-relaxed text-xs">
              Ensure you pinpoint the exact GPS location on the map. Clear daylight photos significantly increase repair turnaround by municipal authorities (CMC, RDA, CEB, NWSDB).
            </p>
          </div>
        </div>

        {/* The Main Report Form */}
        <ReportForm />
      </div>
    </div>
  );
}
