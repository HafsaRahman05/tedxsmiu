"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Upload, Crop, Sparkles, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ImageCropPreviewProps {
  imageUrl: string;
  onChange: (url: string) => void;
  aspectRatioLabel?: string;
}

export default function ImageCropPreview({
  imageUrl,
  onChange,
  aspectRatioLabel = "16:9 HD Cover Ratio",
}: ImageCropPreviewProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [objectPosition, setObjectPosition] = useState<"center" | "top" | "bottom">("center");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();

      if (data.url) {
        onChange(data.url);
        toast.success("Cover image uploaded and styled to 16:9");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
          Cover Image ({aspectRatioLabel})
        </Label>
        <span className="inline-flex items-center gap-1 font-mono text-[9px] font-bold uppercase tracking-wider text-primary border border-primary/20 bg-primary/5 px-2 py-0.5">
          <Crop className="h-3 w-3" /> Auto 16:9 Cropped
        </span>
      </div>

      {/* 16:9 Aspect Ratio Frame Container */}
      <div className="relative aspect-[16/9] w-full border-2 border-dashed border-border bg-card overflow-hidden group">
        {imageUrl ? (
          <>
            <Image
              src={imageUrl}
              alt="Event Cover Preview"
              fill
              className={`object-cover transition-all duration-300 ${
                objectPosition === "top" ? "object-top" : objectPosition === "bottom" ? "object-bottom" : "object-center"
              }`}
            />

            {/* Position Adjustment Overlay Controls */}
            <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-background/90 backdrop-blur-md p-1 border border-border">
              <span className="font-mono text-[9px] font-bold uppercase px-1 text-muted-foreground">Focus:</span>
              {(["top", "center", "bottom"] as const).map((pos) => (
                <button
                  key={pos}
                  type="button"
                  onClick={() => setObjectPosition(pos)}
                  className={`px-2 py-0.5 font-mono text-[9px] font-bold uppercase transition-colors ${
                    objectPosition === pos
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>

            {/* Visual Aspect Ratio Grid Overlay */}
            <div className="absolute inset-0 border border-primary/30 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute top-2 left-2 font-mono text-[9px] font-bold uppercase bg-background/90 text-primary px-2 py-0.5 border border-primary/30">
                16:9 Active Frame
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <Sparkles className="h-8 w-8 text-muted-foreground/40 mb-2" />
            <p className="font-mono text-xs text-muted-foreground">
              No cover image selected. Upload or paste a URL below.
            </p>
            <p className="font-mono text-[10px] text-muted-foreground/60 mt-1">
              Image will automatically crop to 16:9 ratio
            </p>
          </div>
        )}
      </div>

      {/* URL Input & Upload trigger */}
      <div className="flex gap-2">
        <Input
          type="url"
          placeholder="https://images.unsplash.com/photo-..."
          value={imageUrl}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-none border-border bg-background focus-visible:ring-primary flex-1 text-xs"
        />
        <label className="border border-border bg-secondary hover:border-primary px-3 flex items-center justify-center cursor-pointer transition-colors shrink-0">
          {isUploading ? (
            <span className="w-4 h-4 border border-muted-foreground border-t-foreground rounded-full animate-spin" />
          ) : (
            <span className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
              <Upload className="h-3.5 w-3.5 text-muted-foreground" /> Upload
            </span>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isUploading}
          />
        </label>
      </div>
    </div>
  );
}
