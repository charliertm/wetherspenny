"use client";

import {
  ChevronRight,
  LoaderCircle,
  LocateFixed,
  MapPin,
  Search,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ApiConfig } from "@/lib/jdw/config";
import { getVenues } from "@/lib/jdw/client";
import { useResource } from "@/lib/useResource";
import { haversine, searchable, type Venue } from "@/lib/venues";

type LocationState =
  | { status: "idle" }
  | { status: "locating" }
  | { status: "found"; here: { lat: number; lng: number } }
  | { status: "error"; message: string };

const MAX_RESULTS = 8;

function formatDistance(metres: number) {
  const miles = metres / 1609.344;
  if (miles < 0.1) return "Nearby";
  return `${miles < 10 ? miles.toFixed(1) : Math.round(miles)} mi`;
}

function PubRow({
  pub,
  detail,
  active,
  id,
}: {
  pub: Venue;
  detail?: string;
  active?: boolean;
  id?: string;
}) {
  return (
    <li id={id} role="option" aria-selected={active}>
      <Link
        href={`/${pub.slug}`}
        className={`flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-2 ${
          active ? "bg-surface-2" : ""
        }`}
      >
        <span className="min-w-0 flex-1">
          <span className="block truncate font-semibold">{pub.name}</span>
          <span className="block truncate text-sm text-muted">
            {[pub.town, pub.postcode].filter(Boolean).join(" · ")}
            {pub.isClosed && " · Temporarily closed"}
          </span>
        </span>
        {detail && (
          <span className="shrink-0 text-sm font-semibold text-green tabular-nums">
            {detail}
          </span>
        )}
        <ChevronRight className="size-4 shrink-0 text-muted" />
      </Link>
    </li>
  );
}

export default function PubFinder({ config }: { config: ApiConfig }) {
  const router = useRouter();
  const venues = useResource("venues", () => getVenues(config));
  const pubs = useMemo(
    () => (venues.status === "ready" ? venues.data : []),
    [venues],
  );
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [location, setLocation] = useState<LocationState>({ status: "idle" });
  const inputRef = useRef<HTMLInputElement>(null);

  const index = useMemo(
    () =>
      pubs.map((pub) => ({
        pub,
        name: searchable(pub.name),
        text: searchable(`${pub.name} ${pub.town} ${pub.postcode ?? ""}`),
      })),
    [pubs],
  );

  const results = useMemo(() => {
    const terms = searchable(query).split(" ").filter(Boolean);
    if (terms.length === 0) return [];
    return index
      .filter((entry) => terms.every((term) => entry.text.includes(term)))
      .sort(
        (a, b) =>
          Number(b.name.startsWith(terms[0])) -
            Number(a.name.startsWith(terms[0])) || a.name.localeCompare(b.name),
      )
      .slice(0, MAX_RESULTS)
      .map((entry) => entry.pub);
  }, [index, query]);

  const nearest = useMemo(() => {
    if (location.status !== "found" || pubs.length === 0) return null;
    return pubs
      .map((pub) => ({ ...pub, distance: haversine(location.here, pub) }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);
  }, [location, pubs]);
  const locating =
    location.status === "locating" ||
    (location.status === "found" && !nearest && venues.status === "loading");

  function locate() {
    if (!("geolocation" in navigator)) {
      setLocation({
        status: "error",
        message: "Location isn't available on this device",
      });
      return;
    }
    setLocation({ status: "locating" });
    navigator.geolocation.getCurrentPosition(
      ({ coords }) =>
        setLocation({
          status: "found",
          here: { lat: coords.latitude, lng: coords.longitude },
        }),
      (error) =>
        setLocation({
          status: "error",
          message:
            error.code === error.PERMISSION_DENIED
              ? "Location permission was denied"
              : "Couldn't find your location",
        }),
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 300_000 },
    );
  }

  // If location was allowed before, find the nearest pubs straight away
  useEffect(() => {
    navigator.permissions
      ?.query({ name: "geolocation" })
      .then((permission) => {
        if (permission.state === "granted") locate();
      })
      .catch(() => {});
  }, []);

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (results.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => (i - 1 + results.length) % results.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      router.push(`/${results[active].slug}`);
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={locate}
        disabled={locating}
        className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-blue px-4 text-base font-semibold text-white shadow-lg shadow-blue/25 transition hover:brightness-110 active:scale-[0.98] disabled:opacity-80"
      >
        {locating ? (
          <LoaderCircle className="size-5 animate-spin" />
        ) : (
          <LocateFixed className="size-5" />
        )}
        {locating ? "Finding your nearest Spoons…" : "Find my nearest Spoons"}
      </button>

      {location.status === "error" && (
        <p className="animate-fade text-center text-sm text-muted">
          {location.message}. Search for your pub instead.
        </p>
      )}

      {nearest && (
        <div className="animate-rise overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
          <p className="flex items-center gap-1.5 px-4 pt-3 text-xs font-semibold tracking-wide text-muted uppercase">
            <MapPin className="size-3.5" /> Closest to you
          </p>
          <ul className="divide-y divide-border">
            {nearest.map((pub) => (
              <PubRow
                key={pub.slug}
                pub={pub}
                detail={formatDistance(pub.distance)}
              />
            ))}
          </ul>
        </div>
      )}

      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-green" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          placeholder="Search by pub, town or postcode"
          aria-label="Search for a pub"
          role="combobox"
          aria-expanded={results.length > 0}
          aria-controls="pub-results"
          aria-activedescendant={
            results.length ? `pub-result-${active}` : undefined
          }
          autoComplete="off"
          enterKeyHint="go"
          className="h-14 w-full rounded-2xl border-2 border-green/30 bg-surface pr-12 pl-12 text-base font-medium shadow-sm transition outline-none placeholder:text-muted/70 focus:border-green focus:ring-4 focus:ring-green/15 [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute top-1/2 right-2 grid size-10 -translate-y-1/2 place-items-center rounded-full text-muted transition hover:bg-surface-2"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {venues.status === "error" && (
        <div className="animate-fade rounded-2xl border border-border bg-surface px-4 py-5 text-center shadow-sm">
          <p className="font-semibold">Couldn&apos;t load the pub list</p>
          <button
            type="button"
            onClick={venues.retry}
            className="mt-2 text-sm font-semibold text-blue"
          >
            Try again
          </button>
        </div>
      )}

      {query.trim() && venues.status !== "error" && (
        <div className="animate-fade overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
          {venues.status === "loading" ? (
            <p className="flex items-center justify-center gap-2 px-4 py-6 text-sm text-muted">
              <LoaderCircle className="size-4 animate-spin" />
              Loading pubs…
            </p>
          ) : results.length > 0 ? (
            <ul
              id="pub-results"
              role="listbox"
              className="divide-y divide-border"
            >
              {results.map((pub, i) => (
                <PubRow
                  key={pub.slug}
                  pub={pub}
                  id={`pub-result-${i}`}
                  active={i === active}
                />
              ))}
            </ul>
          ) : (
            <p className="px-4 py-6 text-center text-sm text-muted">
              No pubs match &ldquo;{query.trim()}&rdquo;
            </p>
          )}
        </div>
      )}

      <p className="pt-1 text-center text-xs text-muted">
        {venues.status === "ready" ? `${pubs.length} pubs` : "800+ pubs"} ·
        prices checked hourly
      </p>
    </div>
  );
}
