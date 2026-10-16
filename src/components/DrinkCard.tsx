"use client";

import { ChevronDown, Tag } from "lucide-react";
import { useState } from "react";
import { CATEGORY_LABELS, type Drink, type Portion } from "@/lib/drinks";

export type RankedDrink = Drink & { best: Portion; visiblePortions: Portion[] };

export function formatMoney(currency: string, value: number) {
  return `${currency}${value.toFixed(2)}`;
}

function RankBadge({ rank }: { rank: number }) {
  const podium = rank <= 3;
  return (
    <span
      className={`grid size-11 shrink-0 place-items-center rounded-2xl text-sm font-bold tabular-nums ${
        podium
          ? "bg-blue text-white shadow-md shadow-blue/30"
          : "bg-blue/10 text-blue"
      }`}
    >
      #{rank}
    </span>
  );
}

function DealTag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-green/12 px-2 py-0.5 text-xs font-semibold whitespace-nowrap text-green">
      <Tag className="size-3" />
      {label}
    </span>
  );
}

export default function DrinkCard({
  drink,
  currency,
  index,
}: {
  drink: RankedDrink;
  currency: string;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const { best } = drink;
  const panelId = `drink-${drink.id}`;

  return (
    <li
      className="animate-rise"
      style={{ animationDelay: index < 12 ? `${index * 35}ms` : undefined }}
    >
      <div className="overflow-hidden rounded-3xl bg-surface shadow-sm ring-1 ring-black/5 transition-shadow dark:ring-white/5">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex w-full items-center gap-3 p-3.5 text-left sm:p-4"
        >
          <RankBadge rank={drink.rank} />
          <span className="min-w-0 flex-1">
            <span className="line-clamp-2 leading-snug font-bold">
              {drink.name}
            </span>
            <span className="mt-0.5 block text-sm text-muted">
              {drink.abv}% · {CATEGORY_LABELS[drink.category]}
            </span>
            <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
              {best.isDeal ? (
                <DealTag label={best.label} />
              ) : (
                <span>
                  <span className="font-semibold">{best.label}</span>{" "}
                  <span className="text-muted tabular-nums">
                    {formatMoney(currency, best.price)}
                  </span>
                </span>
              )}
            </span>
          </span>
          <span className="flex shrink-0 flex-col items-end gap-1.5">
            <span className="rounded-2xl bg-green px-3 py-2 text-right text-white shadow-md shadow-green/25">
              <span className="block text-lg leading-none font-bold tabular-nums">
                {formatMoney(currency, best.pricePerUnit)}
              </span>
              <span className="mt-1 block text-[10px] leading-none font-semibold tracking-wider uppercase opacity-85">
                per unit
              </span>
            </span>
            <ChevronDown
              className={`size-4 text-muted transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            />
          </span>
        </button>

        <div
          id={panelId}
          className="grid transition-[grid-template-rows] duration-300 ease-out"
          style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
        >
          <div className="overflow-hidden" inert={!open}>
            <div className="border-t border-border px-3.5 pt-3 pb-4 sm:px-4">
              {drink.description && (
                <p className="mb-3 text-sm text-muted">{drink.description}</p>
              )}
              <table className="w-full text-sm tabular-nums">
                <thead>
                  <tr className="text-left text-[11px] font-semibold tracking-wider text-muted uppercase">
                    <th className="pb-1.5 font-semibold">Size</th>
                    <th className="pb-1.5 text-right font-semibold">Price</th>
                    <th className="pb-1.5 text-right font-semibold">Units</th>
                    <th className="pb-1.5 text-right font-semibold">
                      Per unit
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {drink.visiblePortions.map((portion) => (
                    <tr
                      key={portion.label}
                      className="border-t border-border/70"
                    >
                      <td className="py-2 pr-2">
                        {portion.isDeal ? (
                          <DealTag label={portion.label} />
                        ) : (
                          <span className="font-medium">{portion.label}</span>
                        )}
                      </td>
                      <td className="py-2 text-right">
                        {formatMoney(currency, portion.price)}
                      </td>
                      <td className="py-2 text-right">
                        {portion.units.toFixed(1)}
                      </td>
                      <td
                        className={`py-2 text-right font-semibold ${
                          portion === best ? "text-green" : ""
                        }`}
                      >
                        {formatMoney(currency, portion.pricePerUnit)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
