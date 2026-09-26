import type { Metadata } from "next";
import TalksClient from "./TalksClient";
import { constructMetadata } from "@/lib/seo";
import { getBreadcrumbSchema } from "@/lib/schema";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = constructMetadata({
  title: "Talks Archive",
  description:
    "Explore the complete video archive of TEDxSMIU talks. Filter by topic, science, design, climate, and human innovation.",
  path: "/talks",
});

export default function TalksPage() {
  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", item: "/" },
          { name: "Talks", item: "/talks" },
        ])}
      />
      <TalksClient />
    </>
  );
}