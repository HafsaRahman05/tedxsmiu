"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Upload } from "lucide-react";
import { toast } from "sonner";
import { SocialLink } from "@/components/admin/SocialLinksInput";
import SocialLinksInput from "@/components/admin/SocialLinksInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CoreTeamProfile {
  id: string;
  teamId: string;
  teamName: string;
  department: string;
  imageUrl: string;
  name: string | null;
  designation: string | null;
  bio: string | null;
  socialLinks: SocialLink[];
  sortOrder: number;
}

export default function CoreTeamMembersClient({
  profiles,
}: {
  profiles: CoreTeamProfile[];
}) {
  const [department, setDepartment] = useState(
    profiles[0]?.department || "",
  );
  const departmentProfiles = profiles.filter(
    (profile) => profile.department === department,
  );
  const [selectedId, setSelectedId] = useState(
    departmentProfiles[0]?.id || "",
  );
  const selectedProfile = profiles.find(
    (profile) => profile.id === selectedId,
  );
  const [name, setName] = useState(selectedProfile?.name || "");
  const [designation, setDesignation] = useState(
    selectedProfile?.designation || "",
  );
  const [bio, setBio] = useState(selectedProfile?.bio || "");
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(
    selectedProfile?.socialLinks || [],
  );
  const [isSaving, setIsSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState(selectedProfile?.imageUrl || "");
  const [isUploading, setIsUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const departments = [...new Set(profiles.map((profile) => profile.department))];

  const selectProfile = (id: string) => {
    const profile = profiles.find((item) => item.id === id);
    setSelectedId(id);
    setName(profile?.name || "");
    setDesignation(profile?.designation || "");
    setBio(profile?.bio || "");
    setSocialLinks(profile?.socialLinks || []);
    setImageUrl(profile?.imageUrl || "");
  };

  const selectDepartment = (value: string) => {
    const nextProfile = profiles.find((profile) => profile.department === value);
    setDepartment(value);
    selectProfile(nextProfile?.id || "");
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedProfile) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/core-team/${selectedProfile.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || null,
          designation: designation.trim() || null,
          bio: bio.trim() || null,
          socialLinks: socialLinks.filter((link) => link.url.trim()),
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Could not save member profile");
      }

      selectedProfile.name = name.trim() || null;
      selectedProfile.designation = designation.trim() || null;
      selectedProfile.bio = bio.trim() || null;
      selectedProfile.socialLinks = socialLinks.filter((link) => link.url.trim());
      selectedProfile.imageUrl = imageUrl;
      toast.success("Member profile saved");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not save member profile",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !selectedProfile) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "core-team");

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const uploadResult = await uploadResponse.json();
      if (!uploadResponse.ok || typeof uploadResult.url !== "string") {
        throw new Error(uploadResult.error || "Could not upload the member photo");
      }

      const profileResponse = await fetch(`/api/core-team/${selectedProfile.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || null,
          designation: designation.trim() || null,
          bio: bio.trim() || null,
          imageUrl: uploadResult.url,
          socialLinks: socialLinks.filter((link) => link.url.trim()),
        }),
      });
      if (!profileResponse.ok) {
        const result = await profileResponse.json();
        throw new Error(result.error || "Photo uploaded but profile could not be updated");
      }

      setImageUrl(uploadResult.url);
      selectedProfile.imageUrl = uploadResult.url;
      toast.success("Member photo updated");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not update the member photo",
      );
    } finally {
      setIsUploading(false);
    }
  };

  if (!selectedProfile) {
    return (
      <main className="p-6">
        <p className="border border-border p-8 text-center font-mono text-xs uppercase text-muted-foreground">
          No core team member photos found.
        </p>
      </main>
    );
  }

  const memberNumber =
    departmentProfiles.findIndex((profile) => profile.id === selectedProfile.id) + 1;

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 p-6 sm:p-10">
      <header className="space-y-2 border-b border-border pb-6">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
          Core team
        </p>
        <h1 className="font-display text-3xl font-black uppercase text-foreground">
          Individual Member Profiles
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Add each member&apos;s real name, role, bio and social accounts. Only
          details you enter here appear on the back of their photo.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <section className="space-y-5 border border-border bg-card p-5">
          <div className="space-y-2">
            <Label htmlFor="core-team-department">Team</Label>
            <select
              id="core-team-department"
              value={department}
              onChange={(event) => selectDepartment(event.target.value)}
              className="h-10 w-full border border-border bg-background px-3 text-sm text-foreground"
            >
              {departments.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="core-team-member">Member photo</Label>
            <select
              id="core-team-member"
              value={selectedProfile.id}
              onChange={(event) => selectProfile(event.target.value)}
              className="h-10 w-full border border-border bg-background px-3 text-sm text-foreground"
            >
              {departmentProfiles.map((profile, index) => (
                <option key={profile.id} value={profile.id}>
                  {profile.name || `Member ${String(index + 1).padStart(2, "0")}`}
                </option>
              ))}
            </select>
          </div>

          <div className="relative aspect-[4/5] max-h-[480px] overflow-hidden border border-border bg-background">
            <Image
              src={imageUrl}
              alt={`${selectedProfile.department} member ${memberNumber}`}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-top"
            />
          </div>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="hidden"
            onChange={handleImageUpload}
          />
          <Button
            type="button"
            variant="outline"
            className="w-full rounded-none"
            disabled={isUploading}
            onClick={() => imageInputRef.current?.click()}
          >
            {isUploading ? (
              <Upload className="h-4 w-4 animate-pulse" />
            ) : (
              <ImagePlus className="h-4 w-4" />
            )}
            {isUploading ? "Uploading photo..." : "Change member photo"}
          </Button>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            {selectedProfile.teamName} / Member {String(memberNumber).padStart(2, "0")}
          </p>
        </section>

        <form
          onSubmit={handleSave}
          className="space-y-5 border border-border bg-card p-5"
        >
          <div className="space-y-2">
            <Label htmlFor="member-name">Full name</Label>
            <Input
              id="member-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter the member's real name"
              maxLength={120}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="member-designation">Role / designation</Label>
            <Input
              id="member-designation"
              value={designation}
              onChange={(event) => setDesignation(event.target.value)}
              placeholder="For example, Content Writer"
              maxLength={160}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="member-bio">Short bio</Label>
            <textarea
              id="member-bio"
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              placeholder="Add a short introduction"
              maxLength={2000}
              rows={5}
              className="w-full border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>

          <SocialLinksInput
            links={socialLinks}
            onChange={setSocialLinks}
            maxLinks={5}
          />

          <Button type="submit" disabled={isSaving} className="w-full">
            {isSaving ? "Saving..." : "Save member profile"}
          </Button>
        </form>
      </div>
    </main>
  );
}
