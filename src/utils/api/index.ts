import { MenusData, PurpleProduct } from "./MenusData";
import { PortionData, ProductData } from "./ProductData";

const PORTION_TOKEN_TO_ML: { [key: string]: number | null } = {
  "125ml": 125,
  "175ml": 175,
  "250ml": 250,
  "750ml": 750,
  Single: 25,
  Double: 50,
  Third: 189,
  Half: 284,
  Pint: 568,
  Glass: null, // 50
  Pitcher: null, // 100
  Large: null, // 150
};

const getFilteredProducts = (menusData: MenusData): PurpleProduct[] => {
  const seenIds: number[] = [];
  const products: PurpleProduct[] = [];
  menusData.menus.forEach((menu) => {
    if (menu.name === "Drinks") {
      menu.subMenu.forEach((subMenu) => {
        subMenu.productGroups.forEach((productGroup) => {
          productGroup.products.forEach((product) => {
            if (
              product.minimumAge !== 18 ||
              seenIds.includes(product.productId)
            )
              return;
            else {
              seenIds.push(product.productId);
              products.push(product);
            }
          });
        });
      });
    }
  });
  return products;
};

const getAbv = (description: string): number | null => {
  const abv_match = description.match(/(?:\d+%)|(?:\d+\.\d+%)/);
  if (abv_match) {
    return parseFloat(abv_match[0].slice(0, -1));
  }
  return null;
};

const getPortionData = (
  name: string,
  price: number,
  volume: number,
  abv: number,
  quantity: number = 1
): PortionData => {
  return {
    name: name,
    price: price,
    volumeMl: volume,
    units: parseFloat(((volume * quantity * abv) / 1000).toFixed(3)),
    unitsPerPound: parseFloat(
      ((volume * quantity * abv) / (1000 * price)).toFixed(3)
    ),
  };
};

const getPromoData = (
  promoText: string
): { name: string; quantity: number; price: number } | null => {
  const promoMatch = promoText.match(
    /(([1-9][0-9]*) \b(for) [$€£]\d+(\.\d{1,2})?)/
  );
  if (promoMatch) {
    const promoStrings = promoMatch[0].split(" ");
    return {
      name: promoMatch[0],
      quantity: parseInt(promoStrings[0]),
      price: parseFloat(promoStrings[promoStrings.length - 1].slice(1)),
    };
  }
  return null;
};

const getProductsData = (products: PurpleProduct[]): ProductData[] => {
  const productsData: ProductData[] = [];

  products.forEach((product) => {
    const abv = getAbv(product.description);
    if (!abv) {
      return;
    }
    const portionsData: PortionData[] = [];
    if (product.portions.length === 0) {
      // product has no portions so generate default portion info
      const volumeMatch = product.description.match(
        /(?<![/\d])(?<!\d[.-])(\d+(?:\.\d+)?)\s*ml\b(?!\/)/
      );
      if (!volumeMatch) {
        return;
      }
      const volumeName = volumeMatch[0];
      const volume = parseFloat(volumeName.slice(0, -2));
      const portionData = getPortionData(
        volumeName,
        product.priceValue,
        volume,
        abv
      );
      portionsData.push(portionData);
      // get promo data from product
      const promoData = getPromoData(product.promoText);
      if (!promoData) {
        return;
      }
      const { name, quantity, price } = promoData;
      const promoPortionData = getPortionData(
        name,
        price,
        volume,
        abv,
        quantity
      );
      portionsData.push(promoPortionData);
    } else if (product.portions.length > 0) {
      // if product has portions we repeat similar logic for all portions
      product.portions.forEach((portion) => {
        if (!portion.showPortion) {
          return;
        }
        const portionToken = portion.name.split(" ")[0];
        const volume = PORTION_TOKEN_TO_ML[portionToken];
        if (!volume) {
          return;
        }
        const portionData = getPortionData(
          portionToken,
          portion.price,
          volume,
          abv
        );
        portionsData.push(portionData);
        // look for promo in default portion
        if (portion.id === product.defaultPortionId) {
          const promoData = getPromoData(product.promoText);
          if (!promoData) {
            return;
          }
          const { name, quantity, price } = promoData;
          const promoPortionData = getPortionData(
            name,
            price,
            volume,
            abv,
            quantity
          );
          portionsData.push(promoPortionData);
        }
      });
    }
    if (portionsData.length === 0) {
      return;
    }
    const sortedPortionsData = portionsData.sort((portionA, portionB) => {
      return (
        Math.max(portionB.unitsPerPound) - Math.max(portionA.unitsPerPound)
      );
    });
    productsData.push({
      name: product.displayName,
      abv: abv,
      portions: sortedPortionsData,
    });
  });

  return productsData;
};

const getSortedProductsData = (productsData: ProductData[]): ProductData[] => {
  const sortedProductsData = productsData.sort((productA, productB) => {
    const uppValuesA = productA.portions.map((portion) => {
      return portion.unitsPerPound;
    });
    const uppValuesB = productB.portions.map((portion) => {
      return portion.unitsPerPound;
    });
    return Math.max(...uppValuesB) - Math.max(...uppValuesA);
  });
  return sortedProductsData;
};

export const getProductsDataFromPubId = async (pubId: number) => {
  const url: string = `https://static.wsstack.nn4maws.net/content/v5/menus/${pubId}.json`;
  const response = await fetch(url);
  const data = (await response.json()) as MenusData;
  const drinksData = getFilteredProducts(data);
  const productsData = getProductsData(drinksData);
  const sortedProductsData = getSortedProductsData(productsData);
  return sortedProductsData;
};
