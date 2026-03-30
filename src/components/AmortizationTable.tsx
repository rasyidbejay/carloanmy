"use client";

import { useMemo, useState } from "react";
import Card from "@/components/ui/Card";
import { formatCurrencyMYR } from "@/lib/format";
import { buildYearlyRepaymentSummary } from "@/lib/calculator";
import { cn } from "@/lib/utils";
import type { AmortizationRow, YearlyRepaymentRow } from "@/types/loan";

type AmortizationTableProps = {
  rows?: AmortizationRow[] | null;
};

type ViewMode = "yearly" | "monthly";

type SummaryMetricProps = {
  label: string;
  value: string;
  helper: string;
};

function SummaryMetric({ label, value, helper }: SummaryMetricProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-surface/55 px-4 py-4">
      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold tracking-[-0.03em] text-foreground">
        {value}
      </p>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">{helper}</p>
    </div>
  );
}

function formatRepaymentTerm(totalMonths: number, totalYears: number) {
  if (totalMonths <= 0 || totalYears <= 0) {
    return "Not available";
  }

  const yearLabel = totalYears === 1 ? "year" : "years";
  const monthLabel = totalMonths === 1 ? "month" : "months";

  return `${totalYears} ${yearLabel} / ${totalMonths} ${monthLabel}`;
}

export default function AmortizationTable({
  rows,
}: AmortizationTableProps) {
  const safeRows = Array.isArray(rows) ? rows : [];
  const [viewMode, setViewMode] = useState<ViewMode>("yearly");
  const safeViewMode: ViewMode = viewMode === "monthly" ? "monthly" : "yearly";
  const yearlyRows = useMemo(() => {
    try {
      return buildYearlyRepaymentSummary(safeRows);
    } catch {
      return [];
    }
  }, [safeRows]);
  const totalMonths = safeRows.length;
  const totalYears = yearlyRows.length > 0 ? yearlyRows.length : Math.ceil(totalMonths / 12);
  const monthlyInstalment = safeRows[0]?.payment ?? 0;
  const totalInterest = safeRows.reduce(
    (sum, row) => sum + (Number.isFinite(row.interestPaid) ? row.interestPaid : 0),
    0,
  );
  const endingBalance = safeRows[safeRows.length - 1]?.remainingBalance ?? 0;
  const resolvedViewMode: ViewMode =
    safeViewMode === "yearly" && yearlyRows.length > 0 ? "yearly" : "monthly";
  const displayedRows: Array<AmortizationRow | YearlyRepaymentRow> =
    resolvedViewMode === "monthly" ? safeRows : yearlyRows;

  return (
    <Card className="overflow-hidden p-0">
      {safeRows.length === 0 ? (
        <div className="px-5 py-5 sm:px-6">
          <div className="border-b border-border/70 pb-5">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Repayment breakdown
            </p>
            <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-foreground">
              Amortisation schedule
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              Simplified flat-rate repayment view for the MVP. A yearly summary
              is shown first, with the full monthly schedule available when you
              need the detail.
            </p>
          </div>

          <div className="py-12 text-center">
            <p className="text-sm font-medium text-foreground">
              Repayment schedule will appear here once the loan inputs produce a
              financed balance.
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Select a car and adjust the financing details to generate the
              monthly breakdown safely.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="border-b border-border/70 px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Repayment breakdown
                </p>
                <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-foreground">
                  Amortisation schedule
                </h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  Simplified flat-rate repayment view for the MVP. Start with
                  the yearly summary, or switch to the monthly schedule when you
                  want the full payment-by-payment detail.
                </p>
              </div>

              <div className="inline-flex rounded-2xl border border-border/70 bg-surface/70 p-1">
                {[
                  { label: "Yearly summary", value: "yearly" },
                  { label: "Monthly schedule", value: "monthly" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setViewMode(option.value === "monthly" ? "monthly" : "yearly")
                    }
                    className={cn(
                      "rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-200",
                      safeViewMode === option.value
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-3 border-b border-border/70 px-5 py-5 sm:grid-cols-2 xl:grid-cols-4 sm:px-6">
            <SummaryMetric
              label="Repayment term"
              value={formatRepaymentTerm(totalMonths, totalYears)}
              helper="Based on the selected tenure and flat-rate breakdown."
            />
            <SummaryMetric
              label="Monthly instalment"
              value={formatCurrencyMYR(monthlyInstalment)}
              helper="Current monthly payment estimate from the selected inputs."
            />
            <SummaryMetric
              label="Total interest"
              value={formatCurrencyMYR(totalInterest)}
              helper="Total profit or interest across the full repayment term."
            />
            <SummaryMetric
              label="End of term"
              value={formatCurrencyMYR(endingBalance)}
              helper={
                endingBalance <= 0
                  ? "Paid off by the end of the selected term."
                  : "Remaining balance at the end of the displayed schedule."
              }
            />
          </div>

          <div className="max-h-[34rem] overflow-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                <tr>
                  <th className="sticky top-0 bg-surface/95 px-5 py-4 font-medium backdrop-blur-sm sm:px-6">
                    {resolvedViewMode === "monthly" ? "Month" : "Year"}
                  </th>
                  <th className="sticky top-0 bg-surface/95 px-5 py-4 font-medium backdrop-blur-sm sm:px-6">
                    Payment
                  </th>
                  <th className="sticky top-0 bg-surface/95 px-5 py-4 font-medium backdrop-blur-sm sm:px-6">
                    Principal
                  </th>
                  <th className="sticky top-0 bg-surface/95 px-5 py-4 font-medium backdrop-blur-sm sm:px-6">
                    Interest
                  </th>
                  <th className="sticky top-0 bg-surface/95 px-5 py-4 font-medium backdrop-blur-sm sm:px-6">
                    Remaining balance
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayedRows.map((row, index) => {
                  const isMonthlyRow = resolvedViewMode === "monthly";
                  const periodLabel = isMonthlyRow
                    ? `Month ${(row as AmortizationRow).month}`
                    : (row as YearlyRepaymentRow).yearLabel;
                  const periodHelper = isMonthlyRow
                    ? `Year ${(row as AmortizationRow).year}`
                    : "Year-end snapshot";
                  const payment = isMonthlyRow
                    ? (row as AmortizationRow).payment
                    : (row as YearlyRepaymentRow).totalPayment;
                  const principalPaid = isMonthlyRow
                    ? (row as AmortizationRow).principalPaid
                    : (row as YearlyRepaymentRow).totalPrincipalPaid;
                  const interestPaid = isMonthlyRow
                    ? (row as AmortizationRow).interestPaid
                    : (row as YearlyRepaymentRow).totalInterestPaid;
                  const remainingBalance = Number.isFinite(row.remainingBalance)
                    ? row.remainingBalance
                    : 0;

                  return (
                    <tr
                      key={
                        isMonthlyRow
                          ? `month-${(row as AmortizationRow).month}`
                          : `year-${(row as YearlyRepaymentRow).year}`
                      }
                      className={cn(
                        "border-t border-border/60 transition-colors duration-200 hover:bg-surface/50",
                        index % 2 === 1 && "bg-surface/28",
                      )}
                    >
                      <td className="whitespace-nowrap px-5 py-4 text-foreground sm:px-6">
                        {periodLabel}
                        <span className="ml-2 text-xs text-muted-foreground">
                          {periodHelper}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-foreground sm:px-6">
                        {formatCurrencyMYR(payment)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-muted-foreground sm:px-6">
                        {formatCurrencyMYR(principalPaid)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-muted-foreground sm:px-6">
                        {formatCurrencyMYR(interestPaid)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-muted-foreground sm:px-6">
                        {formatCurrencyMYR(remainingBalance)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Card>
  );
}
