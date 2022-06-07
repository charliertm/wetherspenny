export interface MenusData {
  pageTitle: string;
  showVenue: boolean;
  venueInfoAction: string;
  showSearchBar: boolean;
  siteId: number;
  venueId: number;
  venueName: string;
  salesAreaId: number;
  waitTime: number;
  updateTime: number;
  supplements: Supplements;
  menus: Menu[];
}

export interface Menu {
  showVenue: boolean;
  venueInfoAction: string;
  showSearchBar: boolean;
  image: string;
  imageWidth: number;
  imageHeight: number;
  subMenuImage: string;
  subMenuImageWidth: number;
  subMenuImageHeight: number;
  sortOrder: number;
  name: string;
  description: string;
  canOrder: boolean;
  showMenu: boolean;
  menuId: number;
  useLocalIncludesDrink: boolean;
  subMenu: MenuSubMenu[];
  hasRange?: boolean;
  action?: string;
  isAddOnMenu?: boolean;
  retainMenu?: boolean;
}

export interface MenuSubMenu {
  headerText: string;
  headerDescription: string;
  headerImage: string;
  showVenue: boolean;
  venueInfoAction: string;
  showSearchBar: boolean;
  productGroups: PurpleProductGroup[];
  addOns?: AddOns;
  showNoThanksOption?: boolean;
  noThanksIcon?: string;
  isIncludesDrink?: boolean;
  action?: string;
  hasRange?: boolean;
  subMenu?: SubMenuSubMenu[];
  listId?: string;
}

export interface AddOns {
  addOnHeader: string;
  productChoices: ProductChoiceElement[];
  byoIncludedHeader?: string;
  backgroundImage: string;
  addOnDescription: string;
  spacerHeight: number;
  allowColapse: boolean;
  defaultExpanded: boolean;
  recipeSwapCount?: number;
}

export interface ProductChoiceElement {
  displayName: string;
  description: string;
  calories: number;
  eposName: string;
  productId: number;
  variantId: string;
  menuId: number;
  portions: Portion[];
  displayCalories: string;
  iOrderDisplayId: number;
  hasInfo: boolean;
  chilliHeat: number;
  iconsToShow: IconsToShow[];
  leadingIcons: any[];
  filterOptions: FilterOptions;
  allergenList: AllergenList;
  image: string;
  defaultPortionId: number;
  defaultCourseId: number;
  promoText: string;
  includesADrink: boolean;
  displayPrice: string;
  priceValue: number;
  defaultPortionName?: string;
  choices: ProductChoiceChoice[];
  canAddOn: boolean;
  excludeAddOn: any[];
  commonTillRequests: any[];
  minimumAge: number;
  freetextLabel?: string;
  recipeQuantity?: number;
  canSwap?: boolean;
  canRemove?: boolean;
  showPreferencesQuantity?: boolean;
  productDescTitle?: string;
  useChoicesLists?: boolean;
  additionalPortionOptions?: AdditionalPortionOption[];
  extendedRange?: HeaderText;
}

export interface AdditionalPortionOption {
  feature: Feature;
  visible: boolean;
}

export enum Feature {
  Cordial = "Cordial",
  Fruit = "Fruit",
  Ice = "Ice",
  StrawChoice = "StrawChoice",
  TopsAndShandies = "TopsAndShandies",
}

export interface AllergenList {}

export interface ProductChoiceChoice {
  backgroundImage: string;
  choiceHeader: string;
  choiceDescription: string;
  showSearchBar: boolean;
  allowColapse: boolean;
  defaultExpanded: boolean;
  choiceId: number;
  relatedToPortions: boolean;
  defaultChoiceId: number;
  isCourseChoice: boolean;
  productChoices: ProductChoice[];
  relatedToCustomise?: boolean;
  choiceDescTextColour?: string;
}

// export enum ChoiceDescTextColour {
//     The0261C8 = "#0261C8",
// }

export interface ProductChoice {
  eposName: string;
  displayName: string;
  course: number;
  productId: number;
  variantId: string;
  description: string;
  menuId: number;
  hasInfo: boolean;
  chilliHeat: number;
  iconsToShow: any[];
  leadingIcons: any[];
  parentAtt: ParentAtt;
  minimumAge: number;
  calories: number;
  displayCalories: string;
  displayRecordId: number;
  displayPrice: string;
  priceValue: number;
}

// export enum Description {
//     Empty = "",
//     NotVegan = "(Not vegan)",
//     RoastedPepperCourgetteOnion80Kcal05GSalt = "Roasted pepper, courgette, onion. 80 kcal 0.5g salt",
//     The12Kcal0GSalt = "12 kcal 0g salt",
//     The265Kcal = "265 kcal",
//     The55Kcal0GSalt = "55 kcal 0g salt",
//     The597Kcal = "597 kcal",
//     The63Kcal04GSalt = "63 kcal 0.4g salt",
// }

// export enum DisplayPrice {
//     Empty = "",
//     The105 = "£1.05",
//     The140 = "£1.40",
//     The30P = "30p",
//     The35P = "35p",
//     The40P = "40p",
//     The45P = "+ 45p",
// }

export interface ParentAtt {
  parentIngredientId?: number;
  parentDisplayRecordId?: number;
}

// export enum DefaultPortionName {
//     Bottle = "Bottle",
//     Can = "Can",
//     Cup = "Cup",
//     DefaultPortionName750MlBottle = "750ml bottle",
//     DefaultPortionNameCup = " Cup",
//     Glass = "Glass",
//     Single = "Single",
//     Standard = "Standard",
//     The200MlBottle = "200ml bottle",
//     The25Ml = "25ml",
//     The50Ml = "50ml",
//     The750MlBottle = "750ml Bottle",
//     The750MlBottle615Kcal = "750ml bottle (615 kcal)",
// }

export enum HeaderText {
  AllGins = "All Gins",
  CitrusGins = "Citrus gins",
  FloralGins = "Floral gins",
  FruitGins = "Fruit gins",
  HerbaceousGins = "Herbaceous gins",
  JuniperGins = "Juniper gins",
}

export interface FilterOptions {
  isVeg: boolean;
  isVegan: boolean;
}

export enum IconsToShow {
  IcnItem18_Years = "icn_item_18_years",
  IcnVegan = "icn_vegan",
  IcnVegetarian = "icn_vegetarian",
}

export interface Portion {
  id: number;
  name: string;
  price: number;
  displayPrice: string;
  choices: number[];
  showPortion: boolean;
  showCTR: boolean;
  isSpritzer?: boolean;
  IADDisplayPrice?: string;
}

// export enum IADDisplayPrice {
//     The120 = "+ £1.20",
//     The121 = "+ £1.21",
//     The170 = "+ £1.70",
//     The20P = "+ 20p",
//     The21P = "+ 21p",
//     The45P = "+ 45p",
//     The600 = "+ £6.00",
//     The71P = "+ 71p",
// }

// export enum ProductDescTitle {
//     Empty = "",
//     ServedWithCucumber = "Served with cucumber",
//     ServedWithLemon = "Served with lemon",
//     ServedWithLime = "Served with lime",
//     ServedWithOrange = "Served with orange",
//     ServedWithPinkGrapefruit = "Served with pink grapefruit",
// }

export interface PurpleProductGroup {
  promoHeader: string;
  promoDescription: string;
  groupHeader: string;
  groupDescription: string;
  spacerHeight: number;
  products: PurpleProduct[];
  icon?: string;
  allowColapse?: boolean;
  defaultExpanded?: boolean;
  isGuestAles?: boolean;
}

// export enum Icon {
//     Empty = "",
//     IcnSoftDrinks = "icn_soft_drinks",
// }

export interface PurpleProduct {
  displayName: string;
  description: string;
  calories: number;
  eposName: string;
  productId: number;
  variantId: string;
  menuId: number;
  portions: Portion[];
  displayCalories: string;
  iOrderDisplayId: number;
  hasInfo: boolean;
  chilliHeat: number;
  iconsToShow: IconsToShow[];
  leadingIcons: string[];
  filterOptions: FilterOptions;
  allergenList: AllergenList;
  image: string;
  defaultPortionId: number;
  defaultCourseId: number;
  promoText: string;
  includesADrink: boolean;
  displayPrice: string;
  priceValue: number;
  defaultPortionName?: string;
  choices: ProductChoiceChoice[];
  useChoicesLists?: boolean;
  canAddOn: boolean;
  excludeAddOn: any[];
  commonTillRequests: CommonTillRequest[];
  minimumAge: number;
  addOnList?: string[];
  showPreferencesQuantity?: boolean;
  additionalPortionOptions?: AdditionalPortionOption[];
  promoDisplayPrice?: string;
  displayPriceLabel?: string;
  promoPriceLabel?: string;
  promoPriceValue?: number;
  wineGroup?: WineGroup;
  isSpritzer?: boolean;
  prePriceLabel?: string;
  productDescTitle?: string;
  extendedRange?: HeaderText;
}

export interface CommonTillRequest {
  showAllways: boolean;
  ctrHeader: string;
  ctrDescription: string;
  spacerHeight: number;
  allowColapse: boolean;
  defaultExpanded: boolean;
  ctrChoiceGroups: CtrChoiceGroup[];
}

export interface CtrChoiceGroup {
  ctrChoiceHeader: string;
  ctrChoiceDescription: string;
  spacerHeight: number;
  choices: CtrChoiceGroupChoice[];
}

export interface CtrChoiceGroupChoice {
  displayName: string;
  ctrText: string;
  basketMsg: string;
  selected: boolean;
}

// export enum BasketMsg {
//     NoGlasses = "No Glasses",
//     SwapChipsForJacket = "Swap chips for jacket",
//     SwapJacketForChips = "Swap jacket for chips",
//     SwapPeasForBeans = "Swap peas for beans",
//     The1Glass = "1 glass",
//     The2Glasses = "2 glasses",
//     The3Glasses = "3 glasses",
//     The4Glasses = "4 glasses",
//     The5Glasses = "5 glasses",
// }

// export enum CtrText {
//     NOchipADDjkt = "NOchipADDjkt",
//     NOpeasADDbean = "NOpeasADDbean",
//     NoGlasses = "NO GLASSES",
//     The1_Glass = "1_GLASS",
//     The2_Glasses = "2_GLASSES",
//     The3_Glasses = "3_GLASSES",
//     The4_Glasses = "4_GLASSES",
//     The5_Glasses = "5_GLASSES",
// }

// export enum DisplayName {
//     Beans = "Beans",
//     Jacket = "Jacket",
//     NoGlasses = "No glasses",
//     The1Glass = "1 glass",
//     The2Glasses = "2 glasses",
//     The3Glasses = "3 glasses",
//     The4Glasses = "4 glasses",
//     The5Glasses = "5 glasses",
// }

// export enum CtrChoiceDescription {
//     Empty = "",
//     SwapChipsFor = "Swap chips for:",
//     SwapPeasFor = "Swap peas for:",
// }

// export enum CtrHeader {
//     HowManyGlassesWouldYouLike = "How many glasses would you like?",
//     ThisItemIsServedWithChips = "This item is served with chips.",
//     ThisItemIsServerdWithChipsAndPeas = "This item is serverd with chips and peas.",
// }

// export enum DisplayPriceLabel {
//     SoftDrink = "Soft drink",
// }

// export enum LeadingIcon {
//     New1 = "new-1",
// }

// export enum PromoPriceLabel {
//     AlcoholicDrink = "Alcoholic\n drink",
// }

// export enum PromoText {
//     Any2For550 = "Any 2 for £5.50",
//     Any3For1250 = "Any 3 for £12.50",
//     Any3For550 = "Any 3 for £5.50",
//     CocktailPitchers2For13 = "Cocktail pitchers 2 for £13",
//     CocktailPitchers2For1395 = "Cocktail pitchers 2 for £13.95",
//     Empty = "",
//     IncludesADrink = "Includes a drink",
//     The4For550 = "4 for £5.50",
// }

export enum WineGroup {
  Red = "red",
  Rose = "rose",
  Spark = "spark",
  White = "white",
}

export interface SubMenuSubMenu {
  headerDescription: string;
  headerImage: string;
  headerText: HeaderText;
  showSearchBar: boolean;
  showVenue: boolean;
  venueInfoAction: string;
  productGroups: FluffyProductGroup[];
}

export interface FluffyProductGroup {
  groupDescription: string;
  groupHeader: HeaderText;
  promoDescription: string;
  promoHeader: string;
  spacerHeight: number;
  products: ProductChoiceElement[];
}

export interface Supplements {
  allergens: Allergens;
}

export interface Allergens {
  text: string;
  backgroundColour: string;
  textColour: string;
  icon: string;
  action: string;
  levels: number[];
}
