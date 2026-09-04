"use client";

import React, { useRef, useState } from "react";
import { Camera, UploadCloud, X, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";

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
        <div className="relative rounded-2xl overflow-hidden border border-amber-500/30 bg-slate-950 p-2 group shadow-xl">
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
              className="absolute top-3 right-3 p-2 rounded-xl bg-slate-950/80 hover:bg-red-500 text-white border border-slate-700 transition-colors shadow-lg"
              title="Remove photo"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[11px] font-medium text-amber-400 flex items-center gap-1.5">
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
          className={`cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition-all flex flex-col items-center justify-center gap-3 ${
            isDragging
              ? "border-amber-400 bg-amber-500/10 scale-[0.99]"
              : "border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-900/40"
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 shadow-inner">
            <Camera className="w-6 h-6 text-amber-400" />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-semibold text-white">
              Snap a photo or drag & drop here
            </p>
            <p className="text-xs text-slate-500">
              Supports JPEG, PNG, WebP up to 5MB
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs rounded-xl border-slate-700 pointer-events-none"
          >
            Browse Files
          </Button>
        </div>
      )}
    </div>
  );
}
