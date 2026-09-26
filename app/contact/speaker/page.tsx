import type { Metadata } from "next";
import SpeakerClient from "./SpeakerClient";
import { constructMetadata } from "@/lib/seo";
import { getBreadcrumbSchema } from "@/lib/schema";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = constructMetadata({
  title: "Nominate a Speaker",
  description:
    "Nominate yourself or a visionary thinker to speak on the TEDxSMIU stage at Sindh Madressatul Islam University.",
  path: "/contact/speaker",
});

export default function SpeakerPage() {
  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", item: "/" },
          { name: "Contact", item: "/contact" },
          { name: "Nominate a Speaker", item: "/contact/speaker" },
        ])}
      />
      <SpeakerClient />
    </>
  );
}