"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Bot,
  Loader2,
  Check,
  AlertCircle,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  Info,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface AIAnalysisData {
  category: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  priority: "Low" | "Medium" | "High" | "Urgent";
  confidence: number;
  reason: string;
  suggestedCategory: string;
  suggestedPriority: "low" | "medium" | "high" | "critical";
}

interface AIAnalysisCardProps {
  title: string;
  description: string;
  selectedFile: File | null;
  onApply: (suggestion: { category: string; priority: string }) => void;
  applied: boolean;
}

export function AIAnalysisCard({
  title,
  description,
  selectedFile,
  onApply,
  applied,
}: AIAnalysisCardProps) {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canAnalyze = title.trim().length >= 3 && description.trim().length >= 10;

  // Helper to convert selected local file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const handleAnalyze = async () => {
    if (!canAnalyze) {
      toast.error("Please provide at least a title and a brief description first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let imageBase64: string | null = null;
      let imageMimeType: string | null = null;

      if (selectedFile) {
        try {
          imageBase64 = await fileToBase64(selectedFile);
          imageMimeType = selectedFile.type;
        } catch {
          // If image conversion fails, fall back to text-only analysis
        }
      }

      const res = await fetch("/api/analyze-issue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          imageBase64,
          imageMimeType,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(
          json.error ||
            "AI analysis is temporarily unavailable. You can continue submitting the report manually."
        );
      }

      setAnalysis(json.data);
      toast.success("AI analysis completed!");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "AI analysis is temporarily unavailable. You can continue submitting the report manually.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!analysis) return;
    onApply({
      category: analysis.suggestedCategory,
      priority: analysis.suggestedPriority,
    });
    toast.success("Applied AI recommendations to your report!");
  };

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "high":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "medium":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    }
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "urgent":
      case "critical":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "high":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "medium":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    }
  };

  return (
    <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-slate-900/90 to-slate-950 p-5 sm:p-6 shadow-xl relative overflow-hidden backdrop-blur-md">
      {/* Background ambient gradient glow */}
      <div className="absolute -top-16 -right-16 w-36 h-36 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm shadow-amber-500/20">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              Gemini 3.6 AI Smart Assistant
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Advisory
              </span>
            </h4>
            <p className="text-xs text-slate-400">
              Auto-detect hazard category, urgency, and severity from your description
            </p>
          </div>
        </div>

        {/* Trigger Button */}
        {!analysis && !loading && (
          <Button
            type="button"
            onClick={handleAnalyze}
            disabled={!canAnalyze}
            variant="outline"
            size="sm"
            className={`gap-2 rounded-xl text-xs font-bold transition-all ${
              canAnalyze
                ? "border-amber-500/40 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 hover:text-white shadow-md shadow-amber-500/10"
                : "border-white/5 bg-slate-900 text-slate-500 cursor-not-allowed"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Analyze with AI</span>
          </Button>
        )}
      </div>

      {/* Helper text when cannot analyze yet */}
      {!analysis && !loading && !canAnalyze && (
        <div className="pt-3 flex items-center gap-2 text-xs text-slate-500">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>Type a title and brief description above to enable AI classification.</span>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="py-6 flex flex-col items-center justify-center gap-3 text-center animate-in fade-in duration-300">
          <div className="w-10 h-10 rounded-full border-2 border-amber-500/30 border-t-amber-400 animate-spin" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-white">Analyzing issue with Gemini 3.6 AI...</p>
            <p className="text-xs text-slate-400">
              Evaluating hazard context, public safety risk, and priority
              {selectedFile ? " including your attached photo" : ""}
            </p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="mt-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 flex items-start justify-between gap-3 animate-in fade-in">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-slate-400 hover:text-white shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Result Card */}
      {analysis && !loading && (
        <div className="pt-4 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
              AI Recommendation
            </span>
            <span className="text-xs font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
              {Math.round(analysis.confidence * 100)}% Confidence
            </span>
          </div>

          {/* Metric Badges Grid */}
          <div className="grid grid-cols-3 gap-2.5">
            {/* Category */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
              <span className="text-[11px] text-slate-400 uppercase font-medium">Category</span>
              <p className="text-sm font-bold text-white truncate">{analysis.category}</p>
            </div>

            {/* Severity */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
              <span className="text-[11px] text-slate-400 uppercase font-medium">Severity</span>
              <p>
                <span
                  className={`inline-block px-2 py-0.5 rounded-md text-xs font-bold border ${getSeverityBadgeClass(
                    analysis.severity
                  )}`}
                >
                  {analysis.severity}
                </span>
              </p>
            </div>

            {/* Priority */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
              <span className="text-[11px] text-slate-400 uppercase font-medium">Priority</span>
              <p>
                <span
                  className={`inline-block px-2 py-0.5 rounded-md text-xs font-bold border ${getPriorityBadgeClass(
                    analysis.priority
                  )}`}
                >
                  {analysis.priority}
                </span>
              </p>
            </div>
          </div>

          {/* Reasoning Quote */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 text-xs text-slate-300 leading-relaxed italic">
            &ldquo;{analysis.reason}&rdquo;
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <p className="text-[11px] text-slate-400">
              Applying populates the category and priority fields. You can still edit them anytime.
            </p>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                type="button"
                onClick={handleAnalyze}
                variant="ghost"
                size="sm"
                className="text-xs text-slate-400 hover:text-white rounded-xl h-9"
              >
                Re-analyze
              </Button>

              <Button
                type="button"
                onClick={handleApply}
                variant="default"
                size="sm"
                className={`gap-1.5 rounded-xl text-xs font-bold h-9 shadow-md transition-all ${
                  applied
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20"
                    : "bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-amber-500/20"
                }`}
              >
                {applied ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Suggestions Applied</span>
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Apply Suggestions</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
