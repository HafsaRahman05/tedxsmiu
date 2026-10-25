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

type GalleryPageProps = {
  searchParams: Promise<{ year?: string }>;
};

export default async function GalleryPage({ searchParams }: GalleryPageProps) {
  const { year } = await searchParams;

  return (
    <PageShell>
      <GalleryArchive initialEdition={year} />
    </PageShell>
  );
}
