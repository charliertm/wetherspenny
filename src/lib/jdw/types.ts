// Shapes of the Wetherspoon order & pay API (ca.jdw-apps.net), trimmed to the
// fields we actually read. The API is undocumented so everything is optional-ish.

export type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export type RawAddress = {
  line1: string | null;
  line2: string | null;
  line3: string | null;
  town: string | null;
  county: string | null;
  postcode: string | null;
  country: { name: string; code: string };
  location: { latitude: number; longitude: number };
};

export type RawVenueSummary = {
  franchise: string;
  id: number;
  venueRef: number;
  name: string;
  status: string;
  type: string;
  isClosed: boolean;
  address: RawAddress;
};

export type RawVenue = RawVenueSummary & {
  currency: { code: string; symbol: string };
  salesAreas: { id: number; name: string }[];
};

export type RawMenuSummary = {
  id: number;
  name: string;
  salesAreaId: number;
  isHidden: boolean;
  updated: string;
};

export type RawPrice = {
  initialValue: number;
  value: number;
  currency: string;
  discount: number;
};

export type RawPortionOption = {
  label: string;
  value: {
    id: number;
    name: string;
    price: RawPrice;
    hidden: boolean;
    isDefault: boolean;
  };
  isDefault: boolean;
};

export type RawProductItem = {
  itemType: "product";
  id: number;
  name: string;
  description: string | null;
  isOutOfStock: boolean;
  ageRestriction: number | null;
  showPrice: boolean;
  options?: {
    portion?: { options: RawPortionOption[] } | null;
  } | null;
};

export type RawMenuItem =
  | RawProductItem
  | { itemType: "text" | "divider" | "ale"; [key: string]: unknown };

export type RawCategory = {
  id: number;
  name: string;
  hidden: boolean;
  itemGroups: { name: string | null; items: RawMenuItem[] }[] | null;
  subCategories: RawCategory[] | null;
};

export type RawMenu = {
  id: number;
  name: string;
  updated: string;
  categories: RawCategory[];
};
