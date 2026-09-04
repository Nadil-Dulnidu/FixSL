"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Copy,
  Check,
  Share2,
  MapPin,
  ArrowRight,
  PlusCircle,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CreateIssueResult } from "@/lib/actions/issues";

interface ReportSuccessProps {
  result: CreateIssueResult;
  onReset: () => void;
}

export function ReportSuccess({ result, onReset }: ReportSuccessProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.trackingId);
    setCopied(true);
    toast.success("Tracking code copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `FixSL Civic Report: ${result.trackingId}`,
          text: `I reported an issue on FixSL: "${result.title}". Track or verify it here:`,
          url: `${window.location.origin}/issues/${result.trackingNumber}`,
        })
        .catch(() => {});
    } else {
      handleCopy();
    }
  };

  return (
    <div className="clay-card p-8 sm:p-12 text-center max-w-2xl mx-auto border-emerald-500/30 shadow-2xl relative overflow-hidden">
      {/* Background Decorative Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />

      {/* Success Badge */}
      <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-center mx-auto mb-6 text-emerald-400 shadow-xl shadow-emerald-500/10">
        <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-500/20">
        <ShieldCheck className="w-3.5 h-3.5" />
        Report Successfully Published
      </div>

      <h2 className="text-3xl font-black text-white tracking-tight mb-2">
        Thank You, Citizen!
      </h2>
      <p className="text-slate-300 text-sm max-w-md mx-auto mb-8 leading-relaxed">
        Your hazard report for <strong className="text-white">&quot;{result.title}&quot;</strong> has been logged to the public civic registry.
      </p>

      {/* Prominent Tracking Card */}
      <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 max-w-md mx-auto mb-8 shadow-inner">
        <span className="text-xs font-mono uppercase tracking-widest text-slate-400 block mb-2">
          Your Official Tracking Code
        </span>
        <div className="flex items-center justify-center gap-3">
          <span className="text-3xl sm:text-4xl font-black font-mono text-amber-400 tracking-wider">
            {result.trackingId}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="p-2.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Copy Code"
          >
            {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Next Steps */}
      <div className="text-left bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 mb-8 text-xs space-y-3">
        <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
          What Happens Next?
        </h4>
        <div className="flex items-start gap-2.5 text-slate-400">
          <div className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
            1
          </div>
          <p>
            Nearby community members will be alerted to verify and upvote this issue.
          </p>
        </div>
        <div className="flex items-start gap-2.5 text-slate-400">
          <div className="w-5 h-5 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
            2
          </div>
          <p>
            Municipal authorities and road engineers will review the hazard for repair scheduling.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
        <Link href={`/issues/${result.trackingNumber}`} className="w-full sm:w-auto flex-1">
          <Button variant="default" size="lg" className="w-full gap-2 font-bold">
            <span>View Issue Status</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>

        <Button
          onClick={handleShare}
          variant="outline"
          size="lg"
          className="w-full sm:w-auto gap-2 border-slate-700 hover:bg-slate-800"
        >
          <Share2 className="w-4 h-4 text-amber-400" />
          <span>Share</span>
        </Button>

        <Button
          onClick={onReset}
          variant="ghost"
          size="lg"
          className="w-full sm:w-auto gap-2 text-slate-400 hover:text-white"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report Another</span>
        </Button>
      </div>
    </div>
  );
}
