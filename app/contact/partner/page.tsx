import type { Metadata } from "next";
import PartnerClient from "./PartnerClient";
import { constructMetadata } from "@/lib/seo";
import { getBreadcrumbSchema } from "@/lib/schema";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = constructMetadata({
  title: "Partner Application",
  description:
    "TEDxSMIU partner applications are currently closed. Check back later for updates.",
  path: "/contact/partner",
});

export default function PartnerPage() {
  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", item: "/" },
          { name: "Contact", item: "/contact" },
          { name: "Partner Application", item: "/contact/partner" },
        ])}
      />
      <PartnerClient />
    </>
  );
}