// Runs in the browser. Wetherspoon's API sits behind a firewall that turns
// away server-side requests, but it allows cross-origin calls from browsers
// (the same way their own web ordering site uses it), so we call it from the
// client and do the ranking there.

import { type Drink, parseDrinks } from "../drinks";
import { type Venue, toVenues } from "../venues";
import type { ApiConfig } from "./config";
import type {
  ApiResponse,
  RawMenu,
  RawMenuSummary,
  RawVenue,
  RawVenueSummary,
} from "./types";

export class JdwApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "JdwApiError";
  }
}

async function apiGet<T>(config: ApiConfig, path: string): Promise<T> {
  const res = await fetch(`${config.baseUrl}${path}`, {
    headers: { Authorization: `Bearer ${config.key}` },
  });
  if (!res.ok) throw new JdwApiError(`GET ${path} failed`, res.status);

  const body = (await res.json()) as ApiResponse<T>;
  if (!body.success) throw new JdwApiError(`GET ${path} was unsuccessful`);
  return body.data;
}

// Small localStorage cache so repeat visits are instant. Storage can be
// unavailable (private mode, blocked cookies), which just means no caching.
type Stored<T> = { savedAt: number; value: T };

function readStored<T>(key: string, maxAgeMs: number): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const stored = JSON.parse(raw) as Stored<T>;
    return Date.now() - stored.savedAt < maxAgeMs ? stored.value : null;
  } catch {
    return null;
  }
}

function writeStored<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), value }));
  } catch {
    // Storage full or unavailable
  }
}

/** Drop cached entries under a prefix that are older than maxAgeMs */
function pruneStored(prefix: string, maxAgeMs: number) {
  try {
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith(prefix) && !readStored(key, maxAgeMs)) {
        localStorage.removeItem(key);
      }
    }
  } catch {
    // Storage unavailable
  }
}

// Requests in flight or finished during this page session, so moving between
// pages doesn't refetch
const inFlight = new Map<string, Promise<unknown>>();

function once<T>(key: string, load: () => Promise<T>): Promise<T> {
  const existing = inFlight.get(key) as Promise<T> | undefined;
  if (existing) return existing;
  const promise = load().catch((error) => {
    inFlight.delete(key);
    throw error;
  });
  inFlight.set(key, promise);
  return promise;
}

const HOUR = 60 * 60 * 1000;
const VENUES_KEY = "wetherspenny:venues:v1";

export function getVenues(config: ApiConfig): Promise<Venue[]> {
  return once("venues", async () => {
    const stored = readStored<Venue[]>(VENUES_KEY, 24 * HOUR);
    if (stored) return stored;
    const venues = toVenues(await apiGet<RawVenueSummary[]>(config, "/venues"));
    writeStored(VENUES_KEY, venues);
    return venues;
  });
}

export type PubDrinks = {
  currency: string;
  drinks: Drink[];
  fetchedAt: number;
};

// Everything that isn't drinks (food, coffee, charity badges...)
const NON_DRINK_MENU =
  /food|children|tea|coffee|soft|charity|badge|breakfast|dessert/i;

async function fetchPubDrinks(
  config: ApiConfig,
  venue: Venue,
): Promise<PubDrinks> {
  const base = `/${venue.franchise}/venues/${venue.ref}`;
  const detail = await apiGet<RawVenue>(config, base);
  const salesArea = detail.salesAreas[0];
  if (!salesArea) throw new JdwApiError("Venue has no sales areas");

  const menus = await apiGet<RawMenuSummary[]>(
    config,
    `${base}/sales-areas/${salesArea.id}/menus`,
  );
  const fullMenus = await Promise.all(
    menus
      .filter((menu) => !menu.isHidden && !NON_DRINK_MENU.test(menu.name))
      .map((menu) =>
        apiGet<RawMenu>(
          config,
          `${base}/sales-areas/${salesArea.id}/menus/${menu.id}`,
        ),
      ),
  );

  return {
    currency: detail.currency.symbol,
    drinks: parseDrinks(fullMenus),
    fetchedAt: Date.now(),
  };
}

const DRINKS_PREFIX = "wetherspenny:drinks:v1:";

export function getPubDrinks(
  config: ApiConfig,
  venue: Venue,
): Promise<PubDrinks> {
  const key = `${DRINKS_PREFIX}${venue.franchise}:${venue.ref}`;
  return once(key, async () => {
    const stored = readStored<PubDrinks>(key, HOUR);
    if (stored) return stored;
    const drinks = await fetchPubDrinks(config, venue);
    pruneStored(DRINKS_PREFIX, HOUR);
    writeStored(key, drinks);
    return drinks;
  });
}
