"use client";

import { Beer, Search, Trophy, X } from "lucide-react";
import { useDeferredValue, useMemo, useRef, useState } from "react";
import { CATEGORY_LABELS, type CategoryKey, type Drink } from "@/lib/drinks";
import { searchable } from "@/lib/venues";
import ChipScroller from "./ChipScroller";
import DrinkCard, { formatMoney, type RankedDrink } from "./DrinkCard";

type Sort = "value" | "price" | "abv";

const SORTS: { key: Sort; label: string }[] = [
  { key: "value", label: "Best value" },
  { key: "price", label: "Cheapest" },
  { key: "abv", label: "Strongest" },
];

function rankDrinks(drinks: Drink[], includeDeals: boolean): RankedDrink[] {
  return drinks
    .flatMap((drink) => {
      const visiblePortions = includeDeals
        ? drink.portions
        : drink.portions.filter((portion) => !portion.isDeal);
      return visiblePortions.length
        ? [{ ...drink, visiblePortions, best: visiblePortions[0] }]
        : [];
    })
    .sort(
      (a, b) =>
        a.best.pricePerUnit - b.best.pricePerUnit ||
        a.name.localeCompare(b.name),
    )
    .map((drink, index) => ({ ...drink, rank: index + 1 }));
}

function Highlight({
  icon,
  title,
  name,
  detail,
}: {
  icon: React.ReactNode;
  title: string;
  name: string;
  detail: string;
}) {
  return (
    <div className="min-w-0 rounded-3xl bg-white/12 p-3.5 text-white ring-1 ring-white/20">
      <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase opacity-80">
        {icon}
        {title}
      </p>
      <p className="mt-1.5 truncate font-bold">{name}</p>
      <p className="text-sm tabular-nums opacity-85">{detail}</p>
    </div>
  );
}

export default function DrinkExplorer({
  drinks,
  currency,
}: {
  drinks: Drink[];
  currency: string;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryKey | "all">("all");
  const [sort, setSort] = useState<Sort>("value");
  const [includeDeals, setIncludeDeals] = useState(true);
  const deferredQuery = useDeferredValue(query);
  const inputRef = useRef<HTMLInputElement>(null);

  const ranked = useMemo(
    () => rankDrinks(drinks, includeDeals),
    [drinks, includeDeals],
  );

  const categories = useMemo(() => {
    const counts = new Map<CategoryKey, number>();
    for (const drink of ranked)
      counts.set(drink.category, (counts.get(drink.category) ?? 0) + 1);
    return (Object.keys(CATEGORY_LABELS) as CategoryKey[]).filter((key) =>
      counts.has(key),
    );
  }, [ranked]);

  const cheapestPint = useMemo(() => {
    let found: { name: string; price: number } | null = null;
    for (const drink of drinks) {
      for (const portion of drink.portions) {
        if (
          portion.label === "Pint" &&
          (!found || portion.price < found.price)
        ) {
          found = { name: drink.name, price: portion.price };
        }
      }
    }
    return found;
  }, [drinks]);

  const visible = useMemo(() => {
    const terms = searchable(deferredQuery).split(" ").filter(Boolean);
    const filtered = ranked.filter(
      (drink) =>
        (category === "all" || drink.category === category) &&
        terms.every((term) => searchable(drink.name).includes(term)),
    );
    if (sort === "price") {
      return filtered.toSorted((a, b) => {
        const cheapest = (d: RankedDrink) =>
          Math.min(...d.visiblePortions.map((p) => p.price));
        return cheapest(a) - cheapest(b);
      });
    }
    if (sort === "abv") return filtered.toSorted((a, b) => b.abv - a.abv);
    return filtered;
  }, [ranked, category, sort, deferredQuery]);

  const top = ranked[0];
  const chip = (active: boolean) =>
    `shrink-0 snap-start rounded-full px-3.5 py-1.5 text-sm font-semibold transition active:scale-95 ${
      active
        ? "bg-surface text-text shadow-sm"
        : "bg-white/12 text-white hover:bg-white/20"
    }`;

  return (
    <div>
      {top && (
        <div className="grid animate-rise grid-cols-2 gap-2.5 px-4">
          <Highlight
            icon={<Trophy className="size-3.5" />}
            title="Best value"
            name={top.name}
            detail={`${top.best.label} · ${formatMoney(currency, top.best.pricePerUnit)}/unit`}
          />
          {cheapestPint && (
            <Highlight
              icon={<Beer className="size-3.5" />}
              title="Cheapest pint"
              name={cheapestPint.name}
              detail={formatMoney(currency, cheapestPint.price)}
            />
          )}
        </div>
      )}

      <div className="sticky top-0 z-20 mt-2 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black_55%,transparent)] backdrop-blur-md"
        />
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search for your favourites"
            aria-label="Search drinks"
            autoComplete="off"
            enterKeyHint="search"
            className="h-12 w-full rounded-2xl bg-surface pr-11 pl-11 text-base font-medium shadow-lg shadow-black/10 transition outline-none placeholder:text-muted/70 focus:ring-4 focus:ring-white/40 [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="absolute top-1/2 right-1.5 grid size-9 -translate-y-1/2 place-items-center rounded-full text-muted transition hover:bg-surface-2"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2.5 pt-1 pb-3">
        <ChipScroller label="Filter by type">
          <button
            type="button"
            onClick={() => setCategory("all")}
            className={chip(category === "all")}
            aria-pressed={category === "all"}
          >
            All
          </button>
          {categories.map((key) => (
            <button
              type="button"
              key={key}
              onClick={() => setCategory(key)}
              className={chip(category === key)}
              aria-pressed={category === key}
            >
              {CATEGORY_LABELS[key]}
            </button>
          ))}
        </ChipScroller>

        <div className="flex items-center justify-between gap-2 px-4">
          <div
            className="flex rounded-full bg-black/15 p-0.5"
            role="group"
            aria-label="Sort by"
          >
            {SORTS.map(({ key, label }) => (
              <button
                type="button"
                key={key}
                onClick={() => setSort(key)}
                aria-pressed={sort === key}
                className={`rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition ${
                  sort === key
                    ? "bg-surface text-text shadow-sm"
                    : "text-white/85 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-white">
            Deals
            <input
              type="checkbox"
              checked={includeDeals}
              onChange={(event) => setIncludeDeals(event.target.checked)}
              className="peer sr-only"
            />
            <span className="relative h-7 w-12 rounded-full bg-black/15 transition peer-focus-visible:ring-2 peer-focus-visible:ring-white after:absolute after:top-0.5 after:left-0.5 after:size-6 after:rounded-full after:bg-white after:shadow-sm after:transition-transform after:duration-200 peer-checked:after:translate-x-5" />
          </label>
        </div>
      </div>

      <ul className="space-y-2.5 px-4">
        {visible.map((drink, index) => (
          <DrinkCard
            key={drink.id}
            drink={drink}
            currency={currency}
            index={index}
          />
        ))}
      </ul>

      {visible.length === 0 && (
        <div className="mx-4 animate-fade rounded-3xl bg-surface px-6 py-10 text-center shadow-sm">
          <p className="font-semibold">No drinks found</p>
          <p className="mt-1 text-sm text-muted">
            Try a different search or filter.
          </p>
        </div>
      )}
    </div>
  );
}
