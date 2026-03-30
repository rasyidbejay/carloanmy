import { getFeaturedCars, searchCars } from "@/data/cars";
import type { Car } from "@/types/car";
import CarCard from "./CarCard";
import Card from "./ui/Card";

type CarGridProps = {
  cars: Car[];
  query: string;
  selectedCarId?: string | null;
  onSelectCar: (car: Car) => void;
  affordabilityMap?: Record<string, "comfortable" | "manageable" | "stretch" | "risky">;
};

export default function CarGrid({
  cars,
  onSelectCar,
  query,
  selectedCarId,
  affordabilityMap,
}: CarGridProps) {
  const hasQuery = query.trim().length > 0;
  const baseCars = hasQuery ? searchCars(cars, query) : getFeaturedCars(cars);
  const statusOrder = { comfortable: 0, manageable: 1, stretch: 2, risky: 3 };
  const visibleCars = affordabilityMap
    ? [...baseCars].sort((a, b) => {
        const statusA = affordabilityMap[a.id] ?? "risky";
        const statusB = affordabilityMap[b.id] ?? "risky";
        if (statusA !== statusB) {
          return statusOrder[statusA] - statusOrder[statusB];
        }
        return a.price - b.price;
      })
    : baseCars;

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-muted-foreground">
            {hasQuery ? "Search Results" : "Featured Cars"}
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-foreground">
            {hasQuery
              ? "Cars matching your search"
              : "A focused shortlist to get started"}
          </h2>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          {visibleCars.length} {visibleCars.length === 1 ? "car" : "cars"}
        </p>
      </div>

      {visibleCars.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {visibleCars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              isSelected={selectedCarId === car.id}
              onSelectCar={onSelectCar}
              affordabilityStatus={affordabilityMap?.[car.id]}
            />
          ))}
        </div>
      ) : (
        <Card className="p-8">
          <p className="text-base font-medium tracking-[-0.02em] text-foreground">
            No matching cars yet
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
            Try a shorter search term or switch back to the featured list to
            continue browsing the starter catalogue.
          </p>
        </Card>
      )}
    </section>
  );
}
