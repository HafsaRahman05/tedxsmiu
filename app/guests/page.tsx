import type { Metadata } from "next";
import GuestsClient from "./GuestsClient";
import { constructMetadata } from "@/lib/seo";
import { getBreadcrumbSchema } from "@/lib/schema";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = constructMetadata({
  title: "Guests",
  description: "Meet the special guests joining TEDxSMIU.",
  path: "/guests",
});

export default function GuestsPage() {
  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", item: "/" },
          { name: "Guests", item: "/guests" },
        ])}
      />
      <GuestsClient />
    </>
  );
}