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
import { ISSUE_CATEGORIES, DEFAULT_MAP_CENTER } from "@/lib/constants";
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
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [latitude, setLatitude] = useState<number>(DEFAULT_MAP_CENTER[0]);
  const [longitude, setLongitude] = useState<number>(DEFAULT_MAP_CENTER[1]);
  const [locationName, setLocationName] = useState<string>("Colombo, Western Province");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
      <div className="clay-card p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
          <Layers className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-bold text-white tracking-tight">
            1. Select Hazard Category <span className="text-amber-400">*</span>
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
          {Object.entries(ISSUE_CATEGORIES).map(([key, config]) => {
            const Icon = CATEGORY_ICONS[key] || AlertOctagon;
            const isSelected = category === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => setCategory(key)}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 ${
                  isSelected
                    ? "border-amber-400 bg-amber-500/15 text-white shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/50"
                    : "border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:bg-slate-900/60"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isSelected
                      ? "bg-amber-400 text-slate-950 shadow-md"
                      : "bg-slate-900 text-slate-400 border border-slate-800"
                  }`}
                >
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm leading-tight text-white mb-1">
                    {config.label}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {config.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
        {errors.category && (
          <p className="text-xs text-red-400 mt-1">{errors.category}</p>
        )}
      </div>

      {/* 2. Issue Details (Title & Description) */}
      <div className="clay-card p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
          <FileText className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-bold text-white tracking-tight">
            2. Issue Details <span className="text-amber-400">*</span>
          </h3>
        </div>

        {/* Title Field */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-slate-200">
              Short Summary / Title <span className="text-amber-400">*</span>
            </label>
            <span
              className={`text-xs ${
                title.length > 100
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
            className={errors.title ? "border-red-500/60 focus-visible:ring-red-500" : ""}
          />
          {errors.title && (
            <p className="text-xs text-red-400">{errors.title}</p>
          )}
        </div>

        {/* Description Field */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-slate-200">
              Detailed Description <span className="text-amber-400">*</span>
            </label>
            <span
              className={`text-xs ${
                description.length > 1000
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
            className={errors.description ? "border-red-500/60 focus-visible:ring-red-500" : ""}
          />
          {errors.description && (
            <p className="text-xs text-red-400">{errors.description}</p>
          )}
        </div>
      </div>

      {/* 3. Geographic Location Pin */}
      <div className="clay-card p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
          <MapPin className="w-5 h-5 text-amber-400" />
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
      <div className="clay-card p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
          <Camera className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-bold text-white tracking-tight">
            4. Attach Photographic Proof (Optional)
          </h3>
        </div>

        <ImageUpload
          selectedFile={selectedFile}
          onImageChange={(file) => setSelectedFile(file)}
        />
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          disabled={isPending}
          variant="default"
          size="lg"
          className="w-full h-14 text-base font-bold gap-3 shadow-xl shadow-amber-500/25"
        >
          {isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Publishing Civic Report...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
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
