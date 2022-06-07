export interface PortionData {
  name: string;
  price: number;
  volumeMl: number;
  units: number;
  unitsPerPound: number;
}

export interface ProductData {
  name: string;
  abv: number;
  portions: PortionData[];
}
