"use client";

import { useEffect, useMemo, useState } from "react";
import { Menu } from "lucide-react";
import CarGrid from "@/components/CarGrid";
import InputPanel from "@/components/InputPanel";
import AmortizationTable from "@/components/AmortizationTable";
import ComparePanel from "@/components/ComparePanel";
import CarCard from "@/components/CarCard";
import ResultPanel from "@/components/ResultPanel";
import SearchBar from "@/components/SearchBar";
import SelectedCarHero from "@/components/SelectedCarHero";
import Sidebar from "@/components/Sidebar";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { cars } from "@/data/cars";
import {
  buildAmortizationSchedule,
  calculateLoanResult,
  DEFAULT_LOAN_INPUTS,
  estimatePriceFromMonthlyBudget,
  sanitizeLoanInputs,
} from "@/lib/calculator";
import { useLoanCalculator } from "@/hooks/useLoanCalculator";
import type { Car } from "@/types/car";
import type { CompareScenario, LoanInputs } from "@/types/loan";
import LoanTypeToggle from "@/components/LoanTypeToggle";
import { formatCurrency, formatCurrencyMYR } from "@/lib/format";

type ViewKey = "affordability" | "discover" | "calculator" | "compare" | "breakdown";

function createInitialLoanInputs(
  car: Car,
  overrides?: Partial<LoanInputs>,
): LoanInputs {
  return {
    price: car.price,
    downPayment: Math.round(car.price * 0.1),
    annualRate: car.rate,
    tenureYears: 7,
    loanType: "hire-purchase",
    monthlyIncome: 0,
    ...overrides,
  };
}

function createScenarioLabel(
  inputs: LoanInputs,
  currentScenarios: CompareScenario[],
) {
  const safeInputs = sanitizeLoanInputs(inputs);
  const downPaymentRatio =
    safeInputs.price > 0 ? safeInputs.downPayment / safeInputs.price : 0;
  const downPaymentPercent = Math.round(downPaymentRatio * 100);
  const baseLabel = `${downPaymentPercent}% down · ${safeInputs.tenureYears}y${
    safeInputs.loanType === "islamic" ? " · Islamic" : ""
  }`;
  const duplicateCount = currentScenarios.filter((scenario) =>
    scenario.label.startsWith(baseLabel),
  ).length;

  return duplicateCount > 0 ? `${baseLabel} · ${duplicateCount + 1}` : baseLabel;
}

export default function Page() {
  const [query, setQuery] = useState("");
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [loanInputs, setLoanInputs] = useState<LoanInputs>(DEFAULT_LOAN_INPUTS);
  const [compareScenarios, setCompareScenarios] = useState<CompareScenario[]>([]);
  const [activeView, setActiveView] = useState<ViewKey>("affordability");
  const [salary, setSalary] = useState<number>(6000);
  const [affDownPayment, setAffDownPayment] = useState<number>(12000);
  const [affTenureYears, setAffTenureYears] = useState<number>(7);
  const [affAnnualRate, setAffAnnualRate] = useState<number>(3.0);
  const [affLoanType, setAffLoanType] = useState<LoanInputs["loanType"]>("hire-purchase");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const loanResult = useLoanCalculator(loanInputs);
  const repaymentRows = selectedCar ? buildAmortizationSchedule(loanInputs) : [];
  const canSaveScenario = Boolean(selectedCar) && compareScenarios.length < 3;

  function handleSelectCar(car: Car) {
    const isDifferentCar = selectedCar?.id !== car.id;

    setSelectedCar(car);
    setLoanInputs(
      createInitialLoanInputs(car, {
        downPayment: affDownPayment,
        tenureYears: affTenureYears,
        annualRate: affAnnualRate,
        loanType: affLoanType,
        monthlyIncome: salary,
      }),
    );
    setActiveView("calculator");

    if (isDifferentCar) {
      setCompareScenarios([]);
    }
  }

  function handleSaveScenario() {
    if (!selectedCar || !canSaveScenario) {
      return;
    }

    const nextInputs = sanitizeLoanInputs(loanInputs);
    const nextResult = calculateLoanResult(nextInputs);
    setCompareScenarios((currentScenarios) => [
      ...currentScenarios,
      {
        id: `${selectedCar.id}-${Date.now()}-${currentScenarios.length + 1}`,
        carId: selectedCar.id,
        label: createScenarioLabel(nextInputs, currentScenarios),
        inputs: nextInputs,
        result: nextResult,
      },
    ]);
  }

  function handleRemoveScenario(scenarioId: string) {
    setCompareScenarios((currentScenarios) =>
      currentScenarios.filter((scenario) => scenario.id !== scenarioId),
    );
  }

  function handleClearScenarios() {
    setCompareScenarios([]);
  }

  function handleLoadScenario(scenario: CompareScenario) {
    if (!selectedCar || scenario.carId !== selectedCar.id) {
      return;
    }

    setLoanInputs(sanitizeLoanInputs(scenario.inputs));
  }

  // Keep salary in sync with calculator affordability when possible
  useEffect(() => {
    if (selectedCar && loanInputs.monthlyIncome !== salary) {
      setLoanInputs((current) => ({ ...current, monthlyIncome: salary }));
    }
  }, [loanInputs.monthlyIncome, salary, selectedCar]);

  const affordabilityBudgets = {
    comfortable: salary * 0.15,
    manageable: salary * 0.3,
    stretch: salary * 0.4,
  };

  const monthlyPaymentForCar = (car: Car) => {
    const price = car.price;
    const dp = Math.min(Math.max(affDownPayment, 0), price);
    const loanAmount = Math.max(price - dp, 0);
    const totalInterest = loanAmount * (affAnnualRate / 100) * affTenureYears;
    const totalRepayment = loanAmount + totalInterest;
    const monthly = totalRepayment / (Math.max(affTenureYears, 1) * 12);
    return monthly;
  };

  const affordabilityMap = useMemo(() => {
    const entries = cars.map((car) => {
      const monthly = monthlyPaymentForCar(car);
      const ratio = salary > 0 ? monthly / salary : undefined;
      let status: "comfortable" | "manageable" | "stretch" | "risky" = "risky";
      if (ratio === undefined) {
        status = "risky";
      } else if (ratio <= 0.15) {
        status = "comfortable";
      } else if (ratio <= 0.3) {
        status = "manageable";
      } else if (ratio <= 0.4) {
        status = "stretch";
      }

      return [car.id, status] as const;
    });

    return Object.fromEntries(entries) as Record<string, "comfortable" | "manageable" | "stretch" | "risky">;
  }, [affAnnualRate, affDownPayment, affTenureYears, salary]);

  const affordableCars = useMemo(() => {
    const statusOrder = { comfortable: 0, manageable: 1, stretch: 2, risky: 3 };
    return [...cars].sort((a, b) => {
      const statusA = affordabilityMap[a.id] ?? "risky";
      const statusB = affordabilityMap[b.id] ?? "risky";
      if (statusA !== statusB) {
        return statusOrder[statusA] - statusOrder[statusB];
      }
      return a.price - b.price;
    });
  }, [affordabilityMap]);

  const suggestedPrice = estimatePriceFromMonthlyBudget(
    affordabilityBudgets.manageable,
    affDownPayment,
    affAnnualRate,
    affTenureYears,
  );

  const comfortablePrice = estimatePriceFromMonthlyBudget(
    affordabilityBudgets.comfortable,
    affDownPayment,
    affAnnualRate,
    affTenureYears,
  );

  const stretchPrice = estimatePriceFromMonthlyBudget(
    affordabilityBudgets.stretch,
    affDownPayment,
    affAnnualRate,
    affTenureYears,
  );

  const parseNumber = (value: string) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background via-surface/60 to-background/80">
      <Sidebar
        active={activeView}
        onChange={(view) => {
          setActiveView(view);
          setMobileNavOpen(false);
        }}
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />
      <main className="flex-1 w-full min-w-0 px-4 py-6 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex w-full flex-col gap-6">
          <div className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border/50 bg-surface/90 px-4 py-3 backdrop-blur lg:hidden">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-muted/40 px-3 py-2 text-sm font-semibold text-foreground shadow-sm"
              onClick={() => setMobileNavOpen(true)}
            >
              <Menu className="h-5 w-5" />
              Menu
            </button>
            <div className="flex items-center gap-2 rounded-full border border-border/40 bg-muted/25 px-3 py-1.5 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Live calculations enabled
            </div>
          </div>
          <div className="rounded-3xl border border-border/50 bg-surface/75 p-6 shadow-xl shadow-black/8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[0.78rem] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                  CarLoan.my Dashboard
                </p>
                <h1 className="text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
                  Salary-first affordability overview
                </h1>
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-border/40 bg-muted/25 px-3 py-2 text-sm text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Live calculations enabled
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {activeView === "affordability" && (
              <div className="space-y-6">
                <Card className="space-y-5 rounded-3xl border border-accent/25 bg-surface/85 p-7 shadow-[0_10px_30px_-22px_rgba(99,102,241,0.7)]">
                  <div className="flex items-center justify-between rounded-2xl border border-accent/20 bg-accent/5 px-4 py-3">
                    <div>
                      <p className="text-[0.78rem] font-semibold uppercase tracking-[0.26em] text-muted-foreground">
                        Affordability inputs
                      </p>
                      <h2 className="text-2xl font-semibold tracking-[-0.04em] text-foreground">
                        Tune your salary and basics
                      </h2>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground" htmlFor="aff-salary">
                        Monthly salary
                      </label>
                      <Input
                        id="aff-salary"
                        type="number"
                        min={0}
                        step={100}
                        value={salary}
                        className="h-12 text-base"
                        onChange={(e) => setSalary(Math.max(0, parseNumber(e.target.value)))}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground" htmlFor="aff-dp">
                        Down payment
                      </label>
                      <Input
                        id="aff-dp"
                        type="number"
                        min={0}
                        step={1000}
                        value={affDownPayment}
                        className="h-12 text-base"
                        onChange={(e) => setAffDownPayment(Math.max(0, parseNumber(e.target.value)))}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground" htmlFor="aff-tenure">
                        Tenure (years)
                      </label>
                      <Input
                        id="aff-tenure"
                        type="number"
                        min={1}
                        max={9}
                        step={1}
                        value={affTenureYears}
                        className="h-12 text-base"
                        onChange={(e) =>
                          setAffTenureYears(Math.min(9, Math.max(1, parseNumber(e.target.value))))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        Loan type
                      </label>
                      <div className="h-12 flex items-center">
                        <LoanTypeToggle value={affLoanType} onChange={setAffLoanType} />
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="space-y-5 rounded-3xl border border-border/50 bg-surface/85 p-7 shadow-lg shadow-black/12">
                  <div className="flex items-center justify-between">
                    <p className="text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                      Budget overview
                    </p>
                    <p className="text-sm text-muted-foreground">Updated live with your inputs</p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-2xl border border-border/40 bg-muted/15 p-5">
                      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Comfortable (15%)
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-foreground">
                        {formatCurrencyMYR(affordabilityBudgets.comfortable)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Max price ~ {formatCurrency(comfortablePrice)}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-emerald-400/45 bg-emerald-500/8 p-5 shadow-[0_10px_30px_-18px_rgba(16,185,129,0.7)]">
                      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Recommended (30%)
                      </p>
                      <p className="mt-2 text-3xl font-semibold text-foreground">
                        {formatCurrencyMYR(affordabilityBudgets.manageable)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Max price ~ {formatCurrency(suggestedPrice)}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-amber-500/35 bg-amber-500/7 p-5">
                      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Stretch (40%)
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-foreground">
                        {formatCurrencyMYR(affordabilityBudgets.stretch)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Max price ~ {formatCurrency(stretchPrice)}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    We recommend staying near the 30% monthly budget for a balanced repayment.
                  </p>
                </Card>

                <Card className="space-y-4 rounded-3xl border border-border/60 bg-surface/80 p-6 shadow-lg shadow-black/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-muted-foreground">
                        Cars within your range
                      </p>
                      <p className="text-sm leading-6 text-muted-foreground">
                        Sorted by affordability using your salary, down payment, and tenure.
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {affordableCars.length} cars
                    </p>
                  </div>
                  {affordableCars.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                      {affordableCars.map((car) => (
                        <CarCard
                          key={car.id}
                          car={car}
                          isSelected={selectedCar?.id === car.id}
                          onSelectCar={handleSelectCar}
                          affordabilityStatus={affordabilityMap[car.id]}
                        />
                      ))}
                    </div>
                  ) : (
                    <Card className="p-8">
                      <p className="text-base font-medium tracking-[-0.02em] text-foreground">
                        No cars to show yet
                      </p>
                      <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
                        Adjust your salary or tenure to see what fits within reach.
                      </p>
                    </Card>
                  )}
                </Card>
              </div>
            )}

            {activeView === "discover" && (
              <div className="space-y-8">
                <div className="space-y-3">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-muted-foreground">
                    Find your car
                  </p>
                  <SearchBar
                    cars={cars}
                    query={query}
                    onQueryChange={setQuery}
                    onSelectCar={handleSelectCar}
                  />
                </div>
                <CarGrid
                  cars={cars}
                  query={query}
                  selectedCarId={selectedCar?.id}
                  onSelectCar={handleSelectCar}
                  affordabilityMap={affordabilityMap}
                />
              </div>
            )}

            {activeView === "calculator" && (
              <div className="space-y-8">
                <div className="space-y-3">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-muted-foreground">
                    Your decision
                  </p>
                  <div className="rounded-2xl border border-border/70 bg-surface/75 p-4 sm:p-6">
                    <div className="grid items-stretch gap-4 xl:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
                      <SelectedCarHero car={selectedCar} variant="inline" />
                      <ResultPanel
                        selectedCar={selectedCar}
                        inputs={loanInputs}
                        result={loanResult}
                        inline
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-muted-foreground">
                    Adjust if needed
                  </p>
                  <InputPanel
                    selectedCar={selectedCar}
                    inputs={loanInputs}
                    onChange={setLoanInputs}
                  />
                </div>
              </div>
            )}

            {activeView === "compare" && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-muted-foreground">
                    Compare
                  </p>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Compare saved scenarios for this selected car.
                  </p>
                </div>
                <ComparePanel
                  selectedCar={selectedCar}
                  scenarios={compareScenarios}
                  canSaveScenario={canSaveScenario}
                  onSaveScenario={handleSaveScenario}
                  onRemoveScenario={handleRemoveScenario}
                  onClearScenarios={handleClearScenarios}
                  onLoadScenario={handleLoadScenario}
                />
              </div>
            )}

            {activeView === "breakdown" && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-muted-foreground">
                    Breakdown
                  </p>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Simplified flat-rate repayment schedule for the current inputs.
                  </p>
                </div>
                <AmortizationTable rows={repaymentRows} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
