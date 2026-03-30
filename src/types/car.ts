export type CarListingType = "new" | "used";

export type CarBodyType = "Hatchback" | "Sedan" | "SUV" | "MPV";

export type CarTransmission = "Manual" | "AT" | "CVT" | "D-CVT" | "e-CVT";

export type CarFuelType = "Petrol" | "Hybrid" | "Electric";

export interface Car {
  id: string;
  brand: string;
  model: string;
  variant: string;
  price: number;
  rate: number;
  type: CarListingType;
  image: string;
  year?: number;
  bodyType?: CarBodyType;
  transmission?: CarTransmission;
  fuelType?: CarFuelType;
  featured?: boolean;
  tags?: string[];
}
