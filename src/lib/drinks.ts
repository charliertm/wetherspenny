import type {
  RawCategory,
  RawMenu,
  RawPortionOption,
  RawProductItem,
} from "./jdw/types";

export type CategoryKey =
  | "beer"
  | "cider"
  | "ale"
  | "wine"
  | "spirits"
  | "cocktails"
  | "shots"
  | "premix"
  | "other";

export const CATEGORY_LABELS: Record<CategoryKey, string> = {
  beer: "Beer & lager",
  cider: "Cider",
  ale: "Real ale",
  wine: "Wine & fizz",
  spirits: "Spirits",
  cocktails: "Cocktails",
  shots: "Shots & bombs",
  premix: "Premixed",
  other: "Other",
};

export type Portion = {
  label: string;
  /** Total price paid, e.g. the full £5 for a "4 for £5" deal */
  price: number;
  /** Number of drinks bought (more than 1 for multi-buy deals) */
  quantity: number;
  /** Total units across all drinks bought */
  units: number;
  pricePerUnit: number;
  isDeal: boolean;
};

export type Drink = {
  id: number;
  rank: number;
  name: string;
  abv: number;
  category: CategoryKey;
  description: string | null;
  portions: Portion[];
};

// Standard UK measures for the portion names the menu uses
const PORTION_ML: Record<string, number> = {
  pint: 568,
  "half pint": 284,
  half: 284,
  "third pint": 189,
  third: 189,
  "two thirds pint": 379,
  single: 25,
  double: 50,
};

const SKIPPED_CATEGORY =
  /includes a drink|alcohol free|low and|0% |soft drink|children|hot drink|snack|coffee|tea\b/i;

const DEAL_CATEGORY = /(\d+)\s+for\s+([£€])\s?(\d+(?:\.\d{1,2})?)/i;

const CATEGORY_RULES: [RegExp, CategoryKey][] = [
  [/real ale|\bales?\b/i, "ale"],
  [/cider/i, "cider"],
  [/lager|beer|stout|craft/i, "beer"],
  [/wine|prosecco|sparkling|champagne|fizz/i, "wine"],
  [/bomb|shot/i, "shots"],
  [/cocktail|spritz|pitcher|buzzballz/i, "cocktails"],
  [/premix/i, "premix"],
  [
    /vodka|gin|rum|whisk|tequila|liqueur|cognac|brandy|spirit|bourbon/i,
    "spirits",
  ],
];

/** Cheapest per unit first. Near ties go to the bigger serve, so a pint
 * shows ahead of a half at the same price per unit. */
export function byValue(a: Portion, b: Portion) {
  const diff = a.pricePerUnit - b.pricePerUnit;
  return Math.abs(diff) < 0.005 ? b.units - a.units : diff;
}

const round = (value: number, dp: number) =>
  Math.round(value * 10 ** dp) / 10 ** dp;

export function categoryFromName(name: string): CategoryKey {
  return CATEGORY_RULES.find(([pattern]) => pattern.test(name))?.[1] ?? "other";
}

export function parseDeal(categoryName: string) {
  const match = categoryName.match(DEAL_CATEGORY);
  if (!match) return null;
  const quantity = parseInt(match[1], 10);
  const price = parseFloat(match[3]);
  if (quantity < 2 || !(price > 0)) return null;
  return { quantity, price, label: `${quantity} for ${match[2]}${match[3]}` };
}

export function parseAbv(text: string): number | null {
  const match = text.match(/(\d+(?:\.\d+)?)\s*%/);
  return match ? parseFloat(match[1]) : null;
}

function parseMl(text: string): number | null {
  const match = text.match(/(\d+(?:\.\d+)?)\s*ml\b/i);
  return match ? parseFloat(match[1]) : null;
}

function parseUnits(text: string): number | null {
  const match = text.match(/(\d+(?:\.\d+)?)\s*units?\b/i);
  return match ? parseFloat(match[1]) : null;
}

/** "175ml glass (123 kcal, 2.1 units)" -> "175ml glass" */
function baseLabel(label: string) {
  return label.replace(/\s*\(.*\)\s*$/, "").trim();
}

function makePortion(
  label: string,
  price: number,
  units: number,
  quantity = 1,
  isDeal = false,
): Portion {
  return {
    label,
    price,
    quantity,
    units: round(units, 2),
    pricePerUnit: round(price / units, 4),
    isDeal,
  };
}

/**
 * Works out the units in each size a product is sold in. Volumes come from
 * the portion name where it's a standard measure ("Pint", "Single",
 * "175ml glass"), otherwise from the description ("440ml can").
 */
export function parsePortions(
  options: RawPortionOption[],
  abv: number,
  description: string,
): Portion[] {
  const portions: Portion[] = [];
  const descriptionMl = parseMl(description);
  const descriptionUnits = parseUnits(description);
  let usedDescription = false;

  const visible = options.filter(
    (option) =>
      !option.value.hidden &&
      option.value.price.value > 0 &&
      !/^add\b/i.test(option.label),
  );

  for (const option of visible) {
    const label = baseLabel(option.label);
    const price = option.value.price.value;
    const labelUnits = parseUnits(option.label);
    const ml = PORTION_ML[label.toLowerCase()] ?? parseMl(label);

    let units: number | null = null;
    if (labelUnits) {
      units = labelUnits;
    } else if (ml) {
      units = (ml * abv) / 1000;
    } else if (!usedDescription) {
      // A generic size ("Standard", "Bottle", "Can") - the description
      // describes it, but only the first one, e.g. a Pimm's "Glass" rather
      // than its "Pitcher"
      usedDescription = true;
      if (descriptionMl) units = (descriptionMl * abv) / 1000;
      else if (descriptionUnits && visible.length === 1)
        units = descriptionUnits;
    }

    if (!units || units < 0.2 || units > 60) continue;
    portions.push(makePortion(label, price, units));
  }

  return portions;
}

function* walkCategories(categories: RawCategory[]): Generator<RawCategory> {
  for (const category of categories) {
    if (category.hidden) continue;
    yield category;
    if (category.subCategories?.length)
      yield* walkCategories(category.subCategories);
  }
}

type Collected = {
  item: RawProductItem;
  category: CategoryKey | null;
  deals: NonNullable<ReturnType<typeof parseDeal>>[];
};

export function parseDrinks(menus: RawMenu[]): Drink[] {
  const collected = new Map<number, Collected>();

  for (const menu of menus) {
    for (const category of walkCategories(menu.categories)) {
      if (SKIPPED_CATEGORY.test(category.name)) continue;
      const deal = parseDeal(category.name);
      const categoryKey = deal ? null : categoryFromName(category.name);

      for (const group of category.itemGroups ?? []) {
        for (const item of group.items) {
          if (item.itemType !== "product") continue;
          const product = item as RawProductItem;
          if (product.ageRestriction !== 18 || product.isOutOfStock) continue;

          const entry = collected.get(product.id) ?? {
            item: product,
            category: null,
            deals: [],
          };
          if (deal) entry.deals.push(deal);
          else entry.category ??= categoryKey;
          collected.set(product.id, entry);
        }
      }
    }
  }

  // The same drink can be listed as separate products (e.g. a wine by the
  // glass and by the bottle), so merge them by name
  const drinks = new Map<string, Omit<Drink, "rank">>();
  for (const { item, category, deals } of collected.values()) {
    const description = item.description?.trim() ?? "";
    const abv = parseAbv(description);
    if (!abv || abv < 0.6) continue;

    const options = item.options?.portion?.options ?? [];
    const portions = parsePortions(options, abv, description);
    if (portions.length === 0) continue;

    // Multi-buy deals apply to the default size
    const defaultLabel = baseLabel(
      options.find((option) => option.isDefault)?.label ??
        options[0]?.label ??
        "",
    );
    const base = portions.find((p) => p.label === defaultLabel) ?? portions[0];
    for (const deal of deals) {
      if (deal.price >= base.price * deal.quantity) continue;
      portions.push(
        makePortion(
          deal.label,
          deal.price,
          base.units * deal.quantity,
          deal.quantity,
          true,
        ),
      );
    }

    const name = item.name.trim();
    const key = name.toLowerCase();
    const existing = drinks.get(key);
    if (existing) {
      for (const portion of portions) {
        const same = existing.portions.findIndex(
          (p) => p.label.toLowerCase() === portion.label.toLowerCase(),
        );
        if (same === -1) existing.portions.push(portion);
        else if (portion.price < existing.portions[same].price) {
          existing.portions[same] = portion;
        }
      }
      if (existing.category === "other" && category)
        existing.category = category;
    } else {
      drinks.set(key, {
        id: item.id,
        name,
        abv,
        category: category ?? "other",
        description: description.split("\n")[0] || null,
        portions,
      });
    }
  }

  for (const drink of drinks.values()) {
    drink.portions.sort(byValue);
  }

  return [...drinks.values()]
    .sort(
      (a, b) =>
        a.portions[0].pricePerUnit - b.portions[0].pricePerUnit ||
        a.name.localeCompare(b.name),
    )
    .map((drink, index) => ({ ...drink, rank: index + 1 }));
}
