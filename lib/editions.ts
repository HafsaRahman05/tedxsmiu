type EditionEvent = {
  id?: string;
  slug?: string | null;
  title?: string | null;
  date?: string | Date | null;
};

function yearInText(value?: string | null) {
  const match = value?.match(/\b(20\d{2})\b/);
  return match ? Number(match[1]) : null;
}

export function editionYearFromEvent(event?: EditionEvent | null): number | null {
  if (!event) return null;

  const slugYear = yearInText(event.slug);
  if (slugYear) return slugYear;

  if (event.date) {
    const year = new Date(event.date).getFullYear();
    if (year >= 2000 && year <= 2100) return year;
  }

  return yearInText(event.title);
}

export function teamMemberEditionYear(
  eventId: string | null | undefined,
  events: EditionEvent[],
) {
  if (!eventId) return 2026;
  const event = events.find((candidate) => candidate.id === eventId);
  return editionYearFromEvent(event) ?? 2026;
}
