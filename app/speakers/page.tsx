import type { Metadata } from "next";
import SpeakersClient from "./SpeakersClient";
import { constructMetadata } from "@/lib/seo";
import { getBreadcrumbSchema } from "@/lib/schema";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = constructMetadata({
  title: "Speakers",
  description:
    "Meet the visionary speakers, researchers, artists, and innovators featured on stage at TEDxSMIU.",
  path: "/speakers",
});

export default function SpeakersPage() {
  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", item: "/" },
          { name: "Speakers", item: "/speakers" },
        ])}
      />
      <SpeakersClient />
    </>
  );
}