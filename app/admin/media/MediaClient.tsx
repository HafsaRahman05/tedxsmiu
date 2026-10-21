"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Trash2, X, Upload, Calendar, Image as ImageIcon, Video, FolderOpen, Pencil } from "lucide-react";
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
  year: number | null;
  createdAt: string | Date;
}

interface UploadedAsset {
  name: string;
  url: string;
}

interface Event {
  id: string;
  title: string;
  date: string | Date;
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
  const [editingMediaId, setEditingMediaId] = useState<string | null>(null);

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
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [albumPreset, setAlbumPreset] = useState<string>(HOMEPAGE_GALLERY_CATEGORIES[0]);
  const [customAlbum, setCustomAlbum] = useState("");

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedAsset[]>([]);

  const openCreateModal = () => {
    setEditingMediaId(null);
    setType("IMAGE");
    setUrl("");
    setUploadedFiles([]);
    setAltText("");
    setEventId(events[0]?.id || "");
    setYear(
      events[0]
        ? String(new Date(events[0].date).getFullYear())
        : String(new Date().getFullYear()),
    );
    setAlbumPreset(HOMEPAGE_GALLERY_CATEGORIES[0]);
    setCustomAlbum("");
    setIsModalOpen(true);
  };

  const openEditModal = (item: MediaItem) => {
    setEditingMediaId(item.id);
    setType(item.type);
    setUrl(item.url);
    setUploadedFiles([]);
    setAltText(item.altText || "");
    setEventId(item.eventId || "");
    setYear(
      String(
        item.year ??
          (item.eventId
            ? new Date(events.find((event) => event.id === item.eventId)?.date || Date.now()).getFullYear()
            : new Date().getFullYear()),
      ),
    );
    if (item.albumName && HOMEPAGE_GALLERY_CATEGORIES.includes(item.albumName as (typeof HOMEPAGE_GALLERY_CATEGORIES)[number])) {
      setAlbumPreset(item.albumName);
      setCustomAlbum("");
    } else if (item.albumName) {
      setAlbumPreset("CUSTOM");
      setCustomAlbum(item.albumName);
    } else {
      setAlbumPreset("NONE");
      setCustomAlbum("");
    }
    setIsModalOpen(true);
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.currentTarget.value = "";
    if (files.length === 0) return;

    if ((type === "VIDEO" || editingMediaId) && files.length > 1) {
      toast.error(editingMediaId ? "Select one replacement file" : "Upload one video at a time");
      return;
    }

    setIsUploading(true);
    try {
      const uploaded = new Array<UploadedAsset | undefined>(files.length);
      const failed: string[] = [];
      let nextIndex = 0;

      const uploadNext = async () => {
        while (nextIndex < files.length) {
          const index = nextIndex++;
          const file = files[index];
          const formData = new FormData();
          formData.append("file", file);

          try {
            const response = await fetch("/api/upload", {
              method: "POST",
              body: formData,
            });
            const data = (await response.json()) as { url?: string; error?: string };

            if (!response.ok) {
              throw new Error(data.error || `Could not upload ${file.name}`);
            }
            if (typeof data.url !== "string" || !data.url) {
              throw new Error(`Upload did not return a URL for ${file.name}`);
            }

            uploaded[index] = { name: file.name, url: data.url };
          } catch (error) {
            console.error(`Unable to upload ${file.name}:`, error);
            failed.push(file.name);
          }
        }
      };

      await Promise.all(
        Array.from({ length: Math.min(4, files.length) }, () => uploadNext()),
      );

      const successfulUploads = uploaded.filter(
        (asset): asset is UploadedAsset => asset !== undefined,
      );
      if (editingMediaId && successfulUploads[0]) {
        setUrl(successfulUploads[0].url);
      } else {
        setUploadedFiles((current) => [...current, ...successfulUploads]);
      }

      if (successfulUploads.length > 0) {
        toast.success(`${successfulUploads.length} file(s) uploaded to storage`);
      }
      if (failed.length > 0) {
        toast.error(`${failed.length} file(s) could not be uploaded. Select them again to retry.`);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isUploading || isSaving) return;

    const assetsToSave = [
      ...(editingMediaId ? [] : uploadedFiles),
      ...(url.trim() ? [{ name: "Media URL", url: url.trim() }] : []),
    ];

    if (assetsToSave.length === 0 || (editingMediaId && !url.trim())) {
      toast.error("Please upload a file or enter a URL");
      return;
    }
    const mediaYear = Number(year);
    if (!Number.isInteger(mediaYear) || mediaYear < 1900 || mediaYear > 2200) {
      toast.error("Enter a valid year between 1900 and 2200");
      return;
    }

    const resolvedAlbum =
      albumPreset === "CUSTOM"
        ? customAlbum.trim()
        : albumPreset === "NONE"
          ? ""
          : albumPreset;

    setIsSaving(true);
    try {
      const payload = {
        type,
        url: url.trim(),
        altText: altText || null,
        eventId: eventId || null,
        albumName: resolvedAlbum || null,
        year: mediaYear,
      };

      if (editingMediaId) {
        const response = await fetch(`/api/media/${editingMediaId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = (await response.json()) as MediaItem & { error?: string };
        if (!response.ok) {
          throw new Error(data.error || "Failed to update media asset");
        }

        setMediaList((current) =>
          current.map((item) => (item.id === data.id ? data : item)),
        );
        toast.success("Media asset updated");
        setIsModalOpen(false);
        router.refresh();
        return;
      }

      const savedItems: MediaItem[] = [];
      const failedAssets: UploadedAsset[] = [];

      for (const asset of assetsToSave) {
        try {
          const response = await fetch("/api/media", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...payload,
              url: asset.url,
            }),
          });
          const data = (await response.json()) as MediaItem & { error?: string };

          if (!response.ok) {
            throw new Error(data.error || `Failed to save ${asset.name}`);
          }
          savedItems.push(data);
        } catch (error) {
          console.error(`Unable to save ${asset.name}:`, error);
          failedAssets.push(asset);
        }
      }

      if (savedItems.length > 0) {
        setMediaList((current) => [...savedItems, ...current]);
        router.refresh();
      }

      const failedUploadedUrls = new Set(
        failedAssets
          .filter((asset) => uploadedFiles.some((file) => file.url === asset.url))
          .map((asset) => asset.url),
      );
      setUploadedFiles((current) =>
        current.filter((asset) => failedUploadedUrls.has(asset.url)),
      );

      if (failedAssets.length > 0) {
        const failedUploadedCount = failedAssets.filter(
          (asset) => asset.name !== "Media URL",
        ).length;
        const failureDetails = [
          failedUploadedCount > 0
            ? `${failedUploadedCount} uploaded file(s) could not be saved`
            : "",
          failedAssets.some((asset) => asset.name === "Media URL")
            ? "the media URL could not be saved"
            : "",
        ].filter(Boolean).join("; ");

        toast.error(
          `${savedItems.length > 0 ? `${savedItems.length} asset(s) saved; ` : ""}${failureDetails}. Retry the remaining assets.`,
        );
      } else {
        toast.success(`${savedItems.length} media asset(s) saved successfully`);
        setUrl("");
        setUploadedFiles([]);
        setIsModalOpen(false);
      }

    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save media asset");
    } finally {
      setIsSaving(false);
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
                  variant="secondary"
                  onClick={() => openEditModal(item)}
                  className="absolute left-2 top-2 rounded-none opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity h-8 w-8"
                  title="Edit Asset"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => handleDelete(item.id)}
                  className="absolute right-2 top-2 rounded-none opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity h-8 w-8"
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
                  {item.year && (
                    <span className="rounded-none bg-secondary border border-border px-2 py-0.5 font-mono text-[9px] font-bold text-muted-foreground uppercase">
                      {item.year}
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
                {editingMediaId ? "Edit Media Asset" : "Add Media Asset"}
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
                  onChange={(e) => setType(e.target.value === "VIDEO" ? "VIDEO" : "IMAGE")}
                  disabled={isUploading || isSaving || uploadedFiles.length > 0}
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
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://... (optional)"
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
                      multiple={type === "IMAGE" && !editingMediaId}
                      onChange={handleMediaUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                </div>
                {uploadedFiles.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {uploadedFiles.length} image(s) ready to save
                    {uploadedFiles.length <= 3
                      ? `: ${uploadedFiles.map((file) => file.name).join(", ")}`
                      : `: ${uploadedFiles.slice(0, 3).map((file) => file.name).join(", ")} and ${uploadedFiles.length - 3} more`}
                  </p>
                )}
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  {editingMediaId
                    ? "Choose a replacement file or update its URL and details."
                    : "Select multiple images at once. Extract ZIP archives before selecting their images."}
                </p>
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
                    onChange={(e) => {
                      const selectedEventId = e.target.value;
                      setEventId(selectedEventId);
                      const selectedEvent = events.find((event) => event.id === selectedEventId);
                      if (selectedEvent) {
                        setYear(String(new Date(selectedEvent.date).getFullYear()));
                      }
                    }}
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

                <div className="space-y-2">
                  <Label className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Gallery Year
                  </Label>
                  <Input
                    type="number"
                    min={1900}
                    max={2200}
                    required
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="rounded-none border-border bg-background focus-visible:ring-primary"
                  />
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
                    <option value="NONE">No category</option>
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
                  disabled={isUploading || isSaving}
                  className="rounded-none font-mono text-xs uppercase tracking-wider"
                >
                  {isSaving
                    ? "Saving..."
                    : editingMediaId
                      ? "Save Changes"
                      : `Save ${uploadedFiles.length || 1} Asset${uploadedFiles.length === 1 ? "" : "s"}`}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
