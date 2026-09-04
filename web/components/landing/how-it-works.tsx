import React from "react";
import { Camera, CheckCircle2, Wrench, ThumbsUp } from "lucide-react";

const STEPS = [
  {
    step: "01",
    title: "Snap & Drop Pin",
    description:
      "Pinpoint the hazard on the interactive map, select the category, and upload a quick photo from your phone or desktop.",
    icon: Camera,
    color: "amber",
  },
  {
    step: "02",
    title: "Community Verification",
    description:
      "Nearby citizens verify that the issue is real and still exists, increasing priority for rapid municipal escalation.",
    icon: CheckCircle2,
    color: "blue",
  },
  {
    step: "03",
    title: "Authority Action",
    description:
      "Municipal road crews and repair teams are dispatched. Status updates from 'Reported' to 'In Progress'.",
    icon: Wrench,
    color: "purple",
  },
  {
    step: "04",
    title: "Citizen Confirmed",
    description:
      "Once marked resolved, citizens in the area confirm whether the repair actually holds or dispute substandard work.",
    icon: ThumbsUp,
    color: "emerald",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-[#060911]/80 border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            Lifecycle Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-3 tracking-tight">
            How FixSL Fixes Sri Lanka
          </h2>
          <p className="text-slate-400 text-sm mt-3 leading-relaxed">
            A transparent 4-stage civic lifecycle designed to turn citizen reports into verified, completed infrastructure fixes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((stepItem, idx) => {
            const Icon = stepItem.icon;
            return (
              <div
                key={stepItem.step}
                className="clay-card clay-card-hover p-6 sm:p-7 flex flex-col justify-between relative group"
              >
                {/* Step number indicator */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black font-mono text-slate-700/80 group-hover:text-amber-500/40 transition-colors">
                    {stepItem.step}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                    {stepItem.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {stepItem.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <span>Stage {idx + 1} of 4</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
