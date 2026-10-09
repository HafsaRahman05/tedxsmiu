export type GalleryMedia = {
  id: string;
  type: "IMAGE" | "VIDEO";
  url: string;
  altText: string | null;
  eventId: string | null;
  albumName: string | null;
  createdAt: string | Date;
};

export type GalleryEvent = {
  id: string;
  title: string;
  slug: string;
  date: string | Date;
  coverImageUrl: string | null;
  eventSpeakers?: {
    id: string;
    talkTitle: string;
    youtubeUrl: string | null;
    speaker: { name: string; imageUrl: string | null } | null;
  }[];
};

export type GalleryCollection = {
  key: string;
  eventId: string;
  eventTitle: string;
  eventDate: string | Date | null;
  coverImageUrl: string | null;
  albumName: string | null;
  items: GalleryMedia[];
  talks: NonNullable<GalleryEvent["eventSpeakers"]>;
};

export function encodeGalleryAlbum(albumName: string | null) {
  if (albumName === null) return "none";

  return Array.from(new TextEncoder().encode(albumName), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

export function decodeGalleryAlbum(albumKey: string): string | null | undefined {
  if (albumKey === "none") return null;
  if (!albumKey || albumKey.length % 2 !== 0 || !/^[\da-f]+$/i.test(albumKey)) {
    return undefined;
  }

  const bytes = new Uint8Array(
    albumKey.match(/.{2}/g)!.map((byte) => Number.parseInt(byte, 16)),
  );

  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return undefined;
  }
}

export function galleryCollectionHref(collection: GalleryCollection) {
  return `/gallery/${collection.eventId}/${encodeGalleryAlbum(collection.albumName)}`;
}

export function buildGalleryCollections(
  events: GalleryEvent[],
  media: GalleryMedia[],
): GalleryCollection[] {
  const eventsById = new Map(events.map((event) => [event.id, event]));
  const collections = new Map<string, GalleryCollection>();

  for (const item of media) {
    const eventId = item.eventId ?? "community";
    const key = `${eventId}:${item.albumName ?? ""}`;
    const event = item.eventId ? eventsById.get(item.eventId) : undefined;
    let collection = collections.get(key);

    if (!collection) {
      collection = {
        key,
        eventId,
        eventTitle: event?.title ?? "TEDxSMIU Community",
        eventDate: event?.date ?? null,
        coverImageUrl: event?.coverImageUrl ?? null,
        albumName: item.albumName,
        items: [],
        talks: event?.eventSpeakers ?? [],
      };
      collections.set(key, collection);
    }

    collection.items.push(item);
  }

  for (const event of events) {
    const talks = event.eventSpeakers ?? [];
    if (!talks.some((talk) => talk.youtubeUrl)) continue;

    const eventCollection = Array.from(collections.values()).find(
      (collection) => collection.eventId === event.id && collection.albumName === "Speakers & talks",
    );

    if (eventCollection) {
      eventCollection.talks = talks;
      continue;
    }

    const key = `${event.id}:Speakers & talks`;
    collections.set(key, {
      key,
      eventId: event.id,
      eventTitle: event.title,
      eventDate: event.date,
      coverImageUrl: event.coverImageUrl,
      albumName: "Speakers & talks",
      items: [],
      talks,
    });
  }

  return Array.from(collections.values()).sort((a, b) => {
    const dateDifference =
      new Date(b.eventDate ?? 0).getTime() - new Date(a.eventDate ?? 0).getTime();
    if (dateDifference !== 0) return dateDifference;
    return (a.albumName ?? "").localeCompare(b.albumName ?? "");
  });
}
