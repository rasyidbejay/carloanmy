import CarImage from "@/components/CarImage";
import { formatCurrency, formatRate } from "@/lib/format";
import type { Car } from "@/types/car";
import Card from "./ui/Card";

type SelectedCarHeroProps = {
  car?: Car | null;
  variant?: "card" | "inline";
};

export default function SelectedCarHero({
  car,
  variant = "card",
}: SelectedCarHeroProps) {
  if (!car) {
    if (variant === "inline") {
      return (
        <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/40 p-3">
          <div className="relative h-16 w-24 overflow-hidden rounded-lg bg-muted/50">
            <CarImage
              fill
              alt="Car placeholder"
              src="/placeholder/car-placeholder.webp"
              sizes="180px"
            />
          </div>
          <div className="space-y-1">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Selected Car
            </p>
            <h2 className="text-lg font-semibold tracking-[-0.03em] text-foreground">
              Pick a car to preview it here
            </h2>
            <p className="text-xs leading-5 text-muted-foreground">
              Search the catalogue and select a car to prefill the calculator.
            </p>
          </div>
        </div>
      );
    }

    return (
      <Card className="flex items-center gap-4 p-4">
        <div className="relative h-20 w-28 overflow-hidden rounded-xl bg-muted/50">
          <CarImage
            fill
            alt="Car placeholder"
            src="/placeholder/car-placeholder.webp"
            sizes="180px"
          />
        </div>
        <div className="space-y-2">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Selected Car
          </p>
          <h2 className="text-xl font-semibold tracking-[-0.03em] text-foreground">
            Pick a car to preview it here
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">
            Search the catalogue and select a car to prefill the calculator.
          </p>
        </div>
      </Card>
    );
  }

  const chips = [
    car.type === "new" ? "New car" : "Used car",
    car.bodyType,
    car.transmission,
    car.fuelType,
    car.year?.toString(),
    ...(car.tags ?? []).slice(0, 2),
  ].filter(Boolean) as string[];

  const Wrapper = variant === "inline" ? "div" : Card;
  const wrapperClass =
    variant === "inline"
      ? "flex h-full flex-col overflow-hidden rounded-xl border border-border/60 bg-muted/40 p-4 min-h-[360px] sm:min-h-[420px]"
      : "flex h-full flex-col overflow-hidden p-4 sm:p-5 lg:p-6 min-h-[380px] sm:min-h-[440px]";

  return (
    <Wrapper className={wrapperClass}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="relative flex-[7] min-h-[220px]">
          <div className="relative h-full w-full overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-b from-muted/70 via-muted/50 to-muted/30 shadow-inner flex items-center justify-center p-3 sm:p-4">
            <CarImage
              fill
              priority
              alt={`${car.brand} ${car.model} ${car.variant}`}
              src={car.image}
              sizes="540px"
              className="object-contain object-center"
            />
          </div>
        </div>

        <div className="flex flex-[3] flex-col gap-3">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Selected Car
          </p>

          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-[-0.045em] text-foreground lg:text-[1.75rem]">
              {car.brand} {car.model}
            </h2>
            <p className="text-sm text-muted-foreground">{car.variant}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border border-border/70 bg-muted/45 px-3 py-2.5">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Price
              </p>
              <p className="text-base font-semibold text-foreground">
                {formatCurrency(car.price)}
              </p>
            </div>
            <div className="rounded-xl border border-border/70 bg-muted/45 px-3 py-2.5">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Rate
              </p>
              <p className="text-base font-semibold text-foreground">
                {formatRate(car.rate)}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Details
            </div>
            <div className="flex flex-wrap gap-2">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-border/60 bg-surface px-3 py-1 text-[10px] font-medium text-muted-foreground"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
