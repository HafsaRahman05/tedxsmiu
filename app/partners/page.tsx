import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import { db } from "@/lib/db";
import { sponsors } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

import { constructMetadata } from "@/lib/seo";
import { getBreadcrumbSchema } from "@/lib/schema";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = constructMetadata({
  title: "Partners",
  description:
    "Discover the visionary corporate, tech, and community partners that make TEDxSMIU possible at Sindh Madressatul Islam University.",
  path: "/partners",
});

const TIERS: Array<"TITLE" | "GOLD" | "SILVER" | "IN_KIND"> = [
  "TITLE",
  "GOLD",
  "SILVER",
  "IN_KIND",
];

function getFirstSocialUrl(socialLinks: string | null) {
  if (!socialLinks) return null;
  try {
    const parsed = JSON.parse(socialLinks);
    if (Array.isArray(parsed)) {
      return parsed.find((link) => typeof link?.url === "string")?.url || null;
    }
    return typeof parsed?.url === "string" ? parsed.url : null;
  } catch {
    return socialLinks.startsWith("http") ? socialLinks : null;
  }
}

export default async function PartnersPage() {
  const partnersList = await db
    .select()
    .from(sponsors)
    .where(eq(sponsors.status, "CONFIRMED"));

  const partnerYears = Array.from(
    new Set(partnersList.map((partner) => partner.eventYear || 2023)),
  ).sort((yearA, yearB) => yearB - yearA);

  return (
    <PageShell>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", item: "/" },
          { name: "Partners", item: "/partners" },
        ])}
      />
      <PageHero
        title="Partners"
        description="This event runs on the generosity of local and national partners who believe in student-led ideas."
        gradient="linear-gradient(135deg,#110303,#500a08,#EB0028)"
      />

      <section className="border-b border-white/10 bg-black px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-6xl space-y-14">
          {partnerYears.map((year) => (
            <div key={year} id={`event-year-${year}`} className="space-y-10 scroll-mt-28">
              <div className="border-b border-white/10 pb-4">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#EB0028]">
                  Event Edition
                </span>
                <h2 className="mt-2 font-helvetica text-3xl font-black uppercase text-white">
                  TEDxSMIU {year}
                </h2>
              </div>

              {TIERS.map((tier) => {
                const list = partnersList.filter(
                  (partner) =>
                    (partner.eventYear || 2023) === year &&
                    (partner.tier || "GOLD") === tier,
                );
                if (list.length === 0) return null;
                return (
                  <div key={`${year}-${tier}`}>
                    {/* <h3 className="mb-6 font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#EB0028]">
                      {tier.replace("_", " ")} Partner{list.length > 1 ? "s" : ""}
                    </h3> */}
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                      {list.map((p) => (
                        <div
                          key={p.id}
                          className="mx-auto flex h-[14rem] w-full max-w-[14rem] items-center justify-center overflow-hidden border border-neutral-800 bg-transparent text-center font-helvetica text-lg font-black uppercase text-white transition-all duration-300 sm:h-[15rem] sm:max-w-[15rem] md:h-[16rem] md:max-w-[16rem] lg:h-[17rem] lg:max-w-[17rem]"
                        >
                          {(() => {
                            const socialUrl = getFirstSocialUrl(p.socialLinks);
                            const href = socialUrl || p.websiteUrl;
                            const content = p.logoUrl ? (
                              <Image
                                src={p.logoUrl}
                                alt={`${p.name} logo`}
                                width={900}
                                height={900}
                                className="h-full w-full object-cover object-bottom"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center p-2 sm:p-3">
                                {p.name}
                              </div>
                            );

                            return href ? (
                              <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Open ${p.name} social link`}
                                className="flex h-full w-full items-center justify-center"
                              >
                                {content}
                              </a>
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                {content}
                              </div>
                            );
                          })()}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </section>

      {/* <section className="border-b border-white/10 bg-white/[0.02] px-6 py-20 lg:px-10">
        <div className="mx-auto flex max-w-4xl flex-col items-start gap-4">
          <h2 className="font-helvetica text-3xl font-black uppercase sm:text-4xl text-white">
            Interested in sponsoring next year&apos;s event?
          </h2>
          <p className="max-w-xl text-neutral-400 leading-relaxed">
            Existing partners can check event analytics, download brand
            assets, and manage their listing from the partner dashboard.
          </p>
          <Link
            href="/dashboard"
            className="mt-2 rounded-none bg-[#EB0028] px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.15em] text-white transition-opacity hover:opacity-90"
          >
            Go to Partner Dashboard
          </Link>
        </div>
      </section> */}
    </PageShell>
  );
}