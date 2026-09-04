"use client";

import React, { useRef, useState } from "react";
import { Camera, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ImageUploadProps {
  onImageChange: (file: File | null) => void;
  selectedFile: File | null;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

export function ImageUpload({ onImageChange, selectedFile }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Invalid format. Please upload a JPEG, PNG, or WebP photo.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Photo size exceeds 5MB limit. Please choose a smaller image.");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onImageChange(file);
    toast.success("Photo attached successfully");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {previewUrl ? (
        <div className="relative rounded-2xl overflow-hidden border border-amber-500/30 bg-slate-950 p-2 group shadow-xl clay-card">
          <div className="relative h-60 w-full rounded-xl overflow-hidden bg-slate-900">
            {/* Image Preview */}
            <img
              src={previewUrl}
              alt="Issue Preview"
              className="w-full h-full object-cover rounded-xl"
            />

            {/* Remove button */}
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-3 right-3 p-2 rounded-xl bg-slate-950/85 hover:bg-red-500 text-white border border-white/10 transition-colors shadow-lg cursor-pointer active:scale-95"
              title="Remove photo"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-white/10 text-[11px] font-bold text-amber-400 flex items-center gap-1.5 clay-pill">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Photo Attached ({selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : ""})
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`cursor-pointer rounded-2xl border-2 border-dashed p-7 text-center transition-all flex flex-col items-center justify-center gap-3.5 ${
            isDragging
              ? "border-amber-400 bg-amber-500/10 scale-[0.99]"
              : "border-white/10 clay-inset hover:border-amber-500/40 hover:bg-slate-900/50"
          }`}
        >
          <div className="w-13 h-13 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 clay-icon-well">
            <Camera className="w-6 h-6 stroke-[2.2]" />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-bold text-white">
              Snap a photo or drag & drop here
            </p>
            <p className="text-xs text-slate-400">
              Supports JPEG, PNG, WebP up to 5MB
            </p>
          </div>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="text-xs rounded-xl pointer-events-none font-semibold px-4"
          >
            Browse Files
          </Button>
        </div>
      )}
    </div>
  );
}

