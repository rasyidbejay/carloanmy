"use client";

import { Search, X } from "lucide-react";
import { useId, useState } from "react";
import { searchCars } from "@/data/cars";
import { formatCompactCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Car } from "@/types/car";

type SearchBarProps = {
  cars: Car[];
  query: string;
  onQueryChange: (query: string) => void;
  onSelectCar: (car: Car) => void;
  className?: string;
};

export default function SearchBar({
  cars,
  className,
  onQueryChange,
  onSelectCar,
  query,
}: SearchBarProps) {
  const listboxId = useId();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const hasQuery = query.trim().length > 0;
  const results = hasQuery ? searchCars(cars, query).slice(0, 6) : [];
  const showDropdown = isOpen && hasQuery;

  function selectCar(car: Car) {
    onQueryChange(`${car.brand} ${car.model} ${car.variant}`);
    onSelectCar(car);
    setActiveIndex(0);
    setIsOpen(false);
  }

  return (
    <div
      className={cn("relative", className)}
      onBlur={(event) => {
        const nextFocusedElement = event.relatedTarget as Node | null;

        if (!event.currentTarget.contains(nextFocusedElement)) {
          setIsOpen(false);
          setActiveIndex(0);
        }
      }}
    >
      <label htmlFor="car-search" className="sr-only">
        Search cars
      </label>
      <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-surface/92 px-5 py-4 shadow-sm shadow-black/5 transition-all duration-200 focus-within:border-accent/35 focus-within:shadow-md focus-within:shadow-black/5">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          id="car-search"
          role="combobox"
          type="text"
          value={query}
          autoComplete="off"
          placeholder="Search your car (e.g. Myvi, City, Corolla Cross)"
          aria-autocomplete="list"
          aria-activedescendant={
            showDropdown && results[activeIndex]
              ? `${listboxId}-${results[activeIndex].id}`
              : undefined
          }
          aria-controls={showDropdown ? listboxId : undefined}
          aria-expanded={showDropdown}
          className="w-full bg-transparent text-lg text-foreground outline-none placeholder:text-muted-foreground/80"
          onChange={(event) => {
            onQueryChange(event.target.value);
            setActiveIndex(0);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(event) => {
            if (!hasQuery) {
              return;
            }

            if (event.key === "ArrowDown") {
              event.preventDefault();
              setIsOpen(true);
              setActiveIndex((currentIndex) =>
                results.length === 0
                  ? 0
                  : (currentIndex + 1) % Math.max(results.length, 1),
              );
            }

            if (event.key === "ArrowUp") {
              event.preventDefault();
              setIsOpen(true);
              setActiveIndex((currentIndex) =>
                results.length === 0
                  ? 0
                  : (currentIndex - 1 + results.length) % results.length,
              );
            }

            if (event.key === "Enter" && results[activeIndex]) {
              event.preventDefault();
              selectCar(results[activeIndex]);
            }

            if (event.key === "Escape") {
              setIsOpen(false);
            }
          }}
        />
        {hasQuery ? (
          <button
            type="button"
            aria-label="Clear search"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              onQueryChange("");
              setActiveIndex(0);
              setIsOpen(false);
            }}
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Start by searching your desired car.
      </p>

      {showDropdown ? (
        <div className="absolute inset-x-0 top-full z-30 mt-3 overflow-hidden rounded-2xl border border-border/70 bg-surface/95 shadow-xl shadow-black/10 backdrop-blur-xl">
          {results.length > 0 ? (
            <div
              id={listboxId}
              role="listbox"
              className="max-h-[22rem] overflow-y-auto p-2"
            >
              {results.map((car, index) => {
                const isActive = index === activeIndex;

                return (
                  <button
                    key={car.id}
                    id={`${listboxId}-${car.id}`}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition-colors duration-200",
                      isActive ? "bg-muted text-foreground" : "hover:bg-muted/70",
                    )}
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => selectCar(car)}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium tracking-[-0.02em] text-foreground">
                        {car.brand} {car.model}
                      </p>
                      <p className="mt-1 truncate text-sm text-muted-foreground">
                        {car.variant}
                      </p>
                    </div>
                    <div className="ml-4 shrink-0 text-right">
                      <p className="text-sm font-medium tracking-[-0.02em] text-foreground">
                        {formatCompactCurrency(car.price)}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        {car.type}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="px-4 py-5">
              <p className="text-sm font-medium tracking-[-0.02em] text-foreground">
                No cars match your search.
              </p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Try a broader brand or model name to explore the starter
                catalogue.
              </p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
