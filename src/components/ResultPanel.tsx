"use client";

import type { Car } from "@/types/car";
import type { LoanInputs, LoanResult } from "@/types/loan";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import {
  DEFAULT_LOAN_RESULT,
  getLoanTypeLabel,
  sanitizeLoanInputs,
} from "@/lib/calculator";
import { formatCurrencyMYR, formatPercent } from "@/lib/format";

type ResultPanelProps = {
  selectedCar?: Car | null;
  inputs?: Partial<LoanInputs> | null;
  result?: Partial<LoanResult> | null;
  inline?: boolean;
};

export default function ResultPanel({
  inputs,
  result,
  selectedCar,
  inline = false,
}: ResultPanelProps) {
  const safeInputs = sanitizeLoanInputs(inputs);
  const safeResult = {
    ...DEFAULT_LOAN_RESULT,
    ...result,
  };

  if (!selectedCar) {
    if (inline) {
      return (
        <div className="rounded-2xl border border-border/60 bg-muted/40 p-4 text-sm text-muted-foreground">
          Select a car to see the repayment summary here.
        </div>
      );
    }
    return (
      <Card className="p-7 sm:p-8">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-muted-foreground">
          Live Results
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-foreground">
          Results appear once a car is selected
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
          Select a car above and the calculator will instantly show the loan
          amount, monthly instalment, total repayment, and affordability cues.
        </p>
      </Card>
    );
  }

  const interestLabel =
    safeInputs.loanType === "islamic" ? "Estimated profit" : "Total interest";

  const ratio = safeResult.affordabilityRatio;
  const affordabilityTone =
    ratio === undefined
      ? "neutral"
      : ratio <= 0.15
        ? "comfortable"
        : ratio <= 0.3
          ? "manageable"
          : "risky";

  const badgeVariant =
    affordabilityTone === "comfortable"
      ? "comfortable"
      : affordabilityTone === "manageable"
        ? "stretch"
        : affordabilityTone === "risky"
          ? "risky"
          : "neutral";

  const toneLabel =
    affordabilityTone === "comfortable"
      ? "Comfortable"
      : affordabilityTone === "manageable"
        ? "Manageable"
        : affordabilityTone === "risky"
          ? "Risky"
          : "Income not set";

  const toneStyles: Record<string, string> = {
    comfortable:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-50 dark:text-emerald-100",
    manageable:
      "border-amber-400/25 bg-amber-400/10 text-amber-50 dark:text-amber-100",
    risky: "border-rose-500/25 bg-rose-500/10 text-rose-50 dark:text-rose-100",
    neutral: "border-border/60 bg-surface text-foreground",
  };

  const affordabilitySentence =
    affordabilityTone === "comfortable"
      ? "Comfortable — fits well within your income."
      : affordabilityTone === "manageable"
        ? "Manageable — should be okay with your income."
        : affordabilityTone === "risky"
          ? "Risky — may strain your income."
          : "Add income to see affordability guidance.";

  const content = (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border/70 bg-muted/60 p-6 text-center shadow-sm shadow-black/10">
        <p className="text-sm font-medium text-muted-foreground">
          Estimated Monthly Payment
        </p>
        <p className="mt-3 text-5xl font-semibold tracking-[-0.08em] text-foreground drop-shadow-[0_0_16px_rgba(255,255,255,0.12)] transition-all duration-200 sm:text-6xl lg:text-7xl">
          {formatCurrencyMYR(safeResult.monthlyPayment)}
        </p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {safeInputs.tenureYears}-year {getLoanTypeLabel(safeInputs.loanType).toLowerCase()} plan for {selectedCar.brand} {selectedCar.model}.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-border/70 bg-surface p-4">
          <p className="text-sm text-muted-foreground">Loan amount</p>
          <p className="mt-2 text-xl font-semibold tracking-[-0.03em] text-foreground transition-all duration-200">
            {formatCurrencyMYR(safeResult.loanAmount)}
          </p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-surface p-4">
          <p className="text-sm text-muted-foreground">Total repayment</p>
          <p className="mt-2 text-xl font-semibold tracking-[-0.03em] text-foreground transition-all duration-200">
            {formatCurrencyMYR(safeResult.totalRepayment)}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border/70 bg-surface p-4">
        <p className="text-sm text-muted-foreground">{interestLabel}</p>
        <p className="mt-2 text-xl font-semibold tracking-[-0.03em] text-foreground transition-all duration-200">
          {formatCurrencyMYR(safeResult.totalInterest)}
        </p>
      </div>

      {safeResult.affordabilityRatio !== undefined ? (
        <div
          className={cn(
            "rounded-2xl border p-5 transition-all duration-200 text-sm",
            toneStyles[affordabilityTone],
          )}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium tracking-[-0.01em]">
                Affordability
              </p>
              <p className="mt-1 text-sm leading-6 text-foreground/90">
                Uses {formatPercent(safeResult.affordabilityRatio, {
                  fromFraction: true,
                  maximumFractionDigits: 1,
                })} of the monthly income entered.
              </p>
              <p className="mt-1 text-sm text-foreground/90">{affordabilitySentence}</p>
            </div>
            <Badge variant={badgeVariant}>{toneLabel}</Badge>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-border/70 bg-surface p-5 opacity-80">
          <p className="text-sm font-medium tracking-[-0.01em] text-foreground">
            Affordability
          </p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Add monthly income in the input panel to unlock affordability
            guidance.
          </p>
        </div>
      )}
    </div>
  );

  if (inline) {
    return content;
  }

  return <Card className="p-6 sm:p-7">{content}</Card>;
}
