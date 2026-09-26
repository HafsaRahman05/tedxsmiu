"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, Shield, X, Upload, ExternalLink, Globe } from "lucide-react";
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

interface Sponsor {
  id: string;
  name: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  eventYear: number;
  socialLinks: SocialLink[];
  tier: "TITLE" | "GOLD" | "SILVER" | "IN_KIND" | null;
  status: "NEW" | "CONTACTED" | "NEGOTIATING" | "CONFIRMED" | "DECLINED";
  createdAt: string | Date;
}

interface SponsorsClientProps {
  initialSponsors: Sponsor[];
}

export default function SponsorsClient({ initialSponsors }: SponsorsClientProps) {
  const router = useRouter();
  const [sponsorsList, setSponsorsList] = useState<Sponsor[]>(initialSponsors);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [eventYear, setEventYear] = useState(2023);
  const [tier, setTier] = useState<Sponsor["tier"]>("GOLD");
  const [status, setStatus] = useState<Sponsor["status"]>("CONFIRMED");
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  
  const [isUploading, setIsUploading] = useState(false);

  const openCreateModal = () => {
    setEditingSponsor(null);
    setName("");
    setLogoUrl("");
    setWebsiteUrl("");
    setEventYear(2023);
    setTier("GOLD");
    setStatus("CONFIRMED");
    setSocialLinks([]);
    setIsModalOpen(true);
  };

  const openEditModal = (sponsor: Sponsor) => {
    setEditingSponsor(sponsor);
    setName(sponsor.name);
    setLogoUrl(sponsor.logoUrl || "");
    setWebsiteUrl(sponsor.websiteUrl || "");
    setEventYear(sponsor.eventYear || 2023);
    setTier(sponsor.tier || "GOLD");
    setStatus(sponsor.status);
    setSocialLinks(sponsor.socialLinks || []);
    setIsModalOpen(true);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setLogoUrl(data.url);
        toast.success("Logo uploaded successfully");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload logo");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name,
      logoUrl: logoUrl || null,
      websiteUrl: websiteUrl || null,
      eventYear: Number(eventYear),
      tier,
      status,
      socialLinks,
    };

    try {
      const url = editingSponsor ? `/api/sponsors/${editingSponsor.id}` : "/api/sponsors";
      const method = editingSponsor ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save partner info");
      }

      const savedData = await res.json();

      if (editingSponsor) {
        setSponsorsList(sponsorsList.map((s) => (s.id === editingSponsor.id ? savedData : s)));
        toast.success("Partner profile updated");
      } else {
        setSponsorsList([savedData, ...sponsorsList]);
        toast.success("Partner profile created");
      }

      setIsModalOpen(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this partner profile?")) return;

    try {
      const res = await fetch(`/api/sponsors/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      setSponsorsList(sponsorsList.filter((s) => s.id !== id));
      toast.success("Partner profile removed");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Could not delete");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="mt-2 font-display text-4xl font-black uppercase text-foreground">
            Sponsors & Partners
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage organization partner profiles and social links. Assign partners directly to Event Editions.
          </p>
        </div>
        <Button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-none px-5 py-5 font-mono text-xs font-bold uppercase tracking-[0.15em]"
        >
          <Plus className="h-4 w-4" />
          Add Partner
        </Button>
      </div>

      {/* Grid listing */}
      <div className="rounded-none border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/50">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Logo</TableHead>
              <TableHead className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Partner Name</TableHead>
              <TableHead className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Website</TableHead>
              <TableHead className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Social Links</TableHead>
              <TableHead className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Default Tier</TableHead>
              <TableHead className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Status</TableHead>
              <TableHead className="text-right font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border">
            {sponsorsList.length === 0 ? (
              <TableRow className="border-border">
                <TableCell colSpan={7} className="h-24 text-center text-sm text-muted-foreground font-mono">
                  No partners registered yet.
                </TableCell>
              </TableRow>
            ) : (
              sponsorsList.map((sponsor) => (
                <TableRow key={sponsor.id} className="border-border hover:bg-secondary/20 transition-colors">
                  <TableCell>
                    {sponsor.logoUrl ? (
                      <div className="relative h-10 w-24 border border-border bg-secondary p-1 flex items-center justify-center overflow-hidden">
                        <Image
                          src={sponsor.logoUrl}
                          alt={sponsor.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="h-10 w-24 border border-border bg-secondary/50 flex items-center justify-center font-mono text-[9px] text-muted-foreground">
                        NO LOGO
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-display text-base font-black uppercase text-foreground">
                      {sponsor.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    {sponsor.websiteUrl ? (
                      <a
                        href={sponsor.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-mono text-xs text-primary hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" /> Visit Site
                      </a>
                    ) : (
                      <span className="font-mono text-[10px] text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      {sponsor.socialLinks && sponsor.socialLinks.length > 0 ? (
                        sponsor.socialLinks.map((link, idx) => (
                          <a
                            key={idx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-none border border-border bg-secondary px-2 py-0.5 font-mono text-[9px] font-bold text-foreground uppercase hover:border-primary hover:text-primary transition-colors"
                          >
                            <Globe className="h-2.5 w-2.5 text-primary" />
                            {link.platform}
                          </a>
                        ))
                      ) : (
                        <span className="font-mono text-[10px] text-muted-foreground/60">No links</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 rounded-none bg-secondary border border-border px-2.5 py-1 font-mono text-[10px] font-bold text-foreground uppercase">
                      <Shield className="h-3 w-3 text-primary" />
                      {sponsor.tier || "GOLD"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-block rounded-none px-2.5 py-1 font-mono text-[10px] font-bold border uppercase ${
                        sponsor.status === "CONFIRMED"
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                          : sponsor.status === "DECLINED"
                          ? "bg-red-500/10 border-red-500/20 text-red-400"
                          : "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {sponsor.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditModal(sponsor)}
                        className="h-8 w-8 rounded-none border-border hover:bg-secondary hover:text-foreground transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(sponsor.id)}
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
                {editingSponsor ? "Edit Partner Profile" : "Add Partner Profile"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Sponsor Name */}
              <div className="space-y-2">
                <Label className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Partner / Sponsor Name *
                </Label>
                <Input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Organization / Brand Name"
                  className="rounded-none border-border bg-background focus-visible:ring-primary"
                />
              </div>

              {/* Website URL */}
              <div className="space-y-2">
                <Label className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Official Website URL
                </Label>
                <Input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://company.com"
                  className="rounded-none border-border bg-background focus-visible:ring-primary"
                />
              </div>

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

              <div className="grid grid-cols-2 gap-4">
                {/* Sponsorship Tier */}
                <div className="space-y-2">
                  <Label className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Default Tier Category
                  </Label>
                  <select
                    value={tier || "GOLD"}
                    onChange={(e) => setTier(e.target.value as any)}
                    className="flex h-10 w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="TITLE">TITLE SPONSOR</option>
                    <option value="GOLD">GOLD PARTNER</option>
                    <option value="SILVER">SILVER PARTNER</option>
                    <option value="IN_KIND">IN-KIND PARTNER</option>
                  </select>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Status
                  </Label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="flex h-10 w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="NEW">NEW / PROSPECT</option>
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="NEGOTIATING">NEGOTIATING</option>
                    <option value="DECLINED">DECLINED</option>
                  </select>
                </div>
              </div>

              {/* Logo URL and Uploader */}
              <div className="space-y-2">
                <Label className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Partner Logo URL
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
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
                      onChange={handleLogoUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                </div>
              </div>

              {/* Multiple Social Links Component */}
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
                  Save Partner
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
