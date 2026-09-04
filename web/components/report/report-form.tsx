"use client";

import React, { useState, useTransition } from "react";
import {
  AlertOctagon,
  Construction,
  LightbulbOff,
  Trash2,
  Waves,
  HelpCircle,
  MapPin,
  Send,
  Loader2,
  FileText,
  Camera,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { LocationPicker } from "@/components/report/location-picker";
import { ImageUpload } from "@/components/report/image-upload";
import { ReportSuccess } from "@/components/report/report-success";
import { AIAnalysisCard } from "@/components/report/ai-analysis-card";
import { ISSUE_CATEGORIES, ISSUE_PRIORITIES, DEFAULT_MAP_CENTER } from "@/lib/constants";
import { createIssue, CreateIssueResult } from "@/lib/actions/issues";
import { toast } from "sonner";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  pothole: AlertOctagon,
  road_damage: Construction,
  broken_streetlight: LightbulbOff,
  garbage: Trash2,
  blocked_drain: Waves,
  other: HelpCircle,
};

export function ReportForm() {
  const [isPending, startTransition] = useTransition();
  const [successResult, setSuccessResult] = useState<CreateIssueResult | null>(null);

  // Form State
  const [category, setCategory] = useState<string>("pothole");
  const [priority, setPriority] = useState<string>("medium");
  const [aiApplied, setAiApplied] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [latitude, setLatitude] = useState<number>(DEFAULT_MAP_CENTER[0]);
  const [longitude, setLongitude] = useState<number>(DEFAULT_MAP_CENTER[1]);
  const [locationName, setLocationName] = useState<string>("Colombo, Western Province");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleApplyAI = (suggestion: { category: string; priority: string }) => {
    if (suggestion.category && ISSUE_CATEGORIES[suggestion.category]) {
      setCategory(suggestion.category);
    }
    if (suggestion.priority && ISSUE_PRIORITIES[suggestion.priority]) {
      setPriority(suggestion.priority);
    }
    setAiApplied(true);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.category;
      return next;
    });
  };

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleLocationChange = (lat: number, lng: number, name?: string) => {
    setLatitude(lat);
    setLongitude(lng);
    if (name) {
      setLocationName(name);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!category) {
      newErrors.category = "Please select an issue category";
    }
    if (!title.trim() || title.trim().length < 5) {
      newErrors.title = "Title must be at least 5 characters long";
    } else if (title.length > 100) {
      newErrors.title = "Title cannot exceed 100 characters";
    }

    if (!description.trim() || description.trim().length < 20) {
      newErrors.description = "Please describe the hazard in at least 20 characters";
    } else if (description.length > 1000) {
      newErrors.description = "Description cannot exceed 1000 characters";
    }

    if (isNaN(latitude) || isNaN(longitude)) {
      newErrors.location = "Please select a valid point on the map";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append("category", category);
      formData.append("priority", priority);
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("latitude", latitude.toString());
      formData.append("longitude", longitude.toString());
      formData.append("location_name", locationName.trim());

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const response = await createIssue(formData);

      if (response.success && response.data) {
        setSuccessResult(response.data);
        toast.success("Civic report published successfully!");
      } else {
        toast.error(response.error || "Failed to submit report. Please try again.");
      }
    });
  };

  const handleReset = () => {
    setSuccessResult(null);
    setCategory("pothole");
    setPriority("medium");
    setAiApplied(false);
    setTitle("");
    setDescription("");
    setSelectedFile(null);
    setErrors({});
  };

  if (successResult) {
    return <ReportSuccess result={successResult} onReset={handleReset} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 1. Category Selection */}
      <div className="clay-card p-6 sm:p-8 space-y-5 border-white/5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
          <h3 className="text-lg font-bold text-white tracking-tight">
            1. Select Hazard Category <span className="text-amber-400">*</span>
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3.5 pt-1">
          {Object.entries(ISSUE_CATEGORIES).map(([key, config]) => {
            const Icon = CATEGORY_ICONS[key] || AlertOctagon;
            const isSelected = category === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => setCategory(key)}
                className={`p-3 sm:p-4 rounded-2xl text-left transition-all duration-200 flex flex-col justify-between gap-2.5 sm:gap-3 cursor-pointer touch-manipulation active:scale-[0.98] ${isSelected
                  ? "clay-card bg-amber-500/15 border-amber-400/60 shadow-lg shadow-amber-500/15 ring-2 ring-amber-400/40 translate-y-[-2px]"
                  : "clay-inset hover:border-white/15 hover:bg-slate-900/60"
                  }`}
              >
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center transition-transform shrink-0 ${isSelected
                    ? "clay-btn-primary text-slate-950 scale-105"
                    : "bg-slate-900 text-slate-400 border border-white/5 clay-icon-well"
                    }`}
                >
                  <Icon className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm leading-tight text-white mb-1">
                    {config.label}
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {config.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
        {errors.category && (
          <p className="text-xs text-red-400 mt-1 font-medium">{errors.category}</p>
        )}

        {/* Priority Selector */}
        <div className="pt-4 border-t border-white/5 space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">
              Severity / Action Priority
            </label>
            <span className="text-[11px] text-slate-500">
              Auto-selected when using AI analysis below
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.entries(ISSUE_PRIORITIES).map(([key, config]) => {
              const isSelected = priority === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setPriority(key);
                    setAiApplied(false);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border text-center cursor-pointer ${
                    isSelected
                      ? `${config.badgeClass} ring-2 ring-amber-400/40 shadow-sm font-black`
                      : "bg-slate-900/60 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/15"
                  }`}
                >
                  {config.label} Priority
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Issue Details (Title & Description) */}
      <div className="clay-card p-6 sm:p-8 space-y-6 border-white/5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
          <h3 className="text-lg font-bold text-white tracking-tight">
            2. Issue Details <span className="text-amber-400">*</span>
          </h3>
        </div>

        {/* Title Field */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs sm:text-sm font-semibold text-slate-200">
              Short Summary / Title <span className="text-amber-400">*</span>
            </label>
            <span
              className={`text-xs font-mono font-medium ${title.length > 100
                ? "text-red-400 font-bold"
                : title.length >= 5
                  ? "text-emerald-400"
                  : "text-slate-500"
                }`}
            >
              {title.length}/100
            </span>
          </div>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Deep crater pothole near Colombo Fort railway station"
            className={errors.title ? "border-red-500/60 focus:ring-red-500" : ""}
          />
          {errors.title && (
            <p className="text-xs text-red-400 font-medium">{errors.title}</p>
          )}
        </div>

        {/* Description Field */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs sm:text-sm font-semibold text-slate-200">
              Detailed Description <span className="text-amber-400">*</span>
            </label>
            <span
              className={`text-xs font-mono font-medium ${description.length > 1000
                ? "text-red-400 font-bold"
                : description.length >= 20
                  ? "text-emerald-400"
                  : "text-slate-500"
                }`}
            >
              {description.length}/1000 (min 20)
            </span>
          </div>
          <Textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide context, size of the hazard, traffic hazards, nearest landmark, or danger to pedestrians..."
            className={errors.description ? "border-red-500/60 focus:ring-red-500" : ""}
          />
          {errors.description && (
            <p className="text-xs text-red-400 font-medium">{errors.description}</p>
          )}
        </div>
      </div>

      {/* 3. Geographic Location Pin */}
      <div className="clay-card p-6 sm:p-8 space-y-4 border-white/5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
          <h3 className="text-lg font-bold text-white tracking-tight">
            3. Pinpoint Location on Map <span className="text-amber-400">*</span>
          </h3>
        </div>

        <LocationPicker
          latitude={latitude}
          longitude={longitude}
          onLocationChange={handleLocationChange}
        />

        {/* Address name text input */}
        <div className="space-y-1.5 pt-2">
          <label className="text-xs font-semibold text-slate-300">
            Location Name / Landmark Description
          </label>
          <Input
            type="text"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            placeholder="e.g. Olcott Mawatha, Colombo Fort (Near bus turnoff)"
            className="text-xs sm:text-sm"
          />
        </div>
      </div>

      {/* 4. Photo Upload */}
      <div className="clay-card p-6 sm:p-8 space-y-4 border-white/5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
          <h3 className="text-lg font-bold text-white tracking-tight">
            4. Attach Photographic Proof (Optional)
          </h3>
        </div>

        <ImageUpload
          selectedFile={selectedFile}
          onImageChange={(file) => {
            setSelectedFile(file);
            setAiApplied(false);
          }}
        />
      </div>

      {/* 5. AI Smart Analysis Card */}
      <AIAnalysisCard
        title={title}
        description={description}
        selectedFile={selectedFile}
        onApply={handleApplyAI}
        applied={aiApplied}
      />

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          disabled={isPending}
          variant="default"
          size="lg"
          className="w-full h-14 text-base font-bold gap-3 shadow-xl shadow-amber-500/25 rounded-2xl"
        >
          {isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Publishing Civic Report...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5 stroke-[2.5]" />
              <span>Publish Public Report</span>
            </>
          )}
        </Button>
        <p className="text-center text-xs text-slate-500 mt-3">
          Reports are public, anonymous, and reviewed by Sri Lankan civic community members.
        </p>
      </div>
    </form>
  );
}

