"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, X, Upload, Check, Globe, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SocialLinksInput, { SocialLink } from "@/components/admin/SocialLinksInput";

interface Speaker {
  id: string;
  userId: string | null;
  name: string;
  headline: string | null;
  bio: string | null;
  imageUrl: string | null;
  eventYear: number;
  socialLinks: SocialLink[];
  status: "SUBMITTED" | "UNDER_REVIEW" | "SHORTLISTED" | "ACCEPTED" | "REJECTED" | "WITHDRAWN";
  sortOrder: number | null;
  createdAt: string | Date;
  eventYears?: string[];
}

interface SpeakersClientProps {
  initialSpeakers: Speaker[];
}

export default function SpeakersClient({ initialSpeakers }: SpeakersClientProps) {
  const router = useRouter();
  const [speakersList, setSpeakersList] = useState<Speaker[]>(initialSpeakers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpeaker, setEditingSpeaker] = useState<Speaker | null>(null);

  // Form fields: name, headline, status, sort index, description (bio), image, social links (including email)
  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [eventYear, setEventYear] = useState(2023);
  const [status, setStatus] = useState<Speaker["status"]>("ACCEPTED");
  const [sortOrder, setSortOrder] = useState(0);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  
  const [isUploading, setIsUploading] = useState(false);

  const openCreateModal = () => {
    setEditingSpeaker(null);
    setName("");
    setHeadline("");
    setBio("");
    setImageUrl("");
    setEventYear(2023);
    setStatus("ACCEPTED");
    setSortOrder(0);
    setSocialLinks([]);
    setIsModalOpen(true);
  };

  const openEditModal = (speaker: Speaker) => {
    setEditingSpeaker(speaker);
    setName(speaker.name);
    setHeadline(speaker.headline || "");
    setBio(speaker.bio || "");
    setImageUrl(speaker.imageUrl || "");
    setEventYear(speaker.eventYear || 2023);
    setStatus(speaker.status);
    setSortOrder(speaker.sortOrder || 0);
    setSocialLinks(speaker.socialLinks || []);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setImageUrl(data.url);
        toast.success("Speaker photograph uploaded");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name,
      headline: headline || null,
      bio: bio || null,
      imageUrl: imageUrl || null,
      eventYear: Number(eventYear),
      status,
      sortOrder: Number(sortOrder),
      socialLinks,
    };

    try {
      const url = editingSpeaker ? `/api/speakers/${editingSpeaker.id}` : "/api/speakers";
      const method = editingSpeaker ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save profile");
      }

      const savedData = await res.json();

      if (editingSpeaker) {
        setSpeakersList(speakersList.map((s) => (s.id === editingSpeaker.id ? savedData : s)));
        toast.success("Speaker profile updated");
      } else {
        setSpeakersList([savedData, ...speakersList]);
        toast.success("Speaker profile created");
      }

      setIsModalOpen(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    }
  };

  const handleQuickStatusChange = async (id: string, newStatus: Speaker["status"]) => {
    try {
      const res = await fetch(`/api/speakers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");
      const updated = await res.json();

      setSpeakersList(speakersList.map((s) => (s.id === id ? updated : s)));
      toast.success(`Status updated to ${newStatus}`);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this speaker profile?")) return;

    try {
      const res = await fetch(`/api/speakers/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      setSpeakersList(speakersList.filter((s) => s.id !== id));
      toast.success("Speaker profile removed");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Could not delete");
    }
  };

  return (
    <div className="space-y-8">
      {/* Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="mt-2 font-display text-4xl font-black uppercase text-foreground">
            Speaker Profiles
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage speaker profiles (Name, Headline, Status, Sort Index, Description, Image, and Social Links with Email).
          </p>
        </div>
        <Button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-none px-5 py-5 font-mono text-xs font-bold uppercase tracking-[0.15em]"
        >
          <Plus className="h-4 w-4" />
          Add Speaker
        </Button>
      </div>

      {/* Grid listing */}
      <div className="rounded-none border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/50">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Photo</TableHead>
              <TableHead className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Speaker & Headline</TableHead>
              <TableHead className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Description</TableHead>
              <TableHead className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Social Links & Email</TableHead>
              <TableHead className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Sort Index</TableHead>
              <TableHead className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Event Year</TableHead>
              <TableHead className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Status</TableHead>
              <TableHead className="text-right font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border">
            {speakersList.length === 0 ? (
              <TableRow className="border-border">
                <TableCell colSpan={8} className="h-24 text-center text-sm text-muted-foreground font-mono">
                  No speaker profiles registered yet.
                </TableCell>
              </TableRow>
            ) : (
              speakersList.map((speaker) => (
                <TableRow key={speaker.id} className="border-border hover:bg-secondary/20 transition-colors">
                  <TableCell>
                    {speaker.imageUrl ? (
                      <div className="relative h-12 w-12 rounded-full border border-border bg-background overflow-hidden">
                        <Image
                          src={speaker.imageUrl}
                          alt={speaker.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-12 w-12 rounded-full border border-border bg-background/50 flex items-center justify-center font-mono text-[9px] text-muted-foreground">
                        N/A
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-display text-base font-black uppercase text-foreground">
                      {speaker.name}
                    </div>
                    {speaker.headline && (
                      <p className="text-xs text-primary font-mono mt-0.5">
                        {speaker.headline}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {speaker.bio || "No description provided."}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      {speaker.socialLinks && speaker.socialLinks.length > 0 ? (
                        speaker.socialLinks.map((link, idx) => (
                          <a
                            key={idx}
                            href={link.platform === "email" && !link.url.startsWith("mailto:") ? `mailto:${link.url}` : link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-none border border-border bg-secondary px-2 py-0.5 font-mono text-[9px] font-bold text-foreground uppercase hover:border-primary hover:text-primary transition-colors"
                          >
                            {link.platform === "email" ? (
                              <Mail className="h-2.5 w-2.5 text-primary" />
                            ) : (
                              <Globe className="h-2.5 w-2.5 text-primary" />
                            )}
                            {link.platform}: {link.url}
                          </a>
                        ))
                      ) : (
                        <span className="font-mono text-[10px] text-muted-foreground/60">No links</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-xs font-bold text-muted-foreground">
                      {speaker.sortOrder ?? 0}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-xs text-primary">
                      {speaker.eventYears?.length ? speaker.eventYears.join(", ") : "Unassigned"}
                    </span>
                  </TableCell>
                  <TableCell className="space-y-2">
                    <div>
                      <span
                        className={`inline-block rounded-none px-2.5 py-0.5 font-mono text-[10px] font-bold border uppercase ${
                          speaker.status === "ACCEPTED"
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                            : speaker.status === "REJECTED"
                            ? "bg-red-500/10 border-red-500/20 text-red-400"
                            : "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {speaker.status.replace("_", " ")}
                      </span>
                    </div>
                    {speaker.status !== "ACCEPTED" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickStatusChange(speaker.id, "ACCEPTED")}
                        className="flex items-center h-6 gap-1 rounded-none border-emerald-500/25 bg-emerald-500/5 px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-wider text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                      >
                        <Check className="h-3 w-3" /> Approve
                      </Button>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditModal(speaker)}
                        className="h-8 w-8 rounded-none border-border hover:bg-secondary hover:text-foreground transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(speaker.id)}
                        className="h-8 w-8 rounded-none border-border hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Editor Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-xl border border-border bg-card p-6 space-y-6 my-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="font-display text-xl font-black uppercase text-foreground">
                {editingSpeaker ? "Edit Speaker Profile" : "Add Speaker Profile"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Speaker Name & Headline */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Speaker Name *
                  </Label>
                  <Input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="rounded-none border-border bg-background focus-visible:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Headline
                  </Label>
                  <Input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g. Systems Designer & Futurist"
                    className="rounded-none border-border bg-background focus-visible:ring-primary"
                  />
                </div>
              </div>

              {/* Event Year, Status & Sort Index */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Event Year
                  </Label>
                  <Input
                    type="number"
                    min={1900}
                    max={2200}
                    required
                    value={eventYear}
                    onChange={(e) => setEventYear(Number(e.target.value))}
                    className="rounded-none border-border bg-background focus-visible:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Status
                  </Label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="flex h-10 w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="ACCEPTED">ACCEPTED</option>
                    <option value="SUBMITTED">SUBMITTED</option>
                    <option value="UNDER_REVIEW">UNDER REVIEW</option>
                    <option value="SHORTLISTED">SHORTLISTED</option>
                    <option value="REJECTED">REJECTED</option>
                    <option value="WITHDRAWN">WITHDRAWN</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Sort Index
                  </Label>
                  <Input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className="rounded-none border-border bg-background focus-visible:ring-primary"
                  />
                </div>
              </div>

              {/* Speaker Description / Bio */}
              <div className="space-y-2">
                <Label className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Description
                </Label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Speaker description, accomplishments, or background summary..."
                  rows={3}
                  className="flex w-full border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 resize-none font-mono"
                />
              </div>

              {/* Speaker Photograph */}
              <div className="space-y-2">
                <Label className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Speaker Photograph
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
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
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                </div>
              </div>

              {/* Social Links Component (including Email) */}
              <div className="pt-2 border-t border-border">
                <SocialLinksInput links={socialLinks} onChange={setSocialLinks} />
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
                  Save Speaker
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
