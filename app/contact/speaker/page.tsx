import type { Metadata } from "next";
import SpeakerClient from "./SpeakerClient";
import { constructMetadata } from "@/lib/seo";
import { getBreadcrumbSchema } from "@/lib/schema";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = constructMetadata({
  title: "Nominate a Speaker",
  description:
    "TEDxSMIU speaker applications are currently closed. Check back later for updates.",
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