"use client";

import React from "react";
import { Plus, Trash2, Globe, Mail } from "lucide-react";
import {
  FaLinkedin,
  FaSquareXTwitter,
  FaInstagram,
  FaFacebook,
  FaYoutube,
  FaGithub,
  FaGlobe,
} from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface SocialLink {
  platform: string;
  url: string;
}

interface SocialLinksInputProps {
  links: SocialLink[];
  onChange: (links: SocialLink[]) => void;
}

const PLATFORMS = [
  { value: "email", label: "Email", icon: Mail },
  { value: "linkedin", label: "LinkedIn", icon: FaLinkedin },
  { value: "twitter", label: "Twitter / X", icon: FaSquareXTwitter },
  { value: "instagram", label: "Instagram", icon: FaInstagram },
  { value: "facebook", label: "Facebook", icon: FaFacebook },
  { value: "youtube", label: "YouTube", icon: FaYoutube },
  { value: "github", label: "GitHub", icon: FaGithub },
  { value: "website", label: "Website", icon: FaGlobe },
  { value: "other", label: "Other Link", icon: Globe },
];

export default function SocialLinksInput({ links, onChange }: SocialLinksInputProps) {
  const addLink = () => {
    onChange([...links, { platform: "linkedin", url: "" }]);
  };

  const removeLink = (index: number) => {
    onChange(links.filter((_, i) => i !== index));
  };

  const updateLink = (index: number, field: keyof SocialLink, value: string) => {
    const updated = [...links];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Social Links ({links.length})
        </label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addLink}
          className="h-7 px-2 font-mono text-[10px] font-bold uppercase gap-1 rounded-none border-border"
        >
          <Plus className="h-3 w-3" /> Add Link
        </Button>
      </div>

      {links.length === 0 ? (
        <div className="p-3 border border-dashed border-border text-center font-mono text-xs text-muted-foreground">
          No social links added yet. Click "Add Link" to add social profiles.
        </div>
      ) : (
        <div className="space-y-2">
          {links.map((link, idx) => {
            const platformConfig = PLATFORMS.find((p) => p.value === link.platform) || PLATFORMS[0];
            const Icon = platformConfig.icon;

            return (
              <div key={idx} className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 border border-border bg-background px-2 h-9">
                  <Icon className="h-4 w-4 text-primary shrink-0" />
                  <select
                    value={link.platform}
                    onChange={(e) => updateLink(idx, "platform", e.target.value)}
                    className="bg-transparent font-mono text-xs font-bold text-foreground focus:outline-none cursor-pointer"
                  >
                    {PLATFORMS.map((p) => (
                      <option key={p.value} value={p.value} className="bg-card text-foreground">
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  type={link.platform === "email" ? "text" : "url"}
                  placeholder={link.platform === "email" ? "name@domain.com" : `https://${link.platform}.com/username`}
                  value={link.url}
                  onChange={(e) => updateLink(idx, "url", e.target.value)}
                  className="rounded-none border-border bg-background focus-visible:ring-primary flex-1 h-9 text-xs"
                />

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeLink(idx)}
                  className="h-9 w-9 shrink-0 rounded-none border-border hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
