import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import GalleryArchive from "@/components/GalleryArchive";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Event Gallery",
  description:
    "Explore photographs, event videos, and speaker talks from the TEDxSMIU community.",
  path: "/gallery",
});

export default function GalleryPage() {
  return (
    <PageShell>
      <GalleryArchive />
    </PageShell>
  );
}
