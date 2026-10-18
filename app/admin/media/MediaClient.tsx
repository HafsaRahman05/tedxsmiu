"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Trash2, X, Upload, Calendar, Image as ImageIcon, Video, FolderOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MediaItem {
  id: string;
  type: "IMAGE" | "VIDEO";
  url: string;
  altText: string | null;
  eventId: string | null;
  albumName: string | null;
  createdAt: string | Date;
}

interface Event {
  id: string;
  title: string;
}

interface MediaClientProps {
  initialMedia: MediaItem[];
  events: Event[];
}

const HOMEPAGE_GALLERY_CATEGORIES = [
  "Main stage moments",
  "Audience energy",
  "Speakers & talks",
  "Community highlights",
] as const;

export default function MediaClient({ initialMedia, events }: MediaClientProps) {
  const router = useRouter();
  const [mediaList, setMediaList] = useState<MediaItem[]>(initialMedia);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isModalOpen]);

  // Form fields
  const [type, setType] = useState<"IMAGE" | "VIDEO">("IMAGE");
  const [url, setUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [eventId, setEventId] = useState("");
  const [albumPreset, setAlbumPreset] = useState<string>(HOMEPAGE_GALLERY_CATEGORIES[0]);
  const [customAlbum, setCustomAlbum] = useState("");

  const [isUploading, setIsUploading] = useState(false);

  const openCreateModal = () => {
    setType("IMAGE");
    setUrl("");
    setAltText("");
    setEventId(events[0]?.id || "");
    setAlbumPreset(HOMEPAGE_GALLERY_CATEGORIES[0]);
    setCustomAlbum("");
    setIsModalOpen(true);
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setUrl(data.url);
        toast.success("Media file uploaded successfully");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url) {
      toast.error("Please upload a file or enter a URL");
      return;
    }

    const resolvedAlbum = albumPreset === "CUSTOM" ? customAlbum.trim() : albumPreset;

    const payload = {
      type,
      url,
      altText: altText || null,
      eventId: eventId || null,
      albumName: resolvedAlbum || null,
    };

    try {
      const res = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to register media asset");
      }

      const savedData = await res.json();

      setMediaList([savedData, ...mediaList]);
      toast.success("Media asset saved successfully");

      setIsModalOpen(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media asset?")) return;

    try {
      const res = await fetch(`/api/media/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      setMediaList(mediaList.filter((m) => m.id !== id));
      toast.success("Media asset deleted");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Could not delete");
    }
  };

  const getEventTitle = (id: string | null) => {
    if (!id) return null;
    return events.find((e) => e.id === id)?.title;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="mt-2 font-display text-4xl font-black uppercase text-foreground">
            Media Library
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload images/videos, organize albums, and tag gallery media to event editions.
          </p>
        </div>
        <Button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-none px-5 py-5 font-mono text-xs font-bold uppercase tracking-[0.15em]"
        >
          <Plus className="h-4 w-4" />
          Add Asset
        </Button>
      </div>

      {/* Media Grid */}
      {mediaList.length === 0 ? (
        <div className="rounded-none border border-border bg-card p-12 text-center text-sm text-muted-foreground font-mono">
          No media assets uploaded yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {mediaList.map((item) => (
            <div
              key={item.id}
              className="group relative border border-border bg-card overflow-hidden flex flex-col justify-between"
            >
              {/* Preview container */}
              <div className="relative aspect-video border-b border-border bg-secondary flex items-center justify-center overflow-hidden">
                {item.type === "IMAGE" ? (
                  <Image
                    src={item.url}
                    alt={item.altText || "Gallery Image"}
                    fill
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  />
                ) : (
                  <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
                    <video
                      src={item.url}
                      className="w-full h-full object-cover opacity-80"
                      muted
                      playsInline
                      preload="metadata"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors pointer-events-none">
                      <span className="h-9 w-9 rounded-full bg-primary/90 flex items-center justify-center text-white shadow-lg">
                        <Video className="h-4 w-4 ml-0.5" />
                      </span>
                    </div>
                  </div>
                )}
                {/* Delete button overlay */}
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => handleDelete(item.id)}
                  className="absolute right-2 top-2 rounded-none opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                  title="Delete Asset"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>

              {/* Asset Info */}
              <div className="p-4 space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-muted-foreground uppercase">
                    {item.type === "IMAGE" ? (
                      <ImageIcon className="h-3.5 w-3.5 text-primary" />
                    ) : (
                      <Video className="h-3.5 w-3.5 text-primary" />
                    )}
                    <span>{item.type}</span>
                  </div>
                  {item.altText && (
                    <p className="text-xs text-foreground line-clamp-1 italic">
                      "{item.altText}"
                    </p>
                  )}
                </div>

                {/* Event or Album relation tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.eventId && (
                    <span className="rounded-none bg-secondary border border-border px-2 py-0.5 font-mono text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                      <Calendar className="h-2.5 w-2.5 text-primary" />
                      {getEventTitle(item.eventId)}
                    </span>
                  )}
                  {item.albumName && (
                    <span className="rounded-none bg-secondary border border-border px-2 py-0.5 font-mono text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                      <FolderOpen className="h-2.5 w-2.5 text-primary" />
                      {item.albumName}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-background/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg border border-border bg-card p-6 space-y-6 my-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="font-display text-xl font-black uppercase text-foreground">
                Add Media Asset
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type */}
              <div className="space-y-2">
                <Label className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Media Type
                </Label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="flex h-10 w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="IMAGE">IMAGE</option>
                  <option value="VIDEO">VIDEO</option>
                </select>
              </div>

              {/* Upload field */}
              <div className="space-y-2">
                <Label className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Media File URL
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://..."
                    className="rounded-none border-border bg-background focus-visible:ring-primary flex-1"
                  />
                  <label className="border border-border bg-secondary hover:border-primary p-3 flex items-center justify-center cursor-pointer transition-colors w-10">
                    {isUploading ? (
                      <span className="w-4 h-4 border border-muted-foreground border-t-foreground rounded-full animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4 text-muted-foreground" />
                    )}
                    <input
                      type="file"
                      accept={type === "IMAGE" ? "image/*" : "video/*"}
                      onChange={handleMediaUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                </div>
              </div>

              {/* Alt Text */}
              <div className="space-y-2">
                <Label className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Alt Text / Description (Optional)
                </Label>
                <Input
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="e.g. Speakers panel on SMIU Main Stage"
                  className="rounded-none border-border bg-background focus-visible:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Event Link */}
                <div className="space-y-2">
                  <Label className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Associate with Event
                  </Label>
                  <select
                    value={eventId}
                    onChange={(e) => setEventId(e.target.value)}
                    className="flex h-10 w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">None</option>
                    {events.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Album Category */}
                <div className="space-y-2">
                  <Label className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Gallery Category / Album
                  </Label>
                  <select
                    value={albumPreset}
                    onChange={(e) => setAlbumPreset(e.target.value)}
                    className="flex h-10 w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary font-mono text-xs"
                  >
                    {HOMEPAGE_GALLERY_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat} (Homepage)
                      </option>
                    ))}
                    <option value="CUSTOM">Custom Album Name...</option>
                  </select>
                  {albumPreset === "CUSTOM" && (
                    <Input
                      type="text"
                      value={customAlbum}
                      onChange={(e) => setCustomAlbum(e.target.value)}
                      placeholder="Enter custom album name"
                      className="rounded-none border-border bg-background focus-visible:ring-primary text-xs mt-2"
                    />
                  )}
                  <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                    Connects directly to the homepage gallery and event media reels.
                  </p>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-none border-border font-mono text-xs uppercase tracking-wider"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="rounded-none font-mono text-xs uppercase tracking-wider"
                >
                  Save Asset
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
