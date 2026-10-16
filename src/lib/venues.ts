import type { RawVenueSummary } from "./jdw/types";

export type Venue = {
  ref: number;
  franchise: string;
  slug: string;
  name: string;
  town: string;
  county: string | null;
  postcode: string | null;
  country: string;
  lat: number;
  lng: number;
  isClosed: boolean;
};

export function slugify(text: string) {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/['’‘`]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Slugs look like "abraham-darby-brierley-hill", same as the original site */
export function toVenues(raw: RawVenueSummary[]): Venue[] {
  const bySlug = new Map<string, Venue>();
  const sorted = [...raw].sort((a, b) => a.venueRef - b.venueRef);

  for (const venue of sorted) {
    const town =
      venue.address.town?.trim() || venue.address.county?.trim() || "";
    const nameSlug = slugify(venue.name);
    const townSlug = slugify(town);
    let slug =
      townSlug && !nameSlug.includes(townSlug)
        ? `${nameSlug}-${townSlug}`
        : nameSlug;
    if (bySlug.has(slug)) slug = `${slug}-${venue.venueRef}`;

    bySlug.set(slug, {
      ref: venue.venueRef,
      franchise: venue.franchise,
      slug,
      name: venue.name.trim(),
      town,
      county: venue.address.county,
      postcode: venue.address.postcode,
      country: venue.address.country.code,
      lat: venue.address.location.latitude,
      lng: venue.address.location.longitude,
      isClosed: venue.isClosed || venue.status !== "open",
    });
  }

  return [...bySlug.values()].sort((a, b) => a.name.localeCompare(b.name));
}

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

/** Distance in metres between two coordinates */
export function haversine(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
) {
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(a.lat)) *
      Math.cos(toRadians(b.lat)) *
      Math.sin(dLng / 2) ** 2;
  return 2 * 6_371_000 * Math.asin(Math.sqrt(h));
}

/** Lowercase, accent and punctuation free text for matching searches */
export function searchable(text: string) {
  return slugify(text).replace(/-/g, " ");
}
