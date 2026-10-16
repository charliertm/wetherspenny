import { describe, expect, it } from "vitest";
import {
  categoryFromName,
  parseDeal,
  parseDrinks,
  parsePortions,
} from "./drinks";
import type {
  RawCategory,
  RawMenu,
  RawPortionOption,
  RawProductItem,
} from "./jdw/types";

function option(
  label: string,
  price: number,
  isDefault = false,
): RawPortionOption {
  return {
    label,
    isDefault,
    value: {
      id: 1,
      name: label,
      hidden: false,
      isDefault,
      price: {
        initialValue: price,
        value: price,
        currency: "GBP",
        discount: 0,
      },
    },
  };
}

function product(
  id: number,
  name: string,
  description: string,
  options: RawPortionOption[],
  extra: Partial<RawProductItem> = {},
): RawProductItem {
  return {
    itemType: "product",
    id,
    name,
    description,
    isOutOfStock: false,
    ageRestriction: 18,
    showPrice: true,
    options: { portion: { options } },
    ...extra,
  };
}

function menu(categories: [string, RawProductItem[]][]): RawMenu {
  return {
    id: 1,
    name: "Drinks",
    updated: "",
    categories: categories.map(([name, items], i): RawCategory => ({
      id: i,
      name,
      hidden: false,
      subCategories: [],
      itemGroups: [{ name: null, items }],
    })),
  };
}

describe("parsePortions", () => {
  it("uses standard measures for draught and spirits", () => {
    const portions = parsePortions(
      [option("Half pint", 1.5), option("Pint", 2.99, true)],
      4,
      "4.0% ABV, 2.3 units",
    );
    expect(portions.map((p) => [p.label, p.units])).toEqual([
      ["Half pint", 1.14],
      ["Pint", 2.27],
    ]);
    expect(portions[1].pricePerUnit).toBeCloseTo(2.99 / 2.272, 2);
  });

  it("reads the volume from the description for cans and bottles", () => {
    const [can] = parsePortions(
      [option("Can", 3.7)],
      4.6,
      "4.6% ABV 440ml can",
    );
    expect(can.units).toBeCloseTo(2.02, 2);
  });

  it("prefers units stated in the portion label", () => {
    const [glass] = parsePortions(
      [option("175ml glass (123 kcal, 2.1 units)", 3.05)],
      12.5,
      "12.5% ABV 750ml",
    );
    expect(glass.units).toBe(2.1);
  });

  it("only applies the description volume to the first generic size", () => {
    const portions = parsePortions(
      [option("Glass", 4.64), option("Pitcher", 10.03)],
      22,
      "22% ABV (50ml glass)",
    );
    expect(portions).toHaveLength(1);
    expect(portions[0]).toMatchObject({ label: "Glass", units: 1.1 });
  });

  it("falls back to described units for a single unsized portion", () => {
    const [portion] = parsePortions(
      [option("Standard", 2.59)],
      4.5,
      "4.5% ABV, 2.0 unit",
    );
    expect(portion.units).toBe(2);
  });

  it("skips add-ons", () => {
    const portions = parsePortions(
      [option("Single", 3), option("Add 25ml of something (35% ABV)", 5)],
      40,
      "40% ABV",
    );
    expect(portions.map((p) => p.label)).toEqual(["Single"]);
  });
});

describe("parseDeal", () => {
  it("parses multi-buy category names", () => {
    expect(parseDeal("4 for £5")).toEqual({
      quantity: 4,
      price: 5,
      label: "4 for £5",
    });
    expect(parseDeal("2 for €7.15")).toMatchObject({
      quantity: 2,
      price: 7.15,
    });
    expect(parseDeal("Bombs and shots")).toBeNull();
  });
});

describe("categoryFromName", () => {
  it("groups menu categories", () => {
    expect(categoryFromName("Lager, beer, stout and craft | Draught")).toBe(
      "beer",
    );
    expect(categoryFromName("Real ale")).toBe("ale");
    expect(categoryFromName("Liqueurs, cognac and brandy ")).toBe("spirits");
    expect(categoryFromName("Spritz cocktails")).toBe("cocktails");
  });
});

describe("parseDrinks", () => {
  const carling = product(1, "Carling", "4.0% ABV", [
    option("Half pint", 1.5),
    option("Pint", 2.99, true),
  ]);
  const shot = product(
    2,
    "Flävar strawberry & lime",
    "21% ABV 25ml, 0.5 units",
    [option("Standard", 3.05, true)],
  );
  const cocktail = product(3, "Woo Woo", "Smirnoff vodka, peach schnapps", [
    option("Glass", 6.72),
  ]);
  const soft = product(4, "Pepsi", "0% ABV", [option("Pint", 2)], {
    ageRestriction: null,
  });

  it("ranks drinks by price per unit and applies multi-buy deals", () => {
    const drinks = parseDrinks([
      menu([
        ["Lager", [carling, cocktail, soft]],
        ["Bombs and shots", [shot]],
        ["4 for £5", [shot]],
      ]),
    ]);

    expect(drinks.map((d) => d.name)).toEqual([
      "Carling",
      "Flävar strawberry & lime",
    ]);
    expect(drinks[0].rank).toBe(1);

    const flavar = drinks[1];
    expect(flavar.category).toBe("shots");
    expect(flavar.portions[0]).toMatchObject({
      label: "4 for £5",
      quantity: 4,
      price: 5,
      isDeal: true,
    });
    expect(flavar.portions[0].units).toBeCloseTo(2.1, 1);
  });

  it("merges the same drink listed as separate products", () => {
    const byGlass = product(10, "House Red", "12% ABV", [
      option("175ml glass", 4),
    ]);
    const byBottle = product(11, "House Red", "12% ABV 750ml", [
      option("Bottle", 14),
    ]);
    const drinks = parseDrinks([menu([["Wine", [byGlass, byBottle]]])]);
    expect(drinks).toHaveLength(1);
    expect(drinks[0].portions.map((p) => p.label).sort()).toEqual([
      "175ml glass",
      "Bottle",
    ]);
  });

  it("ignores out of stock drinks and meal deal categories", () => {
    const outOfStock = {
      ...carling,
      id: 20,
      name: "Coors",
      isOutOfStock: true,
    };
    const drinks = parseDrinks([
      menu([
        ["Lager", [outOfStock]],
        ["Includes a drink", [carling]],
      ]),
    ]);
    expect(drinks).toEqual([]);
  });
});
