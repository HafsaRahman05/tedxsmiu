import type { Metadata } from "next";
import ContactClient from "./ContactClient";
import { constructMetadata } from "@/lib/seo";
import { getBreadcrumbSchema } from "@/lib/schema";
import JsonLd from "@/components/seo/JsonLd";
import { db } from "@/lib/db";
import { speakers, sponsors } from "@/lib/db/schema";
import { count, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = constructMetadata({
  title: "Contact Us",
  description:
    "Get in touch with the TEDxSMIU team. Apply as a speaker, partner, or volunteer at Sindh Madressatul Islam University.",
  path: "/contact",
});

export default async function ContactPage() {
  const [speakerCount, partnerCount] = await Promise.all([
    db
      .select({ value: count() })
      .from(speakers)
      .where(eq(speakers.status, "ACCEPTED")),
    db
      .select({ value: count() })
      .from(sponsors)
      .where(eq(sponsors.status, "CONFIRMED")),
  ]);
  const stats = {
    speakerCount: speakerCount[0].value,
    partnerCount: partnerCount[0].value,
  };

  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", item: "/" },
          { name: "Contact", item: "/contact" },
        ])}
      />
      <ContactClient stats={stats} />
    </>
  );
}