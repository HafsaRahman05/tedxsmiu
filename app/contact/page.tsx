import type { Metadata } from "next";
import ContactClient from "./ContactClient";
import { constructMetadata } from "@/lib/seo";
import { getBreadcrumbSchema } from "@/lib/schema";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = constructMetadata({
  title: "Contact Us",
  description:
    "Get in touch with the TEDxSMIU team. Apply as a speaker, partner, or volunteer at Sindh Madressatul Islam University.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", item: "/" },
          { name: "Contact", item: "/contact" },
        ])}
      />
      <ContactClient />
    </>
  );
}