"use client";

import { useState } from "react";
import type { Car } from "@/types/car";
import type { LoanInputs, LoanType } from "@/types/loan";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { sanitizeLoanInputs } from "@/lib/calculator";
import LoanTypeToggle from "./LoanTypeToggle";

type InputPanelProps = {
  selectedCar?: Car | null;
  inputs?: Partial<LoanInputs> | null;
  onChange?: (inputs: LoanInputs) => void;
};

export default function InputPanel({
  inputs,
  onChange,
  selectedCar,
}: InputPanelProps) {
  const safeInputs = sanitizeLoanInputs(inputs);
  const [showAdvanced, setShowAdvanced] = useState(false);

  if (!selectedCar) {
    return (
      <Card className="p-7 sm:p-8">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-muted-foreground">
          Loan Inputs
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-foreground">
          Select a car to unlock the calculator
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
          Once a car is selected, we will prefill the price, estimated rate,
          and sensible financing defaults so you can refine the scenario
          instantly.
        </p>
      </Card>
    );
  }

  function updateInputs(nextValues: Partial<LoanInputs>) {
    if (!onChange) {
      return;
    }

    const nextPrice = Math.max(nextValues.price ?? safeInputs.price, 0);
    const nextDownPayment = Math.min(
      Math.max(nextValues.downPayment ?? safeInputs.downPayment, 0),
      nextPrice,
    );

    onChange({
      ...safeInputs,
      ...nextValues,
      price: nextPrice,
      downPayment: nextDownPayment,
      annualRate: Math.max(nextValues.annualRate ?? safeInputs.annualRate, 0),
      tenureYears: Math.min(
        9,
        Math.max(1, Math.round(nextValues.tenureYears ?? safeInputs.tenureYears)),
      ),
      monthlyIncome:
        nextValues.monthlyIncome === undefined
          ? safeInputs.monthlyIncome
          : nextValues.monthlyIncome,
    });
  }

  function readNumber(value: string) {
    const parsedValue = Number(value);

    return Number.isFinite(parsedValue) ? parsedValue : 0;
  }

  return (
    <Card className="p-6 sm:p-7">
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-muted-foreground">
              Adjust your loan (optional)
            </p>
            <h2 className="text-xl font-semibold tracking-[-0.04em] text-foreground">
              Fine-tune the scenario
            </h2>
            <p className="text-sm leading-6 text-muted-foreground sm:text-base">
              Starting from {selectedCar.brand} {selectedCar.model} {selectedCar.variant}.
            </p>
          </div>
          <button
            type="button"
            className="rounded-full border border-border/60 bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground transition-colors duration-150 hover:border-accent/50 hover:text-foreground"
            onClick={() => setShowAdvanced((open) => !open)}
          >
            {showAdvanced ? "Hide advanced" : "Show advanced"}
          </button>
        </div>

        <div className="space-y-3 rounded-2xl border border-border/40 bg-surface/70 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Quick inputs
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="loan-down-payment"
                className="block text-sm font-medium tracking-[-0.01em] text-foreground"
              >
                Down payment
              </label>
              <Input
                id="loan-down-payment"
                min={0}
                max={safeInputs.price}
                step={500}
                type="number"
                inputMode="numeric"
                value={safeInputs.downPayment}
                onChange={(event) =>
                  updateInputs({ downPayment: readNumber(event.target.value) })
                }
              />
              <p className="text-sm leading-6 text-muted-foreground">
                Between RM0 and the vehicle price.
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="loan-tenure"
                className="block text-sm font-medium tracking-[-0.01em] text-foreground"
              >
                Tenure (years)
              </label>
              <Input
                id="loan-tenure"
                min={1}
                max={9}
                step={1}
                type="number"
                inputMode="numeric"
                value={safeInputs.tenureYears}
                onChange={(event) =>
                  updateInputs({ tenureYears: readNumber(event.target.value) })
                }
              />
              <p className="text-sm leading-6 text-muted-foreground">
                Clamped between 1 and 9 years.
              </p>
            </div>
          </div>
        </div>

        {showAdvanced ? (
          <div className="space-y-3 rounded-2xl border border-border/40 bg-surface/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Advanced
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="loan-price"
                  className="block text-sm font-medium tracking-[-0.01em] text-foreground"
                >
                  Car price
                </label>
                <Input
                  id="loan-price"
                  min={0}
                  step={500}
                  type="number"
                  inputMode="numeric"
                  value={safeInputs.price}
                  onChange={(event) =>
                    updateInputs({ price: readNumber(event.target.value) })
                  }
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="loan-rate"
                  className="block text-sm font-medium tracking-[-0.01em] text-foreground"
                >
                  Interest rate (% p.a.)
                </label>
                <Input
                  id="loan-rate"
                  min={0}
                  step={0.05}
                  type="number"
                  inputMode="decimal"
                  value={safeInputs.annualRate}
                  onChange={(event) =>
                    updateInputs({ annualRate: readNumber(event.target.value) })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium tracking-[-0.01em] text-foreground">
                  Loan type
                </label>
                <LoanTypeToggle
                  value={safeInputs.loanType}
                  onChange={(loanType: LoanType) => updateInputs({ loanType })}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="loan-income"
                  className="block text-sm font-medium tracking-[-0.01em] text-foreground"
                >
                  Monthly income (optional)
                </label>
                <Input
                  id="loan-income"
                  min={0}
                  step={100}
                  type="number"
                  inputMode="numeric"
                  value={safeInputs.monthlyIncome ?? 0}
                  placeholder="Add your monthly income"
                  onChange={(event) =>
                    updateInputs({
                      monthlyIncome: event.target.value
                        ? readNumber(event.target.value)
                        : 0,
                    })
                  }
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
