"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Globe, Mail } from "lucide-react";
import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaSquareXTwitter,
  FaYoutube,
} from "react-icons/fa6";

type TeamMemberRecord = {
  id: string;
  name: string;
  role: string;
  department: string;
  designation?: string | null;
  imageUrl?: string | null;
  image_url?: string | null;
  bio?: string | null;
  socialLinks?: string | null;
  sortOrder?: number | null;
  createdAt: Date;
  updatedAt: Date;
  eventId?: string | null;
};

type TeamSocialLink = { platform: string; url: string };

function SocialPlatformIcon({ platform }: { platform: string }) {
  const normalizedPlatform = platform.toLowerCase();
  const iconClassName = "h-4.5 w-4.5";

  if (normalizedPlatform.includes("linkedin")) {
    return <span className="font-sans text-lg font-black leading-none tracking-[-0.08em]">in</span>;
  }
  if (normalizedPlatform.includes("instagram")) return <FaInstagram className={iconClassName} />;
  if (normalizedPlatform.includes("twitter") || normalizedPlatform === "x") return <FaSquareXTwitter className={iconClassName} />;
  if (normalizedPlatform.includes("facebook")) return <FaFacebook className={iconClassName} />;
  if (normalizedPlatform.includes("youtube")) return <FaYoutube className={iconClassName} />;
  if (normalizedPlatform.includes("github")) return <FaGithub className={iconClassName} />;
  if (normalizedPlatform.includes("email")) return <Mail className={iconClassName} />;
  return <Globe className={iconClassName} />;
}

function normalizeSocialLinks(value: TeamMemberRecord["socialLinks"]): TeamSocialLink[] {
  if (!value) return [];
  let parsed: unknown = value;
  if (typeof parsed === "string") {
    const rawValue = parsed;
    try {
      parsed = JSON.parse(rawValue);
    } catch {
      return rawValue.trim() ? [{ platform: "Link", url: rawValue.trim() }] : [];
    }
  }

  const parsedLinks: unknown[] = Array.isArray(parsed) ? parsed : [];
  return parsedLinks.flatMap((link): TeamSocialLink[] => {
    if (typeof link === "string") {
      return link.trim() ? [{ platform: "Link", url: link.trim() }] : [];
    }
    if (!link || typeof link !== "object") return [];
    const record = link as Record<string, unknown>;
    if (typeof record.url !== "string") return [];
    return [{
      platform: typeof record.platform === "string" ? record.platform : "Link",
      url: record.url.trim(),
    }].filter((item) => item.url);
  });
}

const teamSections = [
  { key: "Chief", label: "Chief Leadership" },
  { key: "Lead", label: "Leads & Heads" },
  { key: "Organizer", label: "Organizers" },
  { key: "Core Team", label: "Core Team Members" },
] as const;

export default function TeamClient({ initialTeam }: { initialTeam: TeamMemberRecord[] }) {
  const [flippedId, setFlippedId] = useState<string | null>(null);

  const gradients = [
    "linear-gradient(135deg,#7a1f19,#2b0f0d)",
    "linear-gradient(135deg,#16332c,#0b1210)",
    "linear-gradient(135deg,#241f4a,#10101a)",
    "linear-gradient(135deg,#3a2a10,#120d05)",
    "linear-gradient(135deg,#0e2a3a,#081116)",
    "linear-gradient(135deg,#3a1030,#120510)",
  ];

  return (
    <section className="border-b border-neutral-800/80 bg-neutral-950 px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-16">
        {initialTeam.length === 0 ? (
          <p className="border border-white/10 px-5 py-10 text-center font-mono text-xs uppercase tracking-[0.18em] text-neutral-500">
            Team profiles will be announced soon.
          </p>
        ) : (
          teamSections.map((section) => {
            const sectionMembers = initialTeam.filter((member) =>
              section.key === "Core Team"
                ? !member.role || !["Chief", "Lead", "Organizer"].includes(member.role)
                : member.role === section.key
            );

            if (sectionMembers.length === 0) return null;

            return (
              <div key={section.key}>
                <div className="mb-6 flex items-end justify-between border-b border-white/10 pb-4">
                  <h2 className="mt-2 font-helvetica text-[20px] font-black uppercase tracking-tight text-white sm:text-2xl">
                    {section.label}
                  </h2>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                    {sectionMembers.length} {sectionMembers.length === 1 ? "profile" : "profiles"}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {sectionMembers.map((member, i) => {
                    const isFlipped = flippedId === member.id;
                    const gradient = gradients[i % gradients.length];
                    const memberSocialLinks = normalizeSocialLinks(member.socialLinks);

                    return (
                      <div
                        key={member.id}
                        className="relative h-[420px] w-full cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
                        style={{ perspective: "1000px" }}
                        onClick={() => setFlippedId(isFlipped ? null : member.id)}
                      >
                        <motion.div
                          className="relative h-full w-full shadow-xl"
                          style={{ transformStyle: "preserve-3d" }}
                          animate={{ rotateY: isFlipped ? 180 : 0 }}
                          transition={{ duration: 0.6, ease: "easeInOut" }}
                        >
                          {/* FRONT FACE (Sharp corners, no overlay, no tags) */}
                          <div 
                            className="absolute inset-0 h-full w-full overflow-hidden border border-neutral-800 bg-neutral-900"
                            style={{ backfaceVisibility: "hidden" }}
                          >
                            <div className="relative h-full w-full" style={{ background: gradient }}>
                              <Image
                                src={member.imageUrl || member.image_url || "/images/team/lead.jpg"}
                                alt={member.name}
                                fill
                                className="object-cover object-top"
                              />
                            </div>
                          </div>

                          {/* BACK FACE (Sharp corners, shows info after flip) */}
                          <div 
                            className="absolute inset-0 h-full w-full overflow-y-auto border border-neutral-800 bg-neutral-900 p-6 text-white shadow-2xl flex flex-col justify-between"
                            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                          >
                            <div>
                              <span className="font-mono text-[14px] font-bold uppercase tracking-widest text-[#EB0028]">
                                {member.department}
                              </span>
                              <h3 className="mt-1 font-helvetica text-xl font-black uppercase text-white">
                                {member.name}
                              </h3>
                              <p className="text-sm text-neutral-300 mb-4">
                                {member.designation || member.role}
                              </p>
                              
                              <div className="border-t border-neutral-800 pt-4">
                                <h4 className="mb-2 font-mono text-[10px] uppercase tracking-wider text-neutral-400">
                                  About the Member
                                </h4>
                                <p className="text-xs leading-relaxed text-neutral-300">
                                  {member.bio || "Team member biography details will be updated soon."}
                                </p>
                              </div>
                            </div>

                            {memberSocialLinks.length > 0 && (
                              <div 
                                className="flex items-center gap-3 pt-4 border-t border-neutral-800"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {memberSocialLinks.map((link, idx) => {
                                  const isEmail = link.platform.toLowerCase() === "email";
                                  return (
                                    <a
                                      key={`${link.platform}-${idx}`}
                                      href={isEmail && !link.url.startsWith("mailto:") ? `mailto:${link.url}` : link.url}
                                      target={isEmail ? undefined : "_blank"}
                                      rel={isEmail ? undefined : "noopener noreferrer"}
                                      aria-label={link.platform}
                                      title={link.platform}
                                      className="text-neutral-400 transition-all duration-200 hover:scale-110 hover:text-[#EB0028]"
                                    >
                                      <SocialPlatformIcon platform={link.platform} />
                                    </a>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}