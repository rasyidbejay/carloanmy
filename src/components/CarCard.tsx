import CarImage from "@/components/CarImage";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { formatCurrency, formatRate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Car } from "@/types/car";
import Badge from "@/components/ui/Badge";

type CarCardProps = {
  car: Car;
  isSelected?: boolean;
  onSelectCar: (car: Car) => void;
  affordabilityStatus?: "comfortable" | "manageable" | "stretch" | "risky";
};

export default function CarCard({
  car,
  isSelected = false,
  onSelectCar,
  affordabilityStatus,
}: CarCardProps) {
  const metadata = [car.bodyType, car.transmission, car.year?.toString()].filter(
    Boolean,
  ) as string[];

  return (
    <Card
      className={cn(
        "group flex h-full flex-col overflow-hidden border border-border/40 bg-surface/90 p-0 transition-all duration-200 hover:-translate-y-1 hover:border-border/25 hover:shadow-lg hover:shadow-black/20",
        isSelected && "border-accent/40 shadow-md shadow-accent/20",
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted/60">
        <CarImage
          fill
          priority={Boolean(car.featured)}
          alt={`${car.brand} ${car.model} ${car.variant}`}
          src={car.image}
          sizes="(min-width: 1280px) 28vw, (min-width: 768px) 42vw, 100vw"
          className="transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col gap-5 p-6">
        {/* badges row */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "rounded-full px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] bg-muted/60 text-muted-foreground",
              car.type === "new"
                ? "bg-accent/10 text-accent"
                : "bg-muted/60 text-muted-foreground",
            )}
          >
            {car.type}
          </span>
          {affordabilityStatus ? (
            <Badge variant={affordabilityStatus} className="px-2.5 py-1 text-[10px]">
              {affordabilityStatus === "comfortable"
                ? "Comfortable"
                : affordabilityStatus === "manageable"
                  ? "Manageable"
                  : affordabilityStatus === "stretch"
                    ? "Stretch"
                    : "Risky"}
            </Badge>
          ) : null}
        </div>

        {/* title */}
        <div className="space-y-1">
          <h3 className="text-lg font-semibold leading-tight tracking-[-0.02em] text-foreground line-clamp-2">
            {car.brand} {car.model}
          </h3>
          <p className="text-sm leading-6 text-muted-foreground line-clamp-1">
            {car.variant}
          </p>
        </div>

        {/* spec */}
        <div className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground line-clamp-1">
          {metadata.slice(0, 2).join(" · ")}
        </div>

        {/* price */}
        <div className="space-y-1">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Price
          </p>
          <p className="text-3xl font-semibold tracking-[-0.02em] text-foreground">
            {formatCurrency(car.price)}
          </p>
        </div>

        {/* tags */}
        <div className="flex flex-wrap gap-2">
          {metadata.map((item) => (
            <span
              key={item}
              className="rounded-full border border-border/40 bg-muted/30 px-3 py-1 text-xs font-medium text-muted-foreground"
            >
              {item}
            </span>
          ))}
        </div>

        <Button
          variant={isSelected ? "primary" : "secondary"}
          className="mt-auto w-full rounded-xl py-3"
          onClick={() => onSelectCar(car)}
        >
          {isSelected ? "Selected" : "Select car"}
        </Button>
      </div>
    </Card>
  );
}
