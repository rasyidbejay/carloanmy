import type { Car } from "@/types/car";

export const cars: Car[] = [
  {
    id: "perodua-myvi-1-5-av",
    brand: "Perodua",
    model: "Myvi",
    variant: "1.5 AV",
    price: 59500,
    rate: 2.85,
    type: "new",
    image: "/cars/perodua-myvi.jpg",
    year: 2025,
    bodyType: "Hatchback",
    transmission: "D-CVT",
    fuelType: "Petrol",
    featured: true,
    tags: ["Best seller", "Daily driver"],
  },
  {
    id: "perodua-ativa-1-0-turbo-ava",
    brand: "Perodua",
    model: "Ativa",
    variant: "1.0 Turbo AV",
    price: 73500,
    rate: 2.95,
    type: "new",
    image: "/cars/perodua-ativa.jpg",
    year: 2025,
    bodyType: "SUV",
    transmission: "CVT",
    fuelType: "Petrol",
    featured: true,
    tags: ["Compact SUV", "Turbo"],
  },
  {
    id: "perodua-alza-1-5-av",
    brand: "Perodua",
    model: "Alza",
    variant: "1.5 AV",
    price: 76500,
    rate: 2.9,
    type: "new",
    image: "/cars/perodua-alza.jpg",
    year: 2025,
    bodyType: "MPV",
    transmission: "D-CVT",
    fuelType: "Petrol",
    featured: true,
    tags: ["Family pick", "7-seater"],
  },
  {
    id: "proton-saga-1-3-premium-s",
    brand: "Proton",
    model: "Saga",
    variant: "1.3 Premium S",
    price: 44300,
    rate: 3.15,
    type: "new",
    image: "/cars/proton-saga.jpg",
    year: 2025,
    bodyType: "Sedan",
    transmission: "AT",
    fuelType: "Petrol",
    tags: ["Accessible", "City use"],
  },
  {
    id: "proton-s70-1-5-flagship-x",
    brand: "Proton",
    model: "S70",
    variant: "1.5 Flagship X",
    price: 94300,
    rate: 3.05,
    type: "new",
    image: "/cars/proton-s70.jpg",
    year: 2025,
    bodyType: "Sedan",
    transmission: "D-CVT",
    fuelType: "Petrol",
    featured: true,
    tags: ["C-segment feel", "Tech pack"],
  },
  {
    id: "proton-x50-1-5-premium",
    brand: "Proton",
    model: "X50",
    variant: "1.5 Premium",
    price: 101800,
    rate: 3.1,
    type: "new",
    image: "/cars/proton-x50.jpg",
    year: 2025,
    bodyType: "SUV",
    transmission: "D-CVT",
    fuelType: "Petrol",
    featured: true,
    tags: ["Popular SUV", "ADAS"],
  },
  {
    id: "honda-city-1-5-v-sensing",
    brand: "Honda",
    model: "City",
    variant: "1.5 V SENSING",
    price: 94400,
    rate: 2.78,
    type: "new",
    image: "/cars/honda-city.jpg",
    year: 2025,
    bodyType: "Sedan",
    transmission: "CVT",
    fuelType: "Petrol",
    featured: true,
    tags: ["Balanced pick", "Honda SENSING"],
  },
  {
    id: "honda-hr-v-ehev-rs",
    brand: "Honda",
    model: "HR-V",
    variant: "e:HEV RS",
    price: 143900,
    rate: 2.75,
    type: "new",
    image: "/cars/honda-hrv.jpg",
    year: 2025,
    bodyType: "SUV",
    transmission: "e-CVT",
    fuelType: "Hybrid",
    featured: true,
    tags: ["Hybrid", "Premium SUV"],
  },
  {
    id: "toyota-vios-1-5-g",
    brand: "Toyota",
    model: "Vios",
    variant: "1.5 G",
    price: 95900,
    rate: 2.88,
    type: "new",
    image: "/cars/toyota-vios.jpg",
    year: 2025,
    bodyType: "Sedan",
    transmission: "CVT",
    fuelType: "Petrol",
    tags: ["Reliable", "Everyday sedan"],
  },
  {
    id: "toyota-corolla-cross-1-8-hev",
    brand: "Toyota",
    model: "Corolla Cross",
    variant: "1.8 HEV",
    price: 140800,
    rate: 2.7,
    type: "new",
    image: "/cars/toyota-corolla-cross.jpg",
    year: 2025,
    bodyType: "SUV",
    transmission: "e-CVT",
    fuelType: "Hybrid",
    featured: true,
    tags: ["Hybrid", "Family SUV"],
  },
  {
    id: "used-honda-civic-1-5-tc-p-2022",
    brand: "Honda",
    model: "Civic",
    variant: "1.5 TC-P",
    price: 118000,
    rate: 3.68,
    type: "used",
    image: "/cars/honda-civic-2022.jpg",
    year: 2022,
    bodyType: "Sedan",
    transmission: "CVT",
    fuelType: "Petrol",
    tags: ["Used pick", "Turbo"],
  },
  {
    id: "used-toyota-yaris-1-5-g-2021",
    brand: "Toyota",
    model: "Yaris",
    variant: "1.5 G",
    price: 69800,
    rate: 3.9,
    type: "used",
    image: "/cars/toyota-yaris-2021.jpg",
    year: 2021,
    bodyType: "Hatchback",
    transmission: "CVT",
    fuelType: "Petrol",
    tags: ["Used hatch", "Low upkeep"],
  },
];

export const electricCars = cars.filter((car) => car.fuelType === "Hybrid");

export const seoCars = Array.from(
  new Map(cars.map((car) => [getSeoSlug(car), car])).values(),
);

export function getFeaturedCars(collection: Car[]) {
  return collection.filter((car) => car.featured);
}

export function getSeoSlug(car: Car) {
  return `${car.brand}-${car.model}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getCarBySeoSlug(slug: string) {
  return seoCars.find((car) => getSeoSlug(car) === slug);
}

export function getCarsByModel(brand: string, model: string) {
  return cars
    .filter((car) => car.brand === brand && car.model === model)
    .sort((left, right) => left.price - right.price);
}

function getSearchScore(car: Car, query: string) {
  const brand = car.brand.toLowerCase();
  const model = car.model.toLowerCase();
  const variant = car.variant.toLowerCase();
  const combined = `${brand} ${model} ${variant}`;

  if (combined === query) {
    return 5;
  }

  if (
    brand.startsWith(query) ||
    model.startsWith(query) ||
    variant.startsWith(query)
  ) {
    return 4;
  }

  if (combined.startsWith(query)) {
    return 3;
  }

  if (combined.includes(query)) {
    return 2;
  }

  return 0;
}

export function searchCars(collection: Car[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return collection;
  }

  return collection
    .map((car) => ({
      car,
      score: getSearchScore(car, normalizedQuery),
    }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      if (Boolean(right.car.featured) !== Boolean(left.car.featured)) {
        return Number(Boolean(right.car.featured)) - Number(Boolean(left.car.featured));
      }

      return left.car.price - right.car.price;
    })
    .map((entry) => entry.car);
}
