import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calculator } from "@/components/Calculator";
import { getCarBySeoSlug, getCarsByModel, getSeoSlug, seoCars } from "@/data/cars";
import { formatCurrency } from "@/lib/calculator";

interface ModelLoanPageProps {
  params: {
    slug: string;
  };
}

export const dynamicParams = false;

export function generateStaticParams() {
  return seoCars.map((car) => ({ slug: getSeoSlug(car) }));
}

export function generateMetadata({ params }: ModelLoanPageProps): Metadata {
  const car = getCarBySeoSlug(params.slug);

  if (!car) {
    return {};
  }

  const variants = getCarsByModel(car.brand, car.model);
  const startingPrice = variants[0]?.price ?? car.price;

  return {
    title: `${car.brand} ${car.model} Loan Calculator Malaysia | CarLoan.my`,
    description: `Estimate ${car.brand} ${car.model} monthly instalments in Malaysia, compare tenures, and review ownership costs from ${formatCurrency(
      startingPrice,
    )}.`,
  };
}

export default function ModelLoanPage({ params }: ModelLoanPageProps) {
  const car = getCarBySeoSlug(params.slug);

  if (!car) {
    notFound();
  }

  const variants = getCarsByModel(car.brand, car.model);

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
        featuredCarIds={variants.slice(0, 6).map((variant) => variant.id)}
        heroTag="SEO model page"
        initialCarId={car.id}
        title={`${car.brand} ${car.model} loan calculator for Malaysia.`}
        description={`Estimate monthly instalments, review affordability, compare financing scenarios, and explore ownership costs across ${variants.length} ${car.brand} ${car.model} variants in one place.`}
      />
    </div>
  );
}
