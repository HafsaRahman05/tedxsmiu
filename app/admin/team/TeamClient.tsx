"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, Shield, X, Upload, Calendar, Globe, UserCheck } from "lucide-react";
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

interface TeamMember {
  id: string;
  name: string;
  department: string;
  role: string;
  designation: string | null;
  imageUrl: string | null;
  bio: string | null;
  socialLinks: SocialLink[];
  eventId: string | null;
  sortOrder: number | null;
  createdAt: string | Date;
}

interface Event {
  id: string;
  title: string;
}

interface TeamClientProps {
  initialTeam: TeamMember[];
  events: Event[];
}

const PREDEFINED_DEPARTMENTS = [
  "Organizing Team",
  "Curation",
  "Research",
  "Website",
  "Social Media",
  "Marketing",
  "Content",
  "Media",
  "Graphics",
  "Registrations",
  "Hospitality",
  "Protocol",
  "Security",
  "Logistics",
  "Outreach",
  "Corporate",
  "Influencer Wing",
];

const PREDEFINED_ROLES = [
  "Patron",
  "Lead Organizer",
  "Licensee",
  "Co-Lead Organizer",
  "Team Lead",
  "Deputy Lead",
  "Co-Lead",
  "Team Member",
  "Volunteer",
  "Advisor",
];

export default function TeamClient({ initialTeam, events }: TeamClientProps) {
  const router = useRouter();
  const [teamList, setTeamList] = useState<TeamMember[]>(initialTeam);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [selectedDept, setSelectedDept] = useState(PREDEFINED_DEPARTMENTS[0]);
  const [customDept, setCustomDept] = useState("");
  const [selectedRole, setSelectedRole] = useState(PREDEFINED_ROLES[0]);
  const [customRole, setCustomRole] = useState("");
  const [designation, setDesignation] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [bio, setBio] = useState("");
  const [eventId, setEventId] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  
  const [isUploading, setIsUploading] = useState(false);

  const openCreateModal = () => {
    setEditingMember(null);
    setName("");
    setSelectedDept(PREDEFINED_DEPARTMENTS[0]);
    setCustomDept("");
    setSelectedRole(PREDEFINED_ROLES[0]);
    setCustomRole("");
    setDesignation("");
    setImageUrl("");
    setBio("");
    setEventId("");
    setSortOrder(0);
    setSocialLinks([]);
    setIsModalOpen(true);
  };

  const openEditModal = (member: TeamMember) => {
    setEditingMember(member);
    setName(member.name);

    if (PREDEFINED_DEPARTMENTS.includes(member.department)) {
      setSelectedDept(member.department);
      setCustomDept("");
    } else {
      setSelectedDept("CUSTOM");
      setCustomDept(member.department);
    }

    if (PREDEFINED_ROLES.includes(member.role)) {
      setSelectedRole(member.role);
      setCustomRole("");
    } else {
      setSelectedRole("CUSTOM");
      setCustomRole(member.role);
    }

    setDesignation(member.designation || "");
    setImageUrl(member.imageUrl || "");
    setBio(member.bio || "");
    setEventId(member.eventId || "");
    setSortOrder(member.sortOrder || 0);
    setSocialLinks(member.socialLinks || []);
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
        toast.success("Team member photograph uploaded");
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

    const finalDepartment = selectedDept === "CUSTOM" ? customDept : selectedDept;
    const finalRole = selectedRole === "CUSTOM" ? customRole : selectedRole;

    if (!finalDepartment) {
      toast.error("Department is required");
      return;
    }
    if (!finalRole) {
      toast.error("Role is required");
      return;
    }

    const payload = {
      name,
      department: finalDepartment,
      role: finalRole,
      designation: designation || null,
      imageUrl: imageUrl || null,
      bio: bio || null,
      eventId: eventId || null,
      sortOrder: Number(sortOrder),
      socialLinks,
    };

    try {
      const url = editingMember ? `/api/team/${editingMember.id}` : "/api/team";
      const method = editingMember ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save team member profile");
      }

      const savedData = await res.json();

      if (editingMember) {
        setTeamList(teamList.map((m) => (m.id === editingMember.id ? savedData : m)));
        toast.success("Team member updated successfully");
      } else {
        setTeamList([savedData, ...teamList]);
        toast.success("Team member added successfully");
      }

      setIsModalOpen(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this team member?")) return;

    try {
      const res = await fetch(`/api/team/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      setTeamList(teamList.filter((m) => m.id !== id));
      toast.success("Team member removed successfully");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Could not delete");
    }
  };

  const getEventTitle = (id: string | null) => {
    if (!id) return "General Team";
    return events.find((e) => e.id === id)?.title || "Unknown Event";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="mt-2 font-display text-4xl font-black uppercase text-foreground">
            Organizing Committee
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage team profiles by selecting predefined departments, roles, custom designations, and social links.
          </p>
        </div>
        <Button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-none px-5 py-5 font-mono text-xs font-bold uppercase tracking-[0.15em]"
        >
          <Plus className="h-4 w-4" />
          Add Member
        </Button>
      </div>

      {/* Grid listing */}
      <div className="rounded-none border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/50">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Photo</TableHead>
              <TableHead className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Name / Info</TableHead>
              <TableHead className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Department</TableHead>
              <TableHead className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Role / Designation</TableHead>
              <TableHead className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Social Links</TableHead>
              <TableHead className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Event Edition</TableHead>
              <TableHead className="text-right font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border">
            {teamList.length === 0 ? (
              <TableRow className="border-border">
                <TableCell colSpan={7} className="p-8 text-center text-sm text-muted-foreground font-mono">
                  No team members registered yet.
                </TableCell>
              </TableRow>
            ) : (
              teamList.map((member) => (
                <TableRow key={member.id} className="border-border hover:bg-secondary/20 transition-colors">
                  <TableCell>
                    {member.imageUrl ? (
                      <div className="relative h-12 w-12 rounded-full border border-border bg-background overflow-hidden">
                        <Image
                          src={member.imageUrl}
                          alt={member.name}
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
                      {member.name}
                    </div>
                    <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                      Order Index: {member.sortOrder ?? 0}
                    </p>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-xs font-bold text-primary uppercase">
                      {member.department}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <span className="inline-flex items-center gap-1 rounded-none bg-secondary border border-border px-2 py-0.5 font-mono text-[10px] font-bold text-foreground uppercase">
                        <Shield className="h-3 w-3 text-primary" />
                        {member.role}
                      </span>
                      {member.designation && (
                        <p className="text-xs text-muted-foreground font-mono italic">
                          "{member.designation}"
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      {member.socialLinks && member.socialLinks.length > 0 ? (
                        member.socialLinks.map((link, idx) => (
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
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{getEventTitle(member.eventId)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditModal(member)}
                        className="h-8 w-8 rounded-none border-border hover:bg-secondary hover:text-foreground transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(member.id)}
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
                {editingMember ? "Edit Team Profile" : "Register Team Member"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Member Name */}
              <div className="space-y-2">
                <Label className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Organizer Full Name *
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

              {/* Department & Custom Dept */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Department *
                  </Label>
                  <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="flex h-10 w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {PREDEFINED_DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                    <option value="CUSTOM">+ Custom Department...</option>
                  </select>
                </div>
                {selectedDept === "CUSTOM" && (
                  <div className="space-y-2">
                    <Label className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Enter Custom Dept *
                    </Label>
                    <Input
                      type="text"
                      required
                      value={customDept}
                      onChange={(e) => setCustomDept(e.target.value)}
                      placeholder="e.g. VIP Management"
                      className="rounded-none border-border bg-background focus-visible:ring-primary"
                    />
                  </div>
                )}
              </div>

              {/* Role & Custom Role */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Role *
                  </Label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="flex h-10 w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {PREDEFINED_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                    <option value="CUSTOM">+ Custom Role...</option>
                  </select>
                </div>
                {selectedRole === "CUSTOM" && (
                  <div className="space-y-2">
                    <Label className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Enter Custom Role *
                    </Label>
                    <Input
                      type="text"
                      required
                      value={customRole}
                      onChange={(e) => setCustomRole(e.target.value)}
                      placeholder="e.g. Executive Director"
                      className="rounded-none border-border bg-background focus-visible:ring-primary"
                    />
                  </div>
                )}
              </div>

              {/* Custom Designation Option */}
              <div className="space-y-2">
                <Label className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Custom Designation Title (Optional)
                </Label>
                <Input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Head of Creative Strategy & Curation"
                  className="rounded-none border-border bg-background focus-visible:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Event Edition Link */}
                <div className="space-y-2">
                  <Label className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Event Edition Link
                  </Label>
                  <select
                    value={eventId}
                    onChange={(e) => setEventId(e.target.value)}
                    className="flex h-10 w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">General (No specific event)</option>
                    {events.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort Index */}
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

              {/* Biography */}
              <div className="space-y-2">
                <Label className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Biography (Optional)
                </Label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Short background summary..."
                  rows={2}
                  className="flex w-full border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                />
              </div>

              {/* Photograph Upload */}
              <div className="space-y-2">
                <Label className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Photograph URL
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
                  Save Profile
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
