import type { Metadata } from "next";
import BlogClient from "./BlogClient";
import { constructMetadata } from "@/lib/seo";
import { getBreadcrumbSchema } from "@/lib/schema";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = constructMetadata({
  title: "Blog & Dispatches",
  description:
    "Read dispatches, essays, and stories from speakers, student organizers, and thought leaders at TEDxSMIU.",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", item: "/" },
          { name: "Blog", item: "/blog" },
        ])}
      />
      <BlogClient />
    </>
  );
}