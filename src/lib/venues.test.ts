import { describe, expect, it } from "vitest";
import type { RawVenueSummary } from "./jdw/types";
import { haversine, slugify, toVenues } from "./venues";

function venue(venueRef: number, name: string, town: string): RawVenueSummary {
  return {
    franchise: "jdw",
    id: venueRef,
    venueRef,
    name,
    status: "open",
    type: "pub",
    isClosed: false,
    address: {
      line1: null,
      line2: null,
      line3: null,
      town,
      county: null,
      postcode: null,
      country: { name: "England", code: "GB" },
      location: { latitude: 52.5, longitude: -2 },
    },
  };
}

describe("slugify", () => {
  it("handles accents, apostrophes and ampersands", () => {
    expect(slugify("St. Matthew’s Hall")).toBe("st-matthews-hall");
    expect(slugify("Dún Laoghaire")).toBe("dun-laoghaire");
    expect(slugify("The Rose & Crown")).toBe("the-rose-and-crown");
  });
});

describe("toVenues", () => {
  it("builds slugs like the original site and avoids clashes", () => {
    const venues = toVenues([
      venue(5243, "Abraham Darby", "Brierley Hill"),
      venue(606, "The Moon Under Water, Boston", "Boston"),
      venue(900, "The Railway", "Leeds"),
      venue(901, "The Railway", "Leeds"),
    ]);
    expect(venues.map((v) => v.slug)).toEqual([
      "abraham-darby-brierley-hill",
      "the-moon-under-water-boston",
      "the-railway-leeds",
      "the-railway-leeds-901",
    ]);
  });
});

describe("haversine", () => {
  it("measures distance in metres", () => {
    const london = { lat: 51.5074, lng: -0.1278 };
    const birmingham = { lat: 52.4862, lng: -1.8904 };
    expect(haversine(london, birmingham) / 1000).toBeCloseTo(162.5, 0);
  });
});
