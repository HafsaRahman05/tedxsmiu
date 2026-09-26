"use client";

import React from "react";

interface SocialLink {
  platform: string;
  url: string;
}

interface TeamMember {
    id: string;
    name: string;
    role: string;
    department?: string | null;
    designation?: string | null;
    imageUrl?: string | null;
    bio?: string | null;
    socialLinks?: string | null | any[];
    gradient?: string;
    group?: string;
}

export default function TeamCard({ member }: { member: TeamMember }) {
  const parsedLinks: SocialLink[] =
    typeof member.socialLinks === "string"
      ? JSON.parse(member.socialLinks || "[]")
      : member.socialLinks || [];

  return (
    <div className="group relative mx-auto h-[19rem] w-full max-w-[16rem] cursor-pointer overflow-hidden border border-neutral-800 bg-transparent transition-all duration-300 sm:h-[21rem] sm:max-w-[17rem] md:h-[22.5rem] md:max-w-[18rem] lg:h-[24rem]">
      <img
        src={member.imageUrl || "https://via.placeholder.com/300"}
        alt={member.name}
        className="absolute inset-0 h-full w-full object-cover  brightness-100 transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0 group-hover:brightness-100"
      />
      <div className="relative z-10 flex h-full flex-col justify-end p-4 sm:p-5">
        {/* <div className="transition-transform duration-300 ease-out group-hover:-translate-y-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#EB0028] sm:text-xs">
            {member.department}
          </span>
          <h3 className="mt-1 text-lg font-bold text-white sm:text-xl">{member.name}</h3>
          <p className="text-xs text-gray-300 sm:text-sm">{member.role}</p>
        </div> */}

        <div className="mt-3 overflow-hidden">
          <div className="max-h-0 opacity-0 transition-all duration-300 ease-out group-hover:max-h-72 group-hover:opacity-100">
          
            <p className="text-xs leading-relaxed text-white sm:text-sm">
              {member.bio }
            </p>

            {parsedLinks.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {parsedLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-none border border-[#EB0028]/60 bg-[#EB0028]/80 px-2 py-1 text-[10px] capitalize transition-colors hover:bg-[#EB0028]/20 sm:px-3 sm:text-xs"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {link.platform}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}