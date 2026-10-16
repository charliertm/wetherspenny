"use client";

import { MapPin, RefreshCw } from "lucide-react";
import Link from "next/link";
import type { ApiConfig } from "@/lib/jdw/config";
import { getPubDrinks, getVenues } from "@/lib/jdw/client";
import { useResource } from "@/lib/useResource";
import type { Venue } from "@/lib/venues";
import DrinkExplorer from "./DrinkExplorer";

function ErrorCard({
  title,
  message,
  retry,
}: {
  title: string;
  message: string;
  retry?: () => void;
}) {
  return (
    <div className="mx-4 animate-rise rounded-3xl bg-surface px-6 py-10 text-center shadow-lg shadow-black/10">
      <p className="text-lg font-bold">{title}</p>
      <p className="mt-1.5 text-sm text-muted">{message}</p>
      <div className="mt-5 flex justify-center gap-2.5">
        {retry && (
          <button
            type="button"
            onClick={retry}
            className="inline-flex h-11 items-center gap-2 rounded-2xl bg-blue px-5 font-semibold text-white transition active:scale-95"
          >
            <RefreshCw className="size-4" />
            Try again
          </button>
        )}
        <Link
          href="/"
          className="inline-flex h-11 items-center rounded-2xl bg-surface-2 px-5 font-semibold transition active:scale-95"
        >
          Pick another pub
        </Link>
      </div>
    </div>
  );
}

export function HeadingSkeleton() {
  return (
    <div className="px-4 pt-6 pb-5" aria-hidden>
      <div className="h-9 w-3/4 animate-pulse rounded-xl bg-white/20" />
      <div className="mt-3 h-5 w-1/2 animate-pulse rounded-lg bg-white/15" />
    </div>
  );
}

export function DrinksSkeleton() {
  return (
    <div className="px-4" aria-busy aria-label="Loading drinks">
      <div className="grid grid-cols-2 gap-2.5">
        {[0, 1].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-3xl bg-white/12" />
        ))}
      </div>
      <div className="mt-5 h-12 animate-pulse rounded-2xl bg-white/25" />
      <div className="mt-3 flex gap-2">
        {[64, 96, 72, 88].map((width) => (
          <div
            key={width}
            className="h-8 animate-pulse rounded-full bg-white/12"
            style={{ width }}
          />
        ))}
      </div>
      <div className="mt-5 space-y-2.5">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-3xl bg-surface/60"
            style={{ animationDelay: `${i * 80}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

function PubHeading({ venue }: { venue: Venue }) {
  return (
    <header className="animate-rise px-4 pt-6 pb-5 text-white">
      <h1 className="text-3xl leading-tight font-extrabold tracking-tight text-balance">
        {venue.name}
      </h1>
      <p className="mt-1.5 flex items-center gap-1.5 text-white/80">
        <MapPin className="size-4 shrink-0" />
        <span className="truncate">
          {[venue.town, venue.postcode].filter(Boolean).join(" · ")}
        </span>
      </p>
      {venue.isClosed && (
        <p className="mt-3 inline-block rounded-full bg-black/20 px-3 py-1 text-sm font-semibold">
          Temporarily closed
        </p>
      )}
    </header>
  );
}

const timeFormat = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
});

function PubDrinks({ config, venue }: { config: ApiConfig; venue: Venue }) {
  const drinks = useResource(`drinks:${venue.franchise}:${venue.ref}`, () =>
    getPubDrinks(config, venue),
  );

  if (drinks.status === "loading") return <DrinksSkeleton />;
  if (drinks.status === "error") {
    return (
      <ErrorCard
        title="Couldn't load the drinks"
        message="The Wetherspoon menu didn't respond. It's probably temporary, so give it another go."
        retry={drinks.retry}
      />
    );
  }

  const { data } = drinks;
  return (
    <>
      {data.drinks.length > 0 ? (
        <DrinkExplorer drinks={data.drinks} currency={data.currency} />
      ) : (
        <ErrorCard
          title="No drinks to show"
          message="This pub's menu isn't available right now."
        />
      )}
      <p className="mx-auto mt-6 max-w-sm px-4 text-center text-xs leading-relaxed text-white/75">
        Prices checked at {timeFormat.format(data.fetchedAt)}. Cocktails and
        pitchers without a published ABV aren&apos;t ranked. Multi-buy deals
        mean buying several drinks.
      </p>
    </>
  );
}

export default function PubView({
  slug,
  config,
}: {
  slug: string;
  config: ApiConfig;
}) {
  const venues = useResource("venues", () => getVenues(config));

  if (venues.status === "loading") {
    return (
      <>
        <HeadingSkeleton />
        <DrinksSkeleton />
      </>
    );
  }
  if (venues.status === "error") {
    return (
      <div className="pt-6">
        <ErrorCard
          title="Couldn't load this pub"
          message="The Wetherspoon app didn't respond. Give it another go in a moment."
          retry={venues.retry}
        />
      </div>
    );
  }

  const venue = venues.data.find((v) => v.slug === slug);
  if (!venue) {
    return (
      <div className="pt-6">
        <ErrorCard
          title="We couldn't find that pub"
          message="It might have closed or changed name. Try searching for it instead."
        />
      </div>
    );
  }

  return (
    <>
      <PubHeading venue={venue} />
      <PubDrinks key={venue.slug} config={config} venue={venue} />
    </>
  );
}
