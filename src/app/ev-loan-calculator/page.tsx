import type { Metadata } from "next";
import Link from "next/link";
import { Calculator } from "@/components/Calculator";
import { electricCars } from "@/data/cars";

export const metadata: Metadata = {
  title: "EV Loan Calculator Malaysia | CarLoan.my",
  description:
    "Estimate EV instalments in Malaysia with EV-friendly ownership assumptions, trade-in support, and total cost planning.",
};

export default function EvLoanCalculatorPage() {
  const featuredEvCars = electricCars.slice(0, 6);

  return (
    <div>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 pt-6 sm:px-6 lg:px-8">
        <Link
          className="rounded-full border border-[color:var(--line)] px-4 py-2 text-sm font-medium text-muted transition hover:border-[color:var(--accent)] hover:text-[color:var(--foreground)]"
          href="/"
        >
          Back to main calculator
        </Link>
      </div>

      <Calculator
        allowedCarIds={electricCars.map((car) => car.id)}
        featuredCarIds={featuredEvCars.map((car) => car.id)}
        heroTag="EV calculator"
        initialCarId={featuredEvCars[0]?.id}
        title="EV financing calculator for Malaysia."
        description="Focus on electric models like BYD, Tesla, smart, and Volvo EVs while keeping the same instalment, trade-in, ownership, and affordability flows. EV entries automatically reflect the EV road-tax treatment already built into the tool."
        searchPlaceholder="Try BYD Seal, Tesla Model 3, Volvo EX30..."
      />
    </div>
  );
}
