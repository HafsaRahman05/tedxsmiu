"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Globe, Mail, X } from "lucide-react";
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

type CoreTeamImage = {
  id: string;
  department: string;
  imageUrl: string;
  name: string | null;
  designation: string | null;
  bio: string | null;
  socialLinks: string | null;
  sortOrder: number;
};

function CoreTeamPhotoCard({
  member,
  index,
  isFlipped,
  onToggle,
}: {
  member: CoreTeamImage;
  index: number;
  isFlipped: boolean;
  onToggle: () => void;
}) {
  const socialLinks = normalizeSocialLinks(member.socialLinks);

  return (
    <div className="relative min-w-0" style={{ perspective: "1000px" }}>
      <motion.div
        className="relative aspect-[4/5] w-full min-w-0"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: "easeInOut" }}
      >
        <button
          type="button"
          onClick={onToggle}
          aria-label={`Show details for ${member.name || `team member ${index + 1}`}`}
          className="absolute inset-0 w-full overflow-hidden border border-neutral-800 bg-neutral-900 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EB0028]"
          style={{ backfaceVisibility: "hidden" }}
        >
          <Image
            src={member.imageUrl}
            alt={`${member.name || `${member.department} team member ${index + 1}`} portrait`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-top"
          />
        </button>

        <div
          role="button"
          tabIndex={0}
          aria-label={`Show photo for ${member.name || `team member ${index + 1}`}`}
          onClick={onToggle}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onToggle();
            }
          }}
          className="team-profile-scrollbar absolute inset-0 flex flex-col overflow-y-auto border border-neutral-700 bg-neutral-900 p-3 text-white sm:p-4 md:p-5"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#EB0028]">
            {member.department}
          </p>
          <h3 className="mt-2 break-words font-helvetica text-lg font-black uppercase leading-tight sm:text-xl">
            {member.name || "Name not added yet"}
          </h3>
          <p className="mt-2 break-words font-mono text-[9px] uppercase leading-relaxed tracking-[0.1em] text-neutral-300 sm:text-[10px] sm:tracking-[0.12em]">
            {member.designation || "Team member"}
          </p>
          {member.bio ? (
            <p className="mt-3 hidden flex-1 border-t border-neutral-700 pt-3 text-xs leading-relaxed text-neutral-300 lg:block">
              {member.bio}
            </p>
          ) : null}
          {socialLinks.length > 0 ? (
            <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-neutral-700 pt-3 sm:mt-4 sm:pt-4">
              {socialLinks.map((link, linkIndex) => {
                const isEmail = link.platform.toLowerCase() === "email";
                return (
                  <a
                    key={`${link.platform}-${linkIndex}`}
                    href={
                      isEmail && !link.url.startsWith("mailto:")
                        ? `mailto:${link.url}`
                        : link.url
                    }
                    target={isEmail ? undefined : "_blank"}
                    rel={isEmail ? undefined : "noopener noreferrer"}
                    aria-label={link.platform}
                    title={link.platform}
                    onClick={(event) => event.stopPropagation()}
                    onKeyDown={(event) => event.stopPropagation()}
                    className="text-neutral-300 transition-colors hover:text-[#EB0028]"
                  >
                    <SocialPlatformIcon platform={link.platform} />
                  </a>
                );
              })}
            </div>
          ) : (
            <p className="mt-4 border-t border-neutral-700 pt-4 font-mono text-[9px] uppercase tracking-[0.12em] text-neutral-500">
              Social links not added yet.
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

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
  if (normalizedPlatform.includes("ted")) {
    return (
      <span className="font-display text-[11px] font-black leading-none tracking-[-0.08em]">
        TED
      </span>
    );
  }
  if (normalizedPlatform.includes("link")) return <Globe className={iconClassName} />;
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

export default function TeamClient({
  initialTeam,
  coreTeam,
}: {
  initialTeam: TeamMemberRecord[];
  coreTeam: CoreTeamImage[];
}) {
  const [flippedId, setFlippedId] = useState<string | null>(null);
  const [flippedCoreTeamMemberId, setFlippedCoreTeamMemberId] = useState<
    string | null
  >(null);
  const [selectedCoreTeamId, setSelectedCoreTeamId] = useState<string | null>(null);
  const selectedCoreTeam = initialTeam.find(
    (member) => member.id === selectedCoreTeamId,
  );
  const selectedCoreTeamImages = selectedCoreTeam
    ? coreTeam.filter((image) => image.department === selectedCoreTeam.department)
    : [];
  const selectedCoreTeamSocialLinks = normalizeSocialLinks(
    selectedCoreTeam?.socialLinks,
  );

  useEffect(() => {
    if (!selectedCoreTeamId) return;

    const { body, documentElement } = document;
    const previousBodyOverflow = body.style.overflow;
    const previousDocumentOverflow = documentElement.style.overflow;
    body.style.overflow = "hidden";
    documentElement.style.overflow = "hidden";

    return () => {
      body.style.overflow = previousBodyOverflow;
      documentElement.style.overflow = previousDocumentOverflow;
    };
  }, [selectedCoreTeamId]);

  const gradients = [
    "linear-gradient(135deg,#7a1f19,#2b0f0d)",
    "linear-gradient(135deg,#16332c,#0b1210)",
    "linear-gradient(135deg,#241f4a,#10101a)",
    "linear-gradient(135deg,#3a2a10,#120d05)",
    "linear-gradient(135deg,#0e2a3a,#081116)",
    "linear-gradient(135deg,#3a1030,#120510)",
  ];

  return (
    <section className="border-b border-neutral-800/80 bg-neutral-950 px-3 py-9 sm:px-6 sm:py-12 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-7xl space-y-12 sm:space-y-14 lg:space-y-16">
        {initialTeam.length === 0 ? (
          <p className="border border-white/10 px-5 py-10 text-center font-mono text-xs uppercase tracking-[0.18em] text-neutral-500">
            Team profiles will be announced soon.
          </p>
        ) : (
          teamSections.map((section) => {
            const sectionMembers = initialTeam.filter((member) =>
              section.key === "Core Team"
                ? !["Chief", "Lead", "Organizer"].includes(member.role)
                : member.role === section.key
            );

            if (sectionMembers.length === 0) return null;

            return (
              <div key={section.key}>
                <div className="mb-5 flex flex-wrap items-end justify-between gap-x-4 gap-y-2 border-b border-white/10 pb-3 sm:mb-6 sm:pb-4">
                  <h2 className="mt-2 font-helvetica text-lg font-black uppercase tracking-tight text-white sm:text-2xl">
                    {section.label}
                  </h2>
                  <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-neutral-500 sm:text-[10px] sm:tracking-[0.2em]">
                    {sectionMembers.length} {sectionMembers.length === 1 ? "profile" : "profiles"}
                  </span>
                </div>

                <div className="grid grid-cols-1 items-start justify-items-center gap-4 min-[420px]:grid-cols-2 min-[420px]:justify-items-stretch sm:gap-5 md:grid-cols-3 lg:gap-6 xl:grid-cols-4">
                  {sectionMembers.map((member, i) => {
                    const isFlipped = flippedId === member.id;
                    const gradient = gradients[i % gradients.length];
                    const memberSocialLinks = normalizeSocialLinks(member.socialLinks);

                    if (section.key === "Core Team") {
                      const memberImages = coreTeam.filter(
                        (image) => image.department === member.department,
                      );

                      return (
                        <button
                          key={member.id}
                          type="button"
                          className="group relative aspect-[4/5] h-auto max-h-[420px] w-full max-w-[340px] overflow-hidden border border-neutral-800 bg-neutral-900 text-left transition-transform duration-300 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#EB0028] min-[420px]:max-w-none"
                          onClick={() => setSelectedCoreTeamId(member.id)}
                          aria-label={`View ${member.name} photos`}
                        >
                          <Image
                            src={
                              member.imageUrl ||
                              member.image_url ||
                              "/images/team/lead.jpg"
                            }
                            alt={`${member.name} group photo`}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                          <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/90 via-black/50 to-transparent px-5 pb-5 pt-16 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                            <span className="border border-white/50 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-white transition-colors group-hover:border-[#EB0028] group-hover:bg-[#EB0028]">
                              View team
                            </span>
                          </span>
                        </button>
                      );
                    }

                    return (
                      <div
                        key={member.id}
                        className="relative aspect-[4/5] h-auto max-h-[420px] w-full max-w-[340px] cursor-pointer transition-transform duration-300 hover:scale-[1.02] min-[420px]:max-w-none"
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
                            className="team-profile-scrollbar absolute inset-0 flex h-full w-full flex-col justify-between overflow-y-auto border border-neutral-800 bg-neutral-900 p-4 text-white shadow-2xl sm:p-5 lg:p-6"
                            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                          >
                            <div>
                              <span className="font-mono text-[14px] font-bold uppercase tracking-widest text-[#EB0028]">
                                {member.department}
                              </span>
                              <h3 className="mt-1 font-helvetica text-xl font-black uppercase text-white">
                                {member.name}
                              </h3>
                              <p className="mb-4 text-sm text-neutral-300">
                                {member.designation || member.role}
                              </p>
                              {member.bio ? (
                                <p className="border-t border-neutral-800 pt-4 text-xs leading-relaxed text-neutral-300">
                                  {member.bio}
                                </p>
                              ) : null}
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

        {selectedCoreTeam ? (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-transparent p-2 sm:p-4"
            onClick={() => setSelectedCoreTeamId(null)}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="selected-core-team-title"
              data-lenis-prevent
              className="relative flex h-[94dvh] max-h-[94dvh] w-full max-w-6xl flex-col overflow-hidden border border-neutral-700 bg-neutral-950 p-3 text-white shadow-2xl sm:h-[90dvh] sm:max-h-[90dvh] sm:p-6 lg:p-8"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelectedCoreTeamId(null)}
                aria-label="Close team photos"
                className="absolute right-3 top-3 z-10 border border-neutral-700 bg-neutral-950 p-2 text-neutral-300 transition-colors hover:border-[#EB0028] hover:text-white sm:right-4 sm:top-4"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mb-3 shrink-0 border-b border-neutral-800 pb-3 pr-10 sm:mb-5 sm:pb-5 sm:pr-12">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#EB0028]">
                  Core Team
                </span>
                <h2
                  id="selected-core-team-title"
                  className="mt-2 break-words font-helvetica text-xl font-black uppercase leading-tight sm:text-2xl lg:text-3xl"
                >
                  {selectedCoreTeam.name}
                </h2>

                {selectedCoreTeam.bio ? (
                  <p className="mt-2 line-clamp-3 max-w-4xl text-xs leading-relaxed text-neutral-300 sm:mt-3 sm:text-sm">
                    {selectedCoreTeam.bio}
                  </p>
                ) : null}
                {selectedCoreTeamSocialLinks.length > 0 ? (
                  <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-neutral-800 pt-3 sm:mt-4 sm:pt-4">
                    {selectedCoreTeamSocialLinks.map((link, index) => {
                      const isEmail = link.platform.toLowerCase() === "email";
                      return (
                        <a
                          key={`${link.platform}-${index}`}
                          href={
                            isEmail && !link.url.startsWith("mailto:")
                              ? `mailto:${link.url}`
                              : link.url
                          }
                          target={isEmail ? undefined : "_blank"}
                          rel={isEmail ? undefined : "noopener noreferrer"}
                          aria-label={link.platform}
                          title={link.platform}
                          className="text-neutral-400 transition-colors hover:text-[#EB0028]"
                        >
                          <SocialPlatformIcon platform={link.platform} />
                        </a>
                      );
                    })}
                  </div>
                ) : null}
              </div>

              {selectedCoreTeamImages.length > 0 ? (
                <div
                  data-lenis-prevent
                  className="scrollbar-hidden min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-contain"
                >
                  <div className="grid grid-cols-1 gap-3 pb-1 min-[380px]:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
                    {selectedCoreTeamImages.map((image, index) => (
                      <CoreTeamPhotoCard
                        key={image.id}
                        member={image}
                        index={index}
                        isFlipped={flippedCoreTeamMemberId === image.id}
                        onToggle={() =>
                          setFlippedCoreTeamMemberId((currentId) =>
                            currentId === image.id ? null : image.id,
                          )
                        }
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                  <p className="border border-neutral-800 px-5 py-10 text-center font-mono text-xs uppercase tracking-[0.16em] text-neutral-400">
                    Individual team photos will be added soon.
                  </p>
                </div>
              )}
            </section>
          </div>
        ) : null}
      </div>
    </section>
  );
}