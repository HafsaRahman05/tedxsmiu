"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, Calendar, MapPin, Users, Star, X, Mic, Shield, ChevronRight } from "lucide-react";
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
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageCropPreview from "@/components/admin/ImageCropPreview";

interface SpeakerOption {
  id: string;
  name: string;
  imageUrl: string | null;
}

interface SponsorOption {
  id: string;
  name: string;
  logoUrl: string | null;
}

interface SelectedSpeaker {
  speakerId: string;
  talkTitle: string;
  abstract: string;
  youtubeUrl: string;
  sortOrder: number;
}

interface SelectedSponsor {
  sponsorId: string;
  tier: "TITLE" | "GOLD" | "SILVER" | "IN_KIND";
  sortOrder: number;
}

interface EventSpeakerDetail {
  id: string;
  talkTitle: string;
  abstract: string | null;
  youtubeUrl: string | null;
  sortOrder: number | null;
  speaker: SpeakerOption;
}

interface EventSponsorDetail {
  id: string;
  tier: "TITLE" | "GOLD" | "SILVER" | "IN_KIND";
  sortOrder: number | null;
  sponsor: SponsorOption;
}

interface EventItem {
  id: string;
  title: string;
  theme: string;
  slug: string;
  description: string | null;
  isFeatured: boolean;
  coverImageUrl: string | null;
  date: string | Date;
  venue: string;
  capacity: number;
  status: "UPCOMING" | "ACTIVE" | "PAST";
  eventSpeakers?: EventSpeakerDetail[];
  eventSponsors?: EventSponsorDetail[];
  createdAt: string | Date;
}

interface EventsClientProps {
  initialEvents: EventItem[];
  availableSpeakers: SpeakerOption[];
  availableSponsors: SponsorOption[];
}

export default function EventsClient({
  initialEvents,
  availableSpeakers,
  availableSponsors,
}: EventsClientProps) {
  const router = useRouter();
  const [eventsList, setEventsList] = useState<EventItem[]>(initialEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  // Form fields
  const [title, setTitle] = useState("");
  const [theme, setTheme] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [capacity, setCapacity] = useState(100);
  const [status, setStatus] = useState<"UPCOMING" | "ACTIVE" | "PAST">("UPCOMING");

  // Selected speakers & sponsors state for current form modal
  const [selectedSpeakers, setSelectedSpeakers] = useState<SelectedSpeaker[]>([]);
  const [selectedSponsors, setSelectedSponsors] = useState<SelectedSponsor[]>([]);

  // Selection helpers
  const [speakerToAdd, setSpeakerToAdd] = useState("");
  const [sponsorToAdd, setSponsorToAdd] = useState("");

  const openCreateModal = () => {
    setEditingEvent(null);
    setTitle("");
    setTheme("");
    setSlug("");
    setDescription("");
    setIsFeatured(false);
    setCoverImageUrl("");
    setDate("");
    setVenue("");
    setCapacity(100);
    setStatus("UPCOMING");
    setSelectedSpeakers([]);
    setSelectedSponsors([]);
    setSpeakerToAdd("");
    setSponsorToAdd("");
    setIsModalOpen(true);
  };

  const openEditModal = (event: EventItem) => {
    setEditingEvent(event);
    setTitle(event.title);
    setTheme(event.theme);
    setSlug(event.slug);
    setDescription(event.description || "");
    setIsFeatured(event.isFeatured);
    setCoverImageUrl(event.coverImageUrl || "");

    const d = new Date(event.date);
    const tzoffset = d.getTimezoneOffset() * 60000;
    const localISOTime = new Date(d.getTime() - tzoffset).toISOString().slice(0, 16);
    setDate(localISOTime);

    setVenue(event.venue);
    setCapacity(event.capacity);
    setStatus(event.status);

    // Map existing eventSpeakers
    if (event.eventSpeakers) {
      setSelectedSpeakers(
        event.eventSpeakers.map((es) => ({
          speakerId: es.speaker.id,
          talkTitle: es.talkTitle,
          abstract: es.abstract || "",
          youtubeUrl: es.youtubeUrl || "",
          sortOrder: es.sortOrder || 0,
        }))
      );
    } else {
      setSelectedSpeakers([]);
    }

    // Map existing eventSponsors
    if (event.eventSponsors) {
      setSelectedSponsors(
        event.eventSponsors.map((esp) => ({
          sponsorId: esp.sponsor.id,
          tier: esp.tier || "GOLD",
          sortOrder: esp.sortOrder || 0,
        }))
      );
    } else {
      setSelectedSponsors([]);
    }

    setSpeakerToAdd("");
    setSponsorToAdd("");
    setIsModalOpen(true);
  };

  // Add Speaker handler
  const handleAddSpeaker = () => {
    if (!speakerToAdd) return;
    if (selectedSpeakers.some((s) => s.speakerId === speakerToAdd)) {
      toast.error("Speaker already added to this event");
      return;
    }
    const targetSpeaker = availableSpeakers.find((s) => s.id === speakerToAdd);
    setSelectedSpeakers([
      ...selectedSpeakers,
      {
        speakerId: speakerToAdd,
        talkTitle: targetSpeaker ? `${targetSpeaker.name}'s Talk` : "Keynote Talk",
        abstract: "",
        youtubeUrl: "",
        sortOrder: selectedSpeakers.length,
      },
    ]);
    setSpeakerToAdd("");
  };

  const handleRemoveSpeaker = (speakerId: string) => {
    setSelectedSpeakers(selectedSpeakers.filter((s) => s.speakerId !== speakerId));
  };

  const handleUpdateSpeaker = (speakerId: string, field: keyof SelectedSpeaker, value: any) => {
    setSelectedSpeakers(
      selectedSpeakers.map((s) => (s.speakerId === speakerId ? { ...s, [field]: value } : s))
    );
  };

  // Add Sponsor handler
  const handleAddSponsor = () => {
    if (!sponsorToAdd) return;
    if (selectedSponsors.some((sp) => sp.sponsorId === sponsorToAdd)) {
      toast.error("Partner already added to this event");
      return;
    }
    setSelectedSponsors([
      ...selectedSponsors,
      {
        sponsorId: sponsorToAdd,
        tier: "GOLD",
        sortOrder: selectedSponsors.length,
      },
    ]);
    setSponsorToAdd("");
  };

  const handleRemoveSponsor = (sponsorId: string) => {
    setSelectedSponsors(selectedSponsors.filter((sp) => sp.sponsorId !== sponsorId));
  };

  const handleUpdateSponsor = (sponsorId: string, tier: SelectedSponsor["tier"]) => {
    setSelectedSponsors(
      selectedSponsors.map((sp) => (sp.sponsorId === sponsorId ? { ...sp, tier } : sp))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that speakers selected have a talk title
    for (const sp of selectedSpeakers) {
      if (!sp.talkTitle.trim()) {
        const name = availableSpeakers.find((s) => s.id === sp.speakerId)?.name;
        toast.error(`Talk title is required for ${name || "selected speaker"}`);
        return;
      }
    }

    const payload = {
      title,
      theme,
      slug,
      description: description || null,
      isFeatured,
      coverImageUrl: coverImageUrl || null,
      date: new Date(date).toISOString(),
      venue,
      capacity: Number(capacity),
      status,
      speakers: selectedSpeakers,
      sponsors: selectedSponsors,
    };

    try {
      const url = editingEvent ? `/api/events/${editingEvent.id}` : "/api/events";
      const method = editingEvent ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save event");
      }

      toast.success(editingEvent ? "Event updated successfully" : "Event created successfully");
      setIsModalOpen(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event edition?")) return;

    try {
      const res = await fetch(`/api/events/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete event");

      setEventsList(eventsList.filter((e) => e.id !== id));
      toast.success("Event deleted successfully");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Could not delete event");
    }
  };

  return (
    <div className="space-y-8">
      {/* Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="mt-2 font-display text-4xl font-black uppercase text-foreground">
            Event Editions
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create TEDxSMIU editions, assign DB speakers with talk abstracts, select partners, and publish rich descriptions.
          </p>
        </div>
        <Button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-none px-5 py-5 font-mono text-xs font-bold uppercase tracking-[0.15em]"
        >
          <Plus className="h-4 w-4" />
          Create Edition
        </Button>
      </div>

      {/* Grid listing */}
      <div className="rounded-none border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/50">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">16:9 Cover</TableHead>
              <TableHead className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Theme / Title</TableHead>
              <TableHead className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Lineup Summary</TableHead>
              <TableHead className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Date & Venue</TableHead>
              <TableHead className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Status</TableHead>
              <TableHead className="text-right font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border">
            {eventsList.length === 0 ? (
              <TableRow className="border-border">
                <TableCell colSpan={6} className="h-24 text-center text-sm text-muted-foreground font-mono">
                  No event editions created yet.
                </TableCell>
              </TableRow>
            ) : (
              eventsList.map((event) => (
                <TableRow key={event.id} className="border-border hover:bg-secondary/20 transition-colors">
                  <TableCell>
                    {event.coverImageUrl ? (
                      <div className="relative aspect-[16/9] w-28 border border-border bg-background overflow-hidden">
                        <Image
                          src={event.coverImageUrl}
                          alt={event.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[16/9] w-28 border border-border bg-background/50 flex items-center justify-center font-mono text-[9px] text-muted-foreground">
                        NO 16:9 COVER
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-display text-base font-black uppercase text-foreground">
                        {event.title}
                      </span>
                      {event.isFeatured && (
                        <span className="rounded-none bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 font-mono text-[9px] font-bold text-yellow-400 uppercase flex items-center gap-1">
                          <Star className="h-2.5 w-2.5 fill-current" />
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-primary font-mono mt-0.5">{event.theme}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">/{event.slug}</p>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 font-mono text-xs text-foreground/80">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Mic className="h-3 w-3 text-primary" />
                        <span>{event.eventSpeakers?.length || 0} Speakers</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Shield className="h-3 w-3 text-primary" />
                        <span>{event.eventSponsors?.length || 0} Partners</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-foreground/80">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>
                        {new Date(event.date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{event.venue}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-block rounded-none px-2.5 py-1 font-mono text-[10px] font-bold border uppercase ${
                        event.status === "ACTIVE"
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                          : event.status === "UPCOMING"
                          ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                          : "bg-muted/30 border-border text-muted-foreground"
                      }`}
                    >
                      {event.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditModal(event)}
                        className="h-8 w-8 rounded-none border-border hover:bg-secondary hover:text-foreground transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(event.id)}
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
          <div className="w-full max-w-3xl border border-border bg-card p-6 space-y-6 my-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border pb-4 sticky top-0 bg-card z-10">
              <h2 className="font-display text-xl font-black uppercase text-foreground">
                {editingEvent ? "Edit Event Edition" : "Create Event Edition"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Event Title & Theme */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Event Title * (e.g. TEDxSMIU 2026)
                  </Label>
                  <Input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="TEDxSMIU 2026"
                    className="rounded-none border-border bg-background focus-visible:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Theme * (e.g. Future by Design)
                  </Label>
                  <Input
                    required
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    placeholder="Future by Design"
                    className="rounded-none border-border bg-background focus-visible:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    URL Slug *
                  </Label>
                  <Input
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="2026"
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
                    <option value="UPCOMING">UPCOMING</option>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="PAST">PAST</option>
                  </select>
                </div>
              </div>

              {/* Date, Venue, Capacity & Featured */}
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="space-y-2">
                  <Label className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Date & Time *
                  </Label>
                  <Input
                    type="datetime-local"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="rounded-none border-border bg-background focus-visible:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Venue *
                  </Label>
                  <Input
                    required
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="Main Auditorium"
                    className="rounded-none border-border bg-background focus-visible:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Capacity
                  </Label>
                  <Input
                    type="number"
                    required
                    min={10}
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="rounded-none border-border bg-background focus-visible:ring-primary"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="h-4 w-4 rounded-none border border-border bg-background text-primary focus:ring-0"
                />
                <Label htmlFor="isFeatured" className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground cursor-pointer">
                  Feature Highlight on Homepage
                </Label>
              </div>

              {/* Cover Image Uploader & 16:9 Auto-Crop Stylist */}
              <ImageCropPreview
                imageUrl={coverImageUrl}
                onChange={setCoverImageUrl}
                aspectRatioLabel="16:9 Flagship Cover"
              />

              {/* Rich Text Editor for Event Description */}
              <div className="space-y-2">
                <Label className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Event Description (Rich Text Editor)
                </Label>
                <RichTextEditor
                  value={description}
                  onChange={setDescription}
                  placeholder="Write comprehensive edition description, schedule highlights, and main themes..."
                />
              </div>

              {/* SECTION: Speakers Selection for Event */}
              <div className="border border-border p-4 bg-secondary/20 space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <h3 className="font-display text-base font-black uppercase text-foreground flex items-center gap-2">
                      <Mic className="h-4 w-4 text-primary" /> Event Speakers Lineup
                    </h3>
                    <p className="text-xs text-muted-foreground font-mono">
                      Select speakers from existing DB profiles and define their talk title and abstract for this event.
                    </p>
                  </div>
                </div>

                {/* Speaker Selector Input */}
                <div className="flex gap-2">
                  <select
                    value={speakerToAdd}
                    onChange={(e) => setSpeakerToAdd(e.target.value)}
                    className="flex-1 h-9 border border-border bg-background px-3 font-mono text-xs text-foreground"
                  >
                    <option value="">-- Select speaker from DB --</option>
                    {availableSpeakers.map((sp) => (
                      <option key={sp.id} value={sp.id}>
                        {sp.name}
                      </option>
                    ))}
                  </select>
                  <Button
                    type="button"
                    onClick={handleAddSpeaker}
                    className="h-9 px-4 font-mono text-xs font-bold uppercase rounded-none"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" /> Add Speaker
                  </Button>
                </div>

                {/* Selected Speakers List */}
                {selectedSpeakers.length === 0 ? (
                  <div className="p-3 border border-dashed border-border text-center font-mono text-xs text-muted-foreground">
                    No speakers added to this event lineup yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedSpeakers.map((spItem, idx) => {
                      const spProfile = availableSpeakers.find((s) => s.id === spItem.speakerId);
                      return (
                        <div key={spItem.speakerId} className="border border-border bg-background p-3 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {spProfile?.imageUrl ? (
                                <Image
                                  src={spProfile.imageUrl}
                                  alt={spProfile.name}
                                  width={28}
                                  height={28}
                                  className="rounded-full object-cover"
                                />
                              ) : (
                                <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center font-mono text-[9px]">
                                  SP
                                </div>
                              )}
                              <span className="font-display text-sm font-black uppercase text-foreground">
                                {spProfile?.name || "Speaker"}
                              </span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveSpeaker(spItem.speakerId)}
                              className="h-7 text-xs font-mono text-destructive hover:bg-destructive/10 rounded-none"
                            >
                              Remove
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label className="font-mono text-[9px] font-bold uppercase text-muted-foreground">
                                Talk Title *
                              </Label>
                              <Input
                                type="text"
                                required
                                value={spItem.talkTitle}
                                onChange={(e) => handleUpdateSpeaker(spItem.speakerId, "talkTitle", e.target.value)}
                                placeholder="Talk Title for this Event"
                                className="h-8 rounded-none border-border bg-background text-xs"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="font-mono text-[9px] font-bold uppercase text-muted-foreground">
                                YouTube Video URL (Optional)
                              </Label>
                              <Input
                                type="url"
                                value={spItem.youtubeUrl}
                                onChange={(e) => handleUpdateSpeaker(spItem.speakerId, "youtubeUrl", e.target.value)}
                                placeholder="https://youtube.com/watch?..."
                                className="h-8 rounded-none border-border bg-background text-xs"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <Label className="font-mono text-[9px] font-bold uppercase text-muted-foreground">
                              Talk Abstract
                            </Label>
                            <textarea
                              value={spItem.abstract}
                              onChange={(e) => handleUpdateSpeaker(spItem.speakerId, "abstract", e.target.value)}
                              placeholder="Brief summary of the talk topic..."
                              rows={2}
                              className="flex w-full border border-border bg-background px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none resize-none font-mono"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* SECTION: Partners / Sponsors Selection for Event */}
              <div className="border border-border p-4 bg-secondary/20 space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <h3 className="font-display text-base font-black uppercase text-foreground flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" /> Event Partners & Sponsors
                    </h3>
                    <p className="text-xs text-muted-foreground font-mono">
                      Multi-select partners from existing DB sponsors and assign sponsorship tiers for this edition.
                    </p>
                  </div>
                </div>

                {/* Partner Selector Input */}
                <div className="flex gap-2">
                  <select
                    value={sponsorToAdd}
                    onChange={(e) => setSponsorToAdd(e.target.value)}
                    className="flex-1 h-9 border border-border bg-background px-3 font-mono text-xs text-foreground"
                  >
                    <option value="">-- Select partner from DB --</option>
                    {availableSponsors.map((sp) => (
                      <option key={sp.id} value={sp.id}>
                        {sp.name}
                      </option>
                    ))}
                  </select>
                  <Button
                    type="button"
                    onClick={handleAddSponsor}
                    className="h-9 px-4 font-mono text-xs font-bold uppercase rounded-none"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" /> Add Partner
                  </Button>
                </div>

                {/* Selected Partners List */}
                {selectedSponsors.length === 0 ? (
                  <div className="p-3 border border-dashed border-border text-center font-mono text-xs text-muted-foreground">
                    No partners added to this event edition yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedSponsors.map((spItem) => {
                      const spProfile = availableSponsors.find((s) => s.id === spItem.sponsorId);
                      return (
                        <div key={spItem.sponsorId} className="border border-border bg-background p-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {spProfile?.logoUrl ? (
                              <Image
                                src={spProfile.logoUrl}
                                alt={spProfile.name}
                                width={32}
                                height={20}
                                className="object-contain"
                              />
                            ) : (
                              <div className="h-6 w-10 bg-secondary flex items-center justify-center font-mono text-[8px]">
                                LOGO
                              </div>
                            )}
                            <div>
                              <span className="font-display text-xs font-black uppercase text-foreground block">
                                {spProfile?.name || "Partner"}
                              </span>
                              <select
                                value={spItem.tier}
                                onChange={(e) => handleUpdateSponsor(spItem.sponsorId, e.target.value as any)}
                                className="font-mono text-[10px] font-bold text-primary bg-transparent focus:outline-none cursor-pointer"
                              >
                                <option value="TITLE">TITLE SPONSOR</option>
                                <option value="GOLD">GOLD PARTNER</option>
                                <option value="SILVER">SILVER PARTNER</option>
                                <option value="IN_KIND">IN-KIND PARTNER</option>
                              </select>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveSponsor(spItem.sponsorId)}
                            className="h-7 text-xs font-mono text-destructive hover:bg-destructive/10 rounded-none px-2"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border sticky bottom-0 bg-card z-10">
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
                  Save Edition
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
