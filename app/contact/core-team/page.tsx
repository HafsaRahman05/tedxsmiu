import type { Metadata } from "next";
import CoreTeamClient from "./CoreTeamClient";
import { constructMetadata } from "@/lib/seo";
import { getBreadcrumbSchema } from "@/lib/schema";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = constructMetadata({
  title: "Core Team Applications",
  description:
    "Information about TEDxSMIU Core Team recruitment, leadership opportunities, and student organization roles at Sindh Madressatul Islam University.",
  path: "/contact/core-team",
});

export default function CoreTeamPage() {
  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", item: "/" },
          { name: "Contact", item: "/contact" },
          { name: "Core Team Applications", item: "/contact/core-team" },
        ])}
      />
      <CoreTeamClient />
    </>
  );
}